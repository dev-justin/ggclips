// This is deployed as a serverless function on Vercel
export default function handler(request, response) {
  return response.json({ query: request.query, body: request.body });
}
