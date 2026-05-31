(function () {
  const API_BASE_URL =
    window.SEOULODY_API_BASE_URL ||
    (["5500", "5501"].includes(window.location.port)
      ? "http://localhost:8000/api"
      : `${window.location.origin}/api`);

  function getUserId() {
    return localStorage.getItem("userId") || "1";
  }

  function getHeaders() {
    const headers = {
      "Content-Type": "application/json",
      "X-User-Id": getUserId(),
    };
    const authHeader = localStorage.getItem("authHeader");

    if (authHeader) {
      headers.Authorization = authHeader;
    }

    return headers;
  }

  function toFrontendPlace(place) {
    const track = place.recommendedTrack || {};

    return {
      id: String(place.id),
      name: place.name,
      nameEn: place.nameEn,
      district: place.district,
      latitude: place.latitude,
      longitude: place.longitude,
      rating: Number(place.averageRating || 0),
      tags: place.tags || [],
      description: place.description || "",
      fee: place.price || "",
      openTime: place.openTime || "",
      address: place.address || "",
      image: place.imageUrl || track.coverImageUrl || "../images/place1.png",
      heroImage: track.coverImageUrl || place.imageUrl || "../images/place1.png",
      detailImage: track.coverImageUrl || place.imageUrl || "../images/place1.png",
      isBookmarked: Boolean(place.isBookmarked),
      track: {
        id: track.id,
        title: track.title || "SEON-YUL",
        artist: track.artist || "Recommended Track",
        description: track.description || "",
        mood: track.mood || "",
        tags: track.tags || [],
        audioUrl: track.audioUrl || "",
        coverImageUrl: track.coverImageUrl || "",
      },
    };
  }

  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  async function getMapPlaces() {
    const places = await request("/map/places");
    return places.map(toFrontendPlace);
  }

  async function getPlace(placeId) {
    const place = await request(`/places/${encodeURIComponent(placeId)}`);
    return toFrontendPlace(place);
  }

  async function getBookmarks() {
    const bookmarks = await request("/bookmarks");
    return bookmarks.map((bookmark) => toFrontendPlace(bookmark.place));
  }

  async function setBookmark(placeId, shouldBookmark) {
    const method = shouldBookmark ? "POST" : "DELETE";
    return request(`/places/${encodeURIComponent(placeId)}/bookmarks`, { method });
  }

  window.SeoulodyApi = {
    getMapPlaces,
    getPlace,
    getBookmarks,
    setBookmark,
    toFrontendPlace,
  };
})();
