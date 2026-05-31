// ============ Auth Types ============

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: "customer" | "staff";
    };
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role: "customer" | "staff";
}

export interface RegisterResponse {
    message: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

// ============ Product Types ============

export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    stock: number;
    createdAt: string;
}

export interface ProductFormData {
    name: string;
    description?: string;
    price: number;
    stock: number;
}

// ============ API Error ============

export interface ApiError {
    message: string;
}
