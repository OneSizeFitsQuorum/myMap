//login.js
//获取应用实例
var app = getApp();
import Toast from '../../dist/toast/toast';
Page({
    data: {
        angle: 0,
    },

    goToMap: function() {
        Toast.loading({
            mask: true,
            message: '加载地图中...'
        });
        let info = wx.getSystemInfoSync();
        wx.cloud.callFunction({
            name: 'checkUserAuth'
        }).then(res => {
            app.globalData = {
                windowHeight: info.windowHeight,
                isAdmin: res.result.data.is_administrator
            }
            wx.redirectTo({
                url: '/pages/map/map',
            })
        })
    },

    onReady: function() {
        var that = this;
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