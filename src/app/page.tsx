import { getAuthUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function Home() {
  const auth = await getAuthUser();

  if (auth) {
    const LoggedInPanel = (await import("@/components/auth/LoggedInPanel")).default;
    return <LoggedInPanel user={auth.user} />;
  }
  const LoginForm = (await import("@/components/auth/LoginForm")).default;
  return <LoginForm />;
}
