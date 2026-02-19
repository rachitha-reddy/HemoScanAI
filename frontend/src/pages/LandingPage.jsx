import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Zap, BarChart3, Heart } from 'lucide-react'

const LandingPage = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning algorithms for accurate anemia risk assessment',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Results',
      description: 'Get your risk assessment in seconds with detailed explanations',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Explainable AI',
      description: 'Understand which factors contribute most to your risk level',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Personalized Recommendations',
      description: 'Receive tailored health recommendations based on your profile',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-blue-600 to-secondary py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              HemoScan AI
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto"
            >
              Early Detection of Anemia Risk Through AI-Powered Analysis
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-lg text-blue-50 mb-12 max-w-2xl mx-auto"
            >
              Empowering healthcare professionals and individuals with accurate,
              explainable anemia risk predictions for better health outcomes
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                to="/predict"
                className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Start Risk Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text mb-4">
              Why Choose HemoScan AI?
            </h2>
            <p className="text-xl text-gray-600">
              Cutting-edge technology meets healthcare excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Assess Your Risk?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Take our quick assessment and get instant, AI-powered insights
            </p>
            <Link
              to="/predict"
              className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage


