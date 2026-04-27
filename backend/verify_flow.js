const axios = require('axios');

async function testFlow() {
  try {
    console.log('--- Testing Admin Flow ---');
    
    // 1. Login
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'pranay.cablo@cablo.ai',
      password: '72527252@Raja'
    });
    const token = loginRes.data.token;
    console.log('✅ Login Successful');

    // 2. Fetch Users
    const usersRes = await axios.get('http://localhost:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Fetched ${usersRes.data.users.length} users`);

    // 3. Create Service Tier
    const tierRes = await axios.post('http://localhost:5000/api/admin/service-tiers', {
      slab: 'ride',
      categoryName: 'Cablo Test Tier',
      vehicleType: 'cab',
      fareLogic: { baseFare: 100, perKmRate: 15, minimumFare: 150 }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Created Service Tier');

    // 4. Update Config
    const configRes = await axios.post('http://localhost:5000/api/admin/config', {
      key: 'PLATFORM_FEE_PERCENT',
      value: '12',
      category: 'platform',
      description: 'Test platform fee'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Updated Global Config');

    console.log('--- ALL FLOWS VERIFIED ---');
  } catch (err) {
    console.error('❌ Flow Test Failed:', err.response?.data || err.message);
  }
}

testFlow();
