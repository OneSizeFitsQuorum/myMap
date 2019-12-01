const app = getApp();
const db = wx.cloud.database()
const store = db.collection('store');
const config = require('../../config.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.showLoading({
            title: '加载中...',
        })
        store.doc(options.id).get().then(res => {
            wx.setNavigationBarTitle({
                title: res.data.title,
            });
            // 两次切割以适配中英文逗号
            let keywords_array = res.data.keywords.split(',').map(item => {
                return item.split('，')
            })
            // 将数组压平
            let keywords = [].concat.apply([], keywords_array);
            res.data.keywords = keywords
            this.setData({
                store: res.data,
                isAdmin: app.globalData.isAdmin
            }, res => {
                wx.hideLoading();
            })
        })
    },
    tapImage: function(e) {
        wx.previewImage({
            urls: this.data.store.images,
            current: e.currentTarget.dataset.url
        })
    },
    
    copyPath: function(e) {
        let path = this.route + "?id=" + this.data.store._id
        wx.setClipboardData({
            data: path,
            success: res => {
                wx.showToast({
                    title: '路径复制成功',
                    icon: "success"
                })
            }
        })
    },
  
    callContact: function(event) {
        wx.makePhoneCall({
            phoneNumber: this.data.store.contact
        })
    },

    navigate: function(e) {
        wx.openLocation({
            latitude: this.data.store.latitude,
            longitude: this.data.store.longitude,
            name: this.data.store.title,
            address: this.data.store.address
        })
    },

    deleteItem: function(e) {
        wx.showModal({
            title: '删除确认',
            content: '您真的要删除' + this.data.store.title + "么？",
            success: res => {
                if (res.confirm) {
                    store.doc(this.data.store._id).remove().then(res => {
                        wx.showToast({
                            title: '删除成功',
                            icon: 'success',
                            success: res => {
                                wx.navigateBack({
                                    delta: 2
                                })
                            }
                        })
                    }).catch(error => {
                        wx.showToast({
                            title: '删除失败！请添加微信 ixiqin_com 排查问题',
                        })
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }
})