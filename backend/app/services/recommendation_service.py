def calculate_book_score(book, keyword=None, recommended_age=None):

    score = 0

    # Coincidencia por palabra clave
    if keyword:
        if keyword.lower() in book["title"].lower():
            score += 3

        if keyword.lower() in book["theme"].lower():
            score += 2

    # Coincidencia por edad
    if recommended_age:
        if book["recommended_age"] == recommended_age:
            score += 2

    # Disponibilidad
    if book["available"]:
        score += 1

    return score
def calculate_book_score(book, filters):

    score = 0

    # Keyword match
    if filters.get("keyword"):

        keyword = filters["keyword"].lower()

        if keyword in book["title"].lower():
            score += 30

        if keyword in book["summary"].lower():
            score += 20

        if any(
            keyword in theme.lower()
            for theme in book["themes"]
        ):
            score += 25

    # Author match
    if filters.get("author"):

        if filters["author"].lower() in book["author"].lower():
            score += 25

    # Language match
    if filters.get("language"):

        if filters["language"].lower() == book["language"].lower():
            score += 15

    # Fiction match
    if filters.get("fiction") is not None:

        if filters["fiction"] == book["fiction"]:
            score += 15

    # Reading level match
    if filters.get("reading_level"):

        if (
            filters["reading_level"].lower()
            == book["reading_level"].lower()
        ):
            score += 20

    # Theme match
    if filters.get("theme"):

        theme = filters["theme"].lower()

        if any(
            theme in t.lower()
            for t in book["themes"]
        ):
            score += 25

    # Availability bonus
    if book["available"]:
        score += 10

    return score