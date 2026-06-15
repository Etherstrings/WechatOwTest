const app = getApp();

const demoResultItems = [
  { label: "查询模式", value: "演示" },
  { label: "登录态", value: "未登录" },
  { label: "支付状态", value: "未购买" }
];

Page({
  data: {
    envId: app.globalData.envId,
    serviceName: app.globalData.serviceName,
    query: "",
    healthStatus: "待检查",
    loginStatus: "未登录",
    payStatus: "入口",
    quotaText: "3 次体验",
    queryLoading: false,
    healthLoading: false,
    loginLoading: false,
    resultTitle: "结果预览",
    score: "--",
    scoreLabel: "等待查询",
    scoreNote: "暂无查询结果。",
    resultItems: demoResultItems
  },

  onQueryInput(event) {
    this.setData({ query: event.detail.value });
  },

  runQuery() {
    const query = String(this.data.query || "").trim();
    if (!query) {
      wx.showToast({ title: "请输入玩家 ID", icon: "none" });
      return;
    }
    this.setData({ queryLoading: true });
    setTimeout(() => {
      this.setData({
        queryLoading: false,
        resultTitle: "查询结果",
        score: "82",
        scoreLabel: query,
        scoreNote: "演示结果已生成。",
        resultItems: [
          { label: "体验结果", value: "已生成" },
          { label: "用户登录", value: this.data.loginStatus },
          { label: "购买入口", value: this.data.payStatus }
        ]
      });
    }, 450);
  },

  checkHealth() {
    const baseUrl = app.globalData.apiBaseUrl;
    this.setData({ healthLoading: true, healthStatus: "检查中" });
    if (!baseUrl) {
      setTimeout(() => {
        this.setData({
          healthLoading: false,
          healthStatus: "演示模式",
          resultItems: [
            { label: "环境", value: this.data.envId },
            { label: "服务", value: this.data.serviceName },
            { label: "状态", value: "待绑定" }
          ]
        });
      }, 350);
      return;
    }
    wx.request({
      url: `${baseUrl.replace(/\/$/, "")}/api/health`,
      method: "GET",
      success: (response) => {
        const ok = response.statusCode >= 200 && response.statusCode < 300;
        this.setData({ healthStatus: ok ? "正常" : "异常" });
      },
      fail: () => {
        this.setData({ healthStatus: "失败" });
      },
      complete: () => {
        this.setData({ healthLoading: false });
      }
    });
  },

  login() {
    this.setData({ loginLoading: true, loginStatus: "登录中" });
    wx.login({
      success: (response) => {
        const code = response.code ? `${response.code.slice(0, 6)}...` : "已返回";
        this.setData({
          loginStatus: code,
          resultItems: [
            { label: "微信登录", value: "已触发" },
            { label: "登录凭证", value: code },
            { label: "身份状态", value: "待确认" }
          ]
        });
      },
      fail: () => {
        this.setData({ loginStatus: "失败" });
      },
      complete: () => {
        this.setData({ loginLoading: false });
      }
    });
  },

  openPay() {
    this.setData({
      payStatus: "待接入",
      resultTitle: "购买入口",
      score: "¥",
      scoreLabel: "体验套餐",
      scoreNote: "套餐已选择。",
      resultItems: [
        { label: "套餐", value: "10 次查询" },
        { label: "金额", value: "待定" },
        { label: "支付", value: "待开通" }
      ]
    });
  }
});
