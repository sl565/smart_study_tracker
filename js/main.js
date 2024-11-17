const addrScript = 'https://script.google.com/macros/s/AKfycbxcFTg0Vfc4_12Bd5rB620PwNXs5Rj2ipSwTWRt4sCZd6tBvvpACVfo5XOll95aQWtMyQ/exec';

// 쿠키에서 값을 가져오는 함수
function getCookieValue(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

// 쿠키에 값을 저장하는 함수
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

function getIP(callback) {
    $.getJSON('https://jsonip.com?format=jsonp&callback=?', function(data) {
        callback(data.ip);
    }).fail(function() {
        callback('unknown');
    });
}

function collectUserData() {
    getIP(function(ip) {
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
    });
}

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

$(document).ready(function() {
    collectUserData();

    $("#submit").on("click", function () {
        const email = $("#submit-email").val();
        const advice = $("#submit-advice").val();

        if (email == '' || !validateEmail(email)) {
            alert("이메일이 유효하지 않습니다.");
            return;
        }

        var finalData = JSON.stringify({
            "id": getUVfromCookie(),
            "email": email,
            "advice": advice
        });

        $.busyLoadFull("show");

        axios.get(`${addrScript}?action=insert&table=tab_final&data=${encodeURIComponent(finalData)}`)
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
});