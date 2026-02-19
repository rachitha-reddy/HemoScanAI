import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const ResultsPage = () => {
  const navigate = useNavigate()
  const [results, setResults] = useState(null)

  useEffect(() => {
    const storedResults = sessionStorage.getItem('predictionResults')
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    } else {
      navigate('/predict')
    }
  }, [navigate])

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const { risk_level, risk_score, probability, top_factors, recommendations } = results

  const getRiskColor = () => {
    if (risk_level === 'Low') return '#10B981'
    if (risk_level === 'Moderate') return '#F59E0B'
    return '#EF4444'
  }

  const getRiskGradient = () => {
    if (risk_level === 'Low') return 'from-green-400 to-green-600'
    if (risk_level === 'Moderate') return 'from-yellow-400 to-yellow-600'
    return 'from-red-400 to-red-600'
  }

  // Prepare data for feature importance chart
  const featureData = top_factors.map((factor) => ({
    name: factor.factor,
    value: factor.importance,
  }))

  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  const downloadReport = () => {
    const reportContent = `
HEMOSCAN AI - RISK ASSESSMENT REPORT
====================================

Risk Level: ${risk_level}
Risk Score: ${risk_score}%
Probability: ${(probability * 100).toFixed(2)}%

TOP CONTRIBUTING FACTORS:
${top_factors.map((f, i) => `${i + 1}. ${f.factor}: ${f.importance}%`).join('\n')}

RECOMMENDATIONS:
${recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Generated on: ${new Date().toLocaleString()}
    `
    
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hemoscan-report-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-text mb-4">
            Your Risk Assessment Results
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Risk Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass-card rounded-xl p-8 shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-text mb-6">
              Risk Assessment
            </h2>

            {/* Risk Meter */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-64 h-64 mb-6">
                <svg className="transform -rotate-90 w-64 h-64">
                  <circle
                    cx="128"
                    cy="128"
                    r="112"
                    stroke="#E5E7EB"
                    strokeWidth="16"
                    fill="none"
                  />
                  <motion.circle
                    cx="128"
                    cy="128"
                    r="112"
                    stroke={getRiskColor()}
                    strokeWidth="16"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: risk_score / 100 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                      className={`text-5xl font-bold bg-gradient-to-r ${getRiskGradient()} bg-clip-text text-transparent`}
                    >
                      {risk_score}%
                    </motion.div>
                    <div className="text-sm text-gray-600 mt-2">Risk Score</div>
                  </div>
                </div>
              </div>

              {/* Risk Level Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: 'spring' }}
                className={`px-6 py-3 rounded-full text-white font-semibold text-lg`}
                style={{ backgroundColor: getRiskColor() }}
              >
                {risk_level} Risk
              </motion.div>
            </div>

            {/* Probability */}
            <div className="text-center">
              <p className="text-gray-600 mb-2">Anemia Risk Probability</p>
              <p className="text-3xl font-bold text-text">
                {(probability * 100).toFixed(2)}%
              </p>
            </div>
          </motion.div>

          {/* Recommendations Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-8 shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-text mb-6">
              Recommendations
            </h2>
            <ul className="space-y-4">
              {recommendations.map((rec, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <span className="text-primary mt-1">•</span>
                  <span className="text-gray-700">{rec}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Feature Importance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass-card rounded-xl p-8 shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-text mb-6">
              Explainable AI - Top Contributing Factors
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2563EB" radius={[8, 8, 0, 0]}>
                  {featureData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Download Report Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-3 flex justify-center"
          >
            <motion.button
              onClick={downloadReport}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Download Report
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage

