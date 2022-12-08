const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 8080;

/* api */

app.use(cors());

app.get("/test", (req, res) => {
  res.send(crawlingData);
});

app.listen(port, () => {
  console.log(`서버가 ${port}로 실행중입니다.`);
});

/* crawlin */
const crawlingData = []; // 크롤링 데이터를 받은 Array

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--window-size=1920,1080"],
  }); // puppeteer 실행 // {headless: false}는 GUI로 확인하기 위해(없어도 이상 x)

  const page = await browser.newPage(); // 신규 페이지 생성

  await page.setViewport({
    width: 1920,
    height: 1080,
  }); // view 사이즈 지정

  await page.goto(
    "https://search.naver.com/search.naver?where=image&sm=tab_jum&query=%EA%B0%95%EC%95%84%EC%A7%80"
  ); // naver.com = 키워드 [강아지] 검색창으로 이동

  await page.waitForSelector("._listImage"); // * 스크랩하려는 태그가 랜더링 완료되기 전까지 기다린다.

  await autoScroll(page); // 자동 스크롤 시작(스크롤 시 태그 생성 때문에 추가한 내용)

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
        }, 100); // 스크롤 내리는 명령 주기. 네트워크 환경 고려해야할듯(100은 빠른데 전부 수집 못함- 적은 수 / 200권장 / 300 느림)
      });
    });
  }

  const content = await page.content(); // * 페이지 컨텐츠 생성한다.

  const $ = cheerio.load(content); // cheerio에 컨트츠를 인자로 넣어준다.
  const lists = $(
    "#container > #content > #main_pack > .sc_new.sp_nimage._prs_img._imageSearchPC > ._contentRoot > .photo_group._listGrid > .photo_tile._grid > div > div > .thumb > a "
  ); // 크롤링 하려는 css 선택자 추적

  lists.each((idx, list) => {
    const src =
      $(list).find("img").attr("data-lazy-src") === undefined
        ? $(list).find("img").attr("src")
        : $(list).find("img").attr("data-lazy-src");
    crawlingData.push({ idx, src });
  }); // 네이버 이미지의 src 가 data-lazy-src 를 참조하는 내용도 있어서 삼항연산자로 통일

  console.dir(crawlingData.length, { maxArrayLength: null }); // 수집한 전체 데이터

  if (crawlingData.length >= 100) {
    crawlingData.length = 100;
  } //전체 데이터 갯수 지정
  // console.log(crawlingData);

  // await page.click("._listImage"); //부가 기능 - 해당 태그를 클릭
  // await page.screenshot({ path: "screen.png" }); // 부가 기능 - 스크린샷 찍기

  await browser.close(); // 브라우저 종료
})();
