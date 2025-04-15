import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_nexa/services/chatbot_service.dart';
import 'package:flutter_nexa/utils/app_colors.dart';
import 'package:just_audio/just_audio.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';
import 'package:flutter_nexa/providers/user_provider.dart';
import 'package:record/record.dart';

class AudioRecordScreen extends StatefulWidget {
  const AudioRecordScreen({Key? key}) : super(key: key);

  @override
  State<AudioRecordScreen> createState() => _AudioRecordScreenState();
}

class _AudioRecordScreenState extends State<AudioRecordScreen> {
  bool _isRecording = false;
  bool _isLoading = false;
  bool _isPlaying = false;
  String? _recordedFilePath;
  String? _responseAudioBase64;
  String _statusText = 'Tap to start recording';

  late final AudioRecorder _audioRecorder;
  final AudioPlayer _audioPlayer = AudioPlayer();

  @override
  void initState() {
    super.initState();
    _audioRecorder = AudioRecorder();
    _requestPermissions();
  }

  @override
  void dispose() {
    _audioRecorder.dispose();
    _audioPlayer.dispose();
    super.dispose();
  }

  Future<void> _requestPermissions() async {
    final micStatus = await Permission.microphone.request();
    if (micStatus != PermissionStatus.granted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('Microphone permission is required to record audio')),
      );
    }
  }

  Future<void> _toggleRecording() async {
    if (_isRecording) {
      await _stopRecording();
    } else {
      await _startRecording();
    }
  }

  Future<void> _startRecording() async {
    try {
      // Ensure we have microphone permission
      if (!await Permission.microphone.isGranted) {
        setState(() {
          _statusText = 'Microphone permission denied';
        });
        return;
      }

      // Create directory to store the recording
      final Directory appDocDir = await getApplicationDocumentsDirectory();
      final String recordingPath = '${appDocDir.path}/recording.m4a';

      // Configure recorder for AAC format (better compatibility)
      await _audioRecorder.start(
        const RecordConfig(
          encoder: AudioEncoder.aacLc,
          bitRate: 128000,
          sampleRate: 44100,
        ),
        path: recordingPath,
      );

      setState(() {
        _isRecording = true;
        _statusText = 'Recording...';
        _recordedFilePath = recordingPath;
      });
    } catch (e) {
      setState(() {
        _statusText = 'Error starting recording: $e';
      });
    }
  }

  Future<void> _stopRecording() async {
    try {
      // Stop recording
      final path = await _audioRecorder.stop();

      setState(() {
        _isRecording = false;
        _statusText = 'Recording stopped';
        _recordedFilePath = path;
      });

      if (path != null) {
        await _sendAudioToAPI(path);
      }
    } catch (e) {
      setState(() {
        _isRecording = false;
        _statusText = 'Error stopping recording: $e';
      });
    }
  }

  Future<void> _sendAudioToAPI(String filePath) async {
    setState(() {
      _isLoading = true;
      _statusText = 'Processing audio...';
    });

    try {
      // Read the file and encode to base64
      final File audioFile = File(filePath);
      final bytes = await audioFile.readAsBytes();
      final audioBase64 = base64Encode(bytes);

      // Get user information
      final userProvider = Provider.of<UserProvider>(context, listen: false);
      final clientId = userProvider.user?.id.toString() ?? '1';
      final clientName = userProvider.user?.username ?? 'Guest';

      // Send to API
      final response = await ChatbotService.sendAudioMessage(
        clientId: clientId,
        clientName: clientName,
        audioBase64: audioBase64,
      );

      if (response['status'] == true) {
        // Extract response audio base64
        final responseAudio = response['response_audio_base64'];
        if (responseAudio != null && responseAudio.isNotEmpty) {
          setState(() {
            _responseAudioBase64 = responseAudio;
            _statusText = 'Response received. Tap play to listen.';
          });
        } else {
          setState(() {
            _statusText = 'No audio response received';
          });
        }

        // Show text response if available
        final textResponse = response['data']?['Response'];
        if (textResponse != null && textResponse.isNotEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('AI Response: $textResponse')),
          );
        }
      } else {
        setState(() {
          _statusText = 'API error: ${response['message'] ?? 'Unknown error'}';
        });
      }
    } catch (e) {
      setState(() {
        _statusText = 'Error processing audio: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _playResponseAudio() async {
    if (_responseAudioBase64 == null || _responseAudioBase64!.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No audio response to play')),
      );
      return;
    }

    try {
      setState(() {
        _isPlaying = true;
        _statusText = 'Playing response...';
      });

      // Decode base64 to bytes
      final bytes = base64Decode(_responseAudioBase64!);

      // Use custom audio source to play from memory
      await _audioPlayer.setAudioSource(
        MyCustomSource(bytes),
      );

      // Play audio
      await _audioPlayer.play();

      // Listen for playback completion
      _audioPlayer.playerStateStream.listen((state) {
        if (state.processingState == ProcessingState.completed) {
          setState(() {
            _isPlaying = false;
            _statusText = 'Playback complete';
          });
        }
      });
    } catch (e) {
      setState(() {
        _isPlaying = false;
        _statusText = 'Error playing audio: $e';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Voice Recorder'),
        backgroundColor: AppColors.primaryColor,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Status text
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                _statusText,
                style: const TextStyle(fontSize: 18),
                textAlign: TextAlign.center,
              ),
            ),

            const SizedBox(height: 40),

            // Recording button
            GestureDetector(
              onTap: _isLoading ? null : _toggleRecording,
              child: Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  color: _isRecording ? Colors.red : AppColors.primaryColor,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.2),
                      blurRadius: 10,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Icon(
                  _isRecording ? Icons.stop : Icons.mic,
                  size: 60,
                  color: Colors.white,
                ),
              ),
            ),

            const SizedBox(height: 40),

            // Play response button (only shown when response is available)
            if (_responseAudioBase64 != null && !_isRecording && !_isLoading)
              ElevatedButton.icon(
                onPressed: _isPlaying ? null : _playResponseAudio,
                icon: Icon(_isPlaying ? Icons.pause : Icons.play_arrow),
                label: Text(_isPlaying ? 'Playing...' : 'Play Response'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.successColor,
                  foregroundColor: Colors.white,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  textStyle: const TextStyle(fontSize: 18),
                ),
              ),

            // Loading indicator
            if (_isLoading)
              const Padding(
                padding: EdgeInsets.all(20.0),
                child: CircularProgressIndicator(),
              ),
          ],
        ),
      ),
    );
  }
}

// Custom audio source for playing from memory
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
      contentType:
          'audio/*', // Daha genel bir content type kullanarak uyumluluk sorunlarını önlüyoruz
    );
  }
}
