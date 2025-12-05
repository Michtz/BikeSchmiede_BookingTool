(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/sdk/node_modules/is-retry-allowed/index.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const denyList = new Set([
    'ENOTFOUND',
    'ENETUNREACH',
    // SSL errors from https://github.com/nodejs/node/blob/fc8e3e2cdc521978351de257030db0076d79e0ab/src/crypto/crypto_common.cc#L301-L328
    'UNABLE_TO_GET_ISSUER_CERT',
    'UNABLE_TO_GET_CRL',
    'UNABLE_TO_DECRYPT_CERT_SIGNATURE',
    'UNABLE_TO_DECRYPT_CRL_SIGNATURE',
    'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY',
    'CERT_SIGNATURE_FAILURE',
    'CRL_SIGNATURE_FAILURE',
    'CERT_NOT_YET_VALID',
    'CERT_HAS_EXPIRED',
    'CRL_NOT_YET_VALID',
    'CRL_HAS_EXPIRED',
    'ERROR_IN_CERT_NOT_BEFORE_FIELD',
    'ERROR_IN_CERT_NOT_AFTER_FIELD',
    'ERROR_IN_CRL_LAST_UPDATE_FIELD',
    'ERROR_IN_CRL_NEXT_UPDATE_FIELD',
    'OUT_OF_MEM',
    'DEPTH_ZERO_SELF_SIGNED_CERT',
    'SELF_SIGNED_CERT_IN_CHAIN',
    'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
    'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
    'CERT_CHAIN_TOO_LONG',
    'CERT_REVOKED',
    'INVALID_CA',
    'PATH_LENGTH_EXCEEDED',
    'INVALID_PURPOSE',
    'CERT_UNTRUSTED',
    'CERT_REJECTED',
    'HOSTNAME_MISMATCH'
]);
// TODO: Use `error?.code` when targeting Node.js 14
module.exports = (error)=>!denyList.has(error && error.code);
}),
"[project]/sdk/node_modules/axios-retry/dist/esm/index.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_OPTIONS",
    ()=>DEFAULT_OPTIONS,
    "default",
    ()=>__TURBOPACK__default__export__,
    "exponentialDelay",
    ()=>exponentialDelay,
    "isIdempotentRequestError",
    ()=>isIdempotentRequestError,
    "isNetworkError",
    ()=>isNetworkError,
    "isNetworkOrIdempotentRequestError",
    ()=>isNetworkOrIdempotentRequestError,
    "isRetryableError",
    ()=>isRetryableError,
    "isSafeRequestError",
    ()=>isSafeRequestError,
    "linearDelay",
    ()=>linearDelay,
    "namespace",
    ()=>namespace,
    "retryAfter",
    ()=>retryAfter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$node_modules$2f$is$2d$retry$2d$allowed$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/node_modules/is-retry-allowed/index.js [client] (ecmascript)");
;
const namespace = 'axios-retry';
function isNetworkError(error) {
    const CODE_EXCLUDE_LIST = [
        'ERR_CANCELED',
        'ECONNABORTED'
    ];
    if (error.response) {
        return false;
    }
    if (!error.code) {
        return false;
    }
    // Prevents retrying timed out & cancelled requests
    if (CODE_EXCLUDE_LIST.includes(error.code)) {
        return false;
    }
    // Prevents retrying unsafe errors
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$node_modules$2f$is$2d$retry$2d$allowed$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(error);
}
const SAFE_HTTP_METHODS = [
    'get',
    'head',
    'options'
];
const IDEMPOTENT_HTTP_METHODS = SAFE_HTTP_METHODS.concat([
    'put',
    'delete'
]);
function isRetryableError(error) {
    return error.code !== 'ECONNABORTED' && (!error.response || error.response.status === 429 || error.response.status >= 500 && error.response.status <= 599);
}
function isSafeRequestError(error) {
    if (!error.config?.method) {
        // Cannot determine if the request can be retried
        return false;
    }
    return isRetryableError(error) && SAFE_HTTP_METHODS.indexOf(error.config.method) !== -1;
}
function isIdempotentRequestError(error) {
    if (!error.config?.method) {
        // Cannot determine if the request can be retried
        return false;
    }
    return isRetryableError(error) && IDEMPOTENT_HTTP_METHODS.indexOf(error.config.method) !== -1;
}
function isNetworkOrIdempotentRequestError(error) {
    return isNetworkError(error) || isIdempotentRequestError(error);
}
function retryAfter(error = undefined) {
    const retryAfterHeader = error?.response?.headers['retry-after'];
    if (!retryAfterHeader) {
        return 0;
    }
    // if the retry after header is a number, convert it to milliseconds
    let retryAfterMs = (Number(retryAfterHeader) || 0) * 1000;
    // If the retry after header is a date, get the number of milliseconds until that date
    if (retryAfterMs === 0) {
        retryAfterMs = (new Date(retryAfterHeader).valueOf() || 0) - Date.now();
    }
    return Math.max(0, retryAfterMs);
}
function noDelay(_retryNumber = 0, error = undefined) {
    return Math.max(0, retryAfter(error));
}
function exponentialDelay(retryNumber = 0, error = undefined, delayFactor = 100) {
    const calculatedDelay = 2 ** retryNumber * delayFactor;
    const delay = Math.max(calculatedDelay, retryAfter(error));
    const randomSum = delay * 0.2 * Math.random(); // 0-20% of the delay
    return delay + randomSum;
}
function linearDelay(delayFactor = 100) {
    return (retryNumber = 0, error = undefined)=>{
        const delay = retryNumber * delayFactor;
        return Math.max(delay, retryAfter(error));
    };
}
const DEFAULT_OPTIONS = {
    retries: 3,
    retryCondition: isNetworkOrIdempotentRequestError,
    retryDelay: noDelay,
    shouldResetTimeout: false,
    onRetry: ()=>{},
    onMaxRetryTimesExceeded: ()=>{},
    validateResponse: null
};
function getRequestOptions(config, defaultOptions) {
    return {
        ...DEFAULT_OPTIONS,
        ...defaultOptions,
        ...config[namespace]
    };
}
function setCurrentState(config, defaultOptions, resetLastRequestTime = false) {
    const currentState = getRequestOptions(config, defaultOptions || {});
    currentState.retryCount = currentState.retryCount || 0;
    if (!currentState.lastRequestTime || resetLastRequestTime) {
        currentState.lastRequestTime = Date.now();
    }
    config[namespace] = currentState;
    return currentState;
}
function fixConfig(axiosInstance, config) {
    // @ts-ignore
    if (axiosInstance.defaults.agent === config.agent) {
        // @ts-ignore
        delete config.agent;
    }
    if (axiosInstance.defaults.httpAgent === config.httpAgent) {
        delete config.httpAgent;
    }
    if (axiosInstance.defaults.httpsAgent === config.httpsAgent) {
        delete config.httpsAgent;
    }
}
async function shouldRetry(currentState, error) {
    const { retries, retryCondition } = currentState;
    const shouldRetryOrPromise = (currentState.retryCount || 0) < retries && retryCondition(error);
    // This could be a promise
    if (typeof shouldRetryOrPromise === 'object') {
        try {
            const shouldRetryPromiseResult = await shouldRetryOrPromise;
            // keep return true unless shouldRetryPromiseResult return false for compatibility
            return shouldRetryPromiseResult !== false;
        } catch (_err) {
            return false;
        }
    }
    return shouldRetryOrPromise;
}
async function handleRetry(axiosInstance, currentState, error, config) {
    currentState.retryCount += 1;
    const { retryDelay, shouldResetTimeout, onRetry } = currentState;
    const delay = retryDelay(currentState.retryCount, error);
    // Axios fails merging this configuration to the default configuration because it has an issue
    // with circular structures: https://github.com/mzabriskie/axios/issues/370
    fixConfig(axiosInstance, config);
    if (!shouldResetTimeout && config.timeout && currentState.lastRequestTime) {
        const lastRequestDuration = Date.now() - currentState.lastRequestTime;
        const timeout = config.timeout - lastRequestDuration - delay;
        if (timeout <= 0) {
            return Promise.reject(error);
        }
        config.timeout = timeout;
    }
    config.transformRequest = [
        (data)=>data
    ];
    await onRetry(currentState.retryCount, error, config);
    if (config.signal?.aborted) {
        return Promise.resolve(axiosInstance(config));
    }
    return new Promise((resolve)=>{
        const abortListener = ()=>{
            clearTimeout(timeout);
            resolve(axiosInstance(config));
        };
        const timeout = setTimeout(()=>{
            resolve(axiosInstance(config));
            if (config.signal?.removeEventListener) {
                config.signal.removeEventListener('abort', abortListener);
            }
        }, delay);
        if (config.signal?.addEventListener) {
            config.signal.addEventListener('abort', abortListener, {
                once: true
            });
        }
    });
}
async function handleMaxRetryTimesExceeded(currentState, error) {
    if (currentState.retryCount >= currentState.retries) await currentState.onMaxRetryTimesExceeded(error, currentState.retryCount);
}
const axiosRetry = (axiosInstance, defaultOptions)=>{
    const requestInterceptorId = axiosInstance.interceptors.request.use({
        "axiosRetry.use[requestInterceptorId]": (config)=>{
            setCurrentState(config, defaultOptions, true);
            if (config[namespace]?.validateResponse) {
                // by setting this, all HTTP responses will be go through the error interceptor first
                config.validateStatus = ({
                    "axiosRetry.use[requestInterceptorId]": ()=>false
                })["axiosRetry.use[requestInterceptorId]"];
            }
            return config;
        }
    }["axiosRetry.use[requestInterceptorId]"]);
    const responseInterceptorId = axiosInstance.interceptors.response.use(null, {
        "axiosRetry.use[responseInterceptorId]": async (error)=>{
            const { config } = error;
            // If we have no information to retry the request
            if (!config) {
                return Promise.reject(error);
            }
            const currentState = setCurrentState(config, defaultOptions);
            if (error.response && currentState.validateResponse?.(error.response)) {
                // no issue with response
                return error.response;
            }
            if (await shouldRetry(currentState, error)) {
                return handleRetry(axiosInstance, currentState, error, config);
            }
            await handleMaxRetryTimesExceeded(currentState, error);
            return Promise.reject(error);
        }
    }["axiosRetry.use[responseInterceptorId]"]);
    return {
        requestInterceptorId,
        responseInterceptorId
    };
};
// Compatibility with CommonJS
axiosRetry.isNetworkError = isNetworkError;
axiosRetry.isSafeRequestError = isSafeRequestError;
axiosRetry.isIdempotentRequestError = isIdempotentRequestError;
axiosRetry.isNetworkOrIdempotentRequestError = isNetworkOrIdempotentRequestError;
axiosRetry.exponentialDelay = exponentialDelay;
axiosRetry.linearDelay = linearDelay;
axiosRetry.isRetryableError = isRetryableError;
const __TURBOPACK__default__export__ = axiosRetry;
}),
]);

//# sourceMappingURL=d8c98_e1064731._.js.map