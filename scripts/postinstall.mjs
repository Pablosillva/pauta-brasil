import { existsSync, readdirSync } from "fs";
import { execSync } from "child_process";
import path from "path";

const RAIZ = process.cwd();
const fotosDir = path.join(RAIZ, "public/fotos");
const planosDir = path.join(RAIZ, "public/planos");

// Só baixa na Vercel
if (!process.env.VERCEL) {
  console.log("⏭️  postinstall: local, pulando download");
  process.exit(0);
}

// Fotos dos 4 principais
const UFS_FOTOS = ["BR", "SP", "RJ", "MG"];

console.log("📸 postinstall: verificando fotos...");
const temTodasFotos = UFS_FOTOS.every(
  (uf) =>
    existsSync(path.join(fotosDir, uf)) &&
    readdirSync(path.join(fotosDir, uf)).length > 10
);

if (temTodasFotos) {
  console.log("✅ postinstall: fotos já baixadas");
} else {
  console.log("📸 postinstall: baixando fotos principais...");
  try {
    for (const uf of UFS_FOTOS) {
      execSync(`node scripts/baixar-fotos-tse.mjs ${uf}`, {
        stdio: "inherit",
        cwd: RAIZ,
      });
    }
    console.log("✅ postinstall: fotos baixadas");
  } catch (err) {
    console.error("⚠️  postinstall: falha ao baixar fotos, continuando...");
  }
}

// Planos apenas de presidentes (BR)
console.log("📄 postinstall: verificando planos de governo...");
const temPlanos = existsSync(path.join(planosDir, "BR")) &&
  readdirSync(path.join(planosDir, "BR")).length > 0;

if (temPlanos) {
  console.log("✅ postinstall: planos já baixados");
} else {
  console.log("📄 postinstall: baixando planos dos presidentes...");
  try {
    execSync("node scripts/baixar-planos-tse.mjs BR", {
      stdio: "inherit",
      cwd: RAIZ,
    });
    console.log("✅ postinstall: planos baixados");
  } catch (err) {
    console.error("⚠️  postinstall: falha nos planos, continuando...");
  }
}