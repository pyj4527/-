document.addEventListener("DOMContentLoaded", async () => {
  const mapContainer = document.getElementById("kakao-map-container");
  let places = window.SeoulodyData?.places || [];

  try {
    places = await window.SeoulodyApi.getMapPlaces();
  } catch (error) {
    console.warn("Using fallback place data.", error);
  }

  const purpleIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const previewCard = document.createElement("article");
  previewCard.className = "map-place-preview";
  previewCard.hidden = true;
  document.querySelector(".app-container")?.appendChild(previewCard);

  function getLocalBookmarks() {
    return JSON.parse(localStorage.getItem("seoulodyBookmarks") || "[]");
  }

  function setLocalBookmarks(bookmarks) {
    localStorage.setItem("seoulodyBookmarks", JSON.stringify(bookmarks));
  }

  function isBookmarked(place) {
    return place.isBookmarked || getLocalBookmarks().includes(place.id);
  }

  function imageSrc(path) {
    return window.SeoulodyData.asset(path || "../images/place1.png");
  }

  function renderPreview(place) {
    const bookmarked = isBookmarked(place);

    previewCard.hidden = false;
    previewCard.innerHTML = `
      <button class="preview-bookmark ${bookmarked ? "active" : ""}" type="button" aria-label="${place.name} 저장">
        <img src="../images/Bookmark.png" alt="">
      </button>
      <img class="preview-image" src="${imageSrc(place.image)}" alt="${place.name}">
      <div class="preview-content">
        <p class="preview-rating">★ ${place.rating.toFixed(1)}</p>
        <h3>${place.name}</h3>
        <p class="preview-name-en">${place.nameEn}</p>
        <p class="preview-track">${place.track.title}</p>
      </div>
    `;

    previewCard.onclick = async (event) => {
      if (event.target.closest(".preview-bookmark")) {
        event.stopPropagation();
        const nextState = !isBookmarked(place);

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

        renderPreview(place);
        return;
      }

      window.location.href = `../player.html?placeId=${encodeURIComponent(place.id)}`;
    };
  }

  if (mapContainer) {
    const map = L.map("kakao-map-container").setView([37.565, 126.983], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    places.forEach((place) => {
      L.marker([place.latitude, place.longitude], { icon: purpleIcon })
        .addTo(map)
        .on("click", () => renderPreview(place));
    });
  }

  document.getElementById("box-nav-home")?.addEventListener("click", () => {
    window.location.href = "../main/main.html";
  });

  document.getElementById("box-nav-save")?.addEventListener("click", () => {
    window.location.href = "../save.html";
  });

  document.getElementById("box-nav-mypage")?.addEventListener("click", () => {
    window.location.href = "../mypage/mypage.html";
  });
});
