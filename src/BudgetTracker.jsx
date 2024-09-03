import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BudgetTracker.css';

function BudgetTracker() {
  const [budget, setBudget] = useState(0); // Initialize with 0
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [conversionRate, setConversionRate] = useState(null);
  const currency = localStorage.getItem('currency');
  const tripName = localStorage.getItem('tripName');
  const navigate = useNavigate();

  useEffect(() => {
    // Load budget and expenses from localStorage when the component mounts
    const savedBudget = parseFloat(localStorage.getItem('budgetAmount')) || 0;
    setBudget(savedBudget);

    const savedExpenses = JSON.parse(localStorage.getItem(`${tripName}_expenses`)) || [];
    setExpenses(savedExpenses);

    // Fetch conversion rate when currency changes
    const fetchConversionRate = async () => {
      try {
        // Fetch conversion rate from the selected currency to PHP
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${currency}`);
        setConversionRate(response.data.rates['PHP']);
      } catch (error) {
        console.error('Error fetching conversion rate:', error);
      }
    };

    fetchConversionRate();
  }, [tripName, currency]);

  const addExpense = async () => {
    try {
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${currency}`);
      const conversionRate = response.data.rates['PHP'];
      const convertedAmount = parseFloat(amount) * conversionRate;

      const newExpense = { name, amount: parseFloat(amount), currency, convertedAmount };
      const updatedExpenses = [...expenses, newExpense];

      setExpenses(updatedExpenses);
      localStorage.setItem(`${tripName}_expenses`, JSON.stringify(updatedExpenses));

      setShowModal(false);
      setName('');
      setAmount(0);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.convertedAmount, 0);
  const remaining = budget - totalExpenses;

  return (
    <div className="budget-tracker">
      <h1>{tripName} Budget Tracker</h1>
      <button onClick={() => navigate('/')}>Back</button>

      <div className="budget-display">
        <h2>Total Budget: ₱{budget.toFixed(2)}</h2>
      </div>

      <button onClick={() => setShowModal(true)}>Add Expense</button>

      <div className="expense-list">
        <h3>Expenses</h3>
        {expenses.length > 0 ? (
          <ul>
            {expenses.map((expense, index) => (
              <li key={index}>
                <span>{expense.name}:</span>
                <span className="expense-amount">
                  {expense.amount.toFixed(2)} {expense.currency} / ₱{expense.convertedAmount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No expenses added yet.</p>
        )}
      </div>

      <div className="remaining-budget">
        <span>Remaining Budget: ₱{remaining.toFixed(2)}</span>
        <span className="conversion-rate">
          {conversionRate !== null ? `*1 ${currency} = ${conversionRate.toFixed(4)} PHP` : ''}
        </span>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Expense</h2>
            <input
              type="text"
              placeholder="Expense Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={addExpense}>Enter</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetTracker;