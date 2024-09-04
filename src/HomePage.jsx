import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [tripName, setTripName] = useState('');
  const [currency, setCurrency] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [travelBudgets, setTravelBudgets] = useState(JSON.parse(localStorage.getItem('travelBudgets')) || []);
  const navigate = useNavigate();

  const formatNumberWithCommas = (num) => {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleBudgetAmountChange = (e) => {
    const value = e.target.value;
    setBudgetAmount(value.replace(/,/g, ''));
  };

  const createBudget = () => {
    if (!tripName || !budgetAmount || isNaN(budgetAmount) || !currency) {
      alert("Please enter a valid trip name, budget amount, and select a currency.");
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
      <h1>✈️ Travel Budget Wallet ✈️</h1>
      <h5>✨ Effortlessly convert and manage your travel expenses in real-time! ✨</h5>
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
              type="text"
              placeholder="Budget Amount (PHP)"
              value={formatNumberWithCommas(budgetAmount)}
              onChange={handleBudgetAmountChange}
            />
            <div>
              <p>Enter Destination Travel Currency:</p>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="">Select Currency</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="KRW">KRW - Korean Won</option>
                <option value="THB">THB - Thai Baht</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="CHF">CHF - Swiss Franc</option>
                <option value="CNY">CNY - Chinese Yuan</option>
                <option value="SEK">SEK - Swedish Krona</option>
                <option value="NZD">NZD - New Zealand Dollar</option>
                <option value="MXN">MXN - Mexican Peso</option>
                <option value="SGD">SGD - Singapore Dollar</option>
                <option value="HKD">HKD - Hong Kong Dollar</option>
                <option value="NOK">NOK - Norwegian Krone</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="RUB">RUB - Russian Ruble</option>
                <option value="BRL">BRL - Brazilian Real</option>
                <option value="ZAR">ZAR - South African Rand</option>
                <option value="TRY">TRY - Turkish Lira</option>
                <option value="PLN">PLN - Polish Zloty</option>
                <option value="HUF">HUF - Hungarian Forint</option>
                <option value="ILS">ILS - Israeli New Shekel</option>
                <option value="DKK">DKK - Danish Krone</option>
                <option value="HRK">HRK - Croatian Kuna</option>
                <option value="CZK">CZK - Czech Koruna</option>
                <option value="RON">RON - Romanian Leu</option>
                <option value="BGN">BGN - Bulgarian Lev</option>
              </select>
            </div>
            <div className="button-container">
              <button className="submit" onClick={createBudget}>Submit</button>
              <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="travel-budgets">
        <h3>Your Travel Budgets:</h3>
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
          <p><i>*No travel budgets created yet.</i></p>
        )}
      </div>

      {/* info section */}
      <div className="info-section">
        <h4>Supported Currencies:</h4>
        <p>USD, EUR, JPY, KRW, THB, AUD, CAD, CHF, CNY, SEK, NZD, MXN, SGD, HKD, NOK, INR, RUB, BRL, ZAR, TRY, PLN, HUF, ILS, DKK, HRK, CZK, RON, BGN</p>
        <p>API Used: <a href="https://www.exchangerate-api.com/" target="_blank" rel="noopener noreferrer">https://www.exchangerate-api.com/</a></p>
      </div>
    </div>
  );
}

export default HomePage;
