<script>
    import OptionSelection from "../parts/OptionSelection.svelte";

    export let item;

    $: improvements = item.system.improvements;
</script>

<section class="item-tab">
    <div class="foundational-improvements">
        {#if item.type === "heritage"}
            <OptionSelection
                {item}
                titleKey="attributes"
                localizationPrefix="hexaga"
                path="system.improvements.attributes.selected"
                countPath="system.improvements.attributes.allowed"
                choices={improvements.attributes.choices ?? []}
                selected={improvements.attributes.selected ?? []}
                amount={improvements.attributes.allowed ?? 0}
            />
        {/if}
        {#if item.type === "profession"}
            <OptionSelection
                {item}
                titleKey="skills"
                localizationPrefix="hexaga"
                path="system.improvements.skills.selected"
                countPath="system.improvements.skills.allowed"
                choices={improvements.skills.choices ?? []}
                selected={improvements.skills.selected ?? []}
                amount={improvements.skills.allowed ?? 0}
            />
        {/if}
    </div>
</section>
