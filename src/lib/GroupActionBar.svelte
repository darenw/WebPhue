<svelte:options accessors />


<script>
import Hub from './Hub.svelte';
import Bulb from './Bulb.svelte';
import Group from './Group.svelte';

import * as phue from './phuesystem.js';
import TinyColorButtons  from './TinyColorButtons.svelte';


function save_colors_for_groups()  {
    
}


</script>


<fieldset class="buttonbunch">
    <legend>Selection</legend>
    <button on:click={ () => phue.setSelectionAllGroups(true)}>All</button>
    <button on:click={ () => phue.setSelectionAllGroups(false)}>None</button>
    <button on:click={ () => phue.setSelectionAllGroups(-1)}>Inv</button>
    
    <button on:click={ () => phue.setSelBulbs({"on":false} )}>Off</button>
    <button on:click={ () => phue.setSelBulbs({"on":true} )} >ON</button>
    <button on:click={ save_colors_for_groups }>Save Colors</button>
    <button on:click={ phue.randomizeSelectedBulbs } >Rnd</button>
</fieldset>

<style>


</style>
