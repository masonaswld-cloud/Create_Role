
require("dotenv").config();

const express = require("express");
const {
  Client,
  GatewayIntentBits
} = require("discord.js");

const app = express();
app.use(express.json());

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "Discord Role API"
  });
});

app.post("/create-role", async (req, res) => {
  try {
    const { role_name, role_color } = req.body;
    const guildId = req.query.guildId || process.env.GUILD_ID;

    if (!guildId || !role_name || !role_color) {
      return res.status(400).json({
        success: false,
        error: "guildId, role_name and role_color are required"
      });
    }

    const guild = await client.guilds.fetch(guildId);

    const role = await guild.roles.create({
      name: role_name,
      color: role_color,
      reason: "Created through Discord Role API"
    });

    res.json({
      success: true,
      role_name: role.name,
      role_color: role.hexColor
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

client.login(process.env.DISCORD_TOKEN);
