import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:starhomes/components/filter_button.dart';
import 'package:starhomes/components/home_details.dart';
import 'package:starhomes/components/price_range.dart';
import 'package:starhomes/components/property_type.dart';
import 'package:starhomes/components/size_slider.dart';
import 'package:starhomes/components/text.dart';

class FilterModal extends StatelessWidget {
  const FilterModal({super.key});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    return Container(
      height: screenHeight * 0.8,
      padding: EdgeInsets.all(screenWidth * 0.05),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 50,
                height: 5,
                margin: const EdgeInsets.only(bottom: 10),
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton.filled(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.arrow_back)),
                Text(
                  'Filter',
                  style: TextStyle(
                    fontSize: screenWidth * 0.06,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextButton(onPressed: () {}, child: boldText('Reset', context))
              ],
            ),
            SizedBox(height: screenWidth * 0.05),
            const PriceRangeSlider(),
            SizedBox(height: screenWidth * 0.05),
            const PropertyTypeSelector(),
            SizedBox(height: screenWidth * 0.05),
            const HomeDetailsSelector(),
            SizedBox(height: screenWidth * 0.05),
            const BuildingSizeSlider(),
            SizedBox(height: screenWidth * 0.1),
            const FilterButton(),
          ],
        ),
      ),
    );
  }
}
