import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Field, TextInput } from "@/components/forms/Field";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("hello@avachen.design");
  const [password, setPassword] = useState("demo");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both fields.");
      return;
    }
    login();
    toast.success("Welcome back!");
    navigate("/dashboard");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-secondary px-6 py-12 text-secondary-foreground">
      <div className="w-full max-w-sm">
        <button
          onClick={() => navigate("/")}
          className="mb-8 inline-flex items-center gap-2 text-sm text-secondary-foreground/70 transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" /> Back to portfolio
        </button>

        <div className="rounded-3xl bg-card p-8 text-foreground shadow-soft">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-6 w-6" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold">Manage your portfolio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to edit your projects, skills and contact details.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Email">
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </Field>
            <Field label="Password">
              <TextInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field>
            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-primary font-600 text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Sign in
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Demo mode · any credentials work
          </p>
        </div>
      </div>
    </div>
  );
}
