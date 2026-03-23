const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Company = require('../models/Company')

// load env variables
dotenv.config()

// company data to upload
const companiesData = [
  {
    name: 'Google',
    logo: 'G',
    description: 'Google is a multinational technology company focusing on search engine technology, online advertising, cloud computing, computer software, and artificial intelligence.',
    industry: 'Technology',
    founded: '1998',
    founders: ['Larry Page', 'Sergey Brin'],
    headquarters: 'Mountain View, California',

    culture: {
      values: ['Innovation', 'User Focus', 'Openness', 'Excellence'],
      workEnvironment: 'Google offers a collaborative environment with open workspaces, generous perks, and a focus on employee wellbeing.',
      benefits: [
        'Competitive salary and equity',
        'Free gourmet meals',
        'On-site wellness centers',
        'Generous parental leave'
      ]
    },

    interviewProcess: {
      difficulty: 'hard',
      rounds: [
        {
          name: 'Phone Screen',
          description: 'Initial technical screening with coding',
          duration: '45-60 minutes'
        },
        {
          name: 'Technical Interviews',
          description: '4-5 rounds of coding and system design',
          duration: '45 minutes each'
        },
        {
          name: 'Behavioral Interview',
          description: 'Googleyness assessment',
          duration: '30-45 minutes'
        }
      ]
    },

    commonQuestions: [
      {
        question: 'Design a URL shortener like bit.ly',
        type: 'system design',
        difficulty: 'medium'
      },
      {
        question: 'Implement LRU Cache',
        type: 'coding',
        difficulty: 'medium'
      },
      {
        question: 'Tell me about a time you disagreed with your manager',
        type: 'behavioral',
        difficulty: 'medium'
      }
    ]
  },

  {
    name: 'Amazon',
    logo: 'A',
    description: 'Amazon is a technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
    industry: 'E-commerce & Cloud',
    founded: '1994',
    founders: ['Jeff Bezos'],
    headquarters: 'Seattle, Washington',

    culture: {
      values: ['Customer Obsession', 'Ownership', 'Invent and Simplify'],
      workEnvironment: 'Fast-paced, data-driven culture with high ownership.',
      benefits: [
        'Competitive compensation',
        'Comprehensive health benefits',
        'Career development opportunities'
      ]
    },

    interviewProcess: {
      difficulty: 'hard',
      rounds: [
        {
          name: 'Online Assessment',
          description: 'Coding problems and work simulation',
          duration: '90 minutes'
        },
        {
          name: 'Phone Screen',
          description: 'Technical interview',
          duration: '60 minutes'
        },
        {
          name: 'Virtual Onsite',
          description: '5-7 rounds covering coding and leadership principles',
          duration: 'Full day'
        }
      ]
    },

    commonQuestions: [
      {
        question: 'Tell me about a time you failed',
        type: 'behavioral',
        difficulty: 'medium'
      },
      {
        question: 'Two Sum problem',
        type: 'coding',
        difficulty: 'easy'
      },
      {
        question: 'Design recommendation system',
        type: 'system design',
        difficulty: 'hard'
      }
    ]
  },

  {
    name: 'Microsoft',
    logo: 'M',
    description: 'Microsoft develops, manufactures, licenses, supports, and sells computer software, consumer electronics, and personal computers.',
    industry: 'Technology',
    founded: '1975',
    founders: ['Bill Gates', 'Paul Allen'],
    headquarters: 'Redmond, Washington',

    culture: {
      values: ['Innovation', 'Diversity & Inclusion', 'Growth Mindset'],
      workEnvironment: 'Collaborative culture with focus on growth mindset and work-life balance.',
      benefits: [
        'Competitive salary and bonuses',
        'Comprehensive healthcare',
        'Educational assistance'
      ]
    },

    interviewProcess: {
      difficulty: 'medium',
      rounds: [
        {
          name: 'Recruiter Screen',
          description: 'Initial phone call',
          duration: '30 minutes'
        },
        {
          name: 'Technical Screen',
          description: 'Coding interview',
          duration: '60 minutes'
        },
        {
          name: 'Onsite Loop',
          description: '4-5 rounds of technical and behavioral',
          duration: 'Half day'
        }
      ]
    },

    commonQuestions: [
      {
        question: 'Reverse a linked list',
        type: 'coding',
        difficulty: 'easy'
      },
      {
        question: 'Design a parking lot system',
        type: 'system design',
        difficulty: 'medium'
      },
      {
        question: 'Why Microsoft?',
        type: 'behavioral',
        difficulty: 'easy'
      }
    ]
  },

  {
    name: 'Meta',
    logo: 'F',
    description: 'Meta builds technologies that help people connect, find communities, and grow businesses.',
    industry: 'Social Media',
    founded: '2004',
    founders: ['Mark Zuckerberg'],
    headquarters: 'Menlo Park, California',

    culture: {
      values: ['Move Fast', 'Be Bold', 'Focus on Impact'],
      workEnvironment: 'Fast-paced, impact-driven culture with open office layout.',
      benefits: [
        'Highly competitive compensation',
        'Free meals and snacks',
        'Wellness programs'
      ]
    },

    interviewProcess: {
      difficulty: 'hard',
      rounds: [
        {
          name: 'Initial Screen',
          description: 'Recruiter call',
          duration: '30 minutes'
        },
        {
          name: 'Technical Phone Interview',
          description: 'Coding interviews',
          duration: '45 minutes each'
        },
        {
          name: 'Virtual Onsite',
          description: '2 coding + 1 system design + 1 behavioral',
          duration: 'Half day'
        }
      ]
    },

    commonQuestions: [
      {
        question: 'Design Instagram',
        type: 'system design',
        difficulty: 'hard'
      },
      {
        question: 'Clone a graph',
        type: 'coding',
        difficulty: 'medium'
      },
      {
        question: 'Valid palindrome',
        type: 'coding',
        difficulty: 'easy'
      }
    ]
  },

  {
    name: 'Apple',
    logo: '🍎',
    description: 'Apple designs and manufactures consumer electronics, software, and online services.',
    industry: 'Consumer Electronics',
    founded: '1976',
    founders: ['Steve Jobs', 'Steve Wozniak'],
    headquarters: 'Cupertino, California',

    culture: {
      values: ['Innovation', 'Excellence', 'Privacy'],
      workEnvironment: 'Secretive but collaborative culture focused on perfection.',
      benefits: [
        'Competitive compensation',
        'Employee product discounts',
        'Comprehensive health coverage'
      ]
    },

    interviewProcess: {
      difficulty: 'hard',
      rounds: [
        {
          name: 'Recruiter Call',
          description: 'Initial screening',
          duration: '30 minutes'
        },
        {
          name: 'Technical Phone Screen',
          description: 'Coding and problem solving',
          duration: '60 minutes'
        },
        {
          name: 'Onsite Interviews',
          description: '6-8 rounds covering technical and behavioral',
          duration: 'Full day'
        }
      ]
    },

    commonQuestions: [
      {
        question: 'How would you test an iPhone?',
        type: 'problem solving',
        difficulty: 'medium'
      },
      {
        question: 'Implement a queue using two stacks',
        type: 'coding',
        difficulty: 'easy'
      },
      {
        question: 'Why Apple?',
        type: 'behavioral',
        difficulty: 'easy'
      }
    ]
  }
]

// function to upload companies
async function uploadCompanies() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected!')

    console.log(`\nUploading ${companiesData.length} companies...`)

    for (const companyData of companiesData) {
      // check if company already exists
      const existing = await Company.findOne({ name: companyData.name })

      if (existing) {
        console.log(`✓ ${companyData.name} already exists, skipping...`)
        continue
      }

      // create new company
      await Company.create(companyData)
      console.log(`✓ Added ${companyData.name}`)
    }

    console.log('\n✅ Upload complete!')
    console.log(`Total companies in database: ${await Company.countDocuments()}`)

  } catch (error) {
    console.error('❌ Error uploading companies:', error.message)
  } finally {
    await mongoose.connection.close()
    console.log('\nDatabase connection closed')
    process.exit(0)
  }
}

uploadCompanies()