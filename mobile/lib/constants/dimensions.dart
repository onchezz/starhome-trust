import 'package:flutter/material.dart';

class Dimensions {
  static double screenWidth(BuildContext context) {
    return MediaQuery.of(context).size.width;
  }

  static double screenHeight(BuildContext context) {
    return MediaQuery.of(context).size.height;
  }

  // Padding and margin
  static EdgeInsets paddingAll(BuildContext context, double value) {
    return EdgeInsets.all(screenWidth(context) * value);
  }

  static EdgeInsets paddingSymmetric(BuildContext context,
      {double horizontal = 0, double vertical = 0}) {
    return EdgeInsets.symmetric(
      horizontal: screenWidth(context) * horizontal,
      vertical: screenHeight(context) * vertical,
    );
  }

  // Button dimensions
  static Size fullWidthButtonSize(BuildContext context, double heightFactor) {
    return Size(screenWidth(context), screenHeight(context) * heightFactor);
  }

  // Text sizes
  static double textSize(BuildContext context, double factor) {
    return screenWidth(context) * factor;
  }
}
