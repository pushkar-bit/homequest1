import React, { useState } from 'react';
import { Ruler, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AreaConverter() {
  const navigate = useNavigate();
  const [value, setValue] = useState(1000);
  const [fromUnit, setFromUnit] = useState('sqft');
  const [toUnit, setToUnit] = useState('sqm');

  
  const conversionFactors = {
    sqft: 1,
    sqm: 10.764,
    sqyards: 9,
    acres: 43560,
    hectares: 107639,
    marla: 272.25,
    kanal: 5445,
    bigha: 14400,
    guntha: 1089,
    cent: 435.6,
  };

  const unitDescriptions = {
    sqft: 'Square Feet',
    sqm: 'Square Meter',
    sqyards: 'Square Yards',
    acres: 'Acres',
    hectares: 'Hectares',
    marla: 'Marla (India)',
    kanal: 'Kanal (India)',
    bigha: 'Bigha (India)',
    guntha: 'Guntha (India)',
    cent: 'Cent (South India)',
  };

  const convert = (inputValue, from, to) => {
    if (!inputValue || inputValue <= 0) return '0';
    
    const inSqft = inputValue * conversionFactors[from];
    const result = inSqft / conversionFactors[to];
    return result.toFixed(2);
  };

  const converted = convert(value, fromUnit, toUnit);

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-blue-700" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-3">
              <Ruler className="w-8 h-8" />
              Area Converter
            </h1>
            <p className="text-blue-600 text-sm mt-1">Convert between different area units</p>
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-8">
            {}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">From</label>
              <div className="space-y-2">
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                >
                  {Object.entries(unitDescriptions).map(([unit, desc]) => (
                    <option key={unit} value={unit}>
                      {desc} ({unit})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                  placeholder="Enter value"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {}
            <div className="flex justify-center">
              <button
                onClick={handleSwapUnits}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                ⇄ Swap
              </button>
            </div>

            {}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">To</label>
              <div className="space-y-2">
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                >
                  {Object.entries(unitDescriptions).map(([unit, desc]) => (
                    <option key={unit} value={unit}>
                      {desc} ({unit})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={converted}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-semibold"
                />
              </div>
            </div>
          </div>

          {}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-600">
            <p className="text-gray-600 text-sm mb-2">Conversion Result</p>
            <p className="text-3xl font-bold text-blue-700">
              {value} {unitDescriptions[fromUnit]}
              <span className="text-lg text-gray-600 ml-2">=</span>
              <span className="ml-2 text-blue-600">{converted} {unitDescriptions[toUnit]}</span>
            </p>
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Reference</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {}
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
              <h3 className="font-bold text-blue-900 mb-2">Square Feet (sqft)</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 1 sqft = 0.093 sqm</li>
                <li>• 1 sqft = 0.111 sqyards</li>
                <li>• 1 acre = 43,560 sqft</li>
              </ul>
            </div>

            {}
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
              <h3 className="font-bold text-green-900 mb-2">Square Meter (sqm)</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• 1 sqm = 10.764 sqft</li>
                <li>• 1 hectare = 10,000 sqm</li>
                <li>• Common in Europe & International</li>
              </ul>
            </div>

            {}
            <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-600">
              <h3 className="font-bold text-orange-900 mb-2">Acres</h3>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• 1 acre = 43,560 sqft</li>
                <li>• 1 acre = 0.405 hectares</li>
                <li>• Common in UK & USA</li>
              </ul>
            </div>

            {}
            <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-600">
              <h3 className="font-bold text-purple-900 mb-2">Marla</h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• 1 Marla = 272.25 sqft</li>
                <li>• Common in Pakistan & North India</li>
                <li>• 1 Kanal = 20 Marla</li>
              </ul>
            </div>

            {}
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
              <h3 className="font-bold text-red-900 mb-2">Bigha</h3>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• 1 Bigha = 14,400 sqft</li>
                <li>• Common in North India</li>
                <li>• Traditional agricultural measurement</li>
              </ul>
            </div>

            {}
            <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-600">
              <h3 className="font-bold text-yellow-900 mb-2">Guntha</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• 1 Guntha = 1,089 sqft</li>
                <li>• Common in Karnataka & Maharashtra</li>
                <li>• Traditional measurement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
