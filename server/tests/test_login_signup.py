from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# Scenario 1: User visits website, logs in or clicks sign up, then quits
def test_user_visits_and_quits():
    # Try logging in without info → user quit
    response = client.post("/login", params={"email": "", "password": ""})
    assert response.status_code == 400
    assert "Login cancelled" in response.json()["detail"]

    # Try signing up without info → user quit
    response = client.post("/signup", params={"email": "", "password": ""})
    assert response.status_code == 400
    assert "Signup cancelled" in response.json()["detail"]

# Scenario 2: User signs up successfully, then quits
def test_user_signup_and_quits():
    # User signs up
    response = client.post("/signup", params={"email": "test@example.com", "password": "Password123!"})
    assert response.status_code == 200
    assert response.json()["message"] == "Account created successfully"

    # Now user quits (just exits — no further action)
    # Simulate user re-visiting and logging in successfully
    response = client.post("/login", params={"email": "test@example.com", "password": "Password123!"})
    assert response.status_code == 200
    assert response.json()["message"] == "Login successful"