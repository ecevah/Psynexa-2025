// Test Models
class TestModel {
  final int id;
  final String title;
  final String description;
  final bool isActive;
  final String testImage;
  final String status;
  final String createdAt;
  final List<TestQuestion> questions;

  TestModel({
    required this.id,
    required this.title,
    required this.description,
    required this.isActive,
    required this.testImage,
    required this.status,
    required this.createdAt,
    required this.questions,
  });

  factory TestModel.fromJson(Map<String, dynamic> json) {
    return TestModel(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      isActive: json['is_active'],
      testImage: json['test_image'] ?? '',
      status: json['status'],
      createdAt: json['created_at'],
      questions: (json['questions'] as List?)
              ?.map((q) => TestQuestion.fromJson(q))
              .toList() ??
          [],
    );
  }
}

class TestQuestion {
  final int id;
  final String questionText;
  final String questionType;
  final List<dynamic> options;
  final int order;
  final bool status;

  TestQuestion({
    required this.id,
    required this.questionText,
    required this.questionType,
    required this.options,
    required this.order,
    required this.status,
  });

  factory TestQuestion.fromJson(Map<String, dynamic> json) {
    return TestQuestion(
      id: json['id'],
      questionText: json['question_text'],
      questionType: json['question_type'],
      options: json['options'] ?? [],
      order: json['order'],
      status: json['status'],
    );
  }
}

// Meditation Models
class MeditationModel {
  final int id;
  final int psycId;
  final String title;
  final String description;
  final String content;
  final int duration;
  final String backgroundUrl;
  final String vocalizationUrl;
  final String soundUrl;
  final String? contentUrl;
  final String status;
  final String createdAt;
  final Psychologist psychologist;

  MeditationModel({
    required this.id,
    required this.psycId,
    required this.title,
    required this.description,
    required this.content,
    required this.duration,
    required this.backgroundUrl,
    required this.vocalizationUrl,
    required this.soundUrl,
    this.contentUrl,
    required this.status,
    required this.createdAt,
    required this.psychologist,
  });

  factory MeditationModel.fromJson(Map<String, dynamic> json) {
    return MeditationModel(
      id: json['id'],
      psycId: json['psyc_id'],
      title: json['title'],
      description: json['description'],
      content: json['content'],
      duration: json['duration'],
      backgroundUrl: json['background_url'] ?? '',
      vocalizationUrl: json['vocalization_url'] ?? '',
      soundUrl: json['sound_url'] ?? '',
      contentUrl: json['content_url'],
      status: json['status'],
      createdAt: json['created_at'],
      psychologist: Psychologist.fromJson(json['psychologist']),
    );
  }
}

// Blog Models
class BlogModel {
  final int id;
  final int psycId;
  final String title;
  final String description;
  final String content;
  final String contentType;
  final String? publishedAt;
  final String status;
  final String backgroundUrl;
  final String? vocalizationUrl;
  final String? soundUrl;
  final String createdAt;
  final Psychologist psychologist;

  BlogModel({
    required this.id,
    required this.psycId,
    required this.title,
    required this.description,
    required this.content,
    required this.contentType,
    this.publishedAt,
    required this.status,
    required this.backgroundUrl,
    this.vocalizationUrl,
    this.soundUrl,
    required this.createdAt,
    required this.psychologist,
  });

  factory BlogModel.fromJson(Map<String, dynamic> json) {
    return BlogModel(
      id: json['id'],
      psycId: json['psyc_id'],
      title: json['title'],
      description: json['description'],
      content: json['content'],
      contentType: json['content_type'],
      publishedAt: json['published_at'],
      status: json['status'],
      backgroundUrl: json['background_url'] ?? '',
      vocalizationUrl: json['vocalization_url'],
      soundUrl: json['sound_url'],
      createdAt: json['created_at'],
      psychologist: Psychologist.fromJson(json['psychologist']),
    );
  }
}

// Common models
class Psychologist {
  final int id;
  final String name;
  final String? surname;

  Psychologist({
    required this.id,
    required this.name,
    this.surname,
  });

  factory Psychologist.fromJson(Map<String, dynamic> json) {
    return Psychologist(
      id: json['id'],
      name: json['name'],
      surname: json['surname'],
    );
  }
}
