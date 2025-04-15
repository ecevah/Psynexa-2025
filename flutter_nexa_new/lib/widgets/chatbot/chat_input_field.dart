import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_nexa/utils/app_colors.dart';

class ChatInputField extends StatefulWidget {
  final TextEditingController textController;
  final File? imageFile;
  final bool isCameraEnabled;
  final bool isWebSearchEnabled;
  final VoidCallback onCameraPressed;
  final VoidCallback onMicrophonePressed;
  final Function(String) onSendText;
  final VoidCallback onSendImage;
  final VoidCallback onWebSearchToggle;

  const ChatInputField({
    Key? key,
    required this.textController,
    required this.imageFile,
    required this.isCameraEnabled,
    required this.isWebSearchEnabled,
    required this.onCameraPressed,
    required this.onMicrophonePressed,
    required this.onSendText,
    required this.onSendImage,
    required this.onWebSearchToggle,
  }) : super(key: key);

  @override
  State<ChatInputField> createState() => _ChatInputFieldState();
}

class _ChatInputFieldState extends State<ChatInputField> {
  bool _hasText = false;

  @override
  void initState() {
    super.initState();
    // Metin değişikliklerini dinle
    widget.textController.addListener(_onTextChanged);
  }

  @override
  void dispose() {
    widget.textController.removeListener(_onTextChanged);
    super.dispose();
  }

  void _onTextChanged() {
    final hasText = widget.textController.text.isNotEmpty;
    if (hasText != _hasText) {
      setState(() {
        _hasText = hasText;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFFAFAFA),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 12.0),
      child: Padding(
        padding: const EdgeInsets.only(bottom: 15.0),
        child: Row(
          children: [
            // Kamera butonu
            IconButton(
              icon: Icon(
                Icons.camera_alt,
                color: widget.isCameraEnabled
                    ? AppColors.primaryColor
                    : Colors.grey,
              ),
              onPressed: widget.onCameraPressed,
            ),

            // Web arama butonu
            IconButton(
              icon: Icon(
                Icons.language,
                color: widget.isWebSearchEnabled
                    ? AppColors.primaryColor
                    : Colors.grey,
              ),
              onPressed: widget.onWebSearchToggle,
            ),

            // Mesaj yazma alanı
            Expanded(
              child: ConstrainedBox(
                constraints: const BoxConstraints(
                  maxHeight: 100.0, // Maximum height before scrolling
                ),
                child: TextField(
                  controller: widget.textController,
                  maxLines: null, // Allow multiple lines
                  keyboardType: TextInputType.multiline,
                  textInputAction: TextInputAction.newline,
                  decoration: InputDecoration(
                    hintText: widget.imageFile != null
                        ? 'Write a message about your picture...'
                        : "I'm hear to help you",
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(20),
                      borderSide: BorderSide.none,
                    ),
                    filled: true,
                    fillColor: Colors.white,
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16.0, vertical: 8.0),
                  ),
                ),
              ),
            ),

            const SizedBox(width: 8),

            // Sağ tarafta mikrofon veya gönder butonu (duruma göre değişir)
            _buildRightButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildRightButton() {
    // Eğer bir resim varsa veya metin girilmişse gönder butonu
    if (widget.imageFile != null || _hasText) {
      return Container(
        width: 45,
        height: 45,
        decoration: BoxDecoration(
          color: AppColors.babyBlueColor,
          shape: BoxShape.circle,
        ),
        child: IconButton(
          padding: EdgeInsets.zero,
          icon: const Icon(Icons.send, color: AppColors.primaryColor),
          onPressed: () => widget.imageFile != null
              ? widget.onSendImage()
              : widget.onSendText(widget.textController.text),
        ),
      );
    }
    // Metin yoksa mikrofon butonu
    else {
      return Container(
        width: 45,
        height: 45,
        decoration: BoxDecoration(
          color: AppColors.babyBlueColor,
          shape: BoxShape.circle,
        ),
        child: IconButton(
          padding: EdgeInsets.zero,
          icon: const Icon(
            Icons.mic,
            color: AppColors.primaryColor,
          ),
          onPressed: widget.onMicrophonePressed,
        ),
      );
    }
  }
}
