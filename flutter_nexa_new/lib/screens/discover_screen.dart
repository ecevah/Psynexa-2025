import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_nexa/models/api_models.dart';
import 'package:flutter_nexa/screens/meditation_detail_screen.dart';
import 'package:flutter_nexa/screens/blog_detail_screen.dart';
import 'package:flutter_nexa/screens/meditation_list_screen.dart';
import 'package:flutter_nexa/screens/blog_list_screen.dart';
import 'package:flutter_nexa/screens/breathing_exercise_list_screen.dart';
import 'package:flutter_nexa/services/api_service.dart';
import 'package:flutter_nexa/utils/app_colors.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:cached_network_image/cached_network_image.dart';

class DiscoverScreen extends StatefulWidget {
  const DiscoverScreen({super.key});

  @override
  State<DiscoverScreen> createState() => _DiscoverScreenState();
}

class _DiscoverScreenState extends State<DiscoverScreen>
    with SingleTickerProviderStateMixin {
  final TextEditingController _searchController = TextEditingController();
  late TabController _tabController;
  bool _isLoading = false;
  bool _isSearching = false;
  String _searchQuery = '';

  List<MeditationModel> _meditations = [];
  List<BlogModel> _blogs = [];

  // Search results
  List<dynamic> _searchResults = [];
  Map<String, int> _searchCounts = {};

  @override
  void initState() {
    super.initState();

    // Create tab controller but keep loading minimal
    _tabController = TabController(length: 2, vsync: this);

    // Initialize with empty data
    setState(() {
      _meditations = [];
      _blogs = [];
      _isLoading = false;
    });

    // Optional: Load data with delay to prevent initial load crash
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) {
        _loadData();
      }
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    if (!mounted) return;

    setState(() {
      _isLoading = true;
    });

    try {
      // Use Future.wait to load data in parallel
      final results = await Future.wait([
        ApiService.getMeditations().catchError((e) {
          print('Failed to load meditations: $e');
          return <MeditationModel>[];
        }),
        ApiService.getBlogs().catchError((e) {
          print('Failed to load blogs: $e');
          return <BlogModel>[];
        }),
      ]);

      if (!mounted) return;

      setState(() {
        _meditations = results[0] as List<MeditationModel>;
        _blogs = results[1] as List<BlogModel>;
        _isLoading = false;
      });
    } catch (e) {
      print('Global error in _loadData: $e');
      if (!mounted) return;

      setState(() {
        _meditations = [];
        _blogs = [];
        _isLoading = false;
      });
    }
  }

  Future<void> _search(String query) async {
    if (query.isEmpty) {
      setState(() {
        _isSearching = false;
        _searchResults = [];
        _searchCounts = {};
      });
      return;
    }

    setState(() {
      _isSearching = true;
      _isLoading = true;
      _searchQuery = query;
    });

    try {
      final result = await ApiService.searchByTitle(query);

      // Widget hala mounted mı kontrol et
      if (!mounted) return;

      if (result['status'] == true && result['data'] != null) {
        final data = result['data'];

        // Process search results
        List<dynamic> results = [];
        Map<String, int> counts = {};

        try {
          // Add meditations from search results
          if (data['meditations'] != null && data['meditations'].isNotEmpty) {
            for (var item in data['meditations']) {
              try {
                results.add({
                  'type': 'meditation',
                  'data': MeditationModel(
                    id: item['id'] ?? 0,
                    psycId: 0, // Not provided in search results
                    title: item['title'] ?? 'Untitled',
                    description: item['description'] ?? '',
                    content: '', // Not provided in search results
                    duration: item['duration'] ?? 0,
                    backgroundUrl: item['background_url'] ?? '',
                    vocalizationUrl: '', // Not provided in search results
                    soundUrl: '', // Not provided in search results
                    status: '', // Not provided in search results
                    createdAt: '', // Not provided in search results
                    psychologist: Psychologist(
                        id: 0, name: ''), // Not provided in search results
                  ),
                });
              } catch (e) {
                print('Error processing meditation item: $e');
                // Continue with next item
              }
            }
          }

          // Add blogs from search results
          if (data['blogs'] != null && data['blogs'].isNotEmpty) {
            for (var item in data['blogs']) {
              try {
                results.add({
                  'type': 'blog',
                  'data': BlogModel(
                    id: item['id'] ?? 0,
                    psycId: 0, // Not provided in search results
                    title: item['title'] ?? 'Untitled',
                    description: item['description'] ?? '',
                    content: '', // Not provided in search results
                    contentType: '', // Not provided in search results
                    status: '', // Not provided in search results
                    backgroundUrl: item['background_url'] ?? '',
                    createdAt: '', // Not provided in search results
                    psychologist: Psychologist(
                        id: 0, name: ''), // Not provided in search results
                  ),
                });
              } catch (e) {
                print('Error processing blog item: $e');
                // Continue with next item
              }
            }
          }

          // Get counts
          if (data['counts'] != null) {
            counts = {
              'blogs': data['counts']['blogs'] ?? 0,
              'meditations': data['counts']['meditations'] ?? 0,
              'total': data['counts']['total'] ?? 0,
            };
          }
        } catch (e) {
          print('Error processing search results: $e');
          // Boş listelerle devam et
        }

        setState(() {
          _searchResults = results;
          _searchCounts = counts;
          _isLoading = false;
        });
      } else {
        setState(() {
          _searchResults = [];
          _searchCounts = {};
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Search API error: $e');

      // Widget hala mounted mı kontrol et
      if (!mounted) return;

      setState(() {
        _isLoading = false;
        // Hata durumunda _isSearching'i false yaparak ana içeriğe dönülmesini sağla
        _isSearching = false;
      });

      // Kullanıcıya bilgi ver
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Arama yapılırken bir hata oluştu')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Dismiss keyboard when tapping outside search field
        FocusScope.of(context).unfocus();
      },
      child: Scaffold(
        backgroundColor: const Color(0xFAFAFAFA), // #FAFAFA arka plan rengi
        appBar: AppBar(
          title: Padding(
            padding: const EdgeInsets.only(top: 44.0, bottom: 20),
            child: const Text(
              'Explore',
              style: TextStyle(
                color: Color(0xFF0B1215), // #0B1215
                fontFamily: 'Urbanist',
                fontSize: 32,
                fontWeight: FontWeight.w600,
                height: 1.0, // 100% line-height
                letterSpacing: -0.64,
              ),
            ),
          ),
          backgroundColor:
              const Color(0xFAFAFAFA), // AppBar'ın da arka planını değiştir
          elevation: 0,
          bottom: PreferredSize(
            preferredSize: const Size.fromHeight(80),
            child: Column(
              children: [
                // Search bar
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius:
                          BorderRadius.circular(100), // 100px border-radius
                      border: Border.all(
                        color: const Color(0xFFCACAD7), // #CACAD7 border
                        width: 0.1,
                      ),
                      color: Colors.white, // #FFF
                      boxShadow: const [
                        BoxShadow(
                          offset: Offset(0, 1),
                          blurRadius: 6,
                          color: Color.fromRGBO(157, 157, 157, 0.10),
                        ),
                      ],
                    ),
                    child: TextField(
                      controller: _searchController,
                      style: const TextStyle(
                        color: Color(0xFF0B1215), // #0B1215
                        fontFamily: 'Poppins',
                        fontSize: 14,
                        fontWeight: FontWeight.w300,
                        height: 22 / 14, // 157.143% line-height
                      ),
                      decoration: InputDecoration(
                        hintText: 'Arama yap...',
                        hintStyle: TextStyle(
                          color: const Color(0xFF0B1215).withOpacity(0.5),
                          fontFamily: 'Poppins',
                          fontSize: 14,
                          fontWeight: FontWeight.w300,
                          height: 22 / 14, // 157.143% line-height
                        ),
                        prefixIcon: Padding(
                          padding: const EdgeInsets.all(10.0),
                          child: SvgPicture.asset(
                            'assets/icons/search-icon.svg',
                            width: 24,
                            height: 24,
                          ),
                        ),
                        suffixIcon: _searchController.text.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear),
                                onPressed: () {
                                  _searchController.clear();
                                  _search('');
                                  // Dismiss keyboard when clearing search
                                  FocusScope.of(context).unfocus();
                                },
                              )
                            : null,
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(
                            vertical: 12, horizontal: 16),
                      ),
                      // Add keyboard action type
                      textInputAction: TextInputAction.search,
                      // Handle keyboard submission
                      onSubmitted: (value) {
                        _search(value);
                        FocusScope.of(context).unfocus();
                      },
                      onChanged: (value) {
                        // Perform search after a small delay
                        Future.delayed(const Duration(milliseconds: 500), () {
                          if (value == _searchController.text) {
                            _search(value);
                          }
                        });
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 8),
              ],
            ),
          ),
        ),
        body: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _isSearching
                ? _buildSearchResults()
                : _buildHomeContent(),
      ),
    );
  }

  Widget _buildSearchResults() {
    if (_searchResults.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.search_off, size: 48, color: Colors.grey),
            const SizedBox(height: 16),
            Text(
              '"$_searchQuery" ile ilgili sonuç bulunamadı',
              style: const TextStyle(
                fontSize: 16,
                color: Colors.grey,
              ),
            ),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Arama Sonuçları: $_searchQuery',
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            'Toplam ${_searchCounts['total'] ?? 0} sonuç bulundu',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey.shade600,
            ),
          ),
          const SizedBox(height: 16),

          // Results
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _searchResults.length,
            itemBuilder: (context, index) {
              // Index kontrolü
              if (index >= _searchResults.length) {
                return const SizedBox.shrink();
              }

              try {
                final result = _searchResults[index];
                final type = result['type'];
                final data = result['data'];

                if (type == 'meditation') {
                  return _buildMeditationCard(data);
                } else if (type == 'blog') {
                  return _buildArticleCard(data);
                }
              } catch (e) {
                print('Error building search result: $e');
              }

              return const SizedBox.shrink();
            },
          ),
        ],
      ),
    );
  }

  Widget _buildHomeContent() {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Grid - Categories
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              childAspectRatio: 2.5, // Wider cards
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              children: [
                _buildCategoryCard(
                  title: 'Meditations',
                  imagePath: 'assets/images/explore-meditation-card-photo.jpeg',
                  onTap: () {
                    _safeNavigate(context, const MeditationListScreen());
                  },
                ),
                _buildCategoryCard(
                  title: 'Blogs',
                  imagePath: 'assets/images/explore-blog-card-photo.jpeg',
                  onTap: () {
                    _safeNavigate(context, const BlogListScreen());
                  },
                ),
                _buildCategoryCard(
                  title: 'Articles',
                  imagePath: 'assets/images/explore-article-card-photo.jpeg',
                  onTap: () {
                    _safeNavigate(context, const BlogListScreen());
                  },
                ),
                _buildCategoryCard(
                  title: 'Sleep',
                  imagePath: 'assets/images/explore-sleep-card-photo.jpeg',
                  onTap: () {
                    _safeNavigate(context, const BreathingExerciseListScreen());
                  },
                ),
                _buildCategoryCard(
                  title: 'Thought',
                  imagePath: 'assets/images/explore-thought-card-photo.jpeg',
                  onTap: () {
                    _safeNavigate(context, const MeditationListScreen());
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Section title
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              'Meditations, Articles & Blog',
              style: const TextStyle(
                color: Colors.black,
                fontFamily: 'Urbanist',
                fontSize: 18,
                fontWeight: FontWeight.w600,
                height: 20 / 18, // line-height equivalent
              ),
              textAlign: TextAlign.center,
            ),
          ),

          const SizedBox(height: 16),

          // Horizontal scrollable cards
          SizedBox(
            height: 52,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.only(left: 24),
              children: [
                _buildTopicCard(
                  label: 'Special for Business Life',
                  icon: 'business',
                ),
                _buildTopicCard(
                  label: 'Journeys',
                  icon: 'star',
                ),
                _buildTopicCard(
                  label: 'Guides',
                  icon: 'paper',
                ),
                _buildTopicCard(
                  label: 'Business',
                  icon: 'travel',
                ),
                _buildTopicCard(
                  label: 'Weekly Newsletter',
                  icon: 'newsletter',
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Best Meditations 2024 section header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Section title
                Text(
                  'Best Meditations 2024',
                  style: const TextStyle(
                    color: Colors.black,
                    fontFamily: 'Urbanist',
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    height: 20 / 18, // line-height equivalent
                  ),
                ),

                // See all link
                GestureDetector(
                  onTap: () {
                    _safeNavigate(context, const MeditationListScreen());
                  },
                  child: Row(
                    children: [
                      Text(
                        'See all',
                        style: TextStyle(
                          color: Colors.black.withOpacity(0.5),
                          fontFamily: 'Urbanist',
                          fontSize: 14,
                          fontWeight: FontWeight.w300,
                          height: 20 / 14, // line-height equivalent
                        ),
                      ),
                      const SizedBox(width: 4),
                      Icon(
                        Icons.arrow_forward_ios,
                        size: 12,
                        color: Colors.black45,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Meditation cards horizontal scrollable list
          SizedBox(
            height: 200, // Adjusted to fit the card height plus padding
            child: _meditations.isEmpty
                ? Center(child: Text('Henüz meditasyon bulunmamaktadır.'))
                : ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.only(left: 24),
                    itemCount: _meditations.length,
                    itemBuilder: (context, index) {
                      // Null check ekleyin
                      if (index >= _meditations.length) {
                        return const SizedBox.shrink();
                      }
                      try {
                        return _buildMeditationCardCompact(_meditations[index]);
                      } catch (e) {
                        print('Error building meditation card: $e');
                        return const SizedBox.shrink();
                      }
                    },
                  ),
          ),

          const SizedBox(height: 24),

          // Top of 2024 : Articles section header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Section title
                Text(
                  'Top of 2024 : Articles',
                  style: const TextStyle(
                    color: Color(0xFF0B1215),
                    fontFamily: 'Urbanist',
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    height: 20 / 18, // line-height equivalent
                  ),
                ),

                // See all link
                GestureDetector(
                  onTap: () {
                    _safeNavigate(context, const BlogListScreen());
                  },
                  child: Row(
                    children: [
                      Text(
                        'See all',
                        style: TextStyle(
                          color: Colors.black.withOpacity(0.5),
                          fontFamily: 'Urbanist',
                          fontSize: 14,
                          fontWeight: FontWeight.w300,
                          height: 20 / 14, // line-height equivalent
                        ),
                      ),
                      const SizedBox(width: 4),
                      Icon(
                        Icons.arrow_forward_ios,
                        size: 12,
                        color: Colors.black45,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Article cards vertical list
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: _blogs.isEmpty
                ? Center(child: Text('Henüz blog bulunmamaktadır.'))
                : ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _blogs.length > 3
                        ? 3
                        : _blogs.length, // Limit to 3 items
                    itemBuilder: (context, index) {
                      // Null check ekleyin
                      if (index >= _blogs.length) {
                        return const SizedBox.shrink();
                      }
                      try {
                        return _buildArticleCard(_blogs[index]);
                      } catch (e) {
                        print('Error building article card: $e');
                        return const SizedBox.shrink();
                      }
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryCard({
    required String title,
    required String imagePath,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: () {
        // Tüm butonlar için güvenli navigasyon
        if (!mounted) return;
        try {
          Widget destinationScreen;
          switch (title) {
            case "Meditations":
              destinationScreen = const MeditationListScreen();
              break;
            case "Blogs":
              destinationScreen = const BlogListScreen();
              break;
            case "Articles":
              destinationScreen = const BlogListScreen();
              break;
            case "Sleep":
              destinationScreen = const BreathingExerciseListScreen();
              break;
            case "Thought":
              destinationScreen = const MeditationListScreen();
              break;
            default:
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Bu kategori henüz aktif değil')),
              );
              return;
          }

          Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => destinationScreen),
          );
        } catch (e) {
          print('Navigation error: $e');
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Sayfa açılırken bir hata oluştu')),
            );
          }
        }
      },
      child: Container(
        height: 60,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              offset: const Offset(-1, 1),
              blurRadius: 4,
              color: const Color(0xff9D9D9D).withOpacity(0.1),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Row(
            children: [
              // Image resmini geri getir
              ClipRRect(
                borderRadius: const BorderRadius.all(Radius.circular(10)),
                child: Image.asset(
                  imagePath,
                  width: 48,
                  height: 48,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade200,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(
                        _getIconForLabel(title),
                        color: AppColors.primaryColor,
                      ),
                    );
                  },
                ),
              ),

              // Text
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  child: Text(
                    title,
                    style: const TextStyle(
                      color: Color(0xFF0B1215),
                      fontFamily: 'Urbanist',
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      height: 20 / 14,
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

  Widget _buildTopicCard({
    required String icon,
    required String label,
  }) {
    return Container(
      height: 48,
      margin: const EdgeInsets.only(right: 16, bottom: 4),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            offset: const Offset(-1, 1),
            blurRadius: 6,
            color: const Color(0xff9D9D9D).withOpacity(0.15),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // SVG ikonlarına geri dönüş yapalım (güvenli şekilde)
          SizedBox(
            width: 24,
            height: 24,
            child: Builder(
              builder: (context) {
                try {
                  return SvgPicture.asset(
                    'assets/icons/$icon.svg',
                    width: 24,
                    height: 24,
                    color: AppColors.primaryColor,
                    placeholderBuilder: (context) => Icon(
                      _getIconForLabel(label),
                      size: 24,
                      color: AppColors.primaryColor,
                    ),
                  );
                } catch (e) {
                  print('Error loading SVG icon: $e');
                  return Icon(
                    _getIconForLabel(label),
                    size: 24,
                    color: AppColors.primaryColor,
                  );
                }
              },
            ),
          ),

          const SizedBox(width: 12),

          // Label
          Text(
            label,
            style: const TextStyle(
              color: Color(0xFF0B1215),
              fontFamily: 'Urbanist',
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  // Label'a göre icon seçen yardımcı fonksiyon
  IconData _getIconForLabel(String label) {
    switch (label) {
      case 'Special for Business Life':
      case 'Business':
        return Icons.business;
      case 'Journeys':
        return Icons.star;
      case 'Guides':
        return Icons.book;
      case 'Weekly Newsletter':
        return Icons.mail;
      case 'Meditations':
        return Icons.spa;
      case 'Blogs':
      case 'Articles':
        return Icons.article;
      case 'Sleep':
        return Icons.nightlight_round;
      case 'Thought':
        return Icons.psychology;
      default:
        return Icons.circle;
    }
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
      child: Card(
        elevation: 2,
        shadowColor: Colors.black26,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            AspectRatio(
              aspectRatio: 1,
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(12),
                  ),
                  image: meditation.backgroundUrl.isNotEmpty
                      ? DecorationImage(
                          image: NetworkImage(imageUrl),
                          fit: BoxFit.cover,
                        )
                      : null,
                  color: meditation.backgroundUrl.isEmpty
                      ? Colors.grey.shade300
                      : null,
                ),
                child: meditation.backgroundUrl.isEmpty
                    ? const Icon(Icons.spa, size: 40, color: Colors.grey)
                    : Stack(
                        children: [
                          Positioned(
                            right: 8,
                            bottom: 8,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.black.withOpacity(0.6),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '${meditation.duration} dk',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
              ),
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    meditation.title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    meditation.description,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
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
      child: Card(
        margin: const EdgeInsets.only(bottom: 16),
        elevation: 2,
        shadowColor: Colors.black26,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            AspectRatio(
              aspectRatio: 16 / 9,
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(12),
                  ),
                  image: blog.backgroundUrl.isNotEmpty
                      ? DecorationImage(
                          image: NetworkImage(imageUrl),
                          fit: BoxFit.cover,
                        )
                      : null,
                  color:
                      blog.backgroundUrl.isEmpty ? Colors.grey.shade300 : null,
                ),
                child: blog.backgroundUrl.isEmpty
                    ? const Icon(Icons.article, size: 40, color: Colors.grey)
                    : null,
              ),
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    blog.title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    blog.description,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey.shade700,
                    ),
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Compact meditation card for horizontal scrolling
  Widget _buildMeditationCardCompact(MeditationModel meditation) {
    if (meditation == null) {
      return const SizedBox.shrink();
    }

    final String imageUrl = _getImageUrl(meditation.backgroundUrl);

    return GestureDetector(
      onTap: () {
        _safeNavigate(context, MeditationDetailScreen(meditation: meditation));
      },
      child: Container(
        width: 163,
        margin: const EdgeInsets.only(right: 16, bottom: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image container
            Container(
              width: 163,
              height: 140,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                color: Colors.grey.shade200,
                boxShadow: [
                  BoxShadow(
                    offset: const Offset(0, 1),
                    blurRadius: 4,
                    color: const Color(0xff9D9D9D).withOpacity(0.1),
                  ),
                ],
              ),
              child: Stack(
                children: [
                  // Network resmini göster
                  if (imageUrl.isNotEmpty)
                    Positioned.fill(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: CachedNetworkImage(
                          imageUrl: imageUrl,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => const Center(
                            child: CircularProgressIndicator(strokeWidth: 2),
                          ),
                          errorWidget: (context, url, error) => Container(
                            color: Colors.grey.shade200,
                            child: const Icon(Icons.spa,
                                size: 40, color: Colors.grey),
                          ),
                        ),
                      ),
                    ),

                  // Center play button
                  Center(
                    child: _buildPlayButton(),
                  ),

                  // Top-right "Meditation" label
                  Positioned(
                    top: 0,
                    right: 0,
                    child: Container(
                      margin: const EdgeInsets.only(top: 8, right: 8),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(30),
                        color: Colors.black.withOpacity(0.3),
                      ),
                      child: const Text(
                        'Meditation',
                        style: TextStyle(
                          color: Colors.white,
                          fontFamily: 'Urbanist',
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Title
            Padding(
              padding: const EdgeInsets.only(top: 8, left: 4),
              child: Text(
                meditation.title,
                style: const TextStyle(
                  color: Color(0xFF0B1215),
                  fontFamily: 'Urbanist',
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  height: 20 / 16,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),

            // Author
            Padding(
              padding: const EdgeInsets.only(left: 4),
              child: Text(
                meditation.psychologist?.name ?? 'Unknown Author',
                style: const TextStyle(
                  color: Color(0xFF0B1215),
                  fontFamily: 'Urbanist',
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  height: 20 / 14,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Play button widget helper
  Widget _buildPlayButton() {
    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Colors.white.withOpacity(0.7),
      ),
      child: Center(
        child: Icon(
          Icons.play_arrow,
          color: AppColors.primaryColor,
          size: 30,
        ),
      ),
    );
  }

  // ArticleCard - similar changes to use CachedNetworkImage and extracted widgets
  Widget _buildArticleCard(BlogModel blog) {
    if (blog == null) {
      return const SizedBox.shrink();
    }

    final String imageUrl = _getImageUrl(blog.backgroundUrl);

    return GestureDetector(
      onTap: () {
        _safeNavigate(context, BlogDetailScreen(blog: blog));
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              offset: const Offset(0, 1),
              blurRadius: 4,
              color: const Color(0xff9D9D9D).withOpacity(0.1),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Left: Image
            Stack(
              children: [
                // Network image
                Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    color: Colors.grey.shade200,
                    boxShadow: const [
                      BoxShadow(
                        offset: Offset(0, 2),
                        blurRadius: 4,
                        color: Color.fromRGBO(11, 18, 21, 0.15),
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: imageUrl.isNotEmpty
                        ? CachedNetworkImage(
                            imageUrl: imageUrl,
                            fit: BoxFit.cover,
                            placeholder: (context, url) => const Center(
                              child: CircularProgressIndicator(strokeWidth: 2),
                            ),
                            errorWidget: (context, url, error) => const Icon(
                              Icons.article,
                              size: 30,
                              color: Colors.grey,
                            ),
                          )
                        : const Icon(Icons.article,
                            size: 30, color: Colors.grey),
                  ),
                ),

                // Articles label
                Positioned(
                  top: 0,
                  right: 0,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(30),
                      color: Colors.black.withOpacity(0.3),
                    ),
                    child: const Text(
                      'Articles',
                      style: TextStyle(
                        color: Colors.white,
                        fontFamily: 'Urbanist',
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        height: 20 / 11,
                      ),
                    ),
                  ),
                ),
              ],
            ),

            // Middle: Title and Author info
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Title
                    Text(
                      blog.title,
                      style: const TextStyle(
                        color: Color(0xFF0B1215),
                        fontFamily: 'Urbanist',
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        height: 20 / 14,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),

                    const SizedBox(height: 4),

                    // Author | Duration
                    Text(
                      '${blog.psychologist?.name ?? 'Unknown'} | 3 min read',
                      style: const TextStyle(
                        color: Color(0xFF0B1215),
                        fontFamily: 'Urbanist',
                        fontSize: 14,
                        fontWeight: FontWeight.w400,
                        height: 20 / 14,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ),

            // Right: Arrow button
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: const Color(0xFFE1EFFD),
                borderRadius: BorderRadius.circular(999),
              ),
              child: const Center(
                child: Icon(
                  Icons.arrow_forward,
                  color: Color(0xFF0B1215),
                  size: 20,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Güvenli navigasyon metodu - Tüm navigasyonlar için kullanılabilir
  void _safeNavigate(BuildContext context, Widget destination) {
    if (!mounted) return;
    try {
      Navigator.of(context).push(
        MaterialPageRoute(builder: (_) => destination),
      );
    } catch (e) {
      print('Navigation error: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Sayfa açılırken bir hata oluştu')),
        );
      }
    }
  }

  // Add helper method to format image URLs consistently
  String _getImageUrl(String? backgroundUrl) {
    if (backgroundUrl == null || backgroundUrl.isEmpty) return '';

    try {
      return backgroundUrl.startsWith('/')
          ? 'https://bulunlanbunuda.psynexa.com$backgroundUrl'
          : 'https://bulunlanbunuda.psynexa.com/$backgroundUrl';
    } catch (e) {
      print('Error creating image URL: $e');
      return '';
    }
  }
}
