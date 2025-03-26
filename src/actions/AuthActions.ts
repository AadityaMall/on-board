import { loginSchema, registerSchema } from "@/lib/validation";
import api from "./api"; // Axios instance

export async function loginAction(
  formData: FormData,
  login: (user: any, token: string) => void
) {
  const data = {
    email: formData.get("userLoginEmail"),
    password: formData.get("userLoginPassword"),
  };
  const validated = loginSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.format() };
  }
  try {
    const response = await api.post("/auth-service/api/login", data);

    // Extract token from headers (Bearer token format)
    const token = response.headers["authorization"]?.split(" ")[1] || null;
    const user = {
      id: response.data.data.id,
      name: response.data.data.name,
      email: response.data.data.email,
      role: response.data.data.role,
    };
    if (token) {
      login(user, token);
    }
    return { success: true, user };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Login failed",
    };
  }
}

export async function registerAction(
  formData: FormData,
  login: (user: any, token: string) => void
) {
  const data = {
    name: formData.get("userRegisterName"),
    email: formData.get("userRegisterEmail"),
    password: formData.get("userRegisterPassword"),
    confirmPassword: formData.get("userRegisterPasswordConfirm"),
  };

  const validated = registerSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.format() };
  }
  console.log(data);
  try {
    const response = await api.post("/auth-service/api/register", data);

    // Extract token from headers (Bearer token format)
    const token = response.headers["authorization"]?.split(" ")[1] || null;
    console.log(token);
    const user = {
      id: response.data.data.id,
      name: response.data.data.name,
      email: response.data.data.email,
      role: response.data.data.role,
    };
    console.log(user);
    if (token) {
      login(user, token); // Update global Auth state
    }

    return { success: true, user, message: response.data.message };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Registration failed",
    };
  }
}
