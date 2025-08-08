# 리포트 생성 시스템 백엔드

리포트 생성 페이지의 백엔드 API 서버입니다.

## 🏗️ 프로젝트 구조

```
backend/
├── config/
│   └── database.js          # 데이터베이스 연결 및 설정
├── routes/
│   ├── reports.js           # 리포트 관련 API
│   ├── files.js             # 파일 업로드 관련 API
│   └── ai.js                # AI 분석 관련 API
├── uploads/                 # 업로드된 파일 저장소
├── scripts/
│   └── init-database.js     # 데이터베이스 초기화 스크립트
├── server.js                # 메인 서버 파일
├── package.json             # 프로젝트 의존성
└── env.example              # 환경 변수 예제
```

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
cd backend
npm install
```

### 2. 환경 변수 설정
```bash
cp env.example .env
# .env 파일을 편집하여 필요한 설정을 변경
```

### 3. 데이터베이스 초기화
```bash
npm run init-db
```

### 4. 서버 실행
```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

## 📊 데이터베이스 스키마

### 주요 테이블
- **reports**: 리포트 기본 정보
- **target_companies**: 대상/비교 기업 정보
- **uploaded_files**: 업로드된 파일 정보
- **ai_analysis_results**: AI 분석 결과
- **system_settings**: 시스템 설정

## 🔌 API 엔드포인트

### 리포트 관리
- `POST /api/reports` - 리포트 생성
- `GET /api/reports` - 리포트 목록 조회
- `GET /api/reports/:id` - 리포트 상세 조회
- `PATCH /api/reports/:id/status` - 리포트 상태 업데이트
- `DELETE /api/reports/:id` - 리포트 삭제

### 파일 관리
- `POST /api/files/:reportId/upload` - 파일 업로드
- `GET /api/files/:reportId` - 파일 목록 조회
- `GET /api/files/:reportId/download/:fileId` - 파일 다운로드
- `DELETE /api/files/:reportId/:fileId` - 파일 삭제
- `PATCH /api/files/:reportId/:fileId` - 파일 정보 업데이트

### AI 분석
- `POST /api/ai/:reportId/analyze` - AI 분석 시작
- `GET /api/ai/:reportId/status` - 분석 상태 조회
- `GET /api/ai/:reportId/results` - 분석 결과 조회

## 🔧 개발 가이드

### 환경 변수
- `PORT`: 서버 포트 (기본값: 3001)
- `NODE_ENV`: 실행 환경 (development/production)
- `FRONTEND_URL`: 프론트엔드 URL
- `DB_PATH`: 데이터베이스 파일 경로
- `UPLOAD_PATH`: 파일 업로드 경로

### 데이터베이스 백업
```bash
# SQLite 데이터베이스 백업
cp /home/user1/report-web/db/report_system.db backup/
```

### 로그 확인
```bash
# 서버 로그 확인
tail -f logs/server.log
```

## 🛠️ 기술 스택

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate Limiting

## 📝 API 문서

### 리포트 생성 예제
```bash
curl -X POST http://localhost:3001/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "report_name": "기업 분석 리포트",
    "usage_plan": "영업활동 및 사내계획",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "min_age": 20,
    "max_age": 50,
    "target_companies": [
      {"name": "A기업", "url": "https://a.com"},
      {"name": "B기업", "url": "https://b.com"}
    ],
    "compare_companies": [
      {"name": "C기업", "url": "https://c.com"}
    ]
  }'
```

### 파일 업로드 예제
```bash
curl -X POST http://localhost:3001/api/files/1/upload \
  -F "file=@data.csv" \
  -F "analysisType=demographics"
```

### AI 분석 시작 예제
```bash
curl -X POST http://localhost:3001/api/ai/1/analyze
```

## 🔒 보안 설정

- CORS 설정으로 프론트엔드 도메인만 허용
- Rate limiting으로 API 요청 제한
- Helmet으로 보안 헤더 설정
- 파일 업로드 크기 및 타입 제한

## 📈 성능 최적화

- 데이터베이스 인덱스 설정
- 파일 업로드 스트리밍
- 비동기 AI 분석 처리
- 메모리 사용량 모니터링

## 🐛 문제 해결

### 일반적인 문제들

1. **데이터베이스 연결 오류**
   ```bash
   # DB 파일 권한 확인
   ls -la /home/user1/report-web/db/
   # 권한 수정
   chmod 755 /home/user1/report-web/db/
   ```

2. **파일 업로드 오류**
   ```bash
   # 업로드 디렉토리 권한 확인
   ls -la backend/uploads/
   # 권한 수정
   chmod 755 backend/uploads/
   ```

3. **포트 충돌**
   ```bash
   # 포트 사용 확인
   netstat -tulpn | grep 3001
   # 프로세스 종료
   kill -9 <PID>
   ```

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. 로그 파일 확인
2. 데이터베이스 연결 상태 확인
3. 환경 변수 설정 확인
4. 파일 권한 확인
