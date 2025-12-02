import React, { useState } from 'react';
import { CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoanEligibility() {
  const navigate = useNavigate();
  const [age, setAge] = useState(35);
  const [monthlyIncome, setMonthlyIncome] = useState(100000);
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [existingEMI, setExistingEMI] = useState(0);
  const [employment, setEmployment] = useState('salaried');
  const [cibilScore, setCibilScore] = useState(750);
  const [workExp, setWorkExp] = useState(5);
  const [eligibility, setEligibility] = useState(null);

  React.useEffect(() => {
    let score = 0;
    let issues = [];

    
    if (age >= 25 && age <= 60) {
      score += 20;
    } else {
      issues.push('Age should be between 25-60 years');
    }

    
    if (cibilScore >= 750) {
      score += 25;
    } else if (cibilScore >= 700) {
      score += 15;
      issues.push('CIBIL score could be improved (>750 recommended)');
    } else {
      issues.push('CIBIL score below 700 - loan may be rejected');
    }

    
    if (workExp >= 2) {
      score += 20;
    } else {
      issues.push('Minimum 2 years work experience required');
    }

    
    const emiToIncome = existingEMI / (monthlyIncome * 0.5);
    if (emiToIncome < 0.3) {
      score += 20;
    } else if (emiToIncome < 0.5) {
      score += 10;
    } else {
      issues.push('Existing EMI obligations too high');
    }

    
    const loanToIncome = loanAmount / (monthlyIncome * 60);
    if (loanToIncome <= 200) {
      score += 15;
    } else if (loanToIncome <= 250) {
      score += 10;
      issues.push('Loan amount is on higher side relative to income');
    } else {
      issues.push('Loan amount exceeds 250x monthly income');
    }

    
    if (employment === 'salaried') {
      score += 10;
    } else if (employment === 'self-employed') {
      score += 8;
      issues.push('Additional documents may be required for self-employed');
    }

    const eligible = score >= 70;
    const category = score >= 90 ? 'Highly Eligible' : score >= 70 ? 'Eligible' : 'Not Eligible';

    setEligibility({
      eligible,
      score,
      category,
      issues,
      maxLoanEligible: monthlyIncome * 150,
    });
  }, [age, monthlyIncome, loanAmount, existingEMI, employment, cibilScore, workExp]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-orange-700" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-orange-700 flex items-center gap-3">
              <CheckCircle className="w-8 h-8" />
              Loan Eligibility Checker
            </h1>
            <p className="text-orange-600 text-sm mt-1">Check your loan eligibility instantly</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Details</h2>

            {}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Age: <span className="text-orange-600">{age} years</span>
              </label>
              <input
                type="range"
                min="21"
                max="70"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
            </div>

            {}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly Income: <span className="text-orange-600">{formatCurrency(monthlyIncome)}</span>
              </label>
              <input
                type="range"
                min="20000"
                max="1000000"
                step="10000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
            </div>

            {}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loan Amount Requested: <span className="text-orange-600">{formatCurrency(loanAmount)}</span>
              </label>
              <input
                type="range"
                min="500000"
                max="50000000"
                step="100000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
            </div>

            {}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Existing Monthly EMI: <span className="text-orange-600">{formatCurrency(existingEMI)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={existingEMI}
                onChange={(e) => setExistingEMI(e.target.value)}
                className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
            </div>

            {}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Employment Type</label>
              <select
                value={employment}
                onChange={(e) => setEmployment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600"
              >
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self-Employed</option>
                <option value="business">Business Owner</option>
              </select>
            </div>

            {}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CIBIL Score: <span className="text-orange-600">{cibilScore}</span>
              </label>
              <input
                type="range"
                min="300"
                max="900"
                step="10"
                value={cibilScore}
                onChange={(e) => setCibilScore(e.target.value)}
                className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <p className="text-xs text-gray-500 mt-2">Recommended: 750+</p>
            </div>

            {}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Work Experience: <span className="text-orange-600">{workExp} years</span>
              </label>
              <input
                type="range"
                min="0"
                max="40"
                value={workExp}
                onChange={(e) => setWorkExp(e.target.value)}
                className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
            </div>
          </div>

          {}
          <div className="space-y-6">
            {eligibility && (
              <>
                {}
                <div
                  className={`rounded-2xl shadow-xl p-8 text-white ${
                    eligibility.eligible
                      ? 'bg-gradient-to-br from-green-600 to-green-700'
                      : 'bg-gradient-to-br from-red-600 to-red-700'
                  }`}
                >
                  <div className="mb-4">
                    <p className="text-lg font-semibold mb-2">Eligibility Status</p>
                    <p className="text-4xl font-bold">{eligibility.category}</p>
                  </div>

                  <div className="border-t border-white border-opacity-20 pt-4 mt-4">
                    <p className="text-green-100 text-sm mb-2">Eligibility Score</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-white bg-opacity-20 rounded-full h-3">
                        <div
                          className="bg-white h-3 rounded-full transition-all"
                          style={{ width: `${Math.min(eligibility.score, 100)}%` }}
                        />
                      </div>
                      <span className="font-bold text-lg">{eligibility.score}/100</span>
                    </div>
                  </div>

                  <div className="border-t border-white border-opacity-20 pt-4 mt-4">
                    <p className="text-white text-sm mb-3">Maximum Eligible Loan</p>
                    <p className="text-3xl font-bold">{formatCurrency(eligibility.maxLoanEligible)}</p>
                  </div>
                </div>

                {}
                {eligibility.issues.length > 0 && (
                  <div className="bg-red-50 rounded-2xl shadow-lg p-6 border-l-4 border-red-600">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                      <h3 className="font-bold text-red-900">Areas to Improve</h3>
                    </div>
                    <ul className="space-y-2">
                      {eligibility.issues.map((issue, index) => (
                        <li key={index} className="text-sm text-red-800 flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {}
                {eligibility.eligible && (
                  <div className="bg-green-50 rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
                    <p className="text-green-900 font-semibold mb-2">✓ You are eligible for a home loan!</p>
                    <p className="text-sm text-green-800">
                      Contact banks for detailed documentation and final approval.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
