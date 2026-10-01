"use client";

import { useRef, type ReactNode } from "react";

export interface ToolbarAcao {
  titulo: string;
  icone: ReactNode;
  aplicar: (editor: EditorRef) => void;
  /** Quando presente, o botão fica ativo (ex.: cursor dentro de negrito). */
  ativo?: (editor: EditorRef) => boolean;
}

export interface EditorRef {
  textarea: HTMLTextAreaElement;
  getValue: () => string;
  setValue: (valor: string) => void;
  getSelection: () => { inicio: number; fim: number };
  setSelection: (inicio: number, fim: number) => void;
  inserir: (texto: string, selecao?: { inicio: number; fim: number }) => void;
}

const TAMANHOS = [
  { rotulo: "Normal", valor: undefined },
  { rotulo: "Pequeno", valor: "0.875rem" },
  { rotulo: "Médio", valor: "1.125rem" },
  { rotulo: "Grande", valor: "1.5rem" },
  { rotulo: "Muito grande", valor: "2rem" },
] as const;

/** Envolve o texto selecionado com os marcadores informed. */
function envolver(editor: EditorRef, antes: string, depois = antes) {
  const { inicio, fim } = editor.getSelection();
  const valor = editor.getValue();
  const selecionado = valor.slice(inicio, fim);

  // Se já está envolvido, remove os marcadores (toggle).
  const antesExistente =
    valor.slice(Math.max(0, inicio - antes.length), inicio) === antes;
  const depoisExistente = valor.slice(fim, fim + depois.length) === depois;

  if (antesExistente && depoisExistente && selecionado.length > 0) {
    const novoValor =
      valor.slice(0, inicio - antes.length) +
      selecionado +
      valor.slice(fim + depois.length);
    editor.setValue(novoValor);
    editor.setSelection(inicio - antes.length, inicio - antes.length + selecionado.length);
    return;
  }

  const texto = selecionado || "texto";
  const novoValor =
    valor.slice(0, inicio) + antes + texto + depois + valor.slice(fim);

  editor.setValue(novoValor);
  editor.setSelection(inicio + antes.length, inicio + antes.length + texto.length);
}

/** Aplica um prefixo de bloco na linha atual (títulos e listas). */
function aplicarLinha(editor: EditorRef, prefixo: string, alternar = true) {
  const { inicio, fim } = editor.getSelection();
  const valor = editor.getValue();

  const inicioLinha = valor.lastIndexOf("\n", inicio - 1) + 1;
  const fimLinha = valor.indexOf("\n", fim);
  const linha = valor.slice(inicioLinha, fimLinha === -1 ? valor.length : fimLinha);

  const semPrefixo = linha.replace(/^(\s*)(#{1,3}\s+|[-*+]\s+|\d+\.\s+)/, "$1");
  const novaLinha = alternar && linha !== semPrefixo ? semPrefixo : prefixo + semPrefixo;

  const novoValor = valor.slice(0, inicioLinha) + novaLinha + valor.slice(fimLinha === -1 ? valor.length : fimLinha);

  editor.setValue(novoValor);

  const deslocamento = novaLinha.length - linha.length;
  editor.setSelection(inicio + deslocamento, fim + deslocamento);
}

const ACOES: ToolbarAcao[] = [
  {
    titulo: "Título 1",
    icone: <span className="text-xs font-bold">H1</span>,
    aplicar: (e) => aplicarLinha(e, "# "),
  },
  {
    titulo: "Título 2",
    icone: <span className="text-xs font-bold">H2</span>,
    aplicar: (e) => aplicarLinha(e, "## "),
  },
  {
    titulo: "Título 3",
    icone: <span className="text-xs font-bold">H3</span>,
    aplicar: (e) => aplicarLinha(e, "### "),
  },
  {
    titulo: "Negrito",
    icone: <span className="font-bold">N</span>,
    aplicar: (e) => envolver(e, "**"),
  },
  {
    titulo: "Itálico",
    icone: <span className="italic">I</span>,
    aplicar: (e) => envolver(e, "*"),
  },
  {
    titulo: "Lista com marcadores",
    icone: <span className="text-xs">• Lista</span>,
    aplicar: (e) => aplicarLinha(e, "- "),
  },
  {
    titulo: "Lista numerada",
    icone: <span className="text-xs">1. Lista</span>,
    aplicar: (e) => aplicarLinha(e, "1. "),
  },
];

interface EditorConteudoProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
}

export function EditorConteudo({
  name,
  defaultValue = "",
  placeholder,
  rows = 20,
}: EditorConteudoProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function criarEditor(): EditorRef {
    return {
      textarea: textareaRef.current!,
      getValue: () => textareaRef.current?.value ?? "",
      setValue: (valor) => {
        if (textareaRef.current) {
          // Define o valor via setter nativo para o React detectar a mudança
          const setter = Object.getOwnPropertyDescriptor(
            HTMLTextAreaElement.prototype,
            "value"
          )?.set;
          setter?.call(textareaRef.current, valor);
          textareaRef.current.dispatchEvent(new Event("input", { bubbles: true }));
        }
      },
      getSelection: () => ({
        inicio: textareaRef.current?.selectionStart ?? 0,
        fim: textareaRef.current?.selectionEnd ?? 0,
      }),
      setSelection: (inicio, fim) => {
        requestAnimationFrame(() => {
          textareaRef.current?.focus();
          textareaRef.current?.setSelectionRange(inicio, fim);
        });
      },
      inserir: (texto, selecao) => {
        const el = textareaRef.current;
        if (!el) return;
        const valor = el.value;
        const inicio = el.selectionStart;
        const fim = el.selectionEnd;
        const novoValor = valor.slice(0, inicio) + texto + valor.slice(fim);

        const setter = Object.getOwnPropertyDescriptor(
          HTMLTextAreaElement.prototype,
          "value"
        )?.set;
        setter?.call(el, novoValor);
        el.dispatchEvent(new Event("input", { bubbles: true }));

        const alvo = selecao ?? {
          inicio: inicio + texto.length,
          fim: inicio + texto.length,
        };
        requestAnimationFrame(() => {
          el.focus();
          el.setSelectionRange(alvo.inicio, alvo.fim);
        });
      },
    };
  }

  function aplicarTamanho(editor: EditorRef, tamanho?: string) {
    const { inicio, fim } = editor.getSelection();
    const valor = editor.getValue();

    if (fim === inicio) {
      editor.inserir(
        "<span style=\"font-size: 1.5rem;\">texto</span>",
        { inicio: inicio + 36, fim: inicio + 40 }
      );
      return;
    }

    const seleciondo = valor.slice(inicio, fim);
    // Remove marcação de tamanho anterior para não aninhar
    const limpo = seleciondo.replace(
      /<span style="font-size:\s*[^"]+;">([\s\S]*?)<\/span>/g,
      "$1"
    );
    const Replacement = tamanho ? `<span style="font-size: ${tamanho};">${limpo}</span>` : limpo;

    const novoValor = valor.slice(0, inicio) + Replacement + valor.slice(fim);
    editor.setValue(novoValor);
    editor.setSelection(inicio, inicio + Replacement.length);
  }

  return (
    <div className="rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark overflow-hidden">
      {/* Barra de ferramentas */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-cinza-medio dark:border-azul-light bg-cinza-claro dark:bg-azul-light/20">
        {ACOES.map((acao) => (
          <button
            key={acao.titulo}
            type="button"
            title={acao.titulo}
            aria-label={acao.titulo}
            onClick={() => acao.aplicar(criarEditor())}
            className="min-w-[34px] h-8 px-2 rounded-md text-azul dark:text-white hover:bg-verde hover:text-white transition-colors"
          >
            {acao.icone}
          </button>
        ))}

        <div className="w-px h-5 mx-1 bg-cinza-medio dark:bg-azul-light" />

        {/* Tamanho da fonte */}
        <select
          title="Tamanho da fonte"
          aria-label="Tamanho da fonte"
          defaultValue=""
          onChange={(e) => {
            const opcao = TAMANHOS.find((t) => t.valor === e.target.value);
            aplicarTamanho(criarEditor(), opcao?.valor);
            e.target.value = "";
          }}
          className="h-8 px-2 rounded-md text-xs text-azul dark:text-white bg-white dark:bg-azul-dark border border-cinza-medio dark:border-azul-light focus:outline-none focus:ring-2 focus:ring-verde"
        >
          {TAMANHOS.map((t) => (
            <option key={t.rotulo} value={t.valor ?? ""}>
              {t.rotulo}
            </option>
          ))}
        </select>

        <div className="w-px h-5 mx-1 bg-cinza-medio dark:bg-azul-light" />

        {/* Atalhos */}
        <button
          type="button"
          title="Citação"
          aria-label="Citação"
          onClick={() => criarEditor().inserir("> citação")}
          className="min-w-[34px] h-8 px-2 rounded-md text-azul dark:text-white hover:bg-verde hover:text-white transition-colors"
        >
          <span className="text-xs font-bold">&ldquo;</span>
        </button>
        <button
          type="button"
          title="Divisor horizontal"
          aria-label="Divisor horizontal"
          onClick={() => criarEditor().inserir("\n\n---\n\n")}
          className="min-w-[34px] h-8 px-2 rounded-md text-azul dark:text-white hover:bg-verde hover:text-white transition-colors"
        >
          <span className="text-xs">&mdash;</span>
        </button>
        <button
          type="button"
          title="Link"
          aria-label="Link"
          onClick={() => {
            const editor = criarEditor();
            const { inicio, fim } = editor.getSelection();
            const selecionado = editor.getValue().slice(inicio, fim);
            const url = window.prompt("Endereço do link:", "https://");
            if (url) {
              editor.inserir(`[${selecionado || "texto"}](${url})`, {
                inicio: inicio + 1,
                fim: inicio + 1 + (selecionado || "texto").length,
              });
            }
          }}
          className="min-w-[34px] h-8 px-2 rounded-md text-azul dark:text-white hover:bg-verde hover:text-white transition-colors"
        >
          <span className="text-xs underline">Link</span>
        </button>
      </div>

      <textarea
        ref={textareaRef}
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        placeholder={placeholder}
        onKeyDown={(e) => {
          // Atalhos citados na ajuda abaixo. Sem Ctrl, para nao roubar o
          // atalho de novo paragrafo do navegador.
          if (!e.ctrlKey || e.altKey) return;

          const editor = criarEditor();

          if (e.key.toLowerCase() === "b") {
            e.preventDefault();
            envolver(editor, "**");
          } else if (e.key.toLowerCase() === "i") {
            e.preventDefault();
            envolver(editor, "*");
          }
        }}
        className="w-full p-4 font-mono text-sm text-azul dark:text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-verde resize-y"
      />

      <p className="px-4 py-2 text-xs text-cinza-escuro dark:text-cinza-medio border-t border-cinza-medio dark:border-azul-light">
        Selecione o texto e use a barra acima para formatar. Atalhos:{" "}
        <kbd className="px-1">Ctrl+B</kbd> negrito, <kbd className="px-1">Ctrl+I</kbd>{" "}
        itálico. Linha em branco separa parágrafos;{" "}
        <code className="px-1">- item</code> monta lista.
      </p>
    </div>
  );
}
