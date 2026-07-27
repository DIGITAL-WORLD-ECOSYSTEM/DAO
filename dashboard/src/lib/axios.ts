import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CryptoCore } from 'src/utils/crypto';

import { CONFIG } from 'src/global-config';

// Must match JWT_STORAGE_KEY in src/auth/context/jwt/constant.ts
const JWT_STORAGE_KEY = 'dao_access_token';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  // 1. Zero-Trust Signature Header
  const identityKey = localStorage.getItem('identityKey');
  const did = localStorage.getItem('identityDID');

  if (identityKey && did) {
    const timestamp = Date.now().toString();
    const body = config.data ? JSON.stringify(config.data) : '';
    const msg = CryptoCore.encode(timestamp + body);

    // Converte a chave (supondo Hex)
    const privateKeyBytes = Uint8Array.from(
      identityKey.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );

    const signature = await CryptoCore.sign(privateKeyBytes, msg);

    config.headers['X-Identity-Signature'] = CryptoCore.toBase64(signature);
    config.headers['X-Identity-DID'] = did;
    config.headers['X-Identity-Timestamp'] = timestamp;
  }

  // 2. JWT Fallback
  const token = localStorage.getItem('dao_access_token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Global refresh state — prevents parallel /refresh calls cascading into 429
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Never retry the refresh, logout, or login endpoints themselves
    const isAuthEndpoint =
      originalRequest?.url?.includes('/refresh') ||
      originalRequest?.url?.includes('/logout') ||
      originalRequest?.url?.includes('/login');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      // If already refreshing, queue this request until refresh resolves
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axiosInstance.post('/api/core/identity/refresh');
        const { accessToken } = res.data;

        if (accessToken) {
          localStorage.setItem(JWT_STORAGE_KEY, accessToken);
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          return axiosInstance(originalRequest);
        }

        // Refresh returned 200 but no token — treat as failure
        throw new Error('No access token in refresh response');
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear session and notify the app to redirect to login
        localStorage.removeItem(JWT_STORAGE_KEY);
        delete axiosInstance.defaults.headers.common.Authorization;
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message = error?.response?.data?.message || error?.message || 'Something went wrong!';
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async <T = unknown>(
  args: string | [string, AxiosRequestConfig]
): Promise<T> => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, {}];

    const res = await axiosInstance.get<T>(url, config);

    return res.data;
  } catch (error) {
    console.error('Fetcher failed:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  calendar: '/api/calendar',
  auth: {
    me: '/api/core/identity/me',
    changePassword: '/api/core/identity/change-password',
    signIn: '/api/core/identity/local/login',
    signUp: '/api/core/identity/local/register',
    web3Nonce: '/api/core/identity/web3/nonce',
    web3Verify: '/api/core/identity/web3/verify',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/posts',
    details: '/api/posts', // O slug será passado via param
    latest: '/api/posts', // Podemos usar o list com filtro ou limite
    search: '/api/posts/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  platform: {
    email: {
      campaign: '/api/platform/email/campaign',
      accounts: '/api/platform/email/accounts',
    },
    treasury: {
      root: '/api/platform/treasury',
      analytics: '/api/platform/treasury/analytics',
    },
    identity: {
      list: '/api/platform/identity/list',
      base: '/api/platform/identity',
      bulkDelete: '/api/platform/identity/bulk-delete',
    },
  },
} as const;
