# Expense Tracker Serverless API

A serverless REST API built with AWS services for tracking personal expenses with multi-user support.

## Architecture

This project demonstrates a complete serverless architecture using:
- **AWS Lambda** (Java 21) - Serverless compute for API logic
- **Amazon API Gateway** - RESTful API endpoints
- **Amazon DynamoDB** - NoSQL database for expense storage
- **AWS IAM** - Role-based access control
- **Swagger/OpenAPI** - API documentation

## Features

- ✅ Create expenses with category, amount, and description
- ✅ Retrieve all expenses for a specific user
- ✅ Delete individual expenses
- ✅ RESTful API design
- ✅ CORS enabled for web applications
- ✅ Fully serverless and scalable

## API Endpoints

**Base URL:** `https://ii1coqzr5e.execute-api.ca-central-1.amazonaws.com/prod`

### Create Expense
```
POST /expenses
```
**Request Body:**
```json
{
  "userId": "user123",
  "category": "Food",
  "amount": 25.50,
  "description": "Lunch at cafe",
  "date": "2026-02-05"
}
```

### Get User Expenses
```
GET /expenses/{userId}
```

### Delete Expense
```
DELETE /expenses/{userId}/{expenseId}
```

## Tech Stack

- **Language:** Java 21
- **Build Tool:** Maven
- **Cloud Provider:** AWS
- **Services:** Lambda, API Gateway, DynamoDB, IAM
- **Documentation:** Swagger/OpenAPI

## Project Structure
```
Expense-Tracker/
├── docs/
│   └── api-documentation.json    # Swagger API specification
├── src/
│   └── main/
│       └── java/
│           └── com/
│               └── expensetracker/
│                   ├── handlers/  # Lambda function handlers
│                   └── model/     # Data models
├── pom.xml                        # Maven configuration
└── README.md
```

## Setup & Deployment

### Prerequisites
- Java 21
- Maven 3.9+
- AWS Account
- AWS CLI configured

### Build
```bash
mvn clean package
```

### Deploy
1. Upload JAR file to AWS Lambda functions
2. Configure API Gateway endpoints
3. Set up DynamoDB table with composite key (userId, expenseId)
4. Configure IAM roles with DynamoDB and CloudWatch permissions

## Database Schema

**Table Name:** ExpensesTable

**Keys:**
- Partition Key: `userId` (String)
- Sort Key: `expenseId` (String)

**Attributes:**
- category (String)
- amount (Number)
- description (String)
- date (String)
- timestamp (Number)

## Skills Demonstrated

- AWS Lambda function development in Java
- API Gateway REST API design
- DynamoDB data modeling and operations
- IAM role and policy management
- Serverless architecture patterns
- API documentation with Swagger
- Maven dependency management
- Error handling and logging

## Author

Built as part of AWS serverless architecture learning.