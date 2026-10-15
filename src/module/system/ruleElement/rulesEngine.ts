import { ItemHex } from "../../item/base/base.ts";
import { RuleElement } from "./base.ts";

export class RulesEngine {
    static initialize(item: ItemHex): RuleElement[] {
        const rules: RuleElement[] = [];
        const rulesData = item.system.rules || [];

        for (const ruleData of rulesData) {
            const Constructor = CONFIG.hexaga.ruleElements[ruleData.key];
            if (!Constructor) {
                console.warn(`Invalid Rule Element type ${ruleData.key} on ${item.name}`);
                continue;
            }

            try {
                const ruleInstance = new Constructor(item, ruleData);
                rules.push(ruleInstance);
            } catch (error) {
                console.error(`Unable to create rule element ${ruleData.key} on ${item.name}`, error);
            }
        }
        return rules;
    }
}
