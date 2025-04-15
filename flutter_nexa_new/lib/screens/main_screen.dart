import 'package:flutter/material.dart';
import 'package:flutter_nexa/screens/home_screen.dart';
import 'package:flutter_nexa/screens/profile_screen.dart';
import 'package:flutter_nexa/screens/discover_screen.dart';
import 'package:flutter_nexa/screens/daily_screen.dart';
import 'package:flutter_nexa/screens/audio_record_screen.dart';
import 'package:flutter_nexa/widgets/custom_bottom_nav_bar.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const HomeScreen(),
    const DiscoverScreen(),
    const AudioRecordScreen(),
    const DailyScreen(),
    const ProfileScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: CustomBottomNavBar(
        currentIndex: _currentIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}
