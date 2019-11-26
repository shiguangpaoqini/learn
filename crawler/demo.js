const request = require('request');
const async = require('async');
const fs = require('fs');
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];

const crawler = async (containerid) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const _data = {}

  await page.emulate(iPhone);

  page.on('response', res => {
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

  // page.on('console', msg => {
  //   for (let i = 0; i < msg.args().length; ++i)
  //     console.log(`${i}: ${msg.args()[i]}`);
  // });

  await page.goto(`https://m.weibo.cn/p/cardlist?containerid=${containerid.kaifeng}`);
  await page.waitForSelector('.weibo-member')

  await autoScroll(page);
  await page.screenshot({ path: "example.png", fullPage: true })
  await browser.close();
  // await downloadPics(images, './weibo/kaifeng/')
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

async function downloadPics(picList, dest) {
  async.mapSeries(picList, function (item, callback) {
    setTimeout(function () {
      downloadPic(item, dest);
      callback(null, item);
    }, 400);
  }, function (err, results) { });
}

function filterData (data, opt={}) {
  const mblog = data.cardGroup.map(i => {
    return i.mblog
  })
  // 性别
  if(opt.gender) {
    mblog.filter(i => i.user.gender === opt.gender)
  }
  // 转发
  if(opt.repostsCount) {
    mblog.filter(i => i.reposts_count >= opt.repostsCount)
  }
  // 评论
  if(opt.commentsCount) {
    mblog.filter(i => i.comments_count >= opt.commentsCount)
  }
  // 点赞
  if(opt.attitudesCount) {
    mblog.filter(i => i.attitudes_count >= opt.attitudesCount)
  }

  return mblog
}

(async function main() {
  const containerid = {
    kaifeng: '23065700428008641020000000000'
  }

  console.info(`爬取weibo，开封附近`)
  const data = await crawler(containerid)
  const filter_data = await filterData(data, { gender: 'f', repostsCount: 0, commentsCount: 0, attitudesCount: 0})
  const images = await filter_data.reduce((i,j) => i.concat(j.pics), []).map(i => i && i.pics)
  console.log(images)
})()
