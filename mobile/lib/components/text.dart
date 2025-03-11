import 'package:flutter/material.dart';
import 'package:starhomes/constants/dimensions.dart';

Text lightText(String text, BuildContext context,{double? size}) {
  return Text(
    text,
    style: TextStyle(
      fontSize:Dimensions.textSize(context, size ??  0.04), // 4% of screen width
    ),
  );
}

Text boldText(String text, BuildContext context,{double? size,Color? color}) {
  return Text(
    text,
    style: TextStyle(
      fontWeight: FontWeight.w600,
      color:color ,
      fontSize: Dimensions.textSize(context, size ?? 0.046), // 4% of screen width
    ),
  );
}
