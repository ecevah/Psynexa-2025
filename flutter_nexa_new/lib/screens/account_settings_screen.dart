import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_nexa/models/user_model.dart';
import 'package:flutter_nexa/providers/user_provider.dart';
import 'package:flutter_nexa/services/api_service.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class AccountSettingsScreen extends StatefulWidget {
  const AccountSettingsScreen({super.key});

  @override
  State<AccountSettingsScreen> createState() => _AccountSettingsScreenState();
}

class _AccountSettingsScreenState extends State<AccountSettingsScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _surnameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _dobController = TextEditingController();

  File? _selectedPhoto;
  bool _isLoading = false;
  String? _errorMessage;
  String? _successMessage;
  String _selectedGender = 'male'; // Default

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _surnameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _dobController.dispose();
    super.dispose();
  }

  void _loadUserData() {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    final user = userProvider.user;

    if (user != null) {
      _nameController.text = user.name;
      _surnameController.text = user.surname;
      _emailController.text = user.email;
      _phoneController.text = user.phone ?? '';

      if (user.dateOfBirth != null) {
        try {
          final date = DateTime.parse(user.dateOfBirth!);
          _dobController.text = DateFormat('yyyy-MM-dd').format(date);
        } catch (e) {
          _dobController.text = '';
        }
      }

      if (user.sex != null) {
        _selectedGender = user.sex!.toLowerCase();
      }
    }
  }

  Future<void> _selectDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _dobController.text.isNotEmpty
          ? DateTime.parse(_dobController.text)
          : DateTime(1990),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );

    if (picked != null) {
      setState(() {
        _dobController.text = DateFormat('yyyy-MM-dd').format(picked);
      });
    }
  }

  Future<void> _pickImage(ImageSource source) async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: source);

    if (image != null) {
      setState(() {
        _selectedPhoto = File(image.path);
      });
    }
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
                  _pickImage(ImageSource.gallery);
                },
              ),
              ListTile(
                leading: const Icon(Icons.photo_camera),
                title: const Text('Kamera ile Çek'),
                onTap: () {
                  Navigator.of(context).pop();
                  _pickImage(ImageSource.camera);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _uploadProfilePhoto() async {
    if (_selectedPhoto == null) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _successMessage = null;
    });

    try {
      final userProvider = Provider.of<UserProvider>(context, listen: false);
      final user = userProvider.user;

      if (user == null) {
        setState(() {
          _errorMessage = 'Kullanıcı bilgileri bulunamadı';
          _isLoading = false;
        });
        return;
      }

      final result = await ApiService.updateProfilePhoto(
        userId: user.id,
        photoFile: _selectedPhoto!,
      );

      if (result['status'] == true) {
        // Reload user data from API to get the updated photo URL
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
        _errorMessage = 'Bir hata oluştu: $e';
      });
    }
  }

  Future<void> _updateProfile() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _successMessage = null;
    });

    try {
      final userProvider = Provider.of<UserProvider>(context, listen: false);
      final user = userProvider.user;

      if (user == null) {
        setState(() {
          _errorMessage = 'Kullanıcı bilgileri bulunamadı';
          _isLoading = false;
        });
        return;
      }

      final result = await ApiService.updateProfile(
        userId: user.id,
        name: _nameController.text,
        surname: _surnameController.text,
        email: _emailController.text,
        phone: _phoneController.text,
        dateOfBirth: _dobController.text,
        sex: _selectedGender,
      );

      // Upload photo if selected
      if (_selectedPhoto != null) {
        await _uploadProfilePhoto();
        return; // Photo upload will handle the success/error messages
      }

      // If we didn't upload a photo, reload user data and update UI
      if (result['status'] == true) {
        await ApiService.reloadUserData(context);

        setState(() {
          _isLoading = false;
          _successMessage = 'Profil başarıyla güncellendi';
        });
      } else {
        setState(() {
          _isLoading = false;
          _errorMessage =
              result['message'] ?? 'Profil güncellenirken bir hata oluştu';
        });
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
        _errorMessage = 'Bir hata oluştu: $e';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context);
    final user = userProvider.user;

    if (user == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Hesap Ayarları'),
          centerTitle: true,
          backgroundColor: Colors.white,
          foregroundColor: Colors.black,
          elevation: 0,
        ),
        body: const Center(child: Text('Kullanıcı bilgileri yüklenemedi')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Hesap Ayarları'),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Profile Photo
            GestureDetector(
              onTap: _showImagePickerOptions,
              child: Stack(
                alignment: Alignment.bottomRight,
                children: [
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.grey[200],
                      image: _selectedPhoto != null
                          ? DecorationImage(
                              image: FileImage(_selectedPhoto!),
                              fit: BoxFit.cover,
                            )
                          : user.photo != null && user.photo!.isNotEmpty
                              ? DecorationImage(
                                  image: NetworkImage(
                                    "https://bulunlanbunuda.psynexa.com/${user.photo}?v=${DateTime.now().millisecondsSinceEpoch}",
                                  ),
                                  fit: BoxFit.cover,
                                )
                              : null,
                    ),
                    child: (user.photo == null || user.photo!.isEmpty) &&
                            _selectedPhoto == null
                        ? const Icon(Icons.person, size: 60, color: Colors.grey)
                        : null,
                  ),
                  CircleAvatar(
                    radius: 18,
                    backgroundColor: Theme.of(context).primaryColor,
                    child: const Icon(
                      Icons.camera_alt,
                      size: 18,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Error Message
            if (_errorMessage != null)
              Container(
                padding: const EdgeInsets.all(10),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.red[50],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.error, color: Colors.red),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _errorMessage!,
                        style: const TextStyle(color: Colors.red),
                      ),
                    ),
                  ],
                ),
              ),

            // Success Message
            if (_successMessage != null)
              Container(
                padding: const EdgeInsets.all(10),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.green[50],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle, color: Colors.green),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _successMessage!,
                        style: const TextStyle(color: Colors.green),
                      ),
                    ),
                  ],
                ),
              ),

            // Form
            Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      labelText: 'İsim',
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Lütfen isminizi giriniz';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _surnameController,
                    decoration: const InputDecoration(
                      labelText: 'Soyisim',
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Lütfen soyisminizi giriniz';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _emailController,
                    decoration: const InputDecoration(
                      labelText: 'E-posta',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.emailAddress,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Lütfen e-posta adresinizi giriniz';
                      }
                      if (!value.contains('@') || !value.contains('.')) {
                        return 'Geçerli bir e-posta adresi giriniz';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _phoneController,
                    decoration: const InputDecoration(
                      labelText: 'Telefon',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.phone,
                  ),
                  const SizedBox(height: 16),
                  InkWell(
                    onTap: _selectDate,
                    child: IgnorePointer(
                      child: TextFormField(
                        controller: _dobController,
                        decoration: const InputDecoration(
                          labelText: 'Doğum Tarihi',
                          border: OutlineInputBorder(),
                          suffixIcon: Icon(Icons.calendar_today),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Lütfen doğum tarihinizi giriniz';
                          }
                          return null;
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    decoration: const InputDecoration(
                      labelText: 'Cinsiyet',
                      border: OutlineInputBorder(),
                    ),
                    value: _selectedGender,
                    items: const [
                      DropdownMenuItem(value: 'male', child: Text('Erkek')),
                      DropdownMenuItem(value: 'female', child: Text('Kadın')),
                      DropdownMenuItem(value: 'other', child: Text('Diğer')),
                    ],
                    onChanged: (value) {
                      if (value != null) {
                        setState(() {
                          _selectedGender = value;
                        });
                      }
                    },
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).primaryColor,
                        foregroundColor: Colors.white,
                      ),
                      onPressed: _isLoading ? null : _updateProfile,
                      child: _isLoading
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text('Bilgilerimi Güncelle'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
