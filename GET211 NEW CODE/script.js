const budgetInput = document.getElementById('total-budget');
const balanceEl = document.getElementById('balance-amount');
const budgetEl = document.getElementById('budget-amount');
const list = document.getElementById('list');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const alertMsg = document.getElementById('alert-msg');

let myChart = null;

// Load Data from LocalStorage on startup
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
const localStorageBudget = localStorage.getItem('totalBudget');

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Initialize app
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    
    if(localStorageBudget) {
        budgetInput.value = localStorageBudget;
    }

    updateValues();
}

// Add Transaction
function addTransaction() {
    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a text and amount');
        return;
    }
    
    if (budgetInput.value.trim() === '') {
        alert('Please set a total budget first');
        return;
    }

    const transaction = {
        id: generateID(),
        text: text.value,
        amount: +amount.value
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();

    text.value = '';
    amount.value = '';
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
    const item = document.createElement('li');
    item.innerHTML = `
        ${transaction.text} 
        <div>
            <span class="money-minus">-₦${Math.abs(transaction.amount)}</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        </div>
    `;
    list.appendChild(item);
}

// Remove Transaction
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    init(); // Re-initialize to update list and chart
}

// Update Values, Chart, and Storage
function updateValues() {
    const totalBudget = parseFloat(budgetInput.value) || 0;
    const expenses = transactions.reduce((acc, item) => (acc += item.amount), 0);
    const remaining = totalBudget - expenses;

    budgetEl.innerText = `₦${totalBudget.toFixed(2)}`;
    balanceEl.innerText = `₦${remaining.toFixed(2)}`;

    checkBudget(remaining, totalBudget);
    updateChart(remaining, expenses);
    updateLocalStorage();
}

function checkBudget(remaining, total) {
    alertMsg.style.display = 'none';
    balanceEl.style.color = '#333';

    if (remaining < 0) {
        alertMsg.innerText = "CRITICAL: You are over budget!";
        alertMsg.style.display = 'block';
        balanceEl.style.color = '#e74c3c'; // Red
    } else if (remaining < (total * 0.2) && total > 0) { 
        alertMsg.innerText = "Warning: Less than 20% budget remaining.";
        alertMsg.style.display = 'block';
        balanceEl.style.color = '#e67e22'; // Orange
    }
}

function updateChart(remaining, expenses) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const chartRemaining = remaining < 0 ? 0 : remaining;

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Remaining', 'Expenses'],
            datasets: [{
                data: [chartRemaining, expenses],
                backgroundColor: ['#2ecc71', '#e74c3c'], 
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%', 
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// Save to LocalStorage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('totalBudget', budgetInput.value);
}

// Listen for budget changes
budgetInput.addEventListener('input', updateValues);

// Start the app
init();