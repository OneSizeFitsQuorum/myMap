const app = getApp();
const db = wx.cloud.database()
const store = db.collection('store');
import Search from '../../dist/search/index';
import Screen from '../../dist/skeleton/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        numbers: 0,
        stores: []
    },
    onLoad: function(options) {
        this.loadData();
    },

    loadData: function() {
        store.skip(this.data.numbers).get().then(res => {
            if (res.data.length == 0) {
                wx.showToast({
                    title: '没有别的地点了！',
                    icon: 'none'
                });
            } else {
                this.setData({
                    stores: this.data.stores.concat(res.data),
                    numbers: this.data.numbers + res.data.length
                });
            }
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        this.loadData();
    },
    
    navigateToSearch: function(e) {
        wx.navigateTo({
            url: '../search/search',
        })
    }
})