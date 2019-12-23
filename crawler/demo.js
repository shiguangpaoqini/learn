/**
 * 爬取微博指定城市（位置）附近的人所发微博图片
 * 可指定筛选条件
 */

const request = require('request');
const async = require('async');
const fs = require('fs');
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];

const crawler = async (city) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const baseCityCode = '2306570042'
  let cityCode = null
  const _data = {}


  await page.emulate(iPhone);

  page.on('response', res => {
    if (/wandermap\/search/.test(res.url())) {
      console.log(res.url())
      res.json().then(res => {
        if (res.code) {
          cityCode = baseCityCode + res.pois[0]
        }
        console.info(`➞ Response: ${JSON.stringify(res.pois[0].title)}->${JSON.stringify(res.pois[0].poiid)}`)
      })
    }
  })

  page.on('console', msg => {
    for (let i = 0; i < msg.args().length; ++i)
      console.log(`${i}: ${msg.args()[i]}`);
  });

  await page.goto(`https://place.weibo.com/map/?maploc=114.341447%2C34.797049%2C8z&ext=%7B%22lbsType%22%3A%22bus%22%2C%22lbsID%22%3A%228008641020000000000%22%7D&luicode=10000011&lfid=23065700428008641020000000000`);
  await page.waitForSelector('#search')
  const inputElement = await page.$('#search');
  await inputElement.click({ button: 'middle' });
  do {
    await page.keyboard.press('Backspace', { delay: 100 })
    await page.keyboard.press('Backspace', { delay: 100 })
    await page.keyboard.press('Backspace', { delay: 100 })
    await page.keyboard.press('Backspace', { delay: 100 })
    await page.keyboard.type(city, { delay: 1000 }); // 慢点输入，像一个用户
  } while (!cityCode)

  const page2 = await browser.newPage();
  page2.on('response', res => {
    if (/api\/container\/getIndex/.test(res.url())) {
      res.json().then(res => {
        if (res.ok) {
          console.log('cards', res.data.cards)
          _data.cardlistInfo = res.data.cardlistInfo
          _data.cardGroup = [].concat(...res.data.cards.map(i => i.card_group))
        }
        console.info(`➞ Response: ${JSON.stringify(res.ok)}`)
      })
    }
  })

  page2.on('console', msg => {
    for (let i = 0; i < msg.args().length; ++i)
      console.log(`${i}: ${msg.args()[i]}`);
  });
  await page2.goto(`https://m.weibo.cn/p/cardlist?containerid=${cityCode}&display=0&retcode=6102`);
  await page2.waitFor(15000);

  const delay = 5000;
  const maxCount = 100;
  let preCount = 0;
  let postCount = 0;
  do {
    preCount = await getCount(page2);
    await scrollDown(page2);
    await page2.waitFor(delay);
    postCount = await getCount(page2);
  } while (postCount > preCount || preCount > maxCount);
  await page2.waitFor(delay);

  // await autoScroll(page);
  await page2.screenshot({ path: "example.png", fullPage: true })
  await browser.close();
  return _data;
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 200;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        // console.log(scrollHeight)
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

async function downloadPic(src, dest) {
  await request(src).pipe(fs.createWriteStream(dest + (new Date()).getTime() + '.png')).on('close', function () {
    console.log('pic saved!')
  })
}

async function downloadPics(picList) {
  async.mapSeries(picList, function (item, callback) {
    setTimeout(function () {
      downloadPic(item.url, `./weibo/${item.city}/${item.name}`);
      callback(null, item);
    }, 400);
  }, function (err, results) { });
}

function filterData(data, opt = {}) {
  const mblogs = data.cardGroup.map(i => {
    return i.mblog
  }).filter(i => !!(i))
  // console.log(mblogs)
  // 性别
  if (opt.gender) {
    mblogs.filter(i => i.user.gender === opt.gender)
  }
  // 转发
  if (opt.repostsCount) {
    mblogs.filter(i => i.reposts_count >= opt.repostsCount)
  }
  // 评论
  if (opt.commentsCount) {
    mblogs.filter(i => i.comments_count >= opt.commentsCount)
  }
  // 点赞
  if (opt.attitudesCount) {
    mblogs.filter(i => i.attitudes_count >= opt.attitudesCount)
  }

  return mblogs
}

(async function main(city = '开封') {

  console.info(`爬取weibo，${city}附近`)
  const data = await crawler(city)
  const filter_data = await filterData(data, { gender: 'f', repostsCount: 0, commentsCount: 0, attitudesCount: 0 })
  const images = []
  await filter_data.forEach(i => {
    console.log('pic::::::::::::::::', i);
    [...i.pics].forEach(item => {
      const image = {}
      image.name = i.user.screen_name
      image.city = city
      image.url = item.large.url
      images.push(image)
    })
  })
  console.log('images', images)
  downloadPics(images)
})()

async function getCount(page) {
  return await page.$$eval('.m-panel', a => a.length);
}

async function scrollDown(page) {
  await page.$eval('.m-panel:last-child', e => {
    e.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
  });
}
