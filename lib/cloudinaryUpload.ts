interface CloudinaryUploadSignature {
  api_key: string;
  timestamp: number;
  signature: string;
  folder: string;
  upload_url: string;
}

interface CloudinaryUploadResponse {
  secure_url?: string;
  error?: { message?: string };
}

/** Signed direct-to-Cloudinary upload, via XHR (not fetch) so real upload progress can be
 * reported — used to drive the circular progress indicator during community talent submission. */
export async function uploadToCloudinaryWithProgress(
  file: File,
  context: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  const sigRes = await fetch("/api/media/upload-signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ context }),
  });

  if (!sigRes.ok) {
    const err = await sigRes.json().catch(() => ({}));
    throw new Error(err.detail || "Impossible d'obtenir la signature d'upload");
  }

  const sig: CloudinaryUploadSignature = await sigRes.json();

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.api_key);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", sig.upload_url);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let data: CloudinaryUploadResponse = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // fall through to the status check below with an empty body
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
        onProgress?.(100);
        resolve(data.secure_url);
      } else {
        reject(new Error(data.error?.message || "Échec de l'upload vers Cloudinary"));
      }
    };

    xhr.onerror = () => reject(new Error("Erreur réseau pendant l'upload"));
    xhr.send(form);
  });
}
