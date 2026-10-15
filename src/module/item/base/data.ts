import { RuleElementData } from "../../system/ruleElement/data.ts";

export class ItemHexData<Schema extends ItemHexSchema> extends foundry.abstract.TypeDataModel<Schema, Item> {
    static override defineSchema(): ItemHexSchema {
        return defineItemSchema();
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
