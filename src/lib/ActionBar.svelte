<svelte:options accessors />


<script>

import Hub from './Hub.svelte';
import Bulb from './Bulb.svelte';
import Group from './Group.svelte';

import TinyColorButtons  from './TinyColorButtons.svelte';
import './card.css'; 

import * as phue from './phuesystem.js'; 



  
  

  

function tinyColorChosenSelected(ev) {
    phue.setSelBulbs(ev.detail.json);
}

  


</script>



<!----------------------------------   H T M L   ---------------------------->

<fieldset class="buttonbunch">
    <legend>Selection</legend>
    <button on:click={ () => phue.setSelectionAll(true)}>All</button>
    <button on:click={ () => phue.setSelectionAll(false)}>None</button>
    <button on:click={ () => phue.setSelectionAll(-1)}>Inv</button>
    <button on:click={ () => phue.createNewGroup() }>+Group</button>
    
    <button on:click={ () => phue.setSelBulbs({"on":false} )}>Off</button>
    <button on:click={ () => phue.setSelBulbs({"on":true} )} >ON</button>
    <button on:click={ phue.randomizeSelectedBulbs } >Rnd</button>
    <TinyColorButtons palette={hardcoded_colors} on:color_chosen={tinyColorChosenSelected} />
</fieldset>



<!----------------------------------   S T Y L E   ---------------------------->

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
