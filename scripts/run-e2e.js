const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

function waitForServer(url, timeoutMs = 45000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          retry();
        }
      }).on('error', () => {
        retry();
      });
    }

    function retry() {
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Timeout waiting for server at ${url}`));
      } else {
        setTimeout(check, 1000);
      }
    }

    check();
  });
}

async function main() {
  console.log('[Runner] Starting Next.js production server on port 3000...');
  const nextBin = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'bin', 'next');
  const nextProcess = spawn(process.execPath, [nextBin, 'start', '-p', '3000'], {
    cwd: path.join(__dirname, '..'),
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  nextProcess.stdout.on('data', (d) => process.stdout.write(`[Next] ${d}`));
  nextProcess.stderr.on('data', (d) => process.stderr.write(`[Next Err] ${d}`));

  const cleanExit = () => {
    try { nextProcess.kill('SIGKILL'); } catch (e) {}
  };
  process.on('exit', cleanExit);
  process.on('SIGINT', cleanExit);
  process.on('SIGTERM', cleanExit);

  try {
    console.log('[Runner] Waiting for http://localhost:3000/login ...');
    await waitForServer('http://localhost:3000/login');
    console.log('[Runner] Next.js is READY! Now executing tests/e2e/critical-flows.js ...');

    const testProc = spawn(process.execPath, [path.join(__dirname, '..', 'tests', 'e2e', 'critical-flows.js')], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
    });

    testProc.on('exit', (code) => {
      console.log(`[Runner] E2E Tests finished with exit code ${code}`);
      cleanExit();
      process.exit(code || 0);
    });
  } catch (err) {
    console.error('[Runner] Error:', err);
    cleanExit();
    process.exit(1);
  }
}

main();
