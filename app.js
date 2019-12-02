const config = require('config.js');
App({
    onLaunch: function(options) {
        if (wx.cloud) {
            wx.cloud.init({
                traceUser: true,
                env: config.envID
            })
        } else {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        }
    }
})
