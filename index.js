const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const nodemailer = require('nodemailer'); //发送邮件的node插
const iPhone = devices['iPhone X'];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.emulate(iPhone);
  await page.goto('https://as-vip.missfresh.cn/ug/index.html?fromSource=zhuye');
  console.log('正在加载首页');
  await page.waitForSelector('.category');
  console.log('点击搜索框');
  await page.click('.search-nav');
  await page.waitForNavigation({
    waitUntil: 'load'
  });
  await page.waitForSelector('.search');
  console.log('输入芒果');
  await page.type('.weui-search-bar__input', '芒果', {delay: 100});
  console.log('点击搜索');
  await page.click('.search-btn');
  console.log('正在搜索芒果');
  await page.waitFor(2500);
  console.log('正在截屏');
  await page.screenshot({path:'mryx.jpg', quality: 100});

  let transporter = nodemailer.createTransport({
    service: 'QQ', // 发送者的邮箱厂商，支持列表：https://nodemailer.com/smtp/well-known/
    port: 465, // SMTP 端口
    secureConnection: true, // SSL安全链接
    auth: {   //发送者的账户密码
      user: '625027428@qq.com', //账户
      pass: 'wrphlyzmgsafbbhh', //smtp授权码，到邮箱设置下获取
    }
  });

  let mailOptions = {
    from: 'chenft <625027428@qq.com>', // 发送者昵称和地址
    to: '625027428@qq.com', // 接收者的邮箱地址
    subject: '一封暖暖的小邮件', // 邮件主题
    html: '<div style="color:red"><img src="cid:001" /></div>',
    attachments: [{
      filename: 'mryx.jpg',
      path: './mryx.jpg',
      cid: '001'
    }]
  };

  //发送邮件
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
    return console.log(error);
    }
    console.log('邮件发送成功 ID：', info.messageId);
  });
  browser.close();
})();

