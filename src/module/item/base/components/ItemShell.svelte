<script>
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import NavTabs from "../../../shared/components/NavTabs.svelte";
    import TabDescription from "./tabs/TabDescription.svelte";
    import TabFoundational from "../../character-options/components/tabs/TabFoundational.svelte";
    import TabConfig from "./tabs/TabConfig.svelte";

    export let item;

    const tabStore = writable("description");
    setContext("activeTab", tabStore);

    const tabs = [
        { id: "description", labelPath: "hexaga.item.sheet.tabs.description" },
        { id: "foundational", labelPath: "hexaga.item.sheet.tabs.foundational" },
        { id: "config", labelPath: "hexaga.item.sheet.tabs.config" },
    ];
</script>

<NavTabs {tabs} />
{#if $tabStore === "description"}
    <TabDescription {item} />
{:else if $tabStore === "foundational"}
    <TabFoundational {item} />
{:else if $tabStore === "config"}
    <TabConfig {item} />
{/if}
