const axios = require('axios');

async function verifyRegistration() {
    try {
        const uniqueSuffix = Date.now();
        const payload = {
            company: {
                name: `Test Co ${uniqueSuffix}`,
                subdomain: `test${uniqueSuffix}`
            },
            user: {
                email: `admin${uniqueSuffix}@test.com`,
                password: 'password123',
                firstName: 'Test',
                lastName: 'User',
                phone: '1234567890'
            }
        };

        console.log('Sending registration request:', payload);
        const response = await axios.post('http://localhost:3001/api/auth/register', payload);

        if (response.status === 201 && response.data.success) {
            console.log('✅ Registration successful!');
            console.log('User created:', response.data.data.user);
            console.log('Company created:', response.data.data.company);
        } else {
            console.error('❌ Registration failed with unexpected status:', response.status);
            console.log(response.data);
        }
    } catch (error) {
        console.error('❌ Registration failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

verifyRegistration();
