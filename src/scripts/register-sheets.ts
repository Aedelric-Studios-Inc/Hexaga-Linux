import { HeroSheet } from "../module/actor/hero/HeroSheet.ts";
import { ItemSheetHex } from "../module/item/base/sheet.ts";
const dsc = foundry.applications.apps.DocumentSheetConfig;

export function registerSheets(): void {
    dsc.registerSheet(Item, "hexaga", ItemSheetHex, {
        label: "Option",
        types: ["heritage", "profession", "aspect", "aspectNode"],
        makeDefault: true,
    });

    dsc.registerSheet(Actor, "hexaga", HeroSheet, {
        label: "Hero",
        types: ["hero"],
        makeDefault: true,
    });
}
