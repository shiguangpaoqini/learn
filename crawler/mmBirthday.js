const request = require ('request');
const Async = require ('async');
const fs = require ('fs');
const path = require('path');
const xlsx = require ('node-xlsx');
const puppeteer = require ('puppeteer');

const crawler = async query => {
  const browser = await puppeteer.launch ({headless: false});
  const page = await browser.newPage ();
  let _data;

  let currentComment;
  const oneLevelCommentsCls = '.repeat_list .list_ul .list_li';
  const twoLevelCommentsCls =
    '.repeat_list .list_ul .list_li .list_box_in .list_li';
  const moreTwoLevelCommentsCls =
    '.repeat_list .list_ul .list_li .list_box_in .list_li_v2';

  page.on ('console', msg => {
    let log = 'PageConsole:';
    for (let i = 0; i < msg.args ().length; ++i)
      log += msg.args ()[i].toString ().replace ('JSHandle:', '');
    console.log (log);
  });

  await page.goto (
    `https://weibo.com/1713926427/IlPPEhLH3?filter=hot&root_comment_id=0&type=comment#_rnd1577001553165`
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
  console.log ('already login');
  await page.waitFor (3000);
  await page.waitForSelector (oneLevelCommentsCls + ' .list_box_in');
  await page.$$eval (oneLevelCommentsCls, nodes => {
    nodes.map (node => {
      if (node.querySelector ('.WB_text').textContent.includes ('微博搞笑排行榜：1月')) {
        node
          .querySelector ('.list_box_in .WB_text')
          .querySelectorAll ('a')
          .forEach (ele => {
            if (ele.text.includes ('回复')) {
              ele.click ('middle');
            }
          });
      }
    });
  });
  console.log ('展开回复');
  await page.waitForSelector (twoLevelCommentsCls + ' .list_con');

  await (async function loadMore() {
    for (let i=0; i<330; i++) {
      await page.$$eval (oneLevelCommentsCls, nodes => {
        nodes.map (node => {
          if (node.querySelector ('.WB_text').textContent.includes ('微博搞笑排行榜：1月')) {
            node.querySelector ('.list_li_v2 .WB_text a').click ();
          }
        });
      });
      await page.waitFor (3000);
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
        console.log (username, content, `微博主页： https:${userCenterPage}`);
        // }
      });
      return data;
    }
  );
  await page.screenshot ({path: 'example.png', fullPage: true});
  await browser.close ();
  return _data;
};

async function main () {
  const qurey = {
    month: '一月',
  };
  const data = await crawler (qurey);
  console.log(data)
  const buffer = xlsx.build ([
    {
      name: 'sheet1',
      data: data,
    },
  ]);
  fs.writeFileSync (path.join(__dirname, "mmBirthday.xlsx"), buffer, {flag: 'w'});
}

main()