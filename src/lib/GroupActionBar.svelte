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
    <legend>Select Groups</legend>
    <button on:click={ () => phue.setSelectionAllGroups(true)}>All</button>
    <button on:click={ () => phue.setSelectionAllGroups(false)}>None</button>
    <button on:click={ () => phue.setSelectionAllGroups(-1)}>Inv</button>
    &nbsp;
    <button on:click={ () => phue.setSelBulbs({"on":false} )}>Off</button>
    <button on:click={ () => phue.setSelBulbs({"on":true} )} >ON</button>
</fieldset>

<style>

fieldset {
    border:4px solid #222;
    border-radius:0.7em;
    border-color: #55a;
    background:#d8d8fd;
}

.buttonbunch {
}

.buttonbunch button  {
    border-color: #44c;
}



</style>
