<svelte:options accessors />


<script>
import Hub from './Hub.svelte';
import Bulb from './Bulb.svelte';
import * as phue from './phuesystem.js';
import TinyColorButtons  from './TinyColorButtons.svelte';

  

function tinyColorChosenSelected(ev) {
    phue.setSelBulbs(ev.detail.json);
}

const hardcoded_colors = [
    [ 
        { name:"Blue", hexrgb:"#4c41dc",  json:{bri: 190, sat:210, hue:44800 }},
        { name:"Dark Green",  hexrgb:"#085806",  json:{bri: 22, sat:190, hue:23000 }},
        
        { name:"Dim Red",   hexrgb:"#771000",  json:{bri: 90, sat:255, hue: 10 }},
        { name:"Red",   hexrgb:"#ff1000",  json:{bri: 190, sat:255, hue: 10 }},
        { name:"dim magenta",  hexrgb:"#c802a6",  json:{bri: 62, sat:255, hue:61000 }},
    ],
    [ 
        { name:"violet",  hexrgb:"#8818f6",  json:{bri: 210, sat:220, hue:47500 }},
        { name:"lt pale green",  hexrgb:"#cfffcf",  json:{bri: 222, sat:80, hue:26500 }},
        
        { name:"White",    hexrgb:"#fcfcfc",  json:{bri: 248, sat:5, hue:1500 }},
        { name:"MidWhite", hexrgb:"#bcbcbc",  json:{bri: 110, sat:2, hue:10 }},
        { name:"dim pale blue",  hexrgb:"#224",  json:{bri: 222, sat:80, hue:36000 }},
    ],
    [ 
        { name:"magenta",  hexrgb:"#da2cf6",  json:{bri: 212, sat:210, hue:55000 }},

        { name:"Yellow",   hexrgb:"#fdfd94",  json:{bri: 252, sat:201, hue:9710 }},
        { name:"Orange",   hexrgb:"#f0d020",  json:{bri: 182, sat:241, hue:6600 }},
        { name:"glork",  hexrgb:"#fca",  json:{bri: 232, sat:90, hue:5000 }},
        { name:"pink",    hexrgb:"#ff99ff",  json:{bri: 210, sat:90, hue:55100 }},
    ],
];

</script>


<fieldset class="buttonbunch">
    <legend>Bulb Actions</legend>
    <button on:click={ () => phue.setSelBulbs({"on":false} )}>Off</button>
    <button on:click={ () => phue.setSelBulbs({"on":true} )} >ON</button>
    <button on:click={ phue.randomizeSelectedBulbs } >Rnd</button>
    <button on:click={ phue.randomSeriesSelectedBulbs}>RndSer</button>
    <TinyColorButtons palette={hardcoded_colors} on:color_chosen={tinyColorChosenSelected} />
</fieldset>




<style>

fieldset {
    border:4px solid #222;
    border-radius:0.7em;
    border-color: #55a;
    background:#d8d8fd;
    width:auto;
    
}

.buttonbunch {
}

.buttonbunch button  {
    border-color: #44c;
}


</style>
