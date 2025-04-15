import 'package:flutter/material.dart';
import 'package:flutter_nexa/models/api_models.dart';
import 'package:flutter_nexa/providers/user_provider.dart';
import 'package:flutter_nexa/screens/audio_record_screen.dart';
import 'package:flutter_nexa/screens/meditation_detail_screen.dart';
import 'package:flutter_nexa/screens/blog_detail_screen.dart';
import 'package:flutter_nexa/screens/meditation_list_screen.dart';
import 'package:flutter_nexa/screens/blog_list_screen.dart';
import 'package:flutter_nexa/screens/test_list_screen.dart';
import 'package:flutter_nexa/screens/breathing_exercise_list_screen.dart';
import 'package:flutter_nexa/services/api_service.dart';
import 'package:flutter_nexa/utils/app_colors.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _isLoading = true;
  List<TestModel> _tests = [];
  List<MeditationModel> _meditations = [];
  List<BlogModel> _blogs = [];

  @override
  void initState() {
    super.initState();
    ApiService.initUserProvider(context);
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final tests = await ApiService.getTests();
      final meditations = await ApiService.getMeditations();
      final blogs = await ApiService.getBlogs();

      setState(() {
        _tests = tests;
        _meditations = meditations;
        _blogs = blogs;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      print('Error loading data: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context);
    final user = userProvider.user;

    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadData,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Greeting
                    SafeArea(
                      child: Padding(
                        padding: const EdgeInsets.only(top: 8.0),
                        child: Text(
                          'Merhaba, ${user?.name ?? 'Kullanıcı'}',
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Meditations section
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Meditasyonlar',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    const MeditationListScreen(),
                              ),
                            );
                          },
                          child: Row(
                            children: [
                              Text(
                                'Tümünü Gör',
                                style: TextStyle(
                                  color: AppColors.primaryColor,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(width: 4),
                              Icon(
                                Icons.arrow_forward,
                                size: 16,
                                color: AppColors.primaryColor,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      height: 200,
                      child: _meditations.isEmpty
                          ? const Center(
                              child: Text('Henüz meditasyon bulunmamaktadır.'),
                            )
                          : ListView.builder(
                              scrollDirection: Axis.horizontal,
                              itemCount: _meditations.length,
                              itemBuilder: (context, index) {
                                return _buildMeditationCard(
                                    _meditations[index]);
                              },
                            ),
                    ),
                    const SizedBox(height: 32),

                    // Blogs section
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Bloglar',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const BlogListScreen(),
                              ),
                            );
                          },
                          child: Row(
                            children: [
                              Text(
                                'Tümünü Gör',
                                style: TextStyle(
                                  color: AppColors.primaryColor,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(width: 4),
                              Icon(
                                Icons.arrow_forward,
                                size: 16,
                                color: AppColors.primaryColor,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _blogs.isEmpty
                        ? const Center(
                            child: Text('Henüz blog bulunmamaktadır.'),
                          )
                        : ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _blogs.length > 3 ? 3 : _blogs.length,
                            itemBuilder: (context, index) {
                              return _buildBlogCard(_blogs[index]);
                            },
                          ),
                    const SizedBox(height: 32),

                    // Tests section
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Testler',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const TestListScreen(),
                              ),
                            );
                          },
                          child: Row(
                            children: [
                              Text(
                                'Tümünü Gör',
                                style: TextStyle(
                                  color: AppColors.primaryColor,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(width: 4),
                              Icon(
                                Icons.arrow_forward,
                                size: 16,
                                color: AppColors.primaryColor,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _tests.isEmpty
                        ? const Center(
                            child: Text('Henüz test bulunmamaktadır.'),
                          )
                        : ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _tests.length > 3 ? 3 : _tests.length,
                            itemBuilder: (context, index) {
                              return _buildTestCard(_tests[index]);
                            },
                          ),
                    const SizedBox(height: 32),

                    // Preview of breathing exercises
                    SizedBox(
                      height: 100,
                      child: Center(
                        child: ElevatedButton.icon(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    const BreathingExerciseListScreen(),
                              ),
                            );
                          },
                          icon: const Icon(Icons.air),
                          label: const Text('Nefes Egzersizlerine Göz At'),
                          style: ElevatedButton.styleFrom(
                            foregroundColor: Colors.white,
                            backgroundColor: AppColors.primaryColor,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 20,
                              vertical: 12,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),
                    // Preview of breathing exercises
                    SizedBox(
                      height: 100,
                      child: Center(
                        child: ElevatedButton.icon(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const AudioRecordScreen(),
                              ),
                            );
                          },
                          icon: const Icon(Icons.album),
                          label: const Text('Sesli Chat'),
                          style: ElevatedButton.styleFrom(
                            foregroundColor: Colors.white,
                            backgroundColor: AppColors.primaryColor,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 20,
                              vertical: 12,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildMeditationCard(MeditationModel meditation) {
    String imageUrl = '';
    if (meditation.backgroundUrl.isNotEmpty) {
      imageUrl = meditation.backgroundUrl.startsWith('/')
          ? 'https://bulunlanbunuda.psynexa.com${meditation.backgroundUrl}'
          : 'https://bulunlanbunuda.psynexa.com/${meditation.backgroundUrl}';
    }

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) =>
                MeditationDetailScreen(meditation: meditation),
          ),
        );
      },
      child: Container(
        width: 150,
        margin: const EdgeInsets.only(right: 16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
          color: Colors.white,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            ClipRRect(
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(12)),
              child: meditation.backgroundUrl.isNotEmpty
                  ? Image.network(
                      imageUrl,
                      height: 100,
                      width: 150,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Container(
                          height: 100,
                          width: 150,
                          color: Colors.grey.shade200,
                          child: const Icon(Icons.spa, color: Colors.grey),
                        );
                      },
                    )
                  : Container(
                      height: 100,
                      width: 150,
                      color: Colors.grey.shade200,
                      child: const Icon(Icons.spa, color: Colors.grey),
                    ),
            ),
            // Content
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    meditation.title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${meditation.duration} dk',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(Icons.play_circle_outline,
                          size: 16, color: AppColors.primaryColor),
                      const SizedBox(width: 4),
                      Text(
                        'Dinle',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppColors.primaryColor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBlogCard(BlogModel blog) {
    String imageUrl = '';
    if (blog.backgroundUrl.isNotEmpty) {
      imageUrl = blog.backgroundUrl.startsWith('/')
          ? 'https://bulunlanbunuda.psynexa.com${blog.backgroundUrl}'
          : 'https://bulunlanbunuda.psynexa.com/${blog.backgroundUrl}';
    }

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => BlogDetailScreen(blog: blog),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
          color: Colors.white,
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            ClipRRect(
              borderRadius:
                  const BorderRadius.horizontal(left: Radius.circular(12)),
              child: blog.backgroundUrl.isNotEmpty
                  ? Image.network(
                      imageUrl,
                      height: 90,
                      width: 90,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Container(
                          height: 90,
                          width: 90,
                          color: Colors.grey.shade200,
                          child: const Icon(Icons.article, color: Colors.grey),
                        );
                      },
                    )
                  : Container(
                      height: 90,
                      width: 90,
                      color: Colors.grey.shade200,
                      child: const Icon(Icons.article, color: Colors.grey),
                    ),
            ),
            // Content
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      blog.title,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      blog.description,
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey.shade600,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (blog.vocalizationUrl != null &&
                        blog.vocalizationUrl!.isNotEmpty) ...[
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(Icons.headphones,
                              size: 16, color: AppColors.primaryColor),
                          const SizedBox(width: 4),
                          Text(
                            'Sesli Dinle',
                            style: TextStyle(
                              fontSize: 12,
                              color: AppColors.primaryColor,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTestCard(TestModel test) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
        color: Colors.white,
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              test.title,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              test.description,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey.shade600,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                ElevatedButton(
                  onPressed: () {
                    // Navigate to test detail screen
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryColor,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text('Testi Çöz'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
