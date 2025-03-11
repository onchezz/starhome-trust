 import 'package:flutter/material.dart';
import 'package:starhomes/components/text.dart';
import 'package:starhomes/constants/colors.dart';

SliverToBoxAdapter screenRow(
    BuildContext context, {
    required String text,
  }) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            boldText(text, context),
            boldText("See All", context, color: AppColors.primary1)
          ],
        ),
      ),
    );
  }
