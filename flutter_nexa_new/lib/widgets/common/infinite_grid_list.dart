import 'package:flutter/material.dart';
import 'package:flutter_nexa/utils/app_colors.dart';
import 'package:flutter_nexa/widgets/common/grid_item_card.dart';

typedef FutureCallback<T> = Future<List<T>> Function(int page, int limit);
typedef ItemBuilder<T> = Widget Function(BuildContext context, T item);

class InfiniteGridList<T> extends StatefulWidget {
  final String title;
  final FutureCallback<T> fetchItems;
  final ItemBuilder<T>? itemBuilder;
  final int crossAxisCount;
  final int initialLimit;
  final int loadMoreThreshold;
  final bool showSearchBar;
  final Function(String)? onSearch;
  final List<T>? initialItems;
  final String emptyMessage;
  final IconData? emptyIcon;
  final bool showBackButton;
  final Widget? headerWidget;

  const InfiniteGridList({
    Key? key,
    required this.title,
    required this.fetchItems,
    this.itemBuilder,
    this.crossAxisCount = 2,
    this.initialLimit = 10,
    this.loadMoreThreshold = 3,
    this.showSearchBar = false,
    this.onSearch,
    this.initialItems,
    this.emptyMessage = "Henüz içerik bulunamadı",
    this.emptyIcon,
    this.showBackButton = true,
    this.headerWidget,
  }) : super(key: key);

  @override
  State<InfiniteGridList<T>> createState() => _InfiniteGridListState<T>();
}

class _InfiniteGridListState<T> extends State<InfiniteGridList<T>> {
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();
  List<T> _items = [];
  bool _isLoading = false;
  bool _hasMore = true;
  int _currentPage = 1;
  String _searchQuery = '';
  bool _isInitialDataLoaded = false;

  @override
  void initState() {
    super.initState();

    // If initial items are provided, use them
    if (widget.initialItems != null && widget.initialItems!.isNotEmpty) {
      _items = List.from(widget.initialItems!);
      _isInitialDataLoaded = true;
    } else {
      _loadData();
    }

    _scrollController.addListener(_scrollListener);
  }

  void _scrollListener() {
    // Daha fazla öğe yoksa veya yükleme yapılıyorsa işlem yapma
    if (!_hasMore || _isLoading) return;

    // Scroll pozisyonu sona yaklaştığında daha fazla veri yükle
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 500) {
      _loadData();
    }
  }

  Future<void> _loadData() async {
    if (_isLoading || !_hasMore) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final newItems = await widget.fetchItems(
        _currentPage,
        widget.initialLimit,
      );

      if (newItems.isEmpty) {
        setState(() {
          _hasMore = false;
          _isLoading = false;
        });
        return;
      }

      // Eğer ilk sayfa yükleniyorsa ve 10 veya daha az öğe varsa, daha fazla yükleme yapma
      if (_currentPage == 1 && newItems.length < widget.initialLimit) {
        setState(() {
          _items.addAll(newItems);
          _hasMore = false; // Daha fazla öğe olmadığını belirt
          _isLoading = false;
          _isInitialDataLoaded = true;
        });
        return;
      }

      setState(() {
        _items.addAll(newItems);
        _currentPage++;
        _isLoading = false;
        _isInitialDataLoaded = true;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Veri yüklenirken hata oluştu: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _refreshData() async {
    setState(() {
      _items = [];
      _currentPage = 1;
      _hasMore = true;
      _isInitialDataLoaded = false;
    });
    await _loadData();
  }

  void _onSearchSubmitted(String value) {
    if (_searchQuery == value) return;
    _searchQuery = value;
    if (widget.onSearch != null) {
      widget.onSearch!(_searchQuery);
    }
    _refreshData();
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: TextField(
        controller: _searchController,
        decoration: InputDecoration(
          hintText: 'Ara...',
          prefixIcon: const Icon(Icons.search),
          suffixIcon: _searchController.text.isNotEmpty
              ? IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () {
                    _searchController.clear();
                    _onSearchSubmitted('');
                  },
                )
              : null,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(30.0),
            borderSide: BorderSide.none,
          ),
          filled: true,
          fillColor: Colors.grey[200],
          contentPadding: const EdgeInsets.symmetric(vertical: 0.0),
        ),
        onSubmitted: _onSearchSubmitted,
        textInputAction: TextInputAction.search,
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            widget.emptyIcon ?? Icons.hourglass_empty,
            size: 80,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            widget.emptyMessage,
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildGridItem(BuildContext context, T item) {
    if (widget.itemBuilder != null) {
      return widget.itemBuilder!(context, item);
    }

    // Default grid item rendering if no custom builder is provided
    // This is a fallback and should be replaced with a custom builder
    return Container(
      margin: const EdgeInsets.all(8.0),
      color: Colors.grey[300],
      height: 200,
      child: Center(
        child: Text('Please provide an itemBuilder'),
      ),
    );
  }

  Widget _buildBody() {
    if (!_isInitialDataLoaded) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (_items.isEmpty) {
      return _buildEmptyState();
    }

    return RefreshIndicator(
      onRefresh: _refreshData,
      child: GridView.builder(
        padding: const EdgeInsets.all(8.0),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: widget.crossAxisCount,
          childAspectRatio: 0.75,
          crossAxisSpacing: 4,
          mainAxisSpacing: 4,
        ),
        itemCount: _hasMore ? _items.length + 1 : _items.length,
        controller: _scrollController,
        itemBuilder: (context, index) {
          if (index >= _items.length) {
            // Sadece daha fazla yüklenecek öğe varsa loading göster
            if (_hasMore) {
              return const Center(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: CircularProgressIndicator(),
                ),
              );
            }
            // Daha fazla yüklenecek öğe yoksa boş container döndür
            return const SizedBox.shrink();
          }
          return _buildGridItem(context, _items[index]);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: AppColors.primaryColor,
        leading: widget.showBackButton
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () => Navigator.of(context).pop(),
              )
            : null,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _refreshData,
          ),
        ],
      ),
      body: Column(
        children: [
          if (widget.headerWidget != null) widget.headerWidget!,
          if (widget.showSearchBar) _buildSearchBar(),
          Expanded(child: _buildBody()),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }
}
