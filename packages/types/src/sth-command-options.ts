import { LogLevel } from "./object-logger";

export type STHCommandOptions = {
    logLevel: LogLevel;
    colors: boolean,
    port: number;
    hostname: string;
    identifyExisting: boolean;
    config?: string;
    cpmUrl?: string;
    cpmId?: string;
    cpmSslCaPath?: string;
    cpmMaxReconnections: number,
    cpmReconnectionDelay: number,
    id?: string;
    runtimeAdapter: string;
    runnerImage: string;
    runnerPyImage: string;
    runnerMaxMem: number;
    safeOperationLimit: number;
    prerunnerImage: string;
    prerunnerMaxMem: number;
    exposeHostIp: string;
    instancesServerPort: string;
    sequencesRoot: string;
    k8sNamespace: string;
    k8sAuthConfigPath: string;
    k8sSthPodHost: string;
    k8sRunnerImage: string,
    k8sRunnerPyImage: string
    k8sSequencesRoot: string;
    docker: boolean;
    k8sRunnerCleanupTimeout: string,
    k8sRunnerResourcesRequestsCpu: string;
    k8sRunnerResourcesRequestsMemory: string;
    k8sRunnerResourcesLimitsCpu: string;
    k8sRunnerResourcesLimitsMemory: string;
    startupConfig: string;
    exitWithLastInstance: boolean;
    instanceLifetimeExtensionDelay: number;
}
