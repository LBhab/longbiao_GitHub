
require('./config$.js?appxworker=1');
require('./importScripts$.js?appxworker=1');
function success() {
require('../..//app.js?appxworker=1');
require('../../pages/home/home.js?appxworker=1');
require('../../pages/sellticet/sellticet.js?appxworker=1');
require('../../pages/notice/notice.js?appxworker=1');
require('../../pages/car/car.js?appxworker=1');
require('../../pages/orderlist/orderlist.js?appxworker=1');
require('../../pages/shouyin/shouyin.js?appxworker=1');
require('../../pages/pay_success/pay_success.js?appxworker=1');
require('../../pages/refund_details/refund_details.js?appxworker=1');
require('../../pages/map/map.js?appxworker=1');
require('../../pages/gonggao/gonggao.js?appxworker=1');
require('../../pages/index/index.js?appxworker=1');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
