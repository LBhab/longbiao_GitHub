App({
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    // console.info('App onLaunch');
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
 //配置授权方法
  // getuserinfo:function(){
  //   return new Promise((resolve,reject)=>{
          
  //   });
  // },



  //配置公共数据
   globalCode:{
     code:''
  },
   // 公共文件
   globalId:{
     scenicId: '30', // 公共景区ID
     encryptionId:'',//加密后的id
     key:'JWCBZ-ULZ3J-YNKFR-FHX4S-ZRROZ-QYFED',//腾讯地图密钥
     url:'https://h5test.cdzhtc.com/'//公共后台地址
   },
//封装request (post)
   zfbPost:function(url,par){
     my.showLoading({
             content:'正在加载哟'
     });
      return  new  Promise((resolve,reject)=>{
         my.httpRequest({
           url: url, // 目标服务器url
           data:par,
           method:'POST',
           dataType:'json',
            headers: { 'Content-Type': 'application/json' },
           success: (res) => {
                 resolve(res)
                 my.hideLoading();
           },
           fail:(error)=>{
             my.showToast({
                  content:"请检查您的网络",
                  type:"fail"
             });
              reject(error);
           }
         });  
      });
   },
//封装request （get）
zfbGet:function(url){ 
    return new Promise((resolve,reject)=>{
              my.httpRequest({
                url: url, // 目标服务器url
                method:'GET',
                dataType:'json',
                headers: { 'Content-Type': 'application/json' },
                success: (res) => {
                    resolve(res)
                },
                fail:(error)=>{
                  reject(error);
                }
              });
    });
},

//缓存
  setstorage:function(data){
          return new Promise((resolve,reject)=>{
          my.setStorage({
          key: 'sessionId', // 缓存数据的key
          data: data, // 要缓存的数据
          success: (res) => {
            resolve(res);
          },
          fail:error=>{
              reject(error)
          }
        });
          })
  },
  //客服电话
     globalPhone:{
       phoneNumber:'02861111130'
     },


//获取缓存
huoqu:function(){
      return new Promise((resolve,reject)=>{
           my.getStorage({
                key:'sessionId',
                success:res=>{
                    resolve(res);
                },
                fail:error=>{
                     reject(error)
                }
           });
      });
}

});
