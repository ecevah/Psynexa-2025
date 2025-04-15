import 'package:flutter/foundation.dart';
import 'package:flutter_nexa/models/user_model.dart';

class UserProvider with ChangeNotifier {
  UserModel? _user;
  String? _accessToken;
  String? _refreshToken;

  UserModel? get user => _user;
  String? get accessToken => _accessToken;
  String? get refreshToken => _refreshToken;

  bool get isLoggedIn => _user != null && _accessToken != null;

  void setUser(UserModel user) {
    _user = user;
    notifyListeners();
  }

  void setTokens(String accessToken, String refreshToken) {
    _accessToken = accessToken;
    _refreshToken = refreshToken;
    notifyListeners();
  }

  void updateUserData({
    String? name,
    String? surname,
    String? username,
    String? photo,
    String? phone,
  }) {
    if (_user == null) return;

    _user = UserModel(
      id: _user!.id,
      name: name ?? _user!.name,
      surname: surname ?? _user!.surname,
      username: username ?? _user!.username,
      email: _user!.email,
      emailVerified: _user!.emailVerified,
      dateOfBirth: _user!.dateOfBirth,
      sex: _user!.sex,
      phone: phone ?? _user!.phone,
      photo: photo ?? _user!.photo,
      casualMode: _user!.casualMode,
      status: _user!.status,
      createdAt: _user!.createdAt,
      updatedAt: _user!.updatedAt,
    );

    notifyListeners();
  }

  void clear() {
    _user = null;
    _accessToken = null;
    _refreshToken = null;
    notifyListeners();
  }
}
