package com.expensetracker.handlers;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.expensetracker.model.Expense;
import com.google.gson.Gson;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class CreateExpenseHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private final DynamoDB dynamoDB;
    private final String TABLE_NAME = "ExpensesTable";
    private final Gson gson = new Gson();

    public CreateExpenseHandler() {
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().build();
        this.dynamoDB = new DynamoDB(client);
    }

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent request, Context context) {
        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
        Map<String, String> headers = new HashMap<>();
headers.put("Content-Type", "application/json");
headers.put("Access-Control-Allow-Origin", "*");
headers.put("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
headers.put("Access-Control-Allow-Headers", "Content-Type");
response.setHeaders(headers);

        try {
            // Parse request body
            Expense expense = gson.fromJson(request.getBody(), Expense.class);
            
            // Generate unique ID and timestamp
            expense.setExpenseId(UUID.randomUUID().toString());
            expense.setTimestamp(System.currentTimeMillis());

            // Save to DynamoDB
            Table table = dynamoDB.getTable(TABLE_NAME);
            Item item = new Item()
                    .withPrimaryKey("userId", expense.getUserId(), "expenseId", expense.getExpenseId())
                    .withString("category", expense.getCategory())
                    .withNumber("amount", expense.getAmount())
                    .withString("description", expense.getDescription())
                    .withString("date", expense.getDate())
                    .withNumber("timestamp", expense.getTimestamp());

            table.putItem(item);

            // Return success response
            response.setStatusCode(201);
            response.setBody(gson.toJson(expense));

        } catch (Exception e) {
            context.getLogger().log("Error: " + e.getMessage());
            response.setStatusCode(500);
            response.setBody("{\"error\": \"" + e.getMessage() + "\"}");
        }

        return response;
    }
}