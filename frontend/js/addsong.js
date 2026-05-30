document.addEventListener("DOMContentLoaded", async () => {
  const songFileInput = document.querySelector("#songFileInput");
  const fileNameText = document.querySelector("#fileNameText");
  const uploadButton = document.querySelector("#uploadButton");
  const saveSongButton = document.querySelector("#saveSongButton");
  const data = window.SeoulodyData;
  const placeId = data.getPlaceIdFromUrl();
  let place = data.getPlaceById(placeId);

  try {
    place = await window.SeoulodyApi.getPlace(placeId);
  } catch (error) {
    console.warn("Using fallback place data.", error);
  }

  const storageKey = `seonyulSongName:${place.id}`;
  let selectedSongName = localStorage.getItem(storageKey) || "";

  const placeName = document.querySelector("#addsongPlaceName");
  const placeEnglish = document.querySelector("#addsongPlaceEnglish");

  if (placeName) {
    placeName.textContent = place.name;
  }

  if (placeEnglish) {
    placeEnglish.textContent = place.nameEn;
  }

  if (selectedSongName && fileNameText) {
    fileNameText.textContent = selectedSongName;
    fileNameText.classList.add("has-file");
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
    if (selectedSongName) {
      localStorage.setItem(storageKey, selectedSongName);
      localStorage.setItem("seonyulSongName", selectedSongName);
    }

    location.href = `player.html?placeId=${encodeURIComponent(place.id)}`;
  });
});
