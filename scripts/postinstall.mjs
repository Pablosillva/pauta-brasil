import { existsSync, readdirSync } from "fs";
import { execSync } from "child_process";
import path from "path";

const RAIZ = process.cwd();
const fotosDir = path.join(RAIZ, "public/fotos");

// Só baixa na Vercel (não roda no npm install local)
if (!process.env.VERCEL) {
  console.log("⏭️  postinstall: local, pulando download de fotos");
  console.log("💡 Rode `npm run fotos:principais` quando precisar");
  process.exit(0);
}

// Estados que vão ser baixados no build da Vercel
const PRINCIPAIS = ["BR", "SP", "RJ", "MG"];

// Se já tem as fotos principais, pula
const temTodas = PRINCIPAIS.every(
  (uf) =>
    existsSync(path.join(fotosDir, uf)) &&
    readdirSync(path.join(fotosDir, uf)).length > 10
);

if (temTodas) {
  console.log("✅ postinstall: fotos já baixadas, pulando");
  process.exit(0);
}

console.log("📸 postinstall: baixando fotos principais...");

try {
  for (const uf of PRINCIPAIS) {
    execSync(`node scripts/baixar-fotos-tse.mjs ${uf}`, {
      stdio: "inherit",
      cwd: RAIZ,
    });
  }
  console.log("✅ postinstall: fotos baixadas com sucesso");
} catch (err) {
  console.error("⚠️  postinstall: falha ao baixar fotos, continuando build...");
  // Não falha o build por causa das fotos
  process.exit(0);
}