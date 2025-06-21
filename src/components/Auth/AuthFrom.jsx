import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PropTypes from "prop-types";

// Define validation schema using Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
});

export default function AuthForm({ mode, onSubmit }) {
  const isSignup = mode === "signup";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
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
          {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
        </div>
      )}

      <div>
        <input
          type="email"
          {...register("email")}
          placeholder="Email"
          className="input input-bordered w-full"
        />
        {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="input input-bordered w-full"
        />
        {errors.password && <p className="text-error text-sm mt-1">{errors.password.message}</p>}
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
}

AuthForm.propTypes = {
  mode: PropTypes.oneOf(["login", "signup"]).isRequired,
  onSubmit: PropTypes.func.isRequired,
};
