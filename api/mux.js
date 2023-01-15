// This is deployed as a serverless function on Vercel
export default function handler(request, response) {
  const { videoUrl } = request.query;
  return response.end(`Video URL: ${videoUrl}`);
}
