const app = getApp();
const db = wx.cloud.database()
const store = db.collection('store');
const config = require('../../config.js');

Page({
    data: {},

    onLoad: function(options) {
        wx.showLoading({
            title: 'Loading...',
        })
        store.doc(options.id).get().then(res => {
            console.log(res.data.images)
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

    navigate: function(e) {
        wx.openLocation({
            latitude: this.data.store.latitude,
            longitude: this.data.store.longitude,
            address: this.data.store.address
        })
    },

    deleteItem: function(e) {
        wx.showModal({
            title: 'Delete Confirm',
          content: 'Do you really want to delete it?',
            success: res => {
                if (res.confirm) {
                    store.doc(this.data.store._id).remove().then(res => {
                        wx.showToast({
                            title: 'Delete succeed!',
                            icon: 'success',
                            success: res => {
                                wx.navigateBack({
                                    delta: 2
                                })
                            }
                        })
                    }).catch(error => {
                        wx.showToast({
                          title: 'Delete failed!',
                            icon: 'fail',
                        })
                    })
                }
            }
        })
    }
})