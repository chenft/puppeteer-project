const puppeteer = require('puppeteer');
// const devices = require('puppeteer/DeviceDescriptors');
// const nodemailer = require('nodemailer'); //发送邮件的node插
// const iPhone = devices['iPhone X'];

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   await page.emulate(iPhone);
//   await page.goto('https://as-vip.missfresh.cn/ug/index.html?fromSource=zhuye');
//   console.log('正在加载首页');
//   await page.waitForSelector('.category');
//   console.log('点击搜索框');
//   await page.click('.search-nav');
//   await page.waitForNavigation({
//     waitUntil: 'load'
//   });
//   await page.waitForSelector('.search');
//   console.log('输入榴莲');
//   await page.type('.weui-search-bar__input', '榴莲', {delay: 100});
//   console.log('点击搜索');
//   await page.click('.search-btn');
//   console.log('正在搜索榴莲');
//   await page.waitFor(2500);
//   console.log('正在截屏');
//   await page.screenshot({path:'mryx.jpg', quality: 100});

//   let transporter = nodemailer.createTransport({
//     service: 'QQ', // 发送者的邮箱厂商，支持列表：https://nodemailer.com/smtp/well-known/
//     port: 465, // SMTP 端口
//     secureConnection: true, // SSL安全链接
//     auth: {   //发送者的账户密码
//       user: '625027428@qq.com', //账户
//       pass: 'wrphlyzmgsafbbhh', //smtp授权码，到邮箱设置下获取
//     }
//   });

//   let mailOptions = {
//     from: 'chenft <625027428@qq.com>', // 发送者昵称和地址
//     to: '625027428@qq.com', // 接收者的邮箱地址
//     subject: '一封暖暖的小邮件', // 邮件主题
//     html: '<div style="color:red"><img src="cid:001" /></div>',
//     attachments: [{
//       filename: 'mryx.jpg',
//       path: './mryx.jpg',
//       cid: '001'
//     }]
//   };

//   //发送邮件
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//     return console.log(error);
//     }
//     console.log('邮件发送成功 ID：', info.messageId);
//   });
//   browser.close();
// })();

// 模拟用户登录
(async () => {
  const browser = await puppeteer.launch({
      slowMo: 100,    //放慢速度
      headless: false,
      defaultViewport: {width: 1440, height: 780},
      ignoreHTTPSErrors: false, //忽略 https 报错
      args: ['--start-fullscreen'] //全屏打开页面
  });
  const page = await browser.newPage();
  await page.goto('http://182.92.105.197:3009');
  //输入账号密码
  const uniqueIdElement = await page.$('.login-full .el-input__inner[type=text]');
  await uniqueIdElement.type('nielian', {delay: 20});
  const passwordElement = await page.$('.el-input__inner[type=password]', {delay: 20});
  await passwordElement.type('123456');
  //点击确定按钮进行登录
  let okButtonElement = await page.$('.el-button--primary[type=button]');
  //等待页面跳转完成，一般点击某个按钮需要跳转时，都需要等待 page.waitForNavigation() 执行完毕才表示跳转成功
  await Promise.all([
      okButtonElement.click(),
      page.waitForNavigation()
  ]);
  console.log('admin 登录成功');


  await Promise.all([
    page.click('.tpl-item[no="NO:298"] img'),
    page.waitForNavigation()
  ]);
  const item = await page.$('.canvas.v-section:not(:first-child)');
    await page.waitFor(2500);
  const items = await item.$('div[data-name=crotch]');
  await items.screenshot({path:'login.jpg', quality: 100});
  await page.close();
  await browser.close();
})();