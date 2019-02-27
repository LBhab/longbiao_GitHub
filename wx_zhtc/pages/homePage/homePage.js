// pages/homePage/homePage.js
var app = getApp(); //引入公用的App函数
const WxParse = require('../../wxParse/wxParse.js'); //引入模板js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalId.url, //公共请求路径
    imgUrl: '', // logo
    video: '', //视屏
    scenicName: '', //景区名字
    // text:'',//文本
    logo_text: [{
        text: '梦幻川西之旅/毕棚沟-西岭雪山-成都'
      },
      {
        text: '梦幻川西之旅/毕棚沟-蜀南竹海-成都'
      },
      {
        text: '梦幻川西之旅/毕棚沟-张家界-成都'
      },
      {
        text: '梦幻川西之旅/毕棚沟-稻城-成都'
      }
    ], //跑马灯      
  },
  // 拉取数据
  getdatalist: function() {
    let id = app.globalId.scenicId; //引入公共景区id
    let par = {
      scenicId: id
    }
    app.wxPost(this.data.url + 'h5/index/getScenicConfig', par).then(res => {
      console.log(res)
      app.globalId.encryptionId = res.data.data.scenicId; //把加密后的景区id放在公共文件中
      let image = res.data.data.pics[0]; //图片
      let videos = res.data.data.videos[0]; //视屏
      let text = res.data.data.introduction; //文本
      let scenicName = res.data.data.scenicName; //景区名字
      WxParse.wxParse('article', 'html', text, this); //解析富文本
      this.setData({
        imgUrl: image,
        video: videos,
        scenicName: scenicName
        // text: text
      });
    })

  },
  /*
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.getdatalist(); //拉数据
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