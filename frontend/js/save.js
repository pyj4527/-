document.addEventListener("DOMContentLoaded", async () => {
  const savedList = document.querySelector("#savedList");
  const filterButtons = document.querySelectorAll(".filter-tabs button");
  let savedPlaces = [];

  function getLocalBookmarks() {
    return JSON.parse(localStorage.getItem("seoulodyBookmarks") || "[]");
  }

  function imageSrc(path) {
    return window.SeoulodyData.asset(path || "images/place1.png");
  }

  async function loadSavedPlaces() {
    try {
      savedPlaces = await window.SeoulodyApi.getBookmarks();
      return;
    } catch (error) {
      const bookmarks = getLocalBookmarks();
      const places = window.SeoulodyData?.places || [];
      savedPlaces = places.filter((place) => bookmarks.includes(place.id));
    }
  }

  function renderSavedPlaces(district = "전체") {
    const filteredPlaces = savedPlaces.filter((place) => {
      return district === "전체" || place.district === district;
    });

    if (!savedList) {
      return;
    }

    if (!filteredPlaces.length) {
      savedList.innerHTML = '<p class="empty-saved">저장된 SEON-YUL이 없습니다.</p>';
      return;
    }

    savedList.innerHTML = filteredPlaces
      .map((place) => {
        const tags = place.tags
          .slice(0, 2)
          .map((tag) => `<span>${tag}</span>`)
          .join("");

        return `
          <article class="saved-card" data-place-id="${place.id}">
            <img src="${imageSrc(place.image)}" alt="${place.name}">
            <div class="card-content">
              <div class="card-title-row">
                <h2>${place.name}</h2>
                <button class="bookmark active" type="button" aria-label="${place.name} 저장됨"></button>
              </div>
              <p class="district"><span aria-hidden="true"><img src="images/icon/Compas.png" alt=""></span> ${place.district}</p>
              <div class="tags">${tags}</div>
            </div>
            <p class="music"><span aria-hidden="true"><img src="images/icon/Music.png" alt=""></span> ${place.track.title}</p>
          </article>
        `;
      })
      .join("");
  }

  savedList?.addEventListener("click", async (event) => {
    const card = event.target.closest(".saved-card");
    if (!card) {
      return;
    }

    if (event.target.closest(".bookmark")) {
      try {
        await window.SeoulodyApi.setBookmark(card.dataset.placeId, false);
      } catch (error) {
        const bookmarks = getLocalBookmarks().filter((id) => id !== card.dataset.placeId);
        localStorage.setItem("seoulodyBookmarks", JSON.stringify(bookmarks));
      }

      savedPlaces = savedPlaces.filter((place) => place.id !== card.dataset.placeId);
      renderSavedPlaces(document.querySelector(".filter-tabs .active")?.textContent?.trim() || "전체");
      return;
    }

    window.location.href = `player.html?placeId=${encodeURIComponent(card.dataset.placeId)}`;
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderSavedPlaces(button.textContent.trim());
    });
  });

  await loadSavedPlaces();
  renderSavedPlaces();
});
