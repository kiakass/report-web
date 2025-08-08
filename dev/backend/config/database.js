const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs-extra');

class Database {
  constructor() {
    this.dbPath = path.join(__dirname, '../../db/report_system.db');
    this.db = null;
    this.init();
  }

  async init() {
    try {
      // DB 디렉토리 생성
      const dbDir = path.dirname(this.dbPath);
      await fs.ensureDir(dbDir);

      // SQLite 데이터베이스 연결
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('❌ Database connection error:', err.message);
        } else {
          console.log('✅ Connected to SQLite database');
          this.createTables();
        }
      });

      // 외래키 제약 조건 활성화
      this.db.run('PRAGMA foreign_keys = ON');
      
    } catch (error) {
      console.error('❌ Database initialization error:', error);
    }
  }

  async createTables() {
    try {
      const schemaPath = path.join(__dirname, '../../db/schema.sql');
      const schema = await fs.readFile(schemaPath, 'utf8');
      
      // 스키마 실행
      this.db.exec(schema, (err) => {
        if (err) {
          console.error('❌ Schema creation error:', err.message);
        } else {
          console.log('✅ Database tables created successfully');
        }
      });
    } catch (error) {
      console.error('❌ Schema file read error:', error);
    }
  }

  // 쿼리 실행 (Promise 기반)
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // 단일 행 조회
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // 여러 행 조회
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // 트랜잭션 실행
  async transaction(callback) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');
        
        try {
          callback(this);
          this.db.run('COMMIT', (err) => {
            if (err) {
              this.db.run('ROLLBACK');
              reject(err);
            } else {
              resolve();
            }
          });
        } catch (error) {
          this.db.run('ROLLBACK');
          reject(error);
        }
      });
    });
  }

  // 연결 종료
  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('✅ Database connection closed');
          resolve();
        }
      });
    });
  }
}

// 싱글톤 인스턴스
const database = new Database();

module.exports = database;
