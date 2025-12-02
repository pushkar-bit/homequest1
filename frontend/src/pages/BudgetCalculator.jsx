import React, { useState } from 'react';
import { DollarSign, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BudgetCalculator() {
  const navigate = useNavigate();
  const [monthlyIncome, setMonthlyIncome] = useState(100000);
  const [existingEMI, setExistingEMI] = useState(0);
  const [otherLoans, setOtherLoans] = useState(0);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [maxBudget, setMaxBudget] = useState(null);
  const [maxDownPayment, setMaxDownPayment] = useState(null);

  React.useEffect(() => {
    
    const maxAffordableEMI = (monthlyIncome * 0.5) - parseFloat(existingEMI) - parseFloat(otherLoans);

    if (maxAffordableEMI <= 0) {
      setMaxBudget(0);
      setMaxDownPayment(0);
      return;
    }

    
    const rate = parseFloat(interestRate) / 12 / 100;
    const months = parseFloat(loanTenure) * 12;
    const loanAmount = maxAffordableEMI * (Math.pow(1 + rate, months) - 1) / (rate * Math.pow(1 + rate, months));

    
    const downPayment = (loanAmount * parseFloat(downPaymentPercent)) / (100 - parseFloat(downPaymentPercent));
    const totalBudget = loanAmount + downPayment;

    setMaxBudget(totalBudget);
    setMaxDownPayment(downPayment);
  }, [monthlyIncome, existingEMI, otherLoans, downPaymentPercent, interestRate, loanTenure]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRiskLevel = () => {
    const ratio = (existingEMI + otherLoans) / (monthlyIncome * 0.5);
    if (ratio > 0.75) return { level: 'High Risk', color: 'text-red-600', bg: 'bg-red-50' };
    if (ratio > 0.5) return { level: 'Medium Risk', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { level: 'Low Risk', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const risk = getRiskLevel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-purple-700" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-purple-700 flex items-center gap-3">
              <DollarSign className="w-8 h-8" />
              Budget Calculator
            </h1>
            <p className="text-purple-600 text-sm mt-1">Determine your maximum home budget based on your income</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Financial Details</h2>

            {}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly Income: <span className="text-purple-600">{formatCurrency(monthlyIncome)}</span>
              </label>
              <input
                type="range"
                min="20000"
                max="1000000"
                step="10000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Existing Monthly EMI: <span className="text-purple-600">{formatCurrency(existingEMI)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={existingEMI}
                onChange={(e) => setExistingEMI(e.target.value)}
                className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Other Monthly Obligations: <span className="text-purple-600">{formatCurrency(otherLoans)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={otherLoans}
                onChange={(e) => setOtherLoans(e.target.value)}
                className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Down Payment (%): <span className="text-purple-600">{downPaymentPercent}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(e.target.value)}
                className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Interest Rate (p.a.): <span className="text-purple-600">{interestRate.toFixed(2)}%</span>
              </label>
              <input
                type="range"
                min="3"
                max="15"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loan Tenure (Years): <span className="text-purple-600">{loanTenure} years</span>
              </label>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={loanTenure}
                onChange={(e) => setLoanTenure(e.target.value)}
                className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          </div>

          {}
          <div className="space-y-6">
            {}
            {maxBudget && (
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-xl p-8 text-white">
                <h2 className="text-lg font-semibold mb-4">Maximum Home Budget</h2>
                <div className="text-4xl font-bold mb-6">{formatCurrency(maxBudget)}</div>
                
                <div className="space-y-3 border-t border-white border-opacity-20 pt-6">
                  <div className="flex justify-between">
                    <span className="text-purple-100">Down Payment:</span>
                    <span className="font-semibold">{formatCurrency(maxDownPayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-100">Loan Amount:</span>
                    <span className="font-semibold">{formatCurrency(maxBudget - maxDownPayment)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-purple-200 pt-3 border-t border-white border-opacity-20">
                    <span>Affordable Monthly EMI:</span>
                    <span className="font-semibold">{formatCurrency((monthlyIncome * 0.5) - parseFloat(existingEMI) - parseFloat(otherLoans))}</span>
                  </div>
                </div>
              </div>
            )}

            {}
            <div className={`${risk.bg} rounded-2xl shadow-lg p-8`}>
              <h3 className={`text-lg font-bold ${risk.color} mb-4`}>Financial Risk Level</h3>
              <p className={`text-2xl font-bold ${risk.color}`}>{risk.level}</p>
              <p className="text-gray-600 text-sm mt-3">
                Based on your existing obligations and income ratio
              </p>
            </div>

            {}
            <div className="bg-blue-50 rounded-2xl shadow-lg p-8 border-l-4 border-blue-600">
              <h3 className="text-lg font-bold text-blue-900 mb-3">💡 Important Notes</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Maximum EMI = 50% of monthly income</li>
                <li>• Includes existing EMI and other obligations</li>
                <li>• Down payment affects loan eligibility</li>
                <li>• Consult with banks for final approval</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
