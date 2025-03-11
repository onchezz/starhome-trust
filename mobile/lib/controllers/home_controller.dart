import 'package:get/get.dart';

class HomeController extends GetxController{
var pageIndex =0.obs;

void changeindex(int index){
pageIndex.value = index;
}

}