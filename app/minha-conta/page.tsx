import type { Metadata } from "next";
import { formatarNome } from "@/lib/nomes";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Crown, LogOut, User, MapPin, Heart, FileText } from "lucide-react";
import { getSessaoUsuario } from "@/lib/sessao-usuario";
import {
  buscarUsuarioPorId,
  listarFavoritos,
  listarVotosPauta,
} from "@/lib/usuarios";
import { buscarCandidatos, nomeEstadoDoCandidato } from "@/lib/candidatos-tse";
import { acaoAlternarFavorito, acaoSair, acaoAtualizarPerfil } from "@/actions/usuario";
import { FotoCandidato } from "@/components/ui/FotoCandidato";
import { ufs, nomeUf } from "@/data/ufs";

export const metadata: Metadata = {
  title: "Minha conta",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function MinhaContaPage() {
  const sessao = await getSessaoUsuario();
  if (!sessao) redirect("/login?proximo=/minha-conta");

  const usuario = await buscarUsuarioPorId(sessao.id);
  if (!usuario) redirect("/login?proximo=/minha-conta");

  const [favoritos, votos] = await Promise.all([
    listarFavoritos(usuario.id),
    listarVotosPauta(usuario.id),
  ]);

  const candidatos = await buscarCandidatos(
    favoritos.map((f) => f.candidatoId)
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 text-verde mb-3">
              <User size={18} />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Minha conta
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-azul dark:text-white">
              Ola, {usuario.nome.split(" ")[0]}
            </h1>
            <p className="text-cinza-escuro dark:text-cinza-medio mt-2">
              {usuario.email}
              {!usuario.emailVerificado && (
                <span className="ml-2 text-amber-600 dark:text-amber-400 text-sm">
                  (e-mail nao confirmado)
                </span>
              )}
            </p>
          </div>

          <form action={acaoSair}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-cinza-medio dark:border-azul-light text-azul dark:text-white hover:bg-cinza-claro dark:hover:bg-azul-light transition-colors text-sm font-semibold"
            >
              <LogOut size={16} /> Sair
            </button>
          </form>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Perfil */}
        <section className="lg:col-span-1">
          <div className="p-6 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
            <h2 className="font-bold text-azul dark:text-white mb-5">Perfil</h2>

            <form action={acaoAtualizarPerfil} className="space-y-4">
              <div>
                <label
                  htmlFor="nome"
                  className="block text-sm font-medium text-azul dark:text-white mb-2"
                >
                  Nome
                </label>
                <input
                  id="nome"
                  name="nome"
                  defaultValue={usuario.nome}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
                />
              </div>

              <div>
                <label
                  htmlFor="uf"
                  className="block text-sm font-medium text-azul dark:text-white mb-2"
                >
                  Estado de interesse
                </label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza-medio pointer-events-none"
                  />
                  <select
                    id="uf"
                    name="uf"
                    defaultValue={usuario.uf ?? ""}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
                  >
                    <option value="">Todos os estados</option>
                    {ufs.map((u) => (
                      <option key={u.sigla} value={u.sigla}>
                        {u.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2.5 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors text-sm"
              >
                Salvar alteracoes
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-cinza-medio dark:border-azul-light">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-cinza-escuro dark:text-cinza-medio">
                  Plano
                </span>
                <span
                  className={`text-sm font-bold px-2.5 py-1 rounded ${
                    usuario.plano === "premium"
                      ? "bg-verde/15 text-verde"
                      : "bg-cinza-claro dark:bg-azul-light text-azul dark:text-white"
                  }`}
                >
                  {usuario.plano === "premium" ? "Premium" : "Gratuito"}
                </span>
              </div>

              {usuario.plano !== "premium" && (
                <Link
                  href="/premium"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-azul dark:bg-azul-light text-white text-sm font-semibold hover:bg-azul-light transition-colors"
                >
                  <Crown size={16} /> Conhecer o Premium
                </Link>
              )}
            </div>
          </div>

          <div className="mt-6 p-6 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-cinza-medio dark:border-azul-light">
            <h3 className="font-bold text-azul dark:text-white mb-3 text-sm">
              Resumo
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-cinza-escuro dark:text-cinza-medio">
                  Candidatos salvos
                </dt>
                <dd className="font-bold text-azul dark:text-white">
                  {favoritos.length}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-cinza-escuro dark:text-cinza-medio">
                  Pautas avaliadas
                </dt>
                <dd className="font-bold text-azul dark:text-white">
                  {votos.length}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-cinza-escuro dark:text-cinza-medio">
                  Estado
                </dt>
                <dd className="font-bold text-azul dark:text-white">
                  {nomeUf(usuario.uf) || "Todos"}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Favoritos e votos */}
        <section className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="flex items-center gap-2 font-bold text-azul dark:text-white mb-4">
              <Heart size={18} className="text-verde" />
              Candidatos salvos ({favoritos.length})
            </h2>

            {candidatos.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-dashed border-cinza-medio dark:border-azul-light">
                <p className="text-cinza-escuro dark:text-cinza-medio mb-4">
                  Voce ainda nao salvou nenhum candidato.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link
                    href="/candidatos"
                    className="px-4 py-2 rounded-lg bg-verde hover:bg-verde-dark text-white text-sm font-semibold transition-colors"
                  >
                    Explorar candidatos
                  </Link>
                  <Link
                    href="/comparador"
                    className="px-4 py-2 rounded-lg border border-cinza-medio dark:border-azul-light text-azul dark:text-white text-sm font-semibold transition-colors"
                  >
                    Usar o comparador
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="space-y-3">
                {candidatos.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light"
                  >
                    <div className="w-12 h-12 rounded-full bg-cinza-medio dark:bg-azul-light overflow-hidden flex-shrink-0">
                      <FotoCandidato
                        src={c.foto}
                        alt={`Foto de ${formatarNome(c.nome)}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/candidatos/${c.id}`}
                        className="font-bold text-azul dark:text-white hover:text-verde transition-colors block truncate"
                      >
                        {formatarNome(c.nome)}
                      </Link>
                      <p className="text-xs text-cinza-escuro dark:text-cinza-medio truncate">
                        {c.cargo} · {c.partido} · {nomeEstadoDoCandidato(c)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        href={`/candidatos/${c.id}`}
                        className="px-3 py-1.5 rounded-lg border border-cinza-medio dark:border-azul-light text-xs font-semibold text-azul dark:text-white hover:bg-cinza-claro dark:hover:bg-azul-light transition-colors"
                      >
                        Ver
                      </Link>
                      <form action={acaoAlternarFavorito.bind(null, c.id)}>
                        <button
                          type="submit"
                          title="Remover dos salvos"
                          className="px-2.5 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Heart size={16} fill="currentColor" />
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {votos.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 font-bold text-azul dark:text-white mb-4">
                <FileText size={18} className="text-verde" />
                Pautas que voce acompanhou ({votos.length})
              </h2>
              <ul className="space-y-2">
                {votos.map((v) => (
                  <li
                    key={v.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-xl bg-cinza-claro dark:bg-azul-light/10 border border-cinza-medio dark:border-azul-light text-sm"
                  >
                    <Link
                      href={`/pautas/${v.votacaoId}`}
                      className="text-azul dark:text-white hover:text-verde truncate"
                    >
                      Votacao {v.votacaoId}
                    </Link>
                    <span
                      className={`font-bold px-2.5 py-1 rounded text-xs flex-shrink-0 ${
                        v.voto === "Sim"
                          ? "bg-verde/15 text-verde"
                          : v.voto === "Não"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            : "bg-cinza-medio/30 text-cinza-escuro dark:text-cinza-medio"
                      }`}
                    >
                      {v.voto}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
