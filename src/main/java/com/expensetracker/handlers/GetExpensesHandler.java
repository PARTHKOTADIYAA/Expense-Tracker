package com.expensetracker.handlers;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.expensetracker.model.Expense;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class GetExpensesHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private final DynamoDB dynamoDB;
    private final String TABLE_NAME = "ExpensesTable";
    private final Gson gson = new Gson();

    public GetExpensesHandler() {
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().build();
        this.dynamoDB = new DynamoDB(client);
    }

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent request, Context context) {
        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        response.setHeaders(headers);

        try {
            // Get userId from path parameters
            Map<String, String> pathParams = request.getPathParameters();
            String userId = pathParams.get("userId");

            // Query DynamoDB
            Table table = dynamoDB.getTable(TABLE_NAME);
            QuerySpec spec = new QuerySpec()
                    .withKeyConditionExpression("userId = :v_userId")
                    .withValueMap(new HashMap<String, Object>() {{
                        put(":v_userId", userId);
                    }});

            ItemCollection<QueryOutcome> items = table.query(spec);
            Iterator<Item> iterator = items.iterator();

            List<Expense> expenses = new ArrayList<>();
            while (iterator.hasNext()) {
                Item item = iterator.next();
                Expense expense = new Expense();
                expense.setExpenseId(item.getString("expenseId"));
                expense.setUserId(item.getString("userId"));
                expense.setCategory(item.getString("category"));
                expense.setAmount(item.getNumber("amount").doubleValue());
                expense.setDescription(item.getString("description"));
                expense.setDate(item.getString("date"));
                expense.setTimestamp(item.getNumber("timestamp").longValue());
                expenses.add(expense);
            }

            // Return success response
            response.setStatusCode(200);
            response.setBody(gson.toJson(expenses));

        } catch (Exception e) {
            context.getLogger().log("Error: " + e.getMessage());
            response.setStatusCode(500);
            response.setBody("{\"error\": \"" + e.getMessage() + "\"}");
        }

        return response;
    }
}