const app = getApp();

Page({
data:{
       datanumder:1,//判断用 
       url: app.globalId.url,//设置公共的后台路径 
       payed:[],//给钱。检完票，玩儿了的
       unpay:[],//没有给钱
       erweima:[],//二维码出票
      //  erweimaFail:[],//二维码失败
       returnmoney:[],//退款
       type:0,//菜单高亮选择
       flag: 0,//	订单状态（0 全部 1 待付款 2 待使用 3 退款/售后）
       sessionId: '',//sessionId用于查询解密
          //分页参数
       pageNum:1,//分页参数
       pageCount:0,//总页数
       pageamount:0,//条目总数
      dataList:[],//所有订单容器
       listlen:[]    //下拉刷新判断用 
},
//  菜单选择
  select:function(e){
    var id = e.currentTarget.dataset.id;
 
    this.setData({
      type:id,
      flag:id
    });
     this.setData({
      // dataList:[],
      pageNum:1
    });
    this.queryDataList();//啦数据

  },

  //获取全部订单
queryDataList:function(){
     let par = {
         sessionId: this.data.sessionId,//解密查询
         pageNum: this.data.pageNum,//当前页
         flag: this.data.flag,//	订单状态（0 全部 1 待付款 2 待使用 3 退款/售后）
       }
       console.log(par)
        app.zfbPost(this.data.url +'h5/order/queryOrders',par).then(res=>{
                  //分页修改
                    this.setData({//用作下来刷新判断用
                      listlen: res.data.data
                    });
        console.log(res);//获取税局成功
          let list = this.data.dataList;//重新赋值，用作更新用
          let pageindex = this.data.pageNum;  
          if(this.data.pageNum == 1){//当时当前页的时候
            // debugger
               list  = res.data.data;
               pageindex = 1;//把当前页面参数改为1；
               my.stopPullDownRefresh(); //禁止刷新
          }else{//当当前页面不为当前与页面的时候
          // debugger
             list = list.concat(res.data.data);//数组追加
             pageindex = pageindex +1;//充值页面索引为下一页
          }
           this.setData({
                       pageNum:pageindex,
                       pageCount: res.data.totalPage,
                       dataList:list
           });
          let number =this.data.dataList.length
          this.setData({
            datanumder:number
          });
             //判断状态操作
          let ungave = [];//没给钱
          let gave =[];//给钱了,可以可以删除
          let success =[];//出票成功
          // let fail =[];//出票失败
          let retuen = [];//退款
            this.data.dataList.forEach((ress, idx) => {
              //  if (ress.length>0){
              let money = 0;
              for (var val of ress.products) {//计算价格
                money += parseFloat(val.total_price)
              }
              ress.cunt = money;//计算价格
              if (ress.orderStatus == '005002' || ress.orderStatus == '005003') {//没给钱
                //  console.log(ress)
                ungave.push(ress);
              };
              if (ress.orderStatus == '005001' && ress.checkStatus == '1' && ress.ticketStatus != '2') {//给钱了得
                gave.push(ress);
              };
              if (ress.orderStatus == '005001' && ress.checkStatus == "0" && ress.refundStatus == null || ress.refundStatus =='3') {//出票成功
                success.push(ress);

              };
              if (ress.refundStatus != null && ress.refundStatus != '3') {//退款
                // console.log(ress)
                retuen.push(ress);
              }
              // console.log(retuen);
              //赋值
              this.setData({
                unpay: ungave,//没给钱了
                payed: gave,//给钱了得
                erweima: success,//二维码出票
                returnmoney: retuen//退款
              });
              //  }
            })
          if (number==0){//判断当值为空的时候
            this.setData({
              unpay: [],//没给钱了
              payed: [],//给钱了得
              erweima: [],//二维码出票
              returnmoney: []//退款
            })
           }
             
    });   
},
    
//取消订单
  cancelOrder:function(e){
    
    // console.log();
    let par = {
      sessionId: this.data.sessionId,//解密查询
      orderNo:e.currentTarget.dataset.orderNo
    } 
 
    app.zfbPost(this.data.url +'h5/order/cancelOrderV2',par).then(res=>{
      console.log(res);
      if (res.data.code == '0000'){
        // debugger
          my.showToast({
                type: 'success',
                content:'取消订单成功',
                duration: 1000,
              });

        this.queryDataList();
       }else{
          my.showToast({
                type: 'none',
                content:res.data.msg,
                duration: 1000,
              });
       }
       
    });
  },
//删除订单
  delet:function(e){
    let par = {
      sessionId: this.data.sessionId,//解密查询
      orderNo: e.currentTarget.dataset.orderNo
    } ;
    app.zfbPost(this.data.url + 'h5/order/delOrder', par).then(res => {
      // console.log(res.data);
      if (res.data.code == '0000') {
          my.showToast({
                 type: 'success',
                content:'删除订单成功',
                duration: 1000,
       })
        this.queryDataList();
      }

    });
  },
//申请退款
 returnMoney:function(e){
   console.log(e);
   let par = {
     sessionId: this.data.sessionId,//解密查询
     orderNo: e.currentTarget.dataset.orderNo,
     scenicId: app.globalId.encryptionId
   };
   app.zfbPost(this.data.url + 'h5/order/refundOrder', par).then(res => {
     console.log(res);
     if (res.data.code == '0000') {
       my.showToast({
                 type: 'success',
                content:'申请退款成功',
                duration: 1000,
       });
       this.queryDataList();
     }

   });
 },
//取消退款
  canlereturnmoney:function(e){
    console.log(e)
    let par = {
      sessionId: this.data.sessionId,//解密查询
      orderNo: e.currentTarget.dataset.orderNo
    };
    app.zfbPost(this.data.url + 'h5/order/cancelRefundOrder', par).then(res => {
      console.log(res.data);
      if (res.data.code == '0000') {
           my.showToast({
                 type: 'success',
                content:'取消退款成功',
                duration: 1000,
       });
        this.queryDataList();
      }else{
          my.showToast({
                 type: 'fail',
                content:res.msg,
                duration: 1000,
       });
        this.queryDataList();
      }

    });
  },
//查看二维码
  checkerweima:function(e){
    let par = {
      sessionId: this.data.sessionId,//解密查询
      orderNo: e.currentTarget.dataset.orderNo
    };
    app.zfbPost(this.data.url + 'h5/order/queryOrderByNo', par).then(res => {
             console.log(res);
           if(res.data.code=='0000'){
             let prodcutarr = res.data.data.productArray;
             let orderInfo = res.data.data.orderInfo;
              res.data.data.scenicInfo.scenicId = res.data.data.scenicInfo.scenicId.substr(0, res.data.data.scenicInfo.scenicId.indexOf("=="));
             let scenicInfo = res.data.data.scenicInfo;
            //  console.log(prodcutarr);
             my.navigateTo({
               url: '../pay_success/pay_success?product=' + JSON.stringify(prodcutarr) + "&order=" + JSON.stringify(orderInfo) + "&scenicInfo=" + JSON.stringify(scenicInfo),
             })
           }
    });
  },  

//获取退款详情(退款成功/失败)
  returnSuccess:function(e){
    //  debugger
    let par = {
      sessionId: this.data.sessionId,//解密查询
      orderNo: e.currentTarget.dataset.orderNo
    };
    app.zfbPost(this.data.url + 'h5/order/refundOrderDetail', par).then(res => {
      console.log(res);   
      if (res.data.code == '0000') {
        let type = {
          refundStatus: res.data.data.refundStatus,
          totalPrice: res.data.data.totalPrice
        };
        my.navigateTo({
          url: '../refund_details/refund_details?type=' + JSON.stringify(type),
        })
      }

    });
  },
  //重新支付
  payagin:function(e){
    // debugger
      let par = {
      sessionId: this.data.sessionId,//解密查询
      scenicId: app.globalId.encryptionId,//景区id
      flag: 'PAY_AGAIN',
      userFlag:0,
      orderNo: e.currentTarget.dataset.orderNo,
    };
    // console.log(par);
    app.zfbPost(this.data.url + 'h5/order/createOrder', par).then(res => {
      console.log(res);
      if (res.data.code == '0000') {
        my.tradePay({
           tradeNO: res.data.data.alipayTradeCreateResponse.tradeNo, // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
          success: (res) => {
            //设置头部显示以及出现二维码的按钮
               if(res.resultCode == "9000"){
                  this.queryDataList();
               }
          },
          
        })
      } else {
        my.showToast({
          content: '调起支付失败',
          type: 'fail'
        })
      }

    });
  },
  //再次出票
  outpaperAgin:function(e){
    let par = {
      sessionId: this.data.sessionId,//解密查询
      orderNo: e.currentTarget.dataset.orderNo,
      scenicId: app.globalId.encryptionId,//景区id
      userFlag:0,
      flag: 'OUT_TICKET_AGAIN'//明天修改
    };
    app.zfbPost(this.data.url + 'h5/order/createOrder', par).then(res => {
                                console.log(res);
  //做个判断
      let len = res.data.data.productArray.length;
      if (len>0){//出票成功
        this.queryDataList();
       }else{
         my.showToast({
          content: '再次出票失败,请退款',
          type: 'fail'
        })
        
       }
    })
  },
  //人工客服
   makePhoneCall() {
    my.makePhoneCall({ 
          number:app.globalPhone.phoneNumber
    });
  },
  //刷新支付状态（暂时没有）
  shuaxin:function(e){
    let par = {
      sessionId: this.data.sessionId,//解密查询
      orderNo: e.currentTarget.dataset.orderNo,
      scenicId: app.globalId.encryptionId
    };
    app.zfbPost(this.data.url + 'h5/order/queryAliOrderByNo', par).then(res=>{
              // console.log(res);
        if(res.data.code == '0000'){
          if (res.data.data.orderStatus == '005002'){//未支付订单
             my.showToast({
            content:'订单未支付',
            type:"fail"
          });
            // wx.showToast({
            //   title: '订单未支付',
            //   icon: 'none'
            // })  
          } else if (res.data.data.orderStatus == '005001'){//订单已经支付
            this.queryDataList();
          }
        }else{
          my.showToast({
            content:res.data.msg,
          });
            // wx.showToast({
            //   title: res.data.msg,
            //   icon:'none'
            // })       
        }      
    });
  },
onLoad(query) {
 //获取一步缓存
    let _this = this;
    //获取本地缓存
    app.huoqu().then(res => {
       console.log('已经登陆了')
      //当我拿到的缓存只为null的时候
       if(res.data == null){
           console.log('缓存的值'+ res.data);
           _this.setData({
            datanumder:0//当用户没有授权的时候没有缓存值，直接说没有记录
          });
          my.getAuthCode({
              success:res=>{
                // console.log(res)
                    let par = {
                    code: res.authCode,
                    sessionId: '',
                    platForm: 'ali',
                    authorizeType: 'silent',
                    scenicId: app.globalId.encryptionId
                    };
              app.zfbPost(_this.data.url + 'h5/buy/srAuthorize', par).then(data => {
               console.log(par)
             _this.setData({
             sessionId: data.data.data.sessionId
             });
              _this.queryDataList();//拿到缓存之后再啦数据
            }); 
              }
          });
         
          
       }else if(res.data != null){
            // console.log('缓存的值'+ res.data);
             // console.log(res);
      _this.setData({//先赋值一次
        sessionId: res.data
      });
      let par = {
        sessionId: res.data,
        pageNum: '1',//当前页
        flag:0
      }
 
      app.zfbPost(_this.data.url + 'h5/order/queryOrders', par).then(ress=>{
        // console.log(ress);//出现问题
        if (ress.data.code == '70016'){//当有
        my.getAuthCode({
          //  scopes: 'auth_user',
          success: (res) => {
                        let par = {
                               code: res.authCode,
                               sessionId: '',
                               platForm: 'ali',
                               authorizeType: 'silent',
                               scenicId: app.globalId.encryptionId
                             }
                                 app.zfbPost(_this.data.url + 'h5/buy/srAuthorize', par).then(data => {
                               _this.setData({
                                 sessionId: data.data.data.sessionId
                               });
                               app.setstorage(data.data.data.sessionId);//再存一次缓存
                               _this.queryDataList();//拿到缓存之后再啦数据
                             });       
                                         
                  },
        }); 
      }else{
                  //  debugger
        _this.queryDataList();//拿到缓存之后再啦数据
           }

      })
       }

      // _this.queryDataList();//拿到缓存之后再啦数据
    }).catch(()=>{//用户没有登录授权
   
       _this.setData({
            datanumder:0//当用户没有授权的时候没有缓存值，直接说没有记录
          });
          my.getAuthCode({
              success:res=>{
                    let par = {
              code: res.code,
              sessionId: '',
              platForm: 'ali',
              authorizeType: 'silent',
              scenicId: app.globalId.encryptionId
                    };
              app.zfbPost(_this.data.url + 'h5/buy/srAuthorize', par).then(data => {
              //  console.log(data)
             _this.setData({
             sessionId: data.data.data.sessionId
             });
              _this.queryDataList();//拿到缓存之后再啦数据
            }); 
              }
          });
          
                          
    });
   
},
onReady() {
// 页面加载完成
},
onShow() {
// 页面显示
this.onLoad();
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
   this.setData({
      pageNum: 1
    });
    this.queryDataList(); //拉数据
},
onReachBottom() {
 //  debugger
    console.log(this.data.listlen.length);
    if (this.data.listlen.length == 10){//当页面有10条记录并且拉到底的时候
      if (this.data.pageNum < this.data.pageCount) { //当当前页面索引小于总页数的时候还可以加载
        // debugger

        this.setData({
          pageNum: this.data.pageNum += 1
        });
        this.queryDataList(); //拉数据
      } else { //当当前页面索引等于总页数的时候不可以加载
      my.showToast({
            content:"人家是有底线的哟",
            type:"none"       
      });
      }
    }else{//当页面没有10条记录到底的时候
       my.showToast({
            content:"人家是有底线的哟",
            type:"none"       
      });
    }
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
