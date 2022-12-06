const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

(async () => {
  const browser = await puppeteer.launch(); // puppeteer 실행
  const page = await browser.newPage(); // 신규 페이지 생성
  await page.goto(
    "https://search.naver.com/search.naver?where=image&query=%EA%B0%95%EC%95%84%EC%A7%80"
  ); // naver.com = 키워드 [강아지] 검색창으로 이동

  await page.waitForSelector("._listImage"); // 해당 태그가 완료되기 전까지 기다린다.

  // await page.click("._listImage"); //해당 태그를 클릭
  // await page.screenshot({ path: "screen.png" }); // 확인용 스크린샷 찍기

  const content = await page.$(
    "#container > #content > #main_pack > .sc_new.sp_nimage._prs_img._imageSearchPC > ._contentRoot > .photo_group._listGrid > .photo_tile._grid > div"
  ); // 해당하는 html요소를 긁어와 저장한다.
  console.log(content);

  await browser.close(); // 브라우저 종료
})();
