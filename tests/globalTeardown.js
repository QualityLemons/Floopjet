/**
 * Jest global teardown — stops the HTTP server that globalSetup started.
 * If globalSetup reused an already-running server (global.__HTTP_SERVER__ === null),
 * this is a no-op so we don't kill a server that belongs to another process.
 */
module.exports = async function globalTeardown() {
    const server = global.__HTTP_SERVER__;
    if (!server) return;

    server.kill('SIGTERM');

    await new Promise((resolve) => {
        const timer = setTimeout(() => {
            try { server.kill('SIGKILL'); } catch (_) {}
            resolve();
        }, 3000);

        server.on('close', () => {
            clearTimeout(timer);
            resolve();
        });
    });
};
