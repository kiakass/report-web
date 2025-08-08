const express = require('express');
const router = express.Router();
const database = require('../config/database');

// 1. 리포트 생성
router.post('/', async (req, res) => {
  try {
    const {
      report_name,
      usage_plan,
      start_date,
      end_date,
      min_age,
      max_age,
      additional_info,
      target_companies,
      compare_companies
    } = req.body;

    // 필수 필드 검증
    if (!report_name || !start_date || !end_date) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['report_name', 'start_date', 'end_date']
      });
    }

    // 트랜잭션으로 리포트 및 관련 데이터 저장
    await database.transaction(async (db) => {
      // 1. 리포트 기본 정보 저장
      const reportResult = await db.run(`
        INSERT INTO reports (
          report_name, usage_plan, start_date, end_date, 
          min_age, max_age, additional_info
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [report_name, usage_plan, start_date, end_date, min_age || 20, max_age || 50, additional_info]);

      const reportId = reportResult.id;

      // 2. 대상 기업 저장
      if (target_companies && target_companies.length > 0) {
        for (const company of target_companies) {
          await db.run(`
            INSERT INTO target_companies (report_id, company_name, company_url, company_type)
            VALUES (?, ?, ?, 'target')
          `, [reportId, company.name, company.url]);
        }
      }

      // 3. 비교 기업 저장
      if (compare_companies && compare_companies.length > 0) {
        for (const company of compare_companies) {
          await db.run(`
            INSERT INTO target_companies (report_id, company_name, company_url, company_type)
            VALUES (?, ?, ?, 'compare')
          `, [reportId, company.name, company.url]);
        }
      }

      res.status(201).json({
        success: true,
        report_id: reportId,
        message: 'Report created successfully'
      });
    });

  } catch (error) {
    console.error('Report creation error:', error);
    res.status(500).json({
      error: 'Failed to create report',
      message: error.message
    });
  }
});

// 2. 리포트 목록 조회
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params = [];

    if (status) {
      whereClause = 'WHERE r.status = ?';
      params.push(status);
    }

    const reports = await database.all(`
      SELECT 
        r.*,
        COUNT(DISTINCT tc.id) as target_companies_count,
        COUNT(DISTINCT uf.id) as uploaded_files_count
      FROM reports r
      LEFT JOIN target_companies tc ON r.id = tc.report_id AND tc.company_type = 'target'
      LEFT JOIN uploaded_files uf ON r.id = uf.report_id
      ${whereClause}
      GROUP BY r.id
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    // 전체 개수 조회
    const countResult = await database.get(`
      SELECT COUNT(*) as total
      FROM reports r
      ${whereClause}
    `, params);

    res.json({
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        total_pages: Math.ceil(countResult.total / limit)
      }
    });

  } catch (error) {
    console.error('Report list error:', error);
    res.status(500).json({
      error: 'Failed to fetch reports',
      message: error.message
    });
  }
});

// 3. 리포트 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 리포트 기본 정보
    const report = await database.get(`
      SELECT * FROM reports WHERE id = ?
    `, [id]);

    if (!report) {
      return res.status(404).json({
        error: 'Report not found'
      });
    }

    // 대상 기업 목록
    const targetCompanies = await database.all(`
      SELECT * FROM target_companies 
      WHERE report_id = ? AND company_type = 'target'
      ORDER BY created_at
    `, [id]);

    // 비교 기업 목록
    const compareCompanies = await database.all(`
      SELECT * FROM target_companies 
      WHERE report_id = ? AND company_type = 'compare'
      ORDER BY created_at
    `, [id]);

    // 업로드된 파일 목록
    const uploadedFiles = await database.all(`
      SELECT * FROM uploaded_files 
      WHERE report_id = ?
      ORDER BY upload_date
    `, [id]);

    // AI 분석 결과
    const aiResults = await database.all(`
      SELECT * FROM ai_analysis_results 
      WHERE report_id = ?
      ORDER BY created_at
    `, [id]);

    res.json({
      report,
      target_companies: targetCompanies,
      compare_companies: compareCompanies,
      uploaded_files: uploadedFiles,
      ai_results: aiResults
    });

  } catch (error) {
    console.error('Report detail error:', error);
    res.status(500).json({
      error: 'Failed to fetch report details',
      message: error.message
    });
  }
});

// 4. 리포트 상태 업데이트
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ai_report_content, ai_report_summary } = req.body;

    const validStatuses = ['pending', 'processing', 'completed', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        valid_statuses: validStatuses
      });
    }

    const updateFields = ['status = ?'];
    const params = [status];

    if (ai_report_content !== undefined) {
      updateFields.push('ai_report_content = ?');
      params.push(ai_report_content);
    }

    if (ai_report_summary !== undefined) {
      updateFields.push('ai_report_summary = ?');
      params.push(ai_report_summary);
    }

    if (status === 'completed') {
      updateFields.push('completed_at = CURRENT_TIMESTAMP');
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await database.run(`
      UPDATE reports 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, params);

    res.json({
      success: true,
      message: 'Report status updated successfully'
    });

  } catch (error) {
    console.error('Report status update error:', error);
    res.status(500).json({
      error: 'Failed to update report status',
      message: error.message
    });
  }
});

// 5. 리포트 삭제
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 리포트 존재 여부 확인
    const report = await database.get(`
      SELECT id FROM reports WHERE id = ?
    `, [id]);

    if (!report) {
      return res.status(404).json({
        error: 'Report not found'
      });
    }

    // CASCADE로 관련 데이터도 함께 삭제됨
    await database.run(`
      DELETE FROM reports WHERE id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });

  } catch (error) {
    console.error('Report deletion error:', error);
    res.status(500).json({
      error: 'Failed to delete report',
      message: error.message
    });
  }
});

module.exports = router;
