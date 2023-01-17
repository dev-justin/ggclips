// Vercel Serverless Function
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Mux = require("@mux/mux-node");
const admin = require("firebase-admin");

// Init Express & dotenv
const app = express();
dotenv.config();

// Init CORS
app.use(
  cors({
    origin: ["http://127.0.0.1:5173", "https://ggclips.io"],
  })
);

// Init Body Parser
app.use(bodyParser.json());

// Init Firebase
const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware to check if user is authenticated 🔐 (mux-webhook doesn't need this)
app.use((req, res, next) => {
  if (req.path !== "/api/mux-webhook") {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      const idToken = req.headers.authorization.split("Bearer ")[1];
      admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedIdToken) => {
          req.user = decodedIdToken;
          next();
        })
        .catch((error) => {
          res.status(401).send("Unauthorized");
        });
    } else {
      res.status(401).send("Unauthorized");
    }
  } else {
    next();
  }
});

// Init Mux
const { Video } = new Mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRET
);

// Return the Mux auth URL (needed so client can upload file to Mux) 🗃️
app.post("/api/getUploadAuth", (req, res) => {
  const videoData = {
    title: req.body.Title,
    game: req.body.Game,
    userId: req.user.name,
  };

  if (!videoData.title || !videoData.game || !videoData.userId)
    return res.status(400).json({ error: "Missing required fields" });

  Video.Uploads.create({
    cors_origin: "https://ggclips.io",
    new_asset_settings: {
      playback_policy: ["public"],
      passthrough: JSON.stringify(videoData),
    },
  })
    .then((upload) => {
      return res.json({
        url: upload.url,
      });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
});

// Mux webhook
app.post("/api/mux-webhook", async (req, res) => {
  const { type } = req.body;
  if (type == "video.asset.ready") {
    // Get Mux data from event
    const playbackId = req.body.data.playback_ids[0].id;
    const { title, game, userId } = JSON.parse(req.body.data.passthrough);

    try {
      // Grab user details from Firestore
      const user = await admin
        .firestore()
        .collection("usernames")
        .doc(userId)
        .get();
      const { photoURL } = user.data();

      // Add clip to Firestore
      await admin.firestore().collection("clips").add({
        avatar: photoURL,
        date: new Date().toISOString(),
        game,
        title,
        username: userId,
        playback_id: playbackId,
      });
    } catch {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
  // Let Mux know we received the event
  res.status(200).send("Event received");
});

// app.listen(
//   process.env.PORT || 3001,
//   console.log(`Server running on port ${process.env.PORT || 3001} 🚀`)
// );

// Deploy for vercel
module.exports = app;