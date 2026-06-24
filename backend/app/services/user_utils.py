import re


def extract_graduation_year(email: str):

    match = re.search(r"20\d{2}", email)

    if match:
        return int(match.group())

    return None


def calculate_grade(graduation_year: int):

    grade_map = {
        2033: "6",
        2032: "7",
        2031: "8",
        2030: "9",
        2029: "10",
        2028: "11",
        2027: "12"
    }

    return grade_map.get(graduation_year)