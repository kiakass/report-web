// report-form.js - 리포트 생성 폼 관리

// 전역 변수
let targetCompanyList = [];
let compareCompanyList = [];

// 초기화 함수
export function initReportForm() {
  console.log('Report form initialized');
  
  // 날짜 입력 초기화
  setupDateInputs();
  
  // 이벤트 리스너 설정
  setupEventListeners();
  
  // 전역 함수 등록 (인라인 onclick을 위해)
  window.addTargetCompany = addTargetCompany;
  window.removeTargetCompany = removeTargetCompany;
  window.addCompareCompany = addCompareCompany;
  window.removeCompareCompany = removeCompareCompany;
  window.handleFileUpload = handleFileUpload;
}

// 날짜 입력 설정
function setupDateInputs() {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  const startDateEl = document.getElementById('startDate');
  const endDateEl = document.getElementById('endDate');
  
  if (startDateEl && endDateEl) {
    startDateEl.min = oneYearAgo.toISOString().split('T')[0];
    startDateEl.max = today.toISOString().split('T')[0];
    endDateEl.min = oneYearAgo.toISOString().split('T')[0];
    endDateEl.max = today.toISOString().split('T')[0];
  }
}

// 이벤트 리스너 설정
function setupEventListeners() {
  const form = document.getElementById('targetReportForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
}

// 대상기업 추가
function addTargetCompany() {
  const nameEl = document.getElementById('targetCompanyName');
  const urlEl = document.getElementById('targetCompanyUrl');
  
  if (nameEl && urlEl) {
    const name = nameEl.value.trim();
    const url = urlEl.value.trim();
    
    if (name && url && targetCompanyList.length < 1) {
      targetCompanyList.push({name, url});
      updateTargetCompanyList();
      nameEl.value = '';
      urlEl.value = '';
    } else if (targetCompanyList.length >= 1) {
      alert('대상기업은 1개만 등록 가능합니다.');
    }
  }
}

// 대상기업 리스트 업데이트
function updateTargetCompanyList() {
  const listEl = document.getElementById('targetCompanyList');
  if (!listEl) return;
  
  if (targetCompanyList.length === 0) {
    listEl.innerHTML = '<div class="empty-list">등록된 대상기업이 없습니다.</div>';
  } else {
    listEl.innerHTML = targetCompanyList.map((company, index) => `
      <div class="company-item">
        <span>${company.name} : ${company.url}</span>
        <button type="button" class="delete-button" onclick="removeTargetCompany(${index})">삭제</button>
      </div>
    `).join('');
  }
}

// 대상기업 삭제
function removeTargetCompany(index) {
  targetCompanyList = [];
  updateTargetCompanyList();
}

// 비교기업 추가
function addCompareCompany() {
  const nameEl = document.getElementById('compareCompanyName');
  const urlEl = document.getElementById('compareCompanyUrl');
  
  if (nameEl && urlEl) {
    const name = nameEl.value.trim();
    const url = urlEl.value.trim();
    
    if (name && url && compareCompanyList.length < 10) {
      compareCompanyList.push({name, url});
      updateCompareCompanyList();
      nameEl.value = '';
      urlEl.value = '';
    } else if (compareCompanyList.length >= 10) {
      alert('비교기업은 최대 10개까지 등록 가능합니다.');
    }
  }
}

// 비교기업 리스트 업데이트
function updateCompareCompanyList() {
  const listEl = document.getElementById('compareCompanyList');
  if (!listEl) return;
  
  if (compareCompanyList.length === 0) {
    listEl.innerHTML = '<div class="empty-list">등록된 비교기업이 없습니다.</div>';
  } else {
    listEl.innerHTML = compareCompanyList.map((company, index) => `
      <div class="company-item">
        <span>${company.name} : ${company.url}</span>
        <button type="button" class="delete-button" onclick="removeCompareCompany(${index})">삭제</button>
      </div>
    `).join('');
  }
}

// 비교기업 삭제
function removeCompareCompany(index) {
  compareCompanyList.splice(index, 1);
  updateCompareCompanyList();
}

// 파일 업로드 처리
function handleFileUpload(type, input) {
  const file = input.files[0];
  if (file) {
    if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
      const fileInputEl = document.getElementById(type + '-file');
      if (fileInputEl) {
        fileInputEl.value = file.name;
      }
    } else {
      alert('CSV 또는 XLSX 파일만 업로드 가능합니다.');
      input.value = '';
    }
  }
}

// 폼 제출 처리
function handleFormSubmit(e) {
  e.preventDefault();
  
  // 필수 입력값 검증
  const reportName = document.getElementById('reportName').value;
  if (!reportName) {
    alert('리포트명을 입력해주세요.');
    return;
  }
  
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  if (!startDate || !endDate) {
    alert('분석 기간을 선택해주세요.');
    return;
  }
  
  if (targetCompanyList.length === 0) {
    alert('대상기업을 등록해주세요.');
    return;
  }
  
  // 폼 데이터 수집
  const formData = {
    reportName: reportName,
    usagePlan: document.getElementById('usagePlan').value,
    period: {
      startDate: startDate,
      endDate: endDate
    },
    ageRange: {
      minAge: document.getElementById('minAge').value,
      maxAge: document.getElementById('maxAge').value
    },
    targetCompany: targetCompanyList,
    compareCompanies: compareCompanyList,
    additionalInfo: document.getElementById('additionalInfo').value,
    analysisItems: {
      demographics: document.getElementById('demographics').checked,
      timeSeries: document.getElementById('timeSeries').checked,
      visitedSites: document.getElementById('visitedSites').checked,
      crossVisit: document.getElementById('crossVisit').checked
    },
    uploadedFiles: {
      demographics: document.getElementById('demographics-file').value,
      timeSeries: document.getElementById('timeSeries-file').value,
      visitedSites: document.getElementById('visitedSites-file').value,
      crossVisit: document.getElementById('crossVisit-file').value
    }
  };
  
  console.log('리포트 생성 데이터:', formData);
  
  // TODO: API 호출 및 실제 리포트 생성 로직
  
  alert('리포트 생성이 완료되었습니다!');
  
  // 히스토리 페이지로 이동
  location.hash = 'report-history';
}