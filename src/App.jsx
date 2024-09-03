import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import BudgetTracker from "./BudgetTracker";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/budget-tracker" element={<BudgetTracker />} />
      </Routes>
    </Router>
  );
}

export default App;