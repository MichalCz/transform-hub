import { strict as assert, fail } from "assert";
import { When, Then } from "cucumber";

const lineByLine = require("n-readlines");

When("calculate average delay time from {string} of first {string} function calls starting {string}", async (probesFile, numberOfProbes, startFromProbe) => {
    const output = new lineByLine(`${probesFile}`);

    let line: string;
    let sum: bigint = BigInt(0);

    for (let i = 0; i < startFromProbe; i++) {
        if (!(output.next())) {
            fail("not enough probes in file");
        }
    }

    for (let j = 0; j < numberOfProbes; j++) {
        if (!(line = output.next())) {
            fail("not enough probes in file");
        }
        sum += BigInt(line);
    }

    const average: bigint = sum / BigInt(numberOfProbes);
    const averagbeIsOk: boolean = average < BigInt("100000n");

    assert.equal(averagbeIsOk, true);

    // let line1;
    // let line2;
    // let i = 0;

    // output.next();//skip first line with "Checking data"
    // output.next();//skip second line with "[HostOne][Server] Started at /tmp/2903117"

    // for (i = 0; i < input.length; i++) {
    //     (line2 = output.next())
    //     line1 = input[i].name;
    //     assert.deepEqual(greeting + line1 + suffix, "" + line2);
    // }


});

Then("calculated avereage delay time is lower than {string} ns", async (acceptedDelayInNs) => {
    console.log(acceptedDelayInNs);
    return "pending";
});
