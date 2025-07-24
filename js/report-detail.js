// report-detail.js - 리포트 상세 페이지 관리
import { initReportView, showReportSection } from './report-charts.js';

// 차트 인스턴스 저장
let chartInstances = {};

// 리포트 데이터 (실제로는 서버에서 가져와야 함)
const reportData = {
  '4048': {
    title: '하이얼 경쟁사 2024년 하반기 분석 리포트',
    period: '2024년 7월 ~ 2024년 12월',
    subtitle: '국내 가전시장 경쟁 분석',
    overview: {
      mau: '1,306',
      brands: '9개사',
      period: '6개월',
      categories: '3개'
    },
    insights: [
      '하이얼은 30-40대 젊은 중년 소비자층을 중심으로 방문하는 경향',
      '1인가구 비중 17.8%로 쿠쿠·LG 대비 7-8%p 높은 수준',
      '홈케어서비스 관심지수 최고치(10점) 기록',
      '2024년 10-11월 상승세를 보이며 계절성 반응 탄력성 확인'
    ]
  }
};

// 리포트 초기화
export function initReportDetail(reportId) {
  console.log('리포트 상세 초기화:', reportId);
  
  const data = reportData[reportId] || reportData['4048']; // 기본값은 하이얼 리포트
  
  // 리포트 제목 업데이트
  const titleElement = document.querySelector('.dashboard-title');
  if (titleElement) {
    titleElement.textContent = data.title;
  }
  
  const subtitleElement = document.querySelector('.dashboard-subtitle');
  if (subtitleElement) {
    subtitleElement.textContent = `${data.period} | ${data.subtitle}`;
  }
  
  // 탭 이벤트 바인딩
  bindTabEvents();
  
  // 차트 초기화 (첫 번째 탭)
  setTimeout(() => {
    initCharts('overview');
  }, 100);
}

// 탭 이벤트 바인딩
function bindTabEvents() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      showTab(tabName);
    });
  });
}

// 탭 전환
function showTab(tabName) {
  console.log('탭 전환:', tabName);
  
  // 모든 탭과 섹션 비활성화
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // 선택된 탭과 섹션 활성화
  const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
  const selectedSection = document.getElementById(tabName);
  
  if (selectedTab) selectedTab.classList.add('active');
  if (selectedSection) selectedSection.classList.add('active');
  
  // 해당 탭의 차트 초기화
  setTimeout(() => {
    initCharts(tabName);
  }, 100);
}

// 차트 초기화
function initCharts(tabName) {
  console.log('차트 초기화:', tabName);
  
  // 기존 차트 삭제
  Object.keys(chartInstances).forEach(key => {
    if (chartInstances[key]) {
      chartInstances[key].destroy();
      delete chartInstances[key];
    }
  });
  
  switch(tabName) {
    case 'demographics':
      initDemographicsCharts();
      break;
    case 'trends':
      initTrendsCharts();
      break;
    case 'behavior':
      initBehaviorCharts();
      break;
  }
}

// 인구통계학적 분석 차트
function initDemographicsCharts() {
  // 1. 방문자 수 비교 차트
  const visitorsCtx = document.getElementById('visitorsChart');
  if (visitorsCtx) {
    chartInstances.visitors = new Chart(visitorsCtx, {
      type: 'bar',
      data: {
        labels: ['Cuckoo', 'LGE', 'Himart', 'Xiaomi', 'Carrier', 'Samsung', 'Haier', 'Cooing', 'Modevi'],
        datasets: [{
          label: '3개월 MAU',
          data: [553986, 444532, 242416, 16521, 3687, 3082, 1306, 899, 176],
          backgroundColor: function(context) {
            return context.dataIndex === 6 ? '#A50034' : '#6c757d';
          },
          borderColor: function(context) {
            return context.dataIndex === 6 ? '#A50034' : '#6c757d';
          },
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: false
          }
        },
        scales: {
          y: { 
            beginAtZero: true,
            grid: { color: '#e9ecef' },
            ticks: { 
              color: '#6c757d',
              callback: function(value) {
                return value.toLocaleString();
              }
            }
          },
          x: { 
            grid: { display: false },
            ticks: { color: '#6c757d' }
          }
        }
      }
    });
  }
  
  // 2. 연령대 분포 차트
  const ageCtx = document.getElementById('ageChart');
  if (ageCtx) {
    chartInstances.age = new Chart(ageCtx, {
      type: 'bar',
      data: {
        labels: ['Cuckoo', 'LGE', 'Himart', 'Xiaomi', 'Carrier', 'Samsung', 'Haier', 'Cooing', 'Modevi'],
        datasets: [{
          label: '20대',
          data: [12, 15, 12, 20, 15, 15, 15, 18, 15],
          backgroundColor: '#3498db'
        }, {
          label: '30대',
          data: [15, 20, 18, 25, 22, 20, 28, 25, 22],
          backgroundColor: '#2ecc71'
        }, {
          label: '40대',
          data: [25, 25, 22, 20, 28, 25, 32, 28, 25],
          backgroundColor: '#f39c12'
        }, {
          label: '50대',
          data: [30, 25, 28, 25, 25, 28, 20, 25, 28],
          backgroundColor: '#9b59b6'
        }, {
          label: '60대+',
          data: [18, 15, 20, 10, 10, 12, 5, 4, 10],
          backgroundColor: '#e74c3c'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false
          },
          legend: {
            position: 'right'
          }
        },
        scales: {
          x: { 
            stacked: true,
            grid: { display: false },
            ticks: { color: '#6c757d' }
          },
          y: { 
            stacked: true,
            max: 100,
            grid: { color: '#e9ecef' },
            ticks: {
              color: '#6c757d',
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });
  }
  
  // 3. 성별 분포 차트
  const genderCtx = document.getElementById('genderChart');
  if (genderCtx) {
    chartInstances.gender = new Chart(genderCtx, {
      type: 'bar',
      data: {
        labels: ['Cuckoo', 'LGE', 'Himart', 'Xiaomi', 'Carrier', 'Samsung', 'Haier', 'Cooing', 'Modevi'],
        datasets: [{
          label: '여성',
          data: [54, 55, 62, 25, 40, 35, 38, 35, 35],
          backgroundColor: '#e91e63'
        }, {
          label: '남성',
          data: [46, 45, 38, 75, 60, 65, 62, 65, 65],
          backgroundColor: '#2196f3'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          title: {
            display: false
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          x: { 
            stacked: true,
            max: 100,
            grid: { color: '#e9ecef' },
            ticks: {
              color: '#6c757d',
              callback: function(value) {
                return value + '%';
              }
            }
          },
          y: { 
            stacked: true,
            grid: { display: false },
            ticks: { color: '#6c757d' }
          }
        }
      }
    });
  }
}

// 시계열 분석 차트
function initTrendsCharts() {
  // 1. 월별 접속자 수 추이
  const trendsCtx = document.getElementById('trendsChart');
  if (trendsCtx) {
    chartInstances.trends = new Chart(trendsCtx, {
      type: 'line',
      data: {
        labels: ['2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'],
        datasets: [{
          label: 'Haier',
          data: [180, 190, 185, 200, 220, 210],
          borderColor: '#A50034',
          backgroundColor: 'rgba(165, 0, 52, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }, {
          label: 'Cooing',
          data: [170, 175, 180, 175, 172, 170],
          borderColor: '#6c757d',
          backgroundColor: 'rgba(108, 117, 125, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }, {
          label: 'Modevi',
          data: [85, 90, 150, 110, 95, 90],
          borderColor: '#adb5bd',
          backgroundColor: 'rgba(173, 181, 189, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#e9ecef' },
            ticks: { color: '#6c757d' },
            title: {
              display: true,
              text: 'MAU',
              color: '#6c757d'
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#6c757d' }
          }
        }
      }
    });
  }
  
  // 2. 시장 점유율 변화
  const shareCtx = document.getElementById('shareChart');
  if (shareCtx) {
    chartInstances.share = new Chart(shareCtx, {
      type: 'line',
      data: {
        labels: ['2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'],
        datasets: [{
          label: 'Cuckoo',
          data: [42.5, 43.2, 42.8, 43.5, 44.1, 43.8],
          borderColor: '#495057',
          borderWidth: 2,
          tension: 0.4
        }, {
          label: 'LGE',
          data: [35.2, 35.8, 35.5, 34.9, 35.3, 36.5],
          borderColor: '#6c757d',
          borderWidth: 2,
          tension: 0.4
        }, {
          label: 'Himart',
          data: [18.5, 17.8, 17.3, 16.9, 16.2, 15.7],
          borderColor: '#adb5bd',
          borderWidth: 2,
          tension: 0.4
        }, {
          label: 'Haier',
          data: [0.15, 0.16, 0.15, 0.17, 0.18, 0.17],
          borderColor: '#A50034',
          borderWidth: 3,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 50,
            grid: { color: '#e9ecef' },
            ticks: { 
              color: '#6c757d',
              callback: function(value) {
                return value + '%';
              }
            },
            title: {
              display: true,
              text: '점유율 (%)',
              color: '#6c757d'
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#6c757d' }
          }
        }
      }
    });
  }
}

// 고객 행동 분석 차트
function initBehaviorCharts() {
  // 1. 사이트 방문 패턴 히트맵 (막대 차트로 대체)
  const siteVisitCtx = document.getElementById('siteVisitChart');
  if (siteVisitCtx) {
    chartInstances.siteVisit = new Chart(siteVisitCtx, {
      type: 'bar',
      data: {
        labels: ['쿠팡', '옥션', '오늘의집', 'Netflix', '배달의민족', '디시트렌드', '엘포인트'],
        datasets: [{
          label: 'Haier',
          data: [0.98, 0.56, 0.47, 0.35, 0.28, 0.52, 0.31],
          backgroundColor: '#A50034'
        }, {
          label: 'Cooing',
          data: [1.00, 0.59, 0.60, 0.74, 0.22, 0.31, 0.28],
          backgroundColor: '#6c757d'
        }, {
          label: 'Xiaomi',
          data: [1.00, 0.35, 0.25, 0.73, 0.69, 0.18, 0.42],
          backgroundColor: '#adb5bd'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 1.2,
            grid: { color: '#e9ecef' },
            ticks: { 
              color: '#6c757d',
              callback: function(value) {
                return (value * 100).toFixed(0) + '%';
              }
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#6c757d' }
          }
        }
      }
    });
  }
  
  // 2. 교차방문 흐름
  const flowCtx = document.getElementById('flowChart');
  if (flowCtx) {
    chartInstances.flow = new Chart(flowCtx, {
      type: 'bar',
      data: {
        labels: ['Himart→Haier', 'LGE→Haier', 'Cuckoo→Haier', 'Haier→Cooing', 'Haier→Cuckoo', 'Haier→Samsung'],
        datasets: [{
          label: '유입/유출율',
          data: [8.5, 6.2, 5.1, -4.8, -12.5, -2.3],
          backgroundColor: function(context) {
            const value = context.dataset.data[context.dataIndex];
            return value > 0 ? '#2196f3' : '#f44336';
          }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          title: {
            display: false
          }
        },
        scales: {
          x: {
            grid: { color: '#e9ecef' },
            ticks: { 
              color: '#6c757d',
              callback: function(value) {
                return value + '%';
              }
            },
            title: {
              display: true,
              text: '교차방문율 (%) - 유입(+) / 유출(-)',
              color: '#6c757d'
            }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#6c757d' }
          }
        }
      }
    });
  }
}

// 뒤로가기 버튼
export function goBackToHistory() {
  location.hash = 'report-history';
}