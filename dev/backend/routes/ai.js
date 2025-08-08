const express = require('express');
const router = express.Router();
const database = require('../config/database');

// AI 분석 서비스 클래스
class AIAnalysisService {
  constructor() {
    this.processingQueue = new Map();
  }

  // AI 분석 시작
  async startAnalysis(reportId) {
    try {
      // 리포트 정보 조회
      const report = await database.get(`
        SELECT * FROM reports WHERE id = ?
      `, [reportId]);

      if (!report) {
        throw new Error('Report not found');
      }

      // 업로드된 파일 조회
      const files = await database.all(`
        SELECT * FROM uploaded_files WHERE report_id = ?
      `, [reportId]);

      if (files.length === 0) {
        throw new Error('No files uploaded for analysis');
      }

      // 상태를 processing으로 변경
      await database.run(`
        UPDATE reports SET status = 'processing', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [reportId]);

      // 비동기로 AI 분석 실행
      this.processAnalysis(reportId, report, files);

      return {
        success: true,
        report_id: reportId,
        message: 'AI analysis started',
        files_count: files.length
      };

    } catch (error) {
      console.error('AI analysis start error:', error);
      throw error;
    }
  }

  // AI 분석 처리 (비동기)
  async processAnalysis(reportId, report, files) {
    try {
      console.log(`🤖 Starting AI analysis for report ${reportId}`);

      // 각 파일별 분석 수행
      for (const file of files) {
        await this.analyzeFile(reportId, file, report);
      }

      // 종합 리포트 생성
      const finalReport = await this.generateFinalReport(reportId, report, files);

      // 상태를 completed로 변경
      await database.run(`
        UPDATE reports 
        SET status = 'completed', 
            ai_report_content = ?, 
            ai_report_summary = ?,
            completed_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [finalReport.content, finalReport.summary, reportId]);

      console.log(`✅ AI analysis completed for report ${reportId}`);

    } catch (error) {
      console.error(`❌ AI analysis failed for report ${reportId}:`, error);
      
      // 상태를 failed로 변경
      await database.run(`
        UPDATE reports 
        SET status = 'failed', 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [reportId]);
    }
  }

  // 개별 파일 분석
  async analyzeFile(reportId, file, report) {
    try {
      console.log(`📊 Analyzing file: ${file.original_name} (${file.analysis_type})`);

      // 파일 타입별 분석 로직
      let analysisResult = {};

      switch (file.analysis_type) {
        case 'demographics':
          analysisResult = await this.analyzeDemographics(file, report);
          break;
        case 'timeSeries':
          analysisResult = await this.analyzeTimeSeries(file, report);
          break;
        case 'visitedSites':
          analysisResult = await this.analyzeVisitedSites(file, report);
          break;
        case 'crossVisit':
          analysisResult = await this.analyzeCrossVisit(file, report);
          break;
        default:
          throw new Error(`Unknown analysis type: ${file.analysis_type}`);
      }

      // 분석 결과 저장
      await database.run(`
        INSERT INTO ai_analysis_results (report_id, analysis_type, result_data)
        VALUES (?, ?, ?)
      `, [reportId, file.analysis_type, JSON.stringify(analysisResult)]);

      console.log(`✅ Analysis completed for ${file.analysis_type}`);

    } catch (error) {
      console.error(`❌ File analysis failed: ${file.original_name}`, error);
      throw error;
    }
  }

  // 인구통계학적 분석
  async analyzeDemographics(file, report) {
    // 실제 AI 분석 로직 구현
    return {
      type: 'demographics',
      summary: '인구통계학적 분석 결과',
      key_findings: [
        '주요 연령대: 30-40대',
        '성별 분포: 남성 60%, 여성 40%',
        '지역별 분포: 서울 45%, 경기 30%, 기타 25%'
      ],
      charts: {
        age_distribution: { /* 차트 데이터 */ },
        gender_distribution: { /* 차트 데이터 */ },
        location_distribution: { /* 차트 데이터 */ }
      },
      recommendations: [
        '30-40대 타겟 마케팅 강화',
        '남성 고객 대상 서비스 개선',
        '서울 지역 집중 마케팅'
      ]
    };
  }

  // 시계열 분석
  async analyzeTimeSeries(file, report) {
    return {
      type: 'timeSeries',
      summary: '시계열 분석 결과',
      key_findings: [
        '월별 트렌드: 3-4월 성장세',
        '주간 패턴: 월요일-수요일 활성도 높음',
        '시간대별: 오후 2-6시 피크'
      ],
      charts: {
        monthly_trend: { /* 차트 데이터 */ },
        weekly_pattern: { /* 차트 데이터 */ },
        hourly_distribution: { /* 차트 데이터 */ }
      },
      recommendations: [
        '3-4월 마케팅 캠페인 집중',
        '월-수 오전 시간대 서비스 개선',
        '오후 2-6시 고객 서비스 강화'
      ]
    };
  }

  // 주요 방문 사이트 분석
  async analyzeVisitedSites(file, report) {
    return {
      type: 'visitedSites',
      summary: '주요 방문 사이트 분석 결과',
      key_findings: [
        '상위 방문 사이트: 네이버, 구글, 카카오',
        '업종별 선호도: IT/기술, 금융, 쇼핑',
        '경쟁사 사이트 방문률: 15%'
      ],
      charts: {
        top_sites: { /* 차트 데이터 */ },
        industry_preference: { /* 차트 데이터 */ },
        competitor_visits: { /* 차트 데이터 */ }
      },
      recommendations: [
        '네이버/구글 광고 집중 투자',
        'IT/기술 업종 타겟 마케팅',
        '경쟁사 대비 차별화 전략 수립'
      ]
    };
  }

  // 교차 방문율 분석
  async analyzeCrossVisit(file, report) {
    return {
      type: 'crossVisit',
      summary: '교차 방문율 분석 결과',
      key_findings: [
        '경쟁사와의 교차 방문률: 25%',
        '상관관계 높은 사이트: A사(40%), B사(30%)',
        '독점 고객 비율: 75%'
      ],
      charts: {
        cross_visit_matrix: { /* 차트 데이터 */ },
        customer_loyalty: { /* 차트 데이터 */ },
        competitive_analysis: { /* 차트 데이터 */ }
      },
      recommendations: [
        'A사, B사 고객 타겟 마케팅',
        '독점 고객 충성도 프로그램 강화',
        '경쟁사 대비 서비스 차별화'
      ]
    };
  }

  // 종합 리포트 생성
  async generateFinalReport(reportId, report, files) {
    // 모든 분석 결과 조회
    const analysisResults = await database.all(`
      SELECT * FROM ai_analysis_results WHERE report_id = ?
    `, [reportId]);

    // 종합 리포트 생성 로직
    const summary = this.generateSummary(analysisResults, report);
    const content = this.generateDetailedReport(analysisResults, report, files);

    return {
      summary,
      content
    };
  }

  // 요약 리포트 생성
  generateSummary(analysisResults, report) {
    return {
      report_name: report.report_name,
      analysis_period: `${report.start_date} ~ ${report.end_date}`,
      total_files: analysisResults.length,
      key_insights: [
        '주요 타겟: 30-40대 남성',
        '최적 마케팅 시기: 3-4월',
        '핵심 경쟁사: A사, B사',
        '고객 충성도: 75%'
      ],
      recommendations: [
        '30-40대 남성 타겟 마케팅 강화',
        '3-4월 집중 캠페인 실행',
        'A사, B사 고객 타겟팅',
        '충성 고객 프로그램 개발'
      ]
    };
  }

  // 상세 리포트 생성
  generateDetailedReport(analysisResults, report, files) {
    return {
      report_info: {
        name: report.report_name,
        period: `${report.start_date} ~ ${report.end_date}`,
        age_range: `${report.min_age}~${report.max_age}세`,
        created_at: report.created_at
      },
      analysis_files: files.map(f => ({
        name: f.original_name,
        type: f.analysis_type,
        size: f.file_size
      })),
      analysis_results: analysisResults.map(result => ({
        type: result.analysis_type,
        data: JSON.parse(result.result_data)
      })),
      executive_summary: '이번 분석을 통해 고객의 행동 패턴과 선호도를 파악했습니다...',
      detailed_findings: '각 분석 항목별 상세 결과...',
      strategic_recommendations: '분석 결과를 바탕으로 한 전략적 제안...'
    };
  }
}

// AI 분석 서비스 인스턴스
const aiService = new AIAnalysisService();

// 1. AI 분석 시작
router.post('/:reportId/analyze', async (req, res) => {
  try {
    const { reportId } = req.params;

    const result = await aiService.startAnalysis(reportId);

    res.json(result);

  } catch (error) {
    console.error('AI analysis start error:', error);
    res.status(500).json({
      error: 'Failed to start AI analysis',
      message: error.message
    });
  }
});

// 2. 분석 상태 조회
router.get('/:reportId/status', async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await database.get(`
      SELECT id, status, created_at, completed_at, ai_report_summary
      FROM reports WHERE id = ?
    `, [reportId]);

    if (!report) {
      return res.status(404).json({
        error: 'Report not found'
      });
    }

    // 분석 결과 조회
    const analysisResults = await database.all(`
      SELECT analysis_type, created_at 
      FROM ai_analysis_results 
      WHERE report_id = ?
      ORDER BY created_at
    `, [reportId]);

    res.json({
      report_id: reportId,
      status: report.status,
      created_at: report.created_at,
      completed_at: report.completed_at,
      analysis_results: analysisResults,
      summary: report.ai_report_summary ? JSON.parse(report.ai_report_summary) : null
    });

  } catch (error) {
    console.error('Analysis status error:', error);
    res.status(500).json({
      error: 'Failed to fetch analysis status',
      message: error.message
    });
  }
});

// 3. 분석 결과 조회
router.get('/:reportId/results', async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await database.get(`
      SELECT * FROM reports WHERE id = ?
    `, [reportId]);

    if (!report) {
      return res.status(404).json({
        error: 'Report not found'
      });
    }

    if (report.status !== 'completed') {
      return res.status(400).json({
        error: 'Analysis not completed',
        status: report.status
      });
    }

    const analysisResults = await database.all(`
      SELECT * FROM ai_analysis_results 
      WHERE report_id = ?
      ORDER BY created_at
    `, [reportId]);

    res.json({
      report: {
        id: report.id,
        name: report.report_name,
        status: report.status,
        created_at: report.created_at,
        completed_at: report.completed_at,
        content: report.ai_report_content ? JSON.parse(report.ai_report_content) : null,
        summary: report.ai_report_summary ? JSON.parse(report.ai_report_summary) : null
      },
      analysis_results: analysisResults.map(result => ({
        type: result.analysis_type,
        data: JSON.parse(result.result_data),
        created_at: result.created_at
      }))
    });

  } catch (error) {
    console.error('Analysis results error:', error);
    res.status(500).json({
      error: 'Failed to fetch analysis results',
      message: error.message
    });
  }
});

module.exports = router;
