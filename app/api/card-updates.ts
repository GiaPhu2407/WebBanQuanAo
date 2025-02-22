import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Khi có thay đổi trong giỏ hàng, gửi update
  const sendUpdate = (count: number) => {
    res.write(`data: ${JSON.stringify({ type: "CART_UPDATE", count })}\n\n`);
  };

  // Cleanup khi client disconnect
  req.on("close", () => {
    res.end();
  });
}
