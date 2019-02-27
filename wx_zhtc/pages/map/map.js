// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
// pages/map/map.js
var app = getApp();
var coors = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scale: 5,
    latitude: '',
    longitude: '',
    markers: [{
        iconPath: '../images/search/didian.png',
        id: 0,
        latitude: '',
        longitude: '',
        width: 30,
        height: 30
      },
      // {
      //   iconPath: '../images/search/dingwei.png',
      //   id: 1,
      //   latitude: '',
      //   longitude: '',
      //   width: 30,
      //   height: 30
      // }
    ],
    palce: '' //景区地址
  },
  //点击放大缩小
  // controltap:function(e){
  //     console.log(e);
  //   if (e.currentTarget.dataset.id == 1){
  //      this.setData({
  //          scale:++this.data.scale
  //      });
  //   }else{
  //     this.setData({
  //       scale: --this.data.scale
  //     });
  //     }
  // },
  // regionchange:function(e){
  //   console.log(e);
  // },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _that = this;
    let adress = options.adress;
    _that.setData({
      palce: adress
    });
    console.log(_that.data.palce);
    //调用腾讯地图
    qqmapsdk = new QQMapWX({
      key: app.globalId.key
    });

    qqmapsdk.search({
      keyword: _that.data.palce,
      // keyword:'毕棚沟',
      success: function(res) {
        console.log(res);
        let lat = res.data[0].location.lat;
        let lng = res.data[0].location.lng;
        let latitude = 'markers[0].latitude';
        let longitude = 'markers[0].longitude';
        _that.setData({
          latitude: res.data[0].location.lat,
          longitude: res.data[0].location.lng,
          [latitude]: res.data[0].location.lat,
          [longitude]: res.data[0].location.lng,
        });
        wx.openLocation({
          latitude: _that.data.latitude,
          longitude: _that.data.longitude,
          name: res.data[0].address
        })
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    })
    //end
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.onLoad();
    // 调用接口
    // var _this = this;

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // var str = "1{2}2{1}3{56}";
    // // var result = str.match(/{(.*)}/);
    // // result = result ? result[1] : "";
    // // console.log(result);
    // console.log(str.replace(/\{.*?\}/g, ''));//移除字符串中的所有[]括号（包括其内容）




  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})