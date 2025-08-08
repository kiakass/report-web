// forms.js - 폼 입력, 검증, 제출 처리

export function initForms() {
  const form = document.getElementById('targetReportForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // TODO: 폼 데이터 수집 및 검증
      alert('리포트 생성이 완료되었습니다!');
    });
  }
} 