import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface CampoProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icone?: ReactNode;
  erro?: string;
  dica?: string;
  /** Elemento exibido a direita do campo (ex.: botao mostrar senha). */
  acessorio?: ReactNode;
}

export const Campo = forwardRef<HTMLInputElement, CampoProps>(function Campo(
  { label, icone, erro, dica, acessorio, id, className = "", ...props },
  ref
) {
  const campoId = id ?? props.name;

  return (
    <div>
      <label
        htmlFor={campoId}
        className="block text-sm font-medium text-azul dark:text-white mb-2"
      >
        {label}
      </label>

      <div className="relative">
        {icone && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza-medio pointer-events-none">
            {icone}
          </span>
        )}

        <input
          ref={ref}
          id={campoId}
          aria-invalid={erro ? true : undefined}
          className={`w-full py-3 rounded-lg border bg-white dark:bg-azul-dark text-azul dark:text-white placeholder:text-cinza-medio focus:outline-none focus:ring-2 transition-colors ${
            icone ? "pl-10" : "pl-4"
          } ${acessorio ? "pr-12" : "pr-4"} ${
            erro
              ? "border-red-400 focus:ring-red-400"
              : "border-cinza-medio dark:border-azul-light focus:ring-verde"
          } ${className}`}
          {...props}
        />

        {acessorio && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {acessorio}
          </span>
        )}
      </div>

      {erro ? (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{erro}</p>
      ) : dica ? (
        <p className="mt-1 text-xs text-cinza-escuro dark:text-cinza-medio">
          {dica}
        </p>
      ) : null}
    </div>
  );
});
