import { Modifier } from "../modifier.ts";
import { RuleElement } from "./base.ts";

export class FlatModifier extends RuleElement<FlatModifierConfig> {
    override onPrepareDerivedData(): void {
        if (this.data.phase !== "derived") return;
        if (!this.actor) return;

        const modifier = new Modifier({
            slug: this.data.slug ?? this.item.name.slugify(),
            label: this.data.label ?? this.item.name,
            modifier: this.data.config.value ?? 0,
        });

        this.generateSynthetics(modifier);
    }
}

export type FlatModifierConfig = {
    value: number;
    type?: string;
};
