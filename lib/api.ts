import axios, { type AxiosResponse } from "axios";
import { type Note } from "@/types/note";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (!TOKEN) {
  console.error("NEXT_PUBLIC_NOTEHUB_TOKEN is not set. Please configure environment variables.");
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: TOKEN ? `Bearer ${TOKEN}` : "",
    "Content-Type": "application/json",
  },
});

// Add request interceptor to log requests and verify token
api.interceptors.request.use(
  (config) => {
    // Always log token status (without exposing the actual token)
    console.log("API Request:", {
      url: config.url,
      baseURL: config.baseURL,
      hasToken: !!TOKEN,
      tokenLength: TOKEN?.length || 0,
      tokenPrefix: TOKEN ? TOKEN.substring(0, 20) + "..." : "none",
    });
    
    // Warn if token is missing
    if (!TOKEN) {
      console.warn("⚠️ NEXT_PUBLIC_NOTEHUB_TOKEN is missing! API requests will fail with 401.");
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      console.error("API Error:", {
        status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
        hasToken: !!TOKEN,
      });
      
      // Special handling for 401 errors
      if (status === 401) {
        const errorDetails = {
          tokenExists: !!TOKEN,
          tokenLength: TOKEN?.length || 0,
          baseURL: BASE_URL,
          envVarName: "NEXT_PUBLIC_NOTEHUB_TOKEN",
        };
        
        console.error("❌ Authentication failed (401). Details:", errorDetails);
        
        if (!TOKEN) {
          console.error(
            "🔴 CRITICAL: NEXT_PUBLIC_NOTEHUB_TOKEN environment variable is not set!\n" +
            "Please configure it in your deployment platform:\n" +
            "1. Go to your deployment platform settings\n" +
            "2. Add environment variable: NEXT_PUBLIC_NOTEHUB_TOKEN\n" +
            "3. Redeploy your application"
          );
        } else {
          console.error(
            "⚠️ Token exists but authentication failed. Possible issues:\n" +
            "- Token might be expired or invalid\n" +
            "- Token might not be properly set in deployment environment\n" +
            "- Make sure to redeploy after setting environment variables"
          );
        }
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error:", {
        message: error.message,
        url: error.config?.url,
        baseURL: BASE_URL,
      });
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export interface NormalizedNotesResponse {
  data: Note[];
  meta: {
    totalItems: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

function normalizeFetchResponse(
  resp: AxiosResponse<{
    notes?: Note[];
    total?: number;
    page?: number;
    perPage?: number;
    totalPages?: number;
  }>
): NormalizedNotesResponse {
  const { notes = [], total = notes.length, page = 1, perPage = notes.length, totalPages = 1 } =
    resp.data;
  return {
    data: notes,
    meta: { totalItems: total, page, perPage, totalPages },
  };
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export async function fetchNotes(params: FetchNotesParams = {}): Promise<NormalizedNotesResponse> {
  const { page = 1, perPage = 12, search, tag } = params;
  const query: Record<string, string | number> = { page, perPage };
  if (search) query.search = search;
  if (tag) query.tag = tag;

  const resp = await api.get<{
    notes?: Note[];
    total?: number;
    page?: number;
    perPage?: number;
    totalPages?: number;
  }>("/notes", { params: query });

  return normalizeFetchResponse(resp);
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(payload: Pick<Note, "title" | "content" | "tag">): Promise<Note> {
  const resp = await api.post<{ note?: Note; data?: Note }>("/notes", payload);
  return resp.data.note ?? resp.data.data!;
}

export async function deleteNote(id: string): Promise<Note> {
  const resp = await api.delete<{ note?: Note; data?: Note }>(`/notes/${id}`);
  return resp.data.note ?? resp.data.data!;
}