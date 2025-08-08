# 프로젝트 구조

```
project/
├── index.html                  # 메인 HTML (진입점)
├── assets/
│   ├── images/                 # 이미지, 아이콘 등
│   ├── fonts/                  # 웹폰트
│   └── ...                     # 기타 정적 리소스
├── data/
│   ├── dummy-history.json      # 샘플 히스토리 데이터
│   └── dummy-report.json       # 샘플 리포트 데이터
├── css/
│   ├── main.css                # 전체 기본 스타일(글꼴, 컬러, reset 등)
│   ├── layout.css              # 레이아웃(사이드바, 그리드 등)
│   ├── components.css          # 버튼, 카드 등 UI 컴포넌트 스타일
│   └── responsive.css          # 반응형 미디어 쿼리
├── js/
│   ├── main.js                 # 앱 초기화, 전역 이벤트, SPA 라우팅
│   ├── navigation.js           # 메뉴/섹션 전환, URL 해시 관리
│   ├── forms.js                # 폼 입력, 검증, 제출 처리
│   ├── api.js                  # 서버/API 통신, fetch 래퍼
│   ├── utils.js                # 공통 유틸 함수(포맷, DOM, etc)
│   └── charts/
│       ├── demographics.js     # 인구통계 차트
│       ├── trends.js           # 트렌드 차트
│       └── behavior.js         # 행동 분석 차트
├── components/
│   ├── sidebar.html            # 사이드바 템플릿
│   ├── sidebar.js              # 사이드바 동작/이벤트
│   ├── header.html             # 헤더(타이틀/소개) 템플릿
│   ├── header.js               # 헤더 동작/이벤트
│   ├── report-form.html        # 리포트 생성 폼 템플릿
│   ├── report-form.js          # 리포트 생성 폼 동작/이벤트
│   ├── history-table.html      # 히스토리 테이블 템플릿
│   ├── history-table.js        # 히스토리 테이블 동작/이벤트
│   ├── report-view.html        # 리포트 상세 뷰 템플릿
│   └── report-view.js          # 리포트 상세 뷰 동작/이벤트
└── README.md                   # 프로젝트 설명 및 개발 가이드
```

## 폴더/파일 설명

- **index.html**: 앱의 진입점이 되는 HTML 파일입니다.
- **assets/**: 이미지, 폰트 등 정적 리소스를 저장합니다.
- **data/**: 개발/테스트용 더미 데이터(JSON 등)를 저장합니다.
- **css/**: 스타일시트. 역할별로 분리되어 있습니다.
- **js/**: 자바스크립트 소스. 기능별, 차트별, 유틸별로 분리되어 있습니다.
- **components/**: UI 컴포넌트별로 HTML(템플릿)과 JS(로직/이벤트)를 쌍으로 분리합니다.
- **README.md**: 프로젝트 구조와 개발 가이드입니다. 