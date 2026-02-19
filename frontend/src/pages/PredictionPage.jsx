import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api'

const PredictionPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    hemoglobin: '',
    diet: '',
    symptoms: [],
    rural_mode: false,
  })

  const symptomsList = [
    { id: 'fatigue', label: 'Fatigue' },
    { id: 'dizziness', label: 'Dizziness' },
    { id: 'pale_skin', label: 'Pale Skin' },
    { id: 'weakness', label: 'Weakness' },
    { id: 'shortness_breath', label: 'Shortness of Breath' },
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSymptomChange = (symptomId) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptomId)
        ? prev.symptoms.filter((s) => s !== symptomId)
        : [...prev.symptoms, symptomId],
    }))
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.age || formData.age < 18 || formData.age > 100) {
      newErrors.age = 'Age must be between 18 and 100'
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select gender'
    }

    if (!formData.rural_mode && (!formData.hemoglobin || formData.hemoglobin < 5 || formData.hemoglobin > 18)) {
      newErrors.hemoglobin = 'Hemoglobin must be between 5 and 18 g/dL'
    }

    if (!formData.diet) {
      newErrors.diet = 'Please select diet type'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      const payload = {
        age: parseInt(formData.age),
        gender: formData.gender,
        hemoglobin: formData.rural_mode ? null : parseFloat(formData.hemoglobin),
        diet: formData.diet,
        symptoms: formData.symptoms,
        rural_mode: formData.rural_mode,
      }

      const response = await api.post('/predict', payload)
      
      // Store results in sessionStorage
      sessionStorage.setItem('predictionResults', JSON.stringify(response.data))
      
      navigate('/results')
    } catch (error) {
      console.error('Prediction error:', error)
      setErrors({ submit: error.response?.data?.error || 'Failed to get prediction. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-text mb-4">
            Anemia Risk Assessment
          </h1>
          <p className="text-lg text-gray-600">
            Fill in the form below to get your AI-powered risk prediction
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass-card rounded-xl p-8 shadow-lg"
        >
          {/* Age */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-2">
              Age *
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="18"
              max="100"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.age ? 'border-danger' : 'border-gray-300'
              }`}
              placeholder="Enter your age"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-danger">{errors.age}</p>
            )}
          </div>

          {/* Gender */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-2">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.gender ? 'border-danger' : 'border-gray-300'
              }`}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-danger">{errors.gender}</p>
            )}
          </div>

          {/* Rural Mode Toggle */}
          <div className="mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="rural_mode"
                checked={formData.rural_mode}
                onChange={handleChange}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-text">
                Rural Mode (No hemoglobin test available)
              </span>
            </label>
          </div>

          {/* Hemoglobin */}
          {!formData.rural_mode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <label className="block text-sm font-medium text-text mb-2">
                Hemoglobin Level (g/dL) *
              </label>
              <input
                type="number"
                name="hemoglobin"
                value={formData.hemoglobin}
                onChange={handleChange}
                min="5"
                max="18"
                step="0.1"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.hemoglobin ? 'border-danger' : 'border-gray-300'
                }`}
                placeholder="Enter hemoglobin level (e.g., 12.5)"
              />
              {errors.hemoglobin && (
                <p className="mt-1 text-sm text-danger">{errors.hemoglobin}</p>
              )}
            </motion.div>
          )}

          {/* Diet */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-2">
              Diet Type *
            </label>
            <select
              name="diet"
              value={formData.diet}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.diet ? 'border-danger' : 'border-gray-300'
              }`}
            >
              <option value="">Select diet type</option>
              <option value="poor">Poor (Limited nutrition)</option>
              <option value="moderate">Moderate (Average nutrition)</option>
              <option value="good">Good (Well-balanced nutrition)</option>
            </select>
            {errors.diet && (
              <p className="mt-1 text-sm text-danger">{errors.diet}</p>
            )}
          </div>

          {/* Symptoms */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-2">
              Symptoms (Select all that apply)
            </label>
            <div className="space-y-2">
              {symptomsList.map((symptom) => (
                <label
                  key={symptom.id}
                  className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.symptoms.includes(symptom.id)}
                    onChange={() => handleSymptomChange(symptom.id)}
                    className="w-5 h-5 text-primary rounded focus:ring-primary"
                  />
                  <span className="text-text">{symptom.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-danger">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full gradient-button text-white font-semibold py-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              'Get Risk Assessment'
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  )
}

export default PredictionPage

