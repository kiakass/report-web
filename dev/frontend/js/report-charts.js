// report-charts.js - 리포트 차트 초기화 및 관리

// 차트 인스턴스 저장
let chartInstances = {};

// 섹션 전환 함수
export function showReportSection(sectionId, element) {
  console.log('리포트 섹션 전환:', sectionId);
  
  // 모든 섹션 숨기기
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => section.classList.remove('active'));
  
  // 모든 탭 비활성화
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => tab.classList.remove('active'));
  
  // 선택된 섹션 표시
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // 클릭된 탭 활성화
  if (element) {
    element.classList.add('active');
  }
  
  // 차트 초기화
  setTimeout(() => {
    if (sectionId === 'demographics') {
      initDemographicsCharts();
    } else if (sectionId === 'trends') {
      initTrendsChart();
    } else if (sectionId === 'behavior') {
      initBehaviorCharts();
    }
  }, 100);
}

// 인구통계학적 분석 차트
function initDemographicsCharts() {
  console.log('인구통계 차트 초기화');
  
  // 1. 방문자 수 비교 차트
  const visitorsCtx = document.getElementById('visitorsChart');
  if (visitorsCtx) {
    // 기존 차트 제거
    if (chartInstances.visitors) {
      chartInstances.visitors.destroy();
    }
    
    chartInstances.visitors = new Chart(visitorsCtx, {
      type: 'bar',
      data: {
        labels: ['Cuckoo', 'LGE', 'Himart', 'Xiaomi', 'Carrier', 'Samsung', 'Haier', 'Cooing', 'Modevi'],
        datasets: [{
          label: '3개월 MAU',
          data: [553986, 444532, 242416, 16521, 3687, 3082, 1306, 899, 176],
          backgroundColor: function(context) {
            return context.dataIndex === 6 ? '#dc3545' : '#6c757d';
          },
          borderColor: function(context) {
            return context.dataIndex === 6 ? '#dc3545' : '#6c757d';
          },
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
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
    if (chartInstances.age) {
      chartInstances.age.destroy();
    }
    
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
          data: [30, 25, 28, 25, 25, 28, 25, 25, 28],
          backgroundColor: '#9b59b6'
        }, {
          label: '60대+',
          data: [18, 15, 20, 10, 10, 12, 0, 4, 10],
          backgroundColor: '#e74c3c'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
    if (chartInstances.gender) {
      chartInstances.gender.destroy();
    }
    
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

  // 4. 지역별 분포 차트
  const regionCtx = document.getElementById('regionChart');
  if (regionCtx) {
    if (chartInstances.region) {
      chartInstances.region.destroy();
    }
    
    chartInstances.region = new Chart(regionCtx, {
      type: 'bar',
      data: {
        labels: ['서울', '경기', '부산', '대구', '인천'],
        datasets: [{
          label: 'Haier',
          data: [25, 20, 15, 12, 10],
          backgroundColor: '#dc3545'
        }, {
          label: 'Cuckoo',
          data: [22, 18, 17, 15, 12],
          backgroundColor: '#6c757d'
        }, {
          label: 'LGE',
          data: [24, 19, 16, 14, 11],
          backgroundColor: '#adb5bd'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { 
            beginAtZero: true,
            max: 30,
            grid: { color: '#e9ecef' },
            ticks: {
              color: '#6c757d',
              callback: function(value) {
                return value + '%';
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

  // 5. 고객특성지수 차트
  const customerIndexCtx = document.getElementById('customerIndexChart');
  if (customerIndexCtx) {
    if (chartInstances.customerIndex) {
      chartInstances.customerIndex.destroy();
    }
    
    const labels = ['홈케어서비스', '블로그활동', '이사관심', '구매력', '인테리어관심', '렌탈관심', '주방용품가전'];
    const companies = ['Haier', 'Xiaomi', 'Cooing', 'Carrier', 'Cuckoo'];
    
    const data = [
      [10, 6.5, 5.0, 1.0, 3.8, 6.0, 6.2], // Haier
      [0, 2.3, 1.5, 10, 0.6, 2.4, 3.5],   // Xiaomi
      [10, 7.1, 2.8, 1.8, 4.4, 2.3, 8.5], // Cooing
      [1, 5.9, 2.2, 1.0, 1.1, 8.0, 6.9],  // Carrier
      [3, 5.7, 2.1, 2.2, 3.4, 2.4, 5.3]   // Cuckoo
    ];

    chartInstances.customerIndex = new Chart(customerIndexCtx, {
      type: 'bar',
      data: {
        labels: companies,
        datasets: labels.map((label, i) => ({
          label: label,
          data: companies.map((_, j) => data[j][i]),
          backgroundColor: getHeatmapColor(i)
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#6c757d' }
          },
          y: {
            grid: { color: '#e9ecef' },
            ticks: { color: '#6c757d' }
          }
        }
      }
    });
  }

  // 6. 가구세그먼트 차트
  const householdCtx = document.getElementById('householdChart');
  if (householdCtx) {
    if (chartInstances.household) {
      chartInstances.household.destroy();
    }
    
    chartInstances.household = new Chart(householdCtx, {
      type: 'bar',
      data: {
        labels: ['1인가구', '중년 1인가구', '중년 자녀동거', '키즈맘 초등생', '시니어'],
        datasets: [{
          label: 'Haier',
          data: [17.8, 5.5, 48.5, 14.2, 8.0],
          backgroundColor: '#dc3545'
        }, {
          label: 'Cuckoo',
          data: [10.0, 3.0, 43.0, 12.0, 14.0],
          backgroundColor: '#17a2b8'
        }, {
          label: 'Xiaomi',
          data: [17.0, 4.0, 35.0, 18.0, 6.0],
          backgroundColor: '#28a745'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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

// 시계열 분석 차트
function initTrendsChart() {
  console.log('시계열 차트 초기화');
  
  // 1. 월별 접속자 수 추이 차트
  const trendsCtx = document.getElementById('trendsChart');
  if (trendsCtx) {
    if (chartInstances.trends) {
      chartInstances.trends.destroy();
    }
    
    chartInstances.trends = new Chart(trendsCtx, {
      type: 'line',
      data: {
        labels: ['2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'],
        datasets: [{
          label: 'Haier',
          data: [180, 190, 185, 200, 220, 210],
          borderColor: '#dc3545',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
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
            ticks: { color: '#6c757d' },
            title: {
              display: true,
              text: '기간',
              color: '#6c757d'
            }
          }
        }
      }
    });
  }

  // 2. 시장 점유율 변화 차트
  const marketShareCtx = document.getElementById('marketShareChart');
  if (marketShareCtx) {
    if (chartInstances.marketShare) {
      chartInstances.marketShare.destroy();
    }
    
    chartInstances.marketShare = new Chart(marketShareCtx, {
      type: 'line',
      data: {
        labels: ['2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'],
        datasets: [{
          label: 'Cuckoo',
          data: [42.5, 43.2, 42.8, 43.5, 44.1, 43.8],
          borderColor: '#495057',
          backgroundColor: 'rgba(73, 80, 87, 0.1)',
          borderWidth: 2,
          tension: 0.4
        }, {
          label: 'LGE',
          data: [35.2, 35.8, 35.5, 34.9, 35.3, 36.5],
          borderColor: '#6c757d',
          backgroundColor: 'rgba(108, 117, 125, 0.1)',
          borderWidth: 2,
          tension: 0.4
        }, {
          label: 'Himart',
          data: [18.5, 17.8, 17.3, 16.9, 16.2, 15.7],
          borderColor: '#adb5bd',
          backgroundColor: 'rgba(173, 181, 189, 0.1)',
          borderWidth: 2,
          tension: 0.4
        }, {
          label: 'Haier',
          data: [0.15, 0.16, 0.15, 0.17, 0.18, 0.17],
          borderColor: '#dc3545',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
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
  console.log('행동 분석 차트 초기화');
  
  // 1. 사이트 방문 패턴 히트맵
  const siteVisitCtx = document.getElementById('siteVisitChart');
  if (siteVisitCtx) {
    if (chartInstances.siteVisit) {
      chartInstances.siteVisit.destroy();
    }
    
    chartInstances.siteVisit = new Chart(siteVisitCtx, {
      type: 'bar',
      data: {
        labels: ['쿠팡', '옥션', '오늘의집', 'Netflix', '배달의민족', '디시트렌드', '엘포인트'],
        datasets: [{
          label: 'Haier',
          data: [0.98, 0.56, 0.47, 0.35, 0.28, 0.52, 0.31],
          backgroundColor: '#dc3545'
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

  // 2. 교차방문율 차트
  const crossVisitCtx = document.getElementById('crossVisitChart');
  if (crossVisitCtx) {
    if (chartInstances.crossVisit) {
      chartInstances.crossVisit.destroy();
    }
    
    chartInstances.crossVisit = new Chart(crossVisitCtx, {
      type: 'bar',
      data: {
        labels: ['Haier → Cuckoo', 'Haier → Himart', 'Haier → LGE', 'Haier → Carrier', 'Haier → Xiaomi'],
        datasets: [{
          label: '교차방문율 (%)',
          data: [12.5, 11.4, 5.6, 3.3, 2.5],
          backgroundColor: [
            '#dc3545',
            '#dc3545',
            '#6c757d',
            '#6c757d',
            '#6c757d'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 15,
            grid: { color: '#e9ecef' },
            ticks: { color: '#6c757d' },
            title: {
              display: true,
              text: '교차방문율 (%)',
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

  // 3. 성별/연령별 유입/유출 흐름
  const flowCtx = document.getElementById('flowChart');
  if (flowCtx) {
    if (chartInstances.flow) {
      chartInstances.flow.destroy();
    }
    
    chartInstances.flow = new Chart(flowCtx, {
      type: 'bar',
      data: {
        labels: ['여성 30대 Himart→Haier', '여성 30대 LGE→Haier', '여성 30대 Cuckoo→Haier', '남성 30대 Haier→Cooing', '여성 50대 LGE→Haier', '여성 50대 Haier→Samsung'],
        datasets: [{
          label: '유입/유출율',
          data: [8.5, 6.2, 5.1, -4.8, 5.1, -2.3],
          backgroundColor: function(context) {
            const value = context.dataset.data[context.dataIndex];
            return value > 0 ? '#495057' : '#dc3545';
          }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: '#e9ecef' },
            ticks: { color: '#6c757d' },
            title: {
              display: true,
              text: '교차방문율 (%) - 유입(+) / 유출(-)',
              color: '#6c757d'
            }
          },
          y: {
            grid: { display: false },
            ticks: { 
              color: '#6c757d',
              font: {
                size: 10
              }
            }
          }
        }
      }
    });
  }
}

// 히트맵 색상 생성 함수
function getHeatmapColor(index) {
  const colors = ['#003f5c', '#2f4b7c', '#665191', '#a05195', '#d45087', '#f95d6a', '#ff7c43', '#ffa600'];
  return colors[index % colors.length];
}

// 리포트 뷰 초기화
export function initReportView() {
  console.log('리포트 뷰 초기화');
  
  // 탭 클릭 이벤트 바인딩
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const sectionId = this.textContent.trim();
      let targetId = '';
      
      switch(sectionId) {
        case '개요':
          targetId = 'overview';
          break;
        case '인구통계학적 분석':
          targetId = 'demographics';
          break;
        case '시계열 분석':
          targetId = 'trends';
          break;
        case '고객 행동 분석':
          targetId = 'behavior';
          break;
      }
      
      if (targetId) {
        showReportSection(targetId, this);
      }
    });
  });
  
  // 초기 개요 섹션 표시
  showReportSection('overview', document.querySelector('.nav-tab.active'));
}