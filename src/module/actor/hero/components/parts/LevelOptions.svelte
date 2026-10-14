<script lang="ts">
    export let actor;
    export let level;
    export let optionType;

    const grantedLevelImprovements = CONFIG.hexaga.improvements[level];
    const rankCap = CONFIG.hexaga.maxRank.findLast((item) => item.level <= level).cap;

    $: chosenLevelImprovements = actor.system.improvements?.find((i) => i.source === `level${level}`) ?? {
        source: `level${level}`,
        attributes: [],
        skills: [],
    };

    $: allLevelImprovements = actor.system.improvements ?? [];

    function getCount(option: string, improvements) {
        return chosenLevelImprovements[optionType].reduce(
            (total, current) => (current === option ? total + 1 : total),
            0,
        );
    }

    function getCountAll(option: string, improvements) {
        let counter = 0;
        const eligibleImprovements = improvements.filter(
            (i) => i.source === "heritage" || i.source === "profession" || Number(i.source.split("level")[1]) <= level,
        );
        for (const improvement of eligibleImprovements) {
            counter += (improvement[optionType] ?? []).reduce(
                (total, current) => (current === option ? total + 1 : total),
                0,
            );
        }
        return counter;
    }

    function atLevelCap(type: string) {
        return chosenLevelImprovements[type].length >= grantedLevelImprovements[type];
    }

    async function increaseChoice(option: string) {
        const picks = Array.isArray(actor.system.improvements) ? [...actor.system.improvements] : [];
        let targetPick = picks.find((p) => p.source === `level${level}`);

        if (!targetPick) {
            targetPick = { source: `level${level}`, attributes: [], skills: [] };
            picks.push(targetPick);
        } else {
            targetPick = { ...targetPick, attributes: [...targetPick.attributes], skills: [...targetPick.skills] };
            const targetIndex = picks.findIndex((p) => p.source === `level${level}`);
            picks[targetIndex] = targetPick;
        }
        targetPick[optionType].push(option);

        const updates = {
            "system.improvements": picks,
        };

        await actor.update(updates);
    }

    async function decreaseChoice(option: string) {
        const picks = Array.isArray(actor.system.improvements) ? [...actor.system.improvements] : [];
        let targetPick = picks.find((p) => p.source === `level${level}`);

        if (!targetPick || !targetPick[optionType].includes(option)) return;

        targetPick = { ...targetPick, attributes: [...targetPick.attributes], skills: [...targetPick.skills] };
        const targetIndex = picks.findIndex((p) => p.source === `level${level}`);
        picks[targetIndex] = targetPick;

        const stringIndex = targetPick[optionType].indexOf(option);
        if (stringIndex > -1) {
            targetPick[optionType].splice(stringIndex, 1);
        }

        const updates = { "system.improvements": picks };

        await actor.update(updates);
    }
</script>

<details class="improvement-item">
    <summary>
        <span>{window.game.i18n.localize(`hexaga.${optionType}.label`)}</span
        >{#if chosenLevelImprovements[optionType].length < grantedLevelImprovements[optionType]}<span
                >Improvement Available!</span
            >{/if}
    </summary>
    <div class="content">
        <span>Select {grantedLevelImprovements[optionType]} from the following:</span>
        <div class="choice-block">
            {#each Object.entries(actor.system[optionType]) as [option, data]}
                <div class="flex-row">
                    <div class="counter">
                        <div class={optionType === "skills" ? "count small" : "count"} id="{option}-count">
                            {getCount(option)}
                        </div>
                        <label for="{option}-count"
                            >{window.game.i18n.localize(`hexaga.${optionType}.${option}.label`)}</label
                        >
                    </div>
                    <div class={optionType === "skills" ? "button-group small" : "button-group"}>
                        <button
                            disabled={getCountAll(option, allLevelImprovements) >= rankCap || atLevelCap(optionType)}
                            on:click={() => {
                                increaseChoice(option);
                            }}>+</button
                        >
                        <button
                            disabled={getCount(option) <= 0}
                            on:click={() => {
                                decreaseChoice(option);
                            }}>-</button
                        >
                    </div>
                </div>
            {/each}
        </div>
    </div>
</details>

<style lang="scss">
    .choice-block {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        row-gap: 10px;
        align-items: left;
        margin-top: 10px;
    }

    .counter {
        justify-items: center;
        margin-right: 12px;
        label {
            justify-self: center;
        }
        .count {
            font-size: 40px;
            &.small {
                font-size: 20px;
            }
        }
    }

    .content {
        margin-top: 20px;
    }

    .flex-row {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .button-group {
        button {
            height: 30px;
            width: 30px;
        }
        &.small {
            button {
                height: 20px;
                width: 20px;
                min-height: 0;
            }
        }
    }

    .improvement-item {
        border: 1px solid white;
        padding: 10px;
        max-width: 100%;
    }

    .improvement-item summary {
        display: flex;
        font-weight: bold;
        cursor: pointer;
        list-style: none;
        height: 20px;
        align-content: center;
        justify-content: space-between;
    }
</style>
