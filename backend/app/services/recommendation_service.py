from difflib import get_close_matches

from sqlalchemy import text

from app.data.mock_books import MOCK_BOOKS


def normalize_text(text: str | None) -> str:
    if not text:
        return ""

    replacements = {
        "á": "a",
        "é": "e",
        "í": "i",
        "ó": "o",
        "ú": "u",
        "ü": "u",
        "ñ": "n"
    }

    normalized = text.lower().strip()

    for original, replacement in replacements.items():
        normalized = normalized.replace(original, replacement)

    return normalized

STOP_WORDS = {
    "quiero",
    "libro",
    "libros",
    "sobre",
    "acerca",
    "de",
    "del",
    "la",
    "el",
    "los",
    "las",
    "un",
    "una",
    "unos",
    "unas",
    "para",
    "hacer",
    "tarea",
    "trabajo",
    "investigar",
    "busco",
    "buscar",
    "book",
    "books",
    "about",
    "for",
    "the",
    "a",
    "an",
    "and",
    "or",
    "to",
    "of",
    "on",
    "school",
    "assignment",
    "research"
}


def extract_search_tokens(search: str | None) -> list[str]:
    if not search:
        return []

    normalized_search = normalize_text(search)

    raw_tokens = normalized_search.replace(",", " ").replace(".", " ").split()

    tokens = []

    for token in raw_tokens:
        if token not in STOP_WORDS and len(token) > 2:
            tokens.append(token)

    return tokens

  

def expand_search_terms(search: str | None) -> list[str]:
    if not search:
        return []

    normalized_search = normalize_text(search)

    synonyms = {
        "dragon": ["dragon", "dragons", "dragones", "fantasia", "fantasy", "magia", "magic", "aventura"],
        "dragons": ["dragon", "dragons", "dragones", "fantasia", "fantasy", "magia", "magic", "aventura"],
        "dragones": ["dragon", "dragons", "dragones", "fantasia", "fantasy", "magia", "magic", "aventura"],

        "fantasia": ["fantasia", "fantasy", "magia", "magic", "dragon", "dragons"],
        "fantasy": ["fantasia", "fantasy", "magia", "magic", "dragon", "dragons"],
        "magia": ["magia", "magic", "fantasia", "fantasy", "dragon", "dragons"],
        "magic": ["magia", "magic", "fantasia", "fantasy", "dragon", "dragons"],

        "misterio": ["misterio", "mystery", "detective", "suspenso", "suspense"],
        "mystery": ["misterio", "mystery", "detective", "suspenso", "suspense"],

        "terror": ["terror", "horror", "suspenso", "suspense", "dark"],
        "horror": ["terror", "horror", "suspenso", "suspense", "dark"],

        "guerra": ["guerra", "war", "world war", "eventos del pasado", "history", "historia", "holocaust"],
        "war": ["guerra", "war", "world war", "eventos del pasado", "history", "historia", "holocaust"],
        "historia": ["historia", "history", "eventos del pasado", "war", "guerra"],
        "history": ["historia", "history", "eventos del pasado", "war", "guerra"],
        "familia": ["familia", "family", "memory", "memoria"],
        "family": ["familia", "family", "memory", "memoria"],

        "amor": ["amor", "emociones", "emotions", "friendship", "amistad", "empathy", "empatia"],
        "amistad": ["amistad", "friendship", "amor", "emociones", "empathy", "empatia"],
        "friendship": ["amistad", "friendship", "amor", "emociones", "empathy", "empatia"],
        "empatia": ["empatia", "empathy", "amistad", "friendship", "emociones"],

        "aventura": ["aventura", "adventure", "accion", "action", "explorar otros mundos"],
        "adventure": ["aventura", "adventure", "accion", "action", "explorar otros mundos"],

        "deportes": ["deportes", "sports", "competencia", "competition"],
        "sports": ["deportes", "sports", "competencia", "competition"],

        "distopia": ["distopia", "dystopia", "sociedades vigiladas", "controlled society", "vigilancia", "reglas"],
        "dystopia": ["distopia", "dystopia", "sociedades vigiladas", "controlled society", "vigilancia", "reglas"],
        "vigilancia": ["vigilancia", "surveillance", "sociedades vigiladas", "controlled society"],
        "surveillance": ["vigilancia", "surveillance", "sociedades vigiladas", "controlled society"],

        "grafica": ["grafica", "graphic", "graphic novel", "comic", "novelas graficas"],
        "graphic": ["grafica", "graphic", "graphic novel", "comic", "novelas graficas"],
        "comic": ["comic", "graphic", "graphic novel", "novelas graficas"],

        "salvador": ["salvador", "el salvador", "lrc el salvador collection", "cuentos de barro"],
        "volcanes": ["volcanes", "volcanoes", "science", "ciencia"],
        "fotosintesis": ["fotosintesis", "photosynthesis", "science", "ciencia", "plantas"]
    }

    tokens = extract_search_tokens(normalized_search)

    expanded_terms = [normalized_search]

    for token in tokens:
        expanded_terms.append(token)

        if token in synonyms:
            expanded_terms.extend(synonyms[token])

    if normalized_search in synonyms:
        expanded_terms.extend(synonyms[normalized_search])

    return list(set(expanded_terms))

def get_available_suggestion_terms() -> list[str]:
    terms = [
        "dragones",
        "dragon",
        "fantasía",
        "fantasia",
        "magia",
        "misterio",
        "terror",
        "horror",
        "suspenso",
        "guerra",
        "war",
        "amor",
        "amistad",
        "aventura",
        "deportes",
        "distopía",
        "distopia",
        "novela gráfica",
        "novelas gráficas",
        "graphic",
        "historia",
        "El Salvador"
    ]

    categories = []

    for book in MOCK_BOOKS:
        categories.extend(book.get("categories", []))
        categories.append(book.get("sublocation", ""))
        categories.append(book.get("title", ""))
        categories.append(book.get("author", ""))

    all_terms = terms + categories

    cleaned_terms = []

    for term in all_terms:
        if term and term not in cleaned_terms:
            cleaned_terms.append(term)

    return cleaned_terms

def get_search_suggestions(search: str | None) -> list[str]:
    if not search:
        return []

    normalized_search = normalize_text(search)

    suggestion_terms = get_available_suggestion_terms()

    normalized_map = {
        normalize_text(term): term
        for term in suggestion_terms
    }

    close_matches = get_close_matches(
        normalized_search,
        normalized_map.keys(),
        n=3,
        cutoff=0.55
    )

    suggestions = []

    for match in close_matches:
        original_term = normalized_map.get(match)

        if original_term and original_term not in suggestions:
            suggestions.append(original_term)

    return suggestions

def book_matches_search(book: dict, search: str | None) -> bool:
    if not search:
        return True

    search_terms = expand_search_terms(search)

    searchable_values = [
        book.get("title", ""),
        book.get("author", ""),
        book.get("language", ""),
        book.get("sublocation", ""),
        book.get("summary", ""),
        " ".join(book.get("categories", []))
    ]

    searchable_text = normalize_text(" ".join(searchable_values))

    matches = [
        search_term
        for search_term in search_terms
        if search_term in searchable_text
    ]

    return len(matches) > 0

def book_matches_grade(book: dict, grade: str | None) -> bool:
    if not grade:
        return True

    return grade in book.get("recommended_grades", [])


def book_matches_language(book: dict, language: str | None) -> bool:
    if not language:
        return True

    return normalize_text(book.get("language")) == normalize_text(language)


def book_matches_category(book: dict, category: str | None) -> bool:
    if not category:
        return True

    normalized_category = normalize_text(category)

    book_categories = [
        normalize_text(book_category)
        for book_category in book.get("categories", [])
    ]

    return normalized_category in book_categories


def book_matches_length(book: dict, length: str | None) -> bool:
    if not length:
        return True

    return normalize_text(book.get("length")) == normalize_text(length)


def book_matches_availability(book: dict, available: bool | None) -> bool:
    if available is None:
        return True

    return book.get("available") == available


def book_matches_sublocation(book: dict, sublocation: str | None) -> bool:
    if not sublocation:
        return True

    return normalize_text(book.get("sublocation")) == normalize_text(sublocation)


def calculate_score(
    book: dict,
    search: str | None = None,
    category: str | None = None,
    grade: str | None = None,
    language: str | None = None,
    length: str | None = None,
    sublocation: str | None = None
) -> int:
    score = 0

    if search and book_matches_search(book, search):
        score += 25

    search_terms = expand_search_terms(search)

    searchable_values = [
        book.get("title", ""),
        book.get("author", ""),
        book.get("language", ""),
        book.get("sublocation", ""),
        book.get("summary", ""),
        " ".join(book.get("categories", []))
    ]

    searchable_text = normalize_text(" ".join(searchable_values))

    matching_terms = [
        term
        for term in search_terms
        if term in searchable_text
    ]

    score += min(len(matching_terms) * 5, 20)

    if category and book_matches_category(book, category):
        score += 20

    if grade and book_matches_grade(book, grade):
        score += 10

    if language and book_matches_language(book, language):
        score += 10

    if length and book_matches_length(book, length):
        score += 10

    if sublocation and book_matches_sublocation(book, sublocation):
        score += 15

    if book.get("available"):
        score += 5

    return min(score, 100)


def normalize_book_response(book: dict, score: int) -> dict:
    return {
        "id": book.get("id"),
        "title": book.get("title"),
        "author": book.get("author"),
        "language": book.get("language"),
        "pages": book.get("pages"),
        "length": book.get("length"),
        "genre": ", ".join(book.get("categories", [])),
        "categories": book.get("categories", []),
        "available": book.get("available"),
        "sublocation": book.get("sublocation"),
        "callNumber": book.get("callNumber"),
        "isbn": book.get("isbn"),
        "summary": book.get("summary"),
        "coverEmoji": book.get("coverEmoji", "📚"),
        "score": score
    }


def get_recommendations(
    search: str | None = None,
    grade: str | None = None,
    language: str | None = None,
    category: str | None = None,
    length: str | None = None,
    available: bool | None = None,
    sublocation: str | None = None
) -> list[dict]:
    results = []

    for book in MOCK_BOOKS:
        if not book_matches_search(book, search):
            continue

        if not book_matches_grade(book, grade):
            continue

        if not book_matches_language(book, language):
            continue

        if not book_matches_category(book, category):
            continue

        if not book_matches_length(book, length):
            continue

        if not book_matches_availability(book, available):
            continue

        if not book_matches_sublocation(book, sublocation):
            continue

        score = calculate_score(
            book=book,
            search=search,
            category=category,
            grade=grade,
            language=language,
            length=length,
            sublocation=sublocation
        )

        results.append(normalize_book_response(book, score))

    results.sort(key=lambda book: book["score"], reverse=True)

    return results

def get_recommendation_response(
    search: str | None = None,
    grade: str | None = None,
    language: str | None = None,
    category: str | None = None,
    length: str | None = None,
    available: bool | None = None,
    sublocation: str | None = None
) -> dict:
    recommendations = get_recommendations(
        search=search,
        grade=grade,
        language=language,
        category=category,
        length=length,
        available=available,
        sublocation=sublocation
    )

    suggestions = []

    if search and len(recommendations) == 0:
        suggestions = get_search_suggestions(search)

    return {
        "status": "ok",
        "count": len(recommendations),
        "filters": {
            "search": search,
            "grade": grade,
            "language": language,
            "category": category,
            "length": length,
            "available": available,
            "sublocation": sublocation
        },
        "suggestions": suggestions,
        "recommendations": recommendations
    }

def calculate_book_score(book: dict, filters: dict) -> int:
    
    score = 0

    keyword = filters.get("keyword")
    author = filters.get("author")
    language = filters.get("language")
    fiction = filters.get("fiction")
    reading_level = filters.get("reading_level")
    theme = filters.get("theme")

    if keyword:
        normalized_keyword = normalize_text(keyword)

        searchable_text = normalize_text(
            " ".join([
                book.get("title", ""),
                book.get("summary", ""),
                book.get("author", ""),
                " ".join(book.get("themes", [])),
                " ".join(book.get("categories", []))
            ])
        )

        if normalized_keyword in searchable_text:
            score += 40

    if author:
        if normalize_text(author) in normalize_text(book.get("author", "")):
            score += 30

    if language:
        if normalize_text(language) == normalize_text(book.get("language", "")):
            score += 10

    if fiction is not None:
        if book.get("fiction") == fiction:
            score += 10

    if reading_level:
        if normalize_text(reading_level) == normalize_text(book.get("reading_level", "")):
            score += 20

    if theme:
        normalized_theme = normalize_text(theme)

        book_themes = [
            normalize_text(item)
            for item in book.get("themes", [])
        ]

        book_categories = [
            normalize_text(item)
            for item in book.get("categories", [])
        ]

        if normalized_theme in book_themes or normalized_theme in book_categories:
            score += 30

    if book.get("available"):
        score += 15

    return score

# moved POPULAR_BOOKS_BY_GRADE out of function
POPULAR_BOOKS_BY_GRADE = {
    6: [
        "The Hobbit",
        "Coraline",
        "Wonder",
        "El principito",
        "Number the Stars"
    ],
    7: [
        "The Hobbit",
        "Coraline",
        "Wonder",
        "La ciudad de las bestias",
        "The Giver",
        "Number the Stars"
    ],
    8: [
        "The Hobbit",
        "Coraline",
        "Wonder",
        "La ciudad de las bestias",
        "The Giver",
        "Number the Stars",
        "Cuentos de barro"
    ],
    9: [
        "La ciudad de las bestias",
        "The Giver",
        "Cuentos de barro"
    ],
    10: [
        "Maus",
        "Frankenstein",
        "Cuentos de barro",
        "La ciudad de las bestias"
    ],
    11: [
        "Maus",
        "Frankenstein",
        "Cuentos de barro"
    ],
    12: [
        "Maus",
        "Frankenstein"
    ]
}


def get_popular_books_by_grade_response(grade: int | None):
    if not grade:
        return {
            "status": "error",
            "message": "No se recibió un grado válido.",
            "grade": grade,
            "count": 0,
            "recommendations": []
        }

    popular_titles = POPULAR_BOOKS_BY_GRADE.get(grade, [])

    popular_books = [
        book
        for book in MOCK_BOOKS
        if book.get("title") in popular_titles
    ]

    ordered_books = sorted(
        popular_books,
        key=lambda book: popular_titles.index(book.get("title"))
    )

    recommendations = [
        normalize_book_response(book, score=95)
        for book in ordered_books
    ]

    return {
        "status": "ok",
        "message": "Libros populares por grado consultados correctamente.",
        "grade": grade,
        "count": len(recommendations),
        "recommendations": recommendations
    }