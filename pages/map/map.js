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
        wx.showLoading({
            title: '数据加载中...',
        })
        this.listData()
        this.setData({
            windowHeight: app.globalData.windowHeight,
            isAdmin: app.globalData.isAdmin,
        })
        wx.hideLoading();
        wx.showToast({
            title: '双指缩放可以调整地图可视区域',
            icon: 'none'
        })
    },

    onShow: function() {
        this.listData()
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

    getOpenID: function(event) {
        wx.cloud.callFunction({
            name: "getUserOpenId"
        }).then(res => {
            wx.setClipboardData({
                data: res.result.openid,
                success: res => {
                    wx.showToast({
                        title: 'OpenID已复制',
                    })
                }
            })
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
    }
})