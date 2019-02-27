// pages/car/car.js
var app = getApp(); //引入公用的Appjs
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBuy: '可订', //今天是否预定
    pictureSelect: '1', //默认今天
    url: app.globalId.url, //设置公共的后台路径 
    //时间选择 
    // timeBox: false,//时间框架布尔值
    //时间参数
    hasEmptyGrid: false,
    cur_year: '',
    cur_month: '',
    // cur_day:"",
    color: [], //时间背景
    //点击是的状态
    datetime: "更多日期",
    nowDays: "", //默认的选择时间
    //end
    // more: '更多日期',
    today: '', //今天
    today_o: '',
    tomorrow: '', //明天
    tomorrow_o: '',
    afterTomorrow: '', //后天 
    afterTomorrow_o: '',
    select: '', //开始时间选择
    select_o: '',
    //  name:'',//人名
    phone: '', //手机号--必须填写
    idcard: '', //身份证  
    cunt: '', //总价格 
    productArr: [], //产品数组
    realName: '', //人名
    tourTime: '', //游玩时间
    tic_p: [],
    tic_num: [],
    // msg:'',//出票提示信息
    phoneButton: false, //获取手机号码按钮
    sessionId: '', //sessionId用于查询解密
    //点击按钮只点击一次
    clickType: true //只点击一次判断
  },
  // 获取今天，明天，后天的时间
  today: function() { // 获取今天
    var nowday = new Date();
    var day = new Date(nowday);
    var today = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
    var todayo = today.substr(today.indexOf('-') + 1)
    this.setData({
      today: todayo,
      today_o: today,
      tourTime: today
    });
  },
  tomorrow: function() { // 获取明天
    var day3 = new Date();
    day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
    var s3 = day3.getFullYear() + "-" + (day3.getMonth() + 1) + "-" + day3.getDate();
    // console.log(s3);
    var tomorrow = s3.substr(s3.indexOf('-') + 1)
    this.setData({
      tomorrow: tomorrow,
      tomorrow_o: s3
    });
  },
  afterTomorrow: function() { //后天
    var day4 = new Date();
    day4.setTime(day4.getTime() + 48 * 60 * 60 * 1000);
    var s4 = day4.getFullYear() + "-" + (day4.getMonth() + 1) + "-" + day4.getDate();
    var afterTomorrow = s4.substr(s4.indexOf('-') + 1)
    this.setData({
      afterTomorrow: afterTomorrow,
      afterTomorrow_o: s4
    });
  },
  // //时间选择
  //   binddayClick:function(e){
  //     console.log(e);
  //     let date = [];
  //     date.push({
  //       month: 'current', day: e.detail.day, color: '#fff', background: 'red'
  //     });
  //     let shjain = e.detail.year + "-" + e.detail.month + "-" + e.detail.day
  //     this.setData({//只点击一次
  //       color: date,
  //       datetime: shjain
  //       // clickType: true
  //     });
  //   },

  dateSelectAction: function(e) {
    var cur_day = e.currentTarget.dataset.idx;
    this.setData({
      todayIndex: cur_day,
      datetime: `${this.data.cur_year}-${this.data.cur_month}-${cur_day + 1}`
    })
    console.log(`点击的日期:${this.data.cur_year}年${this.data.cur_month}月${cur_day + 1}日`);
  },
  setNowDate: function() {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const todayIndex = date.getDate() - 1;
    console.log(`日期：${todayIndex}`)
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year: cur_year,
      cur_month: cur_month,
      weeks_ch,
      todayIndex,
    })
  },

  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];

    const thisMonthDays = this.getThisMonthDays(year, month);

    for (let i = 1; i <= thisMonthDays; i++) {
      let bools = {
        days: i,
        bool: true
      }
      days.push(bools);
    }
    let nowday = new Date().getDate();
    let nowmonth = new Date().getMonth() + 1;
    let nowyear = new Date().getFullYear();
    //重写时间
    if (year < nowyear) { //当年份小于当前年份
      days.forEach((res, index) => {
        days[index].bool = false
      });

    } else if (year >= nowyear) { //当年份大于或者等于当前年份
      //当月份小于当前月
      if (month < nowmonth) {
        days.forEach((res, index) => {
          days[index].bool = false
        });
      } else if (month > nowmonth) { //当月大于或者等于当前月份
        days.forEach((res, index) => {
          days[index].bool = true
        });

        //end             
      } else if (month == nowmonth) { //当月等于当前月份
        days.forEach((res, index) => {
          if (res.days < nowday) {
            console.log(res);
            days[index].bool = false
          }
        });
      }
    }
    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  },
  // //调取时间插件
  bindDateChange: function(e) {
    console.log(e);
    this.setData({
      timeBox: true, //弹出时间框
    });
  },

  //点击大框架
  // disnonone:function(){
  //   this.setData({
  //     timeBox: false//关闭时间框
  //   });
  // },
  // //关闭时间框
  timeDisaper: function(e) {
    // console.log(e);
    if (e.currentTarget.dataset.click == "ok") {
      console.log(this.data.nowDays);
      console.log(this.data.datetime);
      if (this.data.datetime == "更多日期") { //当没有选择时间的时候显示默认时间
        this.setData({
          pictureSelect: 4,
          datetime: this.data.nowDays,
          tourTime: this.data.nowDays,
          timeBox: false //关闭时间框
        });
      } else { //当有选择时间的时候显示选择的时间
        this.setData({
          pictureSelect: 4,
          datetime: this.data.datetime,
          tourTime: this.data.datetime,
          timeBox: false //关闭时间框
        });
      }
    } else if (e.currentTarget.dataset.click == "no") {
      this.setData({
        timeBox: false //关闭时间框
      });
    }
  },
  // 时间选择
  selectTime: function(e) {
    // console.log(e);
    var type = e.currentTarget.dataset.id;
    this.setData({
      pictureSelect: type,
      tourTime: e.currentTarget.dataset.time
    });


  },

  //购票须知
  goNotice: function(e) {
    // console.log(e);
    wx.navigateTo({
      url: '../notice/notice?notice=' + e.currentTarget.dataset.notice
    })

  },

  //返回首页
  goHeader: function() {
    wx.switchTab({
      url: '../homePage/homePage',
    })
  },


  //收银
  goShouyin: function() {
    if (this.data.clickType == true) {
      var goods = this.data.tic_num; //获取全部购物列表
      var car = [];
      for (var i = 0, len = goods.length; i < len; i++) {
        goods[i].scenicId = goods[i].scenicId + '=='; //把签名附上
        goods[i].totalAmount = goods[i].settlementPrice * goods[i].ticketNum
        car.push(goods[i]);
      }
      this.setData({
        productArr: car
      });
      if (this.data.phone != "") { //在这里做判断输入手机号
        //总的信息
        let productInformation = {
          scenicId: app.globalId.encryptionId, //景区id
          phone: this.data.phone, //手机号
          idCard: this.data.idcard, //身份证号
          tourTime: this.data.tourTime,
          //  openId: this.data.name,
          sessionId: this.data.sessionId, //解密查询
          unionId: '',
          userId: '',
          realName: this.data.realName,
          products: this.data.productArr
        }
        app.wxPost(this.data.url + 'h5/order/createOrder', productInformation).then(res => {
           console.log(res);
          //获取支付签名并且走向收银页面
          //订单号
          let orderNo = res.data.data.orderNo;
          //时间
          let payTime = res.data.data.laveTime;
          //tips:在这里获取签名并且调支付
          //掉微信小程序支付
          wx.requestPayment({
            timeStamp: res.data.data.wxJsApiResVO
              .timeStamp,
            nonceStr: res.data.data.wxJsApiResVO.nonceStr,
            package: res.data.data.wxJsApiResVO.package,
            signType: res.data.data.wxJsApiResVO.signType,
            paySign: res.data.data.wxJsApiResVO.paySign,
            success: data => {
              // console.log(res);
              wx.navigateTo({
                //传订单号，按钮判断，头部显示判断，时间
                url: '../shouyin/shouyin?orderNo=' + orderNo + '&type=1' + '&headertype=1' + '&time=' + payTime //不管用户支付成功还是取消支付都要把签名给带上，不然后面解析要出错
              })
            },
            fail: error => {
              //  console.log(error);
              wx.navigateTo({
                //传订单号，按钮判断，头部显示判断，时间
                url: '../shouyin/shouyin?orderNo=' + orderNo + '&type=0' + '&headertype=0' + '&time=' + payTime //不管用户支付成功还是取消支付都要把签名给带上，不然后面解析要出错
              })
            },
            complete: str => {
              //  console.log(str);
            }
          })

        });
        //end
      } else {
        wx.showToast({
          title: '请输入手机号哟',
          icon: 'none'
        })
      }
      //赋值为假
      this.setData({ //只点击一次
        clickType: false
      });


    }
  },

  // 计算总价格
  getAll: function() {
    var goods = this.data.tic_num; //获取全部购物列表
    var allPrice = 0; //初始化总价 
    for (var i = 0, len = goods.length; i < len; i++) {
      allPrice += goods[i].ticketNum * goods[i].settlementPrice;
    }
    this.setData({
      cunt: allPrice
    });
    // console.log(this.data.cunt);
  },

  // 计算价格 加
  getAddPrice: function(e) {
    var idx = e.currentTarget.dataset.id;
    var number = this.data.tic_num[idx].ticketNum += 1;
    var num = 'tic_num[' + idx + '].ticketNum'; //指定数组对象的值;
    this.setData({
      [num]: number
    });

    this.getAll(); //总价
  },
  //计算价格 减
  getJianPrice: function(e) {
    var idx = e.currentTarget.dataset.id;
    var number = this.data.tic_num[idx].ticketNum -= 1;
    if (number <= 1) {
      number = 1;
    }
    var num = 'tic_num[' + idx + '].ticketNum'; //指定数组对象的值
    this.setData({
      [num]: number
    });
    this.getAll(); //总价
  },

  //输入姓名
  write: function(e) {
    // console.log();
    let value = e.detail.value;
    this.setData({
      realName: value
    });
  },

  //手机号正则==>输入手机号
  queryphonenumber: function(e) {
    // console.log(e.detail)
    if (e.detail.value == "") {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      this.setData({
        phoneButton: false //当用户没有输入的时候
      });
    } else {
      //正则判断
      let felphonenumber = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
      let value = e.detail.value;
      if (felphonenumber.test(value)) {
        this.setData({
          phone: value,
          phoneButton: true //手机号输入争取关掉按钮
        });
      } else {
        this.setData({
          phoneButton: false //手机号输入争取关掉按钮
        });
        wx.showToast({
          title: '请正确输入手机号哟',
          icon: 'none'
        })
      };
    }

  },
  //身份证输入==>正则验证
  writeidcard: function(e) {
    // console.log(e.detail.value);
    let idcardZenz = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    let idcard = e.detail.value;
    if (idcardZenz.test(idcard)) {
      this.setData({
        idcard: idcard
      });
    } else {
      this.setData({
        idcard: "" //当用户输入的身份证格式不对的时候，给身份证赋值为空
      });
      wx.showToast({
        title: '身份证号填写有误哟',
        icon: 'none'
      })
    }
  },
  //手动查询电话号码（授权） 
  getPhoneNumber: function(e) { //////授权获取手机号码
    // console.log(e)
    if (e.detail.errMsg == "getPhoneNumber:fail user deny") { //用户拒绝获取手机号
      this.setData({
        phoneButton: false
      });
      wx.showToast({
        title: '您拒绝获取手机号，请手动输入',
        icon: 'none'
      })
    } else { //用户允许获取手机号
      let par = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionId: this.data.sessionId, //解密查询
      };
      app.wxPost(this.data.url + 'h5/buy/getPhone', par).then(res => {
        console.log(res);
        if (res.data.data.phone != null) {
          this.setData({
            phone: res.data.data.phone,
            phoneButton: true
          });
        } else {
          wx.showToast({
            title: '获取手机号失败，请手动输入',
            icon: 'none'
          })
          this.setData({
            phoneButton: false
          });
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.setNowDate();//时间选择
    this.setNowDate(); //时间选择
    this.today(); //今天
    this.tomorrow(); //明天
    this.afterTomorrow(); //后天
    // this.select();//时间选择
    // console.log(options.content);
    let arr = JSON.parse(options.content)
    console.log(arr);
    let header = [];
    arr.forEach(res => {
      let par = {
        name: res.sincneme,
        gun: res.gun,
        notice: res.notice
      }
      header.push(par)
    });
    // console.log(header);
    let hash = {};
    header = header.reduce((preVal, curVal) => { //数组内的json数据去重
      hash[curVal.name] ? '' : hash[curVal.name] = true && preVal.push(curVal);
      return preVal
    }, [])
    // console.log(header);
    this.setData({
      tic_p: header,
      tic_num: arr
    });
    //  console.log(this.data.tic_num);
    //当得到用户信息的时候（授权）就赋值
    let user = JSON.parse(options.user)
    // console.log(user);
    if (user.phone != null) {
      // debugger
      this.setData({
        idcard: user.idCard,
        phone: user.phone,
        realName: user.name,
        phoneButton: true
      })
    } else {
      this.setData({
        phoneButton: false
      });
    }
    //获取一步缓存
    app.getHuancun().then(res => {
      this.setData({
        sessionId: res.data
      });
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getAll(); //拿第一次总价格

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var nowday = new Date();
    var day = new Date(nowday);
    var todayshow = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate(); //显示当天默认时间
    var today = day.getDate();
    let date = new Array;
    date.push({
      month: 'current',
      day: today,
      color: '#fff',
      background: 'red'
    });

    this.setData({ //只点击一次
      nowDays: todayshow, //默认显示今天
      color: date,
      clickType: true
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      timeBox: false
    });
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