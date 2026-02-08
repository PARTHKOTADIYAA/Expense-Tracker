// API Configuration
const API_BASE_URL = 'https://ii1coqzr5e.execute-api.ca-central-1.amazonaws.com/prod';
const USER_ID = 'demo_user';

let allExpenses = [];
let currentFilter = 'All';

// Category Icons and Colors
const categoryConfig = {
    'Food': { icon: 'fa-utensils', color: '#F59E0B' },
    'Transportation': { icon: 'fa-car', color: '#3B82F6' },
    'Shopping': { icon: 'fa-shopping-bag', color: '#EC4899' },
    'Entertainment': { icon: 'fa-film', color: '#8B5CF6' },
    'Utilities': { icon: 'fa-bolt', color: '#10B981' },
    'Health': { icon: 'fa-heart', color: '#EF4444' },
    'Other': { icon: 'fa-tag', color: '#6B7280' }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default
    document.getElementById('date').valueAsDate = new Date();
    
    // Load expenses
    loadExpenses();
});

// Load all expenses from API
async function loadExpenses() {
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE_URL}/expenses/${USER_ID}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch expenses');
        }
        
        allExpenses = await response.json();
        updateDashboard();
        renderExpenses();
        renderCategoryBreakdown();
    } catch (error) {
        console.error('Error loading expenses:', error);
        showNotification('Failed to load expenses. Please try again.', 'error');
        allExpenses = [];
        updateDashboard();
        renderExpenses();
    } finally {
        showLoading(false);
    }
}

// Add new expense
async function addExpense(event) {
    event.preventDefault();
    
    const expense = {
        userId: USER_ID,
        category: document.getElementById('category').value,
        amount: parseFloat(document.getElementById('amount').value),
        description: document.getElementById('description').value,
        date: document.getElementById('date').value
    };
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expense)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create expense');
        }
        
        const newExpense = await response.json();
        allExpenses.unshift(newExpense);
        
        closeAddExpenseModal();
        document.getElementById('addExpenseForm').reset();
        document.getElementById('date').valueAsDate = new Date();
        
        updateDashboard();
        renderExpenses();
        renderCategoryBreakdown();
        
        showNotification('Expense added successfully!', 'success');
    } catch (error) {
        console.error('Error adding expense:', error);
        showNotification('Failed to add expense. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Delete expense
async function deleteExpense(expenseId) {
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/expenses/${USER_ID}/${expenseId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete expense');
        }
        
        allExpenses = allExpenses.filter(exp => exp.expenseId !== expenseId);
        
        updateDashboard();
        renderExpenses();
        renderCategoryBreakdown();
        
        showNotification('Expense deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting expense:', error);
        showNotification('Failed to delete expense. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Update dashboard statistics
function updateDashboard() {
    const total = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const count = allExpenses.length;
    const average = count > 0 ? total / count : 0;
    
    document.getElementById('totalSpent').textContent = `$${total.toFixed(2)}`;
    document.getElementById('totalTransactions').textContent = count;
    document.getElementById('avgTransaction').textContent = `$${average.toFixed(2)}`;
    
    // Calculate top category
    const categoryTotals = {};
    allExpenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    
    let topCategory = '-';
    let topAmount = 0;
    for (const [category, amount] of Object.entries(categoryTotals)) {
        if (amount > topAmount) {
            topAmount = amount;
            topCategory = category;
        }
    }
    
    document.getElementById('topCategory').textContent = topCategory;
    document.getElementById('topCategoryAmount').textContent = `$${topAmount.toFixed(2)}`;
}

// Render expenses list
function renderExpenses() {
    const container = document.getElementById('expensesList');
    
    const filteredExpenses = currentFilter === 'All' 
        ? allExpenses 
        : allExpenses.filter(exp => exp.category === currentFilter);
    
    if (filteredExpenses.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 text-lg">No expenses yet</p>
                <p class="text-gray-400 text-sm mt-2">Click "Add Expense" to get started!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="border-b border-gray-200">
                    <tr class="text-left text-sm text-gray-500">
                        <th class="pb-3 font-medium">Category</th>
                        <th class="pb-3 font-medium">Description</th>
                        <th class="pb-3 font-medium text-right">Amount</th>
                        <th class="pb-3 font-medium">Date</th>
                        <th class="pb-3 font-medium"></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${filteredExpenses.map(expense => `
                        <tr class="hover:bg-gray-50">
                            <td class="py-4">
                                <div class="flex items-center gap-2">
                                    <i class="fas ${categoryConfig[expense.category]?.icon || 'fa-tag'}" style="color: ${categoryConfig[expense.category]?.color || '#6B7280'}"></i>
                                    <span class="font-medium text-gray-700">${expense.category}</span>
                                </div>
                            </td>
                            <td class="py-4 text-gray-600">${expense.description}</td>
                            <td class="py-4 text-right font-semibold text-gray-800">$${expense.amount.toFixed(2)}</td>
                            <td class="py-4 text-gray-500 text-sm">${formatDate(expense.date)}</td>
                            <td class="py-4 text-right">
                                <button onclick="deleteExpense('${expense.expenseId}')" class="text-red-500 hover:text-red-700 p-2">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Render category breakdown
function renderCategoryBreakdown() {
    const container = document.getElementById('categoryBreakdown');
    
    const categoryTotals = {};
    let total = 0;
    
    allExpenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        total += exp.amount;
    });
    
    const sortedCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1]);
    
    if (sortedCategories.length === 0) {
        container.innerHTML = '<p class="text-gray-400 text-center py-8">No data yet</p>';
        return;
    }
    
    container.innerHTML = sortedCategories.map(([category, amount]) => {
        const percentage = (amount / total * 100).toFixed(1);
        return `
            <div class="mb-6">
                <div class="flex justify-between items-center mb-2">
                    <div class="flex items-center gap-2">
                        <i class="fas ${categoryConfig[category]?.icon || 'fa-tag'}" style="color: ${categoryConfig[category]?.color || '#6B7280'}"></i>
                        <span class="font-medium text-gray-700">${category}</span>
                    </div>
                    <div class="text-right">
                        <div class="font-bold text-gray-800">$${amount.toFixed(2)}</div>
                        <div class="text-xs text-gray-500">${percentage}%</div>
                    </div>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="h-2 rounded-full" style="width: ${percentage}%; background-color: ${categoryConfig[category]?.color || '#6B7280'}"></div>
                </div>
            </div>
        `;
    }).join('');
}

// Filter by category
function filterCategory(category) {
    currentFilter = category;
    
    // Update filter buttons
    document.querySelectorAll('.category-filter').forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.remove('bg-gray-100', 'text-gray-700');
            btn.classList.add('bg-teal-500', 'text-white');
        } else {
            btn.classList.remove('bg-teal-500', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-700');
        }
    });
    
    renderExpenses();
}

// Modal functions
function openAddExpenseModal() {
    document.getElementById('addExpenseModal').classList.add('active');
}

function closeAddExpenseModal() {
    document.getElementById('addExpenseModal').classList.remove('active');
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

function showLoading(show) {
    const indicator = document.getElementById('loadingIndicator');
    if (show) {
        indicator.classList.remove('hidden');
    } else {
        indicator.classList.add('hidden');
    }
}

function showNotification(message, type) {
    // Simple alert for now - you can enhance this later
    if (type === 'success') {
        alert('✅ ' + message);
    } else {
        alert('❌ ' + message);
    }
}