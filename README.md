# 🚀 HackerNews Story Hub

A full-stack MERN application that scrapes top stories from HackerNews, stores them in MongoDB, and allows authenticated users to bookmark stories. Built with modern web technologies and best practices.

## 📋 Project Overview

HackerNews Story Hub is a comprehensive web application that demonstrates full-stack development capabilities using the MERN stack. The application automatically scrapes the top 10 stories from HackerNews, provides user authentication, and enables bookmarking functionality with a responsive, modern UI.

### 🎯 Key Features
- **Real-time Story Scraping**: Automatically fetches top stories from HackerNews
- **User Authentication**: Secure JWT-based login/registration system
- **Bookmark Management**: Users can save and manage their favorite stories
- **Protected Routes**: Authentication required for bookmark features
- **Search & Pagination**: Efficient story browsing with search capabilities
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## ✨ Features

### 🔧 Core Functionality
- 🤖 **HackerNews Scraper**: Automated scraping of top 10 stories
- 🔐 **JWT Authentication**: Secure user authentication with bcrypt password hashing
- 📚 **Bookmark System**: Add/remove bookmarks with instant UI updates
- 🛡️ **Protected Routes**: Authentication middleware for protected endpoints
- 📄 **Pagination**: Efficient story browsing with pagination controls
- 🔍 **Search Stories**: Case-insensitive title search functionality
- 📱 **Responsive UI**: Modern, mobile-friendly design
- 🔄 **Real-time Updates**: Instant bookmark state management

### 🎨 User Experience
- ⚡ **Loading States**: Smooth loading indicators throughout the app
- 🎯 **Toast Notifications**: User-friendly success/error feedback
- 🔄 **State Persistence**: Authentication and bookmarks survive page refresh
- 🎭 **Empty States**: Graceful handling of no-data scenarios
- 🎪 **Error Handling**: Comprehensive error management with user feedback

## 🛠️ Tech Stack

### Frontend Technologies
- **⚛️ React 18** - Modern React with hooks and functional components
- **🚀 Vite** - Fast build tool and development server
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **📡 Axios** - HTTP client with interceptors
- **🛣️ React Router DOM** - Client-side routing
- **🔥 React Hot Toast** - Beautiful toast notifications
- **🧠 React Context API** - State management for authentication

### Backend Technologies
- **💚 Node.js** - JavaScript runtime
- **🚀 Express.js** - Web application framework
- **🍃 MongoDB** - NoSQL database
- **🦉 Mongoose** - MongoDB object modeling
- **🔐 JWT** - JSON Web Tokens for authentication
- **🔒 bcryptjs** - Password hashing library
- **🕷️ Cheerio** - Server-side HTML parsing
- **📡 Axios** - HTTP client for web scraping

## 📁 Folder Structure

```
hackernews-assignment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js    # Authentication logic
│   │   │   ├── scrapeController.js  # Scraping endpoints
│   │   │   └── storyController.js   # Story CRUD operations
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT middleware
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── Story.js             # Story schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # Authentication routes
│   │   │   ├── scrapeRoutes.js      # Scraping routes
│   │   │   └── storyRoutes.js       # Story routes
│   │   ├── services/
│   │   │   └── scraperService.js    # HackerNews scraper
│   │   ├── utils/
│   │   │   └── jwt.js               # JWT utilities
│   │   └── server.js                # Express server
│   ├── .env                         # Environment variables
│   └── package.json                 # Backend dependencies
├── frontend/
│   ├── public/
│   │   └── index.html               # HTML template
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js             # Axios configuration
│   │   ├── components/
│   │   │   ├── BookmarksList.jsx    # Bookmarked stories component
│   │   │   ├── EmptyState.jsx       # Empty state component
│   │   │   ├── LoadingSpinner.jsx   # Loading indicator
│   │   │   ├── Navigation.jsx       # Navigation header
│   │   │   ├── StoryCard.jsx        # Story card component
│   │   │   └── StoriesList.jsx      # Stories list component
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Main dashboard
│   │   │   ├── LoginPage.jsx        # Login page
│   │   │   └── RegisterPage.jsx    # Registration page
│   │   ├── App.jsx                  # Main App component
│   │   ├── main.jsx                 # App entry point
│   │   └── index.css                # Global styles
│   ├── .env                         # Frontend environment variables
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # Frontend dependencies
│   ├── postcss.config.js            # PostCSS configuration
│   ├── tailwind.config.js           # Tailwind configuration
│   └── vite.config.js               # Vite configuration
└── README.md                        # Project documentation
```

## 🔧 Environment Variables

### Backend Environment Variables
Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI= your mongodb api key

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Environment
NODE_ENV=development
```

### Frontend Environment Variables
Create a `.env` file in the `frontend/` directory:

```env
# API URL
VITE_API_URL=http://localhost:5000
```

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (installed and running)

### Installation Steps

1. **📥 Clone the Repository**
   ```bash
   git clone <repository-url>
   cd hackernews-assignment
   ```

2. **🔧 Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **⚙️ Configure Backend Environment**
   ```bash
   # Create .env file with environment variables
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **🔧 Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **⚙️ Configure Frontend Environment**
   ```bash
   # Create .env file with API URL
   echo "VITE_API_URL=http://localhost:5000" > .env
   ```

## 🏃 How to Run Locally

### Start Backend Server
```bash
cd backend
npm start
```
The backend will start on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

## 📡 API Endpoints

### Authentication Endpoints
- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - User login

### Story Endpoints
- **GET** `/api/stories` - Get all stories with pagination and search
  - Query parameters: `?page=1&limit=10&search=ai`
- **GET** `/api/stories/:id` - Get a single story by ID
- **POST** `/api/stories/:id/bookmark` - Toggle bookmark (protected)

### Scraping Endpoints
- **POST** `/api/scrape` - Trigger HackerNews scraping
- **GET** `/api/latest` - Get latest scraped stories

### Example API Responses

#### GET /api/stories
```json
{
  "success": true,
  "message": "Stories retrieved successfully",
  "data": {
    "stories": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalStories": 47,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### POST /api/stories/:id/bookmark
```json
{
  "success": true,
  "message": "Bookmark added successfully",
  "data": {
    "bookmarked": true,
    "storyId": "64a7b8c9d1e2f3a4b5c6d7e"
  }
}
```

## 🎯 Usage Guide

1. **📝 Register/Login**: Create an account or login with existing credentials
2. **📚 Browse Stories**: View top stories from HackerNews with pagination
3. **🔍 Search Stories**: Use the search functionality to find specific stories
4. **📖 View Details**: Click on stories to read the full article
5. **🔖 Bookmark Stories**: Save your favorite stories for later
6. **📋 Manage Bookmarks**: View and manage your bookmarked stories

## 🛡️ Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Request validation and sanitization
- **CORS Protection**: Cross-origin resource sharing configuration
- **Error Handling**: Secure error responses without sensitive information

## 🎨 Design Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: Smooth loading indicators
- **Toast Notifications**: User-friendly feedback system
- **Empty States**: Graceful handling of no-data scenarios
- **Error Boundaries**: Comprehensive error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- **HackerNews** for providing the story data source
- **MERN Stack** community for excellent documentation and tools
- **Tailwind CSS** for the amazing utility-first CSS framework

---

**Built with ❤️ using the MERN stack**
