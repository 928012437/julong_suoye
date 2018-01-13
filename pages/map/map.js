var t = getApp(),
  a = t.requirejs("core");

Page({
  data: {
    waer:"",
    pohe:"",
    present: "",
    lng:0,
    lat:0,
    markers: [{
      iconPath: "/pages/img/map.png",
      id: 0,
      latitude: 0,
      longitude: 0,
      width: 20,
      height: 30
    }]
  },
  onLoad: function (option){
    this.getmap(option.id)
  },
  getmap(id){
    var that = this;
    a.get("merch/getmap", {id:id}, function (a) {
      console.log(a)
      that.setData({
          waer: a.merchname,
          pohe: a.catename,
          present: a.desc,
          lng:a.lng,
          lat:a.lat,
          markers: [{
            iconPath: "/pages/img/map.png",
            id: 0,
            latitude: a.lat,
            longitude: a.lng,
            width: 20,
            height: 30
          }]
        })
    })
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})