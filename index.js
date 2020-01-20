const puppeteer = require('puppeteer');
// const devices = require('puppeteer/DeviceDescriptors');
const nodemailer = require('nodemailer'); //发送邮件的node插件
// const iPhone = devices['iPhone X'];
const qs = require('querystring');
const argv = process.argv;
const http = require("http");
const url = require('url');
const SCKEY = 'SCU49140T45a63036ab78914771cbecfaa66845eb5cb7ed1b474a5';

if (argv.length <= 2) {
  console.log('请指定待处理的项目名称')
  return
}
const projectUrl = {
  'kkmob': 'kkmob.weshineapp.com-online',
  'haipei': 'haipei.weshineapp.com-online',
  'ttmob': 'ttmob.weshineapp.com-online',
  'wemoji': 'wemoji.weshineapp.com-test'
}
console.log(argv[2]);
const curUrl = projectUrl[argv[2]];
if (!curUrl) {
  console.log('项目名称不在配置范围内，请重新配置');
  return;
}
// 模拟用户登录
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://jenkins.weshineapp.com');
  //输入账号密码
  const uniqueIdElement = await page.$('.formRow #j_username[name=j_username]');
  // await uniqueIdElement.type('chenfengting', {delay: 20});
  // const passwordElement = await page.$('.formRow input[name=j_password]', {delay: 20});
  await uniqueIdElement.type('chenfengting');
  const passwordElement = await page.$('.formRow input[name=j_password]');
  await passwordElement.type('123456');
  //点击确定按钮进行登录
  let okButtonElement = await page.$('.formRow input.submit-button[name=Submit');
  //等待页面跳转完成，一般点击某个按钮需要跳转时，都需要等待 page.waitForNavigation() 执行完毕才表示跳转成功
  await Promise.all([
      okButtonElement.click(),
      page.waitForNavigation()
  ]);
  console.log('admin 登录成功');


  let target = await page.$('.model-link.inside[href="job/frontend.' + curUrl + '/"]');
  await Promise.all([
    target.click(),
    page.waitForNavigation()
  ]);
  let link = await page.$('.task-link[href="/job/frontend.' + curUrl + '/build?delay=0sec"]');
  link.click();
  console.log('点击构建成功');
  const startTime = new Date();
  await page.waitFor(2500);
  var stopBtn = await page.$('.build-controls .build-stop');
  let endStart;
  let duration;
  var minutes;
  var seconds;
  let _interval = setInterval(async () => {
    stopBtn = await page.$('.build-controls .build-stop');
    if (stopBtn == null) {
      _interval = clearInterval(_interval);
      endStart = new Date();
      duration = endStart - startTime;
      minutes = parseInt((duration % (1000 * 60 * 60)) / (1000 * 60));
      seconds = parseInt((duration % (1000 * 60)) / 1000);
      console.log('==================== 构建成功！====================');
      console.log(`==================== duration: ${minutes}分 ${seconds}秒 ====================`);
      buildSuccess();
    } else {
      console.log('-------------------- 构建中 --------------------');
    }
  }, 3000);

  // let transporter = nodemailer.createTransport({
  //   service: 'QQ', // 发送者的邮箱厂商，支持列表：https://nodemailer.com/smtp/well-known/
  //   port: 465, // SMTP 端口
  //   secureConnection: true, // SSL安全链接
  //   auth: {   //发送者的账户密码
  //     user: '625027428@qq.com', //账户
  //     pass: 'wrphlyzmgsafbbhh', //smtp授权码，到邮箱设置下获取
  //   }
  // });

  // let mailOptions = {
  //   from: 'chenft <625027428@qq.com>', // 发送者昵称和地址
  //   to: '625027428@qq.com', // 接收者的邮箱地址
  //   subject: 'puppeteer', // 邮件主题
  //   html: `<div>${argv[2]} 构建成功！</div>`,
  //   // attachments: [{
  //   //   filename: 'mryx.jpg',
  //   //   path: './mryx.jpg',
  //   //   cid: '001'
  //   // }]
  // };

  async function buildSuccess () {
    //发送邮件
    // transporter.sendMail(mailOptions, async (error, info) => {
    //   await page.close();
    //   await browser.close();
    //   if (error) {
    //     return console.log(error);
    //   }
    //   console.log('邮件发送成功 ID：', info.messageId);
    // });
    var post_data = {
      text: `<div>${argv[2]} 构建成功！</div><p>duration: ${minutes}分 ${seconds}秒 </p>`,
      desp: '噜啦噜啦嘞'
    };
    var content = qs.stringify(post_data);
    var res = sendToWx(content);
    res.then(async () => {
      console.log('方糖发送成功');
      await page.close();
      await browser.close();
    }, async (err) => {
      console.log('方糖发送失败');
      await page.close();
      await browser.close();
    });
  }

  function sendToWx(content) {
    return new Promise((resolve, reject) => {
      http.get(`http://sc.ftqq.com/SCU49140T45a63036ab78914771cbecfaa66845eb5cb7ed1b474a5.send?${content}`, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
        });
        res.on('end', resolve);
      })
    });
  }
})();


