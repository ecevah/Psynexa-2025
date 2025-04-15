import 'dart:convert';
import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AudioCacheManager {
  static final AudioCacheManager _instance = AudioCacheManager._internal();
  static const String _cacheInfoKey = 'audio_cache_info';

  factory AudioCacheManager() {
    return _instance;
  }

  AudioCacheManager._internal();

  // Cache bilgisini saklayan map
  Map<String, String> _cacheMap = {};
  bool _isInitialized = false;

  // AudioCacheManager'ı başlat
  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      final prefs = await SharedPreferences.getInstance();
      final cacheInfoString = prefs.getString(_cacheInfoKey);

      if (cacheInfoString != null) {
        _cacheMap = Map<String, String>.from(jsonDecode(cacheInfoString));
      }

      _isInitialized = true;
    } catch (e) {
      print('Cache manager initialization error: $e');
      _cacheMap = {};
    }
  }

  // URL'den ses dosyasını getir, önbellekte varsa oradan al
  Future<String> getAudioFile(String url) async {
    await initialize();

    // URL'yi normalize et
    String normalizedUrl = _normalizeUrl(url);

    // Eğer önbellekte varsa ve dosya mevcutsa o dosyayı döndür
    if (_cacheMap.containsKey(normalizedUrl)) {
      final filePath = _cacheMap[normalizedUrl]!;
      final file = File(filePath);

      if (await file.exists()) {
        print('Audio file found in cache: $normalizedUrl');
        return filePath;
      }
    }

    // Önbellekte yoksa veya dosya yoksa, indir ve önbelleğe ekle
    return _downloadAndCacheFile(normalizedUrl);
  }

  // URL'yi normalize et (https://example.com/file.mp3 -> example.com_file.mp3)
  String _normalizeUrl(String url) {
    // URL'yi kontrol et
    if (url.isEmpty) return '';

    // Zaten normalize edilmiş bir URL ise
    if (!url.startsWith('http')) {
      return url;
    }

    try {
      final uri = Uri.parse(url);

      // URL'den güvenli bir dosya adı oluştur
      // Sadece alfanumerik, nokta ve alt çizgi karakterlerini tut
      String fileName =
          uri.pathSegments.isNotEmpty ? uri.pathSegments.last : 'audio';

      // Dosya uzantısını koru
      String extension = '';
      if (fileName.contains('.')) {
        extension = fileName.substring(fileName.lastIndexOf('.'));
        fileName = fileName.substring(0, fileName.lastIndexOf('.'));
      }

      // Özel karakterleri temizle
      fileName = fileName.replaceAll(RegExp(r'[^\w\s\.]'), '');

      // Boşlukları alt çizgi ile değiştir
      fileName = fileName.replaceAll(' ', '_');

      // Host adını temizle
      String host = uri.host.replaceAll('.', '_');

      // Benzersiz bir ad oluştur
      return '${host}_$fileName$extension';
    } catch (e) {
      print('URL normalizing error: $e');
      // Hata durumunda rastgele bir isim oluştur
      return 'audio_${DateTime.now().millisecondsSinceEpoch}.mp3';
    }
  }

  // Dosyayı indir ve önbelleğe ekle
  Future<String> _downloadAndCacheFile(String url) async {
    print('Downloading audio file: $url');

    try {
      // URL'yi kontrol et
      if (!url.startsWith('http')) {
        return url;
      }

      // HTTP ile dosyayı indir
      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        // Önbellek dizinini al
        final directory = await getApplicationDocumentsDirectory();
        final cacheDir = Directory('${directory.path}/audio_cache');

        // Önbellek dizini yoksa oluştur
        if (!await cacheDir.exists()) {
          await cacheDir.create(recursive: true);
        }

        // Dosyayı kaydet - URL'den güvenli bir dosya adı oluştur
        final fileName = _normalizeUrl(url);
        final filePath = '${cacheDir.path}/$fileName';
        final file = File(filePath);
        await file.writeAsBytes(response.bodyBytes);

        // Önbellek bilgisini güncelle - URL'yi orjinal haliyle sakla
        _cacheMap[url] = filePath;
        _saveCacheInfo();

        print('Audio file downloaded and cached: $url -> $filePath');
        return filePath;
      } else {
        print(
            'Failed to download audio file: $url, status: ${response.statusCode}');
        return url;
      }
    } catch (e) {
      print('Error downloading audio file: $e');
      return url;
    }
  }

  // Önbellek bilgisini kaydet
  Future<void> _saveCacheInfo() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_cacheInfoKey, jsonEncode(_cacheMap));
    } catch (e) {
      print('Error saving cache info: $e');
    }
  }

  // Önbelleği temizle
  Future<void> clearCache() async {
    try {
      final directory = await getApplicationDocumentsDirectory();
      final cacheDir = Directory('${directory.path}/audio_cache');

      if (await cacheDir.exists()) {
        await cacheDir.delete(recursive: true);
      }

      _cacheMap = {};

      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_cacheInfoKey);

      print('Audio cache cleared');
    } catch (e) {
      print('Error clearing cache: $e');
    }
  }
}
