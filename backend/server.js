const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const path = require("path");

const app = express();
const upload = multer();

app.use(cors());

// Resize endpoint
app.post("/resize", upload.single("image"), async (req, res) => {
	try {
		let { width, height } = req.body;
		const format = path.extname(req.file.originalname).substring(1); // keep original extension

		// Helper to convert units to pixels
		function toPixels(value) {
			if (typeof value !== "string") return parseInt(value);
			const match = value.match(/^(\d+)(px|in|cm)?$/);
			if (!match) return parseInt(value);
			let num = parseInt(match[1]);
			let unit = match[2] || "px";
			if (unit === "px") return num;
			if (unit === "in") return Math.round(num * 96); // 1in = 96px
			if (unit === "cm") return Math.round(num * 37.8); // 1cm ≈ 37.8px
			return num;
		}

		const widthPx = toPixels(width);
		const heightPx = toPixels(height);

		const resized = await sharp(req.file.buffer)
			.resize(widthPx, heightPx, { fit: "inside" })
			.toFormat(format)
			.toBuffer();

		const originalName = path.parse(req.file.originalname).name;
		console.log(originalName);
		const resizedName = `${originalName}${widthPx}x${heightPx}.${format}`;
		console.log(resizedName);
		res.set("Content-Disposition", `attachment; filename=${resizedName}`);
		res.set("Content-Type", `image/${format}`);
		res.set("X-Resized-Filename", resizedName);
		res.send(resized);
	} catch (err) {
		console.error("Error processing image:", err);
		res.status(500).json({ error: err.message });
	}
});

const PORT = 5000;
app.listen(PORT, () =>
	console.log(`Backend running on http://localhost:${PORT}`)
);
