
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware to allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

# Mock profile data endpoint for the current user - change later to query database
@app.get("/api/profile")
async def get_profile():
    return {
        "firstName": "Suzuna",
        "lastName": "Kimura",
        "profilePicture": 'https://images6.alphacoders.com/337/thumb-1920-337780.jpg',
        "postsCount": 24,
        "followersCount": 156,
        "followingCount": 89,
        "wishList": ["Web Development", "Photography", "Cooking", "Guitar", "Programming", "Pilates"],
        "skills": [
            {
                "name": "Photography",
                "level": "Professional",
                "yearsExperience": 6,
                "description": "Lifestyle and portrait photographer focused on capturing candid, story-driven moments that highlight authentic emotion.",
                "focusAreas": ["Portrait Sessions", "Travel & Lifestyle", "Community Events"],
                "offerings": [
                    "One-on-one coaching for aspiring photographers",
                    "Creative direction for brand shoots",
                    "Hands-on editing workshops"
                ],
                "tools": ["Canon EOS R6", "Adobe Lightroom Classic", "Capture One Pro"]
            }
        ],
        "reviews": [
            {
                "id": 1,
                "reviewerName": "Jasmine R.",
                "reviewerInitials": "JR",
                "sessionType": "Portrait Masterclass",
                "rating": 5,
                "comment": "Suzuna breaks down complex photography concepts into approachable steps. I finally understand how to work with natural light thanks to her patient guidance.",
                "date": "October 2024"
            },
            {
                "id": 2,
                "reviewerName": "Marco L.",
                "reviewerInitials": "ML",
                "sessionType": "Creative Direction Coaching",
                "rating": 5,
                "comment": "The one-on-one coaching challenged me to think more critically about storytelling in my shoots. The personalized feedback was exactly what I needed to level up.",
                "date": "August 2024"
            },
            {
                "id": 3,
                "reviewerName": "Priya S.",
                "reviewerInitials": "PS",
                "sessionType": "Editing Workshop",
                "rating": 4,
                "comment": "Loved the real-time editing walkthroughs! I left with a Lightroom workflow I use every day. Hoping for a follow-up session focused on color grading.",
                "date": "June 2024"
            }
        ]
    }

# Endpoint to get a specific user's profile
@app.get("/api/profile/{username}")
async def get_user_profile(username: str):
    # This would be query database for the user's profile data
    mock_users = {
        "Suzuna_Kimura_1": {
            "firstName": "Suzuna",
            "lastName": "Kimura",
            "profilePicture": 'https://images6.alphacoders.com/337/thumb-1920-337780.jpg',
            "postsCount": 24,
            "followersCount": 156,
            "followingCount": 89,
            "wishList": ["Web Development", "Photography", "Cooking", "Guitar", "Programming", "Pilates"],
            "skills": [
                {
                    "name": "Photography",
                    "level": "Professional",
                    "yearsExperience": 6,
                    "description": "Lifestyle and portrait photographer focused on capturing candid, story-driven moments that highlight authentic emotion.",
                    "focusAreas": ["Portrait Sessions", "Travel & Lifestyle", "Community Events"],
                    "offerings": [
                        "One-on-one coaching for aspiring photographers",
                        "Creative direction for brand shoots",
                        "Hands-on editing workshops"
                    ],
                    "tools": ["Canon EOS R6", "Adobe Lightroom Classic", "Capture One Pro"]
                }
            ],
            "reviews": [
                {
                    "id": 1,
                    "reviewerName": "Jasmine R.",
                    "reviewerInitials": "JR",
                    "sessionType": "Portrait Masterclass",
                    "rating": 5,
                    "comment": "Suzuna breaks down complex photography concepts into approachable steps. I finally understand how to work with natural light thanks to her patient guidance.",
                    "date": "October 2024"
                },
                {
                    "id": 2,
                    "reviewerName": "Marco L.",
                    "reviewerInitials": "ML",
                    "sessionType": "Creative Direction Coaching",
                    "rating": 5,
                    "comment": "The one-on-one coaching challenged me to think more critically about storytelling in my shoots. The personalized feedback was exactly what I needed to level up.",
                    "date": "August 2024"
                },
                {
                    "id": 3,
                    "reviewerName": "Priya S.",
                    "reviewerInitials": "PS",
                    "sessionType": "Editing Workshop",
                    "rating": 4,
                    "comment": "Loved the real-time editing walkthroughs! I left with a Lightroom workflow I use every day. Hoping for a follow-up session focused on color grading.",
                    "date": "June 2024"
                }
            ]
        },
        "Maria_Ferdous_1": {
            "firstName": "Maria",
            "lastName": "Ferdous",
            "profilePicture": 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg',
            "postsCount": 32,
            "followersCount": 530,
            "followingCount": 29,
            "wishList": ["Web Development", "Chemistry", "Photography", "Cooking"],
            "skills": [],
            "reviews": []
        },
        "Noah_Alvarez_1": {
            "firstName": "Noah",
            "lastName": "Alvarez",
            "profilePicture": 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3CTw87kjAiRHrKO-IvKZtBI76VuTKcgKWeA&s',
            "postsCount": 45,
            "followersCount": 320,
            "followingCount": 124,
            "wishList": ["Python", "Machine Learning", "Cooking"],
            "skills": [],
            "reviews": []
        },
        "Gerardo_Rivera_1": {
            "firstName": "Gerardo",
            "lastName": "Rivera",
            "profilePicture": 'https://cdn.pixabay.com/photo/2022/08/17/15/46/labrador-7392840_640.jpg',
            "postsCount": 21,
            "followersCount": 402,
            "followingCount": 43,
            "wishList": ["Gaming", "Game Development"],
            "skills": [],
            "reviews": []
        }
    }
    
    # Return user data if exists, otherwise return a default profile
    if username in mock_users:
        return mock_users[username]
    else:
        return {
            "firstName": username,
            "lastName": "User",
            "bio": "",
            "profilePicture": None,
            "postsCount": 0,
            "followersCount": 0,
            "followingCount": 0,
            "wishList": [],
            "skills": [],
            "reviews": []
        }
