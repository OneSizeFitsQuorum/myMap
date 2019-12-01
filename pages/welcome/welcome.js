//login.js
//获取应用实例
var app = getApp();
Page({
    data: {
        remind: '加载中',
        angle: 0,
    },
    goToMap: function() {
        wx.redirectTo({
            url: '/pages/map/map',
        })
    },
    onLoad:function(){
        let info = wx.getSystemInfoSync();
        wx.cloud.callFunction({
            name: 'checkUserAuth'
        }).then(res => {
            console.log(res)
            app.globalData = {
                windowHeight: info.windowHeight,
                isAdmin: res.result.data.is_administrator
            }
        })
    },

    onReady: function() {
        var that = this;
        setTimeout(function() {
            that.setData({
                remind: ''
            });
        }, 1000);
        wx.onAccelerometerChange(function(res) {
            var angle = -(res.x * 30).toFixed(1);
            if (angle > 14) {
                angle = 14;
            } else if (angle < -14) {
                angle = -14;
            }
            if (that.data.angle !== angle) {
                that.setData({
                    angle: angle
                });
            }
        });
    }
});