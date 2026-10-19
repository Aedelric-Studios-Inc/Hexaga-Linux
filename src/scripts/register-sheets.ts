import { HeroSheet } from "../module/actor/hero/heroSheet.ts";
import { ItemSheetHex } from "../module/item/base/sheet.ts";
import { ITEM_TYPES } from "../module/item/itemConfig.ts";
const dsc = foundry.applications.apps.DocumentSheetConfig;

export function registerSheets(): void {
    dsc.registerSheet(Item, "hexaga", ItemSheetHex, {
        label: "Option",
        types: ITEM_TYPES,
        makeDefault: true,
    });

    dsc.registerSheet(Actor, "hexaga", HeroSheet, {
        label: "Hero",
        types: ["hero"],
        makeDefault: true,
    });
}
