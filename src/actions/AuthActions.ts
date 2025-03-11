import {loginSchema,registerSchema} from "@/lib/validation"
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
    // Perform registration logic...
    return { success: true };
  }