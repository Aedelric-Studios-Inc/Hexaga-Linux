import { ActorHex } from "./base/baseActor.ts";

export function prepareHitpointRollOptions(actor: ActorHex): void {
    if (!actor.hp) return;
    const current = actor.hp.current;
    const max = actor.hp.max;
    const rollOptions = actor.system.rollOptions.all;
    rollOptions[`hp-remaining:${current}`] = true;
    rollOptions[`hp-percent:${Math.floor((current / max) * 100)}`] = true;
}
