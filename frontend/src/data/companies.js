// hardcoded company data - will move to backend later
export const companiesData = [
    {
        id: 'google',
        name: 'Google',
        logo: 'G',
        tagline: 'Don\'t be evil',
        description: 'Google is a multinational technology company focusing on search engine technology, online advertising, cloud computing, computer software, and artificial intelligence.',
        industry: 'Technology',
        founded: '1998',
        founders: ['Larry Page', 'Sergey Brin'],
        headquarters: 'Mountain View, California',
        employees: '150,000+',

        culture: {
            values: ['Innovation', 'User Focus', 'Openness', 'Excellence'],
            workEnvironment: 'Google offers a collaborative environment with open workspaces, generous perks, and a focus on employee wellbeing. Known for 20% time policy and innovative projects.',
            benefits: [
                'Competitive salary and equity',
                'Free gourmet meals',
                'On-site wellness and fitness centers',
                'Generous parental leave',
                'Learning and development budget'
            ]
        },

        interviewProcess: {
            difficulty: 'Hard',
            rounds: [
                {
                    name: 'Phone Screen',
                    description: 'Initial technical screening with a recruiter, followed by a coding interview',
                    duration: '45-60 minutes'
                },
                {
                    name: 'Technical Interviews',
                    description: '4-5 rounds of coding, system design, and algorithms',
                    duration: '45 minutes each'
                },
                {
                    name: 'Behavioral Interview',
                    description: 'Googleyness and leadership assessment',
                    duration: '30-45 minutes'
                },
                {
                    name: 'Team Matching',
                    description: 'After passing interviews, match with teams',
                    duration: 'Varies'
                }
            ]
        },

        commonQuestions: [
            {
                question: 'Design a URL shortener like bit.ly',
                type: 'System Design',
                difficulty: 'Medium'
            },
            {
                question: 'Implement LRU Cache',
                type: 'Coding',
                difficulty: 'Medium'
            },
            {
                question: 'Tell me about a time you disagreed with your manager',
                type: 'Behavioral',
                difficulty: 'Medium'
            },
            {
                question: 'Find median in a data stream',
                type: 'Coding',
                difficulty: 'Hard'
            },
            {
                question: 'Why Google?',
                type: 'Behavioral',
                difficulty: 'Easy'
            }
        ],

        tips: [
            'Focus heavily on data structures and algorithms',
            'Practice system design thoroughly',
            'Study Google products and think about improvements',
            'Demonstrate leadership and initiative in behavioral rounds',
            'Be prepared to code on a whiteboard or Google Docs'
        ]
    },

    {
        id: 'amazon',
        name: 'Amazon',
        logo: 'A',
        tagline: 'Work hard. Have fun. Make history.',
        description: 'Amazon is a technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence. Known for AWS and customer obsession.',
        industry: 'E-commerce & Cloud',
        founded: '1994',
        founders: ['Jeff Bezos'],
        headquarters: 'Seattle, Washington',
        employees: '1,500,000+',

        culture: {
            values: ['Customer Obsession', 'Ownership', 'Invent and Simplify', 'Learn and Be Curious'],
            workEnvironment: 'Fast-paced, data-driven culture with high ownership. Amazon follows 14 leadership principles that guide decision-making and interviews.',
            benefits: [
                'Competitive compensation',
                'Comprehensive health benefits',
                'Employee stock purchase plan',
                'Career development opportunities',
                'Relocation assistance'
            ]
        },

        interviewProcess: {
            difficulty: 'Hard',
            rounds: [
                {
                    name: 'Online Assessment',
                    description: 'Coding problems and work simulation',
                    duration: '90 minutes'
                },
                {
                    name: 'Phone Screen',
                    description: 'Technical interview focusing on data structures',
                    duration: '60 minutes'
                },
                {
                    name: 'Virtual Onsite (Loop)',
                    description: '5-7 rounds covering coding, system design, and leadership principles',
                    duration: 'Full day'
                },
                {
                    name: 'Bar Raiser Round',
                    description: 'Senior interviewer ensures high hiring standards',
                    duration: '60 minutes'
                }
            ]
        },

        commonQuestions: [
            {
                question: 'Tell me about a time you failed',
                type: 'Behavioral (LP)',
                difficulty: 'Medium'
            },
            {
                question: 'Design Amazon\'s recommendation system',
                type: 'System Design',
                difficulty: 'Hard'
            },
            {
                question: 'Two Sum problem',
                type: 'Coding',
                difficulty: 'Easy'
            },
            {
                question: 'Describe a time you had to make a decision with incomplete information',
                type: 'Behavioral (LP)',
                difficulty: 'Medium'
            },
            {
                question: 'Merge K sorted lists',
                type: 'Coding',
                difficulty: 'Hard'
            }
        ],

        tips: [
            'Study all 14 Leadership Principles thoroughly',
            'Prepare STAR format answers for behavioral questions',
            'Practice coding problems on LeetCode (Amazon tag)',
            'Be ready to discuss trade-offs in system design',
            'Show customer obsession in your answers'
        ]
    },

    {
        id: 'microsoft',
        name: 'Microsoft',
        logo: 'M',
        tagline: 'Empower every person and organization',
        description: 'Microsoft develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.',
        industry: 'Technology',
        founded: '1975',
        founders: ['Bill Gates', 'Paul Allen'],
        headquarters: 'Redmond, Washington',
        employees: '220,000+',

        culture: {
            values: ['Innovation', 'Diversity & Inclusion', 'Growth Mindset', 'Customer Success'],
            workEnvironment: 'Collaborative culture with focus on growth mindset. Microsoft emphasizes work-life balance and continuous learning.',
            benefits: [
                'Competitive salary and bonuses',
                'Comprehensive healthcare',
                'Generous vacation time',
                'Educational assistance',
                'Employee discounts'
            ]
        },

        interviewProcess: {
            difficulty: 'Medium-Hard',
            rounds: [
                {
                    name: 'Recruiter Screen',
                    description: 'Initial phone call about background and interest',
                    duration: '30 minutes'
                },
                {
                    name: 'Technical Screen',
                    description: 'Coding interview over phone',
                    duration: '60 minutes'
                },
                {
                    name: 'Onsite Loop',
                    description: '4-5 rounds of technical and behavioral interviews',
                    duration: 'Half day'
                },
                {
                    name: 'As Appropriate (AA)',
                    description: 'Final round with senior interviewer - good sign if you get this',
                    duration: '60 minutes'
                }
            ]
        },

        commonQuestions: [
            {
                question: 'Reverse a linked list',
                type: 'Coding',
                difficulty: 'Easy'
            },
            {
                question: 'Design a parking lot system',
                type: 'System Design',
                difficulty: 'Medium'
            },
            {
                question: 'Tell me about a time you learned from failure',
                type: 'Behavioral',
                difficulty: 'Medium'
            },
            {
                question: 'Binary tree level order traversal',
                type: 'Coding',
                difficulty: 'Medium'
            },
            {
                question: 'Why Microsoft?',
                type: 'Behavioral',
                difficulty: 'Easy'
            }
        ],

        tips: [
            'Demonstrate growth mindset in your answers',
            'Be familiar with Microsoft products and services',
            'Practice object-oriented design questions',
            'Show collaboration and teamwork skills',
            'Getting AA round is a very positive sign'
        ]
    },

    {
        id: 'meta',
        name: 'Meta (Facebook)',
        logo: 'F',
        tagline: 'Move fast and break things',
        description: 'Meta builds technologies that help people connect, find communities, and grow businesses. Known for Facebook, Instagram, WhatsApp, and VR/AR innovations.',
        industry: 'Social Media & Technology',
        founded: '2004',
        founders: ['Mark Zuckerberg', 'Eduardo Saverin', 'Andrew McCollum', 'Dustin Moskovitz', 'Chris Hughes'],
        headquarters: 'Menlo Park, California',
        employees: '86,000+',

        culture: {
            values: ['Move Fast', 'Be Bold', 'Focus on Impact', 'Be Open', 'Build Social Value'],
            workEnvironment: 'Fast-paced, impact-driven culture. Meta encourages bold ideas and rapid iteration. Open office layout promotes collaboration.',
            benefits: [
                'Highly competitive compensation',
                'Free meals and snacks',
                'Wellness programs',
                'Generous parental leave',
                '$5,000 baby bonus'
            ]
        },

        interviewProcess: {
            difficulty: 'Hard',
            rounds: [
                {
                    name: 'Initial Screen',
                    description: 'Recruiter call to discuss background',
                    duration: '30 minutes'
                },
                {
                    name: 'Technical Phone Interview',
                    description: '1-2 coding interviews',
                    duration: '45 minutes each'
                },
                {
                    name: 'Virtual Onsite',
                    description: '2 coding + 1 system design + 1 behavioral',
                    duration: 'Half day'
                },
                {
                    name: 'Hiring Committee',
                    description: 'Review of interview feedback',
                    duration: 'N/A'
                }
            ]
        },

        commonQuestions: [
            {
                question: 'Design Instagram',
                type: 'System Design',
                difficulty: 'Hard'
            },
            {
                question: 'Clone a graph',
                type: 'Coding',
                difficulty: 'Medium'
            },
            {
                question: 'Tell me about your most challenging project',
                type: 'Behavioral',
                difficulty: 'Medium'
            },
            {
                question: 'Valid palindrome',
                type: 'Coding',
                difficulty: 'Easy'
            }
        ],

        tips: [
            'Practice system design for social networks',
            'Be prepared to discuss scalability',
            'Show how you move fast and iterate',
            'Know Meta products well',
            'Demonstrate impact in past projects'
        ]
    },

    {
        id: 'apple',
        name: 'Apple',
        logo: '',
        tagline: 'Think Different',
        description: 'Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories. Known for innovation and design excellence.',
        industry: 'Consumer Electronics',
        founded: '1976',
        founders: ['Steve Jobs', 'Steve Wozniak', 'Ronald Wayne'],
        headquarters: 'Cupertino, California',
        employees: '164,000+',

        culture: {
            values: ['Innovation', 'Excellence', 'Privacy', 'Environmental Responsibility'],
            workEnvironment: 'Secretive but collaborative culture focused on perfection. Apple values design thinking and attention to detail.',
            benefits: [
                'Competitive compensation',
                'Employee product discounts',
                'Comprehensive health coverage',
                'Wellness programs',
                'Education reimbursement'
            ]
        },

        interviewProcess: {
            difficulty: 'Hard',
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
                question: 'Describe how you would test an iPhone',
                type: 'Problem Solving',
                difficulty: 'Medium'
            },
            {
                question: 'Implement a queue using two stacks',
                type: 'Coding',
                difficulty: 'Easy'
            },
            {
                question: 'Why Apple?',
                type: 'Behavioral',
                difficulty: 'Easy'
            }
        ],

        tips: [
            'Know Apple products inside out',
            'Show passion for design and user experience',
            'Practice low-level systems questions',
            'Demonstrate attention to detail',
            'Be prepared for confidentiality questions'
        ]
    }
]

// helper function to get company by id
export const getCompanyById = (id) => {
    return companiesData.find(company => company.id === id)
}

// helper to get all company names
export const getAllCompanyNames = () => {
    return companiesData.map(c => c.name)
}