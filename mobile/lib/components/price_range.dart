import 'package:flutter/material.dart';

class PriceRangeSlider extends StatefulWidget {
  const PriceRangeSlider({super.key});

  @override
  State<PriceRangeSlider> createState() => _PriceRangeSliderState();
}

class _PriceRangeSliderState extends State<PriceRangeSlider> {
  RangeValues _currentRange = const RangeValues(102, 327);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Price Range',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        RangeSlider(
          values: _currentRange,
          min: 50,
          max: 500,
          divisions: 100,
          labels: RangeLabels(
            '\$${_currentRange.start.round()}',
            '\$${_currentRange.end.round()}',
          ),
          onChanged: (RangeValues values) {
            setState(() {
              _currentRange = values;
            });
          },
        ),
      ],
    );
  }
}
