import React, { useState, useEffect, useCallback } from 'react';
              // eslint-disable-next-line
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('paper');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ['paper', 'plastic', 'metal', 'glass', 'cardboard', 'trash'];

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const response = await fetch(
        `http://127.0.0.1:8000/prediction-stats?date=${formattedDate}&category=${selectedCategory}`
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    setLoading(false);
  }, [selectedDate, selectedCategory]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const chartData = {
    labels: ['Total', 'Correct', 'Incorrect'],
    datasets: [
      {
        label: 'Predictions',
        data: stats ? [
          stats.total_predictions,
          stats.correct_predictions,
          stats.incorrect_predictions
        ] : [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Prediction Statistics
          </h1>
          <p className="text-lg text-gray-600">
            Analyze waste classification performance metrics
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                className="w-full p-2 border rounded-md"
                maxDate={new Date()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Total Predictions</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.total_predictions}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800">Correct Predictions</h3>
                <p className="text-3xl font-bold text-green-600">{stats.correct_predictions}</p>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800">Incorrect Predictions</h3>
                <p className="text-3xl font-bold text-red-600">{stats.incorrect_predictions}</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800">Accuracy Rate</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.accuracy_rate}%</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600">No data available</div>
          )}

          {stats && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Prediction Trends</h3>
              <div className="h-96">
                <Line data={chartData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Prediction Statistics Overview'
                    }
                  }
                }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
