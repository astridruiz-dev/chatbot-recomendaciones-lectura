def calculate_book_score(book, filters):

    score = 0

    keyword = filters.get("keyword")
    author = filters.get("author")
    language = filters.get("language")
    fiction = filters.get("fiction")
    reading_level = filters.get("reading_level")
    theme = filters.get("theme")

    # Keyword → MUY importante
    if keyword:

        keyword_match = (
            keyword.lower() in book["title"].lower()
            or keyword.lower() in book["summary"].lower()
        )

        if keyword_match:
            score += 40

    # Theme → alta importancia
    if theme:

        theme_match = any(
            theme.lower() in t.lower()
            for t in book["themes"]
        )

        if theme_match:
            score += 30

    # Author → alta importancia
    if author:

        if author.lower() in book["author"].lower():
            score += 30

    # Reading level → media
    if reading_level:

        if reading_level.lower() == book["reading_level"].lower():
            score += 20

    # Language → menor peso
    if language:

        if language.lower() == book["language"].lower():
            score += 10

    # Fiction
    if fiction is not None:

        if fiction == book["fiction"]:
            score += 10

    # Disponible → bonus extra
    if book["available"]:
        score += 15

    return score