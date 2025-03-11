import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:starhomes/components/cards.dart';
import 'package:starhomes/components/filter_modal.dart';
import 'package:starhomes/components/screen_row.dart';
import 'package:starhomes/components/search.dart';
import 'package:starhomes/components/text.dart';
import 'package:starhomes/controllers/home_controller.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    HomeController _home = Get.put(HomeController());
    void _showFilterModal(BuildContext context) {
      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        backgroundColor: Colors.white,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        builder: (BuildContext context) {
          return const FilterModal();
        },
      );
    }

    return Scaffold(
        body: CustomScrollView(
      slivers: [
        SliverAppBar(
          leading: const Padding(
            padding: EdgeInsets.all(8.0),
            child: CircleAvatar(
              backgroundImage: AssetImage('assets/icons/user.jpg'),
            ),
          ),
          centerTitle: false,
          title: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              lightText("Welcome to", context, size: 0.028),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: boldText("Starhomes", context,
                    size: 0.038, color: Colors.grey.shade800),
              )
            ],
          ),
          actions: [
            IconButton(
                onPressed: () {},
                icon: Image.asset('assets/icons/Notification.png'))
          ],
        ),
        SliverToBoxAdapter(
            child: SearchBarWidget(
          hintText: "Search Something",
          onPressFilter: () => _showFilterModal(context),
        )),
        screenRow(
          context,
          text: "Featured",
        ),
        SliverToBoxAdapter(
          child: SizedBox(
            height: MediaQuery.of(context).size.height * 0.378,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: 2,
              itemBuilder: (context, index) {
                return FeaturedCard(
                  imageUrl: 'assets/images/appartment1.jpg',
                  title: 'Merialla Villa',
                  location: 'New York, US',
                  rating: 4.8,
                  price: 12219,
                );
              },
            ),
          ),
        ),
        screenRow(context, text: "Our Recommendation"),
        SliverToBoxAdapter(
          child: SizedBox(
            height: MediaQuery.of(context).size.height * 0.3777,
            // width: MediaQuery.of(context).size.width * 0.1777,

            // height: MediaQuery.of(context).size.height * 0.2777,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: 2,
              itemBuilder: (context, index) {
                return RecommendationCard(
                  imageUrl: 'assets/images/appartment4.jpg',
                  title: 'La Grand Maison',
                  location: 'Tokyo, Japan',
                  rating: 4.8,
                  price: 12219,
                );
              },
            ),
          ),
        ),
      ],
    ));
  }
}
