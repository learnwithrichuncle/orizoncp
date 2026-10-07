import { LoginForm } from "../components/auth/login-form";
import { usePageTitle } from "../lib/page-title";

export function LoginPage() {
  usePageTitle("Login");

  return (
    <div className="flex items-center justify-center h-full">
      <LoginForm />
    </div>
  );
}
