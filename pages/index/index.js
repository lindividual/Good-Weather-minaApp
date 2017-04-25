//index.js
//引入腾讯地图api
var QQMapWX = require('lib/qqmap-wx-jssdk.min.js');
var mapWX = new QQMapWX({
    key: 'NKDBZ-Q65RP-472DJ-L3PYW-LUDOH-RQBTX' // 必填
});
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    weatherList: [
      {
        date: '',
        type: '',
        high: ''
      }
    ],
    weatherType: '--',
    wenDu: '--',
    city: '--'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    console.log('get location');
    //获取地理位置
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(res){
        //把得到的坐标存起来
        console.log('get location success');
        console.log(res);
        var latitude = res.latitude;
        var longitude = res.longitude;
        // 调用腾讯地图的地址转换api
        mapWX.reverseGeocoder({
          location: {
              latitude: latitude,
              longitude: longitude
          },
          success: function(res) {
            //坐标转换为城市名称
              var city = res.result.address_component.city;
              that.setData({
                city: city,
              })
              console.log(city);
              //根据城市名称请求天气
              wx.request({
                url: 'https://wthrcdn.etouch.cn/weather_mini?city=' + city,
                data: {},
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function(res){
                  //请求天气成功
                  var wendu = res.data.data.wendu;
                  var weatherType = res.data.data.forecast[0].type;
                  var forecastList = res.data.data.forecast;
                  setWeather(wendu, weatherType);
                  console.log(res);
                  console.log(weatherType)

                  that.setData({
                    'weatherList' : forecastList
                  })

                  console.log(forecastList)
                },
                fail: function(res) {
                  // fail
                },
                complete: function(res) {
                  // complete
                }
              })
          },
          fail: function(res) {
              console.log('地址转换失败');
          },
          complete: function(res) {
              console.log('地址转换完成');
          }
        });
      },
      fail: function(res) {
        console.log('get location failed')
      },
      complete: function(res) {
        console.log('get location complete')
      }
    })
    var setWeather = function(wendu, weatherType) {
      that.setData({
        wenDu: wendu,
      })
      that.setData({
        weatherType: weatherType,
      })
    }
  }
})
