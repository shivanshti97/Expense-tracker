const form = document.getElementById("expenseForm");
const remainingEl = document.getElementById("remaining");
const adviceEl = document.getElementById("advice");
const resultsCard = document.getElementById("results");
const historyList = document.getElementById("history");
const historyCard = document.getElementById("historyCard");
const chartCard = document.getElementById("chartCard");

let historyData = [];
let chart;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const income = parseFloat(document.getElementById("income").value);
  const expenses = parseFloat(document.getElementById("expenses").value);

  if (isNaN(income) || isNaN(expenses) || income <= 0) {
    alert("Please enter valid numbers!");
    return;
  }

  const remaining = income - expenses;

  let advice = "";
  if (remaining > income * 0.3) {
    advice = "🎉 Great job! You're saving well.";
  } else if (remaining > 0) {
    advice = "💡 You're saving, but could cut expenses.";
  } else {
    advice = "⚠️ Warning: You're overspending!";
  }

  remainingEl.textContent = `Remaining Balance: ₹${remaining}`;
  adviceEl.textContent = `Advice: ${advice}`;
  resultsCard.classList.remove("hidden");

  // Save to history
  const record = { income, expenses, remaining, advice, date: new Date().toLocaleDateString() };
  historyData.push(record);
  updateHistory();

  // Save to backend
  await fetch("/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record)
  });

  // Update chart
  updateChart();
});

function updateHistory() {
  historyList.innerHTML = "";
  historyData.slice().reverse().forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.date} - Income: ₹${item.income}, Expenses: ₹${item.expenses}, Remaining: ₹${item.remaining}`;
    historyList.appendChild(li);
  });
  historyCard.classList.remove("hidden");
}

function updateChart() {
  const last = historyData[historyData.length - 1];
  const data = [last.expenses, last.remaining];

  if (!chart) {
    const ctx = document.getElementById("chart").getContext("2d");
    chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Expenses", "Savings"],
        datasets: [{
          data,
          backgroundColor: ["#ff6384", "#36a2eb"]
        }]
      }
    });
  } else {
    chart.data.datasets[0].data = data;
    chart.update();
  }
  chartCard.classList.remove("hidden");
}
