import api from '@/lib/utils/api';

export default async function signupActions({ firstName, lastName, email, password }) {
    try {
        const response = await api.post('/register', {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: error.response?.data?.msg || 'Signup failed' };
    }
}