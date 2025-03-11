import 'package:flutter/material.dart';
import 'package:starhomes/constants/colors.dart';

class SearchBarWidget extends StatelessWidget {
  final String hintText;
  final  Function() onPressFilter;
 
  final ValueChanged<String>? onChanged;

   SearchBarWidget({
    Key? key,
    required this.hintText, 
    this.onChanged, required this.onPressFilter,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      margin: EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: AppColors.primary1
            .withOpacity(0.1), // Background color of the search bar
        borderRadius: BorderRadius.circular(12.0), // Rounded corners
      ),
      child: Row(
        children: [
          const Icon(Icons.search, color: Colors.grey), // Search icon
          const SizedBox(width: 8.0), // Spacing between icon and text field
          Expanded(
            child: TextField(
              decoration: InputDecoration(
                hintText: hintText, // Placeholder text
                border: InputBorder.none, // Remove the default underline
              ),
              onChanged: onChanged, // Callback when text changes
            ),
          ),
          IconButton(
              onPressed: onPressFilter, icon: Image.asset("assets/icons/Filter.png"))
        ],
      ),
    );
  }
}
