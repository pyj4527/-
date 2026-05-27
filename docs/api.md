# SEON-YUL MVP API Specification

SEON-YUL MVP API는 서울 관광지 기반 음악 공유 서비스를 중심으로 설계한다.

사용자는:

* 지도에서 관광지를 탐색하고
* 관광지별 음악을 감상하며
* 직접 음악을 업로드하고
* 관광지를 저장(북마크)할 수 있다.

---

# 공통 규칙

* Base URL: `/api`
* 아래 endpoint path는 Base URL 이후 경로만 표기한다.
* MVP 인증은 임시로 `X-User-Id` 헤더를 사용한다.
* 사용자 관련 API 요청은 `X-User-Id: {userId}`를 포함해야 한다.
* `X-User-Id`가 없거나 유효하지 않으면 `401 Unauthorized`를 반환한다.
* 날짜 및 시간은 ISO-8601 형식을 사용한다.
* 관광지는 DB `places` 테이블에서 관리한다.
* MVP에서는 관광지 3개를 초기 데이터로 저장한다.

## 초기 관광지 데이터

| id | name | district |
| -- | ---- | -------- |
| 1  | 경복궁  | 종로구      |
| 2  | 남산타워 | 용산구      |
| 3  | 청계천  | 종로구      |

---

# 지도

## 지도 관광지 리스트 조회

`GET /map/places`

지도 화면에 표시할 관광지 데이터를 조회한다.

### 응답

```json
[
  {
    "id": 1,
    "name": "경복궁",
    "nameEn": "Gyeongbokgung",
    "district": "종로구",
    "imageUrl": "https://cdn.example.com/places/gyeongbokgung.jpg",
    "latitude": 37.5796,
    "longitude": 126.977,
    "tags": [
      "역사/문화",
      "조선시대"
    ],
    "averageRating": 4.6,
    "trackCount": 12,
    "isBookmarked": true
  }
]
```

---

# 관광지

## 관광지 상세 조회

`GET /places/{placeId}`

관광지 상세 화면 데이터를 조회한다.

### 응답

```json
{
  "id": 1,
  "name": "경복궁",
  "nameEn": "Gyeongbokgung",
  "district": "종로구",
  "description": "조선 시대를 대표하는 궁궐",
  "imageUrl": "https://cdn.example.com/places/gyeongbokgung.jpg",
  "latitude": 37.5796,
  "longitude": 126.977,
  "tags": [
    "역사/문화",
    "조선시대"
  ],
  "price": "3000 KRW",
  "openTime": "09:00 ~ 18:00",
  "address": "서울특별시 종로구 사직로 161",
  "averageRating": 4.6,
  "trackCount": 12,
  "isBookmarked": true
}
```

---

# 관광지 음악

## 관광지 음악 업로드

`POST /places/{placeId}/tracks`

Content-Type: `multipart/form-data`

관광지에 음악과 설명을 업로드한다.

### 필드

| 필드          | 타입     | 필수  | 설명    |
| ----------- | ------ | --- | ----- |
| audio       | File   | 예   | 음악 파일 |
| title       | String | 예   | 음악 제목 |
| description | String | 아니오 | 음악 설명 |

### 응답

```json
{
  "id": 1,
  "placeId": 1,
  "title": "경복궁의 아침",
  "audioUrl": "https://cdn.example.com/audio/1.mp3",
  "description": "경복궁의 고즈넉한 분위기를 담은 곡입니다.",
  "createdAt": "2026-05-27T12:00:00"
}
```

### 지원 파일 형식

* mp3
* wav
* m4a

### 파일 제한

* 최대 20MB

---

## 관광지 음악 리스트 조회

`GET /places/{placeId}/tracks`

### 응답

```json
[
  {
    "id": 1,
    "title": "경복궁의 아침",
    "audioUrl": "https://cdn.example.com/audio/1.mp3",
    "description": "경복궁의 고즈넉한 분위기를 담은 곡입니다.",
    "createdAt": "2026-05-27T12:00:00",
    "createdBy": {
      "userId": 1,
      "nickname": "kodong"
    },
    "isMine": true
  }
]
```

### 정렬 기준

* 최신 업로드 순으로 반환한다.

---

## 관광지 음악 설명 수정

`PUT /places/{placeId}/tracks/{trackId}`

### 요청

```json
{
  "title": "경복궁의 새벽",
  "description": "새벽 궁궐 분위기를 표현했습니다."
}
```

### 응답

```json
{
  "id": 1,
  "title": "경복궁의 새벽",
  "description": "새벽 궁궐 분위기를 표현했습니다.",
  "updatedAt": "2026-05-27T13:00:00"
}
```

### 수정 권한

* 업로드한 사용자만 수정 가능하다.

---

## 관광지 음악 삭제

`DELETE /places/{placeId}/tracks/{trackId}`

### 응답

`204 No Content`

### 삭제 권한

* 업로드한 사용자만 삭제 가능하다.

---

# 저장(북마크)

## 관광지 북마크 등록

`POST /places/{placeId}/bookmarks`

관광지를 저장한다.

### 응답

```json
{
  "placeId": 1,
  "isBookmarked": true
}
```

### 제약 사항

* 같은 사용자는 동일 관광지를 중복 저장할 수 없다.
* 이미 저장된 경우 `409 Conflict`를 반환한다.

---

## 저장된 관광지 리스트 조회

`GET /bookmarks`

저장 페이지에서 북마크한 관광지 목록을 조회한다.

### Query

| 이름       | 타입     | 설명                   |
| -------- | ------ | -------------------- |
| district | String | 지역 필터 (`종로구`, `용산구`) |

### 응답

```json
[
  {
    "place": {
      "id": 1,
      "name": "경복궁",
      "nameEn": "Gyeongbokgung",
      "district": "종로구",
      "imageUrl": "https://cdn.example.com/places/gyeongbokgung.jpg",
      "tags": [
        "역사/문화",
        "조선시대"
      ]
    },
    "createdAt": "2026-05-27T12:00:00"
  }
]
```

### 정렬 기준

* 최신 저장 순으로 반환한다.

---

## 관광지 북마크 삭제

`DELETE /places/{placeId}/bookmarks`

관광지 저장을 해제한다.

### 응답

```json
{
  "placeId": 1,
  "isBookmarked": false
}
```

---

# 공통 에러 응답

### 응답 예시

```json
{
  "success": false,
  "error": {
    "code": "PLACE_NOT_FOUND",
    "message": "존재하지 않는 관광지입니다."
  }
}
```

## 에러 코드 예시

| 코드                     | 설명            |
| ---------------------- | ------------- |
| `UNAUTHORIZED`         | 인증 실패         |
| `PLACE_NOT_FOUND`      | 관광지 없음        |
| `TRACK_NOT_FOUND`      | 음악 데이터 없음     |
| `FORBIDDEN`            | 권한 없음         |
| `DUPLICATE_BOOKMARK`   | 중복 저장         |
| `INVALID_AUDIO_FORMAT` | 지원하지 않는 파일 형식 |
| `FILE_TOO_LARGE`       | 파일 크기 초과      |

---
