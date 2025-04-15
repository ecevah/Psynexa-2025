class UserModel {
  final int id;
  final String? psycId;
  final String name;
  final String surname;
  final String username;
  final String email;
  final String? googleId;
  final bool emailVerified;
  final String dateOfBirth;
  final String sex;
  final String phone;
  final String? photo;
  final String? packageId;
  final bool casualMode;
  final String status;
  final String? resetToken;
  final String? resetTokenExpiry;
  final String createdAt;
  final String updatedAt;

  UserModel({
    required this.id,
    this.psycId,
    required this.name,
    required this.surname,
    required this.username,
    required this.email,
    this.googleId,
    required this.emailVerified,
    required this.dateOfBirth,
    required this.sex,
    required this.phone,
    this.photo,
    this.packageId,
    required this.casualMode,
    required this.status,
    this.resetToken,
    this.resetTokenExpiry,
    required this.createdAt,
    required this.updatedAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      psycId: json['psyc_id'],
      name: json['name'],
      surname: json['surname'],
      username: json['username'],
      email: json['email'],
      googleId: json['google_id'],
      emailVerified: json['email_verified'],
      dateOfBirth: json['date_of_birth'],
      sex: json['sex'],
      phone: json['phone'],
      photo: json['photo'],
      packageId: json['package_id'],
      casualMode: json['casual_mode'],
      status: json['status'],
      resetToken: json['reset_token'],
      resetTokenExpiry: json['reset_token_expiry'],
      createdAt: json['created_at'],
      updatedAt: json['updated_at'],
    );
  }
}

class TokenModel {
  final String accessToken;
  final String refreshToken;

  TokenModel({required this.accessToken, required this.refreshToken});

  factory TokenModel.fromJson(Map<String, dynamic> json) {
    return TokenModel(
      accessToken: json['accessToken'],
      refreshToken: json['refreshToken'],
    );
  }
}

class LoginResponse {
  final bool status;
  final String message;
  final LoginData? data;
  final int? statusCode;

  LoginResponse(
      {required this.status,
      required this.message,
      this.data,
      this.statusCode});

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      status: json['status'],
      message: json['message'],
      data: json['data'] != null ? LoginData.fromJson(json['data']) : null,
      statusCode: json['statusCode'],
    );
  }
}

class LoginData {
  final UserModel client;
  final String accessToken;
  final String refreshToken;

  LoginData(
      {required this.client,
      required this.accessToken,
      required this.refreshToken});

  factory LoginData.fromJson(Map<String, dynamic> json) {
    return LoginData(
      client: UserModel.fromJson(json['client']),
      accessToken: json['accessToken'],
      refreshToken: json['refreshToken'],
    );
  }
}

class RegisterResponse {
  final bool status;
  final String message;
  final RegisterData? data;

  RegisterResponse({required this.status, required this.message, this.data});

  factory RegisterResponse.fromJson(Map<String, dynamic> json) {
    return RegisterResponse(
      status: json['status'],
      message: json['message'],
      data: json['data'] != null ? RegisterData.fromJson(json['data']) : null,
    );
  }
}

class RegisterData {
  final UserModel client;
  final String accessToken;
  final String refreshToken;

  RegisterData(
      {required this.client,
      required this.accessToken,
      required this.refreshToken});

  factory RegisterData.fromJson(Map<String, dynamic> json) {
    return RegisterData(
      client: UserModel.fromJson(json['client']),
      accessToken: json['accessToken'],
      refreshToken: json['refreshToken'],
    );
  }
}
