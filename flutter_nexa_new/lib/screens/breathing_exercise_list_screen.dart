import 'package:flutter/material.dart';
import 'package:flutter_nexa/models/breathing_exercise_model.dart';
import 'package:flutter_nexa/services/content_service.dart';
import 'package:flutter_nexa/utils/app_colors.dart';
import 'package:flutter_nexa/widgets/common/grid_item_card.dart';
import 'package:flutter_nexa/widgets/common/infinite_grid_list.dart';

class BreathingExerciseListScreen extends StatelessWidget {
  const BreathingExerciseListScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InfiniteGridList<BreathingExerciseModel>(
      title: 'Nefes Egzersizleri',
      fetchItems: _fetchBreathingExercises,
      itemBuilder: _buildBreathingExerciseItem,
      showSearchBar: true,
      crossAxisCount: 2,
      initialLimit: 10,
      emptyMessage: 'Henüz nefes egzersizi bulunamadı',
      emptyIcon: Icons.air,
    );
  }

  Future<List<BreathingExerciseModel>> _fetchBreathingExercises(
      int page, int limit) async {
    return await ContentService.fetchBreathingExercises(
      page: page,
      limit: limit,
    );
  }

  Widget _buildBreathingExerciseItem(
      BuildContext context, BreathingExerciseModel exercise) {
    // Map difficulty level to icons
    IconData getDifficultyIcon() {
      switch (exercise.difficultyLevel.toLowerCase()) {
        case 'beginner':
          return Icons.sentiment_satisfied;
        case 'intermediate':
          return Icons.sentiment_neutral;
        case 'advanced':
          return Icons.sentiment_very_dissatisfied;
        default:
          return Icons.air;
      }
    }

    return GridItemCard(
      title: exercise.title,
      description: exercise.description,
      imageUrl: exercise.backgroundUrl,
      duration: exercise.duration,
      backgroundColor: AppColors.primaryColor.withAlpha(25),
      topRightIcon: getDifficultyIcon(),
      onTap: () {
        // Navigate to breathing exercise screen (to be implemented)
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Nefes egzersizi başlayacak: ${exercise.title}'),
            behavior: SnackBarBehavior.floating,
          ),
        );
        // In a real app, you would navigate to a breathing exercise screen
        // Navigator.push(
        //   context,
        //   MaterialPageRoute(
        //     builder: (context) => BreathingExerciseScreen(exercise: exercise),
        //   ),
        // );
      },
    );
  }
}
