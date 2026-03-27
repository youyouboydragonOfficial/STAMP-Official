import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 画像プロキシエンドポイント
  app.get("/api/proxy-image", async (req, res) => {
    const fileId = req.query.id as string;
    if (!fileId) return res.status(400).send("File ID is required");

    const url = `https://drive.google.com/uc?export=view&id=${fileId}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch image");
      
      const contentType = response.headers.get("content-type");
      
      // CORSヘッダーを明示的に追加してブラウザの制限を回避
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET");
      if (contentType) res.setHeader("Content-Type", contentType);
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.send(buffer);
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).send("Error fetching image");
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
