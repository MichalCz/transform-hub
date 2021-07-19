import { getLogger } from "@scramjet/logger";
import { EncodedControlMessage, Logger } from "@scramjet/types";
import { DuplexStream } from "@scramjet/api-server";
import * as http from "http";

import * as fs from "fs";
import { EventEmitter, Readable } from "stream";
import { StringStream } from "scramjet";
import { CPMMessageCode } from "../../../symbols/src";
import { STHIDMessageData } from "../../../types/src/messages/sth-id";

type STHInformation = {
    id?: string;
}

export class CPMConnector extends EventEmitter {
    duplex?: DuplexStream;
    logger: Logger = getLogger(this);
    infoFilePath: string;
    info: STHInformation = {};
    connection?: http.ClientRequest;
    isReconnecting: boolean = false;

    constructor() {
        super();
        this.infoFilePath = "/var/lib/sth/sth-id.json";
    }

    async init() {
        try {
            this.info = await new Promise((resolve, reject) => {
                fs.readFile(this.infoFilePath, { encoding: "utf-8" }, (err, data) => {
                    if (err) {
                        reject(err);
                    }

                    try {
                        resolve(JSON.parse(data));
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        } catch (error) {
            if (error.code === "ENOENT") {
                this.logger.info("Info file not exists");
            } else {
                console.log(error);
            }
        }
    }

    connect() {
        console.log("Connecting...");

        this.isReconnecting = false;

        const headers: http.OutgoingHttpHeaders = {
            Expect: "100-continue",
            "Transfer-Encoding": "chunked"
        };

        if (this.info.id) {
            headers["X-STH"] = this.info.id;
        }

        this.connection = http.request(
            {
                port: 7000,
                host: "0.0.0.0",
                method: "POST",
                path: "/connect",
                headers
            },
            async (response) => {
                console.log("Connected.");

                /*
                response.on("data", (a) => {
                    this.logger.log("Received", a.toString());
                });
                */

                this.duplex = new DuplexStream({}, response, this.connection as http.ClientRequest);

                this.connection?.on("close", () => {
                    console.log("Connection to CPM closed");
                });

                this.duplex.pipe(process.stdout);

                StringStream.from(this.duplex as Readable)
                    //.lines()
                    //.JSONParse()
                    .map(async (message: EncodedControlMessage) => {
                        message = JSON.parse(message as unknown as string);
                        this.logger.log("Received message:", message);

                        if (message[0] === CPMMessageCode.STH_ID) {
                            // eslint-disable-next-line no-extra-parens
                            this.info.id = (message[1] as STHIDMessageData).id;
                        }

                        this.logger.log("Received id: ", this.info.id);
                    });

                this.emit("connect", this.duplex);
            }
        );

        this.connection.on("error", () => this.reconnect());
        this.connection.on("close", () => this.reconnect());
    }

    reconnect() {
        if (this.isReconnecting) {
            return;
        }

        this.isReconnecting = true;
        setTimeout(() => { this.connect(); }, 1000);

        console.log("Connection lost, retrying...");
    }
}
