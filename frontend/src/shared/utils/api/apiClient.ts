import { apiClient } from "@/config/axiosConfig";

// 🔥 임시 디버깅용 - API 요청 전후 로깅
apiClient.interceptors.request.use(
  (config) => {
    const headers = config.headers || {};
    console.log('🚀 API 요청:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: {
        Authorization: headers?.Authorization ? 'Bearer ***' : undefined,
        'Content-Type': headers?.['Content-Type']
      },
      hasData: !!config.data,
      dataSize: config.data ? JSON.stringify(config.data).length : 0
    });
    return config;
  },
  (error) => {
    console.error('❌ API 요청 에러:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API 응답:', {
      status: response.status,
      url: response.config?.url,
      success: response.data && typeof response.data === 'object' && 'success' in response.data ? response.data.success : undefined,
      hasData: !!response.data
    });
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    
    console.error('❌ API 응답 에러:', {
      status,
      url,
      data: error.response?.data,
      message: error.message
    });
    
    // 🔥 401 에러 시 특별 로깅
    if (status === 401) {
      const accessToken = localStorage.getItem('behindy_access_token');
      const refreshToken = localStorage.getItem('behindy_refresh_token');
      
      console.error('🚨 인증 실패! 현재 토큰 상태:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        accessTokenPreview: accessToken ? accessToken.substring(0, 30) + '...' : 'none',
        refreshTokenPreview: refreshToken ? refreshToken.substring(0, 30) + '...' : 'none'
      });
    }
    
    return Promise.reject(error);
  }
);