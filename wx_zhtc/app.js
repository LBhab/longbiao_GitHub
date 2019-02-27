//app.js
App({
  // code:null,
  onLaunch: function () {
    // 展示本地存储能力
    var _that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 登录
    wx.login({
      success: res => {
        // _that.code = res.code;
        // console.log(_that.code);
        // this.globalCode.code = res.code;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              //  console.log(res);
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //利用promise 封装get 方法 参数是用对象的方式传递
   wxGet:function(url,params){
     return new Promise((resolve, reject) => {
      wx.request({
         url: url,
         data: params,
         header: { 'Content-Type': 'application/json', },//GET请求
         method: 'GET',
         dataType: 'json',
         success: function (res) {
           resolve(res);
         },
         fail:function(error){
              reject(error);
         }
       })
     });
   },
   //利用promise 封装post 方法
  wxPost: function (url,params) {
    // 显示加载图标  
    wx.showLoading({//正在加载中，空白期过度
      title: '正在加载哟'
    })
    return new Promise((resolve, reject) => {
     wx.request({
        url: url,
        data:params,
        // header: { "Content-Type": "application/x-www-form-urlencoded" },//POST请求
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          resolve(res);
          wx.hideLoading();
        },
        fail:function(error){
          reject(error);
          wx.showToast({
            title: '请检查您的网络',
            icon:'loading'
          })
        }
      })
    });
  },
 //异步缓存sessionId
   getStorage:function(key){
     return new Promise((resolve,reject)=>{
           wx.setStorage({
             key: 'sessionId',
             data: key,
             success:res=>{
                  resolve(res)
             },
             fail:res=>{
                 reject(res)
             }
           })
      });
   },

  //封装获取缓存值得方法
       getHuancun:function(){
         return new Promise((resolve, reject)=>{
              wx.getStorage({
                key: 'sessionId',
                success: function (res) {
                  resolve(res)
                 },
                fail: function (res) { 
                  reject(res);
                },
                complete: function (res) {
                  reject(res);
                 },
              })
               
            })

       },
//客服电话
     globalPhone:{
       phoneNumber:'02861111130'
     },

  globalCode:{
     code:''
  },
  globalData: {
    userInfo: null,
  },
// 公共文件
   globalId:{
     scenicId: '30', // 公共景区ID
     encryptionId:'',//加密后的id
     key:'JWCBZ-ULZ3J-YNKFR-FHX4S-ZRROZ-QYFED',//腾讯地图密钥
     url:'https://h5test.cdzhtc.com/'//公共后台地址
   },
})
