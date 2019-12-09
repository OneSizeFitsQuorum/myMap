const app = getApp();
const db = wx.cloud.database()
const store = db.collection('store');
import Search from '../../dist/search/index';
Page({
    data: {
        numbers: 0,
        stores: [],
        focus: false,
        searched: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            focus: true
        })
    },


    onReachBottom: function() {
        this.loadData();
    },

    loadData: function() {
        store.skip(this.data.numbers).where({
            address: db.RegExp({
                regexp: this.data.keywords,
                options: 'i',
            })
        }).get().then(res => {
            console.log(res)
            if (res.data.length == 0) {
                if (this.data.searched) {
                    this.setData({
                        numbers: 0,
                        stores: [],
                    })
                } else {
                    this.setData({
                        searched: true
                    })
                }
            } else {
                this.setData({
                    stores: this.data.stores.concat(res.data),
                    numbers: this.data.numbers + res.data.length
                });
            }
        })
    },
    search: function(e) {
        console.log(e)
        this.setData({
            keywords: e.detail
        }, res => {
            this.loadData();
        })
    }
})