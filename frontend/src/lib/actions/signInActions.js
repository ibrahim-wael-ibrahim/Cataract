import api from '@/lib/utils/api';
export default async function signInActions({ email, password }) {
    try {
        const response = await api.post('/login', { email, password });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: error.response?.data?.msg || 'Login failed' };
    }
}
