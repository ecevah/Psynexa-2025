import 'package:flutter/material.dart';
import 'package:flutter_nexa/models/api_models.dart';
import 'package:flutter_nexa/services/content_service.dart';
import 'package:flutter_nexa/utils/app_colors.dart';
import 'package:flutter_nexa/widgets/common/grid_item_card.dart';
import 'package:flutter_nexa/widgets/common/infinite_grid_list.dart';

class TestListScreen extends StatelessWidget {
  const TestListScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InfiniteGridList<TestModel>(
      title: 'Psikolojik Testler',
      fetchItems: _fetchTests,
      itemBuilder: _buildTestItem,
      showSearchBar: true,
      crossAxisCount: 2,
      initialLimit: 10,
      emptyMessage: 'Henüz test bulunamadı',
      emptyIcon: Icons.quiz,
    );
  }

  Future<List<TestModel>> _fetchTests(int page, int limit) async {
    return await ContentService.fetchTests(
      page: page,
      limit: limit,
    );
  }

  Widget _buildTestItem(BuildContext context, TestModel test) {
    // Calculate approximate completion time
    final int questionCount = test.questions.length;
    final int estimatedMinutes =
        (questionCount * 20) ~/ 60; // Assuming 20 seconds per question

    return GridItemCard(
      title: test.title,
      description: test.description,
      imageUrl: test.testImage,
      duration:
          estimatedMinutes > 0 ? estimatedMinutes : 1, // At least 1 minute
      backgroundColor: AppColors.primaryColor.withAlpha(25),
      topRightIcon: Icons.psychology,
      onTap: () {
        // Navigate to test screen (to be implemented)
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Test başlayacak: ${test.title}'),
            behavior: SnackBarBehavior.floating,
          ),
        );
        // In a real app, you would navigate to a test screen
        // Navigator.push(
        //   context,
        //   MaterialPageRoute(
        //     builder: (context) => TestScreen(test: test),
        //   ),
        // );
      },
    );
  }
}
