import { HEXAGACONFIG } from "../../../config/index.ts";
import { HitpointStatistic, ResistanceValueStatistic, SkillStatistic } from "../../system/statistic/statistic.ts";
import { ATTRIBUTE_GROUP_MAPS, ATTRIBUTE_STRINGS, SKILL_STRINGS } from "../foundation.ts";
import { ActorHexData } from "../base/baseActorData.ts";
import { ItemHex } from "../../item/base/base.ts";

export class HeroData extends ActorHexData<HeroSchema> {
    static override defineSchema(): HeroSchema {
        return defineHeroSchema();
    }

    get heritage() {
        return this.parent.itemTypes.heritage[0] ?? null;
    }

    get profession() {
        return this.parent.itemTypes.profession[0] ?? null;
    }

    override prepareBaseData(): void {
        super.prepareBaseData();

        // Prepare Attributes
        this.prepareBaselineStats();
        for (const attribute in this.attributes) {
            const a = attribute as keyof typeof this.attributes;
            this.attributes[a].label = `hexaga.attributes.${attribute}.label`;

            const groupPair = Object.keys(ATTRIBUTE_GROUP_MAPS).find((attrKey) => {
                const groups = Object.keys(
                    ATTRIBUTE_GROUP_MAPS[attrKey as keyof typeof ATTRIBUTE_GROUP_MAPS].attributes,
                );
                return groups.includes(a);
            });
            if (!groupPair) throw new Error(`No matching group found for ${a}`);
            this.attributes[a].group = groupPair;
            this.attributes[a].mod = 0;
            this.attributes[a].total = this.attributes[a].rank;
        }
    }

    override prepareDerivedData(): void {
        super.prepareDerivedData();

        // Clear Memory
        this.parent.skills = {};
        this.parent.rv = {};
        this.parent.intrinsics = {};

        this.options.heritage = this.heritage ?? null;
        this.options.profession = this.profession ?? null;

        // Create Skill Statistics
        const skillsConfig = CONFIG.hexaga?.skills ?? HEXAGACONFIG.skills;
        if (skillsConfig) {
            for (const [skill, _config] of Object.entries(skillsConfig)) {
                this.parent.skills[skill] = new SkillStatistic(this.parent, {
                    slug: skill,
                    rank: this.skills[skill as keyof typeof this.skills].rank,
                });
            }
        }

        this.prepareNumericRollOptions();

        for (const rule of this.parent.rules) {
            rule.onPrepareDerivedData();
        }

        const allDomainModifiers = this.parent.synthetics.modifiers["all"] ?? [];

        // Intrinsics
        //    Speed
        const baseSpeed = 4 + Math.floor(this.attributes.deftness.rank / 2);
        const speedDomainModifiers = this.parent.synthetics.modifiers["speed"] ?? [];
        const speedModifiers = [...allDomainModifiers, ...speedDomainModifiers];
        const speedBonus = speedModifiers.reduce((sum, mod) => {
            return sum + mod.modifier;
        }, 0);

        this.parent.intrinsics.speed = baseSpeed + speedBonus;

        //    Tempo
        const baseTempo = this.attributes.deftness.rank + this.attributes.acumen.rank;
        const tempoDomainModifiers = this.parent.synthetics.modifiers["tempo"] ?? [];
        const tempoModifiers = [...allDomainModifiers, ...tempoDomainModifiers];
        const tempoBonus = tempoModifiers.reduce((sum, mod) => {
            return sum + mod.modifier;
        }, 0);

        this.parent.intrinsics.tempo = Math.max(baseTempo + tempoBonus, 1);

        // Defense
        //     RVs
        this.parent.rv.physical = new ResistanceValueStatistic(this.parent, {
            attributes: ["physique", "deftness"],
            slug: "physical-rv",
        });
        this.parent.rv.mental = new ResistanceValueStatistic(this.parent, {
            attributes: ["wit", "acumen"],
            slug: "mental-rv",
        });
        this.parent.rv.personality = new ResistanceValueStatistic(this.parent, {
            attributes: ["will", "ego"],
            slug: "personality-rv",
        });

        // HP
        this.parent.hp = new HitpointStatistic(this.parent, {
            label: "hexaga.hitpoints.label",
            slug: "hp",
        });
    }

    prepareBaselineStats(): void {
        const attributes = this.attributes;
        const skills = this.skills;
        for (const improvement of this.improvements) {
            for (const attr in attributes) {
                if (improvement.attributes)
                    attributes[attr as keyof typeof attributes].rank += (improvement.attributes ?? []).reduce(
                        (total, current) => (current === attr ? total + 1 : total),
                        0,
                    );
            }
            for (const skl in skills) {
                if (improvement.skills)
                    skills[skl as keyof typeof skills].rank += (improvement.skills ?? []).reduce(
                        (total, current) => (current === skl ? total + 1 : total),
                        0,
                    );
            }
        }
    }

    prepareNumericRollOptions() {
        for (const attribute of ATTRIBUTE_STRINGS) {
            const rank = this.attributes[attribute].total;
            this.rollOptions.all[`${attribute}:rank:${rank}`] = true;
        }

        for (const skill of SKILL_STRINGS) {
            const rank = this.parent.skills[skill].total;
            this.rollOptions.all[`${skill}:rank:${rank}`] = true;
        }

        for (const aspect of this.parent.itemTypes.aspect ?? []) {
            const count = aspect.system.pointsSpent;
            this.rollOptions.all[`aspect:${aspect.system.slug}:count:${count}`] = true;
        }
    }
}

const defineHeroSchema = () => {
    return {
        ...ActorHexData.defineSchema(),
        level: new fields.NumberField({ nullable: false, required: true, initial: 1 }),
        options: new fields.SchemaField({
            heritage: new fields.EmbeddedDataField(ItemHex, { nullable: true, persisted: false }),
            profession: new fields.EmbeddedDataField(ItemHex, { nullable: true, persisted: false }),
        }),
        improvements: new fields.ArrayField(
            new fields.SchemaField({
                source: new fields.StringField({ required: true, nullable: false }),
                attributes: new fields.ArrayField(new fields.StringField(), {
                    initial: [],
                    required: false,
                    nullable: true,
                }),
                skills: new fields.ArrayField(new fields.StringField(), {
                    initial: [],
                    required: false,
                    nullable: true,
                }),
            }),
        ),
    };
};

type HeroSchema = ReturnType<typeof defineHeroSchema>;
