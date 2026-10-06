import { getApiBaseUrl, ApiError } from "@/lib/api";
export async function streamChatMessage(sessionId, content, handlers = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const res = await fetch(`${getApiBaseUrl()}/api/chat/sessions/${sessionId}/messages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        signal: handlers.signal,
    });
    if (!res.ok) {
        let message = res.statusText;
        try {
            const data = await res.json();
            message = (_b = (_a = data.message) !== null && _a !== void 0 ? _a : data.error) !== null && _b !== void 0 ? _b : message;
        }
        catch (_k) {
            // ignore
        }
        throw new ApiError(res.status, message);
    }
    if (!res.body) {
        throw new Error("No response body for SSE stream");
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
        const { done, value } = await reader.read();
        if (done)
            break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = (_c = parts.pop()) !== null && _c !== void 0 ? _c : "";
        for (const part of parts) {
            if (!part.trim())
                continue;
            const lines = part.split("\n");
            let event = "message";
            const dataLines = [];
            for (const line of lines) {
                if (line.startsWith("event:")) {
                    event = line.slice(6).trim();
                }
                else if (line.startsWith("data:")) {
                    dataLines.push(line.slice(5).trimStart());
                }
            }
            const data = dataLines.join("\n");
            if (!data)
                continue;
            try {
                if (event === "token") {
                    (_d = handlers.onToken) === null || _d === void 0 ? void 0 : _d.call(handlers, JSON.parse(data));
                }
                else if (event === "user_message") {
                    (_e = handlers.onUserMessage) === null || _e === void 0 ? void 0 : _e.call(handlers, JSON.parse(data));
                }
                else if (event === "assistant_message") {
                    (_f = handlers.onAssistantMessage) === null || _f === void 0 ? void 0 : _f.call(handlers, JSON.parse(data));
                }
                else if (event === "done") {
                    (_g = handlers.onDone) === null || _g === void 0 ? void 0 : _g.call(handlers);
                }
                else if (event === "error") {
                    const errorMessage = JSON.parse(data);
                    throw new Error(errorMessage.message || "The AI provider could not complete the response.");
                }
            }
            catch (err) {
                if (event === "error")
                    throw err;
                (_h = handlers.onError) === null || _h === void 0 ? void 0 : _h.call(handlers, err instanceof Error ? err : new Error("Failed to parse SSE event"));
            }
        }
    }
    (_j = handlers.onDone) === null || _j === void 0 ? void 0 : _j.call(handlers);
}
