// pages/sellTikcet/sellTikcet.js
var app = getApp(); //已入引入公用的app函数
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'), //判断事前版本是否适合
    url: app.globalId.url, //设置公共的后台路径 
    scenicInfo: [], //景区信息    
    usualProductArray: [], //常用票种
    scenicPortProductArray: [], //票类 
    tick_Al: [], //常用票种
    tick_o: [], //票类
    //传参数据
    content: [],
    type: -1, //判断点击下拉的状态
    bool: true, //点击布尔值
    num: 0, //选择了几张票
    allTick: [] //总的票类（个数）
  },
  // 景点介绍
  // },
  // 拉去当前页面数据
  getDatalist: function() {
    let id = app.globalId.encryptionId;
    let par = {
      scenicId: id
    }
    app.wxPost(this.data.url + 'h5/buy/noticeToVisitors', par).then(res => {
      console.log(res);
      let sceni = [];
      sceni.push(res.data.data.scenicInfo) //景区信息
      res.data.data.usualProductArray.forEach(ress => {
        ress.checked = false;
        ress.disabled = false;
      });
      res.data.data.scenicPortProductArray.forEach(ress => {
        ress.products.forEach(val => {
          val.checked = false;
          val.disabled = false;
        });
      });
      this.setData({
        scenicInfo: sceni, //景区信息
        usualProductArray: res.data.data.usualProductArray, //常用票种
        scenicPortProductArray: res.data.data.scenicPortProductArray, //票类
      });
      // console.log(this.data.usualProductArray);
    });
  },
  //点击下拉
  getSon: function(e) { //bug修改
    // console.log(e.currentTarget.dataset.index)
    if (e.currentTarget.dataset.index != this.data.type) {
      this.setData({
        type: e.currentTarget.dataset.index
      });
    } else {
      this.setData({
        type: -1
      });
    }
  },
  //购票须知
  goNotice: function(e) {
    // console.log(e.currentTarget.dataset.notice);
    wx.navigateTo({
      url: '../notice/notice?notice=' + e.currentTarget.dataset.notice
    })

  },
  //选中状态(常用票种)
  usuallyTickt: function(e) {
    // console.log(e.currentTarget.id);
    // console.log(e.currentTarget.dataset);
    let panduan = e.currentTarget.dataset.bool;
    if (panduan == false) {
      // console.log('家的');
      var zhen = this.data.usualProductArray[parseInt(e.currentTarget.id)].checked = true;
      // console.log(this.data.usualProductArray[]);
      var fuzu = "usualProductArray[" + parseInt(e.currentTarget.id) + "].checked";
      this.setData({
        [fuzu]: zhen
      });
    } else if (panduan == true) {
      var zhen = this.data.usualProductArray[parseInt(e.currentTarget.id)].checked = false;
      // console.log(this.data.usualProductArray[]);
      var fuzu = "usualProductArray[" + parseInt(e.currentTarget.id) + "].checked";
      this.setData({
        [fuzu]: zhen
      });
    }
    console.log(this.data.usualProductArray[parseInt(e.currentTarget.id)].checked);
    //做个判断
    if (this.data.usualProductArray[parseInt(e.currentTarget.id)].checked == true) { //当真的时候
      let name = e.currentTarget.dataset.productname; //当前点击的票
      // console.log(name);
      this.data.scenicPortProductArray.forEach((res, idx) => {
        res.products.forEach((ress, index) => {
          if (ress.productName == name) {
            //  return false;
            var self = "scenicPortProductArray[" + idx + "].products[" + index + "].disabled"
            this.setData({
              [self]: true
            });
            return false;
          }
        });
      });
    } else if (this.data.usualProductArray[parseInt(e.currentTarget.id)].checked == false) { //当为假的时候
      let name = e.currentTarget.dataset.productname; //当前点击的票
      // console.log(name);
      this.data.scenicPortProductArray.forEach((res, idx) => {
        res.products.forEach((ress, index) => {
          if (ress.productName == name) {
            //  return false;
            var self = "scenicPortProductArray[" + idx + "].products[" + index + "].disabled"
            this.setData({
              [self]: false
            });
            return false;
          }
        });
      });
      //end
    }
    //调用全部的方法
    this.finllyTcik();
  },
  //票类
  scensicTickt: function(e) {
    //子级索引
    let son = parseInt(e.currentTarget.dataset.index);
    //父级索引
    let father = parseInt(e.currentTarget.id);
    let panduan = e.currentTarget.dataset.bool;
    if (panduan == false) {
      var zhen = this.data.scenicPortProductArray[father].products[son].checked = true;
      var fuzu = "scenicPortProductArray[" + father + "].products[" + son + "].checked";
      this.setData({
        [fuzu]: zhen
      });
    } else if (panduan == true) {
      var zhen = this.data.scenicPortProductArray[father].products[son].checked = false;
      var fuzu = "scenicPortProductArray[" + father + "].products[" + son + "].checked";
      this.setData({
        [fuzu]: zhen
      });
    }
    console.log(this.data.scenicPortProductArray[father].products[son].checked);
    //做个判断
    if (this.data.scenicPortProductArray[father].products[son].checked == true) {
      let name = e.currentTarget.dataset.productname; //当前点击的票
      // console.log(name);
      this.data.usualProductArray.forEach((res, idx) => {
        // console.log(res); 
        if (res.productName == name) {
          let self = "usualProductArray[" + idx + "].disabled";
          this.setData({
            [self]: true
          });
          return false;
        }

      });
      //end
    } else if (this.data.scenicPortProductArray[father].products[son].checked == false) {
      let name = e.currentTarget.dataset.productname; //当前点击的票
      // console.log(name);
      this.data.usualProductArray.forEach((res, idx) => {
        // console.log(res); 
        if (res.productName == name) {
          let self = "usualProductArray[" + idx + "].disabled";
          this.setData({
            [self]: false
          });
          return false;
        }

      });
    }
    //总的票类end
    this.finllyTcik();
  },
  //计算总的票类
  finllyTcik: function() {
    //根据选中状态的值追加数组
    // let bool = true;//设置选中值
    let usualarr = [];
    let scencisarr = [];

    this.data.usualProductArray.forEach(res => { //常用票种
      if (res.checked == true) {
        usualarr.push(res);
        //end
      }
    });
    this.data.scenicPortProductArray.forEach(res => { //票类
      res.products.forEach(ress => {
        if (ress.checked == true) {
          scencisarr.push(ress);
          //end
        }
      });
    });
    let ha = usualarr;
    let hb = scencisarr;
    // 合并两个json数组，并去重;
    let hc = [];
    for (var i = 0, len = ha.length; i < len; i++) { //bug 解决
      hc.push(ha[i]);
    }
    for (var a = 0, len = hb.length; a < len; a++) { //bug解决
      hc.push(hb[a]);
    }
    var file = [];
    hc.forEach(res => {
      let sincid = res.scenicId.substr(0, res.scenicId.indexOf('=='));
      // console.log(sincid);
      let par = {
        settlementPrice: res.settlementPrice,
        name: res.ticketName,
        gun: res.termName,
        sincneme: res.scenicPortName,
        scenicPortId: res.scenicPortId,
        productName: res.productName,
        scenicId: sincid,
        productNo: res.productNo,
        ticketNum: 1,
        notice: res.instructions,
        ticketName: res.ticketName,
        useMethod: res.useMethod,
        totalAmount: '' //单个商品的总价
      }
      file.push(par);
    });
    this.setData({
      num: hc.length,
      content: file
    });
  },
  // },
  //景区相应的地图
  goMap: function(e) {
    console.log(e.currentTarget.dataset.map);
    let adress = e.currentTarget.dataset.map;
    wx.navigateTo({
      url: '../map/map?adress=' + adress,
    })
  },
  //微信授权(gouwuche)  // 购物车
  bindGetUserInfo: function(e) {
    //当用户买了票才能选择去购买
    if (this.data.num > 0) {
      wx.login({
        success: res => {
          app.globalCode.code = res.code;
          //  console.log(app.globalCode.code);
          if (e.detail.userInfo) {
            //用户按了允许授权按钮
            // console.log(e);
            //获取缓存sessionId有没有
            //设置局部  sessionId；
            // let sessionId = '';
            app.getHuancun().then(res => {
              // console.info('来过'+' '+ res.data);
              let par = {
                platForm: 'wx',
                scenicId: app.globalId.encryptionId,
                authorizeType: 'active',
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                code: app.globalCode.code,
                sessionId: res.data
              }
              app.wxPost(this.data.url + 'h5/buy/srAuthorize', par).then(res => {
                //获取用户信息
                // console.log(res);
                let user = {
                  name: res.data.data.name,
                  phone: res.data.data.phone,
                  // phone:'1830280165',
                  idCard: res.data.data.idCard

                }
                // console.log(user)
                //缓存sessionId
                app.getStorage(res.data.data.sessionId).then(() => {
                  let str = JSON.stringify(this.data.content) //进入购物车
                  // console.log(str);
                  wx.navigateTo({
                    url: '../car/car?content=' + str + '&user=' + JSON.stringify(user) //商品和用户信息
                  })
                });

              });
              // sessionId = res.data;
            }).catch(error => {
              console.info('没来过' + ' ' + error.data);

              let par = {
                platForm: 'wx',
                scenicId: app.globalId.encryptionId,
                authorizeType: 'active',
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                code: app.globalCode.code,
                sessionId: null
              }
              app.wxPost(this.data.url + 'h5/buy/srAuthorize', par).then(res => {
                //获取用户信息
                // console.log(par);
                let user = {
                  name: res.data.data.name,
                  phone: res.data.data.phone,
                  idCard: res.data.data.idCard

                }
                // console.log(user)
                //缓存sessionId
                app.getStorage(res.data.data.sessionId).then(() => {
                  let str = JSON.stringify(this.data.content) //进入购物车
                  wx.navigateTo({
                    url: '../car/car?content=' + str + '&user=' + JSON.stringify(user) //商品和用户信息
                  })
                });

              });
            });
          } else {
            //用户按了拒绝按钮
            app.getHuancun().then(res => {
              let par = {
                platForm: 'wx',
                scenicId: app.globalId.encryptionId,
                authorizeType: 'silent',
                code: app.globalCode.code,
                sessionId: res.data
              }
              app.wxPost(this.data.url + 'h5/buy/srAuthorize', par).then(res => {
                // console.log(res);
                //获取用户信息
                let user = {
                  name: res.data.data.name,
                  phone: res.data.data.phone,
                  idCard: res.data.data.idCard
                }
                //缓存sessionId
                app.getStorage(res.data.data.sessionId).then(() => {
                  let str = JSON.stringify(this.data.content) //进入购物车
                  wx.navigateTo({
                    url: '../car/car?content=' + str + '&user=' + JSON.stringify(user) //商品和用户信息
                  })
                });

              });
            }).catch(error => {
              let par = {
                platForm: 'wx',
                scenicId: app.globalId.encryptionId,
                authorizeType: 'silent',
                code: app.globalCode.code,
                sessionId: null
              }
              app.wxPost(this.data.url + 'h5/buy/srAuthorize', par).then(res => {
                // console.log(res);
                //获取用户信息
                let user = {
                  name: res.data.data.name,
                  phone: res.data.data.phone,
                  idCard: res.data.data.idCard
                }
                //缓存sessionId
                app.getStorage(res.data.data.sessionId).then(() => {
                  let str = JSON.stringify(this.data.content) //进入购物车
                  wx.navigateTo({
                    url: '../car/car?content=' + str + '&user=' + JSON.stringify(user) //商品和用户信息
                  })
                });

              });
            });
          }
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        }
      })

    } else {
      wx.showToast({
        title: '请选择票哦，亲',
        icon: 'none'
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getDatalist(); //拉当前页面数据
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.getDatalist();
    this.onLoad();
    this.setData({
      num: 0
    });
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