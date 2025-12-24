const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export const apiUrl = (path: string) => `${API_BASE}/${path}`;