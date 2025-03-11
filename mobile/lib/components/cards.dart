import 'package:flutter/material.dart';

class RecommendationCard extends StatelessWidget {
  final String imageUrl;
  final String title;
  final String location;
  final double rating;
  final double price;

  const RecommendationCard({
    Key? key,
    required this.imageUrl,
    required this.title,
    required this.location,
    required this.rating,
    required this.price,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    return Container(
      width: screenWidth * 0.45,
      height: screenHeight * 0.26,
      margin: EdgeInsets.all(screenWidth * 0.02),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(screenWidth * 0.03),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: screenWidth * 0.02,
            offset: Offset(0, screenWidth * 0.01),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Padding(
            padding: EdgeInsets.all(screenWidth * 0.02),
            child: ClipRRect(
                borderRadius: BorderRadius.circular(
                  screenWidth * 0.03,
                ),
                child: Image.asset(
                  imageUrl,
                  height: screenHeight * 0.18,
                  width: double.infinity,
                  fit: BoxFit.cover,
                )),
          ),
          Spacer(),
          Padding(
            padding: EdgeInsets.all(screenWidth * 0.02),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        title,
                        style: TextStyle(
                          fontSize: screenWidth * 0.04,
                          fontWeight: FontWeight.w600,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Row(
                      children: [
                        Icon(
                          Icons.star,
                          color: Colors.amber,
                          size: screenWidth * 0.04,
                        ),
                        Text(
                          rating.toString(),
                          style: TextStyle(
                            fontSize: screenWidth * 0.035,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                SizedBox(height: screenHeight * 0.005),
                Text(
                  location,
                  style: TextStyle(
                    fontSize: screenWidth * 0.035,
                    color: Colors.grey,
                  ),
                ),
                SizedBox(height: screenHeight * 0.01),
                Text(
                  '\$${price.toStringAsFixed(0)}',
                  style: TextStyle(
                    fontSize: screenWidth * 0.04,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue,
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: EdgeInsets.only(
                right: screenWidth * 0.02, bottom: screenWidth * 0.02),
            child: Align(
              alignment: Alignment.bottomRight,
              child: Icon(
                Icons.favorite_border,
                color: Colors.grey,
                size: screenWidth * 0.05,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class FeaturedCard extends StatelessWidget {
  final String imageUrl;
  final String title;
  final String location;
  final double rating;
  final double price;

  const FeaturedCard({
    super.key,
    required this.imageUrl,
    required this.title,
    required this.location,
    required this.rating,
    required this.price,
  });

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    return Container(
      width: screenWidth * 0.6,
      margin: EdgeInsets.all(screenWidth * 0.02),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(screenWidth * 0.03),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: screenWidth * 0.02,
            offset: Offset(0, screenWidth * 0.01),
          ),
        ],
      ),
      child: Stack(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(screenWidth * 0.03),
            child: Image.asset(
              imageUrl,
              height: double.infinity,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          ),
          Positioned(
            top: screenHeight * 0.02,
            right: screenWidth * 0.03,
            child: Container(
              padding: EdgeInsets.symmetric(
                horizontal: screenWidth * 0.02,
                vertical: screenHeight * 0.005,
              ),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(screenWidth * 0.02),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.star,
                    color: Colors.amber,
                    size: screenWidth * 0.04,
                  ),
                  SizedBox(width: screenWidth * 0.01),
                  Text(
                    rating.toString(),
                    style: TextStyle(
                      fontSize: screenWidth * 0.035,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            bottom: screenHeight * 0.03,
            left: screenWidth * 0.03,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: screenWidth * 0.045,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: screenHeight * 0.005),
                Text(
                  location,
                  style: TextStyle(
                    fontSize: screenWidth * 0.035,
                    color: Colors.white.withOpacity(0.9),
                  ),
                ),
                SizedBox(height: screenHeight * 0.01),
                Text(
                  '\$${price.toStringAsFixed(0)}',
                  style: TextStyle(
                    fontSize: screenWidth * 0.04,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
          Positioned(
            bottom: screenHeight * 0.03,
            right: screenWidth * 0.03,
            child: Icon(
              Icons.favorite_border,
              color: Colors.white,
              size: screenWidth * 0.06,
            ),
          ),
        ],
      ),
    );
  }
}
