import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../auth/AuthContext'
import api from '../api'
import { Calendar, TrendingUp, AlertCircle, CheckCircle, XCircle, Download } from 'lucide-react'

const ProfilePage = () => {
  const { user } = useAuth()
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPredictions()
  }, [])

  const fetchPredictions = async () => {
    try {
      setLoading(true)
      const response = await api.get('/user/predictions')
      setPredictions(response.data.predictions)
      setError('')
    } catch (err) {
      console.error('Error fetching predictions:', err)
      setError('Failed to load predictions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (riskLevel) => {
    if (riskLevel === 'Low') return 'text-green-600 bg-green-50 border-green-200'
    if (riskLevel === 'Moderate') return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getRiskIcon = (riskLevel) => {
    if (riskLevel === 'Low') return <CheckCircle className="w-5 h-5" />
    if (riskLevel === 'Moderate') return <AlertCircle className="w-5 h-5" />
    return <XCircle className="w-5 h-5" />
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const downloadReport = (prediction) => {
    const reportContent = `
HEMOSCAN AI - TEST RESULT REPORT
====================================

Test Date: ${formatDate(prediction.timestamp)}
Risk Level: ${prediction.risk_level}
Risk Score: ${prediction.risk_score}%
Probability: ${(prediction.probability * 100).toFixed(2)}%

PATIENT INFORMATION:
- Age: ${prediction.age}
- Gender: ${prediction.gender}
- Hemoglobin: ${prediction.hemoglobin ? prediction.hemoglobin + ' g/dL' : 'Not provided'}
- Diet: ${prediction.diet ? prediction.diet.charAt(0).toUpperCase() + prediction.diet.slice(1) : 'N/A'}

SYMPTOMS:
${prediction.symptoms && prediction.symptoms.length > 0 
  ? prediction.symptoms.map(s => `- ${s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}`).join('\n')
  : 'None reported'}

Generated on: ${new Date().toLocaleString()}
    `
    
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hemoscan-report-${prediction.id.substring(0, 8)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-text mb-2">My Profile</h1>
          <p className="text-gray-600">
            View your previous test results and health history
          </p>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6 shadow-lg mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-text mb-2">
                {user?.username}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Total Tests</div>
              <div className="text-3xl font-bold text-primary">
                {predictions.length}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}

        {/* Predictions List */}
        {predictions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-12 shadow-lg text-center"
          >
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text mb-2">
              No Test Results Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by taking your first anemia risk assessment
            </p>
            <a
              href="/predict"
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Take Your First Test
            </a>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {predictions.map((prediction, index) => (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Side - Test Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getRiskColor(
                          prediction.risk_level
                        )}`}
                      >
                        {getRiskIcon(prediction.risk_level)}
                        <span className="font-semibold">
                          {prediction.risk_level} Risk
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {formatDate(prediction.timestamp)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Risk Score</div>
                        <div className="text-2xl font-bold text-text">
                          {prediction.risk_score}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Age</div>
                        <div className="text-lg font-semibold text-text">
                          {prediction.age}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Gender</div>
                        <div className="text-lg font-semibold text-text">
                          {prediction.gender}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Hemoglobin</div>
                        <div className="text-lg font-semibold text-text">
                          {prediction.hemoglobin
                            ? `${prediction.hemoglobin} g/dL`
                            : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {prediction.symptoms && prediction.symptoms.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-500 mb-2">Symptoms</div>
                        <div className="flex flex-wrap gap-2">
                          {prediction.symptoms.map((symptom, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {symptom
                                .replace('_', ' ')
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Side - Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => downloadReport(prediction)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Report</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Statistics Summary */}
        {predictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 glass-card rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-text mb-4">
              Test History Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {
                    predictions.filter((p) => p.risk_level === 'Low').length
                  }
                </div>
                <div className="text-sm text-gray-600">Low Risk Tests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {
                    predictions.filter((p) => p.risk_level === 'Moderate')
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">Moderate Risk Tests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {
                    predictions.filter((p) => p.risk_level === 'High').length
                  }
                </div>
                <div className="text-sm text-gray-600">High Risk Tests</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage

