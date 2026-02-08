# Expense Tracker - Serverless Web Application

A full-stack serverless expense tracking application with a professional web interface and AWS backend infrastructure.

🔗 **Live Demo:** file:///C:/Users/Parth/My%20Project/Expense-Tracker/frontend/index.html  
🔗 **GitHub:** https://github.com/PARTHKOTADIYAA/Expense-Tracker.git

## 🎯 Project Overview

A complete expense management system that allows users to track their spending across multiple categories, view analytics, and manage their financial data through an intuitive web interface powered by AWS serverless architecture.

## ✨ Features

- ✅ **Add Expenses** - Create expenses with category, amount, description, and date
- ✅ **View Dashboard** - Real-time statistics showing total spent, transaction count, and averages
- ✅ **Category Breakdown** - Visual spending analysis by category with percentages
- ✅ **Filter by Category** - Quick filtering to view expenses by specific categories
- ✅ **Delete Expenses** - Remove expenses with confirmation
- ✅ **Responsive Design** - Works seamlessly on desktop and mobile devices
- ✅ **Real-time Updates** - All data synced with AWS DynamoDB in real-time

## 🏗️ Architecture

### Frontend
- **HTML5/CSS3** - Modern, responsive UI
- **JavaScript (Vanilla)** - Dynamic interactions and API integration
- **Tailwind CSS** - Utility-first styling framework
- **Font Awesome** - Professional icons

### Backend (AWS Serverless)
- **AWS Lambda** (Java 21) - Serverless compute for business logic
- **Amazon API Gateway** - RESTful API endpoints
- **Amazon DynamoDB** - NoSQL database for data persistence
- **AWS IAM** - Role-based access control and security
- **CORS** - Enabled for cross-origin requests

## 📁 Project Structure
```
Expense-Tracker/
├── frontend/
│   ├── index.html          # Main web interface
│   └── app.js              # Frontend logic & API integration
├── src/
│   └── main/
│       └── java/
│           └── com/
│               └── expensetracker/
│                   ├── handlers/
│                   │   ├── CreateExpenseHandler.java
│                   │   ├── GetExpensesHandler.java
│                   │   └── DeleteExpenseHandler.java
│                   └── model/
│                       └── Expense.java
├── docs/
│   └── api-documentation.json    # Swagger/OpenAPI spec
├── pom.xml                       # Maven configuration
└── README.md
```

## 🚀 API Endpoints

**Base URL:** `https://ii1coqzr5e.execute-api.ca-central-1.amazonaws.com/prod`

### Create Expense
```http
POST /expenses
Content-Type: application/json

{
  "userId": "demo_user",
  "category": "Food",
  "amount": 25.50,
  "description": "Lunch at cafe",
  "date": "2026-02-05"
}
```

**Response:**
```json
{
  "expenseId": "uuid-generated",
  "userId": "demo_user",
  "category": "Food",
  "amount": 25.50,
  "description": "Lunch at cafe",
  "date": "2026-02-05",
  "timestamp": 1770318020276
}
```

### Get User Expenses
```http
GET /expenses/{userId}
```

**Response:**
```json
[
  {
    "expenseId": "uuid",
    "userId": "demo_user",
    "category": "Food",
    "amount": 25.50,
    "description": "Lunch at cafe",
    "date": "2026-02-05",
    "timestamp": 1770318020276
  }
]
```

### Delete Expense
```http
DELETE /expenses/{userId}/{expenseId}
```

**Response:**
```json
{
  "message": "Expense deleted successfully"
}
```

## 💾 Database Schema

**Table Name:** `ExpensesTable`

**Primary Key:**
- Partition Key: `userId` (String)
- Sort Key: `expenseId` (String)

**Attributes:**
- `category` (String) - Expense category
- `amount` (Number) - Expense amount
- `description` (String) - Expense description
- `date` (String) - Expense date (YYYY-MM-DD)
- `timestamp` (Number) - Creation timestamp

## 🛠️ Tech Stack

### Backend
- **Language:** Java 21
- **Build Tool:** Maven 3.9+
- **Cloud Provider:** AWS
- **Services:** Lambda, API Gateway, DynamoDB, IAM

### Frontend
- **HTML5/CSS3**
- **JavaScript (ES6+)**
- **Tailwind CSS 3.x**
- **Font Awesome 6.x**

### Documentation
- **Swagger/OpenAPI** - API specification

## 📦 Setup & Deployment

### Prerequisites
- Java 21 or higher
- Maven 3.9+
- AWS Account
- AWS CLI configured with appropriate credentials

### Backend Deployment

1. **Build the project:**
```bash
mvn clean package
```

2. **Create DynamoDB Table:**
   - Table name: `ExpensesTable`
   - Partition key: `userId` (String)
   - Sort key: `expenseId` (String)
   - Capacity mode: On-demand

3. **Create IAM Role:**
   - Role name: `ExpenseTrackerLambdaRole`
   - Attach policies:
     - `AWSLambdaBasicExecutionRole`
     - `AmazonDynamoDBFullAccess`

4. **Deploy Lambda Functions:**
   - Upload `target/expense-tracker-api-1.0.0.jar` to each function
   - Set appropriate handlers:
     - CreateExpense: `com.expensetracker.handlers.CreateExpenseHandler::handleRequest`
     - GetExpenses: `com.expensetracker.handlers.GetExpensesHandler::handleRequest`
     - DeleteExpense: `com.expensetracker.handlers.DeleteExpenseHandler::handleRequest`

5. **Configure API Gateway:**
   - Create REST API
   - Set up resources and methods
   - Enable CORS
   - Deploy to production stage

### Frontend Deployment

1. **Update API URL in `app.js`:**
```javascript
const API_BASE_URL = 'YOUR_API_GATEWAY_URL';
```

2. **Deploy to hosting service:**
   - GitHub Pages, Netlify, Vercel, or S3 Static Website

## 🧪 Testing

### Test with cURL

**Create Expense:**
```bash
curl -X POST https://YOUR_API_URL/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"test_user",
    "category":"Food",
    "amount":50.00,
    "description":"Dinner",
    "date":"2026-02-05"
  }'
```

**Get Expenses:**
```bash
curl https://YOUR_API_URL/expenses/test_user
```

**Delete Expense:**
```bash
curl -X DELETE https://YOUR_API_URL/expenses/test_user/EXPENSE_ID
```

## 💡 Skills Demonstrated

### AWS Services
- Lambda function development and deployment
- API Gateway REST API design and configuration
- DynamoDB schema design and operations
- IAM role and policy management
- CORS configuration for web applications

### Software Development
- Java backend development with AWS SDK
- RESTful API design principles
- Serverless architecture patterns
- Frontend-backend integration
- Error handling and validation
- Asynchronous JavaScript (Fetch API)

### Best Practices
- Separation of concerns (MVC pattern)
- Clean code and documentation
- Version control with Git
- Maven dependency management
- Responsive web design

## 🎓 Learning Outcomes

This project demonstrates proficiency in:
- Building serverless applications on AWS
- Full-stack development (frontend + backend)
- RESTful API development and consumption
- NoSQL database design
- Cloud security with IAM
- Modern web development practices

## 📝 Future Enhancements

- [ ] User authentication with AWS Cognito
- [ ] Export expenses to CSV/PDF
- [ ] Budget tracking and alerts
- [ ] Recurring expenses
- [ ] Multi-currency support
- [ ] Data visualization with charts
- [ ] Mobile responsive improvements
- [ ] Search and advanced filtering

## 👤 Author

**Your Name**  
- GitHub: [PARTHKOTADIYAA](https://github.com/PARTHKOTADIYAA)


## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ as part of AWS serverless architecture learning journey**