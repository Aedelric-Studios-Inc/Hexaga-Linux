import { ItemHex } from "../../item/base/base.ts";
import { Modifier } from "../modifier.ts";
import { Predicate } from "../predicate/predicate.ts";
import { RuleElementData } from "./data.ts";
import { FlatModifierConfig } from "./flatModifier.ts";

export abstract class RuleElement<TConfig extends RuleElementConfig = RuleElementConfig> {
    constructor(
        public item: ItemHex,
        public data: RuleElementData & { config: TConfig },
    ) {}

    get actor() {
        return this.item.actor;
    }

    abstract onPrepareDerivedData(): void;

    generateSynthetics(modifier: Modifier): void {
        if (!this.actor) return;
        if (!this.testPredicate()) return;

        for (const domain of this.data.domains) {
            if (!domain) continue;

            this.actor.synthetics.modifiers[domain] ??= [];
            this.actor.synthetics.modifiers[domain].push(modifier);
        }
    }

    testPredicate(): boolean {
        if (!this.actor) return false;

        const rollOptions = this.actor.getRollOptions();
        console.log(rollOptions);

        return Predicate.test(this.data.predicate, rollOptions);
    }
}

type RuleElementConfig = FlatModifierConfig;
