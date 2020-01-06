const app = getApp();
const config = require('../../config.js');
const db = wx.cloud.database()
const store = db.collection('store');
const userInfo = db.collection('userInfo');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        longitude: config.longitude,
        latitude: config.latitude,
        mapSubKey: config.mapSubKey,
        defaultScale: config.scale,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            windowHeight: app.globalData.windowHeight,
            isAdmin: app.globalData.isAdmin,
        })
    },

    onShow: function() {
        wx.showLoading({
            title: 'Loading...',
        })
        this.listData()
        wx.hideLoading();
    },

    listData: function() {
        store.get().then(res => {
            let data = res.data;
            data.map(item => {
                item.id = item._id
            });
            this.setData({
                stores: res.data
            })
        })
    },

    viewAll: function() {
        wx.navigateTo({
            url: '../list/list',
        })
    },

    onMarkerTap: function(event) {
        wx.navigateTo({
            url: '../info/info?id=' + event.markerId,
        })
    },

    search: function() {
        wx.navigateTo({
            url: '../search/search',
        })
    },

    manage:function(){
        wx.navigateTo({
            url: '../add/add',
        })
    },

    getOpenID: function (event) {
        wx.cloud.callFunction({
            name: "getUserOpenId"
        }).then(res => {
            wx.setClipboardData({
                data: res.result.openid,
                success: res => {
                    wx.showToast({
                        title: 'OpenID Copyed',
                    })
                }
            })
        })
    }
    
})