<svelte:options accessors />


<script>

import Hub from './Hub.svelte';
import Bulb from './Bulb.svelte';
import Group from './Group.svelte';

import TinyColorButtons  from './TinyColorButtons.svelte';
import './card.css'; 

import * as phue from './phuesystem.js';  // ????????????



  
  

  

function tinyColorChosenSelected(ev) {
    phue.setSelBulbs(ev.detail.json);
}

  
const hardcoded_colors = [
    [ 
        { name:"Blue", hexrgb:"#4c41dc",  json:{bri: 190, sat:210, hue:44800 }},
        { name:"dimcyan",  hexrgb:"#1c5856",  json:{bri: 48, sat:219, hue:35000 }},
        { name:"Dark Green",  hexrgb:"#085806",  json:{bri: 22, sat:190, hue:23000 }},
        { name:"Brown",   hexrgb:"#6c5128",   json:{bri: 30, sat:173, hue:7500 }},
        
        { name:"Dim Red",   hexrgb:"#771000",  json:{bri: 90, sat:255, hue: 10 }},
        { name:"Red",   hexrgb:"#ff1000",  json:{bri: 190, sat:255, hue: 10 }},
        { name:"dim magenta",  hexrgb:"#c802a6",  json:{bri: 62, sat:255, hue:61000 }},
    ],
    [ 
        { name:"violet",  hexrgb:"#8818f6",  json:{bri: 210, sat:220, hue:47500 }},
        { name:"aqua",    hexrgb:"#50ecd8",   json:{bri: 220, sat:211, hue:37000 }},
        { name:"lt pale green",  hexrgb:"#cfffcf",  json:{bri: 222, sat:80, hue:26500 }},
        
        { name:"hot",  hexrgb:"#eef",  json:{bri: 244, sat:33, hue:41000 }},
        { name:"White",    hexrgb:"#fcfcfc",  json:{bri: 248, sat:5, hue:1500 }},
        { name:"MidWhite", hexrgb:"#bcbcbc",  json:{bri: 110, sat:2, hue:10 }},
        { name:"dim pale blue",  hexrgb:"#224",  json:{bri: 222, sat:80, hue:36000 }},
    ],
    [ 
        { name:"magenta",  hexrgb:"#da2cf6",  json:{bri: 212, sat:210, hue:55000 }},
        { name:"Green",   hexrgb:"#22f022",   json:{bri: 150, sat:203, hue:25000 }},
        { name:"gr yel", hexrgb:"#bbff0c",   json:{bri: 170, sat:223, hue:17100 }},

        { name:"Yellow",   hexrgb:"#fdfd94",  json:{bri: 252, sat:201, hue:9710 }},
        { name:"Orange",   hexrgb:"#f0d020",  json:{bri: 182, sat:241, hue:6600 }},
        { name:"glork",  hexrgb:"#fca",  json:{bri: 232, sat:90, hue:5000 }},
        { name:"pink",    hexrgb:"#ff99ff",  json:{bri: 210, sat:90, hue:55100 }},
    ],
];


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
