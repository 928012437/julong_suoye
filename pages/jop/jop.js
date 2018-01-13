import Config from '../../etc/config';
var app = getApp();

Page({
  data: {
    showView: true,
    showModal: false,
    showModal2:false,
    openid:'',
    list:[],
    id:'',
    money:'',
    content:''
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;
    showView: (options.showView == "true" ? true : false);
    app.getOpenid(function (res) {
      that.setData({
        openid: res.openid,
      });
      that.getorderlist();
    });
  },
  getorderlist:function(){
    var that=this;
    wx.request({
      url: Config.basePath + 'getorderlist&openid=' + that.data.openid,
      success: function (res) {
        that.setData({
          list:res.data
        })
      }
    })
  },
  inputChange: function (e) {
    this.setData({
      money: e.detail.value
    })
  },
  inputChange2: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  showDialogBtn: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      showModal: true,
      id: id,
      money:''
    })
  },
  showContent:function(e){
    var id = e.currentTarget.dataset.id;
    var content = e.currentTarget.dataset.content;
    this.setData({
      showModal2: true,
      id: id,
      content: content
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false,
      showModal2: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    if (that.data.money==0){
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确金额'
      })
      return;
    }
    //统一下单接口对接
    wx.request({
      url: Config.basePath + 'wxpay',
      data: {
        openid: that.data.openid,
        body: '巨龙锁业',
        momeny: that.data.money
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (response) {
        wx.hideLoading();

        // 发起支付
        wx.requestPayment({
          'timeStamp': response.data.timeStamp,
          'nonceStr': response.data.nonceStr,
          'package': response.data.package,
          'signType': 'MD5',
          'paySign': response.data.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功'
            });
            // 修改订单金额及支付方式

            wx.request({
              url: Config.basePath + 'payorder&orderid=' + that.data.id + '&price=' + that.data.money,
              success: function (res) {
                that.hideModal();
                
                if (res.data.status == 1) {
                  that.getorderlist();
                } else {
                  wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: '网络错误'
                  })
                }
                
              }
            })

          }
        });
      }
    });
    
  },
  onConfirm2:function(){
    var that=this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: Config.basePath + 'updcontent&orderid=' + that.data.id + '&content=' + that.data.content,
      success: function (res) {
        wx.hideLoading();
        that.hideModal();

        if (res.data.status == 1) {
          wx.showToast({
            title: '评论成功'
          });
          that.getorderlist();
        } else {
          wx.showModal({
            title: '提示',
            showCancel2: false,
            content: '网络错误'
          })
        }
      }
    })
  }
})