const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');//引入模板js
Page({
  data:{
    url:app.globalId.url,
      imgUrl:'',// logo
      video:'',//视屏
      scenicName:'',//景区名字
     logo_text:[
        { text:'梦幻川西之旅/毕棚沟-西岭雪山-成都'},
        { text: '梦幻川西之旅/毕棚沟-蜀南竹海-成都' },
        { text: '梦幻川西之旅/毕棚沟-张家界-成都' },
        { text: '梦幻川西之旅/毕棚沟-稻城-成都' }
      ]
  },
  onLoad(query) {
    // 页面加载
    // console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
          let id = app.globalId.scenicId;//引入公共景区id
          let par = {
            scenicId: id
          }  
        // par =JSON.stringify(par);  
          // console.log(par);
    app.zfbPost(this.data.url+'h5/index/getScenicConfig',par).then(res=>{
           console.log(res);
            app.globalId.encryptionId = res.data.data.scenicId;//把加密后的景区id放在公共文件中

            let image = res.data.data.pics[0];//图片
            let videos = res.data.data.videos[0];//视屏
            let text = res.data.data.introduction;//文本
            let scenicName = res.data.data.scenicName;//景区名字
             WxParse.myParse('article', 'html', text, this); //解析富文本
             this.setData({
                    imgUrl: image,
                    video:videos,
                    scenicName: scenicName
                    // text: text
                  });
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
    //   title: 'My App',
    //   desc: 'My App description',
    //   path: 'pages/index/index',
    // };
  },
});
