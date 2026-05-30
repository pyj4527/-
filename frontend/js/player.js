document.addEventListener("DOMContentLoaded", async () => {
  const data = window.SeoulodyData;
  const placeId = data.getPlaceIdFromUrl();
  let place = data.getPlaceById(placeId);
  const backButton = document.querySelector("#backButton");
  const addSongButton = document.querySelector("#addSongButton");
  const mySeonyulSong = document.querySelector("#mySeonyulSong");
  const bookmarkButton = document.querySelector("#bookmarkButton");
  const otherSeonyulLink = document.querySelector(".other-seonyul-link");
  const audio = document.querySelector("#audio");
  const playButton = document.querySelector("#playButton");

  try {
    place = await window.SeoulodyApi.getPlace(placeId);
  } catch (error) {
    console.warn("Using fallback place data.", error);
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = value;
    }
  }

  function setImage(selector, path, alt) {
    const element = document.querySelector(selector);
    if (element && path) {
      element.src = data.asset(path);
      element.alt = alt;
    }
  }

  function getLocalBookmarks() {
    return JSON.parse(localStorage.getItem("seoulodyBookmarks") || "[]");
  }

  function setLocalBookmarks(bookmarks) {
    localStorage.setItem("seoulodyBookmarks", JSON.stringify(bookmarks));
  }

  function isBookmarked() {
    return place.isBookmarked || getLocalBookmarks().includes(place.id);
  }

  function updateBookmarkState() {
    if (!bookmarkButton || !place) {
      return;
    }

    const bookmarked = isBookmarked();
    bookmarkButton.classList.toggle("active", bookmarked);
    bookmarkButton.setAttribute("aria-label", bookmarked ? "저장됨" : "저장");
  }

  function renderPlace() {
    document.title = `SEON-YUL - ${place.name}`;
    setText("#musicTitle", place.track.title);
    setText("#musicSub", place.track.artist);
    setText("#placeName", place.name);
    setText("#placeEnglish", place.nameEn);
    setText("#placeDesc", place.description);
    setText("#fee", place.fee);
    setText("#time", place.openTime);
    setText("#location", place.address);
    setImage("#musicImage", place.heroImage, `${place.name} 대표 이미지`);
    setImage("#placeImage", place.detailImage, `${place.name} 장소 사진`);

    if (audio && place.track.audioUrl) {
      audio.src = data.asset(place.track.audioUrl);
    }

    const tagBox = document.querySelector("#tagBox");
    if (tagBox) {
      tagBox.innerHTML = place.tags.map((tag) => `<span>${tag}</span>`).join("");
    }
  }

  renderPlace();

  const savedSongName =
    localStorage.getItem(`seonyulSongName:${place.id}`) ||
    localStorage.getItem("seonyulSongName");

  if (mySeonyulSong && savedSongName) {
    mySeonyulSong.textContent = savedSongName;
    mySeonyulSong.classList.add("has-song");
  }

  backButton?.addEventListener("click", function () {
    location.href = "map/map.html";
  });

  bookmarkButton?.addEventListener("click", async function () {
    const nextState = !isBookmarked();

    try {
      await window.SeoulodyApi.setBookmark(place.id, nextState);
      place.isBookmarked = nextState;
    } catch (error) {
      const bookmarks = getLocalBookmarks();
      const nextBookmarks = nextState
        ? [...new Set([...bookmarks, place.id])]
        : bookmarks.filter((id) => id !== place.id);
      setLocalBookmarks(nextBookmarks);
    }

    updateBookmarkState();
  });

  playButton?.addEventListener("click", async function () {
    if (!audio || !audio.src) {
      alert("재생할 오디오가 없습니다.");
      return;
    }

    if (audio.paused) {
      await audio.play();
      playButton.textContent = "=";
      return;
    }

    audio.pause();
    playButton.textContent = "▶";
  });

  audio?.addEventListener("ended", function () {
    if (playButton) {
      playButton.textContent = "▶";
    }
  });

  addSongButton?.addEventListener("click", function () {
    location.href = `addsong.html?placeId=${encodeURIComponent(place.id)}`;
  });

  otherSeonyulLink?.addEventListener("click", function (event) {
    event.preventDefault();
    location.href = `music-list/music-list.html?placeId=${encodeURIComponent(place.id)}`;
  });

  updateBookmarkState();
});
