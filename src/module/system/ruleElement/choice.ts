import { RuleElement } from "./base.ts";

export class ChoiceRuleElement extends RuleElement {
    onPrepareDerivedData() {
        if (this.data.phase !== "derived") return;
        if (!this.actor) return;

      //  const choice = this.item.getFlag("hexaga", `choice.${this.data.slug}`) ?? undefined;
    }
}
