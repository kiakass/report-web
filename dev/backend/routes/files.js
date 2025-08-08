const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const database = require('../config/database');

// 업로드 디렉토리 설정
const uploadDir = path.join(__dirname, '../uploads');
fs.ensureDirSync(uploadDir);

// 파일 필터링
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['csv', 'xlsx', 'xls'];
  const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const reportId = req.params.reportId;
    const reportDir = path.join(uploadDir, reportId.toString());
    fs.ensureDirSync(reportDir);
    cb(null, reportDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1
  }
});

// 1. 파일 업로드
router.post('/:reportId/upload', upload.single('file'), async (req, res) => {
  try {
    const { reportId } = req.params;
    const { analysisType } = req.body;

    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }

    if (!analysisType) {
      return res.status(400).json({
        error: 'Analysis type is required',
        valid_types: ['demographics', 'timeSeries', 'visitedSites', 'crossVisit']
      });
    }

    // 리포트 존재 여부 확인
    const report = await database.get(`
      SELECT id FROM reports WHERE id = ?
    `, [reportId]);

    if (!report) {
      // 업로드된 파일 삭제
      await fs.remove(req.file.path);
      return res.status(404).json({
        error: 'Report not found'
      });
    }

    // 파일 정보 DB에 저장
    const fileResult = await database.run(`
      INSERT INTO uploaded_files (
        report_id, file_name, original_name, file_path, 
        file_size, file_type, analysis_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      reportId,
      req.file.filename,
      req.file.originalname,
      req.file.path,
      req.file.size,
      path.extname(req.file.originalname).toLowerCase().substring(1),
      analysisType
    ]);

    res.status(201).json({
      success: true,
      file_id: fileResult.id,
      file_name: req.file.filename,
      original_name: req.file.originalname,
      file_size: req.file.size,
      analysis_type: analysisType,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('File upload error:', error);
    
    // 업로드된 파일이 있다면 삭제
    if (req.file) {
      await fs.remove(req.file.path);
    }

    res.status(500).json({
      error: 'Failed to upload file',
      message: error.message
    });
  }
});

// 2. 파일 목록 조회
router.get('/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;

    const files = await database.all(`
      SELECT * FROM uploaded_files 
      WHERE report_id = ?
      ORDER BY upload_date DESC
    `, [reportId]);

    res.json({
      files,
      total: files.length
    });

  } catch (error) {
    console.error('File list error:', error);
    res.status(500).json({
      error: 'Failed to fetch files',
      message: error.message
    });
  }
});

// 3. 파일 다운로드
router.get('/:reportId/download/:fileId', async (req, res) => {
  try {
    const { reportId, fileId } = req.params;

    const file = await database.get(`
      SELECT * FROM uploaded_files 
      WHERE id = ? AND report_id = ?
    `, [fileId, reportId]);

    if (!file) {
      return res.status(404).json({
        error: 'File not found'
      });
    }

    // 파일 존재 여부 확인
    if (!await fs.pathExists(file.file_path)) {
      return res.status(404).json({
        error: 'File not found on disk'
      });
    }

    res.download(file.file_path, file.original_name);

  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({
      error: 'Failed to download file',
      message: error.message
    });
  }
});

// 4. 파일 삭제
router.delete('/:reportId/:fileId', async (req, res) => {
  try {
    const { reportId, fileId } = req.params;

    const file = await database.get(`
      SELECT * FROM uploaded_files 
      WHERE id = ? AND report_id = ?
    `, [fileId, reportId]);

    if (!file) {
      return res.status(404).json({
        error: 'File not found'
      });
    }

    // 파일 시스템에서 삭제
    if (await fs.pathExists(file.file_path)) {
      await fs.remove(file.file_path);
    }

    // DB에서 삭제
    await database.run(`
      DELETE FROM uploaded_files WHERE id = ?
    `, [fileId]);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({
      error: 'Failed to delete file',
      message: error.message
    });
  }
});

// 5. 파일 정보 업데이트
router.patch('/:reportId/:fileId', async (req, res) => {
  try {
    const { reportId, fileId } = req.params;
    const { analysis_type } = req.body;

    const validTypes = ['demographics', 'timeSeries', 'visitedSites', 'crossVisit'];
    if (analysis_type && !validTypes.includes(analysis_type)) {
      return res.status(400).json({
        error: 'Invalid analysis type',
        valid_types: validTypes
      });
    }

    const updateFields = [];
    const params = [];

    if (analysis_type) {
      updateFields.push('analysis_type = ?');
      params.push(analysis_type);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No fields to update'
      });
    }

    params.push(fileId, reportId);

    const result = await database.run(`
      UPDATE uploaded_files 
      SET ${updateFields.join(', ')}
      WHERE id = ? AND report_id = ?
    `, params);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'File not found'
      });
    }

    res.json({
      success: true,
      message: 'File updated successfully'
    });

  } catch (error) {
    console.error('File update error:', error);
    res.status(500).json({
      error: 'Failed to update file',
      message: error.message
    });
  }
});

module.exports = router;
