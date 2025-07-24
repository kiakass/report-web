// navigation.js - SPA 메뉴/섹션 전환
import { initHistory } from './history.js';

export function initNavigation() {
  console.log('Navigation 초기화 시작');
  
  // 메뉴 클릭 이벤트 바인딩
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('[data-section]');
    if (link) {
      e.preventDefault();
      const sectionId = link.getAttribute('data-section');
      console.log('섹션 전환:', sectionId);
      showSection(sectionId);
    }
  });

  // 해시 변경 시 섹션 전환
  window.addEventListener('hashchange', () => {
    const section = location.hash.replace('#', '') || 'home';
    console.log('해시 변경:', section);
    showSection(section);
  });

  // 초기 진입 시 해시 체크
  if (location.hash) {
    const section = location.hash.replace('#', '');
    showSection(section);
  }
}

function showSection(sectionId) {
  console.log('showSection 호출:', sectionId);
  
  // 모든 섹션 숨기기
  document.querySelectorAll('.main-section').forEach(sec => {
    sec.classList.remove('active');
    sec.style.display = 'none';
  });
  
  // 요청된 섹션 표시
  const targetSection = document.getElementById(sectionId + '-section');
  if (targetSection) {
    targetSection.classList.add('active');
    targetSection.style.display = 'block';
    console.log('섹션 표시:', sectionId);
    
    // 히스토리 섹션이면 데이터 다시 로드
    if (sectionId === 'report-history') {
      initHistory();
    }
  } else {
    console.error('섹션을 찾을 수 없습니다:', sectionId);
  }
  
  // 메뉴 활성화 상태 업데이트
  document.querySelectorAll('.menu-link').forEach(link => {
    const linkSection = link.getAttribute('data-section');
    link.classList.toggle('active', linkSection === sectionId);
  });
  
  // 해시 갱신 (중복 방지)
  if (location.hash.replace('#', '') !== sectionId) {
    location.hash = sectionId;
  }
}