import 'package:flutter/material.dart';

class PropertyTypeSelector extends StatefulWidget {
  const PropertyTypeSelector({super.key});

  @override
  State<PropertyTypeSelector> createState() => _PropertyTypeSelectorState();
}

class _PropertyTypeSelectorState extends State<PropertyTypeSelector> {
  final List<String> _propertyTypes = [
    'Apartments',
    'Townhomes',
    'Homes',
    'Condos',
    'Duplexes',
    'Studios'
  ];
  String _selectedType = 'Apartments';

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Property Type',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        Wrap(
          spacing: 8.0,
          children: _propertyTypes.map((type) {
            return ChoiceChip(
              label: Text(type),
              selected: _selectedType == type,
              onSelected: (selected) {
                setState(() {
                  _selectedType = type;
                });
              },
            );
          }).toList(),
        ),
      ],
    );
  }
}
