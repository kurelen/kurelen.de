import { Metadata } from "next";
import { getAuthUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const auth = await getAuthUser();
  return auth
    ? {
        title: "Benutzerbereich - kurelen",
        description:
          "Teilen von Familienrezepten, dem Stammbaum und Familienfotos",
      }
    : {
        title: "Login - kurelen",
        description:
          "Der Nutzerbereich ist nur für registrierte Mitglieder verfügbar",
      };
}

export default async function Home() {
  const auth = await getAuthUser();

  if (auth) {
    const LoggedInPanel = (await import("@/components/auth/LoggedInPanel"))
      .default;
    return <LoggedInPanel user={auth.user} />;
  }
  const LoginForm = (await import("@/components/auth/LoginForm")).default;
  return <LoginForm />;
}
