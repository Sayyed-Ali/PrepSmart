import axios from 'axios'

// base url for api
const API_URL = import.meta.env.VITE_API_URL

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
    create: async (formData) => {
        const response = await api.post('/interviews/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    getById: async (interviewId) => {
        const response = await api.get(`/interviews/${interviewId}`);
        return response.data;
    },

    submitAnswer: async (interviewId, questionId, answer, timeTaken) => {
        const response = await api.put(`/interviews/${interviewId}/answer`, {
            questionId,
            answer,
            timeTaken
        });
        return response.data;
    },

    submit: async (interviewId) => {
        const response = await api.post(`/interviews/${interviewId}/submit`);
        return response.data;
    },

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

// DSA API
export const dsaAPI = {
    getProblems: async (filters = {}) => {
        const user = authAPI.getCurrentUser();
        const userId = user?._id || user?.id;
        const params = new URLSearchParams({ ...filters, userId });
        const response = await api.get(`/dsa/problems?${params}`);
        return response.data;
    },

    getProblem: async (id) => {
        const user = authAPI.getCurrentUser();
        const userId = user?._id || user?.id;
        const response = await api.get(`/dsa/problems/${id}?userId=${userId}`);
        return response.data;
    },

    toggleComplete: async (id) => {
        const user = authAPI.getCurrentUser();
        const userId = user?._id || user?.id;
        const response = await api.post(`/dsa/problems/${id}/toggle-complete`, { userId });
        return response.data;
    },

    toggleFavorite: async (id) => {
        const user = authAPI.getCurrentUser();
        const userId = user?._id || user?.id;
        const response = await api.post(`/dsa/problems/${id}/toggle-favorite`, { userId });
        return response.data;
    },

    getStats: async () => {
        const user = authAPI.getCurrentUser();
        const userId = user?._id || user?.id;
        const response = await api.get(`/dsa/stats?userId=${userId}`);
        return response.data;
    }
};

// Vacancy API
export const vacancyAPI = {
    getVacancies: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/vacancies?${params}`);
        return response.data;
    },

    getVacancy: async (id) => {
        const response = await api.get(`/vacancies/${id}`);
        return response.data;
    },

    createVacancy: async (data) => {
        const response = await api.post('/vacancies', data);
        return response.data;
    },

    updateVacancy: async (id, data) => {
        const response = await api.put(`/vacancies/${id}`, data);
        return response.data;
    },

    deleteVacancy: async (id) => {
        const response = await api.delete(`/vacancies/${id}`);
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/stats/vacancies');
        return response.data;
    }
};

// ✅ ADD THIS - Admin API
export const adminAPI = {
    // Company management
    addCompany: async (companyData) => {
        const response = await api.post('/admin/companies', companyData);
        return response.data;
    },

    updateCompany: async (companyId, companyData) => {
        const response = await api.put(`/admin/companies/${companyId}`, companyData);
        return response.data;
    },

    deleteCompany: async (companyId) => {
        const response = await api.delete(`/admin/companies/${companyId}`);
        return response.data;
    },

    // Aptitude question management
    addAptitudeQuestion: async (questionData) => {
        const response = await api.post('/admin/aptitude/questions', questionData);
        return response.data;
    },

    getAptitudeQuestions: async () => {
        const response = await api.get('/admin/aptitude/questions');
        return response.data;
    },

    deleteAptitudeQuestion: async (questionId) => {
        const response = await api.delete(`/admin/aptitude/questions/${questionId}`);
        return response.data;
    },

    // DSA problem management
    createDSAProblem: async (data) => {
        const response = await api.post('/admin/dsa-problems', data);
        return response.data;
    },

    getAllDSAProblems: async () => {
        const response = await api.get('/admin/dsa-problems');
        return response.data;
    },

    deleteDSAProblem: async (id) => {
        const response = await api.delete(`/admin/dsa-problems/${id}`);
        return response.data;
    },

    // Stats
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    }
};

export const practiceAPI = {
    // Log practice activity (call this when user completes DSA/Interview/Aptitude)
    logActivity: async (type, count = 1) => {
        const user = authAPI.getCurrentUser();
        const userId = user?._id || user?.id;
        const response = await api.post('/practice/log', { userId, type, count });
        return response.data;
    },

    // Get practice calendar for user
    getCalendar: async (days = 90) => {
        const user = authAPI.getCurrentUser();
        const userId = user?._id || user?.id;
        const response = await api.get(`/practice/calendar/${userId}?days=${days}`);
        return response.data;
    },

    // Get practice stats (streaks, totals)
    getStats: async () => {
        const user = authAPI.getCurrentUser();
        const userId = user?._id || user?.id;
        const response = await api.get(`/practice/stats/${userId}`);
        return response.data;
    }
};

export default api