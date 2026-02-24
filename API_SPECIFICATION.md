# API Specification (API 명세서)

본 문서는 `k-chao-backoffice` (베트남 - 한국어 학습 앱 백오피스) 프로젝트의 백엔드 API 명세서 초안입니다.

## 1. 공통 사항 (Common)

### 응답 구조 (Response Structure)
모든 API 응답은 아래와 같은 표준 포맷을 따릅니다.

```json
{
  "success": true,
  "data": { ... }, // 성공 시 데이터 객체 또는 배열
  "pagination": {  // 목록 조회 시 페이징 정보 (선택적)
    "page": 1,
    "limit": 20,
    "totalCount": 100,
    "totalPages": 5
  },
  "error": null    // 실패 시 에러 객체 (success: false일 때)
}
```

### 에러 응답 (Error Response)
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지"
  }
}
```

---

## 2. 인증 (Authentication)

### 2.1 관리자 로그인
- **Endpoint**: `POST /api/auth/login`
- **Description**: 관리자 계정으로 로그인합니다.
- **Request Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- **Response**: `accessToken`, `refreshToken`, `adminProfile`

### 2.2 로그아웃
- **Endpoint**: `POST /api/auth/logout`
- **Description**: 현재 세션을 종료합니다.

### 2.3 토큰 갱신
- **Endpoint**: `POST /api/auth/refresh`
- **Description**: 만료된 Access Token을 갱신합니다.

---

## 3. 회원 관리 (User Management)

### 3.1 회원 목록 조회
- **Endpoint**: `GET /api/users`
- **Query Parameters**:
  - `page`: 페이지 번호 (기본: 1)
  - `limit`: 페이지 당 항목 수 (기본: 20)
  - `search`: 검색어 (이름, 이메일, 회원코드)
  - `status`: 상태 필터 (`ACTIVE`, `DORMANT`, `WITHDRAWN`)
  - `type`: 회원 유형 필터 (`FREE`, `PAID_INDIVIDUAL`, `PAID_GROUP`)
- **Response**: `User[]` (페이지네이션 포함)

### 3.2 회원 상세 조회
- **Endpoint**: `GET /api/users/:id`
- **Description**: 특정 회원의 상세 정보를 조회합니다.
- **Response**: `User` 객체

### 3.3 회원 정보 수정
- **Endpoint**: `PUT /api/users/:id`
- **Description**: 회원의 정보를 수정합니다 (관리자 권한).
- **Request Body**:
  ```json
  {
    "nickname": "new_nickname",
    "status": "ACTIVE",
    "memo": "관리자 메모"
  }
  ```

### 3.4 회원 강좌 배정 변경
- **Endpoint**: `POST /api/users/:id/assign-program`
- **Description**: 회원에게 새로운 학습 과정을 배정합니다.
- **Request Body**:
  ```json
  {
    "programId": "program_id",
    "reason": "관리자 변경"
  }
  ```

---

## 4. 단체(기관) 관리 (Organization Management)

### 4.1 단체 목록 조회
- **Endpoint**: `GET /api/groups`
- **Query Parameters**: `page`, `limit`, `search`, `type`
- **Response**: `Group[]`

### 4.2 단체 등록
- **Endpoint**: `POST /api/groups`
- **Request Body**:
  ```json
  {
    "name": "안장 대학교",
    "type": "SCHOOL",
    "representative": "홍길동",
    "adminEmail": "admin@anyang.edu",
    "contractStart": "2024-01-01",
    "contractEnd": "2024-12-31",
    "assignedProgramIds": ["program_1", "program_2"]
  }
  ```

### 4.3 단체 상세 조회
- **Endpoint**: `GET /api/groups/:id`
- **Response**: `Group` 객체 (소속 교사 및 학생 통계 포함)

### 4.4 단체 정보 수정
- **Endpoint**: `PUT /api/groups/:id`

---

## 5. 학습 관리 (Learning Management)

이 섹션은 `Program` -> `Course` -> `Unit` -> `Lesson` -> `Activity` 계층 구조를 따릅니다.

### 5.1 프로그램 (Program)
- **목록 조회**: `GET /api/programs`
- **상세 조회**: `GET /api/programs/:id`
- **생성**: `POST /api/programs`
- **수정**: `PUT /api/programs/:id`
- **삭제**: `DELETE /api/programs/:id`

### 5.2 코스 (Course)
- **목록 조회**: `GET /api/programs/:programId/courses`
- **생성**: `POST /api/courses`
- **순서 변경**: `PUT /api/courses/reorder` (코스 간 순서 변경)

### 5.3 유닛 (Unit)
- **목록 조회**: `GET /api/courses/:courseId/units`
- **생성**: `POST /api/units`

### 5.4 레슨 (Lesson)
- **목록 조회**: `GET /api/units/:unitId/lessons` (또는 유닛 없이 전체 레슨 조회)
- **상세 조회**: `GET /api/lessons/:id`
- **생성**: `POST /api/lessons`
- **수정**: `PUT /api/lessons/:id`

### 5.5 액티비티 (Activity)
액티비티는 `Lesson`에 종속되며, 템플릿(`Template`) 기반으로 생성됩니다.

- **레슨 내 액티비티 목록 조회**: `GET /api/lessons/:lessonId/activities`
- **액티비티 생성**: `POST /api/activities`
  - **Request Body**:
    ```json
    {
      "lessonId": "lesson_id",
      "templateId": "TEMPLATE_ID", // 예: 'PRONUNCIATION'
      "type": "SPEAKING",
      "title": "발음 연습 1",
      "content": { ... } // 템플릿 스키마에 맞는 JSON 데이터
    }
    ```
- **액티비티 상세 조회**: `GET /api/activities/:id`
- **액티비티 수정**: `PUT /api/activities/:id`
- **액티비티 삭제**: `DELETE /api/activities/:id`
- **액티비티 순서 변경**: `PUT /api/lessons/:lessonId/activities/reorder`

### 5.6 템플릿 (Template)
- **템플릿 목록 조회**: `GET /api/templates`
- **템플릿 상세 조회**: `GET /api/templates/:id`
- **Note**: 템플릿은 주로 하드코딩된 시스템 데이터이거나 DB화되어 관리될 수 있습니다.

---

## 6. 보상 관리 (Reward Management)

### 6.1 보상 지급 내역 조회
- **Endpoint**: `GET /api/rewards/history`
- **Query Parameters**: `userId`, `category` (LIGHTNING/FLAME), `startDate`, `endDate`

### 6.2 보상 지급 (수동)
- **Endpoint**: `POST /api/rewards/grant`
- **Request Body**:
  ```json
  {
    "userIds": ["user_1", "user_2"],
    "category": "LIGHTNING",
    "amount": 100,
    "reason": "이벤트 당첨",
    "validDays": 30
  }
  ```

---

## 7. 게시판 및 고객지원 (Support)

### 7.1 1:1 문의 목록 조회
- **Endpoint**: `GET /api/inquiries`
- **Query Parameters**: `status` (PENDING/ANSWERED)

### 7.2 문의 상세 및 답변 등록
- **Endpoint**: `GET /api/inquiries/:id`
- **답변 등록**: `POST /api/inquiries/:id/answer`
  ```json
  {
    "content": "문의하신 내용에 대한 답변입니다..."
  }
  ```

### 7.3 FAQ 관리
- **목록 조회**: `GET /api/faqs`
- **생성**: `POST /api/faqs`
- **수정/삭제**: `PUT/DELETE /api/faqs/:id`

---

## 8. 정산 및 통계 (Finance & Stats)

### 8.1 정산 내역 조회
- **Endpoint**: `GET /api/settlements`
- **Query Parameters**: `startDate`, `endDate`, `platform`

### 8.2 대시보드 통계
- **Endpoint**: `GET /api/stats/dashboard`
- **Response**:
  ```json
  {
    "totalUsers": 12500,
    "activeUsers": 8900,
    "monthlyRevenue": 50000000,
    "newInquiries": 5
  }
  ```

---

## 9. 시스템 관리 (System)

### 9.1 관리자 계정 관리
- **목록 조회**: `GET /api/admins`
- **계정 생성**: `POST /api/admins`
- **권한 수정**: `PUT /api/admins/:id/permissions`
