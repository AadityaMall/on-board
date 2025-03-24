"use client";
import { FormEvent, useState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, registerAction } from "@/actions/AuthActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lock, User } from "lucide-react";
import { toast } from "react-toastify";
import { InputField } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
export function LoginSignup() {
  const {login} = useAuth();
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [errors, setErrors] = useState<Record<any, any>>({});

  async function handleSubmit(
    actionFn: any,
    formData: FormData,
    event: FormEvent<HTMLFormElement>,
    functionCall:any
  ) {
    event.preventDefault(); // Prevent default form submission
    const result = await actionFn(formData,functionCall);
    if (result?.error) {
      toast.error(result.error)
      setErrors(result.error); // Store validation errors in state
    } else {
      setErrors({});
      toast.success("Logged In Successfully") // Handle successful login/signup
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full w-[157px] h-[36px] bg-white text-[16px] text-[#25304B]">
          Login / Signup
        </Button>
      </DialogTrigger>

      {/* LOGIN FORM */}
      {isLoginForm ? (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-brandColor font-semibold text-2xl">
              Login
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(event) =>
              handleSubmit(
                loginAction,
                new FormData(event.currentTarget),
                event,
                login
              )
            }
          >
            <InputField
              label="Email ID"
              type="email"
              id="userLoginEmail"
              name="userLoginEmail"
              icon={<User size={20} className="form-icon" />}
              error={errors?.loginEmail?._errors?.[0]}
            />
            <InputField
              label="Password"
              type="password"
              id="userLoginPassword"
              name="userLoginPassword"
              icon={<Lock size={20} className="form-icon" />}
              error={errors?.loginPassword?._errors?.[0]}
            />
            <DialogFooter>
              <SubmitButton>Login</SubmitButton>
            </DialogFooter>
          </form>
          <p className="text-center text-sm mt-4 text-brandGray">
            Not a member yet?{" "}
            <button
              type="button"
              onClick={() => setIsLoginForm(false)}
              className="font-bold hover:cursor-pointer"
            >
              Sign up Now.
            </button>
          </p>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-brandColor font-semibold text-2xl">
              Signup
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(event) =>
              handleSubmit(
                registerAction,
                new FormData(event.currentTarget),
                event,
                null
              )
            }
          >
            <InputField
              label="Full Name"
              type="text"
              id="userRegisterName"
              name="userRegisterName"
              icon={<User size={20} className="form-icon" />}
              error={errors?.name?._errors?.[0]}
            />
            <InputField
              label="Email ID"
              type="email"
              id="userRegisterEmail"
              name="userRegisterEmail"
              icon={<User size={20} className="form-icon" />}
              error={errors?.email?._errors?.[0]}
            />
            <InputField
              label="Password"
              type="password"
              id="userRegisterPassword"
              name="userRegisterPassword"
              icon={<Lock size={20} className="form-icon" />}
              error={errors?.password?._errors?.[0]}
            />
            <InputField
              label="Confirm Password"
              type="password"
              id="userRegisterPasswordConfirm"
              name="userRegisterPasswordConfirm"
              icon={<Lock size={20} className="form-icon" />}
              error={errors?.confirmPassword?._errors?.[0]}
            />
            <DialogFooter>
              <SubmitButton>Register</SubmitButton>
            </DialogFooter>
          </form>
          <p className="text-center text-sm mt-4 text-brandGray">
            Already a member?{" "}
            <button
              type="button"
              onClick={() => setIsLoginForm(true)}
              className="font-bold hover:cursor-pointer"
            >
              Login.
            </button>
          </p>
        </DialogContent>
      )}
    </Dialog>
  );
}



// Submit Button with Loading
function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-brandColor text-white px-8 rounded-full w-full md:w-[50%] my-2 cursor-pointer"
    >
      {pending ? "Submitting..." : children}
    </Button>
  );
}
