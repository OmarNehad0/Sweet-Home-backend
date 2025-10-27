import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1432450837061308458/AYWPCbzDcHKV6Ny-MkfowtNKiNbs3RaAc9GKdaCL3EiTFqBHbxN_ZM91xNcp0iDcCxVp"; // or use bot+channel+token

app.post("/order", async (req, res) => {
  const { name, phone, address, note, items, total } = req.body;
  if (!name || !phone || !address) return res.status(400).json({ error: "Missing data" });

  const description = items.map(i => `${i.name} × ${i.qty} = ${i.price * i.qty} EGP`).join("\n");

  const payload = {
    embeds: [{
      title: "🧾 طلب جديد من الموقع",
      color: 0xffcc00,
      fields: [
        { name: "👤 الاسم", value: name, inline: true },
        { name: "📞 الهاتف", value: phone, inline: true },
        { name: "📍 العنوان", value: address },
        { name: "🛍️ المنتجات", value: description || "لا يوجد" },
        { name: "💰 الإجمالي", value: `${total} EGP`, inline: true },
        { name: "📝 ملاحظات", value: note || "بدون" }
      ],
      timestamp: new Date().toISOString()
    }]
  };

  try {
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Discord error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
