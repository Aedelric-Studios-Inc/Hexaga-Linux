import { RuleElement } from "../../system/ruleElement/base.ts";

export class ItemHex<SubType extends Item.SubType = Item.SubType> extends Item<SubType> {
    declare runtimeRules: RuleElement[];

    protected override async _preCreate(
        data: Item.CreateData,
        options: Item.Database.PreCreateOptions,
        user: User.Stored,
    ): Promise<boolean | void> {
        const allowed = await super._preCreate(data, options, user);
        if (allowed === false) return false;

        if (!this.system.slug) {
            try {
                const update = { slug: this.name.slugify() };
                await this.system.updateSource(update);
            } catch (error) {
                console.error(error);
            }
        }
    }

    get slug() {
        return this.system.slug;
    }

    override prepareDerivedData(): void {
        super.prepareDerivedData();
        this.runtimeRules = [];
        const savedRules = this.system.rules ?? [];
        for (const rule of savedRules) {
            if (!rule.key) continue;
            this.runtimeRules.push(new CONFIG.hexaga.ruleElements[rule.key](this, rule));
        }
    }
}
