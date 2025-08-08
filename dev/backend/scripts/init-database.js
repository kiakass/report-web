#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const sqlite3 = require('sqlite3').verbose();

console.log('🗄️  Initializing database...');

async function initDatabase() {
  try {
    // DB 디렉토리 생성
    const dbDir = path.join(__dirname, '../../db');
    const dbPath = path.join(dbDir, 'report_system.db');
    
    await fs.ensureDir(dbDir);
    console.log(`✅ Database directory created: ${dbDir}`);

    // SQLite 데이터베이스 생성
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Database creation error:', err.message);
        process.exit(1);
      }
      console.log(`✅ Database created: ${dbPath}`);
    });

    // 외래키 제약 조건 활성화
    db.run('PRAGMA foreign_keys = ON');

    // 스키마 파일 읽기
    const schemaPath = path.join(__dirname, '../../db/schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    console.log('📋 Executing schema...');

    // 스키마 실행
    db.exec(schema, (err) => {
      if (err) {
        console.error('❌ Schema execution error:', err.message);
        process.exit(1);
      }
      
      console.log('✅ Database schema created successfully');
      
      // 테이블 확인
      db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
          console.error('❌ Table verification error:', err.message);
        } else {
          console.log('📊 Created tables:');
          tables.forEach(table => {
            console.log(`  - ${table.name}`);
          });
        }
        
        // 데이터베이스 연결 종료
        db.close((err) => {
          if (err) {
            console.error('❌ Database close error:', err.message);
          } else {
            console.log('✅ Database initialization completed');
          }
        });
      });
    });

  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };
