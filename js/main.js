document.addEventListener('DOMContentLoaded', function() {
    // 목표 설정 폼 제출 처리
    const goalForm = document.getElementById('goal-form');
    goalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const subject = document.getElementById('subject').value;
        const targetDate = document.getElementById('target-date').value;
        console.log('목표 설정:', subject, targetDate);
        // 여기에 목표 저장 로직 추가
        alert('목표가 설정되었습니다!');
        goalForm.reset();
    });

    // 일일 학습 기록 폼 제출 처리
    const logForm = document.getElementById('log-form');
    logForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const studyDate = document.getElementById('study-date').value;
        const studyTime = document.getElementById('study-time').value;
        const notes = document.getElementById('notes').value;
        console.log('학습 기록:', studyDate, studyTime, notes);
        // 여기에 학습 기록 저장 로직 추가
        alert('학습 기록이 저장되었습니다!');
        logForm.reset();
    });

    // 간단한 진행 차트 표시 (예시)
    const progressChart = document.getElementById('progress-chart');
    progressChart.innerHTML = '<h3>학습 진행 상황</h3><p>여기에 차트가 표시됩니다.</p>';

    // 추천 사항 표시 (예시)
    const recommendations = document.getElementById('recommendations');
    recommendations.innerHTML = '<h3>학습 추천</h3><p>오늘은 수학 공부에 집중해보는 것이 어떨까요?</p>';
});