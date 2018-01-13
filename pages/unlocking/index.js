import Config from '../../etc/config';
var app = getApp();

Page({
  data: {
    motto: 'Hello World',
    openid:'',
    avatar: '',
    nickname:'',
    title:'',
    shoptel:'',
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    lat:'',
    lng:'',
    adress:'',
    name:'',
    tel:'',
    code:'',
    xxadress:'',
    time:'当天',
    height:50,
    dates:'点击选择',
    verify:'',
    vtext:'发送验证码',
    disabled_1:'',
    disabled_2:'',
    showModal: false,
    formid_1:'',
    telflag:true
  },
  //事件处理函数  
  onLoad: function () {
    var that = this;
      //更新数据  
      app.getOpenid(function(res){
        that.setData({
          openid: res.openid,
          avatar: res.avatar,
          nickname: res.nickname,
          title: res.title,
          shoptel: res.shoptel,
          name:res.name,
          tel: res.tel,
          xxadress: res.xxadress,
        })
        if (res.tel){
          that.setData({
          vtext :'重新验证',
          telflag:false
          })
        }
      });

      this.initadress();
      
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });  
  },
  initadress:function(){
    var that=this;
    wx.showLoading({
      title: '定位中',
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
    wx.request({
      url: Config.basePath + 'getadress&lat=' + res.latitude + '&lng=' + res.longitude,
      success: function (res2) {
        that.setData({
          lat: res.latitude,
          lng: res.longitude,
          adress: res2.data
        });
        that.calibrationheight(res2.data);
        wx.hideLoading();
      }
    })
      }
    })
  },
  choseadress:function(){
    var that=this;
    wx.chooseLocation({
      success:function(res){
        that.setData({
          lat: res.latitude,
          lng: res.longitude,
          adress: res.address
        })
        that.calibrationheight(res.address);
      }
    })
  },
  calibrationheight:function(str){
    var that=this;
    if (str.length > 18) {
      that.setData({
        height: 100
      })
    } else {
      that.setData({
        height: 50
      })
    }
  },
  // nameinput: function (e) {
  //   this.setData({
  //     name: e.detail.value
  //   })
  // },
  telinput: function (e) {
    this.setData({
      tel: e.detail.value,
      telflag:true,
      verify:''
    })
  },
  codeinput: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  xxadressinput:function(e){
    this.setData({
      xxadress: e.detail.value
    })
  },
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView),
      time: (!that.data.showView ?that.data.dates:'当天')
    })
  },
  bindDateChange: function (e) {
    var that = this;
    this.setData({
      dates: e.detail.value,
      time: e.detail.value
    })
  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.shoptel,
      success: function () {
        // console.log("拨打电话成功！")
      },
      fail: function () {
        // console.log("拨打电话失败！")
      }
    })
  },
   swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
   submit_1(e){
     var that = this;
     that.setData({
       formid_1: e.detail.formId,
       showModal:true
     })
   },
   preventTouchMove: function () {
   },
   hideModal: function () {
     this.setData({
       showModal: false
     });
   },
   onCancel: function () {
     this.hideModal();
   },
   submit:function(e){
     var that=this;
     var data=this.data;

     data.formid=e.detail.formId;
     wx.showLoading({
       title: '正在提交',
     });
     that.setData({
       disabled_1:true,
       showModal: false
     })

     if (this.data.telflag && (this.data.verify == '' || this.data.verify != this.data.code)){
       wx.hideLoading();
       that.setData({
         disabled_1: ''
       })
       wx.showModal({
         title: '提示',
         showCancel: false,
         content: '验证码不正确'
       })
       return
     }
     
     wx.request({
       url: Config.basePath + 'submit',
       method:'POST',
       header: {'content-type': 'application/x-www-form-urlencoded'},
       data:data,
       success: function (res) {
        //  console.log(res)
         wx.hideLoading();
         that.setData({
           disabled_1: ''
         })
         if (res.data.status==1){
           that.setData({
             verify: ''
           })
           wx.navigateTo({
             url: '/pages/jop/jop'
           })
         }else{
           wx.showModal({
             title: '提示',
             showCancel:false,
             content: res.data.msg
           })
         }
       }
     })
   },

   sendcode:function(){
     var that =this;
     that.setData({
       disabled_2: true
     })
     if (that.data.tel==''){
       wx.showModal({
         title: '提示',
         showCancel: false,
         content: '请先填写手机号'
       })
       that.setData({
         disabled_2: ''
       })
       return;
     }

     wx.request({
       url: Config.basePath + 'verify&tel=' + that.data.tel,
       success: function (res) {
        //  console.log(res)
         if (res.data.status==0){
           wx.showModal({
             title: '提示',
             showCancel: false,
             content: res.data.msg
           })
           that.setData({
             disabled_2: ''
           })
         }else{
           that.setData({
             verify: res.data.verify,
             telflag: true
           })
          that.countdown(1);
         }
       }
     })
   },
   countdown:function(flag){
     var that = this;
     
     if (flag == 1) {
       that.setData({
         vtext: 60
       });
       that.countdown(0);
     } else {

       setTimeout(function () {

         if (that.data.vtext == 1) {
           that.setData({
             vtext: '发送验证码',
             disabled_2:''
           });
         } else {
           that.setData({
             vtext: that.data.vtext - 1
           });
           that.countdown(0);
         }

       }, 1000);

     }

   },
   onShareAppMessage: function (res) {
   },

   imageLoad: function () {
     this.setData({
       winHeight: wx.getSystemInfoSync().winHeight
     })
   },
   powerDrawer: function (e) {
     var currentStatu = e.currentTarget.dataset.statu;
     this.util(currentStatu)
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
     animation.translateX(-(wx.getSystemInfoSync().windowWidth)).step();

     // 第4步：导出动画对象赋给数据对象储存 
     this.setData({
       animationData: animation.export()
     })

     // 第5步：设置定时器到指定时候后，执行第二组动画 
     setTimeout(function () {
       // 执行第二组动画：Y轴不偏移，停 
       animation.translateX(0).step()
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
   skip1:function(){
     wx.navigateTo({
       url: '/pages/jop/jop'
     })
   },
   skip2: function () {
     wx.navigateTo({
       url: '/pages/tabulation/tabulation'
     })
   }
})  