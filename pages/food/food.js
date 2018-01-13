var t = getApp(),
  e = t.requirejs("core");

Page({
  data: {
    text: "Page main",
    background: [
      {
        color: 'green',
        sort: 1
      },
      {
        color: 'red',
        sort: 2
      },
      {
        color: 'yellow',
        sort: 3
      }
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 3000,
    duration: 1200,
    toView: 'blue',
    'menus': '',
    selectedMenuId: 1,
    total: {
      count: 0,
      money: 0
    },
    cartdata: [],
    cantarp:1,
    merchid:0
  },
  selectMenu: function (event) {
    let data = event.currentTarget.dataset
    this.setData({
      toView: data.tag,
      selectedMenuId: data.id
    })
    // this.data.toView = 'red'
  },
  addCount: function (event) {
    let data = event.currentTarget.dataset
    let total = this.data.total
    let menus = this.data.menus
    var flag=0
    var ind=0
    let menu = menus.find(function (v) {
      return v.id == data.cid
    })
    let dish = menu.dishs.find(function (v) {
      return v.id == data.id
    })
    dish.count += 1;
    total.count += 1
    total.money += dish.price
    total.money = Math.round(total.money * 100) / 100
    this.setData({
      'menus': menus,
      'total': total
    })

    let cartdata = this.data.cartdata
    var cartgood = { id: data.id, total:1}
    cartdata.forEach(function(val,num){
      if (val.id == data.id){
        ind = num
        flag=1
        cartgood = { id: data.id, total: ++val.total}
      }
    })
    if(flag){
      cartdata.splice(ind,1)
      cartdata.push(cartgood)
    }else{
      cartdata.push(cartgood)
    }

    console.log(cartgood)
    this.setData({
      'cartdata': cartdata
    })
    
  },
  minusCount: function (event) {
    let data = event.currentTarget.dataset
    let total = this.data.total
    let menus = this.data.menus
    var flag = 0
    let menu = menus.find(function (v) {
      return v.id == data.cid
    })
    let dish = menu.dishs.find(function (v) {
      return v.id == data.id
    })
    if (dish.count <= 0)
      return
    dish.count -= 1;
    total.count -= 1
    total.money -= dish.price
    total.money = Math.round(total.money * 100) / 100
    this.setData({
      'menus': menus,
      'total': total
    })

    let cartdata = this.data.cartdata
    var cartgood = { id: data.id, total: 1 }
    cartdata.forEach(function (val, num) {
      if (val.id == data.id) {
        cartdata.splice(num,1)
        if(val.total!=1){
          flag = 1
          cartgood = { id: data.id, total: --val.total }
        }
      }
    })

    if (flag) {
      cartdata.push(cartgood)
    }
    this.setData({
      'cartdata': cartdata
    })
    
  },
  createorder: function () {
    var cartdata=JSON.stringify(this.data.cartdata);
    wx.redirectTo({
      url: "/pages/order/create/index?cartdata=" + cartdata
    })
    
  },
  onLoad: function (option) {
    var that = this;
    this.setData({
      merchid: option.merchid
    });
    e.post("goods/get_cag", { merchidx: this.data.merchid }, function (e) {
      that.setData({
        menus: e.list
      })
    });
  },
  onShow: function () {
    // 页面显示

    this.setData({
      'cantarp': 1
    })
  }
})