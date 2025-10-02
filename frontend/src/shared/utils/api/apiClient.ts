import { apiClient, TokenManager } from "@/config/axiosConfig";
import { logger } from "@/shared/utils/common/logger";

// API 요청/응답 로깅 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    const headers = config.headers || {};
    logger.api(
      config.method || 'GET',
      config.url || '',
      undefined,
      {
        hasAuth: !!headers?.Authorization,
        hasData: !!config.data,
        dataSize: config.data ? JSON.stringify(config.data).length : 0
      }
    );
    return config;
  },
  (error) => {
    logger.error('API request failed', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    logger.api(
      response.config.method || 'GET',
      response.config.url || '',
      response.status,
      {
        success: response.data && typeof response.data === 'object' && 'success' in response.data ? response.data.success : undefined,
        hasData: !!response.data
      }
    );
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    logger.error('API response error', error, {
      status,
      url,
      data: error.response?.data
    });

    // 401 에러 시 토큰 상태 로깅
    if (status === 401) {
      const accessToken = TokenManager.getAccessToken();
      const isTokenValid = TokenManager.isTokenValid();

      logger.warn('Authentication failed', {
        hasAccessToken: !!accessToken,
        isTokenValid,
        url
      });
    }

    return Promise.reject(error);
  }
);