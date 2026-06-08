/**
 * Jest global setup — starts the static HTTP server before any test suite runs.
 *
 * Skip conditions (server is not started):
 *   - JEST_SKIP_SERVER=true  is set (used by the test:unit script)
 *   - A server is already listening on port 5000 (dev workflow is up)
 *
 * When the server is started here, the child-process reference is stored in
 * global.__HTTP_SERVER__ so globalTeardown can shut it down afterwards.
 *
 * Python command: tries "python" first, falls back to "python3" automatically.
 */
const { spawn } = require('child_process');
const http = require('http');

const PORT = parseInt(process.env.TEST_SERVER_PORT || '5000', 10);
const READY_TIMEOUT_MS = 10000;
const POLL_INTERVAL_MS = 200;

function isPortOpen(port) {
    return new Promise((resolve) => {
        const req = http.get(`http://127.0.0.1:${port}/index.html`, (res) => {
            res.resume();
            resolve(true);
        });
        req.on('error', () => resolve(false));
        req.setTimeout(500, () => { req.destroy(); resolve(false); });
    });
}

function waitForPort(port, timeoutMs) {
    const deadline = Date.now() + timeoutMs;
    return new Promise((resolve, reject) => {
        function poll() {
            isPortOpen(port).then((open) => {
                if (open) return resolve();
                if (Date.now() >= deadline) {
                    return reject(new Error(
                        `Server did not start on port ${port} within ${timeoutMs}ms`
                    ));
                }
                setTimeout(poll, POLL_INTERVAL_MS);
            });
        }
        poll();
    });
}

function spawnServer(cmd) {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, ['server.py'], {
            cwd: process.cwd(),
            stdio: 'ignore',
            detached: false,
        });
        child.on('error', reject);
        setTimeout(() => resolve(child), 100);
    });
}

async function startServer() {
    for (const cmd of ['python', 'python3']) {
        try {
            const child = await spawnServer(cmd);
            return child;
        } catch (err) {
            if (err.code !== 'ENOENT') throw err;
        }
    }
    throw new Error('Neither "python" nor "python3" was found on PATH. Cannot start server.py.');
}

module.exports = async function globalSetup() {
    if (process.env.JEST_SKIP_SERVER === 'true') {
        global.__HTTP_SERVER__ = null;
        return;
    }

    if (await isPortOpen(PORT)) {
        global.__HTTP_SERVER__ = null;
        return;
    }

    const server = await startServer();
    global.__HTTP_SERVER__ = server;
    await waitForPort(PORT, READY_TIMEOUT_MS);
};
