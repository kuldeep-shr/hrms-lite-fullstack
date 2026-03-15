import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
const apiOrigin = apiBaseUrl.replace(/\/api\/v1\/?$/, "");

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 90000,
  headers: {
    "Content-Type": "application/json",
  },
});

const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const fetchWithTimeout = async (url, timeoutMs) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      cache: "no-store",
      mode: "cors",
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export async function wakeBackend({ onProgress } = {}) {
  const attempts = [
    {
      label: "Waking the free Render backend. This can take around a minute after inactivity.",
      timeoutMs: 70000,
    },
    {
      label: "Backend is almost ready. Running a quick follow-up health check.",
      timeoutMs: 10000,
    },
  ];

  for (let index = 0; index < attempts.length; index += 1) {
    const attempt = attempts[index];
    onProgress?.(attempt.label);

    try {
      const response = await fetchWithTimeout(`${apiOrigin}/health?wake=${Date.now()}`, attempt.timeoutMs);
      if (response.ok) {
        return true;
      }
    } catch {
      // Render free instances can time out while waking; the next attempt often succeeds.
    }

    if (index < attempts.length - 1) {
      await sleep(1500);
    }
  }

  return false;
}

export async function keepBackendWarm() {
  try {
    const response = await fetchWithTimeout(`${apiOrigin}/health?keepAlive=${Date.now()}`, 10000);
    return response.ok;
  } catch {
    return false;
  }
}

export { apiBaseUrl, apiOrigin };
export default apiClient;
