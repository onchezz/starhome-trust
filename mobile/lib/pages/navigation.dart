import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:starhomes/controllers/home_controller.dart';
import 'package:starhomes/pages/home.dart';
import 'package:starhomes/pages/profile.dart';
import 'package:starhomes/pages/search.dart';
import 'package:starhomes/pages/wallet.dart';
import 'package:water_drop_nav_bar/water_drop_nav_bar.dart';

class Navigation extends StatelessWidget {
  const Navigation({super.key});

  @override
  Widget build(BuildContext context) {
    HomeController _home = Get.put(HomeController());
    final pages = [
      Home(),
      WalletScreen(),
      SearchScreen(),
      ProfileScreen(),
    ];

    return Obx(() {
      return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        //this color must be equal to the WaterDropNavBar backgroundColor
        systemNavigationBarColor: Colors.white,
        systemNavigationBarIconBrightness: Brightness.dark,
      ),
   
        child: Scaffold(
          body: pages[_home.pageIndex.value],
          bottomNavigationBar: WaterDropNavBar(
            backgroundColor: Colors.white,
            onItemSelected: _home.changeindex,
            selectedIndex: _home.pageIndex.value,
            barItems: [
              BarItem(
                filledIcon: Icons.home,
                outlinedIcon: Icons.home_outlined,
              ),
              BarItem(
                filledIcon: Icons.wallet,
                outlinedIcon: Icons.wallet_outlined,
              ),
              BarItem(
                filledIcon: Icons.search,
                outlinedIcon: Icons.search_outlined,
              ),
              BarItem(
                  filledIcon: Icons.person,
                  outlinedIcon: Icons.person_2_outlined),
            ],
          ),
        ),
      );
    });
  }
}
