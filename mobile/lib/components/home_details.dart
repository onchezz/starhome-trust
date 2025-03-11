import 'package:flutter/material.dart';

class HomeDetailsSelector extends StatefulWidget {
  const HomeDetailsSelector({super.key});

  @override
  State<HomeDetailsSelector> createState() => _HomeDetailsSelectorState();
}

class _HomeDetailsSelectorState extends State<HomeDetailsSelector> {
  int bedrooms = 2;
  int bathrooms = 1;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Home Details', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Bedrooms: $bedrooms'),
            Row(
              children: [
                IconButton(icon: const Icon(Icons.remove), onPressed: () => setState(() => bedrooms--)),
                IconButton(icon: const Icon(Icons.add), onPressed: () => setState(() => bedrooms++)),
              ],
            ),
          ],
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Bathrooms: $bathrooms'),
            Row(
              children: [
                IconButton(icon: const Icon(Icons.remove), onPressed: () => setState(() => bathrooms--)),
                IconButton(icon: const Icon(Icons.add), onPressed: () => setState(() => bathrooms++)),
              ],
            ),
          ],
        ),
      ],
    );
  }
}
