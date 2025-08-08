# 프로젝트 구조

## 프론트엔드 구조

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

### 프론트엔드 폴더/파일 설명

- **index.html**: 앱의 진입점이 되는 HTML 파일입니다.
- **assets/**: 이미지, 폰트 등 정적 리소스를 저장합니다.
- **data/**: 개발/테스트용 더미 데이터(JSON 등)를 저장합니다.
- **css/**: 스타일시트. 역할별로 분리되어 있습니다.
- **js/**: 자바스크립트 소스. 기능별, 차트별, 유틸별로 분리되어 있습니다.
- **components/**: UI 컴포넌트별로 HTML(템플릿)과 JS(로직/이벤트)를 쌍으로 분리합니다.
- **README.md**: 프로젝트 구조와 개발 가이드입니다.

## 백엔드 구조

백엔드는 **Express.js** 기반의 RESTful API 서버로 구성되어 있으며, 다음과 같은 구조로 되어 있습니다:

### 📁 루트 디렉토리 (`dev/backend/`)

#### 🔧 **핵심 설정 파일들**
- **`package.json`** - 프로젝트 메타데이터, 의존성, 스크립트 정의
- **`server.js`** - 메인 서버 진입점 (Express 앱 설정, 미들웨어, 라우터 연결)
- **`env.example`** - 환경변수 템플릿 파일
- **`setup.sh`** - Linux 서버 자동 설정 스크립트
- **`README.md`** - 백엔드 프로젝트 문서

### 📁 **config/** - 설정 및 데이터베이스
```
config/
└── database.js          # SQLite 데이터베이스 연결 및 유틸리티 클래스
```

**`database.js`**의 주요 기능:
- SQLite 데이터베이스 연결 관리
- Promise 기반 쿼리 실행 메서드 (`run`, `get`, `all`)
- 트랜잭션 지원
- 데이터베이스 초기화 및 테이블 생성

### 📁 **routes/** - API 엔드포인트
```
routes/
├── reports.js           # 리포트 관리 API (CRUD)
├── files.js            # 파일 업로드/관리 API
└── ai.js               # AI 분석 API
```

**각 라우터의 역할:**

#### **`reports.js`** - 리포트 관리
- `POST /` - 새 리포트 생성
- `GET /` - 리포트 목록 조회
- `GET /:id` - 리포트 상세 조회
- `PATCH /:id/status` - 리포트 상태 업데이트
- `DELETE /:id` - 리포트 삭제

#### **`files.js`** - 파일 관리
- `POST /:reportId/upload` - 파일 업로드
- `GET /:reportId` - 리포트별 파일 목록
- `GET /:reportId/download/:fileId` - 파일 다운로드
- `DELETE /:reportId/:fileId` - 파일 삭제
- `PATCH /:reportId/:fileId` - 파일 메타데이터 업데이트

#### **`ai.js`** - AI 분석
- `POST /:reportId/analyze` - AI 분석 시작
- `GET /:reportId/status` - 분석 상태 확인
- `GET /:reportId/results` - 분석 결과 조회

### 📁 **scripts/** - 유틸리티 스크립트
```
scripts/
└── init-database.js    # 데이터베이스 초기화 스크립트
```

**`init-database.js`**의 기능:
- 데이터베이스 디렉토리 생성
- SQLite 데이터베이스 파일 생성
- `schema.sql` 실행하여 테이블 생성
- 외래키 제약조건 활성화

### 📁 **외부 디렉토리들**

#### **`db/`** (프로젝트 루트)
```
db/
├── report_system.db    # SQLite 데이터베이스 파일
└── schema.sql         # 데이터베이스 스키마 정의
```

#### **`uploads/`** (백엔드 루트)
```
uploads/
└── {reportId}/        # 리포트별 업로드 파일 저장소
    ├── demographics/
    ├── timeSeries/
    ├── visitedSites/
    └── crossVisit/
```

### 🔄 **데이터 흐름**

1. **클라이언트 요청** → `server.js`
2. **라우팅** → `routes/` 디렉토리의 해당 라우터
3. **데이터베이스 작업** → `config/database.js`
4. **파일 처리** → `uploads/` 디렉토리
5. **AI 분석** → `routes/ai.js`의 AI 서비스

### 🛠️ **주요 기술 스택**

- **웹 프레임워크**: Express.js
- **데이터베이스**: SQLite3
- **파일 업로드**: Multer
- **보안**: Helmet, CORS, Rate Limiting
- **환경변수**: dotenv
- **프로세스 관리**: PM2 (선택사항)

이 구조는 **모듈화**와 **확장성**을 고려하여 설계되었으며, 각 기능별로 명확히 분리되어 있어 유지보수와 개발이 용이합니다.

## 백엔드 프로젝트 구조

### 설치 및 설정

#### 1. 환경 설정
```bash
# 프로젝트 디렉토리로 이동
cd /home/user1/report-web

# 백엔드 디렉토리로 이동
cd backend

# 의존성 설치
npm install

# 환경변수 파일 생성
cp env.example .env

# 데이터베이스 초기화
npm run init-db
```

#### 2. 서버 실행
```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

### 환경변수 설정

`.env` 파일에서 다음 설정을 확인/수정하세요:

```env
# 서버 설정
PORT=3001
NODE_ENV=development

# 프론트엔드 URL
FRONTEND_URL=http://localhost:3000

# 데이터베이스 설정
DB_PATH=/home/user1/report-web/db/report_system.db

# 파일 업로드 설정
UPLOAD_PATH=/home/user1/report-web/backend/uploads
MAX_FILE_SIZE=10485760

# AI 설정
AI_MODEL_VERSION=1.0
AI_PROCESSING_TIMEOUT=300

# 보안 설정
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 데이터베이스 스키마

#### 주요 테이블

1. **reports** - 리포트 기본 정보
   - id, report_name, usage_plan, start_date, end_date
   - min_age, max_age, additional_info
   - status, created_at, updated_at, completed_at
   - ai_report_content, ai_report_summary

2. **target_companies** - 대상 기업 정보
   - id, report_id, company_name, company_url, company_type

3. **uploaded_files** - 업로드 파일 정보
   - id, report_id, file_name, original_name, file_path
   - file_size, file_type, analysis_type, upload_date

4. **ai_analysis_results** - AI 분석 결과
   - id, report_id, analysis_type, result_data, created_at

5. **system_settings** - 시스템 설정
   - id, setting_key, setting_value, description, updated_at

### API 엔드포인트

#### 리포트 관리 API

| 메서드 | 엔드포인트 | 설명 |
|--------|------------|------|
| POST | `/api/reports` | 새 리포트 생성 |
| GET | `/api/reports` | 리포트 목록 조회 |
| GET | `/api/reports/:id` | 리포트 상세 조회 |
| PATCH | `/api/reports/:id/status` | 리포트 상태 업데이트 |
| DELETE | `/api/reports/:id` | 리포트 삭제 |

#### 파일 관리 API

| 메서드 | 엔드포인트 | 설명 |
|--------|------------|------|
| POST | `/api/files/:reportId/upload` | 파일 업로드 |
| GET | `/api/files/:reportId` | 리포트별 파일 목록 |
| GET | `/api/files/:reportId/download/:fileId` | 파일 다운로드 |
| DELETE | `/api/files/:reportId/:fileId` | 파일 삭제 |
| PATCH | `/api/files/:reportId/:fileId` | 파일 메타데이터 업데이트 |

#### AI 분석 API

| 메서드 | 엔드포인트 | 설명 |
|--------|------------|------|
| POST | `/api/ai/:reportId/analyze` | AI 분석 시작 |
| GET | `/api/ai/:reportId/status` | 분석 상태 확인 |
| GET | `/api/ai/:reportId/results` | 분석 결과 조회 |

### 개발 가이드

#### 1. 새로운 API 엔드포인트 추가

```javascript
// routes/example.js
const express = require('express');
const router = express.Router();
const database = require('../config/database');

// GET /api/example
router.get('/', async (req, res) => {
  try {
    const results = await database.all('SELECT * FROM example');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

#### 2. 데이터베이스 쿼리 예제

```javascript
// 단일 행 조회
const report = await database.get(
  'SELECT * FROM reports WHERE id = ?', 
  [reportId]
);

// 여러 행 조회
const files = await database.all(
  'SELECT * FROM uploaded_files WHERE report_id = ?', 
  [reportId]
);

// 데이터 삽입
const result = await database.run(
  'INSERT INTO reports (report_name, start_date, end_date) VALUES (?, ?, ?)',
  [reportName, startDate, endDate]
);

// 트랜잭션 사용
await database.transaction(async (db) => {
  await db.run('INSERT INTO reports (...) VALUES (...)');
  await db.run('INSERT INTO target_companies (...) VALUES (...)');
});
```

#### 3. 파일 업로드 처리

```javascript
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const reportId = req.params.reportId;
    const uploadPath = path.join(__dirname, '../uploads', reportId);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });
```

### 보안 고려사항

1. **입력 검증**: 모든 사용자 입력에 대한 검증 필요
2. **파일 업로드 보안**: 파일 타입, 크기 제한
3. **SQL 인젝션 방지**: 파라미터화된 쿼리 사용
4. **CORS 설정**: 허용된 도메인만 접근 가능
5. **Rate Limiting**: API 요청 제한
6. **환경변수 보안**: 민감한 정보는 환경변수로 관리

### 성능 최적화

1. **데이터베이스 인덱스**: 자주 조회되는 컬럼에 인덱스 생성
2. **파일 압축**: 대용량 파일 전송 시 압축 사용
3. **캐싱**: 자주 조회되는 데이터 캐싱
4. **비동기 처리**: AI 분석 등 시간이 오래 걸리는 작업은 비동기로 처리

### 문제 해결

#### 일반적인 문제들

1. **데이터베이스 연결 오류**
   ```bash
   # 데이터베이스 파일 권한 확인
   ls -la /home/user1/report-web/db/
   
   # 데이터베이스 재초기화
   npm run init-db
   ```

2. **파일 업로드 오류**
   ```bash
   # 업로드 디렉토리 권한 확인
   ls -la /home/user1/report-web/backend/uploads/
   
   # 디렉토리 생성
   mkdir -p /home/user1/report-web/backend/uploads
   ```

3. **포트 충돌**
   ```bash
   # 사용 중인 포트 확인
   netstat -tulpn | grep :3001
   
   # 환경변수에서 포트 변경
   PORT=3002 npm run dev
   ```

### 지원 및 문의

- **문서**: 이 README.md 파일 참조
- **API 문서**: `/api/health` 엔드포인트로 서버 상태 확인
- **로그**: 서버 로그에서 오류 정보 확인
- **데이터베이스**: SQLite 브라우저로 데이터베이스 직접 확인 