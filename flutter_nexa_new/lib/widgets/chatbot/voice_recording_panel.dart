import 'package:flutter/material.dart';
import 'package:flutter_nexa/utils/app_colors.dart';
import 'dart:math';
import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:just_audio/just_audio.dart';
import 'package:flutter_nexa/services/chatbot_service.dart';
import 'package:flutter_nexa/providers/user_provider.dart';
import 'package:provider/provider.dart';
import 'package:record/record.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:camera/camera.dart';

// Thinking yazısının noktalarını animasyonlu gösteren widget
class ThinkingAnimation extends StatefulWidget {
  const ThinkingAnimation({Key? key}) : super(key: key);

  @override
  State<ThinkingAnimation> createState() => _ThinkingAnimationState();
}

class _ThinkingAnimationState extends State<ThinkingAnimation> {
  int _dotsCount = 0;
  late Timer _timer;

  @override
  void initState() {
    super.initState();
    _startAnimation();
  }

  void _startAnimation() {
    _timer = Timer.periodic(const Duration(milliseconds: 500), (timer) {
      setState(() {
        _dotsCount = (_dotsCount + 1) % 4; // 0, 1, 2, 3 döngüsü
      });
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    String dots = '';
    for (int i = 0; i < _dotsCount; i++) {
      dots += '.';
    }

    return Text(
      'Thinking$dots',
      style: const TextStyle(
        color: Colors.black,
        fontSize: 24,
        fontWeight: FontWeight.bold,
      ),
    );
  }
}

class VoiceRecordingPanel extends StatefulWidget {
  final bool isRecording;
  final Animation<double> pulseAnimation;
  final VoidCallback onStop;
  final Function(String audioBase64, String? responseAudioBase64,
      String? responseText)? onAudioReady;

  const VoiceRecordingPanel({
    Key? key,
    required this.isRecording,
    required this.pulseAnimation,
    required this.onStop,
    this.onAudioReady,
  }) : super(key: key);

  @override
  State<VoiceRecordingPanel> createState() => _VoiceRecordingPanelState();
}

class _VoiceRecordingPanelState extends State<VoiceRecordingPanel> {
  bool _isCameraActive = false;
  bool _isActivelyRecording = false; // Aktif olarak konuşuluyor mu?
  bool _isListening = false; // Sesli cevap dinleniyor mu?
  bool _isLoading = false; // API yanıt bekliyor mu?

  // Kamera değişkenleri
  List<CameraDescription>? _cameras;
  CameraController? _cameraController;
  File? _capturedImage;
  String? _capturedImageBase64;

  // Ses kaydı için değişkenler
  late final AudioRecorder _audioRecorder;
  String? _recordedFilePath;
  String? _recordedAudioBase64;

  // Ses çalma için değişkenler
  final AudioPlayer _audioPlayer = AudioPlayer();
  String? _currentAudioResponse;

  Timer? _inactivityTimer;

  // Kamera kutusu için pozisyon değişkenleri
  double _cameraX = 20;
  double _cameraY = 80;

  // Yüz simülasyonu için değişkenler
  double _eyeMovementX = 0;
  double _eyeMovementY = 0;
  Timer? _animationTimer;

  @override
  void initState() {
    super.initState();
    _audioRecorder = AudioRecorder();
    _initAudioPlayer();
    _requestPermissions();
    _initializeCamera();
  }

  @override
  void dispose() {
    _animationTimer?.cancel();
    _inactivityTimer?.cancel();
    _audioRecorder.dispose();
    _audioPlayer.dispose();
    _cameraController?.dispose();
    super.dispose();
  }

  // Kamerayı hazırla
  Future<void> _initializeCamera() async {
    try {
      _cameras = await availableCameras();
      // İlk başta kamerayı başlatma (performans için)
    } catch (e) {
      print('Kamera başlatma hatası: $e');
    }
  }

  // Kamera kontrolcüsünü başlat
  Future<void> _startCamera() async {
    if (_cameras == null || _cameras!.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Kamera bulunamadı')),
      );
      return;
    }

    try {
      // Ön kamerayı bul
      CameraDescription frontCamera = _cameras!.firstWhere(
        (camera) => camera.lensDirection == CameraLensDirection.front,
        orElse: () => _cameras!.first,
      );

      // Kontrolcüyü başlat
      _cameraController = CameraController(
        frontCamera,
        ResolutionPreset.medium,
        enableAudio: false,
        imageFormatGroup: ImageFormatGroup.jpeg,
      );

      await _cameraController!.initialize();

      if (mounted) {
        setState(() {});
      }
    } catch (e) {
      print('Kamera başlatma hatası: $e');
    }
  }

  // Kamerayı durdur
  Future<void> _stopCamera() async {
    await _cameraController?.dispose();
    _cameraController = null;
  }

  // Fotoğraf çek
  Future<bool> _takePicture() async {
    if (_cameraController == null || !_cameraController!.value.isInitialized) {
      print('Kamera hazır değil');
      return false;
    }

    try {
      // Fotoğraf çek
      final XFile photo = await _cameraController!.takePicture();

      // Dosyayı kaydet
      _capturedImage = File(photo.path);

      // Base64'e dönüştür
      List<int> imageBytes = await _capturedImage!.readAsBytes();
      _capturedImageBase64 = base64Encode(imageBytes);

      print(
          'Fotoğraf çekildi ve base64\'e dönüştürüldü: ${_capturedImageBase64!.substring(0, 50)}...');

      return true;
    } catch (e) {
      print('Fotoğraf çekme hatası: $e');
      return false;
    }
  }

  // İzinleri iste
  Future<void> _requestPermissions() async {
    final micStatus = await Permission.microphone.request();
    if (micStatus != PermissionStatus.granted) {
      print('Mikrofon izni reddedildi');
    }

    if (_isCameraActive) {
      final cameraStatus = await Permission.camera.request();
      if (cameraStatus != PermissionStatus.granted) {
        print('Kamera izni reddedildi');
        setState(() {
          _isCameraActive = false;
        });
      }
    }
  }

  // Ses çalıcıyı başlat
  void _initAudioPlayer() {
    _audioPlayer.playerStateStream.listen((state) {
      if (state.processingState == ProcessingState.completed) {
        // Ses çalma tamamlandığında dinleme modunu kapat
        if (mounted) {
          setState(() {
            _isListening = false;
            _currentAudioResponse =
                null; // Ses bir kez çalındıktan sonra tekrar dinlenmeyi engelle
          });
        }
      }
    });
  }

  // Kamera görüntüsünü aç/kapat
  void _toggleCamera() async {
    final newState = !_isCameraActive;

    if (newState) {
      // Kamera açılıyor, izin iste
      final cameraStatus = await Permission.camera.request();
      if (cameraStatus != PermissionStatus.granted) {
        // SnackBar yerine sadece loglama yap
        print('Kamera izni reddedildi');
        return;
      }

      // Kamerayı başlat
      await _startCamera();
    } else {
      // Kamerayı kapat
      await _stopCamera();
      _capturedImage = null;
      _capturedImageBase64 = null;
    }

    setState(() {
      _isCameraActive = newState;

      if (_isCameraActive) {
        // Kamera açıldığında göz hareketlerini başlat
        _startEyeMovement();
      } else {
        // Kamera kapatıldığında göz hareketlerini durdur
        _animationTimer?.cancel();
      }
    });
  }

  // Konuşma/dinleme durumunu değiştir
  void _toggleSpeaking() async {
    // Eğer yükleme durumundaysa hiçbir şey yapma
    if (_isLoading) return;

    // 1. Eğer aktif konuşma varsa: konuşmayı durdur ve API isteği gönder
    if (_isActivelyRecording) {
      await _stopRecording();
      return;
    }

    // 2. Eğer ses dinliyorsak: işlem yapma, dinleme tamamlanana kadar bekle
    if (_isListening) {
      return;
    }

    // 3. Ne konuşma ne dinleme varsa: konuşmaya başla
    await _startRecording();
  }

  // Ses kaydını başlat
  Future<void> _startRecording() async {
    try {
      // Mikrofon iznini kontrol et
      if (!await Permission.microphone.isGranted) {
        // SnackBar yerine loglama
        print('Mikrofon izni reddedildi');
        return;
      }

      // Kayıt dosyası için dizin oluştur
      final Directory appDocDir = await getApplicationDocumentsDirectory();
      final String recordingPath = '${appDocDir.path}/voice_recording.m4a';

      // Kaydediciyi yapılandır (AAC formatı daha iyi uyumluluk için)
      await _audioRecorder.start(
        const RecordConfig(
          encoder: AudioEncoder.aacLc,
          bitRate: 128000,
          sampleRate: 44100,
        ),
        path: recordingPath,
      );

      setState(() {
        _isActivelyRecording = true;
        _recordedFilePath = recordingPath;
      });

      // İnaktivite zamanlayıcısını başlat
      _startInactivityTimer();
    } catch (e) {
      print("Ses kaydı başlatılamadı: $e");
      // SnackBar'ı kaldır
    }
  }

  // Ses kaydını durdur
  Future<void> _stopRecording() async {
    try {
      // Eğer kamera aktifse ve ses kaydı yapılıyorsa fotoğraf çek
      if (_isCameraActive && _cameraController != null) {
        await _takePicture();
      }

      // Kaydı durdur
      final path = await _audioRecorder.stop();

      setState(() {
        _isActivelyRecording = false;
      });

      _inactivityTimer?.cancel();

      if (path != null) {
        await _sendRecordingToAPI(path);
      }
    } catch (e) {
      print("Ses kaydı durdurulamadı: $e");
      setState(() {
        _isActivelyRecording = false;
      });
    }
  }

  // Kaydı API'ye gönder
  Future<void> _sendRecordingToAPI(String filePath) async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Dosyayı oku ve base64'e dönüştür
      final File audioFile = File(filePath);
      final bytes = await audioFile.readAsBytes();
      final audioBase64 = base64Encode(bytes);

      // Ses kaydını sakla
      _recordedAudioBase64 = audioBase64;

      // Kullanıcı bilgilerini al
      final userProvider = Provider.of<UserProvider>(context, listen: false);
      final clientId = userProvider.user?.id.toString() ?? '45';
      final clientName = userProvider.user?.username ?? 'User';

      // API isteği gönder
      final Map<String, dynamic> requestParams = {
        'clientId': clientId,
        'clientName': clientName,
        'audioBase64': audioBase64,
      };

      // Eğer fotoğraf çekildiyse, onu da ekle
      if (_capturedImageBase64 != null && _capturedImageBase64!.isNotEmpty) {
        requestParams['image_base64'] = _capturedImageBase64;
      }

      final response = await ChatbotService.sendAudioMessage(
        clientId: clientId,
        clientName: clientName,
        audioBase64: audioBase64,
        imageFile: _capturedImage,
      );

      String? responseText;
      if (response['status'] == true) {
        // Ses yanıtını çal
        final audioResponse = response['response_audio_base64'];
        if (audioResponse != null && audioResponse.isNotEmpty) {
          _currentAudioResponse = audioResponse;
          await _playResponseAudio(audioResponse);
        }

        // Text yanıtını işle
        responseText = response['data']?['Response'];
        if (responseText != null && responseText.isNotEmpty) {
          print("AI yanıtı: $responseText");
        }

        // Kaydedilen sesli mesajı ve yanıtı üst widget'a ilet
        if (widget.onAudioReady != null && _recordedAudioBase64 != null) {
          widget.onAudioReady!(
              _recordedAudioBase64!, _currentAudioResponse, responseText);
        }
      } else {
        // SnackBar'ı loglama ile değiştir
        print('API yanıt hatası: ${response['message'] ?? 'Bilinmeyen hata'}');
      }
    } catch (e) {
      print("API isteği hatası: $e");
      // SnackBar'ı kaldır
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  // Ses yanıtını çal
  Future<void> _playResponseAudio(String base64Audio) async {
    try {
      // Base64'ü byte'lara dönüştür
      final bytes = base64Decode(base64Audio);

      setState(() {
        _isListening = true;
      });

      // Base64 sesi doğrudan hafızada çalmak için
      await _audioPlayer.setAudioSource(
        MyCustomSource(bytes),
      );

      // Ses çalınması bittiğinde _isListening'i false yap
      _audioPlayer.playerStateStream.listen((state) {
        if (state.processingState == ProcessingState.completed && mounted) {
          setState(() {
            _isListening = false;
          });
        }
      });

      await _audioPlayer.play();
    } catch (e) {
      print("Ses çalma hatası: $e");
      setState(() {
        _isListening = false;
      });
    }
  }

  // Kullanıcı hareketsizlik zamanlayıcısı
  void _startInactivityTimer() {
    _inactivityTimer?.cancel();

    // 5 saniye hareketsizlik sonrası konuşma otomatik olarak durdurulur
    _inactivityTimer = Timer(const Duration(seconds: 5), () {
      if (_isActivelyRecording && mounted) {
        _stopRecording();
      }
    });
  }

  // X butonuna basıldığında sadece chat'e dönmek için
  void _goBackToChat() {
    // Aktif kaydı ve dinlemeyi durdur
    if (_isActivelyRecording) {
      _audioRecorder.stop();
    }

    if (_isListening) {
      _audioPlayer.stop();
    }

    if (_animationTimer != null) {
      _animationTimer!.cancel();
    }

    if (_inactivityTimer != null) {
      _inactivityTimer!.cancel();
    }

    // Kamerayı kapat
    _stopCamera();

    // Tüm durumları temizle
    setState(() {
      _isActivelyRecording = false;
      _isListening = false;
      _isLoading = false;
      _isCameraActive = false;
    });

    // Chat ekranına geri dön, widget.onStop() ile ana ekranda kaydı iptal olarak işaretle
    widget.onStop();
  }

  // Rastgele göz hareketleri için animasyon
  void _startEyeMovement() {
    _animationTimer?.cancel();

    _animationTimer = Timer.periodic(const Duration(seconds: 2), (timer) {
      if (mounted) {
        setState(() {
          // Gözler için rastgele hareket
          _eyeMovementX = (Random().nextDouble() * 6) - 3; // -3 ile 3 arası
          _eyeMovementY = (Random().nextDouble() * 4) - 2; // -2 ile 2 arası
        });
      }
    });

    // İlk hareket
    setState(() {
      _eyeMovementX = (Random().nextDouble() * 6) - 3;
      _eyeMovementY = (Random().nextDouble() * 4) - 2;
    });
  }

  @override
  Widget build(BuildContext context) {
    // Widget görünürlüğü kontrolü artık dışarıda yapılıyor (if koşulu ile)
    return Container(
      color: Colors.white,
      width: double.infinity,
      height: double.infinity,
      child: Stack(
        children: [
          // Ana içerik
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Durum metni
                _isLoading
                    ? const ThinkingAnimation()
                    : Text(
                        _isActivelyRecording
                            ? 'Listening...'
                            : _isListening
                                ? ''
                                : '',
                        style: const TextStyle(
                          color: Colors.black,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),

                const SizedBox(height: 32),

                // Durum simgesi:
                // 1. Aktif kayıt sırasında: sabit mavi daireli mikrofon simgesi
                // 2. Bot konuşurken: hareketli mavi daireli N logosu
                // 3. Bekleme durumunda: sabit N logosu

                GestureDetector(
                  onTap: _toggleSpeaking,
                  child: _isActivelyRecording
                      // 1. Aktif kayıt sırasında
                      ? Container(
                          width: 120,
                          height: 120,
                          decoration: BoxDecoration(
                            color: AppColors.primaryColor.withAlpha(75),
                            shape: BoxShape.circle,
                          ),
                          child: Center(
                            child: Container(
                              width: 80,
                              height: 80,
                              decoration: const BoxDecoration(
                                color: AppColors.primaryColor,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.mic,
                                color: Colors.white,
                                size: 40,
                              ),
                            ),
                          ),
                        )
                      : _isListening
                          // 2. Bot konuşurken
                          ? AnimatedBuilder(
                              animation: widget.pulseAnimation,
                              builder: (context, child) {
                                return Transform.scale(
                                  scale: widget.pulseAnimation.value,
                                  child: Container(
                                    width: 120,
                                    height: 120,
                                    decoration: BoxDecoration(
                                      color:
                                          AppColors.primaryColor.withAlpha(75),
                                      shape: BoxShape.circle,
                                    ),
                                    child: Center(
                                      child: Container(
                                        width: 80,
                                        height: 80,
                                        decoration: const BoxDecoration(
                                          color: AppColors.primaryColor,
                                          shape: BoxShape.circle,
                                        ),
                                        child: Padding(
                                          padding: const EdgeInsets.all(12.0),
                                          child: SvgPicture.asset(
                                            'assets/svg/n-logo-white.svg',
                                            width: 56,
                                            height: 56,
                                            colorFilter: const ColorFilter.mode(
                                              Colors.white,
                                              BlendMode.srcIn,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                );
                              },
                            )
                          // 3. Bekleme durumunda
                          : Container(
                              width: 120,
                              height: 120,
                              decoration: BoxDecoration(
                                color: AppColors.primaryColor.withAlpha(75),
                                shape: BoxShape.circle,
                              ),
                              child: Center(
                                child: Container(
                                  width: 80,
                                  height: 80,
                                  decoration: const BoxDecoration(
                                    color: AppColors.primaryColor,
                                    shape: BoxShape.circle,
                                  ),
                                  child: Padding(
                                    padding: const EdgeInsets.all(12.0),
                                    child: SvgPicture.asset(
                                      'assets/svg/n-logo-white.svg',
                                      width: 56,
                                      height: 56,
                                      colorFilter: const ColorFilter.mode(
                                        Colors.white,
                                        BlendMode.srcIn,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                ),

                const SizedBox(height: 20),

                // Alt yazı
                Text(
                  _isLoading
                      ? ''
                      : _isActivelyRecording
                          ? 'Recording...'
                          : _isListening
                              ? 'Nexa is talking...'
                              : 'Tap to talk',
                  style: const TextStyle(
                    color: Colors.black45,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),

          // Kamera kutusu (sürüklenebilir)
          if (_isCameraActive)
            Positioned(
              left: _cameraX,
              top: _cameraY,
              child: GestureDetector(
                onPanUpdate: (details) {
                  setState(() {
                    _cameraX += details.delta.dx;
                    _cameraY += details.delta.dy;

                    // Ekran sınırlarında kal
                    final screenWidth = MediaQuery.of(context).size.width;
                    final screenHeight = MediaQuery.of(context).size.height;

                    if (_cameraX < 0) _cameraX = 0;
                    if (_cameraY < 0) _cameraY = 0;
                    if (_cameraX > screenWidth - 160)
                      _cameraX = screenWidth - 160;
                    if (_cameraY > screenHeight - 210)
                      _cameraY = screenHeight - 210;
                  });
                },
                child: Container(
                  width: 160,
                  height: 210,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white, width: 2),
                    color: Colors.grey[800], // Kamera arka planı
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withAlpha(100),
                        blurRadius: 10,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: _cameraController != null &&
                            _cameraController!.value.isInitialized
                        ? CameraPreview(_cameraController!)
                        : _buildSimulatedFace(),
                  ),
                ),
              ),
            ),

          // Sağ alt köşedeki X butonu
          Positioned(
            bottom: 30,
            right: 30,
            child: Material(
              elevation: 4,
              color: AppColors.babyBlueColor,
              borderRadius: BorderRadius.circular(28),
              child: InkWell(
                onTap: _goBackToChat,
                borderRadius: BorderRadius.circular(28),
                child: Container(
                  width: 56,
                  height: 56,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.close,
                      color: Colors.black,
                      size: 30,
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Sol alt köşedeki kamera butonu
          Positioned(
            bottom: 30,
            left: 30,
            child: GestureDetector(
              onTap: _toggleCamera,
              child: Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: _isCameraActive
                      ? AppColors.primaryColor
                      : AppColors.babyBlueColor,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withAlpha(50),
                      blurRadius: 8,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Icon(
                  _isCameraActive ? Icons.videocam_off : Icons.camera_alt,
                  color: _isCameraActive ? Colors.white : Colors.black,
                  size: 30,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Simüle edilmiş yüz (kamera başlayana kadar gösterilir)
  Widget _buildSimulatedFace() {
    return Stack(
      children: [
        // Ön kamera simülasyonu için yüz çizimi
        Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Yüz
              Container(
                width: 100,
                height: 120,
                decoration: BoxDecoration(
                  color: Colors.pink[100],
                  borderRadius: BorderRadius.circular(50),
                ),
                child: Stack(
                  children: [
                    // Sol göz
                    Positioned(
                      top: 40,
                      left: 25 + _eyeMovementX,
                      child: Container(
                        width: 10,
                        height: 10,
                        decoration: BoxDecoration(
                          color: Colors.brown[900],
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),

                    // Sağ göz
                    Positioned(
                      top: 40,
                      right: 25 + _eyeMovementX,
                      child: Container(
                        width: 10,
                        height: 10,
                        decoration: BoxDecoration(
                          color: Colors.brown[900],
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),

                    // Ağız
                    Positioned(
                      bottom: 30,
                      left: 30,
                      right: 30,
                      child: Container(
                        height: 5,
                        decoration: BoxDecoration(
                          color: Colors.brown[900],
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// Base64 ses verisi için özel ses kaynağı
class MyCustomSource extends StreamAudioSource {
  final List<int> _bytes;

  MyCustomSource(this._bytes);

  @override
  Future<StreamAudioResponse> request([int? start, int? end]) async {
    start ??= 0;
    end ??= _bytes.length;
    return StreamAudioResponse(
      sourceLength: _bytes.length,
      contentLength: end - start,
      offset: start,
      stream: Stream.value(_bytes.sublist(start, end)),
      contentType: 'audio/*',
    );
  }
}
