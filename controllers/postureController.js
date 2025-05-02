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




//very important code
// const { spawn } = require('child_process');
// const path = require('path');
// const fs = require('fs');

// exports.analyzePosture = (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
//   const scriptPath = path.join(__dirname, '..', 'python', 'posture_analysis.py');

//   // Use a flexible Python path: works for both Windows and Unix
//   const pythonPath = process.platform === 'win32'
//     ? path.join(__dirname, '..', 'venv', 'Scripts', 'python.exe')
//     : path.join(__dirname, '..', 'venv', 'bin', 'python');

//   console.log('\n===== DEBUG START =====');
//   console.log('File path:', filePath);
//   console.log('Python script path:', scriptPath);
//   console.log('Python executable path:', pythonPath);

//   // Verify paths
//   if (!fs.existsSync(pythonPath)) {
//     console.error('Python executable not found.');
//     return res.status(500).json({ error: 'Python executable not found' });
//   }

//   if (!fs.existsSync(scriptPath)) {
//     console.error('Python script not found.');
//     return res.status(500).json({ error: 'Python script not found' });
//   }

//   // ✅ Use `-i` flag for input argument
//   const python = spawn(pythonPath, [scriptPath, '-i', filePath]);

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
//     return res.status(500).json({
//       error: 'Failed to start Python process',
//       details: err.message,
//     });
//   });

//   python.on('close', (code) => {
//     console.log('Python process exited with code:', code);

//     if (errorOutput) {
//       console.error('Python stderr:', errorOutput);
//     }

//     if (code !== 0) {
//       return res.status(500).json({
//         error: 'Python script execution failed',
//         code,
//         stderr: errorOutput,
//       });
//     }

//     try {
//       const result = JSON.parse(output);
//       console.log('Final result:', result);
//       return res.json(result);
//     } catch (err) {
//       console.error('Error parsing JSON output:', err);
//       console.error('Raw output:', output);
//       return res.status(500).json({
//         error: 'Invalid JSON output from Python script',
//         details: err.message,
//       });
//     }
//   });
// };




//very very imp

// const { spawn } = require('child_process');
// const path = require('path');
// const fs = require('fs');
// const axios = require('axios');
// const FormData = require('form-data');
// const os = require('os');

// exports.analyzePosture = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
//   const scriptPath = path.join(__dirname, '..', 'python', 'posture_analysis.py');

//   const pythonPath = process.platform === 'win32'
//     ? path.join(__dirname, '..', 'venv', 'Scripts', 'python.exe')
//     : path.join(__dirname, '..', 'venv', 'bin', 'python');

//   console.log('\n===== DEBUG START =====');
//   console.log('Uploaded file path:', filePath);
//   console.log('Python script path:', scriptPath);
//   console.log('Python executable:', pythonPath);
//   console.log('========================\n');

//   if (!fs.existsSync(pythonPath)) {
//     return res.status(500).json({ error: 'Python executable not found' });
//   }

//   if (!fs.existsSync(scriptPath)) {
//     return res.status(500).json({ error: 'Python script not found' });
//   }

//   // Check if the uploaded file exists and is readable
//   try {
//     fs.accessSync(filePath, fs.constants.R_OK);
//   } catch (err) {
//     return res.status(500).json({
//       error: 'Uploaded file is not accessible or readable',
//       details: err.message,
//     });
//   }

//   // Ensure we have permission to write to the temp directory
//   const tempDir = os.tmpdir(); // system temp directory
//   const csvFileName = `posture_analysis_${Date.now()}.csv`;
//   const csvPath = path.join(tempDir, csvFileName);

//   try {
//     fs.accessSync(tempDir, fs.constants.W_OK);
//     console.log('Write access to temp directory verified');
//   } catch (err) {
//     return res.status(500).json({
//       error: 'No write access to temp directory',
//       details: err.message,
//     });
//   }

//   // Run the Python script and pass the output path
//   const python = spawn(pythonPath, [scriptPath, '-i', filePath, '-o', csvPath]);

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
//     return res.status(500).json({
//       error: 'Failed to start Python process',
//       details: err.message,
//     });
//   });

//   python.on('close', async (code) => {
//     console.log('Python process exited with code:', code);

//     if (errorOutput) {
//       console.error('Python stderr:', errorOutput);
//     }

//     if (code !== 0 || !fs.existsSync(csvPath)) {
//       return res.status(500).json({
//         error: 'Python script execution failed or CSV not created',
//         code,
//         stderr: errorOutput,
//       });
//     }

//     console.log('CSV file created at:', csvPath);

//     try {
//       // Upload the CSV to the external API
//       const form = new FormData();
//       form.append('csvFile', fs.createReadStream(csvPath));

//       console.log('Uploading CSV to external API...');
//       const apiResponse = await axios.post('https://csvdecoder.onrender.com/api/csvupload', form, {
//         headers: form.getHeaders(),
//         maxBodyLength: Infinity, // to handle large files
//       });

//       // Clean up temp CSV file
//       fs.unlink(csvPath, (err) => {
//         if (err) console.warn('Could not delete temp CSV:', csvPath);
//         else console.log('Deleted temp CSV file:', csvPath);
//       });
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.error('Failed to delete uploaded video:', err);
//         } else {
//           console.log('Uploaded video deleted successfully');
//         }
//       });


//       // Return the API response from the external service
//       return res.json(apiResponse.data);
//     } catch (err) {
//       console.error('Failed to send CSV to external API:', err.message);
//       return res.status(500).json({
//         error: 'Failed to send CSV to external API',
//         details: err.message,
//       });
//     }
//   });
// };



const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const os = require('os');

exports.analyzePosture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
  const scriptPath = path.join(__dirname, '..', 'python', 'posture_analysis.py');

  // Use system Python (no virtualenv in deployment)
  const pythonPath = 'python3'; // Use the system's default Python interpreter

  console.log('\n===== DEBUG START =====');
  console.log('Uploaded file path:', filePath);
  console.log('Python script path:', scriptPath);
  console.log('Python executable:', pythonPath);
  console.log('========================\n');

  // Check if Python is installed
  try {
    spawnSync(pythonPath, ['--version']); // Check if Python is available
  } catch (err) {
    return res.status(500).json({ error: 'Python not installed on the server' });
  }

  if (!fs.existsSync(scriptPath)) {
    return res.status(500).json({ error: 'Python script not found' });
  }

  // Check if the uploaded file exists and is readable
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
  } catch (err) {
    return res.status(500).json({
      error: 'Uploaded file is not accessible or readable',
      details: err.message,
    });
  }

  // Ensure we have permission to write to the temp directory
  const tempDir = os.tmpdir(); // system temp directory
  const csvFileName = `posture_analysis_${Date.now()}.csv`;
  const csvPath = path.join(tempDir, csvFileName);

  try {
    fs.accessSync(tempDir, fs.constants.W_OK);
    console.log('Write access to temp directory verified');
  } catch (err) {
    return res.status(500).json({
      error: 'No write access to temp directory',
      details: err.message,
    });
  }

  // Run the Python script and pass the output path
  const python = spawn(pythonPath, [scriptPath, '-i', filePath, '-o', csvPath]);

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

  python.on('close', async (code) => {
    console.log('Python process exited with code:', code);

    if (errorOutput) {
      console.error('Python stderr:', errorOutput);
    }

    if (code !== 0 || !fs.existsSync(csvPath)) {
      return res.status(500).json({
        error: 'Python script execution failed or CSV not created',
        code,
        stderr: errorOutput,
      });
    }

    console.log('CSV file created at:', csvPath);

    try {
      // Upload the CSV to the external API
      const form = new FormData();
      form.append('csvFile', fs.createReadStream(csvPath));

      console.log('Uploading CSV to external API...');
      const apiResponse = await axios.post('https://csvdecoder.onrender.com/api/csvupload', form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity, // to handle large files
      });

      // Clean up temp CSV file
      fs.unlink(csvPath, (err) => {
        if (err) console.warn('Could not delete temp CSV:', csvPath);
        else console.log('Deleted temp CSV file:', csvPath);
      });
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Failed to delete uploaded video:', err);
        } else {
          console.log('Uploaded video deleted successfully');
        }
      });

      // Return the API response from the external service
      return res.json(apiResponse.data);
    } catch (err) {
      console.error('Failed to send CSV to external API:', err.message);
      return res.status(500).json({
        error: 'Failed to send CSV to external API',
        details: err.message,
      });
    }
  });
};
