import 'package:flutter/material.dart';

class ProfileMenuItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;
  final Color? textColor;

  const ProfileMenuItem({
    super.key,
    required this.icon,
    required this.title,
    required this.onTap,
    this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    return Padding(
      padding: EdgeInsets.symmetric(
        horizontal: screenWidth * 0.03,
        vertical: screenHeight * 0.003,
      ),
      child: ListTile(
        leading: Icon(icon,
            color: textColor ?? Colors.black87, size: screenWidth * 0.06),
        title: Text(
          title,
          style: TextStyle(
            fontSize: screenWidth * 0.045,
            color: textColor ?? Colors.black87,
          ),
        ),
        trailing: Icon(Icons.arrow_forward_ios, size: screenWidth * 0.03),
        onTap: onTap,
      ),
    );
  }
}
