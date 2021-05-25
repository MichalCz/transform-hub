#!/usr/bin/env node

import { createServer } from "@scramjet/api-server";
import { Host } from "../lib/host";

import { SocketServer } from "../lib/socket-server";

const apiServerConfig = {};
const apiServer = createServer(apiServerConfig);
const tcpServer = new SocketServer("/tmp/socket-server-path");
//
const host = new Host(apiServer, tcpServer);

(async () => {
    await host.main();
})().catch(e => {
    console.error(e.stack);
    process.exitCode = e.exitCode || 1;
    process.exit();
});
