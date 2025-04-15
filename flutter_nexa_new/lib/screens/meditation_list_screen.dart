import 'package:flutter/material.dart';
import 'package:flutter_nexa/models/api_models.dart';
import 'package:flutter_nexa/screens/meditation_player_screen.dart';
import 'package:flutter_nexa/services/content_service.dart';
import 'package:flutter_nexa/utils/app_colors.dart';
import 'package:flutter_nexa/widgets/common/grid_item_card.dart';
import 'package:flutter_nexa/widgets/common/infinite_grid_list.dart';

class MeditationListScreen extends StatelessWidget {
  const MeditationListScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InfiniteGridList<MeditationModel>(
      title: 'Meditasyonlar',
      fetchItems: _fetchMeditations,
      itemBuilder: _buildMeditationItem,
      showSearchBar: true,
      crossAxisCount: 2,
      initialLimit: 10,
      emptyMessage: 'Henüz meditasyon bulunamadı',
      emptyIcon: Icons.self_improvement,
    );
  }

  Future<List<MeditationModel>> _fetchMeditations(int page, int limit) async {
    return await ContentService.fetchMeditations(
      page: page,
      limit: limit,
    );
  }

  Widget _buildMeditationItem(
      BuildContext context, MeditationModel meditation) {
    // Extract author full name from psychologist
    String authorName = meditation.psychologist.name;
    if (meditation.psychologist.surname != null &&
        meditation.psychologist.surname!.isNotEmpty) {
      authorName += ' ${meditation.psychologist.surname}';
    }

    return GridItemCard(
      title: meditation.title,
      description: meditation.description,
      imageUrl: meditation.backgroundUrl,
      duration: meditation.duration,
      author: authorName,
      backgroundColor: AppColors.primaryColor.withAlpha(25),
      topRightIcon: Icons.headphones,
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) =>
                MeditationPlayerScreen(meditation: meditation),
          ),
        );
      },
    );
  }
}
