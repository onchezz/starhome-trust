import 'package:flutter/material.dart';
import 'package:starhomes/components/profile_header.dart';
import 'package:starhomes/components/profile_menu_items.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            forceMaterialTransparency: true,
            pinned: true,
            expandedHeight: screenHeight * 0.3, // 30% of screen height
            flexibleSpace: FlexibleSpaceBar(
              titlePadding: EdgeInsetsDirectional.only(
                start: screenWidth * 0.05,
                bottom: screenHeight * 0.02,
              ),
              // title: Text(
              //   'Profile',
              //   style: TextStyle(
              //       color: Colors.white, fontSize: screenWidth * 0.03),
              // ),
              background: ProfileHeader(),
            ),
          ),
          SliverList(
            delegate: SliverChildListDelegate([
              SizedBox(height: screenHeight * 0.01),
              ProfileMenuItem(
                icon: Icons.assessment,
                title: 'My Assets',
                onTap: () {},
              ),
              ProfileMenuItem(
                icon: Icons.payment,
                title: 'Payments',
                onTap: () {},
              ),
              ProfileMenuItem(
                icon: Icons.person,
                title: 'Profile',
                onTap: () {},
              ),
              ProfileMenuItem(
                icon: Icons.notifications,
                title: 'Notification',
                onTap: () {},
              ),
              ProfileMenuItem(
                icon: Icons.lock,
                title: 'Security',
                onTap: () {},
              ),
              ProfileMenuItem(
                icon: Icons.language,
                title: 'Language',
                onTap: () {},
              ),
              ProfileMenuItem(
                icon: Icons.help,
                title: 'Help Center',
                onTap: () {},
              ),
              ProfileMenuItem(
                icon: Icons.group_add,
                title: 'Invite Friends',
                onTap: () {},
              ),
              ProfileMenuItem(
                icon: Icons.logout,
                title: 'Logout',
                textColor: Colors.red,
                onTap: () {},
              ),
              SizedBox(height: screenHeight * 0.05),
            ]),
          ),
        ],
      ),
    );
  }
}
