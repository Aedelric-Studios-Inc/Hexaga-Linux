<script lang="ts">
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import NavTabs from "../../../shared/components/NavTabs.svelte";
    import TabDescription from "./tabs/TabDescription.svelte";
    import TabFoundationalCharacterOptions from "../../character-options/components/tabs/TabFoundational.svelte";
    import TabFoundationalWeapon from "../../equipment/weapon/components/tabs/TabFoundational.svelte";
    import TabConfig from "./tabs/TabConfig.svelte";

    export let item;

    $: name = item.name;

    const tabStore = writable("description");
    setContext("activeTab", tabStore);

    const tabs = [
        { id: "description", labelPath: "hexaga.item.sheet.tabs.description" },
        { id: "foundational", labelPath: "hexaga.item.sheet.tabs.foundational" },
        { id: "config", labelPath: "hexaga.item.sheet.tabs.config" },
    ];

    async function updateItem(path: string, event: Event) {
        const target = event.currentTarget;

        try {
            await item.update({ [path]: target.value });
        } catch (error) {
            console.error(`Error updating ${path} on ${item.name}`);
        }
    }
</script>

<header>
    <span class="name"><input type="text" value={name} on:change={(e) => updateItem("name", e)} /></span>
</header>
<NavTabs {tabs} />
{#if $tabStore === "description"}
    <TabDescription {item} />
{:else if $tabStore === "foundational"}
    {#if item.type === "heritage" || item.type === "profession"}
        <TabFoundationalCharacterOptions {item} />
    {:else if item.type === "weapon"}
        <TabFoundationalWeapon {item} />
    {/if}
{:else if $tabStore === "config"}
    <TabConfig {item} />
{/if}

<style lang="scss">
    header {
        margin-bottom: 10px;
    }
</style>
