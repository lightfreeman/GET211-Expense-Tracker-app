document.addEventListener("DOMContentLoaded", () => {

    let currentBudget = 0;
    let transactions = [];
    let myChart = null;

    // DOM ELEMENTS (SAFE QUERIES)
    const budgetInput   = document.getElementById('total-budget');
    const balanceEl     = document.getElementById('balance-amount');
    const budgetEl      = document.getElementById('budget-amount');
    const spentEl       = document.getElementById('spent-amount');
    const list          = document.getElementById('list');
    const text          = document.getElementById('text');
    const amount        = document.getElementById('amount');
    const alertMsg      = document.getElementById('alert-msg');
    const chartCanvas   = document.getElementById('expenseChart');
    const navLinks = document.querySelectorAll(".dashboard-nav .nav-link");
    const currentPage = window.location.pathname.split("/").pop(); // e.g., "dashboard.html"

    const hasBudgetUI      = !!budgetInput;
    const hasTransactionUI = !!list && !!text && !!amount;
    const hasDashboardUI   = !!chartCanvas && !!balanceEl && !!budgetEl && !!spentEl;

    // RENDER EXPENSE
    function addTransactionDOM(transaction) {
        if (!hasTransactionUI) return;

        const item = document.createElement('li');

        // Use textContent to prevent XSS
        const textNode = document.createTextNode(transaction.text);
        item.appendChild(textNode);

        const div = document.createElement('div');

        const span = document.createElement('span');
        span.classList.add('money-minus');
        span.textContent = `-₦${transaction.amount}`;

        const btn = document.createElement('button');
        btn.classList.add('delete-btn');
        btn.textContent = 'x';
        btn.addEventListener('click', () => removeTransaction(transaction.id));

        div.appendChild(span);
        div.appendChild(btn);

        item.appendChild(div);
        list.appendChild(item);
    }

    // FETCH TRANSACTIONS (ALL PAGES)
    function fetchTransactions() {
        fetch("../backend/expenses/fetch.php")
            .then(res => res.json())
            .then(data => {
                if (!Array.isArray(data)) return;

                transactions = data.map(item => ({
                    id: item.id,
                    text: item.title,
                    amount: Number(item.amount)
                }));

                if (hasTransactionUI) {
                    list.innerHTML = '';
                    transactions.forEach(addTransactionDOM);
                }

                updateValues();
            })
            .catch(err => console.error('Failed to fetch transactions:', err));
    }

    // ADD EXPENSE
    function addTransaction() {
        if (!hasTransactionUI) return;

        const description = text.value?.trim();
        const amt = parseFloat(amount.value);

        if (!description || isNaN(amt) || amt <= 0) {
            alert("Enter a valid expense and amount.");
            return;
        }

        if (currentBudget <= 0) {
            alert("Please set a budget first.");
            return;
        }

        fetch("../backend/expenses/add.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description, amount: amt })
        })
        .then(res => res.json())
        .then(data => {
            if (data?.status === "OK") {
                if (text) text.value = '';
                if (amount) amount.value = '';
                fetchTransactions();
            }
        })
        .catch(err => console.error('Failed to add transaction:', err));
    }

    window.addTransaction = addTransaction;

    // DELETE EXPENSE
    window.removeTransaction = function (id) {
        fetch("../backend/expenses/delete.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        })
        .then(() => fetchTransactions())
        .catch(err => console.error('Failed to delete transaction:', err));
    };

    // UPDATE VALUES
    function updateValues() {
        if (!hasDashboardUI && !hasBudgetUI) return;

        const expenses = transactions.reduce((acc, t) => acc + t.amount, 0);
        const remaining = currentBudget - expenses;

        if (budgetEl)  budgetEl.innerText  = `₦${currentBudget.toFixed(2)}`;
        if (spentEl)   spentEl.innerText   = `₦${expenses.toFixed(2)}`;
        if (balanceEl) balanceEl.innerText = `₦${remaining.toFixed(2)}`;

        checkBudget(remaining);
        updateChart(remaining, expenses);
    }

    // BUDGET ALERT
    function checkBudget(remaining) {
        if (!alertMsg) return;

        alertMsg.classList.remove('show');

        if (remaining < 0) {
            alertMsg.innerText = "CRITICAL: You are over budget!";
            alertMsg.classList.add('show');
        } else if (currentBudget > 0 && remaining < currentBudget * 0.2) {
            alertMsg.innerText = "Warning: Less than 20% budget remaining.";
            alertMsg.classList.add('show');
        }
    }

    // PIE CHART
    function updateChart(remaining, expenses) {
        if (!hasDashboardUI || currentBudget <= 0) return;
        if (typeof Chart === "undefined") return; // prevent crash if Chart.js not loaded

        const ctx = chartCanvas.getContext('2d');
        const safeRemaining = Math.max(remaining, 0);
        const safeExpenses  = expenses === 0 ? 0.01 : expenses;

        if (myChart) myChart.destroy();

        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Remaining', 'Expenses'],
                datasets: [{
                    data: [safeRemaining, safeExpenses],
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

    // FETCH BUDGET
    function fetchBudget() {
        fetch("../backend/budget/fetch.php")
            .then(res => res.json())
            .then(data => {
                currentBudget = Number(data?.amount || 0);
                if (budgetInput) budgetInput.value = currentBudget;
                updateValues();
            })
            .catch(err => console.error('Failed to fetch budget:', err));
    }

    // SET BUDGET
    function setBudget() {
        if (!hasBudgetUI) return;

        const amt = parseFloat(budgetInput.value);
        if (isNaN(amt) || amt <= 0) {
            alert("Enter a valid budget.");
            return;
        }

        fetch("../backend/budget/set.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: amt })
        })
        .then(res => res.json())
        .then(data => {
            if (data?.status === "OK") {
                currentBudget = amt;
                updateValues();
                alert("Budget successfully updated");
            }
        })
        .catch(err => console.error('Failed to set budget:', err));
    }

    if (hasBudgetUI) {
        budgetInput?.addEventListener("blur", setBudget);
    }

    // START APP
    fetchBudget();
    fetchTransactions();

    // Highlight current page nav link
    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href").split("/").pop();
        if (linkPage === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});


