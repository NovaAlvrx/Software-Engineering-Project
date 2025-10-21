# SkillShare Server

FastAPI backend server for SkillShare application.

## Setup

1. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On macOS/Linux
# OR
venv\Scripts\activate  # On Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

Make sure your virtual environment is activated, then run:

```bash
uvicorn main:app --reload
```

The server will start at `http://localhost:8000`

- API documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

## Development

The `--reload` flag enables auto-reload when you make code changes during development.

