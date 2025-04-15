import 'package:flutter/material.dart';
import 'package:flutter_nexa/utils/app_colors.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';

class CustomBottomNavBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const CustomBottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 90,
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(
            color: AppColors.borderGray,
            width: 1,
          ),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.only(left: 32, right: 32, bottom: 16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildNavItem(0, 'assets/icons/home.svg', 'Home'),
            _buildNavItem(1, 'assets/icons/discover.svg', 'Discover'),
            _buildCenterButton(context),
            _buildNavItem(3, 'assets/icons/daily.svg', 'Daily'),
            _buildNavItem(4, 'assets/icons/profile.svg', 'Profile'),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, String icon, String label) {
    final bool isSelected = currentIndex == index;

    return InkWell(
      onTap: () => onTap(index),
      child: Padding(
        padding: const EdgeInsets.only(top: 7.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SvgPicture.asset(
              icon,
              width: 24,
              height: 24,
              colorFilter: ColorFilter.mode(
                isSelected
                    ? AppColors.primaryColor
                    : AppColors.palette950WithOpacity,
                BlendMode.srcIn,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: GoogleFonts.dmSans(
                fontSize: 11,
                fontWeight: FontWeight.w400,
                height: 13 / 11,
                color: isSelected
                    ? AppColors.primaryColor
                    : AppColors.palette950WithOpacity,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCenterButton(BuildContext context) {
    return InkWell(
      onTap: () {
        Navigator.of(context).pushNamed('/chatbot');
      },
      child: SizedBox(
        width: 48,
        height: 48,
        child: Container(
          width: 48,
          height: 48,
          decoration: const BoxDecoration(
            color: AppColors.primaryColor,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: SvgPicture.asset(
              'assets/svg/n-logo-white.svg',
              width: 24,
              height: 24,
            ),
          ),
        ),
      ),
    );
  }
}
