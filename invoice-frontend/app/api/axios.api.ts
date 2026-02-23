import axios from "axios";

export async function postRequest<T = any>(url: string, data: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const fullUrl = url.startsWith("http") ? url : `${apiUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  
  const response = await axios.post(fullUrl, data, {
    headers: { "Content-Type": "application/json" },
  });

  return response.data as T;
}