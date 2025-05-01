const { spawn } = require("child_process");
const path = require("path");

const runPythonScript = (scriptName, args = []) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "..", "python-scripts", scriptName);
    const pyProcess = spawn("python3", [scriptPath, ...args]);

    let result = "";
    let error = "";

    pyProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pyProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pyProcess.on("close", (code) => {
      if (code !== 0) {
        return reject(`Error: ${error}`);
      }
      try {
        resolve(JSON.parse(result));
      } catch (e) {
        reject(`Failed to parse JSON: ${result}`);
      }
    });
  });
};

const handleUpload = async (req, res) => {
  try {
    const pptFile = req.files?.ppt?.[0];
    const audioFile = req.files?.audio?.[0];
    const videoFile = req.files?.video?.[0];

    if (!pptFile || !audioFile || !videoFile) {
      return res.status(400).json({ error: "All files (ppt, audio, video) are required" });
    }

    const posturePromise = runPythonScript("posture.py", [videoFile.path]);
    const tonePromise = runPythonScript("tone.py", [audioFile.path]);
    const factCheckPromise = runPythonScript("factcheck.py", [pptFile.path, audioFile.path]);

    const [postureResult, toneResult, factCheckResult] = await Promise.all([
      posturePromise,
      tonePromise,
      factCheckPromise,
    ]);

    res.json({
      message: "Analysis completed",
      postureResult,
      toneResult,
      factCheckResult,
    });
  } catch (error) {
    console.error("Error in processing:", error);
    res.status(500).json({ error: "Internal server error", detail: error.toString() });
  }
};

module.exports = { handleUpload };
