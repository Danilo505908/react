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
    // Log in development to help debug
    if (process.env.NODE_ENV === "development") {
      console.log("API Request:", {
        url: config.url,
        baseURL: config.baseURL,
        hasToken: !!TOKEN,
        tokenLength: TOKEN?.length || 0,
      });
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
        console.error(
          "Authentication failed (401). Check if NEXT_PUBLIC_NOTEHUB_TOKEN is set correctly.",
          {
            tokenExists: !!TOKEN,
            tokenLength: TOKEN?.length || 0,
            baseURL: BASE_URL,
          }
        );
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