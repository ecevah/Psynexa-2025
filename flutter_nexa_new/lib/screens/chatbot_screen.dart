import 'dart:async';
import 'dart:io';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:just_audio/just_audio.dart';
import 'package:provider/provider.dart';
import 'package:flutter_nexa/providers/user_provider.dart';
import 'package:flutter_nexa/services/chatbot_service.dart';
import 'package:flutter_nexa/widgets/chatbot/chat_message.dart';
import 'package:flutter_nexa/widgets/chatbot/chat_message_bubble.dart';
import 'package:flutter_nexa/widgets/chatbot/chat_input_field.dart';
import 'package:flutter_nexa/widgets/chatbot/image_preview.dart';
import 'package:flutter_nexa/widgets/chatbot/typing_indicator.dart';
import 'package:flutter_nexa/widgets/chatbot/voice_recording_panel.dart';
import 'package:flutter_svg/flutter_svg.dart';

class ChatbotScreen extends StatefulWidget {
  const ChatbotScreen({Key? key}) : super(key: key);

  @override
  State<ChatbotScreen> createState() => _ChatbotScreenState();
}

class _ChatbotScreenState extends State<ChatbotScreen>
    with SingleTickerProviderStateMixin {
  final TextEditingController _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<ChatMessage> _messages = [];

  String get _clientId =>
      Provider.of<UserProvider>(context, listen: false).user?.id.toString() ??
      '45';
  String get _clientName =>
      Provider.of<UserProvider>(context, listen: false).user?.username ??
      'User';

  bool _isTyping = false;
  bool _isWebSearchEnabled = false;
  bool _isCameraEnabled = false;
  bool _isRecording = false;
  bool _isFullScreenVoiceMode = false;

  // Gerçek ses kaydı mı yapıldı yoksa iptal mi edildi kontrolü için bayrak
  bool _isCanceledRecording = false;

  // Animation for voice recording
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  final ImagePicker _picker = ImagePicker();
  File? _imageFile;

  final AudioPlayer _audioPlayer = AudioPlayer();

  @override
  void initState() {
    super.initState();
    _setupAnimations();
  }

  void _setupAnimations() {
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );

    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.3).animate(
      CurvedAnimation(
        parent: _pulseController,
        curve: Curves.easeInOut,
      ),
    );

    _pulseController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        _pulseController.reverse();
      } else if (status == AnimationStatus.dismissed) {
        _pulseController.forward();
      }
    });
  }

  @override
  void dispose() {
    _textController.dispose();
    _scrollController.dispose();
    _audioPlayer.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  // Ses panelini aç/kapat
  Future<void> _toggleVoiceMode() async {
    // Eğer şu anda panel kapalıysa, aç
    if (!_isFullScreenVoiceMode) {
      setState(() {
        _isFullScreenVoiceMode = true;
        _isCanceledRecording = false; // İptal bayrağını sıfırla
      });
      _startRecording();
    }
    // Eğer panel açıksa ve kayıt yapılıyorsa, kaydı durdur ama paneli kapatma
    else if (_isRecording) {
      await _stopRecording();
    }
    // Eğer panel açıksa ve kayıt yapılmıyorsa, paneli kapat
    else {
      setState(() {
        _isFullScreenVoiceMode = false;
      });
    }
  }

  // Simulate voice detection
  Future<void> _simulateVoiceDetection() async {
    if (!_isRecording) return;

    // Simulate user speaking for 3-8 seconds
    final randomDuration = Duration(seconds: 3 + Random().nextInt(5));
    await Future.delayed(randomDuration);

    // If still recording and in full screen mode
    if (_isRecording && _isFullScreenVoiceMode && mounted) {
      await _captureLastFrameAndSendRequest();
    }
  }

  // Capture camera frame and send request
  Future<void> _captureLastFrameAndSendRequest() async {
    if (_isCameraEnabled && _isFullScreenVoiceMode) {
      try {
        final XFile? photo =
            await _picker.pickImage(source: ImageSource.camera);
        if (photo != null) {
          setState(() {
            _imageFile = File(photo.path);
          });
        }
      } catch (e) {
        debugPrint("Camera capture error: $e");
      }
    }

    await _stopRecording();
  }

  Future<void> _takePicture() async {
    try {
      // Show a dialog to choose between camera and gallery
      showModalBottomSheet(
        context: context,
        backgroundColor: Colors.white,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        builder: (context) => Padding(
          padding: const EdgeInsets.symmetric(vertical: 20.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Fotoğraf seçin',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  // Camera option
                  InkWell(
                    onTap: () {
                      Navigator.pop(context);
                      _takePhotoFromCamera();
                    },
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        CircleAvatar(
                          radius: 30,
                          backgroundColor: Colors.blue,
                          child: Icon(
                            Icons.camera_alt,
                            size: 30,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(height: 10),
                        Text('Kamera'),
                      ],
                    ),
                  ),

                  // Gallery option
                  InkWell(
                    onTap: () {
                      Navigator.pop(context);
                      _pickFromGallery();
                    },
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        CircleAvatar(
                          radius: 30,
                          backgroundColor: Colors.green,
                          child: Icon(
                            Icons.photo_library,
                            size: 30,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(height: 10),
                        Text('Galeri'),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      );
    } catch (e) {
      _showErrorMessage('Bir hata oluştu: $e');
      debugPrint("Photo picker error: $e");
    }
  }

  // Take a photo using the camera
  Future<void> _takePhotoFromCamera() async {
    try {
      final XFile? photo = await _picker.pickImage(source: ImageSource.camera);

      if (photo != null) {
        setState(() {
          _imageFile = File(photo.path);
          _isCameraEnabled = true;
        });
      }
    } catch (e) {
      debugPrint("Camera error: $e");
    }
  }

  // Pick an image from the gallery
  Future<void> _pickFromGallery() async {
    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 80, // Adjust quality to reduce file size
      );

      if (image != null) {
        setState(() {
          _imageFile = File(image.path);
          _isCameraEnabled = true;
        });
      }
    } catch (e) {
      debugPrint("Gallery error: $e");
    }
  }

  Future<void> _startRecording() async {
    try {
      setState(() {
        _isRecording = true;
      });

      // Start animation
      _pulseController.forward();

      if (!_isFullScreenVoiceMode) {
        // Bildirimi kaldır
      } else {
        // Start automatic voice detection in full screen mode
        _simulateVoiceDetection();
      }
    } catch (e) {
      setState(() {
        _isRecording = false;
      });
      // Hata bildirimini kaldır
    }
  }

  Future<void> _stopRecording() async {
    if (!_isRecording) return;

    setState(() {
      _isRecording = false;
      // Paneli sadece iptal durumunda kapat, normal kaydı durdurma işleminde açık kalsın
      if (_isCanceledRecording) {
        _isFullScreenVoiceMode = false;
      }
    });

    // Stop animation
    _pulseController.stop();
    _pulseController.reset();

    // Eğer kayıt iptal edildiyse (X butonu ile çıkıldıysa), mesaj gönderme
    if (_isCanceledRecording) {
      debugPrint("Ses kaydı iptal edildi, mesaj gönderilmiyor.");
      return;
    }

    try {
      _addMessage(
        isUser: true,
        text: '🎤 Sesli mesaj',
      );

      // Sample base64 WAV silence (1 second)
      String audioBase64 = "";
      // Convert to API request
      var response = await ChatbotService.sendAudioMessage(
        audioBase64: audioBase64,
        clientId: _clientId,
        clientName: _clientName,
      );

      _handleApiResponse(response);
    } catch (e) {
      // Hata bildirimini kaldır
      debugPrint('Ses mesajı gönderilirken bir hata oluştu: $e');
    }
  }

  Future<void> _sendTextMessage(String text) async {
    if (text.trim().isEmpty) return;

    setState(() {
      _isTyping = true;
    });

    try {
      // Add user message to chat
      _addMessage(
        isUser: true,
        text: text,
      );

      // Clear text field
      _textController.clear();

      // Send message via service
      var response = await ChatbotService.sendTextMessage(
        message: text,
        clientId: _clientId,
        clientName: _clientName,
        webSearch: _isWebSearchEnabled,
      );

      _handleApiResponse(response);
    } catch (e) {
      _showErrorMessage('Mesaj gönderilirken bir hata oluştu: $e');
      _addMessage(
        isUser: false,
        text:
            "Üzgünüm, teknik bir sorun yaşadım. Lütfen daha sonra tekrar deneyin.",
      );
    } finally {
      setState(() {
        _isTyping = false;
      });
      _scrollToBottom();
    }
  }

  Future<void> _sendImageMessage() async {
    if (_imageFile == null) return;

    setState(() {
      _isTyping = true;
    });

    try {
      // Store a copy of the image file and its path before clearing
      final File imageFileCopy = File(_imageFile!.path);
      final String imagePath = _imageFile!.path;
      final String message = _textController.text;

      // Add user message to chat
      _addMessage(
        isUser: true,
        text: message.isEmpty ? "📷 Image sent" : message,
        imagePath: imagePath,
        hasImage: true,
      );

      // Clear text field and image BEFORE sending API request
      _textController.clear();

      // Clear the image immediately after adding it to the chat
      setState(() {
        _imageFile = null;
        _isCameraEnabled = false;
      });

      // Send image message via service using the saved copy
      var response = await ChatbotService.sendImageMessage(
        imageFile: imageFileCopy,
        message: message,
        clientId: _clientId,
        clientName: _clientName,
      );

      _handleApiResponse(response);
    } catch (e) {
      _showErrorMessage('Image sending error: $e');
      _addMessage(
        isUser: false,
        text:
            "I'm sorry, I had a problem with the image. Please try again later.",
      );
    } finally {
      setState(() {
        _isTyping = false;
      });
      _scrollToBottom();
    }
  }

  void _handleApiResponse(Map<String, dynamic> response) {
    try {
      if (response['status'] == true && response['data'] != null) {
        final botResponse = response['data']['Response'] ??
            "I'm sorry, I can't answer your message right now.";

        // Add bot response to chat
        _addMessage(
          isUser: false,
          text: botResponse,
        );

        // Check if camera request is in the response
        if (response['camera'] == true) {
          setState(() {
            _isCameraEnabled = true;
          });
          _showCameraNotification();
        }
      } else {
        final message = response['message'] ?? 'Bilinmeyen API hatası';
        _showErrorMessage('API yanıtında hata: $message');
        _addMessage(
          isUser: false,
          text:
              "I'm sorry, I had a problem with your message. Please try again later.",
        );
      }
    } catch (e) {
      _showErrorMessage('API yanıtı işlenirken bir hata oluştu: $e');
      _addMessage(
        isUser: false,
        text:
            "I'm sorry, I had a problem. Our technical team is working on this issue.",
      );
    }
  }

  // VoiceRecordingPanel'den gelen ses verilerini işle
  void _handleAudioData(
      String audioBase64, String? responseAudioBase64, String? responseText) {
    // Kullanıcının ses mesajını sohbet geçmişine ekle
    _addMessage(
      isUser: true,
      text: '🎤 Voice message',
      hasAudio: true,
      audioBase64: audioBase64,
    );

    // Eğer API'den yanıt ses varsa ve metin yanıtı da varsa, bot yanıtını ekle
    if (responseText != null && responseText.isNotEmpty) {
      _addMessage(
        isUser: false,
        text: responseText,
        hasAudio: responseAudioBase64 != null && responseAudioBase64.isNotEmpty,
        audioBase64: responseAudioBase64,
      );
    }
  }

  void _addMessage({
    required bool isUser,
    required String text,
    String? imagePath,
    String? audioUrl,
    String? audioBase64,
    bool hasImage = false,
    bool hasAudio = false,
  }) {
    setState(() {
      _messages.add(
        ChatMessage(
          text: text,
          isUser: isUser,
          imagePath: imagePath,
          audioUrl: audioUrl,
          audioBase64: audioBase64,
          hasImage: hasImage,
          hasAudio: hasAudio,
        ),
      );
    });
    _scrollToBottom();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _showErrorMessage(String message) {
    // Bildirimleri tamamen kaldır
    debugPrint("Hata: $message");
  }

  void _showCameraNotification() {
    // Kamera bildirimini kaldır
    debugPrint("Assistant recommends you to open the camera.");
  }

  // VoiceRecordingPanel'den çağrılan onStop
  Future<void> _stopRecordingFromPanel() async {
    // X butonu ile çıkılırsa iptal olarak işaretle
    _isCanceledRecording = true;
    await _stopRecording();
    // Panel X butonu ile kapatıldığında garanti olarak paneli kapat
    setState(() {
      _isFullScreenVoiceMode = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text(
          "NexaBot",
          style: TextStyle(
            color: Color(0xFF0B1215),
            fontFamily: 'Urbanist',
            fontSize: 18,
            fontWeight: FontWeight.w600,
            height: 1.2, // 120% line height
          ),
        ),
        elevation: 0,
        backgroundColor: const Color(0xFFFAFAFA),
      ),
      body: Stack(
        children: [
          Container(
            color: const Color(0xFFFAFAFA),
            child: Column(
              children: [
                // Messages
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: _messages.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                SvgPicture.asset(
                                  'assets/svg/nexabot-logo-blue.svg',
                                  width: 120,
                                  height: 66,
                                ),
                                const SizedBox(height: 10),
                                const Text(
                                  'How may I help you today?',
                                  style: TextStyle(
                                    color: Color(0xFF000000),
                                    fontFamily: 'Urbanist',
                                    fontSize: 17,
                                    fontWeight: FontWeight.w500,
                                    height: 18 / 17, // 105.882%
                                    leadingDistribution:
                                        TextLeadingDistribution.even,
                                  ),
                                ),
                              ],
                            ),
                          )
                        : ListView.builder(
                            controller: _scrollController,
                            itemCount: _messages.length,
                            itemBuilder: (context, index) {
                              return ChatMessageBubble(
                                message: _messages[index],
                                audioPlayer: _audioPlayer,
                              );
                            },
                          ),
                  ),
                ),

                // Image preview
                ImagePreview(
                  imageFile: _imageFile,
                  onClear: () {
                    setState(() {
                      _imageFile = null;
                      _isCameraEnabled = false;
                    });
                  },
                ),

                // Typing indicator
                TypingIndicator(isTyping: _isTyping),

                // Chat input field
                ChatInputField(
                  textController: _textController,
                  imageFile: _imageFile,
                  isCameraEnabled: _isCameraEnabled,
                  isWebSearchEnabled: _isWebSearchEnabled,
                  onCameraPressed: _takePicture,
                  onMicrophonePressed: _toggleVoiceMode,
                  onSendText: _sendTextMessage,
                  onSendImage: _sendImageMessage,
                  onWebSearchToggle: () {
                    setState(() {
                      _isWebSearchEnabled = !_isWebSearchEnabled;
                    });
                    // Bildirimi kaldır
                  },
                ),
              ],
            ),
          ),

          // Full screen voice recording panel - sadece _isFullScreenVoiceMode true olduğunda göster
          if (_isFullScreenVoiceMode)
            VoiceRecordingPanel(
              isRecording: _isFullScreenVoiceMode,
              pulseAnimation: _pulseAnimation,
              onStop:
                  _stopRecordingFromPanel, // X butonuna basma durumunu ele almak için
              onAudioReady: _handleAudioData, // Ses verisi callback'i
            ),
        ],
      ),
    );
  }
}
