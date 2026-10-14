import { Override } from "fvtt-types/utils";
import { ATTRIBUTE_STRINGS } from "../../../actor/foundation.ts";
import { ItemHex } from "../../base/base.ts";
import { ItemHexData } from "../../base/data.ts";

export class HeritageData extends ItemHexData<HeritageSchema> {
    static override defineSchema(): HeritageSchema {
        return defineHeritageSchema();
    }

    override async _preCreate(
        data: foundry.abstract.TypeDataModel.ParentAssignmentType<HeritageSchema, ItemHex>,
        options: foundry.abstract.types.DatabaseCreateOperation,
        user: Override<User, object>,
    ): Promise<boolean | void> {
        const allowed = await super._preCreate(data, options, user);
        if (allowed === false) return false;

        // Heritage can only be placed on a hero actor
        const actor = this.parent.actor;
        console.log(data, options, user);
        if (this.parent.isEmbedded && (!actor || actor.type !== "hero")) {
            ui.notifications.warn("Heritage can only be placed on a hero actor.");
            return false;
        }

        // Only one Heritage can be on a hero
        if (actor && actor.itemTypes.heritage.length >= 1) {
            ui.notifications.warn("Only one Heritage can be applied to a hero.");
            return false;
        }
    }
}

const defineHeritageSchema = () => {
    return {
        ...ItemHexData.defineSchema(),
        improvements: new fields.SchemaField({
            attributes: new fields.SchemaField({
                choices: new fields.ArrayField(new fields.StringField(), {
                    required: true,
                    nullable: false,
                    initial: [...ATTRIBUTE_STRINGS],
                    readonly: true,
                }),
                allowed: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
                selected: new fields.ArrayField(new fields.StringField(), {
                    required: true,
                    initial: [],
                }),
            }),
            aspects: new fields.DocumentUUIDField(),
        }),
    };
};

type HeritageSchema = ReturnType<typeof defineHeritageSchema>;
