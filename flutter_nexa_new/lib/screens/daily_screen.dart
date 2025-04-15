import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:flutter_nexa/utils/app_colors.dart';
import 'package:flutter_nexa/widgets/custom_appbar.dart';
import 'package:flutter_nexa/screens/choose_mood_screen.dart';
import 'package:google_fonts/google_fonts.dart';

class DailyScreen extends StatefulWidget {
  const DailyScreen({super.key});

  @override
  State<DailyScreen> createState() => _DailyScreenState();
}

class _DailyScreenState extends State<DailyScreen> {
  TextEditingController dropdownController =
      TextEditingController(text: 'Weekly');
  bool isMonthlyView = false;

  List<DailyMood> getMonthlyMoods() {
    final now = DateTime.now();
    final firstDayOfMonth = DateTime(now.year, now.month, 1);
    final lastDayOfMonth = DateTime(now.year, now.month + 1, 0);

    List<DailyMood> monthlyMoods = [];

    for (var i = 1; i <= lastDayOfMonth.day; i++) {
      final date = DateTime(now.year, now.month, i);
      // Mock data - you can replace this with actual data
      Mood mood;
      if (i % 7 == 1 || i % 7 == 4 || i == 20) {
        mood = Mood.overjoyed;
      } else if (i % 7 == 2 || i % 7 == 5 || i == 19) {
        mood = Mood.angry;
      } else if (i % 7 == 3 || i % 7 == 6) {
        mood = Mood.happy;
      } else if (i == 11 || i == 12 || i == 21) {
        mood = Mood.depressed;
      } else if (i == 23 || i == 24 || i == 29) {
        mood = Mood.sad;
      } else if (i == 30 || i == 31) {
        mood = Mood.placeholder;
      } else {
        mood = Mood.overjoyed;
      }
      monthlyMoods.add(DailyMood(mood: mood, date: date));
    }
    return monthlyMoods;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          isMonthlyView ? 'Monthly Mood Tracker' : 'Daily Mood Tracker',
          style: GoogleFonts.dmSans(
            color: Colors.black,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 24),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 24),
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xff9D9D9D).withOpacity(0.15),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding:
                        const EdgeInsets.only(top: 24, left: 12, right: 12),
                    child: Row(
                      children: [
                        Text(
                          '${isMonthlyView ? 'Monthly' : 'Weekly'} Mood',
                          style: GoogleFonts.dmSans(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const Spacer(),
                        Container(
                          height: 50,
                          width: 125,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(100),
                            border: Border.all(
                              color: AppColors.borderGray,
                            ),
                          ),
                          child: Theme(
                            data: Theme.of(context).copyWith(
                              // Make dropdown menu rectangular with slight rounded corners
                              popupMenuTheme: PopupMenuThemeData(
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(4),
                                ),
                              ),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: isMonthlyView ? 'Monthly' : 'Weekly',
                                items:
                                    ['Weekly', 'Monthly'].map((String value) {
                                  return DropdownMenuItem<String>(
                                    value: value,
                                    child: Padding(
                                      padding:
                                          const EdgeInsets.only(left: 16.0),
                                      child: Text(
                                        value,
                                        style: GoogleFonts.dmSans(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                  );
                                }).toList(),
                                onChanged: (value) {
                                  setState(() {
                                    isMonthlyView = value == 'Monthly';
                                  });
                                },
                                icon: const Padding(
                                  padding: EdgeInsets.only(right: 8.0),
                                  child: Icon(Icons.arrow_drop_down),
                                ),
                                // Container with rounded corners, but dropdown list will have different shape
                                borderRadius: BorderRadius.circular(30),
                                menuMaxHeight: 300,
                                isExpanded: true,
                              ),
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  if (!isMonthlyView) ...[
                    SizedBox(
                      height: 90,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        shrinkWrap: true,
                        padding: const EdgeInsets.only(left: 12),
                        itemCount: dailyMoods.length,
                        itemBuilder: (context, index) {
                          final englishDays = [
                            'Mon',
                            'Tue',
                            'Wed',
                            'Thu',
                            'Fri',
                            'Sat',
                            'Sun'
                          ];
                          return Container(
                            width: 48,
                            height: 90,
                            margin: const EdgeInsets.only(right: 12),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color:
                                    dailyMoods[index].mood == Mood.placeholder
                                        ? Colors.black
                                        : Colors.transparent,
                              ),
                              color: dailyMoods[index].mood.color,
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  "${dailyMoods[index].date.day.toString()} \n ${englishDays[dailyMoods[index].date.weekday - 1]} ",
                                  style: GoogleFonts.dmSans(
                                    color: AppColors.palette950,
                                    fontSize: 12,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 6),
                                // Use the actual mood SVGs from assets
                                _buildMoodSvg(dailyMoods[index].mood, 32)
                              ],
                            ),
                          );
                        },
                      ),
                    ),
                  ] else ...[
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              'Mon',
                              'Tue',
                              'Wed',
                              'Thu',
                              'Fri',
                              'Sat',
                              'Sun'
                            ]
                                .map((day) => SizedBox(
                                      width: 35,
                                      child: Text(
                                        day,
                                        style: GoogleFonts.dmSans(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w500,
                                        ),
                                        textAlign: TextAlign.center,
                                      ),
                                    ))
                                .toList(),
                          ),
                          const SizedBox(height: 4),
                          GridView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            gridDelegate:
                                const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 7,
                              mainAxisSpacing: 4,
                              crossAxisSpacing: 4,
                              childAspectRatio: 0.8,
                            ),
                            itemCount: getMonthlyMoods().length,
                            itemBuilder: (context, index) {
                              final mood = getMonthlyMoods()[index];
                              return Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Center(child: _buildMoodSvg(mood.mood, 24)),
                                  const SizedBox(height: 2),
                                  Text(
                                    '${mood.date.day}',
                                    style: GoogleFonts.dmSans(
                                      fontSize: 11,
                                    ),
                                  ),
                                ],
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  ],
                  const SizedBox(height: 24),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Container(
              width: double.infinity,
              margin: const EdgeInsets.symmetric(horizontal: 24),
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                color: const Color(0xffE1EFFD),
              ),
              child: Stack(
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      Text(
                        'Write down your daily mood.',
                        style: GoogleFonts.dmSans(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        'Record your mood today and start understanding yourself better.',
                        style: GoogleFonts.dmSans(
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const ChooseMoodScreen()),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primaryColor,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                        ),
                        child: Text(
                          'How Are You Feeling?',
                          style: GoogleFonts.dmSans(),
                        ),
                      ),
                    ],
                  ),
                  Positioned(
                    right: 0,
                    bottom: 0,
                    child: SvgPicture.asset('assets/svg/feelings.svg'),
                  )
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  // Helper method to build mood SVGs with fallback
  Widget _buildMoodSvg(Mood mood, double size) {
    if (mood == Mood.placeholder) {
      return SvgPicture.asset(
        'assets/svg/moods/placeholder.svg',
        width: size,
        height: size,
        fit: BoxFit.contain,
      );
    }

    return SvgPicture.asset(
      'assets/svg/moods/${mood.name.toLowerCase()}.svg',
      width: size,
      height: size,
      fit: BoxFit.contain,
    );
  }
}

enum Mood {
  sad(color: AppColors.sadBg),
  happy(color: AppColors.happyBg),
  overjoyed(color: AppColors.overenjoyedBg),
  angry(color: AppColors.angryBg),
  depressed(color: AppColors.depressedBg),
  placeholder(color: Colors.white);

  final Color color;
  const Mood({required this.color});
}

List<DailyMood> dailyMoods = [
  DailyMood(mood: Mood.happy, date: DateTime.now()),
  DailyMood(
      mood: Mood.angry, date: DateTime.now().add(const Duration(days: 1))),
  DailyMood(mood: Mood.sad, date: DateTime.now().add(const Duration(days: 2))),
  DailyMood(
      mood: Mood.depressed, date: DateTime.now().add(const Duration(days: 3))),
  DailyMood(
      mood: Mood.overjoyed, date: DateTime.now().add(const Duration(days: 4))),
  DailyMood(
      mood: Mood.placeholder,
      date: DateTime.now().add(const Duration(days: 5))),
  DailyMood(
      mood: Mood.placeholder,
      date: DateTime.now().add(const Duration(days: 6))),
];

class DailyMood {
  final Mood mood;
  final DateTime date;
  DailyMood({required this.mood, required this.date});
}
