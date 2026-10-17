import { SvelteComponent } from "svelte";
import ItemShell from "./components/ItemShell.svelte";

export class ItemSheetHex extends foundry.applications.sheets.ItemSheetV2 {
    private svelteComponent: SvelteComponent | null = null;

    static override DEFAULT_OPTIONS = {
        classes: ["hexaga", "sheet", "item"],
        tag: "form",
        window: { resizable: true },
        position: { width: 600, height: 400 },
    };

    protected override async _renderHTML(_context: object, _options: object): Promise<HTMLElement> {
        return document.createElement("div");
    }

    protected override _replaceHTML(_result: HTMLElement, content: HTMLElement, _options: object): void {
        if (this.svelteComponent) {
            this.svelteComponent.$set({
                item: this.document,
            });
            return;
            this.item.permission;
        }

        content.replaceChildren();

        this.svelteComponent = new ItemShell({
            target: content,
            props: {
                item: this.document,
            },
        });
    }

    protected override async _onClose(options: object): Promise<void> {
        if (this.svelteComponent) {
            this.svelteComponent.$destroy?.();
            this.svelteComponent = null;
        }
        return super._onClose(options);
    }
}
