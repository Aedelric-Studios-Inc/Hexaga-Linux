<script lang="ts">
    import LevelOptions from "./LevelOptions.svelte";
    export let actor;
    export let level;
</script>

<section>
    <div class="title-left">
        <span>{window.game.i18n.format("hexaga.level.specificLevel", { level: actor.system.level })}</span>
        <hr />
    </div>
    {#if window.CONFIG.hexaga.improvements[level].attributes !== 0}
        <LevelOptions {actor} {level} optionType="attributes" />
    {/if}
    {#if window.CONFIG.hexaga.improvements[level].skills !== 0}
        <LevelOptions {actor} {level} optionType="skills" />
    {/if}
</section>

<style lang="scss">
    section {
        margin-top: 20px;
    }
</style>
