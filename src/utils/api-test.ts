export const testApiConnection = async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL || 'https://my-shop-backend-usaq.onrender.com',
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    
    console.log('✅ API Connection Test:', {
      status: response.status,
      ok: response.ok,
      url: response.url,
    });
    
    return {
      success: response.ok,
      status: response.status,
      url: response.url,
    };
  } catch (error) {
    console.error('❌ API Connection Test Failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};