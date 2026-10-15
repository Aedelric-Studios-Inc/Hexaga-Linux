import { ItemHexData } from "../../base/data.ts";

export class AspectData extends ItemHexData<AspectSchema> {
    static override defineSchema(): AspectSchema {
        return defineAspectSchema();
    }

    get pointsSpent() {
        const actor = this.parent.actor;
        if (!actor) return 0;
        const slug = this.slug;
        if (!slug) return 0;
        const activeNodes = actor.itemTypes.aspectNode ?? [];
        return activeNodes.filter(
            (node) => Array.isArray(node.system.aspectSlugs) && node.system.aspectSlugs.includes(slug),
        ).length;
    }

    prepareActorData() {
        const actor = this.parent.actor;
        const slug = this.slug ?? this.parent.name.slugify();

        if (actor) {
            actor.system.rollOptions.all[`aspect:${slug}`] = true;
        }
    }
}

const defineAspectSchema = () => {
    return {
        ...ItemHexData.defineSchema(),
        hpPerNode: new fields.NumberField({ required: true, nullable: false, initial: 3 }),
    };
};

type AspectSchema = ReturnType<typeof defineAspectSchema>;
