import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { OAuth2Client } from "google-auth-library";
import { NextResponse } from "next/server";

const google = new OAuth2Client();

// Gera o token de upload do Vercel Blob só para quem tem ID token Google válido.
export async function POST(request: Request) {
  let naoAutorizado = false;
  try {
    const body = (await request.json()) as HandleUploadBody;
    const resposta = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const idToken = request.headers.get("authorization")?.replace(/^Bearer /, "");
        try {
          if (!idToken) throw new Error("sem token");
          await google.verifyIdToken({ idToken, audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID });
        } catch {
          naoAutorizado = true;
          throw new Error("Entre para enviar fotos");
        }
        return { allowedContentTypes: ["image/*"], maximumSizeInBytes: 2 * 1024 * 1024, addRandomSuffix: true };
      },
    });
    return NextResponse.json(resposta);
  } catch (e) {
    const status = naoAutorizado ? 401 : 400;
    return NextResponse.json({ status, erro: (e as Error).message }, { status });
  }
}
