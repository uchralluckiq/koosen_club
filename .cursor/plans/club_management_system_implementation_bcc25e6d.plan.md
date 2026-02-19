---
name: Club Management System Implementation
overview: Build a comprehensive club management website with role-based access (no login, student, teacher, admin), customizable club displays, subject schedules, and account management features. All features will use mock data/services that can later integrate with PostgreSQL via Node.js backend.
todos: []
isProject: false
---

# Club Management System Implementation Plan

## Overview

This plan implements a full-featured club management system with 4 user roles, customizable club displays, subject schedules, and comprehensive account management. All data operations use mock services in `src/services/` and mock data in `src/assets/mockdata/` for future PostgreSQL integration.

## Architecture

### User Roles & Permissions

- **No Login User**: Browse clubs, view school-wide schedule, login
- **Student**: Browse clubs, personalized schedule, edit own clubs, join requests, create club, account management
- **Teacher**: Browse clubs, personalized schedule, request schedule changes, account management (cannot join clubs)
- **Admin**: Full access - edit all clubs, manage users (add/delete students/teachers), modify schedules

### Data Flow

```
User Action → Service Layer (src/services/) → Mock Data (src/assets/mockdata/) → UI Update
```

## Implementation Tasks

### 1. Authentication & User Management

**Files to create/modify:**

- `src/services/authService.js` - Authentication service with login/logout
- `src/services/userService.js` - User CRUD operations
- `src/contexts/AuthContext.jsx` - React context for auth state
- `src/pages/LoginPage.jsx` - Update to use authService
- `src/assets/mockdata/teachers.js` - Teacher mock data
- `src/assets/mockdata/helpRequests.js` - Help/report requests mock data

**Features:**

- Login with email/password
- Session management (localStorage)
- Role-based route protection
- User profile management

### 2. Club Detail Page & Customization

**Files to create/modify:**

- `src/mainPageComponents/ClubDetailPage.jsx` - Detailed club view with customizable blocks
- `src/components/ClubTextBlock.jsx` - Reusable text block component
- `src/components/ClubCustomizer.jsx` - Club editing interface for owners
- `src/services/clubService.js` - Add update/create/delete methods
- `src/services/clubTextBlockService.js` - Manage club text blocks

**Features:**

- Display club with customizable text blocks (from `clubTextBlocks` mockdata)
- Visual customization (colors, layout arrangement)
- Edit mode for club owners/admins
- Media support (images/videos) in text blocks
- Social media account link is can be added and functional

### 3. Subject Schedule System

**Files to create/modify:**

- `src/services/scheduleService.js` - Subject schedule operations
- `src/services/subjectService.js` - Subject management
- `src/mainPageComponents/TimeSchedulePage.jsx` - Update to show subject schedules
- `src/components/SubjectScheduleView.jsx` - Reusable schedule component
- `src/assets/mockdata/subjectSchedules.js` - Subject schedule mock data (if needed)

**Features:**

- School-wide schedule view (default)
- Personalized schedule for logged-in students/teachers
- Teacher schedule change requests
- Admin schedule modification

### 4. Club Management Features

**Files to create/modify:**

- `src/services/clubJoinRequestService.js` - Join request management
- `src/components/JoinRequestButton.jsx` - Join request UI
- `src/components/ClubCreationForm.jsx` - Create new club form
- `src/pages/ClubDetailPage.jsx` - Add join request functionality

**Features:**

- Club owner can student or teacher
- Send join requests (students only)
- Approve/reject requests (club owners/admins)
- Create new clubs (students/teachers/admins)
- Edit own clubs (club owners)
- Manage join requests (club owners/admins)

### 5. Account Section

**Files to create/modify:**

- `src/pages/AccountPage.jsx` - Account management page
- `src/components/PasswordChangeForm.jsx` - Password change component
- `src/components/HelpRequestForm.jsx` - Help/report request form
- `src/services/helpRequestService.js` - Help request management
- `src/pages/MainPage.jsx` - Add account navigation link

**Features:**

- Change password
- Create club (for students)
- Submit help/report requests
- View user profile

### 6. Admin Panel

**Files to create/modify:**

- `src/pages/AdminPanel.jsx` - Admin dashboard
- `src/components/UserManagement.jsx` - Add/delete users
- `src/components/ClubManagement.jsx` - Edit all clubs
- `src/components/ScheduleManagement.jsx` - Modify schedules
- `src/pages/MainPage.jsx` - Add admin navigation

**Features:**

- User management (add/delete students/teachers)
- Club management (add/delete)
- Club info edit access same as club owner
- Modify subject schedules
- View all help requests

### 7. Navigation & Routing Updates

**Files to modify:**

- `src/App.jsx` - Add routing for new pages, auth protection
- `src/pages/MainPage.jsx` - Update navigation based on user role
- `src/components/Navbar.jsx` - Role-based menu items (if extracted)

**Features:**

- Role-based navigation visibility
- Protected routes
- Dynamic menu items

### 8. Mock Data Structure

**Files to create/modify:**

- `src/assets/mockdata/teachers.js` - Teacher accounts
- `src/assets/mockdata/helpRequests.js` - Help/report requests
- `src/assets/mockdata/subjectSchedules.js` - Subject schedule data
- `src/assets/mockdata/users.js` - Add teacher users

**Data structure:**

- Teachers table with user accounts
- Help requests with status tracking
- Subject schedules linked to classes/subjects

## Key Components Structure

```
src/
├── pages/
│   ├── Home.jsx (existing)
│   ├── LoginPage.jsx (update)
│   ├── MainPage.jsx (update)
│   ├── ClubDetailPage.jsx (new)
│   ├── AccountPage.jsx (new)
│   └── AdminPanel.jsx (new)
├── components/
│   ├── ClubBlocks.jsx (existing)
│   ├── ClubTextBlock.jsx (new)
│   ├── ClubCustomizer.jsx (new)
│   ├── JoinRequestButton.jsx (new)
│   ├── ClubCreationForm.jsx (new)
│   ├── PasswordChangeForm.jsx (new)
│   ├── HelpRequestForm.jsx (new)
│   ├── UserManagement.jsx (new)
│   ├── ClubManagement.jsx (new)
│   ├── ScheduleManagement.jsx (new)
│   └── SubjectScheduleView.jsx (new)
├── services/
│   ├── authService.js (new)
│   ├── userService.js (new)
│   ├── clubService.js (update)
│   ├── clubJoinRequestService.js (new)
│   ├── clubTextBlockService.js (new)
│   ├── scheduleService.js (new)
│   ├── subjectService.js (new)
│   └── helpRequestService.js (new)
├── contexts/
│   └── AuthContext.jsx (new)
└── assets/mockdata/
    ├── teachers.js (new)
    ├── helpRequests.js (new)
    └── subjectSchedules.js (new)
```

## Implementation Order

1. **Phase 1: Authentication Foundation**
  - Create AuthContext and authService
  - Update LoginPage with real auth
  - Add session management
2. **Phase 2: Club Detail & Customization**
  - Create ClubDetailPage
  - Implement text block display
  - Add customization interface
3. **Phase 3: Subject Schedule**
  - Update TimeSchedulePage for subjects
  - Add personalized schedule view
  - Implement schedule change requests
4. **Phase 4: Club Management**
  - Join request system
  - Club creation
  - Club editing
5. **Phase 5: Account Management**
  - Account page
  - Password change
  - Help requests
6. **Phase 6: Admin Panel**
  - User management
  - Full club/schedule control
7. **Phase 7: Navigation & Polish**
  - Role-based navigation
  - Route protection
  - UI refinements

## Technical Notes

- All services use async/await with simulated delays (300ms) for realistic feel
- Mock data follows PostgreSQL schema patterns for easy migration
- Services return promises that resolve with data (matching future API structure)
- Authentication state managed via React Context for global access
- Role-based UI rendering using conditional components
- Customizable club display uses drag-and-drop or form-based editing

