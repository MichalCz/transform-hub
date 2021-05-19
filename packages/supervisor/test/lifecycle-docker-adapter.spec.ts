/* eslint-disable no-extra-parens */
/* eslint-disable dot-notation */
import * as imageConfig from "@scramjet/csi-config";
import { DelayedStream } from "@scramjet/model";
import { DockerodeDockerHelper, LifecycleDockerAdapter } from "@scramjet/adapters";
import { RunnerConfig } from "@scramjet/types";
import test from "ava";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as sinon from "sinon";
import { PassThrough } from "stream";

const sandbox = sinon.createSandbox();
const configFileContents = {
    runner: "runner-example-image",
    prerunner: "pre-runner-example-image"
};

sinon.stub(fsPromises, "chmod").resolves();
sinon.stub(fs, "createWriteStream");

const createReadStreamStub = sinon.stub(fs, "createReadStream");
const mkdtempStub = sinon.stub(fsPromises, "mkdtemp").resolves();
const configStub = sinon.stub(imageConfig, "imageConfig").returns(Promise.resolve(configFileContents));
const dockerHelperMock = {
    createVolume: sinon.stub(DockerodeDockerHelper.prototype, "createVolume"),
    run: sinon.stub(DockerodeDockerHelper.prototype, "run"),
    wait: sinon.stub(DockerodeDockerHelper.prototype, "wait"),
};

sinon.stub(DelayedStream.prototype, "run");

test.beforeEach(() => {
    sandbox.reset();
});

test("Constructor should create instance.", async (t: any) => {
    const lcda = new LifecycleDockerAdapter();

    t.not(lcda, null);
});

test("Init should call imageConfig and set results locally.", async (t) => {
    configStub.resolves(configFileContents);

    const lcda = new LifecycleDockerAdapter();

    await lcda.init();


    t.deepEqual(lcda["imageConfig"], configFileContents);
});

test("Init should reject on read file error.", async (t) => {
    configStub.rejects(new Error("ENOENT: File not found"));

    const lcda = new LifecycleDockerAdapter();

    await t.throwsAsync(lcda.init());
});

test("CreateFifoStreams should create monitor, control logger, input and output streams.", async (t) => {
    configStub.resolves();

    const lcda = new LifecycleDockerAdapter();

    lcda["monitorFifoPath"] = "mfp";
    lcda["controlFifoPath"] = "cfp";
    lcda["loggerFifoPath"] = "lfp";

    const lcdaCreateFifo: sinon.SinonStub<any> =
        lcda["createFifo"] =
        sandbox.stub().resolves();

    mkdtempStub.resolves("uniqDir");
    const xxx = Math.random().toString().substr(1);

    await lcda["createFifoStreams"](
        `testMonitor${xxx}.fifo`,
        `testControl${xxx}.fifo`,
        `testLogger${xxx}.fifo`,
        `testInput${xxx}.fifo`,
        `testOutput${xxx}.fifo`
    );

    t.is(lcdaCreateFifo.callCount, 5);
    t.is(lcdaCreateFifo.getCall(0).args[0], "uniqDir");
    t.is(lcdaCreateFifo.getCall(0).args[1], `testMonitor${xxx}.fifo`);
    t.is(lcdaCreateFifo.getCall(1).args[0], "uniqDir");
    t.is(lcdaCreateFifo.getCall(1).args[1], `testControl${xxx}.fifo`);
    t.is(lcdaCreateFifo.getCall(2).args[0], "uniqDir"); // err: Cannot read property args of null
    t.is(lcdaCreateFifo.getCall(2).args[1], `testLogger${xxx}.fifo`);
    t.is(lcdaCreateFifo.getCall(3).args[0], "uniqDir");
    t.is(lcdaCreateFifo.getCall(3).args[1], `testInput${xxx}.fifo`);
    t.is(lcdaCreateFifo.getCall(4).args[0], "uniqDir");
    t.is(lcdaCreateFifo.getCall(4).args[1], `testOutput${xxx}.fifo`);
});

test("Run should call createFifoStreams with proper parameters.", async (t) => {
    const config: RunnerConfig = {
        image: "image",
        version: "",
        engines: {
            [""]: ""
        },
        sequencePath: "sequence.js"
    };
    const lcda = new LifecycleDockerAdapter();

    lcda["monitorFifoPath"] = "mfPath";
    lcda["controlFifoPath"] = "cfPath";

    // TODO remove when removed from code
    createReadStreamStub.returns({
        pipe: () => {}
    } as unknown as fs.ReadStream);

    configStub.resolves(configFileContents);

    dockerHelperMock.wait.resolves({
        statusCode: 0
    });

    dockerHelperMock.run.resolves({
        streams: {
            stdin: new PassThrough(),
            stdout: new PassThrough(),
            stderr: new PassThrough()
        },
        containerId: "1",
        wait: sinon.stub().resolves()
    });

    const createFifoStreams = sandbox.stub(lcda as any, "createFifoStreams").resolves();

    await lcda.init();

    lcda["monitorFifoPath"] = "path1";
    lcda["controlFifoPath"] = "path2";
    lcda["loggerFifoPath"] = "path3";
    lcda["inputFifoPath"] = "path4";
    lcda["outputFifoPath"] = "path5";

    await lcda.run(config);

    // ToDo: fixup - Value is not `true`:
    t.true(createFifoStreams.calledOnceWith(
        "control.fifo",
        "monitor.fifo",
        "logger.fifo",
        "input.fifo",
        "output.fifo"));
});

test("Identify should return parsed response from stream.", async (t) => {
    const streams = {
        stdin: new PassThrough(),
        stdout: new PassThrough(),
        stderr: new PassThrough()
    };
    const createdVolumeId = "uniqueVolumeId";
    const preRunnerResponse = {
        engines: { engine1: "diesel" },
        version: "0.3.0",
        main: "example-sequence-path"
    };
    const wait = sandbox.stub().resolves();

    dockerHelperMock.createVolume.resolves(createdVolumeId);
    dockerHelperMock.run.resolves({
        streams,
        containerId: "1",
        wait
    });

    const lcda = new LifecycleDockerAdapter();

    lcda["imageConfig"].runner = configFileContents.runner;

    const res = lcda.identify(streams.stdin);

    streams.stdout.push(JSON.stringify(preRunnerResponse), "utf-8");
    streams.stdout.end();

    const identifyResponse = await res;

    t.is(dockerHelperMock.createVolume.calledOnce, true);

    const expectedResponse = {
        engines: preRunnerResponse.engines,
        version: preRunnerResponse.version,
        packageVolumeId: createdVolumeId,
        image: lcda["imageConfig"].runner,
        sequencePath: preRunnerResponse.main
    };

    t.deepEqual(identifyResponse, expectedResponse);
});
