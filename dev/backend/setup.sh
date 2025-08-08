#!/bin/bash

# 리포트 생성 시스템 백엔드 설정 스크립트
# 실행 위치: /home/user1/report-web

echo "🚀 리포트 생성 시스템 백엔드 설정을 시작합니다..."

# 1. 디렉토리 구조 생성
echo "📁 디렉토리 구조를 생성합니다..."
mkdir -p /home/user1/report-web/db
mkdir -p /home/user1/report-web/backend/uploads
mkdir -p /home/user1/report-web/backend/logs

# 2. 권한 설정
echo "🔐 권한을 설정합니다..."
chmod 755 /home/user1/report-web/db
chmod 755 /home/user1/report-web/backend/uploads
chmod 755 /home/user1/report-web/backend/logs

# 3. Node.js 확인
echo "📦 Node.js 버전을 확인합니다..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js가 설치되지 않았습니다."
    echo "Node.js를 먼저 설치해주세요: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 버전: $(node --version)"

# 4. 백엔드 디렉토리로 이동
cd /home/user1/report-web/backend

# 5. 의존성 설치
echo "📦 의존성을 설치합니다..."
npm install

# 6. 환경 변수 파일 생성
echo "⚙️ 환경 변수를 설정합니다..."
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ .env 파일이 생성되었습니다."
else
    echo "ℹ️ .env 파일이 이미 존재합니다."
fi

# 7. 데이터베이스 초기화
echo "🗄️ 데이터베이스를 초기화합니다..."
npm run init-db

# 8. 서버 실행 권한 설정
echo "🔧 실행 권한을 설정합니다..."
chmod +x scripts/init-database.js

# 9. PM2 설치 (선택사항)
echo "🔄 PM2를 설치합니다 (프로세스 관리용)..."
npm install -g pm2

# 10. 완료 메시지
echo ""
echo "✅ 백엔드 설정이 완료되었습니다!"
echo ""
echo "📋 다음 단계:"
echo "1. .env 파일을 편집하여 필요한 설정을 변경하세요"
echo "2. 서버를 시작하세요: npm run dev"
echo "3. API 테스트: curl http://localhost:3001/api/health"
echo ""
echo "📚 자세한 내용은 README.md를 참조하세요"
echo ""
