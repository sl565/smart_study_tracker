// API URL 설정
const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

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

// 차트 생성 함수
function createChart() {
    var ctx = document.getElementById('progress-chart').getContext('2d');
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

// 폼 제출 이벤트 리스너
document.getElementById('goal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const subject = document.getElementById('subject').value;
    const targetDate = document.getElementById('target-date').value;
    // 여기에 목표 설정 API 호출 로직 추가
    alert('목표가 설정되었습니다!');
});

document.getElementById('log-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const date = document.getElementById('study-date').value;
    const studyTime = document.getElementById('study-time').value;
    const notes = document.getElementById('notes').value;
    // 여기에 학습 기록 API 호출 로직 추가
    alert('학습 기록이 저장되었습니다!');
});

// 이메일 제출 버튼 클릭 이벤트
$("#submit").on("click", function () {
    const email = $("#submit-email").val();
    const advice = $("#submit-advice").val();

    function validateEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    if (email == '' || !validateEmail(email)) {
        alert("이메일이 유효하지 않아 알림을 드릴 수가 없습니다. ");
        return;
    }

    var finalData = JSON.stringify({
        "id": getUVfromCookie(),
        "email": email,
        "advice": advice,
        "landingUrl": window.location.href,
        "referrer": document.referrer,
        "timestamp": new Date().toISOString(),
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

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    createChart();
    // 여기에 초기 데이터 로드 등의 추가 로직
});