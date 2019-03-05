//封装cookie 存值
function cookieSet(dataName, params) {
    document.cookie = dataName + "=" + params;
};
//封装cookie 取值
function cookieGet(dataName) {
    return new Promise((resolve, reject) => {
        let dataList = document.cookie;
        //拆分组成数组
        let dataArry = dataList.split(' ') //去掉空格
            // console.log(dataArry);
        dataArry.map((value, index) => {
            //去除键值对的分号
            let number = value.indexOf(';'); //判断有没有分号（-1的值就是没有分号）
            // console.log(number);
            if (number != '-1') value = value.substr(0, number) //去掉分号
            let newStr = value.substr(0, value.indexOf('='));
            // console.log(newStr);
            if (newStr == dataName) {
                resolve(value.substr(value.indexOf('=') + 1))
            } else {
                reject('没有该缓存');
            };
        });

    });
};
//封装cooki删除值  
function cookieRemove(dataName) {
    cookieSet(dataName, '');
};
//导出
export default {
    cookieSet,
    cookieGet,
    cookieRemove
}