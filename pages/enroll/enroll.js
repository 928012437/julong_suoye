// pages/enroll/enroll.js
var t = getApp(),
  a = t.requirejs("core"),
  e = (t.requirejs("icons"), t.requirejs("wxParse/wxParse"));
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fromsearch:"../img/zr.png",
    showModalStatus: false,
    checked:'',
    content:'',
    realname:'',
    mobile:'',
    merchname:'',
    merchtype:'',
    salecate:'',
    desc:''
  },
  onShow:function(){
    this.getcontent();
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  getcontent:function(){
//获取协议
    var t = this;
    a.get("merch/getcontent", {}, function (a) {
      e.wxParse("content", "html", a, t, "5")
    })
  },
  merchnameinput: function (e) {
    this.setData({
      merchname: e.detail.value
    })
  },
  merchtypeinput: function (e) {
    this.setData({
      merchtype: e.detail.value
    })
  },
  salecateinput: function (e) {
    this.setData({
      salecate: e.detail.value
    })
  },
  descinput: function (e) {
    this.setData({
      desc: e.detail.value
    })
  },
  realnameinput: function (e) {
    this.setData({
      realname: e.detail.value
    })
  },
  mobileinput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例
    var animation = wx.createAnimation({
      duration: 200, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
    animation.translateY(240).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画：Y轴不偏移，停
      animation.translateY(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭抽屉
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  forcheck:function(){
    if (this.data.checked){
      this.setData(
        {
          checked: false
        })
    }else{
      this.setData(
        {
          checked: true
        })
    }
  },
  settled:function(){
    var data={
      realname: this.data.realname,
      mobile: this.data.mobile,
      merchname: this.data.merchname,
      merchtype: this.data.merchtype,
      salecate: this.data.salecate,
      desc: this.data.desc
    };
    var that=this;
    a.post("merch/register", data, function (a) {
      if (!that.data.checked){
          wx.showModal({
            title: '结果:失败',
            content: '请同意协议',
            showCancel: false
          })
          return
      }
      if(a.status==1){
        wx.showModal({
          title: '结果:成功',
          content: '提交完成，请等待审核',
          showCancel:false,
          success:function(){
            wx.switchTab({
              url: '../index/index'
            })
          }
        })
      }else{
        wx.showModal({
          title: '结果:失败',
          content: a.msg,
          showCancel: false
        })
      }
    })
  }
})