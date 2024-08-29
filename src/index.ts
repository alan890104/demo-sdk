import { beginCell } from "@ton/core";
import Decimal from "decimal.js";
export * from "./moduleA";

export function swap(): string {
    console.log(new Decimal("1").add(1).toString());
    return beginCell().storeBit(1).storeCoins(10).endCell().toString();
}