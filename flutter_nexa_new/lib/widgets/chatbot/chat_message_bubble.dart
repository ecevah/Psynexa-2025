import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_nexa/utils/app_colors.dart';
import 'package:flutter_nexa/widgets/chatbot/chat_message.dart';
import 'package:just_audio/just_audio.dart';

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

class ChatMessageBubble extends StatefulWidget {
  final ChatMessage message;
  final AudioPlayer audioPlayer;

  const ChatMessageBubble({
    Key? key,
    required this.message,
    required this.audioPlayer,
  }) : super(key: key);

  @override
  State<ChatMessageBubble> createState() => _ChatMessageBubbleState();
}

class _ChatMessageBubbleState extends State<ChatMessageBubble> {
  bool _isPlaying = false;

  void _showImageFullScreen(BuildContext context, String imagePath) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: EdgeInsets.zero,
        child: Stack(
          children: [
            GestureDetector(
              onTap: () => Navigator.of(context).pop(),
              child: Container(
                width: double.infinity,
                height: double.infinity,
                color: Colors.black.withOpacity(0.7),
                child: Center(
                  child: InteractiveViewer(
                    minScale: 0.5,
                    maxScale: 3.0,
                    child: Image.file(
                      File(imagePath),
                      fit: BoxFit.contain,
                    ),
                  ),
                ),
              ),
            ),
            Positioned(
              top: 40,
              right: 20,
              child: IconButton(
                icon: const Icon(Icons.close, color: Colors.white, size: 30),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final maxWidth = screenWidth * 0.85;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Column(
        crossAxisAlignment: widget.message.isUser
            ? CrossAxisAlignment.end
            : CrossAxisAlignment.start,
        children: [
          // Message content
          Container(
            constraints: BoxConstraints(
              maxWidth: maxWidth,
            ),
            padding:
                const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
            decoration: BoxDecoration(
              color: widget.message.isUser
                  ? const Color(0xFFE0F1FE) // AppColors.babyBlueColor
                  : Colors.white,
              borderRadius: widget.message.isUser
                  ? const BorderRadius.only(
                      topLeft: Radius.circular(12),
                      topRight: Radius.circular(12),
                      bottomLeft: Radius.circular(12),
                      bottomRight: Radius.circular(2),
                    )
                  : const BorderRadius.only(
                      topLeft: Radius.circular(12),
                      topRight: Radius.circular(12),
                      bottomLeft: Radius.circular(2),
                      bottomRight: Radius.circular(12),
                    ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 2,
                  spreadRadius: 0,
                  offset: const Offset(0, 1),
                )
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Text content
                SelectableText(
                  widget.message.text,
                  style: const TextStyle(
                    color: Color(0xFF0B1215),
                    fontFamily: 'Urbanist',
                    fontSize: 16,
                    fontWeight: FontWeight.w400,
                    height: 1.4, // 140% line height
                  ),
                ),

                // Display image if available
                if (widget.message.hasImage && widget.message.imagePath != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: GestureDetector(
                      onTap: () => _showImageFullScreen(
                          context, widget.message.imagePath!),
                      child: Hero(
                        tag: widget.message.imagePath!,
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: Image.file(
                            File(widget.message.imagePath!),
                            height: 150,
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    ),
                  ),

                // Audio playback button if available
                if (widget.message.hasAudio)
                  Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: Icon(
                            _isPlaying ? Icons.pause : Icons.play_arrow,
                            color: AppColors.primaryColor,
                          ),
                          onPressed: _toggleAudioPlayback,
                        ),
                        Text(
                          widget.message.isUser
                              ? 'Voice Message'
                              : 'Voice Response',
                          style: TextStyle(
                            color: AppColors.primaryColor,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),

          // Time stamp below the message
          Padding(
            padding: const EdgeInsets.only(top: 4.0, left: 4.0, right: 4.0),
            child: Text(
              '${widget.message.timestamp.hour.toString().padLeft(2, '0')}:${widget.message.timestamp.minute.toString().padLeft(2, '0')}',
              style: const TextStyle(
                color: Color(0xFF0B1215),
                fontFamily: 'Urbanist',
                fontSize: 14,
                fontWeight: FontWeight.w300,
                height: 1.4, // 140% line height
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _toggleAudioPlayback() async {
    // Çalma işlemini durdur
    if (_isPlaying) {
      await widget.audioPlayer.pause();
      setState(() {
        _isPlaying = false;
      });
      return;
    }

    try {
      setState(() {
        _isPlaying = true;
      });

      // URL veya base64 formatında ses kaynağını belirle
      if (widget.message.audioUrl != null) {
        // URL formatındaki ses
        await widget.audioPlayer.setUrl(widget.message.audioUrl!);
      } else if (widget.message.audioBase64 != null) {
        // Base64 formatındaki ses
        final bytes = base64Decode(widget.message.audioBase64!);
        await widget.audioPlayer.setAudioSource(MyCustomSource(bytes));
      } else {
        debugPrint('Ses kaynağı bulunamadı');
        setState(() {
          _isPlaying = false;
        });
        return;
      }

      // Ses çalmayı başlat
      await widget.audioPlayer.play();

      // Çalma tamamlanmasını dinle
      widget.audioPlayer.playerStateStream.listen((state) {
        if (state.processingState == ProcessingState.completed) {
          if (mounted) {
            setState(() {
              _isPlaying = false;
            });
          }
        }
      });
    } catch (e) {
      debugPrint('Ses çalma hatası: $e');
      setState(() {
        _isPlaying = false;
      });
    }
  }
}
