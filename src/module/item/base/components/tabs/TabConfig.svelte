<script>
    export let item;

    $: rules = item.system.rules ?? [];
    let ruleType = "FlatModifier";

    function _loc(key) {
        return game.i18n.localize(key);
    }

    async function addRuleElement() {
        const placeholder = {
            domains: ["all"],
            label: `${item.type}: ${item.name}`,
            key: ruleType,
            slug: item.name.slugify(),
        };

        try {
            const constructedPlaceholder = new window.CONFIG.hexaga.ruleElements[ruleType](item, placeholder);
            const updatedRules = [...rules, constructedPlaceholder.data];
            await item.update({ "system.rules": updatedRules });
        } catch (error) {
            console.error("Error creating rule", error);
        }
    }

    async function editRuleElement(index, event) {
        const textarea = event.currentTarget;

        try {
            const parsedData = JSON.parse(textarea.value);

            const updatedRules = [...rules];
            updatedRules[index] = parsedData;

            await item.update({ "system.rules": updatedRules });
        } catch (error) {
            console.error("Invalid JSON for rule element", error);
            ui.notifications.error("Invalid JSON for rule element");
        }
    }

    async function removeRuleElement(index, event) {
        try {
            const updatedRules = [...rules];
            updatedRules.splice(index, 1);
            await item.update({ "system.rules": updatedRules });
        } catch (error) {
            console.error("Error removing rule element", error);
        }
    }
</script>

<section class="item-tab item-config">
    <div class="rules-scroll-box">
        {#each rules as rule, index}
            <div class="title-box outline-thin margin-5" data-index={index}>
                <span class="title pad-5">
                    {_loc(`hexaga.ruleElements.${rule.key}.label`)}
                    <button class="btn-sm" type="button" on:click={(e) => removeRuleElement(index, e)}
                        ><i class="fa-solid fa-trash-can"></i></button
                    >
                </span>
                <textarea
                    class="full-width"
                    name="rules"
                    data-dtype="JSON"
                    value={JSON.stringify(rule)}
                    on:change={(e) => editRuleElement(index, e)}
                ></textarea>
            </div>
        {/each}
    </div>
    <div class="flex flex-col" id="new-rule-element-container">
        <label for="new-rule-element">Create a new Rule Element</label>
        <div class="flex flex-row align-center">
            <select class="margin-5" id="new-rule-element" bind:value={ruleType}>
                {#each Object.keys(window.CONFIG.hexaga.ruleElements) as ruleElement}
                    <option value={ruleElement}>{_loc(`hexaga.ruleElements.${ruleElement}.label`)}</option>
                {/each}
            </select>
            <button type="button" on:click={addRuleElement}>+</button>
        </div>
    </div>
</section>
