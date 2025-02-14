// src/api.ts

// --- Type Definitions ---

// For user registration (CreateNewUser schema)
export interface RegistrationData {
  email: string;
  username: string;
  password: string;
}

// For login/session creation (CreateSesstion schema)
export interface LoginCredentials {
  email: string;
  password: string;
}

// The token response returned from registration/login (IdTokenResponse)
export interface IdTokenResponse {
  id_token: string;
}

// User info returned by the protected endpoint (UserInfoResponse)
export interface UserInfo {
  id: number;
  name: string;
  email: string;
  balance: number;
}
export interface UserInfoResponse {
  user_info_token: UserInfo;
}

// For listing users (GetUsersRequest & GetUsersResponse)
export interface GetUsersRequest {
  filter: string;
}
export interface UserItem {
  id: string;
  name: string;
}
export type GetUsersResponse = UserItem[];

// For creating a transaction (CreateTransactionRequest & CreateTransactionResponse)
export interface CreateTransactionRequest {
  name: string; // Recipient's username
  amount: number;
}
export interface Transaction {
  id: number;
  date: string;
  username: string;
  amount: number;
  balance: number;
}
export interface CreateTransactionResponse {
  trans_token: Transaction;
}

// For retrieving transactions (GetTransactionsResponse)
export interface GetTransactionsResponse {
  trans_token: Transaction[];
}

// --- Base API URL ---
const API_BASE = "http://0.0.0.0:3001"; // Adjust as needed

// --- API Functions ---

// Register a new user. Calls POST /users.
export async function registerUser(data: RegistrationData): Promise<IdTokenResponse> {
  const response = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to register user");
  }
  return response.json();
}

// Login (or create session) using credentials. Calls POST /sessions/create.
export async function loginUser(credentials: LoginCredentials): Promise<IdTokenResponse> {
  const response = await fetch(`${API_BASE}/sessions/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error("Failed to log in");
  }
  return response.json();
}

// Retrieve user info for the authenticated user. Calls GET /api/protected/user-info.
export async function getUserInfo(token: string): Promise<UserInfoResponse> {
  const response = await fetch(`${API_BASE}/api/protected/user-info`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }
  return response.json();
}

// Retrieve a list of users filtered by name. Calls POST /api/protected/users/list.
export async function getUsersList(filter: string, token: string): Promise<GetUsersResponse> {
  const response = await fetch(`${API_BASE}/api/protected/users/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ filter }),
  });
  if (!response.ok) {
    throw new Error("Failed to get users list");
  }
  return response.json();
}

// Create a new transaction (PW transfer). Calls POST /api/protected/transactions.
export async function createTransaction(
  data: CreateTransactionRequest,
  token: string
): Promise<CreateTransactionResponse> {
  const response = await fetch(`${API_BASE}/api/protected/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create transaction");
  }
  return response.json();
}

// Retrieve all transactions for the current user. Calls GET /api/protected/transactions.
export async function getTransactions(token: string): Promise<GetTransactionsResponse> {
  const response = await fetch(`${API_BASE}/api/protected/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Failed to get transactions");
  }
  return response.json();
}
