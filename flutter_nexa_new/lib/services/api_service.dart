import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_nexa/models/user_model.dart';
import 'package:flutter_nexa/models/api_models.dart';
import 'package:flutter_nexa/providers/user_provider.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'https://bulunlanbunuda.psynexa.com/api';
  static UserProvider? _userProvider;

  // Initialize user provider
  static void initUserProvider(BuildContext context) {
    _userProvider = Provider.of<UserProvider>(context, listen: false);
  }

  // Get authorization header
  static Future<Map<String, String>> _getAuthHeader() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('access_token');

    return {
      'user-agent': 'Dart/3.4 (dart:io)',
      'content-type': 'application/json; charset=utf-8',
      'accept-encoding': 'gzip',
      'Authorization': 'Bearer $token',
    };
  }

  // Get tests
  static Future<List<TestModel>> getTests() async {
    try {
      final headers = await _getAuthHeader();
      final response = await http.get(
        Uri.parse('$baseUrl/tests'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        if (jsonResponse['status'] == true && jsonResponse['data'] != null) {
          return (jsonResponse['data'] as List)
              .map((item) => TestModel.fromJson(item))
              .toList();
        }
      }
      return [];
    } catch (e) {
      print('Get tests error: $e');
      return [];
    }
  }

  // Get meditations
  static Future<List<MeditationModel>> getMeditations() async {
    try {
      final headers = await _getAuthHeader();
      final response = await http.get(
        Uri.parse('$baseUrl/meditations'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        if (jsonResponse['status'] == true && jsonResponse['data'] != null) {
          return (jsonResponse['data'] as List)
              .map((item) => MeditationModel.fromJson(item))
              .toList();
        }
      }
      return [];
    } catch (e) {
      print('Get meditations error: $e');
      return [];
    }
  }

  // Get blogs
  static Future<List<BlogModel>> getBlogs() async {
    try {
      final headers = await _getAuthHeader();
      final response = await http.get(
        Uri.parse('$baseUrl/blogs'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        if (jsonResponse['status'] == true && jsonResponse['data'] != null) {
          return (jsonResponse['data'] as List)
              .map((item) => BlogModel.fromJson(item))
              .toList();
        }
      }
      return [];
    } catch (e) {
      print('Get blogs error: $e');
      return [];
    }
  }

  // Search by title (for blogs and meditations)
  static Future<Map<String, dynamic>> searchByTitle(String query) async {
    try {
      final headers = await _getAuthHeader();
      final response = await http.get(
        Uri.parse('$baseUrl/search/title/$query'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        return jsonResponse;
      }
      return {'status': false, 'message': 'Arama yapılırken bir hata oluştu.'};
    } catch (e) {
      print('Search error: $e');
      return {'status': false, 'message': 'Bir hata oluştu: $e'};
    }
  }

  // Register method
  static Future<RegisterResponse> register({
    required String name,
    required String surname,
    required String username,
    required String email,
    required String password,
    required String phone,
    required String dateOfBirth,
    required String gender,
    File? photo,
  }) async {
    try {
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/auth/client/register'),
      );

      // Add text fields
      request.fields['email'] = email;
      request.fields['password'] = password;
      request.fields['name'] = name;
      request.fields['surname'] = surname;
      request.fields['username'] = username;
      request.fields['date_of_birth'] = dateOfBirth;
      request.fields['sex'] = gender;
      request.fields['phone'] = phone;

      // Add photo if selected
      if (photo != null) {
        request.files.add(await http.MultipartFile.fromPath(
          'photo',
          photo.path,
        ));
      }

      final response = await request.send();
      final responseString = await response.stream.bytesToString();
      final jsonResponse = jsonDecode(responseString);

      return RegisterResponse.fromJson(jsonResponse);
    } catch (e) {
      return RegisterResponse(status: false, message: 'Bir hata oluştu: $e');
    }
  }

  // Login method
  static Future<LoginResponse> login(String email, String password,
      [BuildContext? context]) async {
    final url = Uri.parse('$baseUrl/auth/client/login');

    try {
      final response = await http.post(
        url,
        headers: {
          'user-agent': 'Dart/3.4 (dart:io)',
          'content-type': 'application/json; charset=utf-8',
          'accept-encoding': 'gzip',
        },
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      final jsonResponse = jsonDecode(response.body);

      // Include status code in the response
      final Map<String, dynamic> responseWithStatusCode = {
        ...jsonResponse,
        'statusCode': response.statusCode,
      };

      final loginResponse = LoginResponse.fromJson(responseWithStatusCode);

      // Save tokens if login successful
      if (loginResponse.status && loginResponse.data != null) {
        final accessToken = loginResponse.data!.accessToken;
        final refreshToken = loginResponse.data!.refreshToken;
        final user = loginResponse.data!.client;

        // Save to SharedPreferences
        await _saveTokens(accessToken, refreshToken);
        await _saveUserData(user);

        // Save credentials
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('email', email);
        await prefs.setString('password', password);

        // Update user provider if context is provided
        if (context != null) {
          final userProvider =
              // ignore: use_build_context_synchronously
              Provider.of<UserProvider>(context, listen: false);
          userProvider.setUser(user);
          userProvider.setTokens(accessToken, refreshToken);
        } else if (_userProvider != null) {
          _userProvider!.setUser(user);
          _userProvider!.setTokens(accessToken, refreshToken);
        }
      }

      return loginResponse;
    } catch (e) {
      return LoginResponse(status: false, message: 'Bir hata oluştu: $e');
    }
  }

  // Save tokens to SharedPreferences
  static Future<void> _saveTokens(
    String accessToken,
    String refreshToken,
  ) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('access_token', accessToken);
    await prefs.setString('refresh_token', refreshToken);
  }

  // Save user data to SharedPreferences
  static Future<void> _saveUserData(UserModel user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('user_id', user.id);
    await prefs.setString('user_name', user.name);
    await prefs.setString('user_surname', user.surname);
    await prefs.setString('user_email', user.email);
    await prefs.setString('user_username', user.username);
  }

  // Forgot password method
  static Future<Map<String, dynamic>> forgotPassword(String email) async {
    final url = Uri.parse('$baseUrl/auth/client/forgot-password');

    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'email': email,
        }),
      );

      final jsonResponse = jsonDecode(response.body);

      // Include status code in the response
      return {
        ...jsonResponse,
        'statusCode': response.statusCode,
      };
    } catch (e) {
      return {'status': false, 'message': 'Bir hata oluştu: $e'};
    }
  }

  // Check if user is logged in
  static Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.containsKey('access_token');
  }

  // Get current user data
  static Future<Map<String, dynamic>?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    if (!await isLoggedIn()) return null;

    return {
      'id': prefs.getInt('user_id'),
      'name': prefs.getString('user_name'),
      'surname': prefs.getString('user_surname'),
      'email': prefs.getString('user_email'),
      'username': prefs.getString('user_username'),
    };
  }

  // Logout method
  static Future<bool> logout([BuildContext? context]) async {
    final prefs = await SharedPreferences.getInstance();
    bool logoutSuccessful = true;

    try {
      // Get saved tokens
      final accessToken = prefs.getString('access_token');
      final refreshToken = prefs.getString('refresh_token');

      if (accessToken != null && refreshToken != null) {
        // Make API call to logout
        final url = Uri.parse('$baseUrl/auth/client/logout');

        try {
          final response = await http.post(
            url,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer $accessToken',
            },
            body: {
              'refreshToken': refreshToken,
            },
          );

          // Log the response for debugging purposes
          debugPrint(
              'Logout API response: ${response.statusCode}, ${response.body}');

          // We don't need to check the response, just log it
          logoutSuccessful = true;
        } catch (e) {
          // Log the error but continue with local logout
          debugPrint('Logout API error: $e');
          // Still proceed with local logout even if the API call fails
        }
      }
    } catch (e) {
      debugPrint('Error during logout process: $e');
      // Continue with local logout even if there was an error
    }

    // Always perform local logout
    try {
      // Remove tokens
      await prefs.remove('access_token');
      await prefs.remove('refresh_token');

      // Remove saved credentials
      await prefs.remove('email');
      await prefs.remove('password');

      // Clear user provider
      if (context != null) {
        final userProvider = Provider.of<UserProvider>(context, listen: false);
        userProvider.clear();
      } else if (_userProvider != null) {
        _userProvider!.clear();
      }
    } catch (e) {
      debugPrint('Error during local logout: $e');
      logoutSuccessful = false;
    }

    return logoutSuccessful;
  }

  // Update user profile
  static Future<Map<String, dynamic>> updateProfile({
    required int userId,
    required String name,
    required String surname,
    required String email,
    required String phone,
    required String dateOfBirth,
    required String sex,
  }) async {
    try {
      final headers = await _getAuthHeader();
      final response = await http.put(
        Uri.parse('$baseUrl/clients/$userId'),
        headers: headers,
        body: jsonEncode({
          'name': name,
          'surname': surname,
          'email': email,
          'phone': phone,
          'date_of_birth': dateOfBirth,
          'sex': sex,
        }),
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        if (jsonResponse['status'] == true && jsonResponse['data'] != null) {
          final updatedUser = UserModel.fromJson(jsonResponse['data']);

          // Update UserProvider if available
          if (_userProvider != null) {
            _userProvider!.setUser(updatedUser);
          }

          // Update SharedPreferences
          await _saveUserData(updatedUser);

          return {
            'status': true,
            'message': jsonResponse['message'],
            'data': updatedUser,
          };
        }
      }

      return {
        'status': false,
        'message': 'Profil güncellenirken bir hata oluştu.',
        'data': null,
      };
    } catch (e) {
      print('Update profile error: $e');
      return {
        'status': false,
        'message': 'Bir hata oluştu: $e',
        'data': null,
      };
    }
  }

  // Update profile photo using HTTP (without Dio)
  static Future<Map<String, dynamic>> updateProfilePhoto({
    required int userId,
    required File photoFile,
  }) async {
    try {
      // Get auth headers
      final headers = await _getAuthHeader();

      // Create multipart request
      final request = http.MultipartRequest(
        'PUT',
        Uri.parse('$baseUrl/clients/$userId'),
      );

      // Add headers
      request.headers.addAll(headers);

      // Add file
      request.files.add(await http.MultipartFile.fromPath(
        'photo',
        photoFile.path,
        filename: 'profile_photo.jpg',
      ));

      // Send request
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      // Process response
      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);

        // Update user data if available
        if (jsonResponse['status'] == true && jsonResponse['data'] != null) {
          final updatedUser = UserModel.fromJson(jsonResponse['data']);

          // Update UserProvider if available
          if (_userProvider != null) {
            _userProvider!.setUser(updatedUser);
          }

          // Update SharedPreferences
          await _saveUserData(updatedUser);
        }

        return jsonResponse;
      } else {
        return {
          'status': false,
          'message':
              'Profil fotoğrafı güncellenirken bir hata oluştu: ${response.statusCode}',
        };
      }
    } catch (e) {
      print('Profil fotoğrafı güncelleme hatası: $e');
      return {
        'status': false,
        'message': 'Bir hata oluştu: $e',
      };
    }
  }

  // Reload user data from the server
  static Future<bool> reloadUserData(BuildContext context) async {
    try {
      // Get the user provider
      final userProvider = Provider.of<UserProvider>(context, listen: false);
      final user = userProvider.user;

      if (user == null) return false;

      // Get the auth header
      final headers = await _getAuthHeader();

      // Make the request to get the user
      final response = await http.get(
        Uri.parse('$baseUrl/clients/${user.id}'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);

        if (jsonResponse['status'] == true && jsonResponse['data'] != null) {
          // Parse the user data
          final updatedUser = UserModel.fromJson(jsonResponse['data']);

          // Update the user provider
          userProvider.setUser(updatedUser);

          // Update shared preferences
          await _saveUserData(updatedUser);

          return true;
        }
      }

      return false;
    } catch (e) {
      print('Error reloading user data: $e');
      return false;
    }
  }
}
