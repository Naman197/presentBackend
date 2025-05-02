// const { spawn } = require('child_process');
// const path = require('path');
// const fs = require('fs');

// exports.runPostureAnalysis = async (req, res) => {
//   try {
//     const inputPath = path.join(__dirname, '../uploads/', req.body.inputVideo);
//     const outputPath = path.join(__dirname, '../outputs/', 'analyzed_' + req.body.inputVideo);

//     // Make sure file exists
//     if (!fs.existsSync(inputPath)) {
//       return res.status(404).json({ error: 'Input video not found' });
//     }

//     const pythonProcess = spawn('python3', [
//       path.join(__dirname, '../python/posture_analysis.py'),
//       inputPath,
//       outputPath
//     ]);

//     pythonProcess.stdout.on('data', (data) => {
//       console.log(`Python Output: ${data}`);
//     });

//     pythonProcess.stderr.on('data', (data) => {
//       console.error(`Python Error: ${data}`);
//     });

//     pythonProcess.on('close', (code) => {
//       if (code === 0) {
//         return res.status(200).json({
//           message: 'Posture analysis completed.',
//           outputVideo: 'analyzed_' + req.body.inputVideo
//         });
//       } else {
//         return res.status(500).json({ error: 'Python script failed.' });
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal server error.' });
//   }
// // };
// const { spawn } = require('child_process');
// const path = require('path');

// exports.analyzePosture = (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
//   const scriptPath = path.join(__dirname, '..', '../pre_backend/python/');

//   const python = spawn('python', [scriptPath, filePath]);

//   let output = '';
//   python.stdout.on('data', (data) => {
//     output += data.toString();
//   });

//   python.stderr.on('data', (data) => {
//     console.error('Python stderr:', data.toString());
//   });

//   python.on('close', (code) => {
//     if (code === 0) {
//       try {
//         const result = JSON.parse(output);
//         res.json(result);
//       } catch (err) {
//         res.status(500).json({ error: 'Invalid JSON from Python script' });
//       }
//     } else {
//       res.status(500).json({ error: 'Python script exited with error' });
//     }
//   });
// };const { spawn } = require('child_process');
// const { spawn } = require('child_process');
// const path = require('path');
// const fs = require('fs');

// exports.analyzePosture = (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
//   console.log('File path:', filePath);

//   const scriptPath = path.join(__dirname, '..', '..', 'python', 'posture_analysis.py');
//   console.log('Python script path:', scriptPath);

//   const pythonPath = path.join(__dirname, '..', '..', 'venv', 'Scripts', 'python.exe');
//   console.log('Python executable path:', pythonPath);

//   // Check if Python executable exists
//   fs.access(pythonPath, fs.constants.F_OK, (err) => {
//     if (err) {
//       console.error('Python executable not found at path:', pythonPath);
//       return res.status(500).json({ error: `Python executable not found at path: ${pythonPath}` });
//     } else {
//       console.log('Python executable exists at path:', pythonPath);
//     }
//   });

//   // Check if Python script exists
//   fs.access(scriptPath, fs.constants.F_OK, (err) => {
//     if (err) {
//       console.error('Python script not found at path:', scriptPath);
//       return res.status(500).json({ error: `Python script not found at path: ${scriptPath}` });
//     } else {
//       console.log('Python script exists at path:', scriptPath);
//     }
//   });

//   // Spawn the Python process
//   const python = spawn(pythonPath, [scriptPath, filePath]);

//   let output = '';
//   python.stdout.on('data', (data) => {
//     output += data.toString();
//     console.log('Python script output:', output);
//   });

//   python.stderr.on('data', (data) => {
//     console.error('Python stderr:', data.toString());
//   });

//   python.on('error', (err) => {
//     console.error('Error spawning Python process:', err);
//     res.status(500).json({ error: 'Error spawning Python process', details: err });
//   });

//   python.on('close', (code) => {
//     console.log('Python process closed with code:', code);
//     if (code === 0) {
//       try {
//         const result = JSON.parse(output);
//         console.log('Result from Python script:', result);
//         res.json(result);
//       } catch (err) {
//         console.error('Invalid JSON from Python script:', err);
//         res.status(500).json({ error: 'Invalid JSON from Python script' });
//       }
//     } else {
//       console.error('Python script exited with error code:', code);
//       res.status(500).json({ error: 'Python script exited with error', code });
//     }
//   });
// };



// const { spawn } = require('child_process');
// const path = require('path');
// const fs = require('fs');

// exports.analyzePosture = (req, res) => {
//   // Check if file was uploaded
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   // Define paths
//   const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
//   const scriptPath = path.join(__dirname, '..', 'python', 'posture_analysis.py');
//   const pythonPath = path.join(__dirname, '..', 'venv', 'Scripts', 'python.exe');

//   console.log('\n===== DEBUG START =====');
//   console.log('File path:', filePath);
//   console.log('Python script path:', scriptPath);
//   console.log('Python executable path:', pythonPath);

//   // Ensure Python executable and script exist
//   if (!fs.existsSync(pythonPath)) {
//     console.error('Python executable not found.');
//     return res.status(500).json({ error: 'Python executable not found' });
//   }

//   if (!fs.existsSync(scriptPath)) {
//     console.error('Python script not found.');
//     return res.status(500).json({ error: 'Python script not found' });
//   }

//   // Run the Python script
//   const python = spawn(pythonPath, [scriptPath, filePath]);

//   let output = '';
//   let errorOutput = '';

//   python.stdout.on('data', (data) => {
//     output += data.toString();
//   });

//   python.stderr.on('data', (data) => {
//     errorOutput += data.toString();
//   });

//   python.on('error', (err) => {
//     console.error('Failed to start Python process:', err);
//     return res.status(500).json({ error: 'Failed to start Python process', details: err.message });
//   });

//   python.on('close', (code) => {
//     console.log('Python process exited with code:', code);

//     if (errorOutput) {
//       console.error('Python stderr:', errorOutput);
//     }

//     if (code !== 0) {
//       return res.status(500).json({ error: 'Python script failed', code, stderr: errorOutput });
//     }

//     try {
//       const result = JSON.parse(output);
//       console.log('Final result:', result);
//       return res.json(result);
//     } catch (err) {
//       console.error('Error parsing JSON output from Python:', err);
//       return res.status(500).json({ error: 'Invalid JSON output from Python script' });
//     }
//   });
// };


const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

exports.analyzePosture = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
  const scriptPath = path.join(__dirname, '..', 'python', 'posture_analysis.py');

  // Use a flexible Python path: works for both Windows and Unix
  const pythonPath = process.platform === 'win32'
    ? path.join(__dirname, '..', 'venv', 'Scripts', 'python.exe')
    : path.join(__dirname, '..', 'venv', 'bin', 'python');

  console.log('\n===== DEBUG START =====');
  console.log('File path:', filePath);
  console.log('Python script path:', scriptPath);
  console.log('Python executable path:', pythonPath);

  // Verify paths
  if (!fs.existsSync(pythonPath)) {
    console.error('Python executable not found.');
    return res.status(500).json({ error: 'Python executable not found' });
  }

  if (!fs.existsSync(scriptPath)) {
    console.error('Python script not found.');
    return res.status(500).json({ error: 'Python script not found' });
  }

  // ✅ Use `-i` flag for input argument
  const python = spawn(pythonPath, [scriptPath, '-i', filePath]);

  let output = '';
  let errorOutput = '';

  python.stdout.on('data', (data) => {
    output += data.toString();
  });

  python.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  python.on('error', (err) => {
    console.error('Failed to start Python process:', err);
    return res.status(500).json({
      error: 'Failed to start Python process',
      details: err.message,
    });
  });

  python.on('close', (code) => {
    console.log('Python process exited with code:', code);

    if (errorOutput) {
      console.error('Python stderr:', errorOutput);
    }

    if (code !== 0) {
      return res.status(500).json({
        error: 'Python script execution failed',
        code,
        stderr: errorOutput,
      });
    }

    try {
      const result = JSON.parse(output);
      console.log('Final result:', result);
      return res.json(result);
    } catch (err) {
      console.error('Error parsing JSON output:', err);
      console.error('Raw output:', output);
      return res.status(500).json({
        error: 'Invalid JSON output from Python script',
        details: err.message,
      });
    }
  });
};
