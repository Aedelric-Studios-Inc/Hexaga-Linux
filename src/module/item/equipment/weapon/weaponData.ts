import { ItemHexData } from "../../base/data.ts";

export class WeaponData extends ItemHexData<WeaponDataSchema> {
    static override defineSchema(): WeaponDataSchema {
        return defineWeaponSchema();
    }

    override getRollOptions(prefix = this.parent.type) {
        const rollOptions = super.getRollOptions(prefix);

        const totalDmp = this.damagePool.reduce((total, current) => {
            return (total += current.base);
        }, 0);

        rollOptions.push(...this.damagePool.map((d) => `${prefix}:damage:${d.damageType}`));

        rollOptions.push(
            ...Object.entries({
                [`equipped`]: this.equipped,
                [`equipped:id:${this.parent.id}`]: this.equipped,
                [`total-dmp:${totalDmp}`]: true,
            })
                .filter(([_key, entry]) => entry === true)
                .map(([_key, entry]) => `${prefix}:${entry}`),
        );
        return rollOptions;
    }
}

const defineWeaponSchema = () => {
    return {
        ...ItemHexData.defineSchema(),
        attackType: new fields.StringField({
            required: true,
            nullable: false,
            initial: "melee",
            options: ["ranged", "melee", "magical"],
        }),
        damagePool: new fields.ArrayField(
            new fields.SchemaField({
                base: new fields.NumberField({ required: true, nullable: false, initial: 1 }),
                damageType: new fields.StringField({
                    required: true,
                    nullable: false,
                    initial: "bludgeoning",
                    choices: CONFIG.hexaga.damageTypes,
                }),
            }),
            { required: true, nullable: false, initial: [{ base: 1, damageType: "bludgeoning" }] },
        ),
        attackSkill: new fields.StringField({
            required: true,
            nullable: false,
            initial: "striking",
            choices: CONFIG.hexaga.attackSkills,
        }),
        equipped: new fields.BooleanField({ required: true, nullable: false, initial: false }),
    };
};

type WeaponDataSchema = ReturnType<typeof defineWeaponSchema>;
