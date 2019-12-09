const app = getApp();
const db = wx.cloud.database()
const store = db.collection('store');
import Button from '../../dist/button/index';
import Toast from '../../dist/toast/toast';
Page({
    data: {
        fileList: []
    },

    

    chooseLocation: function(event) {
        let that = this;
        wx.chooseLocation({
            success: function (res) {
                console.log(res)
                that.setData({
                    address: res.address,
                    latitude: res.latitude,
                    longitude: res.longitude,
                })
            },
            fail: function () {
                wx.getSetting({
                    success(res) {
                        if (!res.authSetting['scope.userLocation']) {
                            console.log("f1")
                            wx.authorize({
                                scope: 'scope.userLocation',
                                success() {
                                    wx.chooseLocation({
                                        success: function (res) {
                                            that.setData({
                                                address: res.address,
                                                latitude: res.latitude,
                                                longitude: res.longitude,
                                            })
                                        },
                                    })
                                    console.log('success2')
                                },
                                fail() {
                                    console.log("f2")
                                }
                            })
                        }
                    }
                })
            }
        })
    },

    createItem: function(event) {
        let value = event.detail.value
        if (!value.notes){
            Toast.fail('请输入感想');
            return
        }
        if (!this.data.latitude ){
            Toast.fail('请地图选址');
            return
        }
        console.log(this.data.fileList)
        if (this.data.fileList.length == 0) {
            Toast.fail('请上传图片');
            return
        }
        Toast.loading({
            duration: 0,
            mask: true,
            message: '加载中...'
        });
        let items = this.data.fileList
        const uploadTask = items.map(item => this.uploadPhoto(item.path))
        Promise.all(uploadTask).then(result => {
            let files = [];
            for (const file of result) {
                files.push({ "path": file.fileID });
            }
            this.setData({
                fileList: files,
            }, () => {
                let files = []
                let fileList = this.data.fileList
                console.log(fileList)
                for (let i = 0; i < fileList.length;i++) {
                    console.log(fileList[i])
                    files.push(fileList[i].path);
                }
                console.log(files)
                store.add({
                    data: {
                        ...value,
                        iconPath: "/images/marker.png",
                        longitude: this.data.longitude,
                        latitude: this.data.latitude,
                        address: this.data.address,
                        images: files
                    }
                }).then(res => {
                    Toast.success('创建成功');
                    setTimeout(function () {
                        wx.navigateBack({})
                    }, 1000);
                }).catch(error => {
                    console.error(error);
                })
            })

        }).catch(() => {
            Toast.fail('创建失败');
            return 
        })
  
 
    },

    afterRead(event) {
        const { file, name } = event.detail;
        const fileList = this.data.fileList;
        this.setData({ fileList: fileList.concat(file) });
    },

    delete(event) {
        console.log(event)
        const { index, name } = event.detail;
        const fileList = this.data.fileList;
        fileList.splice(index, 1);
        this.setData({ fileList: fileList });
    },
    
    uploadPhoto(filePath) {
        return wx.cloud.uploadFile({
            cloudPath: `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}.png`,
            filePath
        })
    }
})