import 'package:flutter/material.dart';

class BuildingSizeSlider extends StatefulWidget {
  const BuildingSizeSlider({super.key});

  @override
  State<BuildingSizeSlider> createState() => _BuildingSizeSliderState();
}

class _BuildingSizeSliderState extends State<BuildingSizeSlider> {
  RangeValues _currentRange = const RangeValues(1370, 2720);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Building Size',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        RangeSlider(
          values: _currentRange,
          min: 1000,
          max: 5000,
          divisions: 100,
          labels: RangeLabels(
            '${_currentRange.start.round()}',
            '${_currentRange.end.round()}',
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
