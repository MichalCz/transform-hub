import { ReadableApp } from "../wrapper";

export const app: ReadableApp<{ x: number }, [{ test: number }], {start: number}> =
    async function abc(_source, { test }) {
        const start = this.config.start;

        const y = async function* () {
            let i: number = start + test;
            while (i-- > 0) {
                yield { x: i };
            }
        };

        return y;
    };
