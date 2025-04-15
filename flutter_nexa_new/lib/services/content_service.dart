import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_nexa/models/api_models.dart';
import 'package:flutter_nexa/models/breathing_exercise_model.dart';
import 'package:flutter_nexa/services/api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ContentService {
  static const String baseUrl = 'https://bulunlanbunuda.psynexa.com/api';

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

  // Fetch meditations with pagination
  static Future<List<MeditationModel>> fetchMeditations({
    int page = 1,
    int limit = 10,
    String? search,
  }) async {
    try {
      final headers = await _getAuthHeader();
      final uri = Uri.parse('$baseUrl/meditations').replace(queryParameters: {
        'page': page.toString(),
        'limit': limit.toString(),
        if (search != null && search.isNotEmpty) 'search': search,
      });

      final response = await http.get(uri, headers: headers);

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        if (jsonResponse['status'] == true && jsonResponse['data'] != null) {
          return (jsonResponse['data'] as List)
              .map((item) => MeditationModel.fromJson(item))
              .toList();
        }
        return [];
      } else {
        // API çağrısı başarısız olursa, önce ApiService ile dene
        final meditations = await ApiService.getMeditations();
        // ApiService ile de başarısız olursa, o zaman mock verileri kullan
        if (meditations.isEmpty) {
          print(
              'Using mock meditations due to API failure. Status code: ${response.statusCode}');
          return _getMockMeditations(page, limit, search);
        }
        return meditations;
      }
    } catch (e) {
      // API çağrısı istisna fırlatırsa, önce ApiService ile dene
      try {
        final meditations = await ApiService.getMeditations();
        if (meditations.isNotEmpty) {
          return meditations;
        }
      } catch (apiError) {
        print('ApiService also failed: $apiError');
      }

      // Her iki API çağrısı da başarısız olursa, o zaman mock verileri kullan
      print('Error fetching meditations: $e. Using mock data.');
      return _getMockMeditations(page, limit, search);
    }
  }

  // Fetch blogs with pagination
  static Future<List<BlogModel>> fetchBlogs({
    int page = 1,
    int limit = 10,
    String? search,
  }) async {
    try {
      final headers = await _getAuthHeader();
      final uri = Uri.parse('$baseUrl/blogs').replace(queryParameters: {
        'page': page.toString(),
        'limit': limit.toString(),
        if (search != null && search.isNotEmpty) 'search': search,
      });

      final response = await http.get(uri, headers: headers);

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        if (jsonResponse['status'] == true && jsonResponse['data'] != null) {
          return (jsonResponse['data'] as List)
              .map((item) => BlogModel.fromJson(item))
              .toList();
        }
        return [];
      } else {
        // API çağrısı başarısız olursa, önce ApiService ile dene
        final blogs = await ApiService.getBlogs();
        // ApiService ile de başarısız olursa, o zaman mock verileri kullan
        if (blogs.isEmpty) {
          print(
              'Using mock blogs due to API failure. Status code: ${response.statusCode}');
          return _getMockBlogs(page, limit, search);
        }
        return blogs;
      }
    } catch (e) {
      // API çağrısı istisna fırlatırsa, önce ApiService ile dene
      try {
        final blogs = await ApiService.getBlogs();
        if (blogs.isNotEmpty) {
          return blogs;
        }
      } catch (apiError) {
        print('ApiService also failed: $apiError');
      }

      // Her iki API çağrısı da başarısız olursa, o zaman mock verileri kullan
      print('Error fetching blogs: $e. Using mock data.');
      return _getMockBlogs(page, limit, search);
    }
  }

  // Fetch tests with pagination
  static Future<List<TestModel>> fetchTests({
    int page = 1,
    int limit = 10,
    String? search,
  }) async {
    try {
      final headers = await _getAuthHeader();
      final uri = Uri.parse('$baseUrl/tests').replace(queryParameters: {
        'page': page.toString(),
        'limit': limit.toString(),
        if (search != null && search.isNotEmpty) 'search': search,
      });

      final response = await http.get(uri, headers: headers);

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        if (jsonResponse['status'] == true && jsonResponse['data'] != null) {
          return (jsonResponse['data'] as List)
              .map((item) => TestModel.fromJson(item))
              .toList();
        }
        return [];
      } else {
        // API çağrısı başarısız olursa, önce ApiService ile dene
        final tests = await ApiService.getTests();
        // ApiService ile de başarısız olursa, o zaman mock verileri kullan
        if (tests.isEmpty) {
          print(
              'Using mock tests due to API failure. Status code: ${response.statusCode}');
          return _getMockTests(page, limit, search);
        }
        return tests;
      }
    } catch (e) {
      // API çağrısı istisna fırlatırsa, önce ApiService ile dene
      try {
        final tests = await ApiService.getTests();
        if (tests.isNotEmpty) {
          return tests;
        }
      } catch (apiError) {
        print('ApiService also failed: $apiError');
      }

      // Her iki API çağrısı da başarısız olursa, o zaman mock verileri kullan
      print('Error fetching tests: $e. Using mock data.');
      return _getMockTests(page, limit, search);
    }
  }

  // Fetch breathing exercises with pagination
  static Future<List<BreathingExerciseModel>> fetchBreathingExercises({
    int page = 1,
    int limit = 10,
    String? search,
  }) async {
    try {
      final headers = await _getAuthHeader();
      final uri =
          Uri.parse('$baseUrl/breathing-exercises').replace(queryParameters: {
        'page': page.toString(),
        'limit': limit.toString(),
        if (search != null && search.isNotEmpty) 'search': search,
      });

      final response = await http.get(uri, headers: headers);

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        if (jsonResponse['status'] == true && jsonResponse['data'] != null) {
          return (jsonResponse['data'] as List)
              .map((item) => BreathingExerciseModel.fromJson(item))
              .toList();
        }
        // API çağrısı başarılı ama veri yoksa, mock verileri kullan
        print('No breathing exercises found in API, using mock data');
        return getMockBreathingExercises();
      } else {
        // API çağrısı başarısız olursa, mock verileri kullan
        print(
            'Using mock breathing exercises due to API failure. Status code: ${response.statusCode}');
        return getMockBreathingExercises();
      }
    } catch (e) {
      // API çağrısı istisna fırlatırsa, mock verileri kullan
      print('Error fetching breathing exercises: $e. Using mock data.');
      return getMockBreathingExercises();
    }
  }

  // Mock data for meditations
  static List<MeditationModel> _getMockMeditations(
      int page, int limit, String? search) {
    final psychologist = Psychologist(
      id: 1,
      name: 'Dr. Jane Smith',
      surname: 'Smith',
    );

    final allMeditations = List.generate(
      50,
      (index) => MeditationModel(
        id: index + 1,
        psycId: 1,
        title: 'Meditation ${index + 1}',
        description:
            'This is a sample meditation description for item ${index + 1}',
        content:
            'Detailed meditation instructions and guidance for meditation ${index + 1}',
        duration: (index % 5 + 2) * 5, // 10-30 minutes
        backgroundUrl:
            'https://via.placeholder.com/300x200?text=Meditation+${index + 1}',
        vocalizationUrl:
            'https://example.com/meditation_audio_${index + 1}.mp3',
        soundUrl: index % 3 == 0
            ? 'https://example.com/background_audio_${index + 1}.mp3'
            : '',
        contentUrl: null,
        status: 'active',
        createdAt: '2023-${(index % 12) + 1}-${(index % 28) + 1}',
        psychologist: psychologist,
      ),
    );

    // Filter by search if provided
    final filteredMeditations = search != null && search.isNotEmpty
        ? allMeditations
            .where((m) =>
                m.title.toLowerCase().contains(search.toLowerCase()) ||
                m.description.toLowerCase().contains(search.toLowerCase()))
            .toList()
        : allMeditations;

    // Paginate results
    final startIndex = (page - 1) * limit;
    final endIndex = startIndex + limit < filteredMeditations.length
        ? startIndex + limit
        : filteredMeditations.length;

    return startIndex < filteredMeditations.length
        ? filteredMeditations.sublist(startIndex, endIndex)
        : [];
  }

  // Mock data for blogs
  static List<BlogModel> _getMockBlogs(int page, int limit, String? search) {
    final psychologist = Psychologist(
      id: 1,
      name: 'Dr. John Doe',
      surname: 'Doe',
    );

    final allBlogs = List.generate(
      40,
      (index) => BlogModel(
        id: index + 1,
        psycId: 1,
        title: 'Blog Post ${index + 1}',
        description:
            'This is a sample blog post description for item ${index + 1}',
        content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        contentType: 'article',
        backgroundUrl:
            'https://via.placeholder.com/300x200?text=Blog+${index + 1}',
        vocalizationUrl: index % 2 == 0
            ? 'https://example.com/blog_vocal_${index + 1}.mp3'
            : null,
        soundUrl: null,
        publishedAt: '2023-${(index % 12) + 1}-${(index % 28) + 1}',
        status: 'active',
        createdAt: '2023-${(index % 12) + 1}-${(index % 28) + 1}',
        psychologist: psychologist,
      ),
    );

    // Filter by search if provided
    final filteredBlogs = search != null && search.isNotEmpty
        ? allBlogs
            .where((b) =>
                b.title.toLowerCase().contains(search.toLowerCase()) ||
                b.description.toLowerCase().contains(search.toLowerCase()))
            .toList()
        : allBlogs;

    // Paginate results
    final startIndex = (page - 1) * limit;
    final endIndex = startIndex + limit < filteredBlogs.length
        ? startIndex + limit
        : filteredBlogs.length;

    return startIndex < filteredBlogs.length
        ? filteredBlogs.sublist(startIndex, endIndex)
        : [];
  }

  // Mock data for tests
  static List<TestModel> _getMockTests(int page, int limit, String? search) {
    final allTests = List.generate(
      30,
      (index) => TestModel(
        id: index + 1,
        title: 'Psychological Test ${index + 1}',
        description:
            'This test helps evaluate your ${index % 5 == 0 ? 'anxiety' : index % 5 == 1 ? 'depression' : index % 5 == 2 ? 'stress' : index % 5 == 3 ? 'personality' : 'cognitive abilities'}',
        isActive: true,
        testImage: 'https://via.placeholder.com/300x200?text=Test+${index + 1}',
        status: 'active',
        createdAt: '2023-${(index % 12) + 1}-${(index % 28) + 1}',
        questions: [],
      ),
    );

    // Filter by search if provided
    final filteredTests = search != null && search.isNotEmpty
        ? allTests
            .where((t) =>
                t.title.toLowerCase().contains(search.toLowerCase()) ||
                t.description.toLowerCase().contains(search.toLowerCase()))
            .toList()
        : allTests;

    // Paginate results
    final startIndex = (page - 1) * limit;
    final endIndex = startIndex + limit < filteredTests.length
        ? startIndex + limit
        : filteredTests.length;

    return startIndex < filteredTests.length
        ? filteredTests.sublist(startIndex, endIndex)
        : [];
  }
}
