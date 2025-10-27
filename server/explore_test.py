import pytest

# Mock data as post names relevent to our "not yet implemented database"
posts = [
    {"id": 1, "title": "Sewing"},
    {"id": 2, "title": "Python with Jane"},
    {"id": 3, "title": "Cooking"},
    {"id": 4, "title": "Guitar Lessons"},
    {"id": 5, "title": "Hermonica"},
]

# search filter
def search_posts(term):
    return [p for p in posts if term.lower() in p["title"].lower()]

# Test 1: Check if all posts are shown when search is empty
def test_all_posts_returned():
    result = search_posts("")
    assert len(result) == len(posts)

# Test 2: Searching for something within our mock data/ Database
def test_search_specific_post():
    result = search_posts("Guitar")
    assert len(result) == 1
    assert result[0]["title"] == "Guitar Lessons"

# Test 3: Check If "no results found" is shown when search term doesn't match any items in mock data/ database
def test_search_no_results_found():
    result = search_posts("Unicorn")
    if len(result) == 0:
        message = f"No results found for “Unicorn”."
    else:
        message = ""
    assert message == "No results found for “Unicorn”."
