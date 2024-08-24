import { beginCell } from "@ton/core";

export * from "./moduleA";

export function swap(): string {
    return beginCell().storeBit(1).storeCoins(10).endCell().toString();
}