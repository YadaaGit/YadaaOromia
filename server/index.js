import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";

import courseSchema from "./models/Course.js";
import moduleSchema from "./models/Module.js";
import quizSchema from "./models/Quiz.js";
import sectionSchema from "./models/Section.js";
import sectionImageSchema from "./models/Section_image.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 9174;
const RETRY_INTERVAL = 5000; // 5 seconds

const connections = {};
const models = {};

function createModels(conn) {
  return {
    courses: conn.model("Course", courseSchema, "courses"),
    modules: conn.model("Module", moduleSchema, "modules"),
    quizzes: conn.model("Quiz", quizSchema, "quizzes"),
    sections: conn.model("Section", sectionSchema, "sections"),
    section_images: conn.model("SectionImage", sectionImageSchema, "section_images"),
  };
}

async function connectWithRetry(name, srvUri, nonSrvUri) {
  try {
    console.log(chalk.blue(`[${name}] Trying SRV URI...`));
    connections[name] = await mongoose.createConnection(srvUri);
    models[name] = createModels(connections[name]);
    console.log(chalk.green(`[${name}] Connected using SRV URI`));
  } catch (err) {
    console.warn(chalk.yellow(`[${name}] SRV connection failed:`), err.message);
    try {
      console.log(chalk.blue(`[${name}] Trying non-SRV URI...`));
      connections[name] = await mongoose.createConnection(nonSrvUri);
      models[name] = createModels(connections[name]);
      console.log(chalk.green(`[${name}] Connected using non-SRV URI`));
    } catch (err2) {
      console.error(chalk.red(`[${name}] Both connections failed:`), err2.message);
      console.log(chalk.cyan(`[${name}] Retrying in ${RETRY_INTERVAL / 1000}s...`));
      setTimeout(() => connectWithRetry(name, srvUri, nonSrvUri), RETRY_INTERVAL);
    }
  }
}

// Start DB connections
connectWithRetry(
  "AM_courses",
  process.env.MONGO_URI_SRV_AM,
  process.env.MONGO_URI_NONSRV_AM
);

connectWithRetry(
  "OR_courses",
  process.env.MONGO_URI_SRV_OR,
  process.env.MONGO_URI_NONSRV_OR
);

// Collections list for display
const COLLECTION_NAMES = ["courses", "modules", "quizzes", "sections", "section_images"];

// Homepage: display links to all dbs & collections
app.get("/", (req, res) => {
  let html = `<h1>Available API Endpoints</h1><ul>`;
  for (const dbName of Object.keys(models)) {
    html += `<li><strong>${dbName}</strong><ul>`;
    for (const col of COLLECTION_NAMES) {
      html += `<li><a href="/api/${dbName}/${col}">/api/${dbName}/${col}</a></li>`;
    }
    html += `</ul></li>`;
  }
  html += `</ul>`;
  res.send(html);
});

// Dynamic route for collections
app.get("/api/:db/:collection", async (req, res) => {
  const { db, collection } = req.params;

  if (!models[db]) {
    return res.status(503).json({ error: `Database "${db}" not connected yet` });
  }

  const model = models[db][collection];
  if (!model) {
    return res.status(404).json({ error: `Collection "${collection}" not found in DB "${db}"` });
  }

  try {
    const docs = await model.find();
    res.json(docs);
  } catch (err) {
    console.error(chalk.red(`[${db}] Error fetching ${collection}:`), err.message);
    res.status(500).json({ error: `Failed to fetch ${collection}` });
  }
});

app.listen(PORT, () => {
  console.log(chalk.magenta(`🚀 Server running on http://localhost:${PORT}`));
});
