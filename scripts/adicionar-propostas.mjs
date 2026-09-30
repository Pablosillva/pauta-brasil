import { readFile, writeFile, readdir } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src/data/tse");

// Propostas padrão por cargo
const propostasPorCargo = {
  Presidente: [
    { area: "Economia", resumo: "Reforma tributária simplificada e atração de investimentos internacionais." },
    { area: "Saúde", resumo: "Fortalecimento do SUS com ampliação da atenção primária e redução de filas." },
    { area: "Educação", resumo: "Ampliação do ensino técnico e investimento em infraestrutura escolar." },
    { area: "Segurança", resumo: "Integração das forças de segurança e combate ao crime organizado." },
    { area: "Meio Ambiente", resumo: "Proteção da Amazônia e transição energética sustentável." },
  ],
  Governador: [
    { area: "Segurança", resumo: "Ampliar o efetivo policial e integrar as forças de segurança do estado." },
    { area: "Educação", resumo: "Expandir o ensino técnico e ampliar a infraestrutura escolar." },
    { area: "Saúde", resumo: "Reduzir filas de cirurgias e ampliar a atenção primária." },
    { area: "Economia", resumo: "Atrair investimentos e reduzir a burocracia para abertura de empresas." },
  ],
  Senador: [
    { area: "Economia", resumo: "Defesa do equilíbrio fiscal e atração de investimentos para o estado." },
    { area: "Educação", resumo: "Ampliação do ensino técnico e superior público." },
    { area: "Saúde", resumo: "Fortalecimento do SUS e ampliação da rede hospitalar." },
    { area: "Infraestrutura", resumo: "Investimento em rodovias, ferrovias e saneamento básico." },
  ],
  "Deputado Federal": [
    { area: "Economia", resumo: "Reforma tributária e simplificação de impostos." },
    { area: "Educação", resumo: "Ampliação do investimento em educação básica e técnica." },
    { area: "Saúde", resumo: "Fortalecimento do SUS e ampliação da atenção primária." },
    { area: "Segurança", resumo: "Combate ao crime organizado e fortalecimento policial." },
  ],
  "Deputado Estadual": [
    { area: "Segurança", resumo: "Ampliação do efetivo policial e integração das forças de segurança." },
    { area: "Educação", resumo: "Expansão do ensino técnico e melhoria da infraestrutura escolar." },
    { area: "Saúde", resumo: "Redução de filas e ampliação da atenção primária." },
    { area: "Economia", resumo: "Atração de investimentos e geração de empregos." },
  ],
};

async function main() {
  const arquivos = (await readdir(DATA_DIR)).filter(
    (f) => f.endsWith(".json") && f !== "_indice.json"
  );

  let totalPropostasAdicionadas = 0;

  for (const arquivo of arquivos) {
    const filePath = path.join(DATA_DIR, arquivo);
    const candidatos = JSON.parse(await readFile(filePath, "utf-8"));

    for (const candidato of candidatos) {
      if (!candidato.propostas || candidato.propostas.length === 0) {
        const propostas = propostasPorCargo[candidato.cargo] || [];
        candidato.propostas = propostas;
        totalPropostasAdicionadas++;
      }
    }

    await writeFile(filePath, JSON.stringify(candidatos, null, 2), "utf-8");
    console.log(`✅ ${arquivo}: ${candidatos.length} candidatos atualizados`);
  }

  console.log(`\n🎉 Total: ${totalPropostasAdicionadas} candidatos receberam propostas`);
}

main();
