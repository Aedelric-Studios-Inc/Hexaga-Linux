import { ATTACK_SKILLS, DAMAGE_TYPES } from "../module/item/equipment/weapon/weaponConfig.ts";
import { ITEM_TYPES } from "../module/item/itemConfig.ts";
import { FlatModifier } from "../module/system/ruleElement/flatModifier.ts";
import { RuleElementConstructor } from "../module/system/ruleElement/types.ts";

const HEXAGA_CHARACTER_SKILLS = {
    brawn: { label: "hexaga.skills.brawn.label", attribute: "physique", group: "physical" },
    striking: { label: "hexaga.skills.striking.label", attribute: "physique", group: "physical" },
    menace: { label: "hexaga.skills.menace.label", attribute: "physique", group: "physical" },
    marksmanship: { label: "hexaga.skills.marksmanship.label", attribute: "deftness", group: "physical" },
    legerdemain: { label: "hexaga.skills.legerdemain.label", attribute: "deftness", group: "physical" },
    stealth: { label: "hexaga.skills.stealth.label", attribute: "deftness", group: "physical" },
    arcane: { label: "hexaga.skills.arcane.label", attribute: "wit", group: "mental" },
    knowledge: { label: "hexaga.skills.knowledge.label", attribute: "wit", group: "mental" },
    tinker: { label: "hexaga.skills.tinker.label", attribute: "wit", group: "mental" },
    nature: { label: "hexaga.skills.nature.label", attribute: "acumen", group: "mental" },
    sense: { label: "hexaga.skills.sense.label", attribute: "acumen", group: "mental" },
    discernment: { label: "hexaga.skills.discernment.label", attribute: "acumen", group: "mental" },
    spirituality: { label: "hexaga.skills.spirituality.label", attribute: "will", group: "personality" },
    survival: { label: "hexaga.skills.survival.label", attribute: "will", group: "personality" },
    empathy: { label: "hexaga.skills.empathy.label", attribute: "will", group: "personality" },
    occult: { label: "hexaga.skills.occult.label", attribute: "ego", group: "personality" },
    command: { label: "hexaga.skills.command.label", attribute: "ego", group: "personality" },
    speech: { label: "hexaga.skills.speech.label", attribute: "ego", group: "personality" },
};

const HEXAGA_CHARACTER_ATTRIBUTES = {
    physique: { label: "hexaga.attributes.physique.label", group: "physical" },
    deftness: { label: "hexaga.attributes.deftness.label", group: "physical" },
    wit: { label: "hexaga.attributes.wit.label", group: "mental" },
    acumen: { label: "hexaga.attributes.acumen.label", group: "mental" },
    will: { label: "hexaga.attributes.will.label", group: "personality" },
    ego: { label: "hexaga.attributes.ego.label", group: "personality" },
};

const LEVEL_IMPROVEMENTS = [
    null,
    { attributes: 5, skills: 6, aspects: 3 },
    { attributes: 0, skills: 0, aspects: 2 },
    { attributes: 0, skills: 2, aspects: 2 },
    { attributes: 0, skills: 0, aspects: 2 },
    { attributes: 5, skills: 2, aspects: 2 },
];

const MAX_RANK_BY_LEVEL = [
    { level: 1, cap: 2 },
    { level: 5, cap: 3 },
    { level: 10, cap: 4 },
    { level: 15, cap: 5 },
];

const RULE_ELEMENTS: Record<string, RuleElementConstructor> = { FlatModifier: FlatModifier };

export const HEXAGACONFIG = {
    skills: HEXAGA_CHARACTER_SKILLS,
    attributes: HEXAGA_CHARACTER_ATTRIBUTES,
    improvements: LEVEL_IMPROVEMENTS,
    maxRank: MAX_RANK_BY_LEVEL,
    ruleElements: RULE_ELEMENTS,
    damageTypes: DAMAGE_TYPES,
    attackSkills: ATTACK_SKILLS,
    itemTypes: ITEM_TYPES,
};
