document.addEventListener('DOMContentLoaded', () => {
  
  // 1. 음악 카테고리 박스
  const musicBox = document.getElementById('box-music-category');
  if (musicBox) {
    musicBox.addEventListener('click', () => {
      window.location.href = ''; 
    });
  }

  // 2. 메인 오디오 플레이어 
  const audioPlayerBox = document.getElementById('box-audio-player');
  if (audioPlayerBox) {
    audioPlayerBox.addEventListener('click', () => {
      window.location.href = '';
    });
  }

  // 3. AI 추천 코스 
  const aiCourseBox = document.getElementById('box-ai-course');
  if (aiCourseBox) {
    aiCourseBox.addEventListener('click', () => {
      window.location.href = '../map/map.html';
    });
  }

  // 4. 경복궁 박스
  const gbgBox = document.getElementById('box-place-gbg');
  if (gbgBox) {
    gbgBox.addEventListener('click', () => {
      window.location.href = '';
    });
  }

  // 5. 북촌 한옥 마을 박스 
  const bukchonBox = document.getElementById('box-place-bukchon');
  if (bukchonBox) {
    bukchonBox.addEventListener('click', () => {
      window.location.href = 'place_bukchon.html';
    });
  }

  // 6. 하단 지도 
  const mapTabBox = document.getElementById('box-nav-map');
  if (mapTabBox) {
    mapTabBox.addEventListener('click', () => {
      window.location.href = '../map/map.html';
    });
  }

  const mypageTapBox = document.getElementById('box-nav-mypage');
    if (mypageTapBox) {
        mypageTapBox.addEventListener('click', () => {
            window.location.href = '../mypage/mypage.html';
        });
    }

});