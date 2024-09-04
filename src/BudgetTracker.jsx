import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BudgetTracker.css';

const formatNumberWithCommas = (num) => {
  if (!num) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

function BudgetTracker() {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [conversionRate, setConversionRate] = useState(null);
  const currency = localStorage.getItem('currency');
  const tripName = localStorage.getItem('tripName');
  const navigate = useNavigate();

  useEffect(() => {
    const savedBudget = parseFloat(localStorage.getItem('budgetAmount')) || 0;
    setBudget(savedBudget);

    const savedExpenses = JSON.parse(localStorage.getItem(`${tripName}_expenses`)) || [];
    setExpenses(savedExpenses);

    const fetchConversionRate = async () => {
      try {
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
      const convertedAmount = parseFloat(amount.replace(/,/g, '')) * conversionRate;

      const newExpense = { name, amount: parseFloat(amount.replace(/,/g, '')), currency, convertedAmount };
      const updatedExpenses = [...expenses, newExpense];

      setExpenses(updatedExpenses);
      localStorage.setItem(`${tripName}_expenses`, JSON.stringify(updatedExpenses));

      setShowModal(false);
      setName('');
      setAmount('');
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const deleteExpense = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
    localStorage.setItem(`${tripName}_expenses`, JSON.stringify(updatedExpenses));
  };

  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.convertedAmount, 0);
  const remaining = budget - totalExpenses;

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    setAmount(rawValue);
  };

  return (
    <div className="budget-tracker">
      <h1>💰 MY {tripName} TRAVEL WALLET 💰</h1>
      <button className="back-button" onClick={() => navigate('/')}>Back</button>

      <div className="budget-display">
        <h2>TOTAL BUDGET (PHP): ₱{formatNumberWithCommas(budget.toFixed(2))}</h2>
      </div>

      <div className="expense-list">
        <div className="expense-list-header">
          <h3>Expenses:</h3>
          <button className="add-expense-button" onClick={() => setShowModal(true)}>Add Expense</button>
        </div>
        {expenses.length > 0 ? (
          <ul>
            {expenses.map((expense, index) => (
              <li key={index}>
                <span>{expense.name}:</span>
                <span className="expense-amount">
                  {formatNumberWithCommas(expense.amount.toFixed(2))} {expense.currency} / ₱{formatNumberWithCommas(expense.convertedAmount.toFixed(2))}
                </span>
                <button className="delete-button" onClick={() => deleteExpense(index)}>X</button>
              </li>
            ))}
          </ul>
        ) : (
          <p><i>*No expenses added yet.</i></p>
        )}
      </div>

      <div className="remaining-budget">
        <h3>REMAINING BUDGET (PHP): ₱{formatNumberWithCommas(remaining.toFixed(2))}</h3>
        <span className="conversion-rate">
          {conversionRate !== null ? `*1 ${currency} = ${(conversionRate.toFixed(4))} PHP` : ''}
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
              type="text"
              placeholder={`Expense Amount (${currency})`}
              value={formatNumberWithCommas(amount)}
              onChange={handleAmountChange}
            />
            <div className="button-container">
              <button onClick={addExpense}>Enter</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetTracker;
