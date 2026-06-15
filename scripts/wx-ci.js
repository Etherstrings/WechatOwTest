const fs = require("fs");
const path = require("path");
const ci = require("miniprogram-ci");

const APP_ID = "wx042e3ed96b7e5b81";
const ROOT = path.resolve(__dirname, "..");
const PRIVATE_KEY_PATH = process.env.WECHAT_CI_PRIVATE_KEY || path.join(ROOT, ".private", "private.wx.key");
const QR_OUTPUT = path.join(ROOT, "dist", "wechat-preview-qrcode.jpg");

function argValue(name, fallback = "") {
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0 && process.argv[index + 1]) return process.argv[index + 1];
  return fallback;
}

function requirePrivateKey() {
  if (!fs.existsSync(PRIVATE_KEY_PATH)) {
    console.error(`Missing private key: ${PRIVATE_KEY_PATH}`);
    console.error("Download the Mini Program code upload private key and save it there.");
    process.exit(1);
  }
}

function createProject() {
  requirePrivateKey();
  return new ci.Project({
    appid: APP_ID,
    type: "miniProgram",
    projectPath: ROOT,
    privateKeyPath: PRIVATE_KEY_PATH,
    ignores: ["node_modules/**/*", "dist/**/*", ".private/**/*", ".git/**/*"]
  });
}

const setting = {
  es6: true,
  es7: true,
  minify: true,
  autoPrefixWXSS: true
};

async function preview() {
  fs.mkdirSync(path.dirname(QR_OUTPUT), { recursive: true });
  await ci.preview({
    project: createProject(),
    desc: argValue("desc", "WechatOwTest phone preview"),
    setting,
    qrcodeFormat: "image",
    qrcodeOutputDest: QR_OUTPUT,
    onProgressUpdate: console.log
  });
  console.log(`Preview QR generated: ${QR_OUTPUT}`);
}

async function upload() {
  const version = argValue("version", "0.1.0");
  const desc = argValue("desc", "WechatOwTest upload");
  await ci.upload({
    project: createProject(),
    version,
    desc,
    setting,
    onProgressUpdate: console.log
  });
  console.log(`Uploaded version ${version}: ${desc}`);
}

const command = process.argv[2];
if (command === "preview") {
  preview().catch((error) => {
    console.error(error);
    process.exit(1);
  });
} else if (command === "upload") {
  upload().catch((error) => {
    console.error(error);
    process.exit(1);
  });
} else {
  console.error("Usage: node scripts/wx-ci.js <preview|upload>");
  process.exit(1);
}
