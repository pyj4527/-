document.addEventListener("DOMContentLoaded", () => {
  const openPlayer = (placeId) => {
    window.location.href = `../player.html?placeId=${encodeURIComponent(placeId)}`;
  };

  const musicBox = document.getElementById("box-music-category");
  musicBox?.addEventListener("click", () => {
    window.location.href = "../music-list/music-list.html";
  });

  const audioPlayerBox = document.getElementById("box-audio-player");
  audioPlayerBox?.addEventListener("click", () => {
    openPlayer("1");
  });

  const aiCourseBox = document.getElementById("box-ai-course");
  aiCourseBox?.addEventListener("click", () => {
    window.location.href = "../map/map.html";
  });

  document.querySelectorAll(".place-card").forEach((card, index) => {
    const placeIds = ["1", "2", "3"];
    card.addEventListener("click", () => {
      openPlayer(card.dataset.placeId || placeIds[index] || "1");
    });
  });
});
