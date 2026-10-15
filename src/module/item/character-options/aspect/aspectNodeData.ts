import { ItemHexData } from "../../base/data.ts";

export class AspectNodeData extends ItemHexData<AspectNodeSchema> {
    static override defineSchema(): AspectNodeSchema {
        return defineAspectNodeSchema();
    }

    prepareActorData() {
        const actor = this.parent.actor;
        const aspectSlugs = this.aspectSlugs;
        const slug = this.slug ?? this.parent.name.slugify();

        if (actor) {
            const aspects = actor.itemTypes.aspect.filter((a) => aspectSlugs.includes(a.system.slug));
            for (const aspect of aspects) {
                actor.system.rollOptions.all[`node:${aspect.system.slug}:${slug}`] = true;
            }
        }
    }
}

const defineAspectNodeSchema = () => {
    return {
        ...ItemHexData.defineSchema(),
        aspectSlugs: new fields.ArrayField(new fields.StringField(), { required: true, initial: [] }),
        prerequisites: new fields.ArrayField(new fields.StringField(), { initial: [] }),
    };
};

type AspectNodeSchema = ReturnType<typeof defineAspectNodeSchema>;
