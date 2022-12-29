function PeriodModule(crawling_keywords, potal, date) {
  const naverBaseUrl = `https://search.naver.com/search.naver?where=image&sm=tab_jum&query=${crawling_keywords}`;
  const daumBaseUrl = `https://search.daum.net/search?w=img&nil_search=btn&DA=NTB&enc=utf8&q=${crawling_keywords}`;
  const googleBaseUrl = `https://www.google.com/search?q=${crawling_keywords}&source=lnms&tbm=isch`;

  if (potal == "naver") {
    switch (Number(date)) {
      case 2:
        return `${naverBaseUrl}&res_fr=0&res_to=0&sm=tab_opt&color=&ccl=0&nso=so%3Ar%2Cp%3A1w`;
      case 3:
        return `${naverBaseUrl}&res_fr=0&res_to=0&sm=tab_opt&color=&ccl=0&nso=so%3Ar%2Cp%3A3m`;
      case 4:
        return `${naverBaseUrl}&res_fr=0&res_to=0&sm=tab_opt&color=&ccl=0&nso=so%3Ar%2Cp%3A1y`;
    }
  } else if (potal == "daum") {
    switch (Number(date)) {
      case 2:
        return `${daumBaseUrl}&period=w`;
      case 3:
        return `${daumBaseUrl}&period=m`;
      case 4:
        return `${daumBaseUrl}&period=y`;
    }
  } else if (potal == "google") {
    switch (Number(date)) {
      case 2:
        return `${googleBaseUrl}&tbs=qdr:w`;
      case 3:
        return `${googleBaseUrl}&tbs=qdr:m`;
      case 4:
        return `${googleBaseUrl}&tbs=qdr:y`;
    }
  }
}

module.exports = PeriodModule;
