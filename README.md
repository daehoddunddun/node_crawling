# 😢node_crawling

- cheerio 를 통한 웹 크롤링 작업 진행(jQuery 태그 선택자)로 원하는 태그와 파싱
- iconv-lite 를 통한 페이지별 EUC-KR, UTF-8 환경에 따라 (encoding/decoding) html 랜더링
- puppeteer - chromium 통해 서버 내 웹 사이트에 진입할 수 있고, 원하는 동작을 실행할 수 있다.

---

### 요청사항 : 클라이언트가 원하는 키워드 / 사이트 / 수량에 따라 백엔드에 데이터를 요청

#### 진행1 : 클라이언트가 서버측에 이미지 크롤링 api 데이터를 요청

#### 진행2 : 네이버, 구글, 다음과 같은 포털 사이트의 이미지를 하여 크롤링을 진행

#### 진행3 : 클롤링하여 받은 이미지 url 또는 파일을 api로 클라이언트에 반환

---

1. 12/06 cheerio를 통한 태그 선택자 접근

- jQuery 태그 선택자를 통해 크롤링을 원하는 태그 및 객체에 접근하여 데이터를 받아올 수 있다.

![32113221321323](https://user-images.githubusercontent.com/98578138/205882274-cf34ab26-0f49-4b3d-9e5d-a755a46ac8e7.png)
![23121332](https://user-images.githubusercontent.com/98578138/205882434-56e038c5-7661-4b2e-8ee7-a3d75d65cdab.png)

2. 12/06 puppeteer를 통해 서버에서 네이버 검색 - 이미지[키워드 : 강아지] 로 접근하였고, 테스트를 위해 클릭 동작과 스크린샷을 진행

- 기존에는 cheerio를 통한 크롤링이 가능하였으나 최근 SPA 환경의 개발이 많아지면서 태그가 생성되기 전 크롤링 태그로 접근이 불가능한 내용을 확인.
- 위와 같은 내용을 해결하기 위해 puppeteer를 통해 태그 생성 전까지 delay를 주어 화면이 랜더되고 크롤링이 가능하게 작업을 진행하였음.

![112212121](https://user-images.githubusercontent.com/98578138/205882747-aafccfc3-1d94-468a-b3f2-d253261bd89a.png)

![21321323121](https://user-images.githubusercontent.com/98578138/205882774-1dc79ee9-a530-4b69-9f87-3cf0dee34560.png)

![screen](https://user-images.githubusercontent.com/98578138/205883221-6453f340-1667-4b20-b365-482cdf0ad1b3.png)
