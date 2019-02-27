const app = getApp();
// const WxParse = require('../../wxParse/wxParse.js');//引入模板js
Page({
  data: {
       url: app.globalId.url,//设置公共的后台路径 
        type:'',//支付成功打印出二维码
         header:[],//头部
         body:[],//中间图片
         footer:[],//底部
         useMethod:'',//使用方法
         //重新出票的参数
        orderNo:'',//订单号
        sessionId: '',//sessionId用于查询解密
        // scenicId:'',//景区id
        imgbool:false,//遮罩层弹出
        imageSrc:""//放大后的二维码图片
  },
  //  退款成功啦
  goReturnP:function(){

         my.navigateTo({
           url: '../returns/returns'
         })

  },
//首页
  baclheader:function(){
    my.switchTab({
      url: '../home/home',
    })
  },
   //再次出票
  outpaperAgin: function () {
    // console.log(e);
    let par = {
      sessionId: this.data.sessionId,//解密查询
      orderNo: this.data.orderNo,
      userFlag:0,
      scenicId: app.globalId.encryptionId,
      flag:'OUT_TICKET_AGAIN'//明天修改
    };
    console.log(par);
    app.zfbPost(this.data.url + 'h5/order/createOrder', par).then(res => {
      console.log(res);
      //判断是否出票成功
      let products = res.data.data.productArray.length;
      if (products > 0 ){//再次出票成功
        this.setData({
          type: 0,
          body: res.data.data.productArray
        });
      } else {//再次出票失败
        this.setData({
               type:2
        });
      }

    });
  },
   //再次出票失败执行退款
  returnMoney: function () {
    //  console.log(e);
    let par = {
      sessionId: this.data.sessionId,//解密查询
      orderNo: this.data.orderNo,
      scenicId: app.globalId.encryptionId
    };
     console.log(par);
    app.zfbPost(this.data.url + 'h5/order/refundOrder', par).then(res => {
     console.log(res);
      if (res.data.code == '0000') {
        // wx.showToast({
        //   title: '申请退款成功',
        //   icon: 'none'
        // })
        // 申请成功之后return页面
      my.navigateTo({
        url: '../returns/returns?money=' + this.data.header.totalPrice,
      })
        
      }

    });
  },
  //点击二维码放大
  ratatoPicture:function(e){
//给图片赋值和弹出弹框
  let imageSrc = e.currentTarget.dataset.img
    console.log(imageSrc);
    this.setData({
      imgbool: true,
      imageSrc: imageSrc
    });

  },
//取消遮罩
  hidenimage:function(){
    this.setData({
      imgbool: false
    });
  },
onLoad(query) {
//设置订单号 和 景区id
// console.log(query);
    this.setData({
      orderNo: JSON.parse(query.order).orderNo,
      // scenicId: app.globalId.encryptionId
    });
    //拉取缓存
    app.huoqu().then(res=>{
                this.setData({
                  sessionId:res.data,
                });
    });
    let ewmpictrue = JSON.parse(query.product)
    console.log(ewmpictrue);
    // console.log(JSON.parse(options.order));
    // console.log(JSON.parse(options.scenicInfo));
//当有二维码失败的时候就显示重新打印二维码  
    ewmpictrue.forEach(res=>{
      // console.log(res.qrCode);
      if (res.qrCode == null ){
        // debugger
        this.setData({
          type:1,//二维码失败
          header: JSON.parse(query.order),
          body: JSON.parse(query.product),
          footer: JSON.parse(query.scenicInfo),
          //使用正则表达式去除多余的标签
          useMethod: JSON.parse(query.scenicInfo).useMethod.replace(/<\/?(img|a|p|span|strike|u|i|b)[^>]*>/gi, '')
        });
        return false;
      } else {
        // debugger
              this.setData({
                      type: 0,//二维码成功
                      header: JSON.parse(query.order),
                      body: JSON.parse(query.product),
                      footer: JSON.parse(query.scenicInfo),
                      //使用正则表达式去除多余的标签
                      useMethod: JSON.parse(query.scenicInfo).useMethod.replace(/<\/?(img|a|p|span|strike|u|i|b)[^>]*>/gi, '')
    });
            }
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
