import express from "express";
import multer from "multer";
import { v4 as uuid } from "uuid";
import fetch from "node-fetch";

const upload = multer(); // use memory storage for images
const router = express.Router();

export default function createApiRoutes(models) {
  // Upload image
  router.post("/upload_image", upload.single("image"), async (req, res) => {
    try {
      const image_id = uuid();
      const newImage = new models.AM_courses.images({
        image_id,
        for: req.body.for || "general",
        title: req.body.title || "",
        coverImage: req.file.buffer,
      });
      await newImage.save();
      res.json({ image_id });
    } catch (err) {
      console.error("Error uploading image:", err.message);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // Create quiz
  router.post("/quizzes", async (req, res) => {
    try {
      const newQuiz = new models.AM_courses.quizzes(req.body);
      await newQuiz.save();
      res.json({ quiz_id: newQuiz.quiz_id });
    } catch (err) {
      console.error("Error saving quiz:", err.message);
      res.status(500).json({ error: "Failed to save quiz" });
    }
  });

  // Create section
  router.post("/sections", async (req, res) => {
    try {
      const newSection = new models.AM_courses.sections(req.body);
      await newSection.save();
      res.json({ section_id: newSection.section_id });
    } catch (err) {
      console.error("Error saving section:", err.message);
      res.status(500).json({ error: "Failed to save section" });
    }
  });

  // Create module
  router.post("/modules", async (req, res) => {
    try {
      const newModule = new models.AM_courses.modules(req.body);
      await newModule.save();
      res.json({ module_id: newModule.module_id });
    } catch (err) {
      console.error("Error saving module:", err.message);
      res.status(500).json({ error: "Failed to save module" });
    }
  });

  // Create course (with language choice)
  router.post("/:db/courses", async (req, res) => {
    const { db } = req.params;
    if (!models[db]) {
      return res.status(400).json({ error: `Unknown DB: ${db}` });
    }
    try {
      const newCourse = new models[db].courses(req.body);
      await newCourse.save();
      res.json({ course_id: newCourse.course_id });
    } catch (err) {
      console.error("Error saving course:", err.message);
      res.status(500).json({ error: "Failed to save course" });
    }
  });

  // ✅ GeoIP & VPN detection
  router.get("/get-location", async (req, res) => {
    try {
      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress;
      
      console.log("Client IP detected:", ip);  

      const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
      const geoData = await geoRes.json();

      const vpnRes = await fetch(`http://ip-api.com/json/${ip}?fields=proxy`);
      const vpnData = await vpnRes.json();

      const location = {
        ip,
        country: geoData.country_name,
        city: geoData.city,
        region: geoData.region,
        isVpn: geoData.security?.vpn || vpnData.proxy || false,
      };

      res.json(location);
    } catch (err) {
      console.error("GeoIP/VPN detection error:", err.message);
      res.status(500).json({ error: "Failed to get location data" });
    }
  });

  return router;
}
