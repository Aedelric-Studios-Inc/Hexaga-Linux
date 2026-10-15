// Every time I try to consider a better way to do this, it always ends up looking like a Statistic anyways
// The PF2e team just does it right. I don't have anything more to say.

import { ActorHex } from "../../actor/base/baseActor.ts";
import { Attributes } from "../../actor/types.ts";
import { HexagaTestRoll } from "../dice/roller.ts";
import { Modifier } from "../modifier.ts";

// The base statistic class
abstract class BaseStatistic<TActor extends ActorHex> {
    declare protected actor: TActor;
    declare label?: string | null;
    declare domains: string[];
    declare slug: string;

    constructor(actor: TActor, data: { label?: string; slug: string }) {
        Object.defineProperty(this, "actor", {
            value: actor,
            enumerable: false,
            writable: true,
            configurable: true,
        });
        this.label = data.label ?? data.slug;
        this.slug = data.slug;
    }

    get modifierList() {
        const deduplicatedModifiers: Modifier[] = [];

        for (const domain of this.domains) {
            const modifiers = this.actor.synthetics.modifiers[domain] ?? [];

            for (const modifier of modifiers) {
                if (deduplicatedModifiers.some((mod) => mod.slug === modifier.slug)) {
                    continue;
                }

                deduplicatedModifiers.push(modifier);
            }
        }

        return deduplicatedModifiers;
    }

    get modifier() {
        const modifier = this.modifierList.reduce((sum, modifier) => {
            return sum + modifier.modifier;
        }, 0);

        return modifier;
    }
}

// The child class that contains rollable data. HitPointStatistic and ResistanceValueStatistic
// don't have rollable data, so there needs to be an extra layer of abstraction
abstract class Statistic extends BaseStatistic<ActorHex> {
    get poolModifiers() {
        return this.modifierList.filter((mod) => mod.type === "dice");
    }

    get flatSuccesses() {
        return this.modifierList.filter((mod) => mod.type === "flat-success");
    }

    get flatFailures() {
        return this.modifierList.filter((mod) => mod.type === "flat-failure");
    }
}

//TODO: Narrow down domains so there is a getter for non-roll domains and for roll domains

export class SkillStatistic extends Statistic {
    declare rank: number;
    declare attribute: string;

    constructor(actor: ActorHex, data: { rank: number; slug: string; domains?: string[] }) {
        super(actor, data);

        const config = CONFIG.hexaga.skills[data.slug as keyof typeof CONFIG.hexaga.skills];
        this.domains = Array.from(new Set(["all", "skill", data.slug, ...(data.domains ?? [])]));
        this.rank = data.rank;
        this.attribute = config.attribute;
        this.label = _loc(config.label);
    }

    get trained() {
        return this.rank !== 0;
    }

    get attributeRank() {
        return this.actor.system.attributes[this.attribute as keyof typeof this.actor.system.attributes]?.total;
    }

    get baseRank() {
        return this.trained ? this.attributeRank + this.rank : 1;
    }

    get total() {
        return this.baseRank + this.modifier;
    }

    get breakdown() {
        const breakdownParts: string[] = [];
        if (this.trained) {
            breakdownParts.push(`+ ${this.rank} (${_loc(this.label as string)} Rank)`);
            breakdownParts.push(`+ ${this.attributeRank} (${_loc(`hexaga.attributes.${this.attribute}.label`)} Rank)`);
        } else {
            breakdownParts.push("Untrained");
        }

        for (const modifier of this.modifierList) {
            breakdownParts.push(`${modifier.modifier >= 0 ? "+" : ""} ${modifier.modifier} (${modifier.label})`);
        }
        return breakdownParts.join(", ");
    }

    getTraceData() {
        return {
            slug: this.slug,
            label: this.label,
            modifier: this.modifier,
            rank: this.rank,
            total: this.total,
            modifiers: this.modifierList,
            breakdown: this.breakdown,
            roll: this.roll.bind(this),
        };
    }

    async roll() {
        const flatSuccessModifiers = this.flatSuccesses.reduce((sum, mod) => {
            return sum + mod.modifier;
        }, 0);
        const flatFailureModifiers = this.flatFailures.reduce((sum, mod) => {
            return sum + mod.modifier;
        }, 0);
        const dicePoolModifiers = this.poolModifiers.reduce((sum, mod) => {
            return sum + mod.modifier;
        }, 0);

        const options = {
            skill: this.slug,
            trained: this.trained,
            title: `${_loc(this.label as string)} Test`,
            additionalDice: dicePoolModifiers,
            flatSuccesses: flatSuccessModifiers,
            flatFailures: flatFailureModifiers,
            breakdown: this.breakdown,
        };
        const roll = new HexagaTestRoll(this.baseRank, options);
        await roll.evaluate();
        await roll.toMessage();
    }
}

export class ResistanceValueStatistic extends BaseStatistic<ActorHex> {
    declare attributes: Array<keyof Attributes>;

    constructor(actor: ActorHex, data: { attributes: Array<keyof Attributes>; slug: string }) {
        super(actor, data);

        this.attributes = data.attributes;
        this.domains = Array.from(new Set(["all", "rv", data.slug]));
    }

    get base() {
        const firstAttribute =
            this.actor.system.attributes[this.attributes[0] as keyof typeof this.actor.system.attributes].rank;
        const secondAttribute =
            this.actor.system.attributes[this.attributes[1] as keyof typeof this.actor.system.attributes].rank;
        return Math.floor((firstAttribute + secondAttribute) / 2);
    }

    get total() {
        return this.base + this.modifier;
    }
}

export class HitpointStatistic extends BaseStatistic<ActorHex> {
    constructor(actor: ActorHex, data: { slug: string; label?: string }) {
        super(actor, data);

        this.domains = Array.from(new Set(["all", "max-hp", data.slug]));

        // Make sure HP is within bounds
        this.actor.system.updateSource({ intrinsic: { hp: { current: Math.clamp(this.current, 0, this.max) } } });
    }

    get base() {
        return 10 + this.actor.system.attributes.physique.total * this.actor.system.level;
    }

    get current() {
        return this.actor.system.intrinsic.hp.current;
    }

    get max() {
        return this.base + this.modifier;
    }
}

export type SkillTraceData = ReturnType<SkillStatistic["getTraceData"]>;
