import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../api'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-danger">Failed to load statistics</p>
      </div>
    )
  }

  // Prepare data for charts
  const riskDistributionData = Object.entries(stats.risk_distribution).map(
    ([name, value]) => ({ name, value })
  )

  const ageDistributionData = Object.entries(stats.age_distribution).map(
    ([name, value]) => ({ name, value })
  )

  const COLORS = ['#10B981', '#F59E0B', '#EF4444']

  const PIE_COLORS = {
    Low: '#10B981',
    Moderate: '#F59E0B',
    High: '#EF4444',
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-text mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Overview of all screenings and predictions</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-6 shadow-lg"
          >
            <div className="text-3xl font-bold text-primary mb-2">
              {stats.total_screenings}
            </div>
            <div className="text-gray-600">Total Screenings</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-6 shadow-lg"
          >
            <div className="text-3xl font-bold text-secondary mb-2">
              {stats.risk_distribution.Low || 0}
            </div>
            <div className="text-gray-600">Low Risk Cases</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl p-6 shadow-lg"
          >
            <div className="text-3xl font-bold text-danger mb-2">
              {stats.risk_distribution.High || 0}
            </div>
            <div className="text-gray-600">High Risk Cases</div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Risk Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-8 shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-text mb-6">
              Risk Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[entry.name] || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Age Distribution Bar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-xl p-8 shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-text mb-6">
              Age Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2563EB" radius={[8, 8, 0, 0]}>
                  {ageDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Predictions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-text mb-6">
            Recent Predictions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-text">
                    Age
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-text">
                    Gender
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-text">
                    Risk Level
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-text">
                    Probability
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-text">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_predictions.map((prediction, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-700">
                      {prediction.age}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {prediction.gender}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold text-white`}
                        style={{
                          backgroundColor:
                            PIE_COLORS[prediction.risk_level] || '#6B7280',
                        }}
                      >
                        {prediction.risk_level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {prediction.probability}%
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-sm">
                      {new Date(prediction.timestamp).toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard

