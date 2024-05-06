<script>
import { onMount } from 'svelte';
import svelteLogo from './assets/svelte.svg';

import Hub from './lib/Hub.svelte'; 
import Bulb from './lib/Bulb.svelte';
import Group from './lib/Group2.svelte';
import TinyColorButtons  from './lib/TinyColorButtons.svelte';
import BulbSelectionBar from './lib/BulbSelectionBar.svelte';
import BulbActionBar from './lib/BulbActionBar.svelte';
import GroupActionBar from './lib/GroupActionBar.svelte';
import * as phue from './lib/phuesystem.js';  


import { random_color_cie, unittest_colors } from './lib/phcolor.js';
import {} from './lib/phuesystem.js';


let textdump="";

let cards_box;         // var to binded to DIV holding all Bulb cards

let group_all;



async function createAllCards()  {
    await phue.createAllHubCards();
    await phue.createAllBulbCards();
    phue.createAllGroups();

}  



onMount(() => {
    createAllCards();
});
  


</script>





<!----------------------------------   H T M L   ---------------------------->

<main>
        
    
    
    <fieldset class="section">
        <legend>Groups</legend>

        <!-- ALL GROUP CARDS GO HERE -->
        <span id="groupcards" />
        
        <!-- <GroupActionBar /> -->
    </fieldset>
    
    
    <fieldset class="section">
        <legend>Bulbs</legend>
        <div style="float:left;"><BulbSelectionBar /></div>
        <div><BulbActionBar  /></div>
        
        <!-- ALL BULB CARDS GO HERE -->
        <span id="bulbcards" />
    
    </fieldset>

    
 
    <fieldset class="buttonbunch"> 
        <legend>System</legend>
        
            <!-- ALL HUB CARDS GO HERE -->
            <span class="cardstack" id="hubcards" />
            
            <div>
            <button on:click={phue.updateAllBulbColorsFromReality}>reality update</button>
            <button on:click={ () => { } }>useless</button>
            </div>
    </fieldset>
    
    
    <button on:click={unittest_colors}>phcolor.js UT</button>
    
    <address>
    Source: <a href="https://github.com/darenw/WebPhue">WebPhue</a> at GitHub 
    <span style="margin-left:5em;" />
    Made using
        <a href="https://svelte.dev" target="_blank" rel="noreferrer">Svelte <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" /></a>
    </address>
    
</main>




<!----------------------------------   S T Y L E   ---------------------------->

<style>
.section   {
    
    border: #aaa solid 5px;  
    border-radius:0.7em; 
    padding: .3rem;
    margin:2px;
    margin-bottom:.8rem;
    display: block;
}
.section legend { color: #666; }


.cardstack {
    display: flex;
    padding:2px;
}

.overall {
}


address  {
    margin-top:2em;
    padding-top:1em;
    background: #ccc;
}

textarea  {
    width: 90%;
    height: 8em;
    margin-top:0.6rem;
}

  .logo {
    height: 1.6em;
    padding: 0;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
