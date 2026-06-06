# Event Management System

A comprehensive full-stack event management platform for creating, managing, and booking events. Built with modern web technologies featuring a Spring Boot backend and React frontend with real-time updates.

## 📋 Project Overview

**Event Management System** is a feature-rich application that allows users to create events, manage bookings, handle payments, and track event attendance. The system provides both organizer and attendee interfaces for seamless event management.

## 🏗️ Project Structure

```
Event-Management-System/
├── frontend/                     # React frontend application
│   ├── src/                      # React components and pages
│   ├── public/                   # Static assets
│   └── package.json              # Dependencies
│
├── backend/                      # Spring Boot backend
│   ├── src/                      # Java source code
│   └── pom.xml                   # Maven dependencies
│
├── API_Tests.postman_collection.json  # Postman API tests
├── booking_system_design.md      # System design documentation
├── start-backend.bat             # Windows startup script
├── start-frontend.bat            # Windows frontend startup
└── README.md                     # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI library
- **JavaScript (ES6+)** - Modern JavaScript
- **Responsive Design** - Mobile-friendly interface

### Backend
- **Java 11+** - Programming language
- **Spring Boot 2.7+** - Framework
- **Maven** - Build tool
- **MySQL/MariaDB** - Database

## 🚀 Quick Start

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Windows Users
```bash
start-backend.bat
start-frontend.bat
```

## 🎯 Key Features

✅ Event Creation & Management  
✅ Booking System  
✅ Payment Processing  
✅ Attendee Management  
✅ Real-time Updates  
✅ Analytics & Reports  

## 📊 API Testing

Use the provided Postman collection for API testing:
- File: `API_Tests.postman_collection.json`
- Import into Postman to test all endpoints

## 📚 Documentation

- **System Design**: See `booking_system_design.md`
- **API Tests**: Use `API_Tests.postman_collection.json`

## 📞 Support

For issues or questions:
1. Check the system design documentation
2. Review API test collection
3. Open a GitHub issue

---

For more information, visit the [GitHub repository](https://github.com/AdityaPrasadSwain/Event-Management-System).
