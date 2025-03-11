import 'package:flutter/material.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<String> _searchResults = [];
  final List<String> _allTokens = [
    'Bitcoin',
    'Ethereum',
    'Solana',
    'Dogecoin',
    'Cardano',
    'Litecoin',
    'Polkadot',
    'Ripple',
    'Shiba Inu',
  ];

  void _performSearch(String query) {
    setState(() {
      _searchResults = _allTokens
          .where((token) => token.toLowerCase().contains(query.toLowerCase()))
          .toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // AppBar with Search Input
          SliverAppBar(
            pinned: true,
            floating: true,
            expandedHeight: screenHeight * 0.15,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                padding: EdgeInsets.symmetric(
                    horizontal: screenWidth * 0.05,
                    vertical: screenHeight * 0.03),
                color: Colors.blueAccent,
                child: SafeArea(
                  child: Column(
                    children: [
                      TextField(
                        controller: _searchController,
                        onChanged: _performSearch,
                        decoration: InputDecoration(
                          hintText: 'Search tokens, transactions...',
                          prefixIcon: const Icon(Icons.search),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(30),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding:
                              const EdgeInsets.symmetric(vertical: 0),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Recent Searches Section
          if (_searchController.text.isEmpty)
            SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.symmetric(
                    horizontal: screenWidth * 0.05,
                    vertical: screenHeight * 0.02),
                child: const Text(
                  'Recent Searches',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          if (_searchController.text.isEmpty)
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) => ListTile(
                  leading: const Icon(Icons.history),
                  title: Text('Recent Token ${index + 1}'),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                  onTap: () {},
                ),
                childCount: 5,
              ),
            ),

          // Search Results Section
          if (_searchController.text.isNotEmpty)
            SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.symmetric(
                    horizontal: screenWidth * 0.05,
                    vertical: screenHeight * 0.02),
                child: const Text(
                  'Search Results',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          if (_searchController.text.isNotEmpty)
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) => ListTile(
                  leading: CircleAvatar(
                    backgroundColor: Colors.amber,
                    child: Text(_searchResults[index][0]),
                  ),
                  title: Text(_searchResults[index]),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                  onTap: () {},
                ),
                childCount: _searchResults.length,
              ),
            ),

          // No Results Found
          if (_searchController.text.isNotEmpty && _searchResults.isEmpty)
            SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.symmetric(
                    horizontal: screenWidth * 0.05,
                    vertical: screenHeight * 0.1),
                child: Column(
                  children: [
                    Icon(Icons.search_off, size: 64, color: Colors.grey),
                    const SizedBox(height: 10),
                    const Text(
                      'No results found',
                      style: TextStyle(fontSize: 18, color: Colors.grey),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
