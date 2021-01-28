import {ReadableApp, ReadSequence} from "../wrapper";
import transform from "./lib/transform";

export const app: ReadableApp<{x: number}, [{test: number}], {start: number}> =
    function abc(_source, {test}) {
        const ref = this;

        const sequence: ReadSequence<{x: number}> = [
            function* () {
                let i: number = ref.config.start + test;
                while (i-- > 0) {
                    yield { y: i };
                }
            },
            function* () {
                let prev: { y: number; } | undefined = yield;
                while (prev) {
                    prev = yield { x: prev.y + 199 };
                }
            },
            function* () {
                let prev: { y: number; } | undefined = yield;
                while (prev) {
                    prev = yield { y: prev.y + 199 };
                }
            },
            function* () {
                let prev: { y: number; } | undefined = yield;
                while (prev) {
                    prev = yield { y: prev.y + 199 };
                }
            },
            transform,
            function* () {
                let prev: { z: number; } | undefined = yield;
                while (prev) {
                    prev = yield { x: prev.z + 199 };
                }
            }
        ];
        
        return sequence;
    };
