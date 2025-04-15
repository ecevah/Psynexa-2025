import 'package:flutter/material.dart';

class ChatMessage {
  final String text;
  final bool isUser;
  final String? imagePath;
  final String? audioUrl;
  final String? audioBase64;
  final DateTime timestamp;
  final bool hasImage;
  final bool hasAudio;

  ChatMessage({
    required this.text,
    required this.isUser,
    this.imagePath,
    this.audioUrl,
    this.audioBase64,
    DateTime? timestamp,
    this.hasImage = false,
    this.hasAudio = false,
  }) : timestamp = timestamp ?? DateTime.now();
}
