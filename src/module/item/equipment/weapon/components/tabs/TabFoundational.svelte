<script lang="ts">
    export let item;

    const CONFIG = window.CONFIG.hexaga;

    $: system = item.system;
    $: damagePool = system.damagePool;
    $: attackType = system.attackType;
    $: attackSkill = system.attackSkill;

    async function updateItemFromEvent(path: string, event: Event) {
        const target = event.currentTarget;

        if (!target || (!"value") in target) return;
        try {
            await item.update({ [path]: target.value });
        } catch (error) {
            console.error(`Error updating ${path} on ${item.name}`);
        }
    }

    async function handlePoolChange(event: Event) {
        const target = event.target as HTMLInputElement | HTMLSelectElement;
        if (!target) return;

        const indexStr = target.getAttribute("data-index");
        const key = target.getAttribute("data-key");

        if (indexStr === null || !key) return;

        const index = parseInt(indexStr, 10);
        const pools = [...damagePool];

        const value = target.type === "number" ? Number(target.value) || 0 : target.value;

        pools[index] = { ...pools[index], [key]: value };

        try {
            await item.update({ "system.damagePool": pools });
        } catch (error) {
            console.error(`Error updating damage pool via delegation on ${item.name}`, error);
        }
    }

    async function addPool() {
        const pools = damagePool;
        const newPools = [...pools, { base: 1, damageType: "bludgeoning" }];

        try {
            await item.update({ "system.damagePool": newPools });
        } catch (error) {
            console.error(`Error updating damage pool on ${item.name}`);
        }
    }

    async function removePool(index: number) {
        const pools = [...damagePool];
        pools.splice(index, 1);

        try {
            await item.update({ "system.damagePool": pools });
        } catch (error) {
            console.error(`Error updating damage pool on ${item.name}`);
        }
    }
</script>

<section class="item-tab">
    <div class="flex-row">
        <div class="flex-row">
            <label for="attack-type">{window.game.i18n.localize(`hexaga.weapon.attackType.label`)}: </label>
            <select
                class="margin-5"
                id="attack-type"
                value={attackType}
                on:change={(e) => updateItemFromEvent("system.attackType", e)}
            >
                {#each ["ranged", "melee", "magical"] as type}
                    <option value={type}>{window.game.i18n.localize(`hexaga.weapon.attackType.${type}`)}</option>
                {/each}
            </select>
        </div>
        <div class="flex-row">
            <label for="attack-skill">{window.game.i18n.localize(`hexaga.weapon.attackSkill.label`)}: </label>
            <select
                class="margin-5"
                id="attack-skill"
                value={attackSkill}
                on:change={(e) => updateItemFromEvent("system.attackSkill", e)}
            >
                {#each CONFIG.attackSkills as skill}
                    <option value={skill}>{window.game.i18n.localize(`hexaga.skills.${skill}.label`)}</option>
                {/each}
            </select>
        </div>
    </div>
    <fieldset>
        <legend>{window.game.i18n.localize("hexaga.weapon.damagePool.plural")}</legend>
        <ul on:change={(e) => handlePoolChange(e)}>
            {#each damagePool as pool, index (pool)}
                <div class="pool flex-row">
                    <div class="flex-row">
                        <label for="dice">{window.game.i18n.localize("hexaga.dice.plural")}: </label>
                        <input
                            type="number"
                            id="dice"
                            data-index={index}
                            data-key="base"
                            value={pool.base}
                            on:change={() => {}}
                        />
                    </div>
                    <div class="flex-row">
                        <label for="damage-type">{window.game.i18n.localize("hexaga.damageTypes.label")}: </label>
                        <select id="damage-type" data-index={index} data-key="damageType" value={pool.damageType}>
                            {#each CONFIG.damageTypes as damageType}
                                <option value={damageType}
                                    >{window.game.i18n.localize(`hexaga.damageTypes.${damageType}`)}</option
                                >
                            {/each}
                        </select>
                    </div>
                    <button
                        type="button"
                        on:click={() => {
                            removePool(index);
                        }}><i class="fa-solid fa-trash-can"></i></button
                    >
                </div>
            {/each}
        </ul>
        <button type="button" on:click={() => addPool()}
            >{window.game.i18n.localize("hexaga.weapon.damagePool.add")}</button
        >
    </fieldset>
</section>

<style lang="scss">
    section {
        overflow-y: auto;
    }
    .flex-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        select {
            width: auto;
        }
        input {
            width: auto;
        }
        label {
            margin-right: 5px;
        }
        button {
            width: 30px;
            height: 30px;
        }
    }
    .pool {
        margin-top: 5px;
    }
</style>
