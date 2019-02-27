const app = getApp();

Page({
data:{
      latitude: '',
      longitude: '',
    markers: [{
      // iconPath: "/image/green_tri.png",
      id: 0,
      latitude: '',
      longitude: '',
      width: 20,
      height: 30
    }]
},
onLoad(query) {
  var _that = this;
    my.chooseLocation({
      success: (res) => {
         var lat = "markers[0].latitude";
         var lng = "markers[0].longitude";
        _that.setData({
              [lat]:res.latitude,
              [lng]:res.longitude,
              latitude:res.latitude,
              longitude:res.longitude
        });
        my.openLocation({
          longitude: res.longitude, // 经度
          latitude: res.latitude, // 纬度
          name: res.name, // 位置名称
          iconPath: '../images/search/didian.png',
          address: res.address, // 地址的详细说明
          success: (res) => {
            
          },
        });
      },
    });



},
onReady() {
// 页面加载完成
},
onShow() {
// 页面显示
},
onHide() {
// 页面隐藏
},
onUnload() {
// 页面被关闭
},
onTitleClick() {
// 标题被点击
},
onPullDownRefresh() {
// 页面被下拉
},
onReachBottom() {
// 页面被拉到底部
},
onShareAppMessage() {
// 返回自定义分享信息
// return {
// title: 'My App',
// desc: 'My App description',
// path: 'pages/index/index',
// };
},
});
