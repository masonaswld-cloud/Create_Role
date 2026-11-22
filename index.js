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
    const {
      guildId,
      name,
      color,
      mentionable,
      hoist
    } = req.body;

    if (!guildId || !name) {
      return res.status(400).json({
        success: false,
        error: "guildId and name are required"
      });
    }

    const guild = await client.guilds.fetch(guildId);

    if (!guild) {
      return res.status(404).json({
        success: false,
        error: "Server not found"
      });
    }

    const role = await guild.roles.create({
      name: name,
      color: color || "Default",
      mentionable: mentionable === true,
      hoist: hoist === true,
      reason: "Created through Discord Role API"
    });

    res.json({
      success: true,
      role: {
        id: role.id,
        name: role.name,
        color: role.hexColor,
        mentionable: role.mentionable,
        hoist: role.hoist
      }
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
