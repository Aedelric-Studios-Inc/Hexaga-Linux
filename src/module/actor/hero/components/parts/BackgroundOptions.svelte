<script lang="ts">
    export let option;
    export let titleKey;
    export let optionType;
    export let actor;

    // Heritage and Profession bonuses are granted at level 1 only
    const rankCap = CONFIG.hexaga.maxRank.findLast((item) => item.level === 1).cap;
    $: improvements = option?.system?.improvements?.[titleKey] ?? null;
    $: selectedChoices = Array.isArray(option?.flags?.hexaga?.selections) ? option.flags.hexaga.selections : [];
    $: allowed = improvements?.allowed ?? 1;
    $: isAtItemCap = selectedChoices.length >= allowed;
    $: allLevelImprovements = actor.system.improvements ?? [];

    function _loc(key) {
        return game.i18n.localize(key);
    }

    function getCount(choice: string, option: string, source: string) {
        return (actor.system.improvements.find((i) => i.source === source)?.[option] ?? []).reduce(
            (total, current) => (current === choice ? total + 1 : total),
            0,
        );
    }

    function getCountAll(option: string, imp) {
        let counter = 0;
        const eligibleImprovements = imp.filter(
            (i) => i.source === "heritage" || i.source === "profession" || Number(i.source.split("level")[1]) <= 1,
        );
        for (const improvement of eligibleImprovements) {
            counter += (improvement[titleKey] ?? []).reduce(
                (total, current) => (current === option ? total + 1 : total),
                0,
            );
        }
        return counter;
    }

    async function makeChoice(UUID, choice, event) {
        const isChecked = event.target.checked;
        let newSelections = [...selectedChoices];

        if (isChecked) {
            if (!newSelections.includes(choice) && !isAtItemCap) {
                newSelections.push(choice);
            }
        } else {
            newSelections = newSelections.filter((val) => val !== choice);
        }

        try {
            const item = await fromUuid(UUID);
            if (!item) throw new Error("UUID is not valid");

            await item.update({
                "flags.hexaga.selections": newSelections,
            });
        } catch (error) {
            ui.notifications.error(error);
        }
    }

    async function removeOption(option): Promise<void> {
        await actor.deleteEmbeddedDocuments("Item", [option.id]);
    }
</script>

<div>
    {#if optionType}
        <div class="title-left">
            <span>{_loc(`TYPES.Item.${optionType}`)}</span>
            <hr />
        </div>
    {/if}
    {#if option && improvements}
        <details class="improvement-item">
            <summary>
                <span class="label-box">
                    <span>{option.name}</span>
                    {#if option.flags?.hexaga?.selections < option.system.improvements[titleKey].allowed || !option.flags?.hexaga?.selections}
                        <span>Improvement Available!</span>
                    {/if}
                </span>
                <button
                    type="button"
                    on:click={() => {
                        option.sheet.render({ force: true });
                    }}><i class="fa-solid fa-pen-to-square"></i></button
                >
                <button
                    type="button"
                    on:click={() => {
                        removeOption(option);
                    }}><i class="fa-solid fa-trash"></i></button
                >
            </summary>
            <div class="content">
                {#await window.foundry.applications.ux.TextEditor.enrichHTML( option.system.description, { async: true }, ) then enrichedHtml}
                    {@html enrichedHtml}
                {/await}
                <span>Select {allowed} from the following:</span>
                <div class="options">
                    {#each option.system?.improvements?.[titleKey]?.selected ?? [] as optionImprovement, index}
                        <label
                            class="labeled-toggle"
                            class:disabled-toggle={(getCountAll(optionImprovement, allLevelImprovements) >= rankCap ||
                                isAtItemCap) &&
                                !selectedChoices.includes(optionImprovement)}
                        >
                            <input
                                type="checkbox"
                                name="{optionType}-options"
                                bind:value={improvements[index]}
                                checked={selectedChoices.includes(optionImprovement)}
                                disabled={(getCountAll(optionImprovement, allLevelImprovements) >= rankCap ||
                                    isAtItemCap) &&
                                    !selectedChoices.includes(optionImprovement)}
                                on:change={(e) => makeChoice(option.uuid, optionImprovement, e)}
                            />
                            <span class="label-button">
                                {_loc(`hexaga.${titleKey.toLowerCase()}.${optionImprovement.toLowerCase()}.label`)}
                            </span>
                        </label>
                    {/each}
                </div>
            </div>
        </details>
    {:else}
        <div class="improvement-item empty item-drop" data-drop-type={optionType}>
            Drag a {_loc(`TYPES.Item.${optionType}`)} here!
        </div>
    {/if}
</div>

<style lang="scss">
    .title-left {
        display: flex;
        flex-direction: column;
        margin-top: 20px;
    }
    .improvement-item {
        border: 1px solid white;
        padding: 10px;
        max-width: 100%;

        .options {
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
        }
    }

    .content {
        margin-top: 20px;
    }

    .improvement-item summary {
        display: flex;
        font-weight: bold;
        cursor: pointer;
        list-style: none;
        height: 20px;
        align-items: center;
        justify-content: space-between;

        button {
            height: 30px;
            width: 30px;
        }

        .label-box {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-right: 10px;
        }
    }

    .labeled-toggle input[type="checkbox"] {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    .labeled-toggle .label-button {
        height: 25px;
        display: flex;
        padding: 0px 10px;
        border: 2px solid white;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;
        font-size: 12px;
        align-items: center;
        width: 80px;
        justify-content: center;
        text-transform: uppercase;
    }

    .labeled-toggle input[type="checkbox"]:checked + .label-button {
        border-color: gold;
    }

    .labeled-toggle.disabled-toggle {
        opacity: 0.35;

        .label-button {
            cursor: not-allowed;
            border-color: rgba(255, 255, 255, 0.2);
        }
    }
</style>
