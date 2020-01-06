const app = getApp();
const db = wx.cloud.database()
const store = db.collection('store');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        numbers: 0,
        stores: []
    },


    onShow: function() {
        this.loadData(false);
    },

    loadData: function(bottom) {
        if (bottom) {
            store.skip(this.data.numbers).get().then(res => {
                if (res.data.length == 0) {
                    wx.showToast({
                      title: 'There is no other place!',
                        icon: 'none'
                    });
                } else {
                    this.setData({
                        stores: this.data.stores.concat(res.data),
                        numbers: this.data.numbers + res.data.length
                    });
                }
            })
        } else {
            store.get().then(res => {
                if (res.data.length == 0) {
                    wx.showToast({
                      title: 'There is no other place!',
                        icon: 'none'
                    });
                } else {
                    this.setData({
                        stores: res.data,
                        numbers:res.data.length
                    });
                }
            })
        }
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        this.loadData(true);
    },

    navigateToSearch: function(e) {
        wx.navigateTo({
            url: '../search/search',
        })
    }
})