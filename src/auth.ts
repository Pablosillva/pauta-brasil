// auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      authorize: async (credentials) => {
        // ⚠️ SUBSTITUA ESTA LÓGICA DE AUTENTICAÇÃO REAL
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (credentials.email === adminEmail && credentials.password === adminPassword) {
          // Login bem-sucedido
          return { id: "1", name: "Admin", email: adminEmail, role: "admin" }
        }
        // Login falhou
        return null
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
})