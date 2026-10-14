<script>
    export let item;
    export let titleKey;
    export let localizationPrefix;
    export let path;
    export let countPath;
    export let choices;
    export let selected;
    export let amount;

    let localSelected = Array.isArray(selected) ? [...selected] : [];

    $: {
        const currentDbArray = Array.isArray(selected) ? selected : [];
        const isOutOfSync =
            currentDbArray.length !== localSelected.length ||
            !currentDbArray.every((val) => localSelected.includes(val));

        if (isOutOfSync) {
            localSelected = [...currentDbArray];
        }
    }

    function _loc(key) {
        return game.i18n.localize(key);
    }

    async function changeSelection(target, event) {
        const isChecked = event.target.checked;

        if (isChecked) {
            if (!localSelected.includes(target)) {
                localSelected = [...localSelected, target];
            }
        } else {
            localSelected = localSelected.filter((attr) => attr !== target);
        }

        try {
            await item.update({ [path]: localSelected });
        } catch (error) {
            console.error("Hexaga | Error updating item selection:", error);
        }
    }

    async function updateAllowed(event) {
        const setAmount = Number(event.target.value);

        try {
            await item.update({ [countPath]: setAmount });
        } catch (error) {
            console.error("Error updating amount count allowed:", error);
        }
    }
</script>

<div class="foundational-item">
    <div class="title">{_loc(`${localizationPrefix}.${titleKey}.label`)}</div>
    <hr />
    <label for="count-{titleKey}">Number of selections to allow: </label>
    <input
        class="selection-count"
        type="number"
        id="count-{titleKey}"
        min="0"
        ,
        value={amount}
        on:change={updateAllowed}
    />
    <div class="choices">
        {#each choices as choice}
            <div class="flex align-center">
                <input
                    type="checkbox"
                    id={choice}
                    name={titleKey}
                    value={choice}
                    checked={localSelected.includes(choice)}
                    on:change={(e) => changeSelection(choice, e)}
                />
                <label for={choice}>{_loc(`${localizationPrefix}.${titleKey}.${choice}.label`)}</label>
            </div>
        {/each}
    </div>
</div>

<style>
    .selection-count {
        width: 40px;
        margin: 10px;
    }
</style>
