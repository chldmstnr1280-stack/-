# SELLERY API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Auth API

### POST /api/auth/register
회원가입

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "age": 25,
  "isHSP": true,
  "hspAnswers": [3, 4, 3, 4, 3]
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "홍길동",
    "age": 25,
    "isHSP": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400`: Validation error
- `409`: User already exists

---

### POST /api/auth/login
로그인

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "홍길동",
    "age": 25,
    "isHSP": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400`: Validation error
- `401`: Invalid credentials

---

## Emotion API
🔒 All endpoints require authentication

### POST /api/emotions
감정 로그 생성

**Request Body:**
```json
{
  "text": "오늘 기분이 좋았어요",
  "emoji": "😊",
  "color": "#FFD700",
  "temperature": 75,
  "activities": {
    "steps": 8000,
    "distance": 5.2,
    "activeMinutes": 45,
    "sleepHours": 7.5
  }
}
```

**Response (201):**
```json
{
  "message": "Emotion log created successfully",
  "emotion": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "text": "오늘 기분이 좋았어요",
    "emoji": "😊",
    "color": "#FFD700",
    "temperature": 75,
    "activities": {
      "steps": 8000,
      "distance": 5.2,
      "activeMinutes": 45,
      "sleepHours": 7.5
    },
    "date": "2025-11-10T12:00:00.000Z",
    "createdAt": "2025-11-10T12:00:00.000Z",
    "updatedAt": "2025-11-10T12:00:00.000Z"
  }
}
```

---

### GET /api/emotions
감정 로그 목록 조회

**Query Parameters:**
- `limit`: 페이지당 항목 수 (default: 20)
- `skip`: 건너뛸 항목 수 (default: 0)

**Example:**
```
GET /api/emotions?limit=10&skip=0
```

**Response (200):**
```json
{
  "emotions": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "text": "오늘 기분이 좋았어요",
      "emoji": "😊",
      "color": "#FFD700",
      "temperature": 75,
      "date": "2025-11-10T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 10,
    "skip": 0,
    "hasMore": true
  }
}
```

---

### GET /api/emotions/:id
특정 감정 로그 조회

**Response (200):**
```json
{
  "emotion": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "text": "오늘 기분이 좋았어요",
    "emoji": "😊",
    "color": "#FFD700",
    "temperature": 75,
    "date": "2025-11-10T12:00:00.000Z"
  }
}
```

**Errors:**
- `404`: Emotion not found

---

### DELETE /api/emotions/:id
감정 로그 삭제

**Response (200):**
```json
{
  "message": "Emotion log deleted successfully"
}
```

**Errors:**
- `404`: Emotion not found

---

## Routine API
🔒 All endpoints require authentication

### POST /api/routines
루틴 완료 기록

**Request Body:**
```json
{
  "routineId": "meditation_morning",
  "type": "meditation",
  "startedAt": "2025-11-10T08:00:00.000Z",
  "completedAt": "2025-11-10T08:15:00.000Z",
  "duration": 900,
  "rating": 5
}
```

**Response (201):**
```json
{
  "message": "Routine record created successfully",
  "routine": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "routineId": "meditation_morning",
    "type": "meditation",
    "startedAt": "2025-11-10T08:00:00.000Z",
    "completedAt": "2025-11-10T08:15:00.000Z",
    "duration": 900,
    "rating": 5,
    "createdAt": "2025-11-10T08:15:00.000Z"
  }
}
```

---

### GET /api/routines
루틴 목록 조회

**Query Parameters:**
- `type`: 루틴 타입 필터 (meditation/breathing/activity)
- `limit`: 페이지당 항목 수 (default: 20)
- `skip`: 건너뛸 항목 수 (default: 0)

**Example:**
```
GET /api/routines?type=meditation&limit=10
```

**Response (200):**
```json
{
  "routines": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": "507f1f77bcf86cd799439011",
      "routineId": "meditation_morning",
      "type": "meditation",
      "duration": 900,
      "rating": 5,
      "completedAt": "2025-11-10T08:15:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 10,
    "skip": 0,
    "hasMore": true
  }
}
```

---

### GET /api/routines/stats
루틴 통계 조회

**Response (200):**
```json
{
  "stats": {
    "totalCount": 25,
    "avgRating": 4.5,
    "byType": {
      "meditation": 10,
      "breathing": 8,
      "activity": 7
    }
  }
}
```

---

## Survey API
🔒 All endpoints require authentication

### POST /api/surveys
설문 결과 저장

**Request Body (PHQ-9):**
```json
{
  "type": "phq9",
  "responses": [
    { "questionId": "phq9_q1", "value": 1 },
    { "questionId": "phq9_q2", "value": 2 },
    { "questionId": "phq9_q3", "value": 1 },
    { "questionId": "phq9_q4", "value": 0 },
    { "questionId": "phq9_q5", "value": 1 },
    { "questionId": "phq9_q6", "value": 2 },
    { "questionId": "phq9_q7", "value": 1 },
    { "questionId": "phq9_q8", "value": 0 },
    { "questionId": "phq9_q9", "value": 1 }
  ],
  "totalScore": 9,
  "severity": "mild"
}
```

**Response (201):**
```json
{
  "message": "Survey result saved successfully",
  "survey": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "type": "phq9",
    "responses": [...],
    "totalScore": 9,
    "severity": "mild",
    "completedAt": "2025-11-10T12:00:00.000Z",
    "createdAt": "2025-11-10T12:00:00.000Z"
  }
}
```

**Severity Levels:**
- PHQ-9: minimal (0-4), mild (5-9), moderate (10-14), severe (15-27)
- GAD-7: minimal (0-4), mild (5-9), moderate (10-14), severe (15-21)

---

### GET /api/surveys
설문 목록 조회

**Query Parameters:**
- `type`: 설문 타입 (phq9/gad7)
- `limit`: 항목 수 (default: 10)

**Example:**
```
GET /api/surveys?type=phq9&limit=5
```

**Response (200):**
```json
{
  "surveys": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "type": "phq9",
      "totalScore": 9,
      "severity": "mild",
      "completedAt": "2025-11-10T12:00:00.000Z"
    }
  ]
}
```

---

### GET /api/surveys/latest
최근 설문 결과 조회

**Response (200):**
```json
{
  "phq9": {
    "_id": "507f1f77bcf86cd799439014",
    "type": "phq9",
    "totalScore": 9,
    "severity": "mild",
    "completedAt": "2025-11-10T12:00:00.000Z"
  },
  "gad7": {
    "_id": "507f1f77bcf86cd799439015",
    "type": "gad7",
    "totalScore": 7,
    "severity": "mild",
    "completedAt": "2025-11-10T12:00:00.000Z"
  }
}
```

---

### GET /api/surveys/trend
설문 추이 데이터

**Query Parameters:**
- `type`: 설문 타입 (phq9/gad7) - **required**
- `weeks`: 주 수 (default: 4)

**Example:**
```
GET /api/surveys/trend?type=phq9&weeks=4
```

**Response (200):**
```json
{
  "type": "phq9",
  "weeks": 4,
  "data": [
    {
      "date": "2025-10-14T12:00:00.000Z",
      "score": 12,
      "severity": "moderate"
    },
    {
      "date": "2025-10-21T12:00:00.000Z",
      "score": 10,
      "severity": "moderate"
    },
    {
      "date": "2025-10-28T12:00:00.000Z",
      "score": 8,
      "severity": "mild"
    },
    {
      "date": "2025-11-04T12:00:00.000Z",
      "score": 6,
      "severity": "mild"
    }
  ]
}
```

---

## Selly API
🔒 All endpoints require authentication

### GET /api/selly
셀리 상태 조회

**Response (200):**
```json
{
  "selly": {
    "_id": "507f1f77bcf86cd799439016",
    "userId": "507f1f77bcf86cd799439011",
    "stage": "flower",
    "style": "green",
    "experience": 350,
    "createdAt": "2025-11-03T12:00:00.000Z",
    "updatedAt": "2025-11-10T12:00:00.000Z"
  }
}
```

**Stages:**
- `seed`: 0-99 XP
- `sprout`: 100-299 XP
- `flower`: 300-499 XP
- `baby`: 500+ XP

**Styles:**
- `green`: 초록색
- `pink`: 분홍색
- `blue`: 파란색

---

### PATCH /api/selly
셀리 상태 업데이트

**Request Body:**
```json
{
  "style": "pink",
  "experience": 400
}
```

**Response (200):**
```json
{
  "message": "Selly updated successfully",
  "selly": {
    "_id": "507f1f77bcf86cd799439016",
    "userId": "507f1f77bcf86cd799439011",
    "stage": "flower",
    "style": "pink",
    "experience": 400,
    "updatedAt": "2025-11-10T12:00:00.000Z"
  }
}
```

---

### POST /api/selly/experience
경험치 추가 (자동 진화)

**Request Body:**
```json
{
  "amount": 30
}
```

**Response (200):**
```json
{
  "message": "Experience added successfully",
  "selly": {
    "_id": "507f1f77bcf86cd799439016",
    "userId": "507f1f77bcf86cd799439011",
    "stage": "flower",
    "style": "green",
    "experience": 380,
    "updatedAt": "2025-11-10T12:00:00.000Z"
  },
  "evolved": false
}
```

**Evolution Logic:**
- Automatically evolves when experience reaches milestone
- Returns `evolved: true` if stage changed

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation Error",
  "message": [...]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Conflict",
  "message": "User with this email already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

---

## Rate Limiting
Currently no rate limiting is implemented. Consider adding rate limiting in production.

## CORS
CORS is enabled for all origins in development. Configure properly for production.

## Environment Variables
```bash
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sellery
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

---

**Version**: 1.0.0
**Last Updated**: 2025-11-10
