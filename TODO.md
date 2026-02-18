Here is a **complete professional README.md** with a structured TODO checklist based on **Assignment 9 (MongoDB + Mongoose Sticky Notes)**

You can copy this directly into your project.

---

# 📘 Assignment 9 – Sticky Notes API (MongoDB + Mongoose)

## 📌 Project Overview

This project implements a **Sticky Notes RESTful API** using:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Password Hashing
- Phone Encryption

The checklist below helps track completed and pending tasks.

---

# ✅ Part 1: Database Models

## 👤 User Model

- [x] Create `User` schema
- [x] Fields:
    - [x] name (String, required)
    - [x] email (String, unique, required)
    - [x] password (String, required)
    - [x] phone (String, required)
    - [x] age (Number, min: 18, max: 60)

- [x] Enable timestamps
- [x] Add email uniqueness validation
- [x] Hash password before saving - Service layer
- [x] Encrypt phone before saving - Service layer

---

## 📝 Note Model

- [x] Create `Note` schema
- [x] Fields:
    - [x] title (String, required)
    - [x] content (String, required)
    - [x] userId (ObjectId ref → User, required)

- [x] Enable timestamps

### Custom Validation

- [x] Add custom validator to prevent title from being entirely uppercase
      Example:
    - ❌ "FIRST NOTE"
    - ✅ "First Note"

---

# ✅ Part 2: Authentication & Authorization

- [ ] Install and configure JWT
- [ ] Generate token on login
- [ ] Token expires in 1 hour
- [ ] Create authentication middleware
- [ ] Extract `userId` from token
- [ ] Protect all private routes
- [ ] Ensure userId comes from token (NOT body)

---

# ✅ Part 3: User APIs

## 🔐 Authentication APIs

- [x] **POST /users/signup**
    - [x] Check email does not exist
    - [x] Hash password
    - [x] Encrypt phone
    - [x] Return success response

- [x] **POST /users/login**
    - [x] Validate email & password
    - [x] Generate JWT (expires in 1 hour)
    - [x] Return token

---

## 👤 Logged-in User APIs

- [x] **PATCH /users**
    - [x] Update user info (except password)
    - [x] Get userId from token
    - [x] If updating email → check uniqueness

- [x] **DELETE /users**
    - [x] Delete logged-in user
    - [x] Get userId from token

- [x] **GET /users**
    - [x] Get logged-in user data
    - [x] Get userId from token

---

# ✅ Part 4: Note APIs

## 📝 Basic CRUD

- [ ] **POST /notes**
    - [ ] Create note
    - [ ] Get userId from token

- [ ] **PATCH /notes/:noteId**
    - [ ] Update note
    - [ ] Only owner can update
    - [ ] Return updated note

- [ ] **PUT /notes/replace/:noteId**
    - [ ] Replace entire note
    - [ ] Only owner can replace

- [ ] **DELETE /notes/:noteId**
    - [ ] Delete note
    - [ ] Only owner can delete
    - [ ] Return deleted note

---

## 📝 Advanced Operations

- [ ] **PATCH /notes/all**
    - [ ] Update title of all notes for logged-in user

- [ ] **GET /notes/paginate-sort**
    - [ ] Pagination (page & limit)
    - [ ] Sort by createdAt descending

- [ ] **GET /notes/:id**
    - [ ] Get note by id
    - [ ] Only owner can access

- [ ] **GET /notes/note-by-content**
    - [ ] Get note by content
    - [ ] Must belong to logged-in user

- [ ] **GET /notes/note-with-user**
    - [ ] Populate user
    - [ ] Select:
        - Note: title, userId, createdAt
        - User: email

- [ ] **GET /notes/aggregate**
    - [ ] Use aggregation
    - [ ] Join with user (name & email)
    - [ ] Allow searching by title

- [ ] **DELETE /notes**
    - [ ] Delete all notes for logged-in user

---

# 📮 Postman Requirements

- [ ] Use meaningful endpoint names
- [ ] Save every request (Ctrl + S)
- [ ] Export Postman collection
- [ ] Include collection link with submission

---

# ⭐ Bonus (Optional)

- [ ] Solve **Longest Common Prefix** on LeetCode
- [ ] Create `bonus.js`
- [ ] Paste submitted solution inside `bonus.js`

---

# 🚀 Final Submission Checklist

- [ ] All APIs tested
- [ ] Authentication working correctly
- [ ] Ownership validation implemented
- [ ] Aggregation working
- [ ] README updated
- [ ] Postman collection exported
- [ ] Project runs without errors

---

If you'd like, I can also:

- ✅ Convert this into a cleaner minimal version
- 📊 Add a progress percentage tracker
- 🗂 Suggest the best folder structure
- 🔐 Provide JWT + encryption best practices for this assignment

Just tell me what you need 👌
