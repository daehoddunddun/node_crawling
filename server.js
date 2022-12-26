const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const imageDownloader = require("node-image-downloader");

const app = express();
const port = 8081;

app.use(cors());

app.listen(port, () => {
  console.log(`서버가 ${port}로 실행중입니다.`);
});

/* [api] */
app.get("/crawling", async (req, res) => {
  let reqList = req.query;

  try {
    if (req.query.crawling_keywords === "") {
      throw new Error("키워드 미입력 시 에러발생");
    } else {
      await crawling(
        reqList.crawling_channel_type,
        reqList.crawling_keywords,
        reqList.crawling_period_type,
        reqList.crawling_limit
      );
      res.send(crawlingData);
    }
  } catch (err) {
    console.log(err);
    res.send("crawling_error");
  }

  crawlingData = []; //api 데이터 전송 후 배열 초기화
});

/* [crawling] */
let crawlingData = []; // 크롤링 데이터를 받은 Array

let crawling = async (potal, crawling_keywords, date, length) => {
  console.log("포탈", potal);

  console.log(
    "1.potal :",
    potal,
    "- 2.keyword :",
    crawling_keywords,
    "- 3.date :",
    date,
    "- length :",
    length
  );

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--window-size=1920,1080"],
  }); // puppeteer 실행 // {headless: false}는 크롤링 과정을 GUI로 확인하기 위해 적용(없어도 이상 x)

  const page = await browser.newPage(); // 신규 page 생성
  await page.setViewport({
    width: 1920,
    height: 1080,
  }); // GUI View 사이즈 지정

  switch (potal) {
    case "naver":
      await page.goto(
        `https://search.naver.com/search.naver?where=image&sm=tab_jum&query=${crawling_keywords}`
      ); //수집채널1-Naver 키워드 검색창으로 이동
      await page.waitForSelector("._listImage"); // * 스크랩하려는 태그가 랜더링 완료되기 전까지 기다린다.
      break;
    case "daum":
      await page.goto(
        `https://search.daum.net/search?w=img&nil_search=btn&DA=NTB&enc=utf8&q=${crawling_keywords}`
      ); //수집채널2-Daum = 키워드 검색창으로 이동
      await page.waitForSelector(".thumb_img");
      break;
    case "google":
      await page.goto(
        `https://www.google.com/search?q=${crawling_keywords}&source=lnms&tbm=isch`
      ); //수집채널3-Google 키워드 검색창으로 이동
      await page.waitForSelector(".rg_i.Q4LuWd");
      break;
    case "instagram":
      // await page.goto(
      //   "https://www.instagram.com/"
      // ); //수집채널4-Instagram 로그인 시 스크롤 가능한 문제 논의 필요
      break;
  }

  async function autoScroll(page) {
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        var totalHeight = 0;
        var distance = 100;
        var timer = setInterval(() => {
          var scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100); // distance로 스크롤 내리는 속도를 조절함(100 빠르지만 데이터를 전부 수집 못하는 에러로 length 100정도까지만/ 200권장 / 300 느림)
      });
    });
  }

  await autoScroll(page); // 자동 스크롤 시작(스크롤 시 태그 생성 때문에 추가한 내용)

  const content = await page.content(); // * 페이지 컨텐츠 생성한다.

  const $ = cheerio.load(content); // cheerio에 컨텐츠를 인자로 넣어준다.

  switch (potal) {
    // 수집채널1-Naver 크롤링 css 선택자 지정
    case "naver":
      const naverLists = $(
        "._contentRoot > .photo_group._listGrid > .photo_tile._grid > div > div > .thumb > a "
      );
      naverLists.each((idx, list) => {
        const linkfilter =
          $(list).find("img").attr("data-lazy-src") === undefined
            ? $(list).find("img").attr("src")
            : $(list).find("img").attr("data-lazy-src");
        // 네이버 이미지의 src 가 data-lazy-src 를 참조하는 내용도 있어서 삼항연산자로 통일

        const typeilter = linkfilter.replace(/\jpg&type=.*/i, ".jpg");
        const src = typeilter.replace(/\png&type=.*/i, ".jpg");
        crawlingData.push({ idx, src });
      });

      break;

    case "daum":
      // 수집채널2-Daum 크롤링 css 선택자 지정
      const daumLists = $(
        ".g_comp > #imgColl > .coll_cont > #imgList > .wrap_thumb > a"
      );
      daumLists.each((idx, list) => {
        const src = $(list).find("img").attr("src");
        crawlingData.push({ idx, src });
      });
      break;

    case "google":
      //수집채널3-Google 크롤링 css 선택자 지정
      const googleLists = $(
        "#islrg > .islrc > div > .wXeWr.islib.nfEiy > .bRMDJf.islir"
      );

      googleLists.each((idx, list) => {
        const src = $(list).find("img").attr("src");
        if (src.includes("data:image/jpeg;base64")) {
          console.log(`idx : ${idx}번 데이터는 base64로 인코딩`);
        } else {
          crawlingData.push({ idx, src });
        }
      });
      break;

    case "instagram":
      break;
  }

  if (crawlingData.length >= length) {
    crawlingData.length = length;
  }

  /* [imgDownload] */
  let imgList = [];

  crawlingData.map((x) => {
    let y = {};
    y["uri"] = x["src"];
    y.filename = crawling_keywords + `_${potal}_FILE_` + x.idx;
    imgList.push(y);
  }); //imageDownloader 양식에 맞춘 객체데이터 가공 {url : val, filename : vlaue}

  imageDownloader({
    imgs: imgList,
    dest: "./imgDirectory", //destination folder
  })
    .then((info) => {
      console.log("all done ✅", info.length);
      //console = info
    })
    .catch((error, response, body) => {
      console.log("something goes bad! ❌");
      console.log(error);
    });

  await browser.close(); // 브라우저 종료
};
