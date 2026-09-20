import { analyzeEmailContent } from './analyzerEngine';

const STORAGE_KEYS = {
  BACKEND_MODE: 'phishshield_backend_mode',
  BACKEND_URL: 'phishshield_backend_url',
  ACTIVE_MODEL: 'phishshield_active_model',
};

/**
 * Get current backend configuration - defaults to live custom FastAPI backend
 */
export function getBackendConfig() {
  const mode = localStorage.getItem(STORAGE_KEYS.BACKEND_MODE) || 'custom'; // 'custom' | 'builtin'
  let url = localStorage.getItem(STORAGE_KEYS.BACKEND_URL);
  if (!url || url === 'http://localhost:8001/api/analyze' || url === 'http://localhost:8000/api/analyze') {
    url = '/api/analyze';
  }
  const activeModel = localStorage.getItem(STORAGE_KEYS.ACTIVE_MODEL) || 'auto'; // 'auto' | 'rf' | 'bilstm' | 'bert'
  return { mode, url, activeModel };
}

/**
 * Save backend configuration
 */
export function saveBackendConfig(mode, url, activeModel) {
  if (mode !== undefined) localStorage.setItem(STORAGE_KEYS.BACKEND_MODE, mode);
  if (url !== undefined) localStorage.setItem(STORAGE_KEYS.BACKEND_URL, url);
  if (activeModel !== undefined) localStorage.setItem(STORAGE_KEYS.ACTIVE_MODEL, activeModel);
}

/**
 * Test custom API connection
 */
export async function testBackendConnection(url) {
  try {
    const baseUrl = url.replace(/\/analyze$/, '');
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3500)
    });
    if (response.ok) {
      const data = await response.json();
      return { success: true, message: 'Connected to FastAPI Microservice successfully!', details: `Models loaded: ${Object.keys(data.models_status || {}).join(', ')}`, data };
    }
    return { success: false, message: `Server responded with status: ${response.status}` };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to connect to endpoint' };
  }
}

/**
 * Fetch comparative benchmark results from the backend
 */
export async function fetchBenchmarkData() {
  const { url } = getBackendConfig();
  const baseUrl = url.replace(/\/analyze$/, '');
  try {
    const response = await fetch(`${baseUrl}/benchmark`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(4000)
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn("Backend benchmark fetch failed, using cached comparison stats:", e);
  }
  return null;
}

/**
 * Main analyze execution function
 */
export async function runEmailAnalysis(emailData, modelOverride = null) {
  const { mode, url, activeModel } = getBackendConfig();
  const targetModel = modelOverride || activeModel || 'auto';

  if (mode === 'custom' && url) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          senderName: emailData.senderName,
          sender_name: emailData.senderName,
          senderEmail: emailData.senderEmail,
          sender_email: emailData.senderEmail,
          subject: emailData.subject,
          body: emailData.body,
          urls: emailData.urls || [],
          model: targetModel
        }),
        signal: AbortSignal.timeout(35000)
      });

      if (!response.ok) {
        throw new Error(`Backend returned HTTP ${response.status}`);
      }

      const backendResult = await response.json();
      const baseline = analyzeEmailContent(emailData);
      
      return {
        ...baseline,
        ...backendResult,
        score: backendResult.score !== undefined ? backendResult.score : baseline.score,
        verdict: backendResult.verdict || baseline.verdict,
        verdictTitle: backendResult.verdictTitle || baseline.verdictTitle,
        verdictBadge: backendResult.verdictBadge || baseline.verdictBadge,
        confidence: backendResult.confidence || baseline.confidence,
        latency_ms: backendResult.latency_ms !== undefined ? backendResult.latency_ms : 0.5,
        engineSource: backendResult.model_used || `Model: ${targetModel.toUpperCase()}`,
        modelLatency: backendResult.latency_ms,
        modelBadge: backendResult.model_badge
      };
    } catch (err) {
      console.warn('Custom backend request failed, using client-side engine fallback:', err);
      const result = analyzeEmailContent(emailData);
      return {
        ...result,
        engineSource: 'Built-in Engine (FastAPI Unreachable)',
        warningNotice: `Backend unreachable at ${url} (${err.message || 'connection failed'}). Used baseline NLP heuristics.`
      };
    }
  }

  // Built-in Engine
  await new Promise(resolve => setTimeout(resolve, 400));
  const result = analyzeEmailContent(emailData);
  return {
    ...result,
    engineSource: 'Built-in Threat Engine'
  };
}
