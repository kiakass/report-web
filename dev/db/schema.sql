-- 리포트 생성 시스템 데이터베이스 스키마
-- 파일 위치: /home/user1/report-web/db/report_system.db

-- 1. 리포트 기본 정보 테이블
CREATE TABLE reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_name TEXT NOT NULL,
    usage_plan TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    min_age INTEGER DEFAULT 20,
    max_age INTEGER DEFAULT 50,
    additional_info TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    ai_report_content TEXT NULL,
    ai_report_summary TEXT NULL
);

-- 2. 대상 기업 정보 테이블
CREATE TABLE target_companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER NOT NULL,
    company_name TEXT NOT NULL,
    company_url TEXT,
    company_type TEXT DEFAULT 'target',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

-- 3. 비교 기업 정보 테이블 (target_companies와 동일한 구조, type으로 구분)
-- CREATE TABLE compare_companies (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     report_id INTEGER NOT NULL,
--     company_name TEXT NOT NULL,
--     company_url TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
-- );

-- 4. 업로드 파일 정보 테이블
CREATE TABLE uploaded_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type TEXT NOT NULL,
    analysis_type TEXT NOT NULL CHECK (analysis_type IN ('demographics', 'timeSeries', 'visitedSites', 'crossVisit')),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

-- 5. AI 분석 결과 테이블
CREATE TABLE ai_analysis_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER NOT NULL,
    analysis_type TEXT NOT NULL,
    result_data TEXT NOT NULL, -- JSON 형태로 저장
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

-- 6. 시스템 설정 테이블
CREATE TABLE system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at);
CREATE INDEX idx_target_companies_report_id ON target_companies(report_id);
CREATE INDEX idx_uploaded_files_report_id ON uploaded_files(report_id);
CREATE INDEX idx_uploaded_files_analysis_type ON uploaded_files(analysis_type);
CREATE INDEX idx_ai_analysis_results_report_id ON ai_analysis_results(report_id);

-- 기본 시스템 설정 삽입
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('file_upload_path', '/home/user1/report-web/uploads', '파일 업로드 기본 경로'),
('ai_model_version', '1.0', 'AI 모델 버전'),
('max_file_size', '10485760', '최대 파일 크기 (10MB)'),
('allowed_file_types', 'csv,xlsx,xls', '허용된 파일 타입'),
('ai_processing_timeout', '300', 'AI 처리 타임아웃 (초)');

-- 뷰 생성 (리포트 히스토리 조회용)
CREATE VIEW report_history AS
SELECT 
    r.id,
    r.report_name,
    r.status,
    r.created_at,
    r.completed_at,
    COUNT(DISTINCT tc.id) as target_companies_count,
    COUNT(DISTINCT uf.id) as uploaded_files_count
FROM reports r
LEFT JOIN target_companies tc ON r.id = tc.report_id AND tc.company_type = 'target'
LEFT JOIN uploaded_files uf ON r.id = uf.report_id
GROUP BY r.id, r.report_name, r.status, r.created_at, r.completed_at
ORDER BY r.created_at DESC;
