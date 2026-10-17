import { RuleElement } from "../../system/ruleElement/base.ts";
import { RulesEngine } from "../../system/ruleElement/rulesEngine.ts";
import { HitpointStatistic, ResistanceValueStatistic, SkillStatistic } from "../../system/statistic/statistic.ts";
import { ActorSynthetics } from "../synthetics.ts";

export class ActorHex<SubType extends Actor.SubType = Actor.SubType> extends Actor<SubType> {
    declare public synthetics: ActorSynthetics;
    declare skills: SkillStatisticRecord;
    declare rv: Record<string, ResistanceValueStatistic>;
    declare intrinsics: Record<string, any>;
    declare hp: HitpointStatistic;
    public rules: RuleElement[] = [];

    protected override async _preCreate(
        data: Actor.CreateData,
        options: Actor.Database.PreCreateOptions,
        user: User.Stored,
    ): Promise<boolean | void> {
        if ((await super._preCreate(data, options, user)) === false) return false;

        if (this.type === "hero") {
            this.updateSource({
                prototypeToken: {
                    actorLink: true,
                    sight: { enabled: true },
                    disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
                },
            });
        }
    }

    protected override _onUpdateDescendantDocuments(...args: Actor.OnUpdateDescendantDocumentsArgs): void {
        super._onUpdateDescendantDocuments(...args);
        const [_parent, collection, documents] = args;
        if (collection !== "items") return;

        // Add the flags from heritage and profession items to the improvements object
        for (const document of documents) {
            if (document.type === "heritage") {
                const flags = document.getFlag("hexaga", "selections");
                const improvements = this.system.improvements;
                const heritageImprovements = improvements.find((i) => i.source === "heritage");
                if (heritageImprovements) {
                    heritageImprovements.attributes = flags;
                } else {
                    improvements.push({ source: "heritage", attributes: flags, skills: [] });
                }

                this.update({ system: { improvements: improvements } });
            }
            if (document.type === "profession") {
                const flags = document.getFlag("hexaga", "selections");
                const improvements = this.system.improvements;
                const professionImprovements = improvements.find((i) => i.source === "profession");
                if (professionImprovements) {
                    professionImprovements.skills = flags;
                } else {
                    improvements.push({ source: "profession", attributes: [], skills: flags });
                }

                this.update({ system: { improvements: improvements } });
            }
        }
    }

    // We don't use Active Effects, make it not happen.
    override applyActiveEffects(_phase?: unknown): void {}

    override prepareBaseData(): void {
        super.prepareBaseData();
        this.system.rollOptions = { all: { [`self:type:${this.type}`]: true } };
    }

    override prepareEmbeddedDocuments(): void {
        super.prepareEmbeddedDocuments();

        this.synthetics = { modifiers: {} };
        this.rules = [];

        this.prepareActorItemData();

        for (const item of this.items) {
            const rules = RulesEngine.initialize(item);
            this.rules.push(...rules);
        }
    }

    override prepareDerivedData(): void {
        super.prepareDerivedData();
    }

    // Incredibly simplified for the time being
    async modifyHealth(input: string | number): Promise<void> {
        const stringInput = String(input).trim();
        if (!stringInput) return;

        const regex = /([+-])\s*(\d+)/;
        const match = stringInput.match(regex);

        let finalHp = this.system.intrinsic.hp.current;

        if (match) {
            const sign = match[1];
            const amount = Number(match[2]);

            if (sign === "+") {
                finalHp += amount;
            } else {
                finalHp -= amount;
            }
        } else {
            const absoluteChange = Number(stringInput.replace(/[^\d.-]/g, ""));
            if (!isNaN(absoluteChange)) finalHp = absoluteChange;
        }
        finalHp = Math.clamp(finalHp, 0, this.hp.max);
        await this.update({ system: { intrinsic: { hp: { current: finalHp } } } });
    }

    prepareActorItemData() {
        for (const item of this.items) {
            item.system.prepareActorData?.();
        }
    }

    getRollOptions(domains: string[] = []): string[] {
        const rollOptions: string[] = [];
        for (const domain of ["all", ...domains]) {
            const actorRollOptions = this.system.rollOptions[domain] ?? {};
            for (const option of Object.keys(actorRollOptions)) {
                if (option) rollOptions.push(option);
            }
        }
        return rollOptions;
    }
}

type SkillStatisticRecord = Record<string, SkillStatistic>;
