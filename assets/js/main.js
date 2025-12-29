document.addEventListener("DOMContentLoaded", () => {

    const budgetInput = document.getElementById('total-budget');
    const balanceEl = document.getElementById('balance-amount');
    const budgetEl = document.getElementById('budget-amount');
    const spentEl = document.getElementById('spent-amount');
    const list = document.getElementById('list');
    const text = document.getElementById('text');
    const amount = document.getElementById('amount');
    const alertMsg = document.getElementById('alert-msg');
    const chartCanvas = document.getElementById('expenseChart');

    let myChart = null;
    let transactions = [];

    // ===============================
    // RENDER EXPENSE
    // ===============================
    function addTransactionDOM(transaction) {
        const item = document.createElement('li');
        item.innerHTML = `
            ${transaction.text}
            <div>
                <span class="money-minus">-₦${transaction.amount}</span>
                <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
            </div>
        `;
        list.appendChild(item);
    }

    // ===============================
    // INIT
    // ===============================
    function init() {
        list.innerHTML = '';
        transactions.forEach(addTransactionDOM);
        updateValues();
    }

    // ===============================
    // FETCH EXPENSES
    // ===============================
    function fetchTransactions() {
        fetch("../backend/expenses/fetch.php")
            .then(res => res.json())
            .then(data => {
                transactions = data.map(item => ({
                    id: item.id,
                    text: item.title,
                    amount: Number(item.amount)
                }));
                init();
            });
    }

    // ===============================
    // ADD EXPENSE
    // ===============================
    function addTransaction() {
        const description = text.value.trim();
        const amt = parseFloat(amount.value);

        if (!description) {
            alert('Please enter an expense description.');
            return;
        }
        if (isNaN(amt) || amt <= 0) {
            alert('Please enter a valid amount greater than 0.');
            return;
        }
        if (!budgetInput.value || parseFloat(budgetInput.value) <= 0) {
            alert('Please set a total budget first.');
            return;
        }

        fetch("../backend/expenses/add.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                description: description,
                amount: amt
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "OK") {
                text.value = '';
                amount.value = '';
                fetchTransactions();
            } else {
                alert("Error: " + (data.error || "Unknown error"));
            }
        })
        .catch(err => console.error(err));
    }

    window.addTransaction = addTransaction;

    // ===============================
    // DELETE EXPENSE
    // ===============================
    window.removeTransaction = function(id) {
        fetch("../backend/expenses/delete.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        })
        .then(() => fetchTransactions());
    };

    // ===============================
    // UPDATE VALUES
    // ===============================
    function updateValues() {
        const totalBudget = parseFloat(budgetInput.value) || 0;
        const expenses = transactions.reduce((acc, item) => acc + item.amount, 0);
        const remaining = totalBudget - expenses;

        budgetEl.innerText = `₦${totalBudget.toFixed(2)}`;
        spentEl.innerText = `₦${expenses.toFixed(2)}`;
        balanceEl.innerText = `₦${remaining.toFixed(2)}`;

        checkBudget(remaining, totalBudget);
        updateChart(remaining, expenses);
    }

    // ===============================
    // BUDGET ALERT
    // ===============================
    function checkBudget(remaining, total) {
        alertMsg.style.display = 'none';
        if (remaining < 0) {
            alertMsg.innerText = "CRITICAL: You are over budget!";
            alertMsg.style.display = 'block';
        } else if (remaining < total * 0.2 && total > 0) {
            alertMsg.innerText = "Warning: Less than 20% budget remaining.";
            alertMsg.style.display = 'block';
        }
    }

    // ===============================
    // CHART
    // ===============================
    function updateChart(remaining, expenses) {
        if (!chartCanvas) return;
        const ctx = chartCanvas.getContext('2d');
        const safeRemaining = remaining < 0 ? 0 : remaining;
        if (myChart) myChart.destroy();
        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Remaining', 'Expenses'],
                datasets: [{
                    data: [safeRemaining, expenses],
                    backgroundColor: ['#2ecc71', '#e74c3c'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    // ===============================
    // EVENTS
    // ===============================
    budgetInput.addEventListener('input', updateValues);

    // ===============================
    // START APP
    // ===============================
    fetchTransactions();


    // Fetch existing budget on load
function fetchBudget() {
    fetch("../backend/budget/fetch.php")
        .then(res => res.json())
        .then(data => {
            if (data.amount) {
                budgetInput.value = data.amount;
                updateValues();
            }
        });
}

// Set/update budget
function setBudget() {
    const amt = parseFloat(budgetInput.value);
    if (isNaN(amt) || amt <= 0) {
        alert("Please enter a valid budget amount.");
        return;
    }

    fetch("../backend/budget/set.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "OK") {
            updateValues();
            alert("Budget updated!");
        } else {
            alert("Error: " + (data.error || "Unknown error"));
        }
    });
}

// Attach event listener to budget input (on blur or button)
budgetInput.addEventListener("blur", setBudget);

// Call on page load
fetchBudget();


});
