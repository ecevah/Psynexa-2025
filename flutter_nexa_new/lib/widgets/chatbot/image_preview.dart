import 'dart:io';
import 'package:flutter/material.dart';

class ImagePreview extends StatelessWidget {
  final File? imageFile;
  final Function onClear;

  const ImagePreview({
    Key? key,
    required this.imageFile,
    required this.onClear,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (imageFile == null) return const SizedBox.shrink();

    return Container(
      height: 80,
      padding: const EdgeInsets.all(8.0),
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        border: Border(
          top: BorderSide(color: Colors.grey.shade300),
        ),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.file(
              imageFile!,
              height: 60,
              width: 60,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: 12),
          const Expanded(
            child: Text(
              'The picture is ready. You can write your message and send it.',
              style: TextStyle(fontSize: 12, color: Colors.black54),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.close, color: Colors.grey),
            onPressed: () => onClear(),
          ),
        ],
      ),
    );
  }
}
