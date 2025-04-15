import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:flutter_nexa/utils/app_colors.dart';
import 'package:flutter_nexa/widgets/custom_appbar.dart';
import 'package:google_fonts/google_fonts.dart';

import 'daily_screen.dart';

class ChooseMoodScreen extends StatefulWidget {
  const ChooseMoodScreen({super.key});

  @override
  State<ChooseMoodScreen> createState() => _ChooseMoodScreenState();
}

class _ChooseMoodScreenState extends State<ChooseMoodScreen> {
  Mood selectedMood = Mood.happy;
  double moodValue = 5.0;
  final List<Mood> _moods = [
    Mood.depressed,
    Mood.angry,
    Mood.happy,
    Mood.overjoyed
  ];

  final ScrollController _scrollController = ScrollController();
  int currentMoodIndex = 2; // Default to happy (index 2)

  @override
  void initState() {
    super.initState();
    // Wait for the UI to build, then scroll to the selected mood
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollToSelected();
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToSelected() {
    if (_scrollController.hasClients) {
      // Approximate calculation for position
      // Each item is about 120px wide (including margin)
      double position = currentMoodIndex * 120.0;
      double screenWidth = MediaQuery.of(context).size.width;

      // Center the selected mood
      position = position - (screenWidth / 2) + 60;

      // Make sure we don't scroll beyond boundaries
      position =
          position.clamp(0.0, _scrollController.position.maxScrollExtent);

      _scrollController.animateTo(
        position,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  String capitalize(String s) {
    if (s.isEmpty) return s;
    return s[0].toUpperCase() + s.substring(1);
  }

  Widget _buildMoodOption(Mood mood, String label, int index) {
    final isSelected = selectedMood == mood;
    return GestureDetector(
      onTap: () {
        if (selectedMood != mood) {
          // Only update if mood actually changes
          setState(() {
            selectedMood = mood;
            currentMoodIndex = index;
            // Update slider value based on mood
            switch (mood) {
              case Mood.depressed:
                moodValue = 0.5;
                break;
              case Mood.angry:
                moodValue = 2.5;
                break;
              case Mood.happy:
                moodValue = 6.5;
                break;
              case Mood.overjoyed:
                moodValue = 9.0;
                break;
              default:
                moodValue = 6.5;
            }
          });

          // Scroll to the selected mood
          _scrollToSelected();
        }
      },
      child: Column(
        children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            curve: Curves.easeInOut,
            width: isSelected ? 110 : 80,
            height: isSelected ? 110 : 80,
            margin: const EdgeInsets.symmetric(horizontal: 5),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(28),
              border: Border.all(
                color: isSelected ? Colors.black : Colors.transparent,
                width: 2,
              ),
            ),
            child: Center(
              child: _buildMoodSvg(mood, isSelected ? 60 : 48),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            capitalize(label),
            style: GoogleFonts.dmSans(
              color: isSelected ? Colors.black : Colors.black54,
              fontSize: isSelected ? 16 : 14,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
            ),
          ),
        ],
      ),
    );
  }

  // Helper method to build mood SVGs with fallback
  Widget _buildMoodSvg(Mood mood, double size) {
    return SvgPicture.asset(
      'assets/svg/moods/${mood.name.toLowerCase()}.svg',
      width: size * 1.8,
      height: size * 1.8,
      fit: BoxFit.cover,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(
        title: 'Daily Mood Tracker',
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Column(
              children: [
                Text(
                  'We love to hear\nfrom you',
                  style: GoogleFonts.dmSans(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                Text(
                  'How are you today? Everything\nfalls in place when you feel grateful',
                  style: GoogleFonts.dmSans(
                    fontSize: 16,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
            // ListView for horizontal scrolling mood options
            SizedBox(
              height: 150,
              child: ListView(
                controller: _scrollController,
                scrollDirection: Axis.horizontal,
                children: [
                  // Add spacing at the start for better scrolling
                  const SizedBox(width: 20),
                  for (int i = 0; i < _moods.length; i++)
                    _buildMoodOption(
                        _moods[i], _moods[i].toString().split('.').last, i),
                  // Add spacing at the end for better scrolling
                  const SizedBox(width: 20),
                ],
              ),
            ),
            Column(
              children: [
                Row(
                  children: [
                    Text(
                      '0',
                      style: GoogleFonts.dmSans(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Expanded(
                      child: SliderTheme(
                        data: SliderTheme.of(context).copyWith(
                          activeTrackColor: const Color(0xFFE8F1FF),
                          inactiveTrackColor: const Color(0xFFE8F1FF),
                          thumbColor: AppColors.primaryColor,
                          trackHeight: 20,
                          // Custom cursor-shaped thumb using SVG
                          thumbShape: const CustomCursorThumbShape(
                            enabledThumbRadius: 12,
                          ),
                        ),
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            Slider(
                              value: moodValue,
                              min: 0,
                              max: 10,
                              divisions: 20,
                              onChanged: (value) {
                                setState(() {
                                  moodValue = value;
                                  // Update mood based on value for 4 moods
                                  if (value <= 2.5) {
                                    selectedMood = Mood.depressed;
                                    currentMoodIndex = 0;
                                  } else if (value <= 5) {
                                    selectedMood = Mood.angry;
                                    currentMoodIndex = 1;
                                  } else if (value <= 7.5) {
                                    selectedMood = Mood.happy;
                                    currentMoodIndex = 2;
                                  } else {
                                    selectedMood = Mood.overjoyed;
                                    currentMoodIndex = 3;
                                  }
                                });
                                // Scroll to the selected mood when slider changes
                                _scrollToSelected();
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                    Text(
                      '10',
                      style: GoogleFonts.dmSans(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Center(
                  child: Text(
                    moodValue.toStringAsFixed(1),
                    style: GoogleFonts.dmSans(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.primaryColor,
                    ),
                  ),
                ),
                const SizedBox(height: 30),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      // Create the mood object and return to previous screen
                      final mood = DailyMood(
                        mood: selectedMood,
                        date: DateTime.now(),
                      );
                      Navigator.pop(context, mood);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryColor,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    child: Text(
                      'Save to Calendar',
                      style: GoogleFonts.dmSans(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// Custom SliderThumbShape for cursor-shaped thumbs
class CustomCursorThumbShape extends SliderComponentShape {
  final double enabledThumbRadius;

  const CustomCursorThumbShape({
    required this.enabledThumbRadius,
  });

  @override
  Size getPreferredSize(bool isEnabled, bool isDiscrete) {
    return Size.fromRadius(enabledThumbRadius * 2);
  }

  @override
  void paint(
    PaintingContext context,
    Offset center, {
    required Animation<double> activationAnimation,
    required Animation<double> enableAnimation,
    required bool isDiscrete,
    required TextPainter labelPainter,
    required RenderBox parentBox,
    required SliderThemeData sliderTheme,
    required TextDirection textDirection,
    required double value,
    required double textScaleFactor,
    required Size sizeWithOverflow,
  }) {
    final Canvas canvas = context.canvas;

    // Draw a cursor-shaped triangle pointing upward
    final cursorHeight = enabledThumbRadius * 3.0;
    final cursorWidth = enabledThumbRadius * 1.8;

    final paint = Paint()
      ..color = sliderTheme.thumbColor ?? AppColors.primaryColor
      ..style = PaintingStyle.fill;

    final Path path = Path();
    // Draw a triangle that looks like a cursor
    path.moveTo(center.dx, center.dy - cursorHeight * 0.8); // Top point
    path.lineTo(center.dx - cursorWidth / 2,
        center.dy + cursorHeight * 0.2); // Bottom left
    path.lineTo(center.dx + cursorWidth / 2,
        center.dy + cursorHeight * 0.2); // Bottom right
    path.close();

    canvas.drawPath(path, paint);
  }
}
