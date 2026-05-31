(function () {
  const script = document.currentScript;
  const scriptUrl = script ? script.src : window.location.href;

  function asset(path) {
    if (!path) {
      return "";
    }

    if (/^(https?:)?\/\//.test(path)) {
      return path;
    }

    if (path.startsWith("audio/") || path.startsWith("images/")) {
      return new URL(`../${path}`, scriptUrl).href;
    }

    return new URL(path, scriptUrl).href;
  }

  const places = [
    {
      id: "gyeongbokgung",
      name: "경복궁",
      nameEn: "Gyeongbokgung",
      district: "종로구",
      latitude: 37.5796,
      longitude: 126.977,
      rating: 4.8,
      tags: ["역사/문화", "고궁", "전통"],
      mood: "calm",
      description:
        "조선 시대를 대표하는 궁궐로, 아름다운 건축과 역사를 함께 느낄 수 있는 곳이에요. 경회루와 향원정은 꼭 방문해보세요.",
      fee: "3,000 KRW",
      openTime: "09:00 - 18:00 (매주 화요일 휴무)",
      address: "서울특별시 종로구 사직로 161",
      image: "../images/covers/gyeongbokgung.jpg",
      heroImage: "../images/covers/gyeongbokgung.jpg",
      detailImage: "../images/covers/gyeongbokgung.jpg",
      track: {
        title: "연모지정",
        artist: "Tido Kang",
        audioUrl: "../audio/gyeongbokgung.mp3",
        coverImageUrl: "../images/covers/gyeongbokgung.jpg",
      },
    },
    {
      id: "namsan",
      name: "남산타워",
      nameEn: "N Seoul Tower",
      district: "용산구",
      latitude: 37.5511,
      longitude: 126.9882,
      rating: 4.7,
      tags: ["랜드마크", "야경", "전망대"],
      mood: "romantic",
      description:
        "서울의 야경을 한눈에 볼 수 있는 대표 전망 명소예요. 도시의 불빛과 함께 로맨틱한 분위기를 느끼기 좋아요.",
      fee: "전망대 21,000 KRW",
      openTime: "10:30 - 22:30",
      address: "서울특별시 용산구 남산공원길 105",
      image: "../images/covers/namsan.png",
      heroImage: "../images/covers/namsan.png",
      detailImage: "../images/covers/namsan.png",
      track: {
        title: "이런느낌",
        artist: "남산타워 Lyrics Ver",
        audioUrl: "../audio/namsan.mp3",
        coverImageUrl: "../images/covers/namsan.png",
      },
    },
    {
      id: "cheonggyecheon",
      name: "청계천",
      nameEn: "Cheonggyecheon Stream",
      district: "종로구",
      latitude: 37.5691,
      longitude: 126.9787,
      rating: 4.6,
      tags: ["산책", "물길", "도심"],
      mood: "fresh",
      description:
        "도심 한가운데 흐르는 산책로로, 물소리와 도시의 리듬이 함께 어우러지는 공간이에요.",
      fee: "무료",
      openTime: "상시 개방",
      address: "서울특별시 종로구 청계천로",
      image: "../images/covers/cheonggyecheon.png",
      heroImage: "../images/covers/cheonggyecheon.png",
      detailImage: "../images/covers/cheonggyecheon.png",
      track: {
        title: "영원히 너와 (Forever With You)",
        artist: "잔잔",
        audioUrl: "../audio/cheonggyecheon.mp3",
        coverImageUrl: "../images/covers/cheonggyecheon.png",
      },
    },
  ];

  function getPlaceById(id) {
    const aliases = {
      1: "gyeongbokgung",
      2: "namsan",
      3: "cheonggyecheon",
    };
    const normalizedId = aliases[id] || id;
    return places.find((place) => place.id === normalizedId) || places[0];
  }

  function getPlaceIdFromUrl(defaultId = places[0].id) {
    const params = new URLSearchParams(window.location.search);
    return params.get("placeId") || params.get("place") || defaultId;
  }

  window.SeoulodyData = {
    places,
    asset,
    getPlaceById,
    getPlaceIdFromUrl,
  };
})();
