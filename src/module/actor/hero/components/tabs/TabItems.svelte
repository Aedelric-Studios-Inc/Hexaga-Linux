<script lang="ts">
    export let actor: ActorHex;

    $: weapons = [...actor.itemTypes.weapon];

    async function toggleEquip(item: ItemHex) {
        const currentItem = actor.items.get(item.id || item._id);
        const isEquipped = !item.system.equipped;

        try {
            await currentItem.update({ "system.equipped": isEquipped });

            weapons = [...actor.itemTypes.weapon];
        } catch (error) {
            console.error(`Error equipping ${item.name}`);
        }
    }
</script>

<section class="hero-tab droppable">
    <div class="title-left">
        Weapons
        <hr />
    </div>
    <div class="weapons equipment-container">
        {#each weapons as weapon (weapon.id)}
            <details class="equipment-item">
                <summary class="equipment weapon-item">
                    <img type="image" alt={weapon.name} src={weapon.img} />
                    <span class="item-name">{weapon.name}</span>
                    <span class="controls flex-row">
                        {#if weapon.system.equipped}
                            <button type="button" data-tooltip="Attack">
                                <i class="fa-solid fa-swords"></i>
                            </button>
                        {/if}
                        <button
                            class={weapon.system.equipped ? "active" : ""}
                            type="button"
                            data-tooltip={weapon.system.equipped ? "Unequip" : "Equip"}
                            on:click={() => toggleEquip(weapon)}
                        >
                            <i class="fa-solid fa-hand-fist"></i>
                        </button>
                        <button
                            type="button"
                            data-tooltip="Edit"
                            on:click={() => {
                                weapon.sheet.render(true);
                            }}
                        >
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                            type="button"
                            data-tooltip="Delete"
                            on:click={() => {
                                weapon.deleteDialog();
                            }}
                        >
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </span>
                </summary>
                <div class="content">
                    {#await window.foundry.applications.ux.TextEditor.enrichHTML( weapon.system.description, { async: true }, ) then enrichedHtml}
                        {@html enrichedHtml}
                    {/await}
                    <div class="footer">
                        <hr />
                        {#each weapon.system.damagePool as damagePool}
                            <div>DMP: {damagePool.base} - Damage Type: {damagePool.damageType}</div>
                        {/each}
                    </div>
                </div>
            </details>
        {/each}
    </div>
</section>

<style lang="scss">
    section {
        overflow-y: auto;
    }
    details {
        > div {
            margin: 10px;
        }
    }
    .title-left {
        margin-top: 20px;
    }
    .equipment {
        height: 40px;
        display: grid;
        grid-template-columns: 50px 2fr 1fr;
        align-items: center;
        border: 1px solid white;
        padding: 5px;
        img {
            max-height: 30px;
        }
    }
    .equipment-item {
        border: 1px solid white;
        margin-bottom: 5px;
    }
    .equipment-container {
        margin: 10px;
    }
    .flex-row {
        display: flex;
        flex-direction: row;
    }
    .controls {
        justify-content: right;
        button {
            border: none;
            background: none;
            width: 30px;
            &:focus {
                outline: none;
                box-shadow: none;
            }
            &.active {
                outline: none;
                background-color: rgba(248, 255, 46, 0.3);
                -webkit-box-shadow: 0px 0px 5px 2px rgba(248, 255, 46, 0.3);
                -moz-box-shadow: 0px 0px 5px 2px rgba(248, 255, 46, 0.3);
                box-shadow: 0px 0px 5px 2px rgba(248, 255, 46, 0.3);
            }
        }
    }
    .footer {
        > div {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            font-size: 12px;
            text-transform: uppercase;
        }
        > hr {
            clear: none;
            height: 1px;
            color: white;
            border-width: 0px;
            border-image: none;
            border-top: none;
            margin: 20px 0px 10px 0px;
            background-image: none;
            background-color: white;
        }
    }
</style>
