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
        console.log(this.data.keywords)
        store.skip(this.data.numbers).where({
            notes: db.RegExp({
                regexp: this.data.keywords,
                options: 'i',
            })
        }).get().then(res => {
            /**
             * 如果没有数据，就提示没有商户了，并返回。
             */
            if (res.data.length == 0) {
                this.setData({
                    searched: true
                })
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