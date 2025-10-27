# FastAPI + React Setup Guide

## Backend Setup (FastAPI)

1. Navigate to the server directory:
```bash
cd server
```

2. Activate virtual environment:
```bash
source venv/bin/activate
```

3. Run the FastAPI server:
```bash
uvicorn main:app --reload
```

The backend will run on `http://localhost:8000`
- View API docs: `http://localhost:8000/docs`

## Frontend Setup (React + Vite)

1. Navigate to the frontend directory:
```bash
cd skill-share
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Testing the Connection

1. Start the backend server (port 8000)
2. Start the frontend server (port 5173)
3. Visit the profile page in your browser
4. The profile data should now load from the FastAPI backend!

## API Endpoints

- `GET /api/profile` - Get the default user profile
- `GET /api/profile/{username}` - Get a specific user's profile
  - Try: `Suzuna_Kimura_1`

## Example API Response

```json
{
  "firstName": "Suzuna",
  "lastName": "Kimura",
  "profilePicture": null,
  "postsCount": 24,
  "followersCount": 156,
  "followingCount": 89,
  "wishList": ["Web Development", "Photography", "Cooking", "Guitar", "Spanish", "Yoga"]
}
```

## To run test cases
### For profile_test_case.py
1. Activate virutal environment:
```bash
source venv/bin/activate
```
2. Run python profile_test_case.py
```bash
python profile_test_case.py
```
