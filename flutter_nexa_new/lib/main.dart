import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_nexa/providers/user_provider.dart';
import 'package:flutter_nexa/screens/home_screen.dart';
import 'package:flutter_nexa/screens/login_screen.dart';
import 'package:flutter_nexa/screens/main_screen.dart';
import 'package:flutter_nexa/screens/register_screen.dart';
import 'package:flutter_nexa/screens/unsplash_screen.dart';
import 'package:flutter_nexa/screens/chatbot_screen.dart';
import 'package:flutter_nexa/services/api_service.dart';
import 'package:flutter_nexa/utils/app_colors.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:audio_session/audio_session.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    // Initialize audio session for background playback
    final session = await AudioSession.instance;
    await session.configure(const AudioSessionConfiguration.music());
  } catch (e) {
    print("Error initializing audio session: $e");
  }

  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
  ]);

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => UserProvider(),
      child: MaterialApp(
        title: 'Psynexa',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primaryColor: AppColors.primaryColor,
          textTheme: GoogleFonts.poppinsTextTheme(Theme.of(context).textTheme),
          colorScheme: ColorScheme.fromSwatch().copyWith(
            primary: AppColors.primaryColor,
            secondary: AppColors.primaryColor.withOpacity(0.8),
          ),
        ),
        initialRoute: '/splash',
        routes: {
          '/splash': (context) => const UnsplashScreen(),
          '/login': (context) => const LoginScreen(),
          '/register': (context) => const RegisterScreen(),
          '/home': (context) => const MainScreen(),
          '/chatbot': (context) => const ChatbotScreen(),
        },
      ),
    );
  }
}

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  bool _isLoading = true;
  bool _isLoggedIn = false;

  @override
  void initState() {
    super.initState();
    _checkLoginStatus();
  }

  Future<void> _checkLoginStatus() async {
    final isLoggedIn = await ApiService.isLoggedIn();

    setState(() {
      _isLoggedIn = isLoggedIn;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (_isLoggedIn) {
      return const HomeScreen();
    } else {
      return const LoginScreen();
    }
  }
}
