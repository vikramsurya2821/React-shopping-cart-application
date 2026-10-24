import request from "./apiClient";

import type { User } from "../types/User";

// =====================================
// LOGIN DATA
// =====================================

interface LoginData {
  email: string;
  password: string;
}

// =====================================
// LOGIN USER
// =====================================

export async function loginUser(
  loginData: LoginData
): Promise<User> {

  const users = await request<User[]>(
    `/users?email=${encodeURIComponent(
      loginData.email
    )}`
  );

  // User not found
  if (users.length === 0) {
    throw new Error(
      "User not found. Please register first."
    );
  }

  const foundUser = users[0];

  // Password check
  if (foundUser.password !== loginData.password) {
    throw new Error(
      "Incorrect password"
    );
  }

  return {
    id: foundUser.id,
    name: foundUser.name,
    email: foundUser.email,
  };
}

// =====================================
// GET CURRENT USER
// =====================================

export function getCurrentUsers() {
  return request<User[]>(
    "/currentUser"
  );
}

// =====================================
// DELETE CURRENT USER
// =====================================

export function deleteCurrentUser(
  id: string | number
) {
  return request<void>(
    `/currentUser/${id}`,
    {
      method: "DELETE",
    }
  );
}

// =====================================
// SAVE CURRENT USER
// =====================================

export function saveCurrentUser(
  user: User
) {
  return request<User>(
    "/currentUser",
    {
      method: "POST",

      body: JSON.stringify({
        name: user.name,
        email: user.email,
      }),
    }
  );
}
// =====================================
// REGISTER DATA
// =====================================

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// =====================================
// REGISTER USER
// =====================================

export async function registerUser(
  registerData: RegisterData
): Promise<User> {

  // STEP 1:
  // Check email already exists

  const existingUsers =
    await request<User[]>(
      `/users?email=${encodeURIComponent(
        registerData.email
      )}`
    );

  if (existingUsers.length > 0) {
    throw new Error(
      "Email already registered"
    );
  }

  // STEP 2:
  // Create new user

  return request<User>(
    "/users",
    {
      method: "POST",

      body: JSON.stringify({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      }),
    }
  );
}