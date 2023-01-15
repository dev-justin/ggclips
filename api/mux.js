// This is deployed as a serverless function on Vercel

import Mux from "@mux/mux-node";
const { Video } = new Mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRET
);

export default async function handler(request, response) {
  // Verify ?video= is present
  if (!request.query.video) {
    return response
      .status(400)
      .json({ error: "Missing video query parameter" });
  }

  const asset = await Video.Assets.create({
    input: request.query.video,
    playback_policy: "public",
  });

  // Return the asset ID
  return response.json({ asset_id: asset.id });
}
