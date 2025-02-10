// src/api.ts

// Types for registration data.
export interface RegistrationData {
    email: string;
    nickname: string;
    password: string;
    confirmPassword: string;
  }
  
  // Types for login.
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface UserResponse {
    name: string;
    balance: number;
  }
  
  export interface LoginResponse {
    success: boolean;
    token: string;
    user: UserResponse;
  }
  
  // Types for transactions.
  export interface TransactionData {
    recipientId: number;
    recipientName: string;
    amount: number;
  }
  
  export interface Transaction {
    date: string;
    correspondent: string;
    amount: number;
    balance: number;
  }
  
  // User item for autocomplete.
  export interface UserItem {
    id: number;
    name: string;
  }
  
  // Dummy API implementations.
  
  export const registerUser = async (data: RegistrationData): Promise<{ success: boolean }> => {
    console.log("Registering user:", data);
    return Promise.resolve({ success: true });
  };
  
  export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    console.log("Logging in with:", credentials);
    return Promise.resolve({
      success: true,
      token: "dummy-token",
      user: { name: "John Doe", balance: 1000 }
    });
  };
  
  export const getUserDetails = async (token: string): Promise<UserResponse> => {
    return Promise.resolve({ name: "John Doe", balance: 1000 });
  };
  
  export const getUsersList = async (query: string): Promise<UserItem[]> => {
    const dummyUsers: UserItem[] = [
      { id: 1, name: "Alice Smith" },
      { id: 2, name: "Bob Johnson" },
      { id: 3, name: "Charlie Brown" }
    ];
    return Promise.resolve(
      dummyUsers.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };
  
  export const createTransaction = async (
    token: string,
    transactionData: TransactionData
  ): Promise<{ success: boolean; newBalance: number; transaction: Transaction }> => {
    console.log("Creating transaction:", transactionData);
    const newBalance = 1000 - transactionData.amount; // Dummy logic.
    return Promise.resolve({
      success: true,
      newBalance,
      transaction: {
        date: new Date().toLocaleString(),
        correspondent: transactionData.recipientName,
        amount: -transactionData.amount,
        balance: newBalance
      }
    });
  };
  
  export const getTransactionHistory = async (token: string): Promise<Transaction[]> => {
    const dummyTransactions: Transaction[] = [
      {
        date: new Date().toLocaleString(),
        correspondent: "Alice Smith",
        amount: -100,
        balance: 900
      },
      {
        date: new Date().toLocaleString(),
        correspondent: "Bob Johnson",
        amount: 200,
        balance: 1000
      }
    ];
    return Promise.resolve(dummyTransactions);
  };
  