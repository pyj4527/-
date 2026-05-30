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

  if (listContainer) {
    userSongs.forEach(song => {
      const card = document.createElement('div');
      card.className = 'music-card';

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
            
            <div class="more-container">
              <button class="more-btn">⋮</button>
              <div class="dropdown-menu hidden">
                <button class="edit-btn">수정</button>
                <button class="delete-btn">삭제</button>
              </div>
            </div>

          </div>
        </div>
      `;

      listContainer.appendChild(card);
    });
  }


  const mainContent = document.querySelector(".main-content");

  if (mainContent) {
    mainContent.addEventListener("click", (e) => {
      
      if (e.target.classList.contains("more-btn")) {
        e.stopPropagation();
        const currentDropdown = e.target.nextElementSibling;
  
        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
          if (menu !== currentDropdown) menu.classList.add("hidden");
        });
        currentDropdown.classList.toggle("hidden");
      }


      if (e.target.classList.contains("edit-btn")) {

        const targetCard = e.target.closest(".top-highlight") || e.target.closest(".music-card");
        const titleElement = targetCard.querySelector(".music-title");
        const descElement = targetCard.querySelector(".music-desc");

        const newTitle = prompt("변경할 노래 제목을 입력하세요:", titleElement.textContent.trim());
        if (newTitle === null) return; 
        
        const newDesc = prompt("변경할 곡 설명을 입력하세요:", descElement.textContent.trim());
        if (newDesc === null) return;

        if (newTitle.trim() !== "") titleElement.textContent = newTitle;
        if (newDesc.trim() !== "") descElement.textContent = newDesc;

        e.target.closest(".dropdown-menu").classList.add("hidden");
      }

  
      if (e.target.classList.contains("delete-btn")) {
        if (confirm("정말 이 곡을 삭제하시겠습니까?")) {
          const targetCard = e.target.closest(".top-highlight") || e.target.closest(".music-card");
          
          targetCard.style.transition = "all 0.3s ease";
          targetCard.style.opacity = "0";
          targetCard.style.transform = "scale(0.9)";
          
          setTimeout(() => {
            targetCard.remove(); 
          }, 300);
        }
      }
    });
  }

  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      menu.classList.add("hidden");
    });
  });

});