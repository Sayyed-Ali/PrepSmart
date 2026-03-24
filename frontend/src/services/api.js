import axios from 'axios'

// base url for api
const API_URL = 'http://localhost:5001/api'

// create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// add token to requests if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// auth functions
export const authAPI = {
    signup: async (userData) => {
        const response = await api.post('/auth/signup', userData)
        if (response.data.token) {
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
        }
        return response.data
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials)
        if (response.data.token) {
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
        }
        return response.data
    },

    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user')
        return userStr ? JSON.parse(userStr) : null
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token')
    }
}

// user functions
export const userAPI = {
    getProfile: async (userId) => {
        const response = await api.get(`/users/${userId}`)
        return response.data
    },

    updateProfile: async (userId, userData) => {
        const response = await api.put(`/users/${userId}`, userData)
        return response.data
    }
}

// interview functions
export const interviewAPI = {
    create: async (interviewData) => {
        const response = await api.post('/interviews', interviewData)
        return response.data
    },

    getUserInterviews: async (userId) => {
        const response = await api.get(`/interviews/user/${userId}`)
        return response.data
    },

    getInterview: async (interviewId) => {
        const response = await api.get(`/interviews/${interviewId}`)
        return response.data
    },

    updateInterview: async (interviewId, updateData) => {
        const response = await api.put(`/interviews/${interviewId}`, updateData)
        return response.data
    }
}

// aptitude test functions
export const aptitudeAPI = {
    generateQuestions: async (category, difficulty, count = 10) => {
        const response = await api.post('/aptitude/generate', {
            category,
            difficulty,
            count
        })
        return response.data
    },

    submitTest: async (testData) => {
        const response = await api.post('/aptitude/submit', testData)
        return response.data
    },

    getUserResults: async (userId) => {
        const response = await api.get(`/aptitude/results/${userId}`)
        return response.data
    },

    getTestResult: async (testId) => {
        const response = await api.get(`/aptitude/result/${testId}`)
        return response.data
    }
}

export default api