class BreathingExerciseModel {
  final int id;
  final String title;
  final String description;
  final String instructions;
  final int duration;
  final String backgroundUrl;
  final String? audioUrl;
  final String difficultyLevel; // "beginner", "intermediate", "advanced"
  final String benefitsDescription;
  final String status;
  final String createdAt;

  BreathingExerciseModel({
    required this.id,
    required this.title,
    required this.description,
    required this.instructions,
    required this.duration,
    required this.backgroundUrl,
    this.audioUrl,
    required this.difficultyLevel,
    required this.benefitsDescription,
    required this.status,
    required this.createdAt,
  });

  factory BreathingExerciseModel.fromJson(Map<String, dynamic> json) {
    return BreathingExerciseModel(
      id: json['id'],
      title: json['title'],
      description: json['description'] ?? '',
      instructions: json['instructions'] ?? '',
      duration: json['duration'] ?? 0,
      backgroundUrl: json['background_url'] ?? '',
      audioUrl: json['audio_url'],
      difficultyLevel: json['difficulty_level'] ?? 'beginner',
      benefitsDescription: json['benefits_description'] ?? '',
      status: json['status'] ?? 'active',
      createdAt: json['created_at'] ?? '',
    );
  }
}

// Example breathing exercises (mock data)
List<BreathingExerciseModel> getMockBreathingExercises() {
  return [
    BreathingExerciseModel(
      id: 1,
      title: '4-7-8 Nefes Tekniği',
      description: 'Stres ve anksiyeteyi azaltmak için ideal bir teknik.',
      instructions: '4 saniye nefes al, 7 saniye tut, 8 saniye ver.',
      duration: 5,
      backgroundUrl: '/assets/images/breathing/breathing1.jpg',
      difficultyLevel: 'beginner',
      benefitsDescription:
          'Rahatlamayı sağlar ve uykuya dalmayı kolaylaştırır.',
      status: 'active',
      createdAt: '2023-01-01',
    ),
    BreathingExerciseModel(
      id: 2,
      title: 'Diyafram Nefesi',
      description: 'Sağlıklı nefes alma tekniği.',
      instructions: 'Diyaframdan nefes alıp verin.',
      duration: 10,
      backgroundUrl: '/assets/images/breathing/breathing2.jpg',
      difficultyLevel: 'beginner',
      benefitsDescription:
          'Kan basıncını düşürür ve kalp atış hızını düzenler.',
      status: 'active',
      createdAt: '2023-01-02',
    ),
    BreathingExerciseModel(
      id: 3,
      title: 'Alternatif Burun Nefesi',
      description: 'Odaklanmayı artıran ve dengeyi sağlayan teknik.',
      instructions: 'Bir burun deliğinizden nefes alın, diğerinden verin.',
      duration: 15,
      backgroundUrl: '/assets/images/breathing/breathing3.jpg',
      difficultyLevel: 'intermediate',
      benefitsDescription: 'Zihinsel netlik ve odaklanma sağlar.',
      status: 'active',
      createdAt: '2023-01-03',
    ),
    BreathingExerciseModel(
      id: 4,
      title: 'Kutuya Nefes Alma',
      description: 'Eşit sürelerde nefes alıp verme tekniği.',
      instructions:
          '4 saniye nefes al, 4 saniye tut, 4 saniye ver, 4 saniye bekle.',
      duration: 8,
      backgroundUrl: '/assets/images/breathing/breathing4.jpg',
      difficultyLevel: 'intermediate',
      benefitsDescription: 'Stresi azaltır ve konsantrasyonu artırır.',
      status: 'active',
      createdAt: '2023-01-04',
    ),
    BreathingExerciseModel(
      id: 5,
      title: 'Wim Hof Metodu',
      description: 'Yoğun ve güçlü bir nefes tekniği.',
      instructions:
          '30-40 derin nefes, nefessiz kalma, ve yeniden nefes alma döngüsü.',
      duration: 20,
      backgroundUrl: '/assets/images/breathing/breathing5.jpg',
      difficultyLevel: 'advanced',
      benefitsDescription:
          'Bağışıklık sistemini güçlendirir ve dayanıklılığı artırır.',
      status: 'active',
      createdAt: '2023-01-05',
    ),
    BreathingExerciseModel(
      id: 6,
      title: 'Sakinleştirici Nefes',
      description: 'Hızlı rahatlama için ideal bir teknik.',
      instructions: 'Burundan 4 saniye nefes al, ağızdan 6 saniye ver.',
      duration: 5,
      backgroundUrl: '/assets/images/breathing/breathing6.jpg',
      difficultyLevel: 'beginner',
      benefitsDescription: 'Anksiyeteyi hızla azaltır ve sakinleştirir.',
      status: 'active',
      createdAt: '2023-01-06',
    ),
    BreathingExerciseModel(
      id: 7,
      title: 'Enerji Veren Nefes',
      description: 'Uyanıklık ve enerji veren bir teknik.',
      instructions: 'Hızlı ve güçlü nefes alıp verme.',
      duration: 3,
      backgroundUrl: '/assets/images/breathing/breathing7.jpg',
      difficultyLevel: 'intermediate',
      benefitsDescription: 'Enerji seviyesini artırır ve uyanıklığı destekler.',
      status: 'active',
      createdAt: '2023-01-07',
    ),
    BreathingExerciseModel(
      id: 8,
      title: 'Uyku Öncesi Nefes',
      description: 'Rahatlatıcı ve uykuya hazırlayan bir teknik.',
      instructions: 'Yavaş ve derin nefes alıp verme.',
      duration: 10,
      backgroundUrl: '/assets/images/breathing/breathing8.jpg',
      difficultyLevel: 'beginner',
      benefitsDescription:
          'Uykuya dalmayı kolaylaştırır ve uyku kalitesini artırır.',
      status: 'active',
      createdAt: '2023-01-08',
    ),
    BreathingExerciseModel(
      id: 9,
      title: 'Pranayama Tekniği',
      description: 'Yoga nefes tekniği.',
      instructions: 'Kontrollü ve ritmik nefes alıp verme.',
      duration: 15,
      backgroundUrl: '/assets/images/breathing/breathing9.jpg',
      difficultyLevel: 'advanced',
      benefitsDescription:
          'Enerji seviyesini dengeler ve zihinsel netlik sağlar.',
      status: 'active',
      createdAt: '2023-01-09',
    ),
    BreathingExerciseModel(
      id: 10,
      title: 'Odaklanma Nefesi',
      description: 'Konsantrasyonu artıran bir teknik.',
      instructions: 'Nefesinize odaklanarak derin nefes alın ve verin.',
      duration: 10,
      backgroundUrl: '/assets/images/breathing/breathing10.jpg',
      difficultyLevel: 'intermediate',
      benefitsDescription:
          'Zihinsel odaklanmayı artırır ve dikkati güçlendirir.',
      status: 'active',
      createdAt: '2023-01-10',
    ),
  ];
}
