const request = require("request");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

const getNews = () => {
  request(
    {
      url: "https://search.naver.com/search.naver?where=image&query=%EA%B0%95%EC%95%84%EC%A7%80",
      method: "GET",
      encoding: null,
    },
    (error, response, body) => {
      if (error) {
        console.error(error);
        return;
      }
      if (response.statusCode === 200) {
        console.log(">>> response ok");

        const bodyDecoded = iconv.decode(body, "utf-8");
        const $ = cheerio.load(bodyDecoded);

        const search_list = $(
          ".main_pack > .sc_new > ._contentRoot > .photo_group > ._grid  "
        );

        console.log("================================================");
        console.log(search_list);
        console.log("================================================");
        console.log("className = ", search_list.attr("class"));
        console.log("================================================");
        let list = [];
        let test = search_list.children("div.tile_item");
        test.each(function (i, el) {
          list[i] = {
            class: el.find("a").attr("class"),
          };
        });
        console.log(list);
        console.log("================================================");

        // const result = [];

        // search_list.find((div) => {
        //   const path = $(div).attr("class"); // 첫번째 <img> 태그 url
        //   const url = `${path}`; // 도메인을 붙인 url 주소
        //   result.push({
        //     url,
        //   });
        // });

        // console.log(">>>>> result", result); //프로미스로 받기(js promise resolve)
      }
    }
  );
};

getNews();
