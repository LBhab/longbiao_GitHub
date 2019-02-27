// pages/orderList/orderList.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datanumder: 1, //判断用 
    url: app.globalId.url, //设置公共的后台路径 
    payed: [], //给钱。检完票，玩儿了的
    unpay: [], //没有给钱
    erweima: [], //二维码出票
    //  erweimaFail:[],//二维码失败
    returnmoney: [], //退款
    type: 0, //菜单高亮选择
    flag: 0, //	订单状态（0 全部 1 待付款 2 待使用 3 退款/售后）
    sessionId: '', //sessionId用于查询解密
    //分页参数
    pageNum: 1, //分页参数
    pageCount: 0, //总页数
    pageamount: 0, //条目总数
    dataList: [] ,//所有订单容器
    listlen:[]    //下拉刷新判断用
    //end
  },
  //  菜单选择
  select: function(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      type: id,
      flag: id
    });
    this.setData({
      pageNum: 1
    });
    this.queryDataList(); //啦数据
  },

  // //退款详情
  //   goDetali:function(){
  //       wx.navigateTo({
  //         url: '../refund_details/refund_details'
  //       })
  //   },
  //获取全部订单
  queryDataList: function() {
    let par = {
      sessionId: this.data.sessionId, //解密查询
      pageNum: this.data.pageNum, //当前页
      flag: this.data.flag, //	订单状态（0 全部 1 待付款 2 待使用 3 退款/售后）
    }
    // console.log(par)
    app.wxPost(this.data.url + 'h5/order/queryOrders', par).then(res => {
      console.log(res);
      //分页修改
      this.setData({//用作下来刷新判断用
        listlen: res.data.data
      });
      // console.log(res); //获取税局成功
      let list = this.data.dataList; //重新赋值，用作更新用
      let pageindex = this.data.pageNum;
      if (this.data.pageNum == 1) { //当时当前页的时候
        // debugger
        list = res.data.data;
        pageindex = 1; //把当前页面参数改为1；
        wx.stopPullDownRefresh(); //禁止刷新
      } else { //当当前页面不为当前与页面的时候
        // debugger
        list = list.concat(res.data.data); //数组追加
        // pageindex = pageindex + 1; //充值页面索引为下一页
      }
      this.setData({
        // pageNum: pageindex,
        pageCount: res.data.totalPage,
        dataList: list
      });
      let number = this.data.dataList.length
      // console.log(this.data.dataList);
      this.setData({
        datanumder: number
      });

      //判断状态操作
      let ungave = []; //没给钱
      let gave = []; //给钱了,可以可以删除
      let success = []; //出票成功
      let retuen = []; //退款
      this.data.dataList.forEach((ress, idx) => {
        //  if (ress.length>0){
        let money = 0;
        for (var val of ress.products) { //计算价格
          money += parseFloat(val.total_price)
        }
        ress.cunt = money; //计算价格
        if (ress.orderStatus == '005002' || ress.orderStatus == '005003') { //没给钱
          // debugger
          //  console.log(ress)
          ungave.push(ress);
        };
        if (ress.orderStatus == '005001' && ress.checkStatus == '1' && ress.ticketStatus != '2') { //给钱了得
          // debugger
          gave.push(ress);
        };
        if (ress.orderStatus == '005001' && ress.checkStatus == "0" && ress.refundStatus == null || ress.refundStatus == '3') { //出票成功
          // debugger
          console.error(ress);
          success.push(ress);

        };
        if (ress.refundStatus != null && ress.refundStatus != '3') { //退款
          // debugger
          // console.log(ress)
          retuen.push(ress);
        }
        // console.log(retuen);
        //赋值
        this.setData({
          unpay: ungave, //没给钱了
          payed: gave, //给钱了得
          erweima: success, //二维码出票
          returnmoney: retuen //退款
        });
        //  }
      })
      if (number == 0) { //判断当值为空的时候
        this.setData({
          unpay: [], //没给钱了
          payed: [], //给钱了得
          erweima: [], //二维码出票
          returnmoney: [] //退款
        })
      }

    }).catch(() => {
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    });;
  },

  //取消订单
  cancelOrder: function(e) {

    // console.log();
    let par = {
      sessionId: this.data.sessionId, //解密查询
      orderNo: e.currentTarget.dataset.orderno
    }

    app.wxPost(this.data.url + 'h5/order/cancelOrderV2', par).then(res => {
      // console.log(res);
      if (res.data.code == '0000') {
        // debugger
        wx.showToast({
          title: '取消订单成功',
          icon: 'none'

        })
        this.queryDataList();
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'

        })
      }

    });
  },
  //删除订单
  delet: function(e) {
    let par = {
      sessionId: this.data.sessionId, //解密查询
      orderNo: e.currentTarget.dataset.orderno
    };
    app.wxPost(this.data.url + 'h5/order/delOrder', par).then(res => {
      // console.log(res.data);
      if (res.data.code == '0000') {
        wx.showToast({
          title: '删除订单成功',
          icon: 'none'
        })
        this.queryDataList();
      }
    });
  },
  //申请退款
  returnMoney: function(e) {
    //  console.log(e);
    let par = {
      sessionId: this.data.sessionId, //解密查询
      orderNo: e.currentTarget.dataset.orderno,
      scenicId: app.globalId.encryptionId
    };
    app.wxPost(this.data.url + 'h5/order/refundOrder', par).then(res => {
      console.log(res);
      if (res.data.code == '0000') {
        // debugger
        this.queryDataList();
      }

    });
  },
  //取消退款
  canlereturnmoney: function(e) {
    let par = {
      sessionId: this.data.sessionId, //解密查询
      orderNo: e.currentTarget.dataset.orderno
    };
    app.wxPost(this.data.url + 'h5/order/cancelRefundOrder', par).then(res => {
      // console.log(res);
      if (res.data.code == '0000') {
        wx.showToast({
          title: '取消退款成功',
          icon: 'none'
        })
        this.queryDataList();
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }

    });
  },
  //查看二维码
  checkerweima: function(e) {
    let par = {
      sessionId: this.data.sessionId, //解密查询
      orderNo: e.currentTarget.dataset.orderno
    };
    app.wxPost(this.data.url + 'h5/order/queryOrderByNo', par).then(res => {
      // console.log(res);
      if (res.data.code == '0000') {
        let prodcutarr = res.data.data.productArray;
        let orderInfo = res.data.data.orderInfo;
        //  res.data.data.scenicInfo.scenicId = 'Jn1mH8wjo/iLFuMN+7L1TA';
        res.data.data.scenicInfo.scenicId = res.data.data.scenicInfo.scenicId.substr(0, res.data.data.scenicInfo.scenicId.indexOf("=="));
        let scenicInfo = res.data.data.scenicInfo;
        //  console.log(prodcutarr);
        wx.navigateTo({
          url: '../pay_success/pay_success?product=' + JSON.stringify(prodcutarr) + "&order=" + JSON.stringify(orderInfo) + "&scenicInfo=" + JSON.stringify(scenicInfo),
        })
      }
    });
  },

  //获取退款详情(退款成功/失败)
  returnSuccess: function(e) {
    let par = {
      sessionId: this.data.sessionId, //解密查询
      orderNo: e.currentTarget.dataset.orderno
    };
    app.wxPost(this.data.url + 'h5/order/refundOrderDetail', par).then(res => {
      // console.log(res);
      if (res.data.code == '0000') {
        let type = {
          refundStatus: res.data.data.refundStatus,
          totalPrice: res.data.data.totalPrice
        };
        wx.navigateTo({
          url: '../refund_details/refund_details?type=' + JSON.stringify(type),
        })
      }

    });
  },
  //重新支付
  payagin: function(e) {
    // console.log(e);
    let par = {
      sessionId: this.data.sessionId, //解密查询
      scenicId: app.globalId.encryptionId, //景区id
      flag: 'PAY_AGAIN',
      orderNo: e.currentTarget.dataset.orderno,
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
            //再次拉取订单
            this.queryDataList();
            // debugger
          },
          fail: error => {

          }
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
  outpaperAgin: function(e) {
    let par = {
      sessionId: this.data.sessionId, //解密查询
      orderNo: e.currentTarget.dataset.orderno,
      scenicId: app.globalId.encryptionId, //景区id
      flag: 'OUT_TICKET_AGAIN' //明天修改
    };
    app.wxPost(this.data.url + 'h5/order/createOrder', par).then(res => {
      // console.log(res);
      //做个判断
      let len = res.data.data.productArray.length;
      if (len > 0) { //出票成功
        this.queryDataList();
      } else {
        wx.showToast({
          title: '再次出票失败，请退款',
          icon: 'none'
        })
      }
    })
  },
  //人工客服
  callPhone: function() {
    wx.makePhoneCall({
      phoneNumber: app.globalPhone.phoneNumber,
    })
  },
  //刷新支付状态
  shuaxin: function(e) {
    let par = {
      sessionId: this.data.sessionId, //解密查询
      orderNo: e.currentTarget.dataset.orderno,
      scenicId: app.globalId.encryptionId
    };
    app.wxPost(this.data.url + 'h5/order/queryWxOrderByNo', par).then(res => {
      // console.log(res);
      if (res.data.code == '0000') {
        if (res.data.data.orderStatus == '005002') { //未支付订单
          wx.showToast({
            title: '订单未支付',
            icon: 'none'
          })
        } else if (res.data.data.orderStatus == '005001') { //订单已经支付
          this.queryDataList();
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取一步缓存
    let _this = this;
    //获取本地缓存
    app.getHuancun().then(res => {
      // console.log('已经登陆了')
      //  console.log(res);
      // console.log(res);
      _this.setData({ //先赋值一次
        sessionId: res.data
      });
      let par = {
        sessionId: res.data,
        pageNum: '1', //当前页
        flag: 0
      }
      // debugger
      app.wxPost(_this.data.url + 'h5/order/queryOrders', par).then(ress => {
        // console.log(par);//出现问题
        if (ress.data.code == '70016') { //当有
          // debugger
          wx.login({
            success: res => {
              console.log(res);
              let par = {
                code: res.code,
                sessionId: '',
                platForm: 'wx',
                authorizeType: 'silent',
                scenicId: app.globalId.encryptionId
              }
              app.wxPost(_this.data.url + 'h5/buy/srAuthorize', par).then(data => {
                _this.setData({
                  sessionId: data.data.data.sessionId
                });
                console.error(this.data.sessionId);
                //拿到新的id缓存
                app.getStorage(data.data.data.sessionId);
                _this.queryDataList(); //拿到缓存之后再啦数据
              });

            }
          })

        } else {
          //  debugger
          _this.queryDataList(); //拿到缓存之后再啦数据
        }

      })
      // _this.queryDataList();//拿到缓存之后再啦数据
    }).catch(() => { //用户没有登录授权
      // debugger
      _this.setData({
        datanumder: 0 //当用户没有授权的时候没有缓存值，直接说没有记录
      });
      wx.login({
        success: ress => {
          // console.log('没有登录哟');
          // console.log(ress);
          let par = {
            code: ress.code,
            sessionId: '',
            platForm: 'wx',
            authorizeType: 'silent',
            scenicId: app.globalId.encryptionId
          }
          //  console.log(par);
          app.wxPost(_this.data.url + 'h5/buy/srAuthorize', par).then(data => {
            _this.setData({
              sessionId: data.data.data.sessionId
            });
            //静默授权缓存id
            app.getStorage(data.data.data.sessionId);
            _this.queryDataList(); //拿到缓存之后再啦数据
          });
        }
      })
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
    this.setData({
      // type:0,
      pageNum: 1
    });
    this.onLoad();
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
    this.setData({
      pageNum: 1
    });
    this.queryDataList(); //拉数据
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    //  debugger
    console.log(this.data.listlen.length);
    if (this.data.listlen.length == 10){//当页面有10条记录并且拉到底的时候
      if (this.data.pageNum < this.data.pageCount) { //当 当前页面索引小于总页数的时候还可以加载
        // debugger
        this.setData({
          pageNum: this.data.pageNum += 1
        });
        this.queryDataList(); //拉数据
     
      } else { //当当前页面索引等于总页数的时候不可以加载
        wx.showToast({
          title: '人家是有底线的哟',
          icon: 'none'
        })
      }
    }else{//当页面没有10条记录到底的时候
      wx.showToast({
        title: '人家是有底线的哟',
        icon: 'none'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})