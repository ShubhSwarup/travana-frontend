import { FieldErrors, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthMode } from "../../types/auth";

// Define validation schema using Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(3, { message: "Password must be at least 3 characters" }),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
});

// Infer TypeScript types from zod schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

interface AuthFormProps {
  mode: AuthMode;
  onSubmit: (data: LoginFormData | SignupFormData) => void;
}
const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit }) => {
  const isSignup = mode === "signup";
 
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData | SignupFormData>({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema),
  });




  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {isSignup && (
        <div>
          <input
            {...register("name")}
            placeholder="Name"
            className="input input-bordered w-full"
          />
          {(errors as FieldErrors<SignupFormData>).name && (
            <p className="text-error text-sm mt-1">
              {(errors as FieldErrors<SignupFormData>).name?.message}
            </p>
          )}
        </div>
      )}

      <div>
        <input
          type="email"
          {...register("email")}
          placeholder="Email"
          className="input input-bordered w-full"
        />
        {errors.email && (
          <p className="text-error text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="input input-bordered w-full"
        />
        {errors.password && (
          <p className="text-error text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isSubmitting}
      >
        {isSignup ? "Create account" : "Log in"}
      </button>
    </form>
  );
};

export default AuthForm;
