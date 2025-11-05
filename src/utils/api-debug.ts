export const debugApiCall = async () => {
  console.log('🔍 DEBUG: Testing API call...');
  
  try {
    // Test direct fetch
    const directResponse = await fetch('https://my-shop-backend-usaq.onrender.com/api/products');
    const directData = await directResponse.json();
    console.log('✅ Direct fetch response:', directData);
    
    // Test axios instance
    const axiosResponse = await import('@/requests/base.request').then(module => 
      module.axiosInstance.get('api/products')
    );
    console.log('🔧 Axios response after interceptor:', axiosResponse);
    
    // Test products request
    const productsResponse = await import('@/requests/products.request').then(module =>
      module.getProducts()
    );
    console.log('📦 Products request response:', productsResponse);
    
  } catch (error) {
    console.error('❌ API Debug error:', error);
  }
};