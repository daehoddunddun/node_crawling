# 😀node_crawling

- cheerio 를 통한 웹 크롤링 작업 진행(jQuery Tag selector Parsing).
- puppeteer - chromium 통해 웹 사이트에 진입 후, 크롤링을 위한 scroll, click 동작 수행.
- imageDownloader - url을 참조하여 이미지를 서버 안에 JPG파일 형식으로 저장.

---

### 요청사항 : 클라이언트가 원하는 키워드 / 사이트 / 수량 / 기간 에 따라 크롤링 데이터 추출.

#### 진행1 : api call을 통해 필요정보를 서버로 전달(키워드, 사이트, 수량, 기간)

#### 진행2 : 포털 사이트(네이버, 구글, 다음, 인스타그램)의 이미지를 특정 키워드로 검색하여 크롤링을 진행

#### 진행3 : 크롤링하여 얻은 URL은 api응답으로, 파일은 서버에 내부 저장

#### 진행기간 : 12/06 ~ 12/30

- client reqest

![api2](https://user-images.githubusercontent.com/98578138/209636015-e8700fea-6118-4e77-bc46-920c5b3c2913.png)

- server-crawling

![ezgif com-gif-maker](https://user-images.githubusercontent.com/98578138/209637215-568e0168-bd31-48df-9230-edf7a2f51862.gif)

- save img

![결과값 2](https://user-images.githubusercontent.com/98578138/209639431-131ee147-a53f-4888-ba7d-92e69de17963.png)
![결과값 3](https://user-images.githubusercontent.com/98578138/209639528-71a29392-d1ad-4e56-8844-e3013110db17.png)

- front view

![123312321](https://user-images.githubusercontent.com/98578138/206401161-cffbe163-5d06-42f9-8173-ff9b6afff486.png)

---

### 1. api call

![api](https://user-images.githubusercontent.com/98578138/209635778-f6571030-5dbf-41b3-a983-25c5b36d91f9.png)

- 클라이언트로 요청(키워드,사이트,수량,기간) 에 대한 정보를 받음
- postman을 통한 모의 테스트 진행(실제 프로젝트에서는 input과 button을 통해 api call 진행 완료하였음)

### 2. puppeteer를 통한 웹 조작

![퍼피 - 설정](https://user-images.githubusercontent.com/98578138/209636415-00c420fe-2bba-453b-9932-9c3a54f4ea3e.png)

![포털별 검색 링크](https://user-images.githubusercontent.com/98578138/209637767-fc3fd1f5-af1c-4f78-b239-8e632675b383.png)

![오토스크롤](https://user-images.githubusercontent.com/98578138/209637971-6f45d435-4435-47bb-a45e-5419b94843ba.png)

- chromium를 통해 서버 내 가상의 크롬 브라우저를 활성화

- puppeteer를 활용하여 클라이언트가 요청한 포털 사이트 접속 및 키워드 검색, 검색 기간 설정

- 기존에는 cheerio를 통한 크롤링이 가능하였으나 최근 SPA 환경의 개발이 많아지면서 태그가 생성되기 전 접근이 불가능한 내용을 확인

- autoScroll 및 이미지 더보기 버튼 클릭 자동화

### 3.cheerio 이미지 크롤링

![치르노어 포털별 이미지](https://user-images.githubusercontent.com/98578138/209638111-c1bef4ba-7d99-4c4e-b90e-3991b36d4a29.png)

![치르노어 포털별이미지 2](https://user-images.githubusercontent.com/98578138/209638120-b2a624d2-2d75-4ac1-b20b-19b2d7d8da2c.png)

- cheerio의 jQuery 태그 선택자를 통해 사이트별 크롤링 태그 및 객체에 접근할 수 있다.

- 사이트별 img태그의 src 경로가 조금 다르거나 인코딩 방식에 따라 받아오는 방법 구분

- each메서드를 활용하여, 순회하며 크롤링 배열에 저장

![23121332](https://user-images.githubusercontent.com/98578138/205882434-56e038c5-7661-4b2e-8ee7-a3d75d65cdab.png)

- 실제 받아온 크롤링 태그 정보

### 4.imageDownloader를 통한 img 파일 저장

![이미지 다운로더](https://user-images.githubusercontent.com/98578138/209639087-35ee7204-4291-4117-9ce0-64cae87e0481.png)

![결과값 1](https://user-images.githubusercontent.com/98578138/209639455-0cbb0ddd-4bc3-4d6b-9dcd-1bddc0ef063f.png)

![결과값 4](https://user-images.githubusercontent.com/98578138/209639538-97122b21-ac8e-43fd-92f1-82d47f0bebc5.png)

- 크롤링 배열에 담긴 url을 참조하여 서버 내 파일로 저장기능 수행
- api call 응답으로 url을 전송
- 작업 완료 시 성공/실패 로그 표출
- 브라우저 및 작업 종료

### 5. 기타

![1212](https://user-images.githubusercontent.com/98578138/209920358-fdf5a9fb-02f5-462a-84c9-38861f323c33.png)

- Moudle 나누기 / potal/키워드/날짜에 따른 directory 구분

![21313232](https://user-images.githubusercontent.com/98578138/209920554-993c6ae6-920d-459a-8b87-3e8bf72ca01f.png)

- 성공/실패/에러에 따른 log 표출

---

### 부가기능

//await page.click(".\_listImage"); //부가 기능 - 해당 태그를 클릭

//await page.screenshot({ path: "screen.png" }); // 부가 기능 - 스크린샷 찍기

//console.dir(crawlingData, { maxArrayLength: null }); // 수집한 전체 데이터
