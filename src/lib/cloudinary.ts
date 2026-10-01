import { v2 as cloudinary } from "cloudinary";

let configurado = false;

/**
 * Configura o Cloudinary.
 *
 * Aceita as duas formas em que o painel do Cloudinary entrega as credenciais:
 *   - CLOUDINARY_URL, no formato cloudinary://chave:segredo@nome
 *   - CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET
 */
function garantirConfig() {
  if (configurado) return;

  const url = process.env.CLOUDINARY_URL?.trim();

  if (url) {
    // Sem argumentos, o SDK le CLOUDINARY_URL sozinho.
    cloudinary.config({ secure: true });
    configurado = true;
    return;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary nao configurado. Defina CLOUDINARY_URL ou as tres variaveis " +
        "CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  configurado = true;
}

export interface ResultadoUpload {
  url: string;
  publicId: string;
}

/**
 * Envia um arquivo para o Cloudinary.
 * Imagens são limitadas a 1600px de largura; PDFs ficam limitados a 30 MB.
 */
export async function enviarParaCloudinary(
  arquivo: File,
  pasta = "noticias"
): Promise<ResultadoUpload> {
  garantirConfig();

  const buffer = Buffer.from(await arquivo.arrayBuffer());
  const ehPdf = arquivo.type === "application/pdf";

  const resultado = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: pasta,
        resource_type: ehPdf ? "raw" : "image",
        ...(ehPdf
          ? {}
          : {
              transformation: [
                { width: 1600, height: 1600, crop: "limit" },
                { fetch_format: "auto", quality: "auto" },
              ],
            }),
      },
      (erro, resultadoUpload) => {
        if (erro) {
          reject(erro);
          return;
        }
        if (!resultadoUpload) {
          reject(new Error("Cloudinary não retornou resultado"));
          return;
        }
        resolve({
          secure_url: resultadoUpload.secure_url,
          public_id: resultadoUpload.public_id,
        });
      }
    );

    stream.end(buffer);
  });

  return {
    url: resultado.secure_url,
    publicId: resultado.public_id,
  };
}
