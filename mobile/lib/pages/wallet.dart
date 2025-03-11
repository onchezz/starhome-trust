import 'package:flutter/material.dart';

class WalletScreen extends StatelessWidget {
  const WalletScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // AppBar with Wallet Balance
          SliverAppBar(
            surfaceTintColor: Colors.white10,
            pinned: true,
            expandedHeight: screenHeight * 0.25,
            flexibleSpace: FlexibleSpaceBar(
              title: const Text('Wallet'),
              background: _WalletBalanceCard(),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.qr_code_scanner),
                onPressed: () {},
              ),
            ],
          ),

          // Action Buttons (Send, Receive, Scan, Swap)
          SliverToBoxAdapter(
            child: _WalletActionButtons(),
          ),

          // Token Section
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.symmetric(
                horizontal: screenWidth * 0.05,
                vertical: screenHeight * 0.02,
              ),
              child: const Text(
                'My Tokens',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: _WalletTokenList(),
          ),

          // Recent Transactions Section
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.symmetric(
                horizontal: screenWidth * 0.05,
                vertical: screenHeight * 0.02,
              ),
              child: const Text(
                'Recent Transactions',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: _WalletTransactionList(),
          ),
        ],
      ),
    );
  }
}

/// Wallet Balance Card
class _WalletBalanceCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    return Container(
      padding:
          EdgeInsets.symmetric(horizontal: screenWidth * 0.05, vertical: 20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(
            screenWidth * 0.07,
          ),
          bottomRight: Radius.circular(
            screenWidth * 0.07,
          ),
        ),
        gradient: const LinearGradient(
          colors: [Colors.blueAccent, Colors.lightBlue],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Total Balance',
            style: TextStyle(fontSize: 16, color: Colors.white70),
          ),
          const SizedBox(height: 8),
          const Text(
            '\$12,450.32',
            style: TextStyle(
                fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white),
          ),
        ],
      ),
    );
  }
}

/// Wallet Action Buttons (Send, Receive, Scan, Swap)
class _WalletActionButtons extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    return Padding(
      padding:
          EdgeInsets.symmetric(horizontal: screenWidth * 0.05, vertical: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildActionButton(Icons.send, 'Send'),
          _buildActionButton(Icons.download, 'Receive'),
          _buildActionButton(Icons.qr_code, 'Scan'),
          _buildActionButton(Icons.swap_horiz, 'Swap'),
        ],
      ),
    );
  }

  Widget _buildActionButton(IconData icon, String label) {
    return Column(
      children: [
        CircleAvatar(
          backgroundColor: Colors.blueAccent,
          radius: 24,
          child: Icon(icon, color: Colors.white),
        ),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 12)),
      ],
    );
  }
}

/// Wallet Token List
class _WalletTokenList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    List tokens = [
      "USDC",
      "ETH",
      "STRK",
    ];
    return Column(
      children: List.generate(3, (index) {
        return ListTile(
          leading: CircleAvatar(
            backgroundColor: Colors.amber,
            child: Text(tokens[index].toString().substring(0, 2)),
          ),
          title: Text(tokens[index]),
          subtitle: Text('${(index + 1) * 50} Tokens'),
          trailing: Text('\$${(index + 1) * 500}'),
        );
      }),
    );
  }
}

/// Wallet Transaction List
class _WalletTransactionList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(5, (index) {
        return ListTile(
          leading: Icon(
            index % 2 == 0 ? Icons.arrow_upward : Icons.arrow_downward,
            color: index % 2 == 0 ? Colors.green : Colors.red,
          ),
          title: Text('Transaction ${index + 1}'),
          subtitle: Text('Description of transaction ${index + 1}'),
          trailing: Text(index % 2 == 0 ? '+\$150' : '-\$75'),
        );
      }),
    );
  }
}
