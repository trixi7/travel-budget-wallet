import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [tripName, setTripName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [travelBudgets, setTravelBudgets] = useState(JSON.parse(localStorage.getItem('travelBudgets')) || []);
  const navigate = useNavigate();

  const createBudget = () => {
    if (!tripName || !budgetAmount || isNaN(budgetAmount)) {
      alert("Please enter a valid trip name and budget amount.");
      return;
    }

    const newBudget = { tripName, currency, budgetAmount: parseFloat(budgetAmount) };
    const updatedBudgets = [...travelBudgets, newBudget];
    setTravelBudgets(updatedBudgets);
    localStorage.setItem('travelBudgets', JSON.stringify(updatedBudgets));
    localStorage.setItem('tripName', tripName);
    localStorage.setItem('currency', currency);
    localStorage.setItem('budgetAmount', budgetAmount);
    navigate('/budget-tracker');
  };

  const deleteBudget = (index) => {
    const updatedBudgets = travelBudgets.filter((_, i) => i !== index);
    setTravelBudgets(updatedBudgets);
    localStorage.setItem('travelBudgets', JSON.stringify(updatedBudgets));
  };

  const goToBudgetTracker = (budget) => {
    localStorage.setItem('tripName', budget.tripName);
    localStorage.setItem('currency', budget.currency);
    localStorage.setItem('budgetAmount', budget.budgetAmount);
    navigate('/budget-tracker');
  };

  return (
    <div className="home-page">
      <h1>Travel Budget Tracker</h1>
      <button onClick={() => setShowModal(true)}>Create Travel Budget</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create Travel Budget</h2>
            <input
              type="text"
              placeholder="Trip Name"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Budget Amount (PHP)"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
            />
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="KRW">KRW - Korean Won</option>
              <option value="THB">THB - Thai Baht</option>
              {/* Add more currencies as needed */}
            </select>
            <button onClick={createBudget}>Submit</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="travel-budgets">
        <h3>Your Travel Budgets</h3>
        {travelBudgets.length > 0 ? (
          <ul>
            {travelBudgets.map((budget, index) => (
              <li key={index}>
                <span onClick={() => goToBudgetTracker(budget)}>{budget.tripName}</span>
                <button onClick={() => deleteBudget(index)}>X</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No travel budgets created yet.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;