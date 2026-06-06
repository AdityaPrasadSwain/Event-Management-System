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
- **React 18+** - Modern UI library
- **JavaScript (ES6+)** - Modern JavaScript
- **Responsive Design** - Mobile-friendly interface

### Backend
- **Java 11+** - Programming language
- **Spring Boot 2.7+** - Application framework
- **Maven** - Build tool
- **MySQL/MariaDB** - Relational database

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

✅ **Event Creation** - Create and manage events with detailed information  
✅ **Booking System** - Seamless ticket booking functionality  
✅ **Payment Processing** - Secure payment integration  
✅ **Attendee Management** - Track and manage event attendees  
✅ **Real-time Updates** - Live event status updates  
✅ **Analytics & Reports** - Event performance analytics  

## 📊 API Testing

Use the provided Postman collection for API testing:

**File**: `API_Tests.postman_collection.json`
- View: https://github.com/AdityaPrasadSwain/Event-Management-System/blob/main/API_Tests.postman_collection.json
- Download and import into Postman to test all endpoints

## 📚 Important Documentation Files

### System Design
- **File**: `booking_system_design.md`
- **Path**: https://github.com/AdityaPrasadSwain/Event-Management-System/blob/main/booking_system_design.md
- Contains complete system architecture and booking flow

### API Testing
- **File**: `API_Tests.postman_collection.json`
- **Raw URL**: https://raw.githubusercontent.com/AdityaPrasadSwain/Event-Management-System/main/API_Tests.postman_collection.json
- Import this collection into Postman for testing

## 🔌 Quick Access Links

| Resource | Link |
|----------|------|
| 🏗️ System Design | [booking_system_design.md](https://github.com/AdityaPrasadSwain/Event-Management-System/blob/main/booking_system_design.md) |
| 🧪 API Tests | [API_Tests.postman_collection.json](https://github.com/AdityaPrasadSwain/Event-Management-System/blob/main/API_Tests.postman_collection.json) |
| 🪟 Backend Startup | [start-backend.bat](https://github.com/AdityaPrasadSwain/Event-Management-System/blob/main/start-backend.bat) |
| 🌐 Frontend Startup | [start-frontend.bat](https://github.com/AdityaPrasadSwain/Event-Management-System/blob/main/start-frontend.bat) |

## 🐛 Troubleshooting

### Port Issues
- If port 8080 is in use, change port in `backend/application.properties`
- If port 3000 is in use, change port in `frontend/.env`

### Dependencies
```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
mvn clean install
```

## 📞 Support

For issues or questions:
1. Check the system design documentation
2. Review API test collection
3. Open a GitHub issue with detailed information

---

**GitHub Repository**: https://github.com/AdityaPrasadSwain/Event-Management-System

Made with ❤️ by Aditya Prasad Swain
