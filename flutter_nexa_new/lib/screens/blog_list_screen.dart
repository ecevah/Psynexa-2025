import 'package:flutter/material.dart';
import 'package:flutter_nexa/models/api_models.dart';
import 'package:flutter_nexa/screens/blog_player_screen.dart';
import 'package:flutter_nexa/services/content_service.dart';
import 'package:flutter_nexa/utils/app_colors.dart';
import 'package:flutter_nexa/widgets/common/grid_item_card.dart';
import 'package:flutter_nexa/widgets/common/infinite_grid_list.dart';

class BlogListScreen extends StatelessWidget {
  const BlogListScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InfiniteGridList<BlogModel>(
      title: 'Blog Yazıları',
      fetchItems: _fetchBlogs,
      itemBuilder: _buildBlogItem,
      showSearchBar: true,
      crossAxisCount: 2,
      initialLimit: 10,
      emptyMessage: 'Henüz blog yazısı bulunamadı',
      emptyIcon: Icons.article,
    );
  }

  Future<List<BlogModel>> _fetchBlogs(int page, int limit) async {
    return await ContentService.fetchBlogs(
      page: page,
      limit: limit,
    );
  }

  Widget _buildBlogItem(BuildContext context, BlogModel blog) {
    // Extract author full name from psychologist
    String authorName = blog.psychologist.name;
    if (blog.psychologist.surname != null &&
        blog.psychologist.surname!.isNotEmpty) {
      authorName += ' ${blog.psychologist.surname}';
    }

    // Determine icon based on whether vocalization is available
    final hasVocalization =
        blog.vocalizationUrl != null && blog.vocalizationUrl!.isNotEmpty;

    return GridItemCard(
      title: blog.title,
      description: blog.description,
      imageUrl: blog.backgroundUrl,
      author: authorName,
      backgroundColor: AppColors.primaryColor.withAlpha(25),
      topRightIcon: hasVocalization ? Icons.headset : Icons.article,
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => BlogPlayerScreen(blog: blog),
          ),
        );
      },
    );
  }
}
