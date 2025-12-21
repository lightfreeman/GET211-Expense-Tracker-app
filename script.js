let totalBudget = 0;
let totalExpenses = 0;

// 1. Set the Budget
function setBudget() {
    const budgetInput = document.getElementById('budgetInput');
    totalBudget = parseFloat(budgetInput.value);
    
    if (isNaN(totalBudget) || totalBudget <= 0) {
        alert("Please enter a valid budget amount");
        return;
    }

    document.getElementById('budgetDisplay').innerText = `$${totalBudget.toFixed(2)}`;
    updateBalance();
}

// 2. Add an Expense
function addExpense() {
    const descInput = document.getElementById('descInput');
    const amountInput = document.getElementById('amountInput');
    
    const description = descInput.value;
    const amount = parseFloat(amountInput.value);

    if (description === "" || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid description and amount");
        return;
    }

    // Update Logic
    totalExpenses += amount;
    document.getElementById('expenseDisplay').innerText = `$${totalExpenses.toFixed(2)}`;
    
    // Add to List UI
    const list = document.getElementById('expenseList');
    const li = document.createElement('li');
    li.innerHTML = `${description} <span>-$${amount.toFixed(2)}</span>`;
    list.appendChild(li);

    // Clear Inputs
    descInput.value = '';
    amountInput.value = '';

    updateBalance();
    checkBudget();
}

// 3. Update Balance
function updateBalance() {
    const balance = totalBudget - totalExpenses;
    const balanceDisplay = document.getElementById('balanceDisplay');
    balanceDisplay.innerText = `$${balance.toFixed(2)}`;
    
    // Change color if balance is negative
    if(balance < 0) {
        balanceDisplay.style.color = "red";
    } else {
        balanceDisplay.style.color = "black";
    }
}

// 4. Budget Alert System
function checkBudget() {
    const alertBox = document.getElementById('alertBox');
    
    if (totalExpenses > totalBudget && totalBudget > 0) {
        alertBox.classList.remove('hidden'); // Show Alert
    } else {
        alertBox.classList.add('hidden'); // Hide Alert
    }
}