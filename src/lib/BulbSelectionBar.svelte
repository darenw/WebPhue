
<svelte:options accessors />


<script>
import Hub from './Hub.svelte';
import Bulb from './Bulb.svelte';
import * as phue from './phuesystem.js';

</script>



<fieldset class="buttonbunch">
    <legend>Select Bulbs</legend>
    <button on:click={ () => phue.setSelectionAllBulbs(true)}>All</button>
    <button on:click={ () => phue.setSelectionAllBulbs(false)}>None</button>
    <button on:click={ () => phue.setSelectionAllBulbs(-1)}>Inv</button>
    &nbsp;
    <button on:click={ () => phue.createNewGroup() }>+Group</button>
</fieldset>



<style>

fieldset {
    border:4px solid #222;
    border-radius:0.7em;
    border-color: #666;
    background:#ddd;
    width:auto;
}

.buttonbunch {
}

.buttonbunch button  {
    border-color: #44c;
}

</style>
