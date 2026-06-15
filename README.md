# WechatOwTest

Clean WeChat Mini Program sandbox for OW data workflows.

## Open In WeChat DevTools

1. Import this folder: `D:\Projects\WechatOwTest`
2. AppID: `wx042e3ed96b7e5b81`
3. Mini Program root: `miniprogram/`

The first screen is a visible product shell with query, login, payment entry, and status cards. Real payment credentials stay out of the mini program frontend.

## Preview On Phone

This repo supports WeChat CI preview after you download a Mini Program upload private key.

1. In WeChat Public Platform, enable code upload and download the private key.
2. Save the key as `.private/private.wx.key`.
3. Run:

```powershell
npm install
npm run preview
```

Then scan `dist/wechat-preview-qrcode.jpg` with the WeChat account that has developer/tester permission.

## Upload Experience Version

```powershell
npm run upload -- --version 0.1.0 --desc "first visible mini program shell"
```

After upload, go to WeChat Public Platform version management and set it as an experience version.

