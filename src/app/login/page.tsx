import LoggedInPanel from "@/components/auth/LoggedInPanel";
import LoginForm from "@/components/auth/LoginForm";
import { getAuthUser } from "@/lib/session";

export const dynamic = "force-dynamic"; // keep it fresh during dev

export default async function LoginPage() {
  const auth = await getAuthUser(); // null if no/invalid session

  if (auth) {
    // show the user's info (me-like)
    return <LoggedInPanel user={auth.user} />;
  }

  // no (or invalid) session -> login form (client will slow-logout stale cookie)
  return <LoginForm />;
}
