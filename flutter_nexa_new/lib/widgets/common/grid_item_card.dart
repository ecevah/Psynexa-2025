import 'package:flutter/material.dart';
import 'package:flutter_nexa/utils/app_colors.dart';

class GridItemCard extends StatelessWidget {
  final String title;
  final String description;
  final String imageUrl;
  final VoidCallback onTap;
  final int duration; // in minutes
  final String author;
  final Color backgroundColor;
  final IconData? topRightIcon;

  const GridItemCard({
    Key? key,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.onTap,
    this.duration = 0,
    this.author = '',
    this.backgroundColor = Colors.white,
    this.topRightIcon,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Check if the imageUrl is from the API or a local asset
    bool isNetworkImage = imageUrl.startsWith('http');
    bool isApiPathImage = imageUrl.startsWith('/');
    String fullImageUrl = isApiPathImage
        ? 'https://bulunlanbunuda.psynexa.com$imageUrl'
        : imageUrl;

    return Card(
      clipBehavior: Clip.antiAlias,
      elevation: 3,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image with duration badge
            Stack(
              children: [
                // Image
                SizedBox(
                  height: 140,
                  width: double.infinity,
                  child: isNetworkImage || isApiPathImage
                      ? Image.network(
                          fullImageUrl,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Container(
                              color: backgroundColor,
                              child: Center(
                                child: Icon(
                                  Icons.image_not_supported,
                                  color: Colors.grey,
                                  size: 40,
                                ),
                              ),
                            );
                          },
                        )
                      : Image.asset(
                          'assets/images/placeholders/placeholder_image.jpg',
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Container(
                              color: backgroundColor,
                              child: Center(
                                child: Icon(
                                  topRightIcon ?? Icons.image,
                                  color: Colors.grey,
                                  size: 40,
                                ),
                              ),
                            );
                          },
                        ),
                ),

                // Duration badge (if provided)
                if (duration > 0)
                  Positioned(
                    bottom: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black.withAlpha(178),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.access_time,
                            color: Colors.white,
                            size: 14,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '$duration dk',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                // Top right icon (if provided)
                if (topRightIcon != null)
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: AppColors.primaryColor,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        topRightIcon,
                        color: Colors.white,
                        size: 16,
                      ),
                    ),
                  ),
              ],
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title
                  Text(
                    title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),

                  // Description
                  Text(
                    description,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[700],
                    ),
                  ),

                  // Author (if provided)
                  if (author.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(
                          Icons.person,
                          size: 14,
                          color: AppColors.primaryColor,
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            author,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppColors.primaryColor,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
