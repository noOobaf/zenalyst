# Zenalyst Analytics Dashboard

A full-stack analytics dashboard built with Node.js, Express, React, and MongoDB. This project provides comprehensive business intelligence with interactive charts, data visualization, and real-time analytics.

## 🚀 Features

- **Interactive Dashboard**: Real-time analytics with charts and graphs
- **Revenue Analysis**: Quarterly trends, revenue bridge analysis, and growth metrics
- **Customer Insights**: Customer concentration, performance analysis, and statistics
- **Geographic Data**: Country and region-based revenue analysis
- **RESTful API**: Well-structured backend with comprehensive endpoints
- **Modern UI**: Clean, responsive design with intuitive navigation
- **Data Visualization**: Charts powered by Recharts library
- **MongoDB Integration**: Robust data storage and aggregation

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Swagger** - API documentation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Recharts** - Chart library
- **Axios** - HTTP client
- **Custom CSS** - Styling

## 📁 Project Structure

```
zenalyst-project/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── context/
│   └── package.json
├── database/
│   ├── setup.js
│   └── connection.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zenalyst-project
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend (.env file in backend directory)
   cp example.env .env
   # Edit .env with your configuration
   
   # Frontend (.env file in frontend directory)
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Set up the database**
   ```bash
   # From project root
   npm run setup-db
   ```

5. **Start the development servers**
   ```bash
   # Start backend server (from backend directory)
   npm run dev
   
   # Start frontend server (from frontend directory)
   npm start
   ```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs

## 📊 API Endpoints

### Revenue
- `GET /api/revenue/summary` - Get revenue summary
- `GET /api/revenue/quarterly` - Get quarterly revenue data
- `GET /api/revenue/bridge` - Get revenue bridge analysis
- `GET /api/revenue/growth-customers` - Get top growth customers

### Customers
- `GET /api/customers/statistics` - Get customer statistics
- `GET /api/customers/concentration` - Get customer concentration
- `GET /api/customers/analysis` - Get customer analysis

### Geographic
- `GET /api/countries` - Get all countries
- `GET /api/countries/top-revenue` - Get top countries by revenue
- `GET /api/countries/revenue-share` - Get revenue share by country
- `GET /api/regions/revenue` - Get regions revenue

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard summary

## 🎨 Dashboard Views

### Overview
- Key metrics and performance indicators
- Customer statistics
- Top countries and customers
- Revenue summary

### Revenue Analysis
- Quarterly revenue trends
- Revenue bridge analysis
- Top growth customers table

### Customer Insights
- Customer growth distribution
- Top customer concentration
- Customer performance analysis

### Geographic Data
- Top countries by revenue
- Revenue share by country
- Regions revenue distribution
- Country performance details

## 🔧 Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run setup-db` - Set up database and collections

**Frontend:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Code Structure

The project follows a modular architecture:

- **Services**: Business logic and data operations
- **Controllers**: Request handling and response formatting
- **Routes**: API endpoint definitions
- **Middleware**: Authentication, validation, and error handling
- **Components**: Reusable UI components
- **Pages**: Main dashboard views

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=zenalyst_analytics
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team.

---

**Built with ❤️ using React, Node.js, and MongoDB** 