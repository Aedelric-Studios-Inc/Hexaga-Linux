<script lang="ts">
    import BackgroundOptions from "../parts/BackgroundOptions.svelte";
    import LevelOptionsShell from "../parts/LevelOptionsShell.svelte";
    export let actor: ActorHex;

    $: heritage = actor.system.heritage ?? null;
    $: profession = actor.system.profession ?? null;
</script>

<section class="hero-tab">
    <div class="scroll-container">
        <BackgroundOptions {actor} option={heritage} optionType="heritage" titleKey="attributes" />
        <BackgroundOptions {actor} option={profession} optionType="profession" titleKey="skills" />
        {#each Array(actor.system.level) as _, index}
            <LevelOptionsShell {actor} level={index + 1} />
        {/each}
    </div>
</section>

<style lang="scss">
    .scroll-container {
        max-height: 650px;
        overflow-y: auto;
        padding-right: 8px;
    }
</style>
