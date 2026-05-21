def normalize_tags(tags):
    if not tags:
        return []

    result = []

    for tag in tags:
        tag_text = str(tag).strip()

        if tag_text:
            result.append(tag_text)

    return result


def calculate_match_score(place, track):
    place_tags = normalize_tags(place.tags)
    track_tags = normalize_tags(track.tags)

    track_tag_set = set(track_tags)

    matched_tags = []

    for place_tag in place_tags:
        if place_tag in track_tag_set:
            matched_tags.append(place_tag)

    score = 0

    # 태그가 하나 겹칠 때마다 10점
    score += len(matched_tags) * 10

    # 장소 분위기와 노래 분위기가 같으면 30점
    if place.mood and track.mood and place.mood == track.mood:
        score += 30

    # 장소 테마가 노래 태그에 있으면 5점
    if place.theme and place.theme in track_tag_set:
        score += 5

    return score, matched_tags


def build_recommendation_reason(place, track, matched_tags):
    place_mood = place.mood or "장소의"
    track_title = track.title or "추천 음악"

    if matched_tags:
        tag_text = ", ".join(matched_tags)
    else:
        tag_text = place_mood

    return (
        f"{place.name}의 {place_mood} 분위기와 "
        f"{tag_text} 감성이 '{track_title}'의 음악 스타일과 잘 어울려 추천합니다."
    )