/**
 * 爬取 “微博搞笑排行榜” 下交友微博
 * 可扩展至爬取指定微博，指定评论下的二级评论
 */

const request = require ('request');
const Async = require ('async');
const fs = require ('fs');
const path = require('path');
const xlsx = require ('node-xlsx');
const puppeteer = require ('puppeteer');

const crawler = async query => {
  const browser = await puppeteer.launch ({headless: true});
  const page = await browser.newPage ();
  let _data;

  const oneLevelCommentsCls = '.repeat_list .list_ul .list_li';
  const twoLevelCommentsCls =
    '.repeat_list .list_ul .list_li .list_box_in .list_li';

  page.on ('console', msg => {
    let log = 'page:';
    for (let i = 0; i < msg.args ().length; ++i)
      log += msg.args ()[i].toString ().replace ('JSHandle:', '');
    console.log (log);
  });

  await page.goto (
    `https://weibo.com/1713926427/IlPPEhLH3?type=comment#_rnd1577086461542`
  );
  await page.waitForSelector (oneLevelCommentsCls);

  await page.$eval ('.gn_login .gn_login_list', node => {
    const loginBtn = node.querySelectorAll ('a')[1];
    loginBtn.click ('middle');
  });

  await page.waitForSelector ('.layer_login_register_v2 .form_login_register');

  await page.waitFor (3000);
  await page.type ('.item.username.input_wrap .W_input', '13353835931', {
    delay: 100,
  });
  await page.type ('.item.password.input_wrap .W_input', 'song410224', {
    delay: 100,
  });
  await page.click ('.form_login_register .item_btn a');
  console.log ('login');
  await page.waitForNavigation();
  await page.waitForSelector (oneLevelCommentsCls + ' .list_box_in');
  await page.waitFor(3000)
  console.log ('already login');
  await page.$$eval (oneLevelCommentsCls, (nodes, query) => {
    nodes.map (node => {
      if (!!node.querySelector ('.WB_text').textContent.includes (`微博搞笑排行榜：${query.month}`)) {
        node
          .querySelector ('.list_box_in .WB_text')
          .querySelectorAll ('a')
          .forEach (ele => {
            console.log(ele.text)
            if (ele.text.includes ('回复')) {
              ele.click ('middle', 2);
            }
          });
      }
    });
  }, query);
  await page.waitForSelector (twoLevelCommentsCls + ' .list_con');
  await page.screenshot ({path: 'test.png', fullPage: true});
  console.log ('展开回复');
  await (async function loadMore() {
    for (let i=0; i<400; i++) {
      let flag = await page.$$eval (oneLevelCommentsCls, (nodes, query) => {
        let _flag = true
        nodes.map (node => {
          if (node.querySelector ('.WB_text').textContent.includes (`微博搞笑排行榜：${query.month}`)) {
            if(!!node.querySelector ('.list_li_v2 .WB_text')){
              node.querySelector ('.list_li_v2 .WB_text a').click ();
            } else {
              _flag =  false
            }
          }
        });
        return _flag
      }, query);
      console.log(`展开第${i}次`, flag)
      if(!flag) break ;
      await page.waitFor (3500);
    }
    console.log('Done!');
  })()

  _data = await page.$$eval (
    '.repeat_list .list_ul .list_li .list_box_in .list_li .list_con .WB_text',
    nodes => {
      let data = [];
      nodes.map (node => {
        // if (/(0)?1(.)*19/.test(node.textContent)) {
        const username = node
          .querySelectorAll ('a')[0]
          .text;
        const userCenterPage = node
          .querySelectorAll ('a')[0]
          .getAttribute ('href');
        const content = node.textContent.trim().split('：')[1]
        data.push ([username, content, `微博主页： https:${userCenterPage}`]);
        // console.log (username, content, `微博主页： https:${userCenterPage}`);
        // }
      });
      return data;
    }
  );
  await browser.close ();
  return _data;
};

async function main () {
  const query = {
    month: '11月',
  };
  const data = await crawler (query);
  console.log(data)
  const buffer = xlsx.build ([
    {
      name: 'mmBirthday',
      data: data,
    },
  ]);
  console.log('写入Excel文件')
  fs.writeFileSync (path.join(__dirname, `mmBirthday-${query.month}.xlsx`), buffer, {flag: 'w'});
  console.log('写入完成')
}

main()