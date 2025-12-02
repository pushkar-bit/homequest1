import React, { useState } from 'react';
import { Calculator, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EMICalculator() {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [rateOfInterest, setRateOfInterest] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [emi, setEmi] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);

  React.useEffect(() => {
    const calculate = () => {
      const principal = parseFloat(loanAmount);
      const rate = parseFloat(rateOfInterest) / 12 / 100;
      const months = parseFloat(loanTenure) * 12;

      if (principal <= 0 || rateOfInterest < 0 || loanTenure <= 0) {
        return;
      }

      const emiValue = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
      const totalAmt = emiValue * months;
      const totalInt = totalAmt - principal;

      setEmi(emiValue.toFixed(2));
      setTotalAmount(totalAmt.toFixed(2));
      setTotalInterest(totalInt.toFixed(2));
    };
    calculate();
  }, [loanAmount, rateOfInterest, loanTenure]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-green-700" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-green-700 flex items-center gap-3">
              <Calculator className="w-8 h-8" />
              EMI Calculator
            </h1>
            <p className="text-green-600 text-sm mt-1">Calculate your monthly home loan EMI</p>
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Loan Amount: <span className="text-green-600">{formatCurrency(loanAmount)}</span>
            </label>
            <input
              type="range"
              min="500000"
              max="50000000"
              step="100000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full h-3 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>₹5 L</span>
              <span>₹5 Cr</span>
            </div>
          </div>

          {}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Rate of Interest (p.a.): <span className="text-green-600">{rateOfInterest.toFixed(2)}%</span>
            </label>
            <input
              type="range"
              min="3"
              max="15"
              step="0.1"
              value={rateOfInterest}
              onChange={(e) => setRateOfInterest(e.target.value)}
              className="w-full h-3 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>3%</span>
              <span>15%</span>
            </div>
          </div>

          {}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Loan Tenure (Years): <span className="text-green-600">{loanTenure} years</span>
            </label>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={loanTenure}
              onChange={(e) => setLoanTenure(e.target.value)}
              className="w-full h-3 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1 year</span>
              <span>30 years</span>
            </div>
          </div>
        </div>

        {}
        {emi && (
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">EMI Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {}
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-6">
                <p className="text-green-100 text-sm font-semibold mb-2">Monthly EMI</p>
                <p className="text-3xl font-bold">{formatCurrency(emi)}</p>
              </div>

              {}
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-6">
                <p className="text-green-100 text-sm font-semibold mb-2">Total Interest</p>
                <p className="text-3xl font-bold">{formatCurrency(totalInterest)}</p>
              </div>

              {}
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-6">
                <p className="text-green-100 text-sm font-semibold mb-2">Total Amount</p>
                <p className="text-3xl font-bold">{formatCurrency(totalAmount)}</p>
              </div>
            </div>

            {}
            <div className="mt-8 pt-8 border-t border-white border-opacity-20">
              <p className="text-sm text-green-100 mb-4">Principal + Interest Breakdown</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Principal Amount:</span>
                  <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Interest Payable:</span>
                  <span className="font-semibold">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold mt-4 pt-4 border-t border-white border-opacity-20">
                  <span>Total Amount to Pay:</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
