// navigation.js - SPA 메뉴/섹션 전환

export function initNavigation() {
  // 메뉴 클릭 이벤트 바인딩
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('[data-section]');
    if (link) {
      e.preventDefault();
      showSection(link.getAttribute('data-section'));
    }
  });

  // 해시 변경 시 섹션 전환
  window.addEventListener('hashchange', () => {
    const section = location.hash.replace('#', '') || 'home';
    showSection(section);
  });

  // 초기 진입 시
  const section = location.hash.replace('#', '') || 'home';
  showSection(section);
}

function showSection(sectionId) {
  document.querySelectorAll('.main-section').forEach(sec => {
    sec.classList.toggle('active', sec.id === sectionId + '-section');
  });
  // 메뉴 활성화
  document.querySelectorAll('.menu-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-section') === sectionId);
  });
  // 해시 갱신
  location.hash = sectionId;
} 