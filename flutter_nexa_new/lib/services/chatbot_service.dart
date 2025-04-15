import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:io';

class ChatbotService {
  // API endpoint
  static const String apiUrl =
      'http://147.79.115.249:8080/api/message_generate';

  // Send text message to chatbot API
  static Future<Map<String, dynamic>> sendTextMessage({
    required String message,
    required String clientId,
    required String clientName,
    bool webSearch = false,
  }) async {
    try {
      final requestBody = {
        'input_message': message,
        'client_id': clientId,
        'client_name': clientName,
        'agent_type': 'normal_chat',
        'web_search': webSearch,
      };

      return await _sendRequest(requestBody);
    } catch (e) {
      debugPrint('Error sending text message: $e');
      rethrow;
    }
  }

  // Send image message to chatbot API
  static Future<Map<String, dynamic>> sendImageMessage({
    required File imageFile,
    required String message,
    required String clientId,
    required String clientName,
  }) async {
    try {
      // Check if file exists
      if (!await imageFile.exists()) {
        throw Exception('Image file not found');
      }

      // Convert image to base64
      final imageBase64 = await _fileToBase64(imageFile.path);
      if (imageBase64.isEmpty) {
        throw Exception('Invalid base64 format');
      }

      // Use default message if empty
      final inputMessage = message.trim().isEmpty ? '' : message;

      final requestBody = {
        'input_message': inputMessage,
        'client_id': clientId,
        'client_name': clientName,
        'agent_type': 'vision_chat',
        'image_base64': imageBase64,
      };

      return await _sendRequest(requestBody);
    } catch (e) {
      debugPrint('Error sending image message: $e');
      rethrow;
    }
  }

  // Send audio message to chatbot API
  static Future<Map<String, dynamic>> sendAudioMessage({
    required String clientId,
    required String clientName,
    required String audioBase64,
    File? imageFile,
  }) async {
    try {
      String? imageBase64;
      if (imageFile != null && await imageFile.exists()) {
        imageBase64 = await _fileToBase64(imageFile.path);
        if (imageBase64.isEmpty) {
          debugPrint('Warning: Empty base64 image, skipping');
          imageBase64 = null;
        }
      }

      final requestBody = {
        'client_id': clientId,
        'client_name': clientName,
        'agent_type': 'normal_talk',
        'audio_base64': audioBase64,
      };

      if (imageBase64 != null && imageBase64.isNotEmpty) {
        requestBody['image_base64'] = imageBase64;
      }
      debugPrint('Request body: $requestBody');
      return await _sendRequest(requestBody);
    } catch (e) {
      debugPrint('Error sending audio message: $e');
      rethrow;
    }
  }

  // Common request sending method
  static Future<Map<String, dynamic>> _sendRequest(
      Map<String, dynamic> requestBody) async {
    try {
      debugPrint(
          'Sending API request... ClientID: ${requestBody['client_id']}, ClientName: ${requestBody['client_name']}');

      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Charset': 'utf-8',
        },
        body: json.encode(requestBody),
      );

      debugPrint('API response code: ${response.statusCode}');
      final contentPreview = response.body.length > 100
          ? response.body.substring(0, 100) + '...'
          : response.body;
      debugPrint('API response content: $contentPreview');

      if (response.statusCode == 200 || response.statusCode == 201) {
        final jsonResponse = json.decode(utf8.decode(response.bodyBytes));
        return jsonResponse;
      } else {
        throw Exception('Request failed with status: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('Error in API request: $e');
      rethrow;
    }
  }

  // Convert file to base64
  static Future<String> _fileToBase64(String filePath) async {
    try {
      final bytes = await File(filePath).readAsBytes();
      if (bytes.isEmpty) {
        throw Exception('File content is empty');
      }

      final base64String = base64Encode(bytes);
      if (base64String.trim().isEmpty) {
        throw Exception('Base64 conversion returned empty result');
      }

      debugPrint(
          'Base64 conversion successful: ${base64String.length} characters');
      debugPrint('Base64 string: $base64String');
      return base64String;
    } catch (e) {
      debugPrint('Base64 conversion error: $e');
      throw Exception('Could not convert file to base64: $e');
    }
  }
}
