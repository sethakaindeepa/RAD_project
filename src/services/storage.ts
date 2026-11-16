
import { apiFetch } from "./api";

interface UploadResponse {
  message: string;
  imageUrl: string;
  path: string;
}

export async function uploadProductImage(
  file: File
): Promise<string> {
  const formData = new FormData();

  formData.append("image", file);

  const response = await apiFetch<UploadResponse>(
    "/uploads/product-image",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.imageUrl) {
    throw new Error("Image URL was not returned by the server.");
  }

  return response.imageUrl;
}
