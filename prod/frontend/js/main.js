// main.js - 앱 초기화 및 SPA 라우팅
import { loadComponent } from './utils.js';
import { initNavigation } from './navigation.js';
import { initForms } from './forms.js';
import { initHistory } from './history.js';
import { showReportSection } from './report-charts.js';
import { initReportForm } from './report-form.js';

// 컴포넌트 로드 함수
async function loadComponents() {
  try {
    // 모든 컴포넌트를 동시에 로드
    await Promise.all([
      loadComponent('#sidebar', './components/sidebar.html'),
      loadComponent('#header', './components/header.html'),
      loadComponent('#report-form', './components/report-form.html'),
      loadComponent('#report-view', './components/report-view.html')
    ]);
    
    console.log('모든 컴포넌트 로드 완료');
    
    // 컴포넌트 로드 후 초기화
    initNavigation();
    initForms();
    initHistory();
    
    // 리포트 폼 초기화 추가
    setTimeout(() => {
      initReportForm();
    }, 100);
    
  } catch (error) {
    console.error('컴포넌트 로드 중 오류:', error);
  }
}

// DOM 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 로드 완료');
  
  // 초기에 모든 섹션 숨기기
  document.querySelectorAll('.main-section').forEach(section => {
    section.classList.remove('active');
    section.style.display = 'none';
  });
  
  // 홈 섹션만 표시
  const homeSection = document.getElementById('home-section');
  if (homeSection) {
    homeSection.classList.add('active');
    homeSection.style.display = 'block';
  }
  
  // 컴포넌트 로드
  loadComponents();
  
  // 전역 함수 등록
  window.goBack = () => location.hash = 'report-history';
  window.showSection = showReportSection;
});