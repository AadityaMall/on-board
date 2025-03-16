import { loginSchema, registerSchema } from "@/lib/validation";

export async function loginAction(formData: FormData) {
  const data = {
    loginEmail: formData.get("userLoginEmail"),
    loginPassword: formData.get("userLoginPassword"),
  };
  const validated = loginSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.format() }; // Return structured Zod errors
  }
  // Perform login logic...
  return { success: true };
}

export async function registerAction(formData: FormData) {
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

  try {
    const userData: {
      name: FormDataEntryValue | null;
      email: FormDataEntryValue | null;
      password: FormDataEntryValue | null;
    } = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    const response = await fetch("http://localhost:8080/auth-service/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Registration failed");
    }

    return { success: true, data: responseData };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}
