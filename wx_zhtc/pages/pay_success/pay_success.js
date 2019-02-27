// pages/pay_success/pay_success.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalId.url, //设置公共的后台路径 
    type: '', //支付成功打印出二维码
    header: [], //头部
    body: [], //中间图片
    footer: [], //底部
    useMethod: '', //使用方法
    //重新出票的参数
    orderNo: '', //订单号
    sessionId: '', //sessionId用于查询解密
    // scenicId:'',//景区id
    imgbool: false, //遮罩层弹出
    imageSrc: "" //放大后的二维码图片
  },

  //首页
  baclheader: function() {
    wx.switchTab({
      url: '../homePage/homePage',
    })
  },
  //再次出票
  outpaperAgin: function() {
    // console.log(e);
    let par = {
      sessionId: this.data.sessionId, //解密查询
      orderNo: this.data.orderNo,
      scenicId: app.globalId.encryptionId,
      flag: 'OUT_TICKET_AGAIN' //明天修改
    };
    // console.log(par);
    app.wxPost(this.data.url + 'h5/order/createOrder', par).then(res => {
      console.log(res);
      if (res.data.data.code == "70030"){
             wx.showToast({
               title: '系统繁忙，请到订单页面刷新支付',
               icon:"none",
               duration:3000,
               success:()=>{
                 wx.switchTab({
                   url: '../orderList/orderList',
                 })
               }
             })
           
      }else{
        //判断是否出票成功
        let products = res.data.data.productArray.length;
        if (products > 0) { //再次出票成功
          this.setData({
            type: 0,
            body: res.data.data.productArray
          });
        } else { //再次出票失败
          this.setData({
            type: 2
          });
        }
      }
    });
  },
  //再次出票失败执行退款
  returnMoney: function() {
    //  console.log(e);
    let par = {
      sessionId: this.data.sessionId, //解密查询
      orderNo: this.data.orderNo,
      scenicId: app.globalId.encryptionId
    };
    app.wxPost(this.data.url + 'h5/order/refundOrder', par).then(res => {
      console.log(res);
      if (res.data.code == '0000') {
        wx.showToast({
          title: '申请退款成功',
          icon: 'none'
        })
        // 申请成功之后return页面
        wx.navigateTo({
          url: '../returns/returns?money=' + this.data.header.totalPrice,
        })

      }

    });
  },
  //点击二维码放大
  ratatoPicture: function(e) {
    //给图片赋值和弹出弹框
    let imageSrc = e.currentTarget.dataset.img
    console.log(imageSrc);
    this.setData({
      imgbool: true,
      imageSrc: imageSrc
    });

  },
  //取消遮罩
  hidenimage: function() {
    this.setData({
      imgbool: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    //设置订单号 和 景区id
    this.setData({
      orderNo: JSON.parse(options.order).orderNo,
      // scenicId: app.globalId.encryptionId
    });
    //拉取缓存
    app.getHuancun().then(res => {
      this.setData({
        sessionId: res.data,
      });
    });
    let ewmpictrue = JSON.parse(options.product)
    console.log(ewmpictrue);
    // console.log(JSON.parse(options.order));
    // console.log(JSON.parse(options.scenicInfo));
    //当有二维码失败的时候就显示重新打印二维码  
    ewmpictrue.forEach(res => {
      // console.log(res.qrCode);
      if (res.qrCode == null) {
        // debugger
        this.setData({
          type: 1, //二维码失败
          header: JSON.parse(options.order),
          body: JSON.parse(options.product),
          footer: JSON.parse(options.scenicInfo),
          //使用正则表达式去除多余的标签
          useMethod: JSON.parse(options.scenicInfo).useMethod.replace(/<\/?(img|a|p|span|strike|u|i|b)[^>]*>/gi, '')
        });
        return false;
      } else {
        // debugger
        this.setData({
          type: 0, //二维码成功
          header: JSON.parse(options.order),
          body: JSON.parse(options.product),
          footer: JSON.parse(options.scenicInfo),
          //使用正则表达式去除多余的标签
          useMethod: JSON.parse(options.scenicInfo).useMethod.replace(/<\/?(img|a|p|span|strike|u|i|b)[^>]*>/gi, '')
        });
      }
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
    //  返回到购物车页面

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