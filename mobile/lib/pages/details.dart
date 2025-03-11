import 'package:flutter/material.dart';
import 'package:starhomes/components/text.dart';
import 'package:starhomes/constants/colors.dart';

class DetailsPage extends StatelessWidget {
  const DetailsPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          _buildAppBar(context, screenWidth),
          _buildPropertyDetails(context, screenWidth),
          _buildAgentSection(context, screenWidth),
          _buildOverviewSection(context, screenWidth),
          _buildFacilitiesSection(context, screenWidth),
          _buildGallerySection(context, screenWidth),
          _buildLocationSection(context, screenWidth),
          _buildBookingSection(context, screenWidth),
        ],
      ),
    );
  }

  Widget _buildAppBar(BuildContext context, double screenWidth) {
    return SliverAppBar(
      expandedHeight: screenWidth * 0.75, // 75% of screen width
      pinned: true,
      forceMaterialTransparency: true,
      leading: IconButton(
        onPressed: () {},
        icon: Icon(Icons.arrow_back_ios),
      ),
      flexibleSpace: FlexibleSpaceBar(
        background: Image.asset(
          'assets/images/appartment2.jpg',
          fit: BoxFit.cover,
        ),
      ),
      actions: [
        IconButton(
          icon: Icon(Icons.share),
          onPressed: () {},
        ),
        IconButton(
          icon: Icon(Icons.favorite_border),
          onPressed: () {},
        ),
      ],
    );
  }

  Widget _buildPropertyDetails(BuildContext context, double screenWidth) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: EdgeInsets.all(screenWidth * 0.04), // 4% of screen width
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Modernica Apartment',
              style: TextStyle(
                fontSize: screenWidth * 0.06, // 6% of screen width
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: screenWidth * 0.02), // 2% of screen width
            Row(
              children: [
                Icon(Icons.star, color: Colors.amber),
                SizedBox(width: screenWidth * 0.01), // 1% of screen width
                Text(
                  '4.8 (1,275 reviews)',
                  style: TextStyle(
                      fontSize: screenWidth * 0.04), // 4% of screen width
                ),
                Spacer(),
                Text(
                  'Apartment',
                  style: TextStyle(
                      fontSize: screenWidth * 0.04), // 4% of screen width
                ),
              ],
            ),
            SizedBox(height: screenWidth * 0.04), // 4% of screen width
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildInfoChip(
                  context,
                  label: '8 Beds',
                  icon: "assets/icons/bed.png",
                  screenWidth: screenWidth,
                ),
                _buildInfoChip(
                  context,
                  label: '3 Baths',
                  icon: "assets/icons/shower.png",
                  screenWidth: screenWidth,
                ),
                _buildInfoChip(
                  context,
                  label: '2000 sqft',
                  icon: 'assets/icons/size.png',
                  screenWidth: screenWidth,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoChip(
    BuildContext context, {
    required String label,
    required String icon,
    required double screenWidth,
  }) {
    return Chip(
      avatar: Image.asset(icon),
      label: Text(
        label,
        style: TextStyle(
          color: AppColors.black1,
          fontSize: screenWidth * 0.035, // 3.5% of screen width
        ),
      ),
      backgroundColor: Colors.grey[200],
    );
  }

  Widget _buildAgentSection(BuildContext context, double screenWidth) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: EdgeInsets.all(screenWidth * 0.04), // 4% of screen width
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Agent',
              style: TextStyle(
                fontSize: screenWidth * 0.05, // 5% of screen width
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: screenWidth * 0.02), // 2% of screen width
            Row(
              children: [
                CircleAvatar(
                  radius: screenWidth * 0.06, // 6% of screen width
                  backgroundImage: AssetImage('assets/icons/user.jpg'),
                ),
                SizedBox(width: screenWidth * 0.04), // 4% of screen width
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Natasya Wilodra',
                      style: TextStyle(
                        fontSize: screenWidth * 0.045, // 4.5% of screen width
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      'Owner',
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: screenWidth * 0.035, // 3.5% of screen width
                      ),
                    ),
                  ],
                ),
                Spacer(),
                IconButton(
                  icon: Icon(Icons.chat_bubble_outline),
                  onPressed: () {},
                ),
                IconButton(
                  icon: Icon(Icons.phone),
                  onPressed: () {},
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOverviewSection(BuildContext context, double screenWidth) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: EdgeInsets.all(screenWidth * 0.04), // 4% of screen width
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Overview',
              style: TextStyle(
                fontSize: screenWidth * 0.05, // 5% of screen width
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: screenWidth * 0.02), // 2% of screen width
            Text(
              'Sleek, modern 2-bedroom apartment with open living space, high-end finishes, and city views. Minutes from downtown, dining, and transit.',
              style: TextStyle(
                fontSize: screenWidth * 0.04, // 4% of screen width
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFacilitiesSection(BuildContext context, double screenWidth) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: EdgeInsets.all(screenWidth * 0.04), // 4% of screen width
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Facilities',
              style: TextStyle(
                fontSize: screenWidth * 0.05, // 5% of screen width
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: screenWidth * 0.02), // 2% of screen width
            Wrap(
              spacing: screenWidth * 0.02, // 2% of screen width
              runSpacing: screenWidth * 0.02, // 2% of screen width
              children: [
                _buildFacilityChip(context, 'Car Parking', screenWidth),
                _buildFacilityChip(context, 'Swimming Pool', screenWidth),
                _buildFacilityChip(context, 'Gym & Fitness', screenWidth),
                _buildFacilityChip(context, 'Restaurant', screenWidth),
                _buildFacilityChip(context, 'Wi-fi & Network', screenWidth),
                _buildFacilityChip(context, 'Pet Center', screenWidth),
                _buildFacilityChip(context, 'Sport Center', screenWidth),
                _buildFacilityChip(context, 'Laundry', screenWidth),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFacilityChip(
      BuildContext context, String label, double screenWidth) {
    return Chip(
      label: Text(
        label,
        style: TextStyle(fontSize: screenWidth * 0.035), // 3.5% of screen width
      ),
      backgroundColor: Colors.grey[200],
    );
  }

  Widget _buildGallerySection(BuildContext context, double screenWidth) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: EdgeInsets.all(screenWidth * 0.04), // 4% of screen width
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Gallery',
              style: TextStyle(
                fontSize: screenWidth * 0.05, // 5% of screen width
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: screenWidth * 0.02), // 2% of screen width
            SizedBox(
              height: screenWidth * 0.3, // 30% of screen width
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: 3,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: EdgeInsets.only(
                        right: screenWidth * 0.02), // 2% of screen width
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(
                          screenWidth * 0.02), // 2% of screen width
                      child: Image.asset(
                        'assets/images/appartment4.jpg',
                        width: screenWidth * 0.3, // 30% of screen width
                        fit: BoxFit.cover,
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLocationSection(BuildContext context, double screenWidth) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: EdgeInsets.all(screenWidth * 0.04), // 4% of screen width
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Location',
              style: TextStyle(
                fontSize: screenWidth * 0.05, // 5% of screen width
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: screenWidth * 0.02), // 2% of screen width
            Row(
              children: [
                Icon(Icons.location_on, color: Colors.blue),
                SizedBox(width: screenWidth * 0.02), // 2% of screen width
                Expanded(
                  child: Text(
                    'Grand City St. 100, New York, United States',
                    style: TextStyle(
                      fontSize: screenWidth * 0.04, // 4% of screen width
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: screenWidth * 0.04), // 4% of screen width
            Container(
              height: screenWidth * 0.5, // 50% of screen width
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(
                    screenWidth * 0.02), // 2% of screen width
              ),
              child: Center(
                child: Image.asset(
                  'assets/images/mapHolder.png',
                  fit: BoxFit.fill,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBookingSection(BuildContext context, double screenWidth) {
    return SliverToBoxAdapter(
      child: Container(
        width: double.infinity,
        margin: EdgeInsets.all(screenWidth * 0.04), // 4% of screen width
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Total Invessted',
              style: TextStyle(
                color: Colors.grey,
                fontSize: screenWidth * 0.04, // 4% of screen width
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: screenWidth * 0.04),
            Text(
              '\$ 17821 /1,000,000 USD',
              style: TextStyle(
                color: Colors.blue,
                fontSize: screenWidth * 0.032,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: screenWidth * 0.0061), // 1% of screen width
            Row(
              children: [
                iconButton(Icon(Icons.remove)),
                SizedBox(width: screenWidth * 0.01),
                // Use Expanded to constrain the TextField
                Expanded(
                  child: Container(
                    padding:
                        EdgeInsets.symmetric(horizontal: screenWidth * 0.008),
                    margin: EdgeInsets.all(2),
                    decoration: BoxDecoration(
                      color: AppColors.primary1.withOpacity(
                          0.1), // Background color of the search bar
                      borderRadius: BorderRadius.circular(
                          screenWidth * 0.018), // Rounded corners
                    ),
                    child: TextField(
                      onTap: () {},
                      decoration: InputDecoration(
                        hintText: '500 USD',
                        hintStyle: TextStyle(color: Colors.grey.shade400),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(
                          vertical: screenWidth * 0.02, // 2% of screen width
                          horizontal: screenWidth * 0.03, // 3% of screen width
                        ),
                      ),
                    ),
                  ),
                ),

                iconButton(Icon(Icons.add)),
                SizedBox(width: screenWidth * 0.02), // 2% of screen width

                ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    // minimumSize: Size(double.infinity, 50),
                  ),
                  child: Container(
                    margin: EdgeInsets.only(left: 10),
                    padding: const EdgeInsets.symmetric(
                        vertical: 18, horizontal: 18),
                    child: const Text(
                      'Invest',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                )
              ],
            ),
            SizedBox(height: screenWidth * 0.061),
          ],
        ),
      ),
    );
  }

  Container iconButton(Icon icon) {
    return Container(
      decoration: BoxDecoration(
          // color: Colors.grey.shade200,
          // borderRadius: BorderRadius.circular(20),
          ),
      child: IconButton(
        onPressed: () {},
        icon: icon,
      ),
    );
  }
}
