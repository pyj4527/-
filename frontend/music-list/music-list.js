document.addEventListener("DOMContentLoaded", () => {
  const data = window.SeoulodyData;
  const params = new URLSearchParams(window.location.search);
  const placeId = params.get("placeId") || "gyeongbokgung";
  const place = data?.getPlaceById(placeId);
  const storageKey = `seonyulSong:${placeId}`;
  const legacyStorageKey = `seonyulSongName:${placeId}`;
  const backButton = document.querySelector(".back-btn");
  const listContainer = document.getElementById("dynamic-list-container");
  const mainContent = document.querySelector(".main-content");

  const rawSavedSong = JSON.parse(localStorage.getItem(storageKey) || "null");
  const legacySongName = localStorage.getItem(legacyStorageKey);
  const savedSongBelongsHere = !rawSavedSong?.placeId || rawSavedSong.placeId === place?.id;
  const savedSongLooksLikeAnotherPlace = data.places.some((item) => {
    return item.id !== place?.id && rawSavedSong?.title === `${item.nameEn}_STYLE`;
  });
  const legacyLooksLikeAnotherPlace = data.places.some((item) => {
    return item.id !== place?.id && legacySongName === `${item.nameEn}_STYLE`;
  });
  const savedSong =
    savedSongBelongsHere && !savedSongLooksLikeAnotherPlace && rawSavedSong
      ? rawSavedSong
      : legacySongName && !legacyLooksLikeAnotherPlace
        ? {
            title: legacySongName,
            description: "",
            username: "HGD",
            time: "1:43",
          }
        : null;

  if (place) {
    document.title = `서울의 선율 - ${place.name}`;
    const placeNameText = document.querySelector("#placeNameText");
    if (placeNameText) {
      placeNameText.textContent = place.name;
    }
  }

  function setText(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = text;
    }
  }

  setText("#mySongTitle", savedSong?.title || "파일을 올려주세요");
  setText(
    "#mySongDesc",
    savedSong?.description || "노래 추가하기 화면에서 나만의 SEON-YUL을 등록해보세요."
  );
  setText("#mySongUser", savedSong?.username || "HGD");
  setText("#mySongTime", savedSong?.time || "00:00");

  const peopleSongsByPlace = {
    gyeongbokgung: {
      title: "GYEONGBOKGUNG_STYLE",
      description:
        "싸이의 '강남스타일'이 있다면 경복궁에 '경복궁스타일'이 있습니다. 신나는 음악과 함께 경복궁을 즐겨보세요!",
      username: "HGD",
      time: "1:43",
    },
    namsan: {
      title: "남산의 밤",
      description:
        "서울의 야경과 남산타워의 로맨틱한 분위기를 담은 선율입니다.",
      username: "seoulmate",
      time: "2:10",
    },
    cheonggyecheon: {
      title: "청계천의 물결",
      description:
        "도심 속 물소리와 산책길의 여유를 담은 청계천의 선율입니다.",
      username: "streamer",
      time: "1:58",
    },
    1: {
      title: "GYEONGBOKGUNG_STYLE",
      description:
        "싸이의 '강남스타일'이 있다면 경복궁에 '경복궁스타일'이 있습니다. 신나는 음악과 함께 경복궁을 즐겨보세요!",
      username: "HGD",
      time: "1:43",
    },
    2: {
      title: "남산의 밤",
      description:
        "서울의 야경과 남산타워의 로맨틱한 분위기를 담은 선율입니다.",
      username: "seoulmate",
      time: "2:10",
    },
    3: {
      title: "청계천의 물결",
      description:
        "도심 속 물소리와 산책길의 여유를 담은 청계천의 선율입니다.",
      username: "streamer",
      time: "1:58",
    },
  };

  const primaryPeopleSong =
    peopleSongsByPlace[placeId] ||
    peopleSongsByPlace[place?.id] ||
    {
      title: place?.track?.title || "SEON-YUL",
      description: place?.track?.description || "이 장소에 어울리는 선율입니다.",
      username: "kodong",
      time: "00:00",
    };

  setText("#peoplePrimaryTitle", primaryPeopleSong.title);
  setText("#peoplePrimaryDesc", primaryPeopleSong.description);
  setText("#peoplePrimaryUser", primaryPeopleSong.username);
  setText("#peoplePrimaryTime", primaryPeopleSong.time);

  backButton?.addEventListener("click", () => {
    window.location.href = `../player.html?placeId=${encodeURIComponent(placeId)}`;
  });

  const userSongs = [];

  function songCardTemplate(song) {
    return `
      <div class="music-info-row">
        <img class="music-icon ${song.icon === "music 1.png" ? "filled" : "outline"}" src="../images/icon/${song.icon}" alt="">
        <div class="music-text-block">
          <h4 class="music-title">${song.title}</h4>
          <p class="music-desc text-short">${song.description}</p>
        </div>
      </div>
      <div class="music-meta-row">
        <span class="user-name">${song.username}</span>
        <span class="play-time">${song.time}</span>
        <div class="controls">
          <button class="play-btn" type="button" aria-label="재생">▶</button>
          <div class="more-container">
            <button class="more-btn" type="button" aria-label="더보기">⋮</button>
            <div class="dropdown-menu hidden">
              <button class="edit-btn" type="button">수정</button>
              <button class="delete-btn" type="button">삭제</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  userSongs.forEach((song) => {
    const card = document.createElement("div");
    card.className = "music-card";
    card.innerHTML = songCardTemplate(song);
    listContainer?.appendChild(card);
  });

  mainContent?.addEventListener("click", (event) => {
    const moreButton = event.target.closest(".more-btn");

    if (moreButton) {
      event.stopPropagation();
      const currentDropdown = moreButton.nextElementSibling;

      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        if (menu !== currentDropdown) {
          menu.classList.add("hidden");
        }
      });

      currentDropdown?.classList.toggle("hidden");
      return;
    }

    if (event.target.classList.contains("edit-btn")) {
      const targetCard = event.target.closest(".top-highlight") || event.target.closest(".music-card");
      const titleElement = targetCard?.querySelector(".music-title");
      const descElement = targetCard?.querySelector(".music-desc");

      if (!targetCard || !titleElement || !descElement) {
        return;
      }

      const editParams = new URLSearchParams({
        placeId,
        mode: "edit",
        title: titleElement.textContent.trim(),
        description: descElement.textContent.trim(),
      });

      window.location.href = `../addsong.html?${editParams.toString()}`;
      return;
    }

    if (event.target.classList.contains("delete-btn")) {
      const targetCard = event.target.closest(".top-highlight") || event.target.closest(".music-card");

      if (targetCard && confirm("정말 이 곡을 삭제하시겠습니까?")) {
        targetCard.style.transition = "all 0.3s ease";
        targetCard.style.opacity = "0";
        targetCard.style.transform = "scale(0.9)";

        setTimeout(() => {
          targetCard.remove();
        }, 300);
      }
    }
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      menu.classList.add("hidden");
    });
  });
});
