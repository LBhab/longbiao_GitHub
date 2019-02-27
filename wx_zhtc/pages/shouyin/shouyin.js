// pages/shouyin/shouyin.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payTpye: 1, //失败或者成功按钮的回调  
    sessionId: '', //sessionId用于查询解密
    headerType: 0, //是否显示头部倒计时
    url: app.globalId.url, //设置公共的后台路径 
    packageid: "prepay_id=",
    hours: '',
    mintes: '',
    sencends: "",
    //再次支付
    timeStamp: '',
    nonceStr: '',
    package: '',
    signType: '',
    paySign: '',
    //end
    // 订单号，以及缓存的seeionid
    sessionId: '',
    orderNo: '',
    //end    
    datalist: [{
      name: [],
      time: '',
      date: '',
      price: ''
    }]
  },

  //获取产品
  getProducts: function(sessionId, orderNo) {
    let par = {
      sessionId: sessionId,
      orderNo: orderNo
    }

    app.wxPost(this.data.url + 'h5/order/queryOrderByNo', par).then(res => {
      // debugger
      // console.log(res);
      let productsName = [];
      res.data.data.productArray.forEach(val => {
        productsName.push(val.productName); //填充数据         
      })
      //赋值数据
      var name = "datalist[0].name"; //产品名字
      var time = "datalist[0].time"; //入园时间
      var date = "datalist[0].date"; //有效期；
      var price = "datalist[0].price"; //总价
      this.setData({
        //  productsName: productsName
        [name]: productsName,
        [price]: res.data.data.orderInfo.totalPrice,
        [time]: res.data.data.scenicInfo.admissionTime,
        [date]: res.data.data.scenicInfo.admissionTime,
      });
    })
    //end
  },
  //倒计时时间
  backTime: function(endDateStr) {
    //倒计时
    let arr = endDateStr.split(/[- :]/); // that.data.gmtDate时间格式为'2018-08-07 10:23:00'

    let nndate = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);

    nndate = Date.parse(nndate)

    // let timeLeft = nndate - new Date();
    //  function TimeDown(endDateStr) {
    //结束时间
    //  var endDate = new Date(endDateStr);
    //当前时间
    var nowDate = new Date();
    //相差的总秒数
    var totalSeconds = parseInt((nndate - nowDate) / 1000);
    //天数
    var days = Math.floor(totalSeconds / (60 * 60 * 24));
    //取模（余数）
    var modulo = totalSeconds % (60 * 60 * 24);
    //小时数
    var hours = Math.floor(modulo / (60 * 60));
    modulo = modulo % (60 * 60);
    //分钟
    var minutes = Math.floor(modulo / 60);
    //秒
    var seconds = modulo % 60;
    //输出到页面
    this.setData({
      hours: hours,
      mintes: minutes,
      sencends: seconds
    });
  },
  //支付成功之后产看二维码
  chekpicture: function() {
    let par = {
      sessionId: this.data.sessionId,
      orderNo: this.data.orderNo,
    }
    //查看二维码
    app.wxPost(this.data.url + 'h5/order/queryOrderByNo', par).then(res => {
      console.log(res);
      if (res.data.code == '0000') {
        let prodcutarr = res.data.data.productArray;
        let orderInfo = res.data.data.orderInfo;
        res.data.data.scenicInfo.scenicId = res.data.data.scenicInfo.scenicId.substr(0, res.data.data.scenicInfo.scenicId.indexOf("=="));
        let scenicInfo = res.data.data.scenicInfo;
        //  console.log(prodcutarr);
        wx.navigateTo({
          url: '../pay_success/pay_success?product=' + JSON.stringify(prodcutarr) + "&order=" + JSON.stringify(orderInfo) + "&scenicInfo=" + JSON.stringify(scenicInfo),
        })
      }
    });
  },

  //再次支付
  gochengg: function() {
    let par = {
      sessionId: this.data.sessionId, //解密查询
      scenicId: app.globalId.encryptionId, //景区id
      flag: 'PAY_AGAIN',
      orderNo: this.data.orderNo,
    };
    // console.log(par);
    app.wxPost(this.data.url + 'h5/order/createOrder', par).then(res => {
      // console.log(res);
      if (res.data.code == '0000') {
        wx.requestPayment({
          timeStamp: res.data.data.wxJsApiResVO.timeStamp,
          nonceStr: res.data.data.wxJsApiResVO.nonceStr,
          package: res.data.data.wxJsApiResVO.package,
          signType: res.data.data.wxJsApiResVO.signType,
          paySign: res.data.data.wxJsApiResVO.paySign,
          success: ress => {
            //  //支付成功之后
            // //设置头部显示以及出现二维码的按钮
            this.setData({
              headerType: 1,
              payTpye: 1
            });
          },
          fail: error => {}
        })
      } else {
        wx.showToast({
          title: '调起支付失败',
          icon: 'none'
        })
      }

    });
  },
  //再次出票
  // outpaperAgin: function () {
  //   let par = {
  //     sessionId: this.data.sessionId,//解密查询
  //     orderNo: this.data.orderNo,
  //     scenicId: app.globalId.encryptionId,//景区id
  //     falg: 'OUT_TICKET_AGAIN '//明天修改
  //   };
  //   app.wxPost(this.data.url + 'h5/order/createOrder', par).then(res => {
  //     console.log(res);
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _that = this;
    _that.setData({
      headerType: options.headertype, //头部是否显示
      payTpye: options.type, //按钮判断
    });
    console.log(options.orderNo); //订单号
    let pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
    let timer = options.time.replace(pattern, '$1-$2-$3 $4:$5:$6');
    console.log(timer)
    setInterval(() => {
      this.backTime(timer);
      if (this.data.hours == '0' && this.data.mintes == '0' && this.data.sencends == '0') {
        //当倒计时为0 的时候返回购物车页面
        wx.navigateBack({
          url: '../car/car'
        })
      }

    }, 1000)
    //获取缓存sseionid
    app.getHuancun().then(res => {
      console.log(res);
      //赋值
      _that.setData({
        sessionId: res.data,
        orderNo: options.orderNo
      });
      this.getProducts(res.data, options.orderNo); //调起产品数据
    })
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