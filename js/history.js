// history.js - 히스토리 관리

// 샘플 히스토리 데이터
const sampleHistoryData = [
  {
    id: '4048',
    reportName: '하이얼 경쟁사 2024년 하반기 분석 리포트',
    targetCustomer: '하이얼',
    period: '2024-07-01 ~ 2024-12-31',
    createdDate: '2025-01-15',
    status: 'complete'
  },
  {
    id: '4047',
    reportName: '소형가전 시장 점유율 분석',
    targetCustomer: '쿠잉',
    period: '2024-06-01 ~ 2024-11-30',
    createdDate: '2024-12-20',
    status: 'complete'
  },
  {
    id: '4022',
    reportName: '연간통계리포트 2024년 12월 접속자 통계',
    targetCustomer: '모데비',
    period: '2024-01-01 ~ 2024-12-31',
    createdDate: '2024-11-30',
    status: 'complete'
  },
  {
    id: '4044',
    reportName: '샤오미 브랜드 고객 행동 패턴 분석',
    targetCustomer: '샤오미',
    period: '2024-09-01 ~ 2024-12-31',
    createdDate: '2025-01-10',
    status: 'complete'
  },
  {
    id: '4015',
    reportName: '연간통계리포트 2024 브랜드FIVE 접속자별 랭킹 분석',
    targetCustomer: '전체',
    period: '2024-01-01 ~ 2024-12-31',
    createdDate: '2024-11-29',
    status: 'complete'
  },
  {
    id: '3958',
    reportName: '연간통계리포트 접속자 통계 파일 생성 요청',
    targetCustomer: '전체',
    period: '2024-01-01 ~ 2024-10-31',
    createdDate: '2024-10-31',
    status: 'complete'
  }
];

// 히스토리 초기화
export function initHistory() {
  console.log('History 초기화');
  loadHistoryData();
}

// 히스토리 데이터 로드
function loadHistoryData() {
  const tableBody = document.getElementById('history-table-body');
  if (!tableBody) return;

  // 테이블 비우기
  tableBody.innerHTML = '';

  // 데이터 렌더링
  sampleHistoryData.forEach(item => {
    const row = createTableRow(item);
    tableBody.appendChild(row);
  });
}

// 테이블 행 생성
function createTableRow(data) {
  const tr = document.createElement('tr');
  tr.onclick = () => viewReport(data.id);
  
  const statusClass = data.status === 'complete' ? 'status-complete' : 'status-processing';
  const statusText = data.status === 'complete' ? '완료' : '진행중';
  
  tr.innerHTML = `
    <td>${data.id}</td>
    <td>${data.reportName}</td>
    <td>${data.targetCustomer}</td>
    <td>${data.period}</td>
    <td>${data.createdDate}</td>
    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
    <td><a href="#" class="report-link" onclick="viewReport('${data.id}'); event.stopPropagation(); return false;">조회</a></td>
  `;
  
  return tr;
}

// 리포트 조회
function viewReport(reportId) {
  console.log('리포트 조회:', reportId);
  // 리포트 상세 페이지로 이동
  location.hash = `view-report/${reportId}`;
}

// 전역 함수로 등록
window.viewReport = viewReport;