# Cerebro Admin

Admin dashboard for tracking events, data analytics, and issues management.

## Project Structure

```
CerebroAdmin/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── api/      # API routes
│   │   ├── models/   # Database models
│   │   ├── dto/      # Data transfer objects
│   │   ├── services/ # Business logic
│   │   ├── config/   # Configuration
│   │   └── database/ # Database connection
│   ├── requirements.txt
│   └── .env
└── frontend/         # React frontend
    ├── src/
    │   ├── pages/    # Admin pages
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── .env
```

## Features

- **Events Tracking**: Monitor system events with filtering and search
- **Issues Management**: Create, track, and manage system issues
- **Analytics Dashboard**: View platform statistics and performance metrics
- **Data Visualization**: Charts and graphs for insights

## Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure `.env` file with your database URL and API keys

5. Run the server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `GET /api/admin/analytics/overview` - Dashboard overview statistics
- `GET /api/admin/events` - List events with filtering
- `POST /api/admin/events` - Create new event
- `GET /api/admin/issues` - List issues with filtering
- `POST /api/admin/issues` - Create new issue
- `PATCH /api/admin/issues/{id}` - Update issue
- `GET /api/admin/analytics/courses` - Course analytics
- `GET /api/admin/analytics/users` - User engagement metrics

## Tech Stack

**Backend:**
- FastAPI
- SQLAlchemy (async)
- PostgreSQL
- Pydantic

**Frontend:**
- React
- React Router
- Axios
- Recharts (for data visualization)
- Tailwind CSS
- Lucide React (icons)

## Database Models

- **Event**: Track system events with type, severity, and metadata
- **Issue**: Manage issues with status, priority, and category

## License

MIT
