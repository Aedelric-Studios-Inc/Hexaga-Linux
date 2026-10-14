import { ActorHex } from "./baseActor.ts";

export class ActorHexData<Schema extends ActorHexSchema> extends foundry.abstract.TypeDataModel<Schema, ActorHex> {
    static override defineSchema(): ActorHexSchema {
        return defineActorSchema();
    }
}

const defineAttributeSchema = () => {
    return {
        rank: new fields.NumberField({ required: true, nullable: false, initial: 0, persistent: false }),
        label: new fields.StringField({ required: true }),
        group: new fields.StringField({ required: true }),
        mod: new fields.NumberField({ required: true, initial: 0, nullable: false, persistent: false }),
        breakdown: new fields.ArrayField(new fields.StringField(), {
            required: true,
            initial: [],
            nullable: false,
            persistent: false,
        }),
        total: new fields.NumberField({ required: true, initial: 0, nullable: false, persistent: false }),
    };
};

const defineSkillSchema = () => {
    return {
        rank: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
        mod: new fields.NumberField({ required: true, initial: 0, nullable: false, persistent: false }),
        breakdown: new fields.ArrayField(new fields.StringField(), {
            required: true,
            initial: [],
            nullable: false,
            persistent: false,
        }),
    };
};

const defineActorSchema = () => {
    return {
        attributes: new fields.SchemaField({
            physique: new fields.SchemaField(defineAttributeSchema()),
            deftness: new fields.SchemaField(defineAttributeSchema()),
            wit: new fields.SchemaField(defineAttributeSchema()),
            acumen: new fields.SchemaField(defineAttributeSchema()),
            will: new fields.SchemaField(defineAttributeSchema()),
            ego: new fields.SchemaField(defineAttributeSchema()),
        }),
        intrinsic: new fields.SchemaField({
            hp: new fields.SchemaField({
                current: new fields.NumberField({ required: true, nullable: false, initial: 10 }),
            }),
        }),
        skills: new fields.SchemaField({
            brawn: new fields.SchemaField(defineSkillSchema()),
            striking: new fields.SchemaField(defineSkillSchema()),
            menace: new fields.SchemaField(defineSkillSchema()),
            marksmanship: new fields.SchemaField(defineSkillSchema()),
            legerdemain: new fields.SchemaField(defineSkillSchema()),
            stealth: new fields.SchemaField(defineSkillSchema()),
            knowledge: new fields.SchemaField(defineSkillSchema()),
            arcane: new fields.SchemaField(defineSkillSchema()),
            tinker: new fields.SchemaField(defineSkillSchema()),
            sense: new fields.SchemaField(defineSkillSchema()),
            discernment: new fields.SchemaField(defineSkillSchema()),
            nature: new fields.SchemaField(defineSkillSchema()),
            spirituality: new fields.SchemaField(defineSkillSchema()),
            survival: new fields.SchemaField(defineSkillSchema()),
            empathy: new fields.SchemaField(defineSkillSchema()),
            speech: new fields.SchemaField(defineSkillSchema()),
            command: new fields.SchemaField(defineSkillSchema()),
            occult: new fields.SchemaField(defineSkillSchema()),
        }),
    };
};

export type ActorHexSchema = ReturnType<typeof defineActorSchema>;
