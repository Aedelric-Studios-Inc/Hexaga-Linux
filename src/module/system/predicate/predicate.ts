import { PredicatePart } from "./types.ts";

export class Predicate {
    static test(parts: PredicatePart[] | undefined, rollOptions: string[]): boolean {
        if (parts === undefined || parts.length === 0) return true;
        return parts.every((part) => this.evaluatePart(part, rollOptions));
    }

    private static evaluatePart(part: PredicatePart, rollOptions: string[]): boolean {
        if (typeof part === "string") {
            return rollOptions.includes(part);
        }

        if (typeof part === "object" && part !== null) {
            const keys = Object.keys(part);
            if (keys.length !== 1) return false;

            const op = keys[0];
            const data = (part as PredicatePart)[op];

            switch (op) {
                case "and": {
                    return Array.isArray(data) && data.every((d) => this.evaluatePart(d, rollOptions));
                }
                case "or": {
                    return Array.isArray(data) && data.some((d) => this.evaluatePart(d, rollOptions));
                }
                case "not": {
                    return Array.isArray(data) && data.every((d) => !this.evaluatePart(d, rollOptions));
                }
                case "gt": {
                    if (!Array.isArray(data) || data.length !== 2) return false;
                    const [key, val] = data;
                    return this.evaluateInequality([key, val], rollOptions, (a, b) => a > b);
                }
                case "gte": {
                    if (!Array.isArray(data) || data.length !== 2) return false;
                    const [key, val] = data;
                    return this.evaluateInequality([key, val], rollOptions, (a, b) => a >= b);
                }
                case "lt": {
                    if (!Array.isArray(data) || data.length !== 2) return false;
                    const [key, val] = data;
                    return this.evaluateInequality([key, val], rollOptions, (a, b) => a < b);
                }
                case "lte": {
                    if (!Array.isArray(data) || data.length !== 2) return false;
                    const [key, val] = data;
                    return this.evaluateInequality([key, val], rollOptions, (a, b) => a <= b);
                }

                default:
                    false;
            }
        }

        return false;
    }

    private static evaluateInequality(
        data: [string, number],
        rollOptions: string[],
        comparison: (a: number, b: number) => boolean,
    ): boolean {
        if (!Array.isArray(data) || data.length !== 2) return false;
        const [path, value] = data;
        const prefix = `${path}`;
        const option = rollOptions.find((o) => o.startsWith(prefix));
        if (!option) return false;

        const a = Number(option.split(":").pop());
        if (isNaN(a)) return false;

        return comparison(a, value);
    }
}
