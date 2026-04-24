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

// Interview API
export const interviewAPI = {
    // Create new interview session
    create: async (formData) => {
        const response = await api.post('/interviews/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;  // ✅ Return full response
    },

    // Get interview by ID
    getById: async (interviewId) => {
        const response = await api.get(`/interviews/${interviewId}`);
        return response.data;  // ✅ Return full response
    },

    // Submit answer for a question
    submitAnswer: async (interviewId, questionId, answer, timeTaken) => {
        const response = await api.put(`/interviews/${interviewId}/answer`, {
            questionId,
            answer,
            timeTaken
        });
        return response.data;
    },

    // Submit complete interview
    submit: async (interviewId) => {
        const response = await api.post(`/interviews/${interviewId}/submit`);
        return response.data;
    },

    // Get user's interviews
    getUserInterviews: async (userId) => {
        const response = await api.get(`/interviews/user/${userId}`);
        return response.data;
    }
};

// aptitude test functions
export const aptitudeAPI = {
    generateQuestions: async (category, difficulty, count = 10, companyId) => {
        const response = await api.post('/aptitude/generate', {
            category,
            difficulty,
            count,
            companyId
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

export const dsaAPI = {
    getProblems: async (filters = {}) => {
        const user = authAPI.getCurrentUser();
        const userId = user?._id || user?.id;
        const params = new URLSearchParams({ ...filters, userId });
        const response = await api.get(`/dsa/problems?${params}`);  // ✅ Changed from /api/dsa/problems
        return response.data;
    },

    getProblem: async (id) => {
        const user = authAPI.getCurrentUser();
        const userId = user?._id || user?.id;
        const response = await api.get(`/dsa/problems/${id}?userId=${userId}`);  // ✅ Changed
        return response.data;
    },

    toggleComplete: async (id) => {
        const user = authAPI.getCurrentUser();
        const userId = user?._id || user?.id;
        const response = await api.post(`/dsa/problems/${id}/toggle-complete`, { userId });  // ✅ Changed
        return response.data;
    },

    toggleFavorite: async (id) => {
        const user = authAPI.getCurrentUser();
        const userId = user?._id || user?.id;
        const response = await api.post(`/dsa/problems/${id}/toggle-favorite`, { userId });  // ✅ Changed
        return response.data;
    },

    getStats: async () => {
        const user = authAPI.getCurrentUser();
        const userId = user?._id || user?.id;
        const response = await api.get(`/dsa/stats?userId=${userId}`);  // ✅ Changed
        return response.data;
    }
};


export default api