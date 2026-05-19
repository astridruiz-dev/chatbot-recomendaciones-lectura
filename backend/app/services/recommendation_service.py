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