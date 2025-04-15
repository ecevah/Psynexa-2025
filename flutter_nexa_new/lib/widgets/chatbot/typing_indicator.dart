import 'package:flutter/material.dart';
import 'package:flutter_nexa/utils/app_colors.dart';

class TypingIndicator extends StatelessWidget {
  final bool isTyping;

  const TypingIndicator({
    Key? key,
    required this.isTyping,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (!isTyping) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      alignment: Alignment.centerLeft,
      child: const Row(
        children: [
          SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(AppColors.primaryColor),
            ),
          ),
          SizedBox(width: 8),
          Text(
            'Nexa writes...',
            style: TextStyle(
              color: Colors.grey,
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }
}
