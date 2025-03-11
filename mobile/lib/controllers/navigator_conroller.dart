import 'package:get/get.dart';

class NavigatorConroller extends GetxController {

  
  var pageIndex = 0.obs;

  void changeindex(int index) {
    pageIndex.value = index;
  }
}
