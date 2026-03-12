# Koosen Club Web – System Diagrams

All diagrams use [Mermaid](https://mermaid.js.org/) syntax. Render in VS Code (Mermaid extension), GitHub, or [mermaid.live](https://mermaid.live).

---

## 1. Structural Diagram (Package / Module Structure)

Shows the high-level organization of the application into packages and modules.

```mermaid
flowchart TB
    subgraph App["App (root)"]
        A[App.jsx]
    end

    subgraph Pages["pages/"]
        P1[Home.jsx]
        P2[MainPage.jsx]
        P3[LoginPage.jsx]
    end

    subgraph MainPageComponents["mainPageComponents/"]
        M1[ClubSearchPage]
        M2[ClubDetailPage]
        M3[TimeSchedulePage]
        M4[CreateClub]
        M5[FeedbackPage]
    end

    subgraph Components["components/"]
        C1[ClubBlocks]
        C2[ClubTextBlock]
        C3[ClubCustomizer]
        C4[ClubMemberManager]
        C5[ClubRoomManager]
        C6[Filter]
        C7[ConfirmModal]
        C8[ClubSchedules]
        C9[SubjectSchedules]
    end

    subgraph Services["services/"]
        S1[authService]
        S2[clubService]
        S3[clubJoinRequestService]
        S4[clubTextBlockService]
        S5[createClubRequestService]
        S6[feedbackService]
        S7[siteAssetService]
        S8[studentService]
    end

    subgraph MockData["assets/mockdata/"]
        D1[clubsInfo/]
        D2[classInfo/]
        D3[users, rooms, siteAssets, feedback]
    end

    subgraph Utils["utils/"]
        U1[devLog]
        U2[scheduleGenerator]
    end

    A --> P1
    A --> P2
    A --> P3
    P2 --> M1
    P2 --> M2
    P2 --> M3
    P2 --> M4
    P2 --> M5
    M1 --> C1
    M1 --> C6
    M2 --> C2
    M2 --> C3
    M2 --> C4
    M2 --> C5
    M2 --> C7
    M3 --> C8
    M3 --> C9
    M1 --> S2
    M2 --> S2
    M2 --> S3
    M2 --> S4
    M4 --> S2
    M4 --> S5
    M5 --> S6
    P2 --> S7
    P3 --> S1
    S2 --> D1
    S3 --> D1
    S4 --> D1
    S5 --> D1
    S6 --> D3
    S1 --> D3
```

---

## 2. Object Diagram (Snapshot at Runtime)

Shows a typical runtime snapshot: one user, one club, and related objects.

```mermaid
flowchart LR
    subgraph Objects["Object instances (example snapshot)"]
        U[user: User<br/>id=1, name=Student A<br/>role=3]
        C[club: Club<br/>id=4, name=Воллейболын секц<br/>type=sport, max=30]
        CM[clubMember: ClubMember<br/>club_id=4, student_id=1<br/>role=leader]
        CJR[clubJoinRequest: ClubJoinRequest<br/>club_id=4, student_id=2<br/>status=pending]
        CTB[clubTextBlock: ClubTextBlock<br/>club_id=4, title=Дүрэм<br/>order_index=0]
    end

    U -->|"1"| CM
    C -->|"1"| CM
    C -->|"*"| CJR
    C -->|"*"| CTB
```

---

## 3. ER Diagram (Entity–Relationship)

Entities and relationships for the data layer (mock/DB).

```mermaid
erDiagram
    User ||--o{ ClubMember : "has"
    User ||--o{ ClubJoinRequest : "requests"
    User ||--o{ CreateClubRequest : "creates"
    User ||--o{ Feedback : "submits"

    Club ||--|{ ClubMember : "has"
    Club ||--o{ ClubJoinRequest : "receives"
    Club ||--|{ ClubTextBlock : "has"
    Club ||--o{ ClubScheduleDay : "has"
    Club ||--o{ ClubScheduleTime : "has"
    Club ||--|{ ClubAllowedCollegeYears : "has"
    Club ||--|{ ClubAllowedEngineerClasses : "has"
    Club }o--|| Room : "uses"

    User {
        int id PK
        string email
        string password
        string name
        int class_id FK
        int role
    }

    Club {
        int id PK
        string type
        string name
        int maximum_member
        string main_media_url
        int room_id FK
    }

    ClubMember {
        int club_id PK,FK
        int student_id PK,FK
        int role
    }

    ClubJoinRequest {
        int id PK
        int club_id FK
        int student_id FK
        int status
        date requested_date
        int reviewed_by FK
    }

    CreateClubRequest {
        int id PK
        int requester_id FK
        string name
        string type
        string goal
        int maximum_member
        int status
        date requested_date
        int reviewed_by FK
    }

    ClubTextBlock {
        int id PK
        int club_id FK
        string title
        string content
        string media_url
        string media_type
        int order_index
    }

    ClubScheduleDay {
        int club_id PK,FK
        int day_of_week
    }

    ClubScheduleTime {
        int club_id PK,FK
        string start_time
        string end_time
    }

    ClubAllowedCollegeYears {
        int club_id FK
        int college_year
    }

    ClubAllowedEngineerClasses {
        int club_id FK
        string engineer_class
    }

    Room {
        int id PK
        boolean allowed_for_club
    }

    Feedback {
        int id PK
        int user_id FK
        string content
        date requested_date
        int status
    }

    Class {
        string id PK
        int teacher_id FK
        int room_id FK
    }

    Subject {
        int id PK
        string subject_name
        int teacher_id FK
        int room_id FK
    }

    SubjectSchedule {
        int id PK
        int subject_id FK
        string class_id FK
        boolean fixed
        int day_of_week
        int start_period
    }
```

---

## 4. Class Diagram (Domain & Services)

Domain entities and service facades with main operations.

```mermaid
classDiagram
    class User {
        +int id
        +string email
        +string name
        +int class_id
        +int role
    }

    class Club {
        +int id
        +string type
        +string name
        +int maximum_member
        +string main_media_url
        +int room_id
    }

    class ClubMember {
        +int club_id
        +int student_id
        +int role
    }

    class ClubJoinRequest {
        +int id
        +int club_id
        +int student_id
        +int status
        +date requested_date
    }

    class ClubTextBlock {
        +int id
        +int club_id
        +string title
        +string content
        +int order_index
    }

    class authService {
        +login(email, password)
        +logout()
        +getCurrentUser()
        +validateSession()
    }

    class clubService {
        +getAll()
        +getById(id)
        +createClubWithPlaceholders(data)
        +update(id, data)
        +joinClub(clubId, userId)
        +getMembers(clubId)
        +removeMember(clubId, userId)
        +canEditClub(clubId, user)
        +canDeleteClub(clubId, user)
        +isMember(clubId, userId)
        +isLeader(clubId, userId)
        +canJoinClub(clubId, user)
        +hasPendingRequest(clubId, userId)
    }

    class clubJoinRequestService {
        +getByClubId(clubId)
        +getByUserId(userId)
        +hasPendingRequest(clubId, userId)
        +sendRequest(clubId, userId)
        +approveRequest(requestId)
        +rejectRequest(requestId)
    }

    class clubTextBlockService {
        +getByClubId(clubId)
        +create(clubId, data)
        +update(id, data)
        +delete(id)
        +reorder(clubId, orderedIds)
    }

    class createClubRequestService {
        +create(data)
        +getByUserId(userId)
        +getById(id)
        +getAll()
        +approve(id)
        +reject(id)
    }

    class feedbackService {
        +create(userId, content)
        +getByUserId(userId)
        +getAll()
        +markRead(id)
        +delete(id)
    }

    class siteAssetService {
        +getUrl(key)
        +getHomeBackgroundUrl()
        +getLoginBackgroundUrl()
        +getLogoUrl()
    }

    User "1" --> "*" ClubMember : member of
    Club "1" --> "*" ClubMember : has
    Club "1" --> "*" ClubJoinRequest : has
    Club "1" --> "*" ClubTextBlock : has
    User "1" --> "*" Feedback : submits
    clubService ..> Club : manages
    clubJoinRequestService ..> ClubJoinRequest : manages
    clubTextBlockService ..> ClubTextBlock : manages
    createClubRequestService ..> Club : creates
    feedbackService ..> Feedback : manages
    authService ..> User : authenticates
```

---

## 5. Component Diagram (Software Components & Dependencies)

High-level components and their dependencies.

```mermaid
flowchart TB
    subgraph Client["Client (Browser)"]
        App[App]

        subgraph Pages["Pages"]
            Home[Home]
            MainPage[MainPage]
            LoginPage[LoginPage]
        end

        subgraph Screens["Main Screens"]
            ClubSearchPage[ClubSearchPage]
            ClubDetailPage[ClubDetailPage]
            TimeSchedulePage[TimeSchedulePage]
            CreateClub[CreateClub]
            FeedbackPage[FeedbackPage]
        end

        subgraph UI["UI Components"]
            ClubBlocks[ClubBlocks]
            ClubTextBlock[ClubTextBlock]
            ClubCustomizer[ClubCustomizer]
            ClubMemberManager[ClubMemberManager]
            ClubRoomManager[ClubRoomManager]
            Filter[Filter]
            ConfirmModal[ConfirmModal]
            ClubSchedules[ClubSchedules]
            SubjectSchedules[SubjectSchedules]
        end
    end

    subgraph Services["Service Layer"]
        authService[authService]
        clubService[clubService]
        clubJoinRequestService[clubJoinRequestService]
        clubTextBlockService[clubTextBlockService]
        createClubRequestService[createClubRequestService]
        feedbackService[feedbackService]
        siteAssetService[siteAssetService]
        studentService[studentService]
    end

    subgraph Data["Data (Mock / API)"]
        MockData[(Mock Data)]
        API["/api (optional)"]
    end

    App --> Home
    App --> MainPage
    App --> LoginPage
    MainPage --> ClubSearchPage
    MainPage --> ClubDetailPage
    MainPage --> TimeSchedulePage
    MainPage --> CreateClub
    MainPage --> FeedbackPage

    ClubSearchPage --> ClubBlocks
    ClubSearchPage --> Filter
    ClubDetailPage --> ClubTextBlock
    ClubDetailPage --> ClubCustomizer
    ClubDetailPage --> ClubMemberManager
    ClubDetailPage --> ClubRoomManager
    ClubDetailPage --> ConfirmModal
    TimeSchedulePage --> ClubSchedules
    TimeSchedulePage --> SubjectSchedules

    LoginPage --> authService
    ClubSearchPage --> clubService
    ClubDetailPage --> clubService
    ClubDetailPage --> clubJoinRequestService
    ClubDetailPage --> clubTextBlockService
    CreateClub --> clubService
    CreateClub --> createClubRequestService
    FeedbackPage --> feedbackService
    MainPage --> siteAssetService

    authService --> MockData
    authService --> API
    clubService --> MockData
    clubService --> API
    clubJoinRequestService --> MockData
    clubTextBlockService --> MockData
    createClubRequestService --> MockData
    feedbackService --> MockData
    siteAssetService --> MockData
```

---

## 6. Use Case Diagram

Actors and use cases for Koosen Club Web.

```mermaid
flowchart LR
    subgraph Actors["Actors"]
        Guest[Guest]
        Student[Student]
        Teacher[Teacher]
        Admin[Admin]
    end

    subgraph UseCases["Use Cases"]
        UC1[View Home]
        UC2[Login]
        UC3[Browse Clubs]
        UC4[View Club Detail]
        UC5[Join Club]
        UC6[Request to Create Club]
        UC7[Create Club Directly]
        UC8[Manage Club]
        UC9[Submit Feedback]
        UC10[View Schedules]
        UC11[Approve/Reject Join Requests]
        UC12[Approve/Reject Create Club Requests]
        UC13[Manage Feedback]
    end

    Guest --> UC1
    Guest --> UC2
    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6
    Student --> UC9
    Student --> UC10
    Teacher --> UC3
    Teacher --> UC4
    Teacher --> UC10
    Admin --> UC7
    Admin --> UC8
    Admin --> UC11
    Admin --> UC12
    Admin --> UC13

    UC4 -.->|include| UC3
    UC8 -.->|include| UC4
    UC5 -.->|include| UC4
```

---

## 7. Sequence Diagram – Login

Interaction between user, LoginPage, authService, and App.

```mermaid
sequenceDiagram
    actor User
    participant LoginPage
    participant authService
    participant App

    User->>LoginPage: Enter email & password, click Login
    LoginPage->>authService: login(email, password)
    alt Success
        authService-->>LoginPage: user object
        LoginPage->>App: onLogin(user)
        App->>App: setUser(user), setPage('main')
        App->>User: Show MainPage
    else Failure
        authService-->>LoginPage: error
        LoginPage->>User: Show error message
    end
```

---

## 8. Sequence Diagram – Join Club

User requests to join a club; leader can approve/reject.

```mermaid
sequenceDiagram
    actor Student
    participant ClubDetailPage
    participant clubJoinRequestService
    participant clubService

    Student->>ClubDetailPage: Click "Нэгдэх" (Join)
    ClubDetailPage->>clubJoinRequestService: hasPendingRequest(clubId, userId)
    clubJoinRequestService-->>ClubDetailPage: false
    ClubDetailPage->>clubJoinRequestService: sendRequest(clubId, userId)
    clubJoinRequestService-->>ClubDetailPage: request created
    ClubDetailPage->>Student: Show "Хүсэлт илгээгдсэн"

    Note over Student, clubService: Leader opens club, sees pending requests

    actor Leader
    Leader->>ClubDetailPage: Open Members / Join requests
    ClubDetailPage->>clubJoinRequestService: getByClubId(clubId)
    clubJoinRequestService-->>ClubDetailPage: list of requests
    Leader->>ClubDetailPage: Click Approve
    ClubDetailPage->>clubJoinRequestService: approveRequest(requestId)
    clubJoinRequestService->>clubService: (add member)
    clubJoinRequestService-->>ClubDetailPage: updated
    ClubDetailPage->>Leader: Request removed, member added
```

---

## 9. Activity Diagram – Club Join Flow

Decisions and steps for joining a club.

```mermaid
flowchart TD
    A[User opens Club Detail] --> B{Logged in?}
    B -->|No| C[Show Login prompt / redirect]
    B -->|Yes| D{Already member?}
    D -->|Yes| E[Show "Та аль хэдийн гишүүн"]
    D -->|No| F{Pending request?}
    F -->|Yes| G[Show "Хүсэлт илгээгдсэн"]
    F -->|No| H{Can join?<br/>year/class allowed}
    H -->|No| I[Show "Элссэн боломжгүй"]
    H -->|Yes| J[User clicks Join]
    J --> K[clubJoinRequestService.sendRequest]
    K --> L[Show success message]
```

---

## 10. Activity Diagram – Create Club (Student vs Admin)

Student submits request; admin approves or creates directly.

```mermaid
flowchart TD
    A[User goes to Create Club] --> B{Role?}
    B -->|Student| C[Fill form: name, type, goal, max members]
    C --> D[createClubRequestService.create]
    D --> E[Status: Pending]
    E --> F[Admin reviews list]
    F --> G{Approve or Reject?}
    G -->|Approve| H[createClubRequestService.approve]
    H --> I[clubService.createClubWithPlaceholders]
    I --> J[Club created, requester = leader]
    G -->|Reject| K[createClubRequestService.reject]

    B -->|Admin| L[Fill same form]
    L --> M[Create directly]
    M --> N[clubService.createClubWithPlaceholders]
    N --> J
```

---

## 11. Deployment Diagram

How the application is deployed (browser, Vite build, optional backend).

```mermaid
flowchart TB
    subgraph UserDevice["User Device"]
        Browser["Browser\n(React SPA)"]
    end

    subgraph Build["Build (Vite)"]
        Vite[Vite]
        Bundle["Static bundle\n(JS, CSS, index.html)"]
        Vite --> Bundle
    end

    subgraph Runtime["Runtime"]
        WebServer["Web Server\n(static files)"]
        OptionalAPI["Optional Backend\n(/api)\nUSE_BACKEND=true"]
    end

    subgraph DataStore["Data"]
        MockData["Mock data\n(in bundle)"]
        BackendDB["Backend DB\n(if USE_BACKEND)"]
    end

    UserDevice --> |"HTTPS"| WebServer
    WebServer --> |"Serves"| Bundle
    Browser --> |"Loads"| Bundle
    Browser --> |"API calls"| OptionalAPI
    OptionalAPI --> BackendDB
    Bundle --> |"Uses when no backend"| MockData
```

---

## Summary

| Diagram            | Section | Description                                              |
|--------------------|---------|----------------------------------------------------------|
| Structural         | 1       | Package/module structure (pages, components, services).  |
| Object             | 2       | Example runtime snapshot (user, club, members, requests).|
| ER                 | 3       | Entities and relationships for data layer.               |
| Class              | 4       | Domain classes and service facades with methods.         |
| Component          | 5       | Software components and dependencies.                    |
| Use case           | 6       | Actors and use cases.                                    |
| Sequence (Login)   | 7       | Login flow.                                               |
| Sequence (Join)   | 8       | Join club and approve request flow.                      |
| Activity (Join)   | 9       | Club join decisions and steps.                           |
| Activity (Create) | 10      | Create club (student request vs admin direct).           |
| Deployment         | 11      | Browser, Vite, static server, optional API.              |
