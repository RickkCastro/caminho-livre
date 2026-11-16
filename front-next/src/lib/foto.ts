import { upload } from "@vercel/blob/client";
import { USA_MOCKS } from "./api";
import { lerSessao } from "./sessao";

/** Reduz a foto no navegador: lado maior ≤ 1280 px, JPEG 0,8. */
export async function reduzirFoto(file: File): Promise<Blob> {
  const img = await createImageBitmap(file);
  const escala = Math.min(1, 1280 / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * escala);
  canvas.height = Math.round(img.height * escala);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((ok, falha) =>
    canvas.toBlob((b) => (b ? ok(b) : falha(new Error("Foto inválida"))), "image/jpeg", 0.8),
  );
}

/** Reduz e envia ao Vercel Blob; devolve a URL pública. */
export async function enviarFoto(file: File): Promise<string> {
  const foto = await reduzirFoto(file);
  if (USA_MOCKS) return URL.createObjectURL(foto);
  const { url } = await upload("alertas/foto.jpg", foto, {
    access: "public",
    contentType: "image/jpeg",
    handleUploadUrl: "/api/upload",
    headers: { Authorization: `Bearer ${lerSessao()?.idToken ?? ""}` },
  });
  return url;
}
