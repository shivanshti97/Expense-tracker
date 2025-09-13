const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public")); 

// Saving file
app.post("/save", (req, res) => {
  const data = req.body;
  const line = `Income: ${data.income}, Expenses: ${data.expenses}, Remaining: ${data.remaining}, Advice: ${data.advice}\n`;
  fs.appendFileSync("expenses.txt", line);
  res.json({ message: "Saved successfully!" });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
