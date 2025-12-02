import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function InsightCard({ insight }) {
  const isPositiveGrowth = insight.oneYearGrowth >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {insight.city || insight.locality || insight.society || 'Market Insight'}
      </h3>

      <div className="space-y-3">
        {}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Avg Price/sqft</span>
          <span className="font-semibold text-blue-600">₹{insight.avgPriceSqFt}</span>
        </div>

        {}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">1-Year Growth</span>
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
              {insight.oneYearGrowth}%
            </span>
            {isPositiveGrowth ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </div>
        </div>

        {}
        {insight.demandIndex && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Demand Index</span>
            <span className="font-semibold text-purple-600">{insight.demandIndex}/100</span>
          </div>
        )}

        {}
        {insight.trendComment && (
          <div className="bg-blue-50 p-2 rounded text-sm text-blue-800">
            {insight.trendComment}
          </div>
        )}
      </div>
    </div>
  );
}
