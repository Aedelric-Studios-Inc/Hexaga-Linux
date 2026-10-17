import { HeroData } from "./module/actor/hero/heroData.ts";
import { ItemHex } from "./module/item/base/base.ts";
import { HeritageData } from "./module/item/character-options/heritage/data.ts";

import { registerHandlebarsHelpers } from "./scripts/register-handlebars-helpers.ts";
import { registerSheets } from "./scripts/register-sheets.ts";
import { registerTemplates } from "./scripts/register-templates.ts";
import "./styles/hexaga.scss";
import { HEXAGACONFIG } from "./config/index.ts";
import { ActorHex } from "./module/actor/base/baseActor.ts";
import { ProfessionData } from "./module/item/character-options/profession/data.ts";
import { AspectData } from "./module/item/character-options/aspect/aspectData.ts";
import { AspectNodeData } from "./module/item/character-options/aspect/aspectNodeData.ts";
import { WeaponData } from "./module/item/equipment/weapon/weaponData.ts";

Hooks.on("init", () => {
    registerSheets();
    registerTemplates();
    registerHandlebarsHelpers();

    CONFIG.hexaga = HEXAGACONFIG;

    CONFIG.Actor.dataModels["hero"] = HeroData;
    Object.assign(CONFIG.Item.dataModels, {
        heritage: HeritageData,
        profession: ProfessionData,
        aspect: AspectData,
        aspectNode: AspectNodeData,
        weapon: WeaponData,
    });

    CONFIG.Actor.documentClass = ActorHex;
    CONFIG.Item.documentClass = ItemHex;
});
