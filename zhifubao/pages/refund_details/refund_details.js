const app = getApp();

Page({
data:{
   type:0,//退款状态
        headerArr:'',//顶部
        processData:[
            {
              name:'平台审核通过',
              date:'2018.12.21',
              start:'#9F9F9F',
              end:'#80CA72',
              startPath:'../images/search/pr.png',
              endPath: '../images/search/pr_.png'
            },
            {
              name: '支付宝退款已到账',
              date: '2018.12.21',
              start: '#9F9F9F',
              end: '#80CA72',
              startPath: '../images/search/pr.png',
              endPath: '../images/search/pr_.png'
            }
    ]
},
onLoad(query) {
     this.setData({
      headerArr: JSON.parse(query.type)
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
