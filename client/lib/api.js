export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
export function getApiBaseUrl() {
    return import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
}
export function getGithubLoginUrl() {
    return `${getApiBaseUrl()}/oauth2/authorization/github`;
}
async function parseError(res) {
    var _a, _b;
    try {
        const data = await res.json();
        return (_b = (_a = data.message) !== null && _a !== void 0 ? _a : data.error) !== null && _b !== void 0 ? _b : res.statusText;
    }
    catch (_c) {
        return res.statusText || "Request failed";
    }
}
export async function apiFetch(path, init) {
    var _a;
    const res = await fetch(`${getApiBaseUrl()}${path}`, Object.assign(Object.assign({}, init), { credentials: "include", headers: Object.assign({ "Content-Type": "application/json" }, ((_a = init === null || init === void 0 ? void 0 : init.headers) !== null && _a !== void 0 ? _a : {})) }));
    if (!res.ok) {
        throw new ApiError(res.status, await parseError(res));
    }
    if (res.status === 204) {
        return undefined;
    }
    return res.json();
}
export const api = {
    me: () => apiFetch("/api/auth/me"),
    logout: () => apiFetch("/api/auth/logout", {
        method: "POST",
    }),
    listRepos: (refresh = true) => apiFetch(`/api/repos?refresh=${refresh}`),
    getRepo: (id) => apiFetch(`/api/repos/${id}`),
    startIndex: (id) => apiFetch(`/api/repos/${id}/index`, { method: "POST" }),
    indexStatus: (id) => apiFetch(`/api/repos/${id}/status`),
    createSession: (repositoryId, title) => apiFetch("/api/chat/sessions", {
        method: "POST",
        body: JSON.stringify({ repositoryId, title }),
    }),
    listSessions: (repositoryId) => apiFetch(`/api/chat/sessions?repositoryId=${encodeURIComponent(repositoryId)}`),
    getMessages: (sessionId) => apiFetch(`/api/chat/sessions/${sessionId}`),
};
