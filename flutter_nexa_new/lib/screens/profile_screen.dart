import 'package:flutter/material.dart';
import 'package:flutter_nexa/models/user_model.dart';
import 'package:flutter_nexa/providers/user_provider.dart';
import 'package:flutter_nexa/screens/account_settings_screen.dart';
import 'package:flutter_nexa/services/api_service.dart';
import 'package:flutter_nexa/utils/app_colors.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _surnameController;
  late TextEditingController _emailController;
  late TextEditingController _phoneController;
  late TextEditingController _dateOfBirthController;
  String _gender = 'male';
  bool _isEditing = false;
  bool _isLoading = false;
  String? _errorMessage;
  String? _successMessage;
  DateTime? _selectedDate;

  // Toggle değerleri için state
  bool _emailNotification = true;
  bool _phoneNotification = false;

  @override
  void initState() {
    super.initState();
    ApiService.initUserProvider(context);

    // Initialize with user's data
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    final user = userProvider.user;

    if (user != null) {
      _nameController = TextEditingController(text: user.name);
      _surnameController = TextEditingController(text: user.surname);
      _emailController = TextEditingController(text: user.email);
      _phoneController = TextEditingController(text: user.phone);
      _dateOfBirthController = TextEditingController(text: user.dateOfBirth);
      _gender = user.sex;

      if (user.dateOfBirth.isNotEmpty) {
        try {
          _selectedDate = DateTime.parse(user.dateOfBirth);
        } catch (e) {
          print('Error parsing date: $e');
        }
      }
    } else {
      _nameController = TextEditingController();
      _surnameController = TextEditingController();
      _emailController = TextEditingController();
      _phoneController = TextEditingController();
      _dateOfBirthController = TextEditingController();
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _surnameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _dateOfBirthController.dispose();
    super.dispose();
  }

  Future<void> _logout() async {
    await ApiService.logout(context);
    if (mounted) {
      Navigator.of(context).pushReplacementNamed('/login');
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime(2000),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );

    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
        _dateOfBirthController.text = DateFormat('yyyy-MM-dd').format(picked);
      });
    }
  }

  Future<void> _updateProfile() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _successMessage = null;
    });

    final userProvider = Provider.of<UserProvider>(context, listen: false);
    final user = userProvider.user;

    if (user == null) {
      setState(() {
        _errorMessage = 'Kullanıcı bilgileri bulunamadı';
        _isLoading = false;
      });
      return;
    }

    try {
      final result = await ApiService.updateProfile(
        userId: user.id,
        name: _nameController.text.trim(),
        surname: _surnameController.text.trim(),
        email: _emailController.text.trim(),
        phone: _phoneController.text.trim(),
        dateOfBirth: _dateOfBirthController.text.trim(),
        sex: _gender,
      );

      setState(() {
        _isLoading = false;
        if (result['status'] == true) {
          _successMessage = result['message'];
          _isEditing = false;
        } else {
          _errorMessage = result['message'];
        }
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Bir hata oluştu: $e';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context);
    final user = userProvider.user;

    if (user == null) {
      return const Scaffold(
        body: Center(child: Text('Kullanıcı bilgileri yüklenemedi')),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFAFAFAFA), // #FAFAFA arka plan
      appBar: AppBar(
        title: Padding(
          padding: const EdgeInsets.only(top: 44.0, bottom: 20),
          child: const Text(
            'Profile',
            style: TextStyle(
              color: Color(0xFF0B1215),
              fontFamily: 'Urbanist',
              fontSize: 32,
              fontWeight: FontWeight.w600,
              height: 1.0,
              letterSpacing: -0.64,
            ),
          ),
        ),
        backgroundColor: const Color(0xFAFAFAFA),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. BÖLÜM - Profil Bilgileri
              _buildProfileInfo(),

              const SizedBox(height: 24),

              // 2. BÖLÜM - Ayarlar Kartı
              _buildSettingsCard(),

              const SizedBox(height: 24),

              // 3. BÖLÜM - Bildirimler Kartı
              _buildNotificationsCard(),

              const SizedBox(height: 24),

              // 4. BÖLÜM - Diğer Seçenekler Kartı
              _buildOthersCard(),

              const SizedBox(height: 24),

              // 5. BÖLÜM - Profil Eylemleri
              _buildProfileActions(userProvider),
            ],
          ),
        ),
      ),
    );
  }

  // 1. BÖLÜM - Profil Bilgileri
  Widget _buildProfileInfo() {
    final userProvider = Provider.of<UserProvider>(context);
    final user = userProvider.user;

    if (user == null) {
      return Container(
        padding: const EdgeInsets.all(16),
        child: const Center(
          child: Text("Kullanıcı bilgileri yüklenemedi"),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Profil resmi ve adı
          Row(
            children: [
              // Profil resmi
              GestureDetector(
                onTap: () => _showImagePickerOptions(),
                child: Stack(
                  children: [
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(40),
                        border: Border.all(
                          color: Colors.grey.shade200,
                          width: 1,
                        ),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(40),
                        child: user.photo != null && user.photo!.isNotEmpty
                            ? Image.network(
                                'https://bulunlanbunuda.psynexa.com/${user.photo}?v=${DateTime.now().millisecondsSinceEpoch}',
                                width: 80,
                                height: 80,
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) {
                                  return Center(
                                    child: Icon(
                                      Icons.person,
                                      size: 40,
                                      color: Colors.grey.shade400,
                                    ),
                                  );
                                },
                              )
                            : Center(
                                child: Icon(
                                  Icons.person,
                                  size: 40,
                                  color: Colors.grey.shade400,
                                ),
                              ),
                      ),
                    ),
                    Positioned(
                      right: 0,
                      bottom: 0,
                      child: Container(
                        width: 24,
                        height: 24,
                        decoration: BoxDecoration(
                          color: Colors.blue,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          Icons.camera_alt,
                          color: Colors.white,
                          size: 14,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 16),

              // İsim ve durum
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${user.name} ${user.surname}',
                      style: const TextStyle(
                        color: Color(0xFF0B1215),
                        fontFamily: 'Urbanist',
                        fontSize: 20,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      user.email,
                      style: TextStyle(
                        color: Colors.grey.shade600,
                        fontFamily: 'Urbanist',
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          if (_errorMessage != null)
            Padding(
              padding: const EdgeInsets.only(top: 16),
              child: Text(
                _errorMessage!,
                style: const TextStyle(color: Colors.red),
              ),
            ),

          if (_successMessage != null)
            Padding(
              padding: const EdgeInsets.only(top: 16),
              child: Text(
                _successMessage!,
                style: const TextStyle(color: Colors.green),
              ),
            ),
        ],
      ),
    );
  }

  Future<void> _showImagePickerOptions() async {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SafeArea(
          child: Wrap(
            children: <Widget>[
              ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('Galeriden Seç'),
                onTap: () {
                  Navigator.of(context).pop();
                  _uploadProfilePhoto(source: 'gallery');
                },
              ),
              ListTile(
                leading: const Icon(Icons.photo_camera),
                title: const Text('Kamera ile Çek'),
                onTap: () {
                  Navigator.of(context).pop();
                  _uploadProfilePhoto(source: 'camera');
                },
              ),
            ],
          ),
        );
      },
    );
  }

  // 2. BÖLÜM - Ayarlar Kartı
  Widget _buildSettingsCard() {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            offset: const Offset(0, 1),
            blurRadius: 6,
            color: const Color(0xff9D9D9D).withOpacity(0.15),
          ),
        ],
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Başlık
          const Text(
            'Settings',
            style: TextStyle(
              color: Color(0xFF0B1215),
              fontFamily: 'Urbanist',
              fontSize: 20,
              fontWeight: FontWeight.w600,
              height: 1.2, // 120% line-height (24px)
            ),
          ),

          const SizedBox(height: 16),

          // Settings Item
          _buildSettingItem(
            icon: 'assets/icons/setting.svg',
            title: 'Account Settings',
            onTap: () {
              // Navigate to the account settings screen
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const AccountSettingsScreen(),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  // 3. BÖLÜM - Bildirimler Kartı
  Widget _buildNotificationsCard() {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            offset: const Offset(0, 1),
            blurRadius: 6,
            color: const Color(0xff9D9D9D).withOpacity(0.15),
          ),
        ],
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Başlık
          const Text(
            'Notification',
            style: TextStyle(
              color: Color(0xFF0B1215),
              fontFamily: 'Urbanist',
              fontSize: 20,
              fontWeight: FontWeight.w600,
              height: 1.2, // 120% line-height (24px)
            ),
          ),

          const SizedBox(height: 16),

          // Email Notification Toggle
          _buildNotificationToggle(
            icon: 'assets/icons/message.svg',
            title: 'Email Notification',
            value: _emailNotification,
            onChanged: (value) {
              setState(() {
                _emailNotification = value;
              });
            },
          ),

          const SizedBox(height: 16),

          // Phone Notification Toggle
          _buildNotificationToggle(
            icon: 'assets/icons/call.svg',
            title: 'Phone Notification',
            value: _phoneNotification,
            onChanged: (value) {
              setState(() {
                _phoneNotification = value;
              });
            },
          ),
        ],
      ),
    );
  }

  // 4. BÖLÜM - Diğer Seçenekler Kartı
  Widget _buildOthersCard() {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            offset: const Offset(0, 1),
            blurRadius: 6,
            color: const Color(0xff9D9D9D).withOpacity(0.15),
          ),
        ],
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Başlık
          const Text(
            'Others',
            style: TextStyle(
              color: Color(0xFF0B1215),
              fontFamily: 'Urbanist',
              fontSize: 20,
              fontWeight: FontWeight.w600,
              height: 1.2, // 120% line-height (24px)
            ),
          ),

          const SizedBox(height: 16),

          // About Us Item
          _buildSettingItem(
            icon: 'assets/icons/help-line.svg',
            title: 'About Us',
            onTap: () {
              // Hakkımızda sayfasına yönlendirme
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Hakkımızda sayfası açılacak')),
              );
            },
          ),

          const SizedBox(height: 16),

          // Logout Item
          _buildSettingItem(
            icon: 'assets/icons/logout.svg',
            title: 'Logout',
            onTap: _logout,
          ),
        ],
      ),
    );
  }

  // Ayar öğesi (Setting Item) widget'ı
  Widget _buildSettingItem({
    required String icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          children: [
            // İkon Container
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(99),
                color: const Color(0xFFE0F1FE),
              ),
              child: Center(
                child: SvgPicture.asset(
                  icon,
                  width: 24,
                  height: 24,
                ),
              ),
            ),

            const SizedBox(width: 12),

            // Başlık
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  color: Color(0xFF0B1215),
                  fontFamily: 'Urbanist',
                  fontSize: 17,
                  fontWeight: FontWeight.w500,
                  height: 1.2, // 120% line-height (20.4px)
                ),
              ),
            ),

            // Sağ ok ikonu
            SvgPicture.asset(
              'assets/icons/arrow-right-black.svg',
              width: 24,
              height: 24,
            ),
          ],
        ),
      ),
    );
  }

  // Bildirim toggle widget'ı
  Widget _buildNotificationToggle({
    required String icon,
    required String title,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          // İkon Container
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(99),
              color: const Color(0xFFE0F1FE),
            ),
            child: Center(
              child: SvgPicture.asset(
                icon,
                width: 24,
                height: 24,
              ),
            ),
          ),

          const SizedBox(width: 12),

          // Başlık
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                color: Color(0xFF0B1215),
                fontFamily: 'Urbanist',
                fontSize: 17,
                fontWeight: FontWeight.w500,
                height: 1.2, // 120% line-height (20.4px)
              ),
            ),
          ),

          // Toggle switch
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: Colors.blue,
            inactiveThumbColor: Colors.grey,
            trackOutlineColor: const WidgetStatePropertyAll(Colors.grey),
            trackOutlineWidth: const WidgetStatePropertyAll(1.2),
          ),
        ],
      ),
    );
  }

  // Upload profile photo
  Future<void> _uploadProfilePhoto({required String source}) async {
    try {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
        _successMessage = null;
      });

      // Use image_picker to get image from gallery or camera
      final picker = ImagePicker();
      final XFile? pickedImage = await (source == 'gallery'
          ? picker.pickImage(source: ImageSource.gallery)
          : picker.pickImage(source: ImageSource.camera));

      if (pickedImage == null) {
        setState(() {
          _isLoading = false;
        });
        return;
      }

      // Get user
      final userProvider = Provider.of<UserProvider>(context, listen: false);
      final user = userProvider.user;

      if (user == null) {
        setState(() {
          _errorMessage = 'Kullanıcı bilgileri bulunamadı';
          _isLoading = false;
        });
        return;
      }

      // Upload photo
      final result = await ApiService.updateProfilePhoto(
        userId: user.id,
        photoFile: File(pickedImage.path),
      );

      if (result['status'] == true) {
        // Reload user data to get latest photo
        await ApiService.reloadUserData(context);

        setState(() {
          _isLoading = false;
          _successMessage = 'Profil fotoğrafı başarıyla güncellendi';
        });
      } else {
        setState(() {
          _isLoading = false;
          _errorMessage =
              result['message'] ?? 'Fotoğraf yüklenirken bir hata oluştu';
        });
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
        _errorMessage = 'Fotoğraf yüklenirken bir hata oluştu: $e';
      });
    }
  }

  Widget _buildProfileActions(UserProvider userProvider) {
    // Add account settings and logout buttons
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        children: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: Colors.black87,
                elevation: 1,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                  side: BorderSide(color: Colors.grey.shade300),
                ),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const AccountSettingsScreen(),
                  ),
                );
              },
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.settings,
                      size: 20, color: Theme.of(context).primaryColor),
                  const SizedBox(width: 8),
                  const Text('Hesap Ayarları'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red.shade50,
                foregroundColor: Colors.red,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              onPressed: _logout,
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.logout, size: 20),
                  SizedBox(width: 8),
                  Text('Çıkış Yap'),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
