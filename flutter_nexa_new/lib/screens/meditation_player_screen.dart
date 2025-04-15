import 'package:flutter/material.dart';
import 'package:flutter_nexa/models/api_models.dart';
import 'package:just_audio/just_audio.dart';
import 'package:audio_session/audio_session.dart';
import 'package:flutter_nexa/utils/cache_manager.dart';
import 'dart:io';

class MeditationPlayerScreen extends StatefulWidget {
  final MeditationModel meditation;

  const MeditationPlayerScreen({
    super.key,
    required this.meditation,
  });

  @override
  State<MeditationPlayerScreen> createState() => _MeditationPlayerScreenState();
}

class _MeditationPlayerScreenState extends State<MeditationPlayerScreen>
    with WidgetsBindingObserver {
  late AudioPlayer _vocalizationPlayer;
  late AudioPlayer _backgroundPlayer;
  bool _isPlaying = false;
  bool _isInitialized = false;
  bool _isSeeking = false;
  Duration _duration = Duration.zero;
  Duration _position = Duration.zero;
  final AudioCacheManager _cacheManager = AudioCacheManager();
  String _loadingMessage = "Ses dosyaları hazırlanıyor...";

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initAudioPlayers();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _vocalizationPlayer.dispose();
    _backgroundPlayer.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused) {
      // Auto-pause playback when app goes to background
      _vocalizationPlayer.pause();
      _backgroundPlayer.pause();
    }
  }

  Future<void> _initAudioPlayers() async {
    // Configure audio session
    final session = await AudioSession.instance;
    await session.configure(const AudioSessionConfiguration.music());

    // Initialize players
    _vocalizationPlayer = AudioPlayer();
    _backgroundPlayer = AudioPlayer();

    // Set up URLs with base URL
    String baseUrl = 'https://bulunlanbunuda.psynexa.com';
    String vocalizationUrl = widget.meditation.vocalizationUrl;
    String soundUrl = widget.meditation.soundUrl;

    if (vocalizationUrl.startsWith('/')) {
      vocalizationUrl = '$baseUrl$vocalizationUrl';
    } else {
      vocalizationUrl = '$baseUrl/$vocalizationUrl';
    }

    if (soundUrl.startsWith('/')) {
      soundUrl = '$baseUrl$soundUrl';
    } else {
      soundUrl = '$baseUrl/$soundUrl';
    }

    try {
      setState(() {
        _loadingMessage = "Ana ses dosyası hazırlanıyor...";
      });

      // Get cached audio files
      final cachedVocalizationPath =
          await _cacheManager.getAudioFile(vocalizationUrl);

      setState(() {
        _loadingMessage = "Arka plan müziği hazırlanıyor...";
      });

      final cachedSoundPath = await _cacheManager.getAudioFile(soundUrl);

      // Set background player options for better buffering
      AudioSource backgroundSource;
      if (cachedSoundPath.startsWith('http')) {
        backgroundSource = AudioSource.uri(Uri.parse(cachedSoundPath));
      } else {
        // File URI için doğru format
        final file = File(cachedSoundPath);
        if (await file.exists()) {
          backgroundSource = AudioSource.uri(file.uri);
          print("Arka plan müziği dosyası mevcut: ${file.uri}");
        } else {
          print("Arka plan müziği dosyası bulunamadı: $cachedSoundPath");
          backgroundSource = AudioSource.uri(Uri.parse(soundUrl));
        }
      }

      await _backgroundPlayer.setAudioSource(
        backgroundSource,
        preload: true, // Preload audio
      );

      // Set background sound source (looping) with lower volume
      await _backgroundPlayer.setLoopMode(LoopMode.one);
      await _backgroundPlayer
          .setVolume(0.3); // Lower volume for background music

      // Configure buffering parameters for main player
      AudioSource vocalizationSource;
      if (cachedVocalizationPath.startsWith('http')) {
        vocalizationSource = AudioSource.uri(Uri.parse(cachedVocalizationPath));
      } else {
        // File URI için doğru format
        final file = File(cachedVocalizationPath);
        if (await file.exists()) {
          vocalizationSource = AudioSource.uri(file.uri);
          print("Ana ses dosyası mevcut: ${file.uri}");
        } else {
          print("Ana ses dosyası bulunamadı: $cachedVocalizationPath");
          vocalizationSource = AudioSource.uri(Uri.parse(vocalizationUrl));
        }
      }

      await _vocalizationPlayer.setAudioSource(
        vocalizationSource,
        preload: true, // Preload audio
      );

      // Add position listener
      _vocalizationPlayer.positionStream.listen((position) {
        if (!_isSeeking && mounted) {
          setState(() {
            _position = position;
          });
        }
      });

      _vocalizationPlayer.durationStream.listen((duration) {
        if (mounted && duration != null) {
          setState(() {
            _duration = duration;
          });
        }
      });

      _vocalizationPlayer.playerStateStream.listen((state) {
        if (mounted) {
          setState(() {
            _isPlaying = state.playing;
          });
        }

        // Handle buffering state to show loading indicator
        if (state.processingState == ProcessingState.buffering) {
          if (mounted) {
            setState(() {
              _loadingMessage = "Ses yükleniyor...";
            });
          }
        }

        if (state.processingState == ProcessingState.completed) {
          _vocalizationPlayer.seek(Duration.zero);
          _vocalizationPlayer.pause();
          _backgroundPlayer.pause();
        }
      });

      // Wait for both players to be ready
      await Future.wait([
        _vocalizationPlayer.processingStateStream.firstWhere(
          (state) => state == ProcessingState.ready,
          orElse: () => ProcessingState.idle,
        ),
        _backgroundPlayer.processingStateStream.firstWhere(
          (state) => state == ProcessingState.ready,
          orElse: () => ProcessingState.idle,
        ),
      ]);

      setState(() {
        _isInitialized = true;
        _loadingMessage = "";
      });

      // Start playback with small delay to ensure sync
      await Future.delayed(const Duration(milliseconds: 300));

      // Start background player slightly before main player for better sync
      await _backgroundPlayer.play();
      await Future.delayed(const Duration(milliseconds: 100));
      await _vocalizationPlayer.play();
    } catch (e) {
      print('Error initializing audio: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Ses dosyası yüklenirken bir hata oluştu: $e'),
            duration: const Duration(seconds: 3),
          ),
        );
      }
    }
  }

  void _playPause() {
    if (_isPlaying) {
      _vocalizationPlayer.pause();
      _backgroundPlayer.pause();
    } else {
      // Add small delay when resuming for better sync
      _backgroundPlayer.play();
      Future.delayed(const Duration(milliseconds: 50), () {
        _vocalizationPlayer.play();
      });
    }
  }

  void _seekForward() {
    final newPosition = _position + const Duration(seconds: 10);
    _seekTo(newPosition);
  }

  void _seekBackward() {
    final newPosition = _position - const Duration(seconds: 10);
    _seekTo(newPosition);
  }

  void _seekTo(Duration position) {
    setState(() {
      _isSeeking = true;
    });

    // Ensure position is not negative or beyond duration
    position = position.isNegative ? Duration.zero : position;
    position = position > _duration ? _duration : position;

    _vocalizationPlayer.seek(position).then((_) {
      setState(() {
        _position = position;
        _isSeeking = false;
      });
    });
  }

  String _formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    final minutes = twoDigits(duration.inMinutes.remainder(60));
    final seconds = twoDigits(duration.inSeconds.remainder(60));
    return '$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    // Background image URL
    String imageUrl = '';
    if (widget.meditation.backgroundUrl.isNotEmpty) {
      imageUrl = widget.meditation.backgroundUrl.startsWith('/')
          ? 'https://bulunlanbunuda.psynexa.com${widget.meditation.backgroundUrl}'
          : 'https://bulunlanbunuda.psynexa.com/${widget.meditation.backgroundUrl}';
    }

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Background image
          SizedBox(
            width: double.infinity,
            height: double.infinity,
            child: widget.meditation.backgroundUrl.isNotEmpty
                ? Image.network(
                    imageUrl,
                    fit: BoxFit.cover,
                    loadingBuilder: (context, child, loadingProgress) {
                      if (loadingProgress == null) return child;
                      return Container(
                        color: Colors.black,
                        child: Center(
                          child: CircularProgressIndicator(
                            value: loadingProgress.expectedTotalBytes != null
                                ? loadingProgress.cumulativeBytesLoaded /
                                    loadingProgress.expectedTotalBytes!
                                : null,
                            color: Colors.white,
                          ),
                        ),
                      );
                    },
                    errorBuilder: (context, error, stackTrace) {
                      print("Resim yükleme hatası: $error");
                      return Container(color: Colors.black);
                    },
                  )
                : Container(color: Colors.black),
          ),

          // Darken overlay
          Container(
            width: double.infinity,
            height: double.infinity,
            color: Colors.black.withOpacity(0.6),
          ),

          // Content (back button, title, controls)
          SafeArea(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Back button
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: CircleAvatar(
                    backgroundColor: Colors.black.withOpacity(0.5),
                    radius: 20,
                    child: IconButton(
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                      onPressed: () {
                        _vocalizationPlayer.stop();
                        _backgroundPlayer.stop();
                        Navigator.of(context).pop();
                      },
                    ),
                  ),
                ),

                const Spacer(),

                // Title and progress
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.meditation.title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Progress slider
                      SliderTheme(
                        data: const SliderThemeData(
                          trackHeight: 4,
                          thumbShape:
                              RoundSliderThumbShape(enabledThumbRadius: 6),
                        ),
                        child: Slider(
                          value: _position.inSeconds.toDouble(),
                          min: 0,
                          max: _isInitialized
                              ? _duration.inSeconds.toDouble()
                              : 0,
                          activeColor: Colors.white,
                          inactiveColor: Colors.white30,
                          onChanged: (value) {
                            final newPosition =
                                Duration(seconds: value.toInt());
                            _seekTo(newPosition);
                          },
                        ),
                      ),

                      // Time indicators
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              _formatDuration(_position),
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 14,
                              ),
                            ),
                            Text(
                              _formatDuration(_duration),
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 32),

                      // Playback controls
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          // Rewind button
                          IconButton(
                            icon: const Icon(Icons.replay_10,
                                color: Colors.white, size: 40),
                            onPressed: _isInitialized ? _seekBackward : null,
                          ),

                          // Play/Pause button
                          CircleAvatar(
                            radius: 35,
                            backgroundColor: Colors.white,
                            child: IconButton(
                              iconSize: 42,
                              icon: Icon(
                                _isPlaying ? Icons.pause : Icons.play_arrow,
                                color: Colors.black,
                              ),
                              onPressed: _isInitialized ? _playPause : null,
                            ),
                          ),

                          // Forward button
                          IconButton(
                            icon: const Icon(Icons.forward_10,
                                color: Colors.white, size: 40),
                            onPressed: _isInitialized ? _seekForward : null,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 48),
              ],
            ),
          ),

          // Loading indicator
          if (!_isInitialized)
            Container(
              color: Colors.black.withOpacity(0.7),
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const CircularProgressIndicator(color: Colors.white),
                    const SizedBox(height: 16),
                    Text(
                      _loadingMessage,
                      style: const TextStyle(color: Colors.white, fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
