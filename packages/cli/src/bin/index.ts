#!/usr/bin/env ts-node
/* eslint-disable no-console */

import findPackage from "find-package-json";
import commander from "commander";
import completionMixin, { Command } from "commander-completion";
import { ClientUtils } from "@scramjet/client-utils";

import { errorHandler } from "../lib/errorHandler";
import { commands } from "../lib/commands/index";
import { setPlatformDefaults } from "../lib/platform";
import { initConfig, profileConfig, profileManager } from "../lib/config";
import { initPaths } from "../lib/paths";
import chalk from "chalk";
import { isProductionEnv } from "../types";

const version = findPackage(__dirname).next().value?.version || "unknown";
const CommandClass = completionMixin(commander).Command;

const program = new CommandClass() as Command;

const initPlatform = async () => {
    const { token, env, middlewareApiUrl } = profileConfig.getConfig();

    /**
     * Set the default values for platform only when all required settings
     * are provided in the profile configuration.
     * Do not set the default platform values when displaying the help commands.
     */
    if (token && isProductionEnv(env) && middlewareApiUrl &&
        !process.argv.includes((program as any)._helpShortFlag) &&
        !process.argv.includes((program as any)._helpLongFlag)) {
        ClientUtils.setDefaultHeaders({
            Authorization: `Bearer ${token}`
        });

        await setPlatformDefaults();
    }
};

/**
 * Start commander using defined config {@link Apple.seeds}
 */
(async () => {
    initPaths();
    initConfig();
    await initPlatform();

    for (const command of Object.values(commands)) command(program);

    program
        .description(
            "This is a Scramjet Command Line Interface to communicate with Transform Hub and Cloud Platform.")
        .version(`CLI version: ${version}`, "-v, --version", "Display current CLI version")
        .option("--config <name>", "Set global configuration profile")
        .option("--config-path <path>", "Set global configuration from file")
        .addHelpCommand(false)
        .addHelpText("beforeAll", `Current profile: ${profileManager.getProfileName()}`)
        .addHelpText(
            "afterAll",
            chalk.greenBright("\nTo find out more about CLI, please check out our docs at https://hub.scramjet.org/docs/cli\n"))
        .addHelpText(
            "afterAll",
            `${chalk.hex("#7ed2e4")("Read more about Scramjet at https://scramjet.org/ 🚀\n")}`)
        .parse(process.argv);

    await new Promise((res) => program.hook("postAction", res));
})().catch(errorHandler);

process.on("uncaughtException", errorHandler);
process.on("unhandledRejection", errorHandler);
