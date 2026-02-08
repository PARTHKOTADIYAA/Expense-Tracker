package com.expensetracker.handlers;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.DeleteItemSpec;

import java.util.HashMap;
import java.util.Map;

public class DeleteExpenseHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private final DynamoDB dynamoDB;
    private final String TABLE_NAME = "ExpensesTable";

    public DeleteExpenseHandler() {
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
            // Get userId and expenseId from path parameters
            Map<String, String> pathParams = request.getPathParameters();
            String userId = pathParams.get("userId");
            String expenseId = pathParams.get("expenseId");

            // Delete from DynamoDB
            Table table = dynamoDB.getTable(TABLE_NAME);
            DeleteItemSpec deleteItemSpec = new DeleteItemSpec()
                    .withPrimaryKey("userId", userId, "expenseId", expenseId);

            table.deleteItem(deleteItemSpec);

            // Return success response
            response.setStatusCode(200);
            response.setBody("{\"message\": \"Expense deleted successfully\"}");

        } catch (Exception e) {
            context.getLogger().log("Error: " + e.getMessage());
            response.setStatusCode(500);
            response.setBody("{\"error\": \"" + e.getMessage() + "\"}");
        }

        return response;
    }
}