import { Address, beginCell, Cell } from "@ton/core";
import { Buffer } from "buffer";
/**
 * A simple SDK class for handling basic operations.
 */
export class MySDK {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    /**
     * Greets the user with the provided name.
     * @param addrStr - The address of the user.
     * @returns A greeting message.
     */
    greet(addrStr: string): Cell {
        const addr = Address.parse(addrStr);
        return beginCell().storeAddress(addr).storeStringTail("Hello World").endCell()
    }

    getName(): string {
        return this.name;
    }

    getGreeting(): string {
        return `Hello, ${this.name}!`;
    }

    sendBoc(): Buffer {
        return beginCell().endCell().toBoc()
    }
    /**
     * Calculates the sum of two numbers.
     * @param a - The first number.
     * @param b - The second number.
     * @returns The sum of the two numbers.
     */
    add(a: number, b: number): number {
        return a + b;
    }

    /**
     * Formats the current date as a string.
     * @returns The formatted date string.
     */
    getCurrentDate(): string {
        return new Date().toISOString().split('T')[0];  // Returns date in YYYY-MM-DD format
    }
}
