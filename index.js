const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
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
  console.log('输入榴莲');
  await page.type('.weui-search-bar__input', '榴莲', {delay: 100});
  console.log('点击搜索');
  await page.click('.search-btn');
  console.log('正在搜索榴莲');
  await page.waitFor(2500);
  console.log('正在截屏');
  await page.screenshot({path:'mryx.jpg', quality: 100});
  browser.close();
})();