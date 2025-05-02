const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

exports.sendAudioToFlask = async (req, res) => {
  try {
    const audioFile = req.file;
    if (!audioFile) {
      return res.status(400).json({ error: "No audio file provided." });
    }

    const form = new FormData();
    form.append("file", fs.createReadStream(audioFile.path), {
      filename: audioFile.originalname,
    });

    const response = await axios.post(
      "https://5eba-104-155-207-10.ngrok-free.app/",
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      }
    );

    // Clean up uploaded file after sending
    fs.unlinkSync(audioFile.path);

    return res.json({ result: response.data });
  } catch (error) {
    console.error("Error sending audio to Flask:", error.message);
    return res.status(500).json({ error: "Audio analysis failed." });
  }
};
