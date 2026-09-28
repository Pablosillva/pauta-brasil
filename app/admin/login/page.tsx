import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/admin");

  return (
    <div className="min-h-screen flex items-center justify-center bg-cinza-claro dark:bg-azul-dark px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-verde flex items-center justify-center text-white font-bold text-lg">
              PB
            </div>
            <span className="font-bold text-2xl text-azul dark:text-white">
              Pauta Brasil
            </span>
          </div>
          <h1 className="text-2xl font-bold text-azul dark:text-white mb-2">
            Painel Admin
          </h1>
          <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
            Faça login para gerenciar o conteúdo
          </p>
        </div>

        <form
          action={async (formData) => {
            "use server";
            try {
              await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirectTo: "/admin",
              });
            } catch (error) {
              if ((error as Error).message.includes("NEXT_REDIRECT")) {
                throw error;
              }
              redirect("/admin/login?error=CredentialsSignin");
            }
          }}
          className="bg-white dark:bg-azul-light p-8 rounded-2xl shadow-xl space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-azul dark:text-white mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="seu@email.com"
              className="w-full p-3 rounded-lg border border-cinza-medio dark:border-azul-dark bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-azul dark:text-white mb-2"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full p-3 rounded-lg border border-cinza-medio dark:border-azul-dark bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-xs text-cinza-escuro dark:text-cinza-medio mt-6">
          Acesso restrito ao administrador do site
        </p>
      </div>
    </div>
  );
}