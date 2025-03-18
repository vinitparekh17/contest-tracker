# Contest Tracker

## Table of Contents  
- [Overview](#overview)  
- [Features](#features)  
- [APIs](#apis)  
- [Setup and Deployment](#setup-and-deployment)
  
![contest-tracker-demo](https://github.com/user-attachments/assets/cc10b6ca-b215-42fc-93b2-51d169faa74a)

## Overview  
**Contest Tracker** is a Node.js web application that fetches and displays upcoming and past coding contests from **Codeforces**, **CodeChef**, and **LeetCode**. It allows filtering contests by platform, bookmarking contests via `localStorage`, and attaching YouTube solution links for past contests. All contest data is stored in **MongoDB**.  

## Features  
- **Contest Storage:** Contests are fetched and stored in MongoDB for efficient access.  
- **Platform Filtering:** Users can filter contests by platform (e.g., Codeforces only).  
- **Time Information:** Displays contest start date and countdown timer.  
- **Bookmarking:** Users can bookmark contests using `localStorage` (no authentication required).  
- **Solution Links:**  
  - **Manual:** Admins can attach YouTube solution links via a form.  
  - **Automated (Bonus):** The system can auto-fetch solution links from YouTube when uploaded.  

## APIs  

### 1. Fetch Contests  
- **Endpoint:** `GET /api/contests`  
- **Description:** Retrieves upcoming and past contests from the database.  
- **Response:**  
  - **Status:** `200 OK`  
  - **Body:**  
    ```json
    [
      {
        "title": "Leetcode Weekly Contest 440",
        "platform": "leetcode",
        "startTime": 1741487400, // Unix timestamp (seconds)
        "duration": 5400,        // Duration (seconds)
        "url": "https://leetcode.com/contest/weekly-contest-440"
      }
    ]
    ```  
  - **Error:** `400 Bad Request`  
    ```json
    { "error": "Invalid platform specified" }
    ```  

### 2. Attach Solution Link  
- **Endpoint:** `POST /api/contests/:contestId/solution`  
- **Description:** Allows an admin to attach a YouTube solution link to a past contest.  
- **Body:**  
  ```json
  { "solutionUrl": "https://youtu.be/example" }
  ```  
- **Response:**  
  ```json
  { "message": "Solution link added successfully" }
  ```  
- **Error:** `404 Not Found` (if contest ID is invalid)  

### 3. Fetch contests without solution links
- **Endpoint:** `GET /api/contests/without-solution`
- **Description:** Retrieves contests that do not have a solution link attached.
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    [
      {
        "title": "Leetcode Weekly Contest 440",
        "platform": "leetcode",
        "startTime": 1741487400, // Unix timestamp (seconds)
        "duration": 5400,        // Duration (seconds)
        "url": "https://leetcode.com/contest/weekly-contest-440"
      }
    ]
    ```
  - **Error:** `400 Bad Request`
    ```json
    { "error": "Invalid platform specified" }
    ```

### 4. Admin Login
- **Endpoint:** `POST /api/admin/login`
- **Description:** Allows an admin to login to the system to access admin-only features via default credentials.
- **Body:**
  ```json
  { "username": "admin", "password": "admin" }
  ```
- **Response:**
  ```json
  { "message": "Admin logged in successfully" }
  ```
- **Error:** `401 Unauthorized`
  ```json
  { "error": "Invalid credentials" }
  ```


## Setup and Deployment  

### Start MongoDB using Docker  
```bash
docker run -d --name mongodb -p 27017:27017 -v mongo_data:/data/db mongo:6
```

### Start the Backend  
```bash
cd backend
cp .env.example .env # Update the environment variables
pnpm install  
pnpm dev  
```  

### Start the Frontend  
```bash
cd frontend  
pnpm install  
pnpm dev  
```  
