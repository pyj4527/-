document.addEventListener('DOMContentLoaded', () => {
  
  // 백엔드에서 받아올 데이터 예시 (사용자들이 새로 추가한 노래들 배열)
  const userSongs = [
    {
      title: "Music title",
      description: "music text",
      username: "user",
      time: "00:00"
    },
    {
      title: "Music title",
      description: "music text",
      username: "user",
      time: "00:00"
    },
    {
      title: "Music title",
      description: "music text",
      username: "user",
      time: "00:00"
    }
  ];

  const listContainer = document.getElementById('dynamic-list-container');

  // 3. 배열 데이터를 반복문 돌려서 HTML 카드 생성 후 집어넣기
  if (listContainer) {
    userSongs.forEach(song => {
      // 새로운 div 엘리먼트 카드 생성
      const card = document.createElement('div');
      card.className = 'music-card';

      // 시안에 맞춰 보라색 채워진(filled) 박스 레이아웃으로 문자열 조립
      card.innerHTML = `
        <div class="music-info-row">
          <img src="../images/music_ic.png">
          <div class="music-text-block">
            <h4 class="music-title">${song.title}</h4>
            <p class="music-desc text-short">${song.description}</p>
          </div>
        </div>
        <div class="music-meta-row">
          <span class="user-name">${song.username}</span>
          <span class="play-time">${song.time}</span>
          <div class="controls">
            <button class="play-btn">▶</button>
            <button class="more-btn">⋮</button>
          </div>
        </div>
      `;

      listContainer.appendChild(card);
    });
  }
});