import 'package:flutter/material.dart';
import 'package:flutter_nexa/providers/user_provider.dart';
import 'package:flutter_nexa/utils/app_colors.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_nexa/services/api_service.dart';

class UnsplashScreen extends StatefulWidget {
  const UnsplashScreen({super.key});

  @override
  State<UnsplashScreen> createState() => _UnsplashScreenState();
}

class _UnsplashScreenState extends State<UnsplashScreen> {
  @override
  void initState() {
    super.initState();
    // 2 saniye bekledikten sonra kontrol işlemini başlat
    Future.delayed(const Duration(seconds: 2), () {
      // Initialize the user provider
      // ignore: use_build_context_synchronously
      ApiService.initUserProvider(context);
      checkCredentials();
    });
  }

  Future<void> checkCredentials() async {
    final prefs = await SharedPreferences.getInstance();

    // Kayıtlı email ve şifre var mı kontrol et
    final String? email = prefs.getString('email');
    final String? password = prefs.getString('password');

    if (email != null && password != null) {
      // Giriş bilgileri varsa, login isteği yap
      await attemptLogin(email, password);
    } else {
      // Giriş bilgileri yoksa login sayfasına yönlendir
      navigateToLogin();
    }
  }

  Future<void> attemptLogin(String email, String password) async {
    try {
      final response = await ApiService.login(email, password, context);

      if (mounted) {
        if (response.status && response.data != null) {
          // Başarılı giriş, ana sayfaya yönlendir
          navigateToHome();
        } else {
          // Giriş başarısız, login sayfasına yönlendir
          navigateToLogin();
        }
      }
    } catch (e) {
      if (mounted) {
        // Hata durumunda login sayfasına yönlendir
        navigateToLogin();
      }
    }
  }

  void navigateToHome() {
    Navigator.of(context).pushReplacementNamed('/home');
  }

  void navigateToLogin() {
    Navigator.of(context).pushReplacementNamed('/login');
  }

  @override
  Widget build(BuildContext context) {
    // Get user data from provider to display
    Provider.of<UserProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.primaryColor,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SvgPicture.asset(
              'assets/svg/n-logo-white.svg',
              width: 180,
              height: 270,
            ),
          ],
        ),
      ),
    );
  }
}
