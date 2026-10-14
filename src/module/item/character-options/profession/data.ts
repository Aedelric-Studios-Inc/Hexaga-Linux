import { Override } from "fvtt-types/utils";
import { SKILL_STRINGS } from "../../../actor/foundation.ts";
import { ItemHex } from "../../base/base.ts";
import { ItemHexData } from "../../base/data.ts";

export class ProfessionData extends ItemHexData<ProfessionSchema> {
    static override defineSchema(): ProfessionSchema {
        return defineProfessionSchema();
    }

    override async _preCreate(
        data: foundry.abstract.TypeDataModel.ParentAssignmentType<ProfessionSchema, ItemHex>,
        options: foundry.abstract.types.DatabaseCreateOperation,
        user: Override<User, object>,
    ): Promise<boolean | void> {
        const allowed = await super._preCreate(data, options, user);
        if (allowed === false) return false;

        // Profession can only be placed on a hero actor
        const actor = this.parent.actor;
        console.log(data, options, user);
        if (this.parent.isEmbedded && (!actor || actor.type !== "hero")) {
            ui.notifications.warn("Profession can only be placed on a hero actor.");
            return false;
        }

        // Only one Profession can be on a hero
        if (actor && actor.itemTypes.profession.length >= 1) {
            ui.notifications.warn("Only one Profession can be applied to a hero.");
            return false;
        }
    }
}

const defineProfessionSchema = () => {
    return {
        ...ItemHexData.defineSchema(),
        improvements: new fields.SchemaField({
            skills: new fields.SchemaField({
                choices: new fields.ArrayField(new fields.StringField(), {
                    required: true,
                    nullable: false,
                    initial: [...SKILL_STRINGS],
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

type ProfessionSchema = ReturnType<typeof defineProfessionSchema>;
