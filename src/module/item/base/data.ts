import { RuleElementData } from "../../system/ruleElement/data.ts";

export class ItemHexData<Schema extends ItemHexSchema> extends foundry.abstract.TypeDataModel<Schema, Item> {
    static override defineSchema(): ItemHexSchema {
        return defineItemSchema();
    }

    getRollOptions(prefix = this.parent.type): string[] {
        const rollOptions = [`${prefix}:id:${this.parent.id}`, `${prefix}:${this.slug}`];

        return rollOptions;
    }
}

const defineItemSchema = () => {
    return {
        description: new fields.HTMLField(),
        rules: new fields.ArrayField(new fields.EmbeddedDataField(RuleElementData), { required: true, initial: [] }),
        slug: new fields.StringField({ required: true, nullable: false, initial: "" }),
    };
};

export type ItemHexSchema = ReturnType<typeof defineItemSchema>;
export { defineItemSchema };
