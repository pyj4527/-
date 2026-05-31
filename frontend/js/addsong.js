document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const songFileInput = document.querySelector("#songFileInput");
  const fileNameText = document.querySelector("#fileNameText");
  const uploadButton = document.querySelector("#uploadButton");
  const saveSongButton = document.querySelector("#saveSongButton");
  const deleteSongButton = document.querySelector("#deleteSongButton");
  const formTitle = document.querySelector("#formTitle");
  const backLink = document.querySelector(".back-link");
  const songForm = document.querySelector(".song-form");
  const titleField = document.querySelector(".title-field");
  const fileField = document.querySelector(".file-field");
  const songTitleInput = document.querySelector("#songTitleInput");
  const songDescriptionInput = document.querySelector("#songDescriptionInput");
  const data = window.SeoulodyData;
  const placeId = data.getPlaceIdFromUrl();
  const isEditMode = params.get("mode") === "edit";
  let place = data.getPlaceById(placeId);
  let resolvedPlaceId = placeId;

  backLink?.addEventListener("click", function (event) {
    event.preventDefault();

    if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
      history.back();
      return;
    }

    location.href = `player.html?placeId=${encodeURIComponent(resolvedPlaceId)}`;
  });

  try {
    place = await window.SeoulodyApi.getPlace(placeId);
    resolvedPlaceId = place.id;
  } catch (error) {
    console.warn("Using fallback place data.", error);
    resolvedPlaceId = place.id;
  }

  const storageKey = `seonyulSong:${resolvedPlaceId}`;
  const legacyStorageKey = `seonyulSongName:${resolvedPlaceId}`;
  const savedSong = JSON.parse(localStorage.getItem(storageKey) || "null");
  let selectedSongName = savedSong?.title || localStorage.getItem(legacyStorageKey) || "";
  const initialTitle = isEditMode ? params.get("title") || selectedSongName || "" : "";
  const initialDescription = params.get("description") || "";

  const placeName = document.querySelector("#addsongPlaceName");
  const placeEnglish = document.querySelector("#addsongPlaceEnglish");

  if (placeName) {
    placeName.textContent = place.name;
  }

  if (placeEnglish) {
    placeEnglish.textContent = place.nameEn;
  }

  if (songTitleInput) {
    songTitleInput.value = initialTitle;
  }

  if (songDescriptionInput) {
    songDescriptionInput.value = initialDescription || savedSong?.description || "";
  }

  if (selectedSongName && fileNameText) {
    fileNameText.textContent = selectedSongName;
    fileNameText.classList.add("has-file");
  }

  if (isEditMode) {
    if (formTitle) formTitle.textContent = "노래 수정하기";
    if (saveSongButton) saveSongButton.textContent = "수정하기";
    songForm?.classList.add("editing");
    if (fileField) fileField.hidden = true;
    if (deleteSongButton) deleteSongButton.hidden = false;
  }

  uploadButton?.addEventListener("click", function () {
    songFileInput?.click();
  });

  songFileInput?.addEventListener("change", function () {
    const file = songFileInput.files && songFileInput.files[0];

    if (!file) {
      selectedSongName = "";
      fileNameText.textContent = "파일을 올려주세요";
      fileNameText.classList.remove("has-file");
      return;
    }

    selectedSongName = file.name;
    fileNameText.textContent = selectedSongName;
    fileNameText.classList.add("has-file");
  });

  saveSongButton?.addEventListener("click", function () {
    if (songTitleInput?.value.trim()) {
      selectedSongName = songTitleInput.value.trim();
    }

    if (selectedSongName) {
      const songPayload = {
        placeId: resolvedPlaceId,
        title: selectedSongName,
        description: songDescriptionInput?.value.trim() || "",
        username: "HGD",
        time: "1:43",
      };

      localStorage.setItem(storageKey, JSON.stringify(songPayload));
      localStorage.setItem(legacyStorageKey, selectedSongName);
    }

    location.href = `music-list/music-list.html?placeId=${encodeURIComponent(resolvedPlaceId)}`;
  });

  deleteSongButton?.addEventListener("click", function () {
    if (!confirm("정말 이 노래를 삭제하시겠습니까?")) {
      return;
    }

    localStorage.removeItem(storageKey);
    localStorage.removeItem(legacyStorageKey);
    location.href = `music-list/music-list.html?placeId=${encodeURIComponent(resolvedPlaceId)}`;
  });
});
