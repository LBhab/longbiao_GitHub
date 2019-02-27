// pages/refund_details/refund_details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0, //退款状态
    headerArr: '', //顶部
    processData: [{
        name: '平台审核通过',
        date: '2018.12.21',
        start: '#9F9F9F',
        end: '#80CA72',
        startPath: '../images/search/pr.png',
        endPath: '../images/search/pr_.png'
      },
      {
        name: '微信支付退款已到账',
        date: '2018.12.21',
        start: '#9F9F9F',
        end: '#80CA72',
        startPath: '../images/search/pr.png',
        endPath: '../images/search/pr_.png'
      }

    ]

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log();
    this.setData({
      headerArr: JSON.parse(options.type)
    });
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