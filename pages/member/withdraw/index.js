var a = getApp(),
  e = a.requirejs("core"),
  t = a.requirejs("foxui"),
  n = a.requirejs("jquery");
Page({
  data: {
    loading: true,
    objectArray: [],
    checkedIndex: 1,
    checked: {},
    bankChecked: {},
    money: 0,
    chargeShow: false,
    disabled: true,
    info: {},
    realInfo: {}

  },
  onShow: function (e) {
    a.url(e),
      this.getInfo(),
      this.setData({
        isSubmit: false
      })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  getInfo: function () {
    var a = this;
    e.get("member/withdraw", {}, function (e) {
      var t = {
        info: e,
        objectArray: [],
        show: true
      };
      n.isEmptyObject(e.last_data) || (t.realInfo = {
        alipay: e.last_data.alipay,
        alipay1: e.last_data.alipay,
        bankcard: e.last_data.bankcard,
        bankcard1: e.last_data.bankcard,
        bankname: e.last_data.bankname,
        realname: e.last_data.realname
      }),
        e.type_array && n.each(e.type_array, function (a, e) {
          t.objectArray.push({
            id: e.type,
            name: e.title
          }),
            e.checked && (t.checked || (t.checked = {
              id: e.type,
              name: e.title
            }), t.checkedIndex = a)
        }),
        t.checked || (t.checked = t.objectArray[0], t.checkedIndex = 0),
        t.bankCheckedIndex = e.lastbankindex || 0,
        a.setData(t),
        e.withdrawmoney > 0 && e.credit >= e.withdrawmoney && (t.money = e.withdrawmoney, a.moneyChange({
          detail: {
            value: e.withdrawmoney
          }
        })),
        3 == t.checked.id && a.bankChange({
          detail: {
            value: e.lastbankindex || 0
          }
        }),
        wx.setNavigationBarTitle({
          title: e.moneytext + "提现"
        })
    })
  },
  bindAll: function (a) {
    this.data.info.credit <= 0 || (this.setData({
      money: this.data.info.credit
    }), this.allow(), this.moneyChange({
      detail: {
        value: this.data.info.credit
      }
    }))
  },
  allow: function () {
    var a = this.data.info,
      e = parseFloat(this.data.money);
    if (e <= 0 || isNaN(e))
      return false;
    if (a.withdrawmoney > 0 && e < a.withdrawmoney)
      return false;
    if (e > a.credit)
      return false;
    if (n.isEmptyObject(this.data.checked))
      return false;
    if (a.withdrawcharge > 0 && e > 0) {
      var t = e / 100 * a.withdrawcharge;
      t = Math.round(100 * t) / 100,
        t >= a.withdrawbegin && t <= a.withdrawend && (t = 0);
      var i = e - t;
      i = Math.round(100 * i) / 100,
        this.setData({
          deductionmoney: t,
          realmoney: i,
          chargeShow: true
        })
    }
    return true
  },
  moneyChange: function (a) {
    var e = a.detail.value;
    (e < 0 || isNaN(e)) && (e = 0),
      this.setData({
        money: e
      }),
      this.setData({
        disabled: !this.allow()
      })
  },
  pickerChange: function (a) {
    var e = {},
      t = a.detail.value;
    e.checked = this.data.objectArray[t],
      3 == e.
        checked.id && (e.bankChecked = this.data.info.banklist[0], e.bankCheckedIndex = 0),
      this.setData(e)
  },
  inputChange: function (a) {
    var e = this.data.realInfo,
      t = a.currentTarget.dataset.type,
      i = n.trim(a.detail.value);
    e[t] = i,
      this.setData({
        realInfo: e
      })
  },
  bankChange: function (a) {
    var e = n.trim(a.detail.value),
      t = this.data.info.banklist[e];
    this.setData({
      bankChecked: t
    })
  },
  submit: function (a) {
    var i = this,
      r = this.data;
    if (!r.disabled && !r.isSubmit) {
      if (r.money <= 0)
        return void t.toast(i, "请填写提现金额");
      if (n.isEmptyObject(r.checked))
        return void t.toast(i, "请选择提现方式");
      var o = r.checked.name,
        d = {
          applytype: r.checked.id,
          money: r.money
        };
      if (2 == r.checked.id) {
        if (!r.realInfo.realname)
          return void t.toast(i, "请填写姓名");
        if (!r.realInfo.alipay)
          return void t.toast(i, "请填写支付宝帐号");
        if (!r.realInfo.alipay1)
          return void t.toast(i, "请确认支付宝帐号");
        if (r.realInfo.alipay != r.realInfo.alipay1)
          return void t.toast(i, "两次填写的支付宝不一致");
        o += "？姓名:" + r.realInfo.realname + " 支付宝帐号:" + r.realInfo.alipay,
          d.realname = r.realInfo.realname,
          d.alipay = r.realInfo.alipay,
          d.alipay1 = r.realInfo.alipay1
      } else if (3 == r.checked.id) {
        if (n.isEmptyObject(r.bankChecked))
          return void t.toast(i, "请选择提现银行");
        if (!r.realInfo.realname)
          return void t.toast(i, "请填写姓名");
        if (!r.realInfo.bankcard)
          return void t.toast(i, "请填写银行卡号");
        if (!r.realInfo.bankcard1)
          return void t.toast(i, "请确认银行卡号");
        if (r.realInfo.bankcard != r.realInfo.bankcard1)
          return void t.toast(i, "两次填写的银行卡号不一致");
        o += "？姓名:" + r.realInfo.realname + " 银行:" + r.bankChecked.bankname + " 卡号:" + r.realInfo.bankcard,
          d.realname = r.realInfo.realname,
          d.bankname = r.realInfo.bankname,
          d.bankcard = r.realInfo.bankcard,
          d.bankcard1 = r.realInfo.bankcard1
      }
      if (r.checked.id < 2)
        var l = "确认要" + o + "？";
      else
        var l = "确认要" + o;
      r.info.withdrawcharge > 0 && (l += " 扣除手续费 " + r.deductionmoney + " 元,实际到账金额 " + r.realmoney + " 元"),
        e.confirm(l, function () {
          i.setData({
            isSubmit: true
          }),
            e.post("member/withdraw/submit", d, function (a) {
              if (a.error)
                return t.toast(i, a.message), void i.setData({
                  isSubmit: false
                });
              t.toast(i, "提现申请成功，请等待审核"),
                setTimeout(function () {
                  wx.navigateTo({
                    url: "/pages/member/log/index?type=1"
                  })
                }, 500)
            })
        })
    }
  }
})