
document.addEventListener('DOMContentLoaded', function() {
    // 언어 선택 기능
    var languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            var language = this.value;
            if (language === 'en') {
                window.location.href = 'translated.html';
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    // 차트 생성
    var ctx = document.getElementById('progress-chart');
    if (ctx) {
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
                datasets: [{
                    label: '학습 시간 (시간)',
                    data: [12, 19, 3, 5, 2, 3],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // 목표 설정 폼
    var goalForm = document.getElementById('goal-form');
    if (goalForm) {
        goalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var subject = document.getElementById('subject').value;
            var targetDate = document.getElementById('target-date').value;
            // 여기에 목표 저장 로직 추가
            alert('목표가 설정되었습니다!');
        });
    }

    // 일일 학습 기록 폼
    var logForm = document.getElementById('log-form');
    if (logForm) {
        logForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var studyDate = document.getElementById('study-date').value;
            var studyTime = document.getElementById('study-time').value;
            var notes = document.getElementById('notes').value;
            // 여기에 학습 기록 저장 로직 추가
            alert('학습 기록이 저장되었습니다!');
        });
    }

    // 이메일 제출 버튼
    var submitButton = document.getElementById('submit');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            var email = document.getElementById('submit-email').value;
            var advice = document.getElementById('submit-advice').value;

            function validateEmail(email) {
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                return re.test(email);
            }

            if (email == '' || !validateEmail(email)) {
                alert("이메일이 유효하지 않습니다.");
                return;
            }

            var finalData = JSON.stringify({
                "id": getUVfromCookie(),
                "email": email,
                "advice": advice,
                "landingUrl": window.location.href,
                "referer": document.referrer,
                "timestamp": getTimeStamp(),
                "utm": new URLSearchParams(window.location.search).get("utm"),
                "device": /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
            });

            $.busyLoadFull("show");

            axios.get(`${API_URL}?action=insert&table=tab_final&data=${encodeURIComponent(finalData)}`)
                .then(response => {
                    console.log(response.data);
                    $.busyLoadFull("hide");
                    $.fn.simplePopup({ type: "html", htmlSelector: "#popup" });
                    $('#submit-email').val('');
                    $('#submit-advice').val('');
                })
                .catch(error => {
                    console.error('Error:', error);
                    $.busyLoadFull("hide");
                    alert("제출 중 오류가 발생했습니다. 다시 시도해 주세요.");
                });
        });
    }

    // 사용자 데이터 수집
    collectUserData();
});

function getIP() {
  return new Promise((resolve, reject) => {
    $.getJSON('https://api.ipify.org?format=json', function(data) {
      resolve(data.ip);
    }).fail(function() {
      resolve('unknown');
    });
  });
}

async function collectUserData() {
  try {
    const ip = await getIP();
    const data = JSON.stringify({
      id: getUVfromCookie(),
      landingUrl: window.location.href,
      ip: ip,
      referer: document.referrer,
      time_stamp: getTimeStamp(),
      utm: new URLSearchParams(window.location.search).get("utm"),
      device: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
    });
    
    axios.get(`${addrScript}?action=insert&table=visitors&data=${encodeURIComponent(data)}`)
      .then(response => {
        console.log('사용자 데이터 수집 성공:', response.data);
      })
      .catch(error => {
        console.error('사용자 데이터 수집 실패:', error);
      });
  } catch (error) {
    console.error('IP 주소 가져오기 실패:', error);
  }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', collectUserData);

// 쿠키 관련 함수들
function getCookieValue(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

function setCookieValue(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getUVfromCookie() {
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
    const existingHash = getCookieValue("user");
    if (!existingHash) {
        setCookieValue("user", hash, 180);
        return hash;
    } else {
        return existingHash;
    }
}

// 타임스탬프 생성 함수
function padValue(value) {
    return (value < 10) ? "0" + value : value;
}

function getTimeStamp() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${padValue(year)}-${padValue(month)}-${padValue(day)} ${padValue(hours)}:${padValue(minutes)}:${padValue(seconds)}`;
}

// 사용자 데이터 수집 함수
function collectUserData() {
    const data = JSON.stringify({
        id: getUVfromCookie(),
        landingUrl: window.location.href,
        ip: ip, // 기존 IP 스크립트 활용
        referer: document.referrer,
        time_stamp: getTimeStamp(),
        utm: new URLSearchParams(window.location.search).get("utm"),
        device: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
    });
    
    axios.get(`${API_URL}?action=insert&table=visitors&data=${encodeURIComponent(data)}`)
        .then(response => {
            console.log('사용자 데이터 수집 성공');
        })
        .catch(error => {
            console.error('사용자 데이터 수집 실패', error);
        });
}

// API URL 설정
const API_URL = 'https://script.google.com/macros/s/AKfycbxF-iVXC7psov68UrzPMl3hXpl9QnYHzbGj7qvvUcf3jIkAfuQqB3eFNmURZ5ynys8/exec';
