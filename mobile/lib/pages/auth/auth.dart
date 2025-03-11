import 'package:flutter/material.dart';
import 'package:starhomes/components/text.dart';
import 'package:starhomes/constants/colors.dart';
import 'package:starhomes/constants/dimensions.dart';

class Auth extends StatelessWidget {
  const Auth({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Stack(
              children: [
                Image.asset("assets/images/welcome.png"),
                Positioned(
                  bottom: Dimensions.screenHeight(context) *
                      0.03, // 3% of screen height
                  right: Dimensions.screenWidth(context) *
                      0.2, // 20% of screen width
                  child: lightText("WELCOME TO STARHOMES", context),
                ),
              ],
            ),
            Padding(
              padding: Dimensions.paddingSymmetric(context,
                  horizontal: 0.02,
                  vertical: 0.01), // 3% horizontal, 1% vertical
              child: const Text.rich(
                textAlign: TextAlign.center,
                TextSpan(
                  children: [
                    TextSpan(
                      text: "Let’s get you closer",
                      style:
                          TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
                    ),
                    TextSpan(
                      text: " To your ideal real Estate Investment",
                      style: TextStyle(
                        color: AppColors.primary1,
                        fontWeight: FontWeight.bold,
                        fontSize: 24,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            lightText('Login to StarHomes with Google', context),
            Padding(
              padding: Dimensions.paddingSymmetric(context,
                  horizontal: 0.02,
                  vertical: 0.03), // 3% horizontal, 4% vertical
              child: ElevatedButton.icon(
                onPressed: () {},
                label: Text(
                  "Sign Up with Google",
                  style: TextStyle(
                    fontSize: Dimensions.textSize(
                        context, 0.035), // 4.5% of screen width
                    fontWeight: FontWeight.w600,
                    color: Colors.black,
                  ),
                ),
                icon: Image.asset('assets/icons/google.png'),
                style: ElevatedButton.styleFrom(
                  minimumSize: Dimensions.fullWidthButtonSize(
                      context, 0.001), // Full width, 6% of screen height
                  padding: Dimensions.paddingSymmetric(context,
                      horizontal: 0.02,
                      vertical: 0.02), // 5% horizontal, 2% vertical
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

}

// import 'package:flutter/material.dart';
// import 'package:starhomes/constants/colors.dart';

// class Welcome extends StatelessWidget {
//   const Welcome({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: SafeArea(
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.center,
//           children: [
//             Stack(
//               children: [
//                 Image.asset("assets/images/welcome.png"),
//                 Positioned(
//                   bottom: 30,
//                   right: 90,
//                   // left: 12,
//                   child: lightText("WELCOME TO STARHOMES"),
//                 )
//               ],
//             ),
//             const Padding(
//               padding: const EdgeInsets.only(left: 10, right: 10, bottom: 10),
//               child: Text.rich(TextSpan(children: [
//                 TextSpan(
//                     text: "Let’s get you closer",
//                     style:
//                         TextStyle(fontWeight: FontWeight.bold, fontSize: 24)),
//                 TextSpan(
//                     text: " To your ideal real Estate Investment",
//                     style: TextStyle(
//                         color: AppColors.primary1,
//                         fontWeight: FontWeight.bold,
//                         fontSize: 24))
//               ])),
//             ),
//             lightText('Login to StarHomes with Google'),
//             Padding(
//               padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 10),
//               child: ElevatedButton.icon(
//                   onPressed: () {},
//                   label: Text(
//                     "Sign Up with Google",
//                     style: TextStyle(
//                         fontSize: 18,
//                         fontWeight: FontWeight.w600,
//                         color: Colors.black),
//                   ),
//                   icon: Image.asset('assets/icons/google.png'),
//                   style: ElevatedButton.styleFrom(
//                       minimumSize: Size(double.infinity, 50),
//                       padding:
//                           EdgeInsets.symmetric(horizontal: 20, vertical: 12))),
//             )
//           ],
//         ),
//       ),
//     );
//   }

//   Text lightText(text) {
//     return Text(
//       text,
//       style: TextStyle(fontSize: 18),
//     );
//   }
// }
