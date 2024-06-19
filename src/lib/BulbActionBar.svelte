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
        { name:"White 6500K", hexrgb:"#d7f0FF",  json:{bri: 210,  xy:[0.3135, 0.3236] }},
        { name:"White 5000K", hexrgb:"#e0e8Ff",  json:{bri: 210,  xy:[0.3451, 0.3516] }},
        { name:"White 4200K", hexrgb:"#F8F8f0",  json:{bri: 210,  xy:[0.3720, 0.3713] }},
        { name:"White 3400K", hexrgb:"#F8e8d0",  json:{bri: 210,  xy:[0.4110, 0.3935] }},
        { name:"White 2700K", hexrgb:"#F8e0a0",  json:{bri: 210,  xy:[0.4599, 0.4106] }},
        
        { name:"Red",       hexrgb:"#ff2422",  json:{bri: 225, sat:240, hue:    26 }},
        { name:"Orange",    hexrgb:"#ff6722",  json:{bri: 230, sat:230, hue:  6500 }},
        { name:"Yellow",    hexrgb:"#ffff44",  json:{bri: 250, sat:222, hue:  9900 }},
        { name:"Lime",      hexrgb:"#99ff22",  json:{bri: 230, sat:240, hue: 15000 }},
        { name:"Green",     hexrgb:"#22ff22",  json:{bri: 230, sat:240, hue: 23000 }},
        { name:"Cyan",      hexrgb:"#44ffff",  json:{bri: 220, sat:243, hue: 34000 }},  
        { name:"Blue",      hexrgb:"#6666ff",  json:{bri: 235, sat:241, hue: 42000 }},
        { name:"Violet",    hexrgb:"#9944ff",  json:{bri: 230, sat:242, hue: 48000 }},
        { name:"Magenta",   hexrgb:"#ff22ec",  json:{bri: 220, sat:240, hue: 60000 }},
    ],
    
    
    [ 
        { name:"Light 6500K", hexrgb:"#bbd8db",  json:{bri: 130,  xy:[0.3135, 0.3236] }},
        { name:"Light 5000K", hexrgb:"#bbc0c8",  json:{bri: 130,  xy:[0.3451, 0.3516] }},
        { name:"Light 4200K", hexrgb:"#bbbbb7",  json:{bri: 130,  xy:[0.3720, 0.3713] }},
        { name:"Light 3400K", hexrgb:"#bbb8b0",  json:{bri: 130,  xy:[0.4110, 0.3935] }},
        { name:"Light 2700K", hexrgb:"#bb9b77",  json:{bri: 130,  xy:[0.4599, 0.4106] }},
        
        { name:"Pale Red",       hexrgb:"#e06465",  json:{bri: 225, sat:140, hue:    26 }},
        { name:"Pale Orange",    hexrgb:"#efbf92",  json:{bri: 230, sat:130, hue:  6500 }},
        { name:"Pale Yellow",    hexrgb:"#eeeeaa",  json:{bri: 250, sat:122, hue:  9900 }},
        { name:"Pale Lime",      hexrgb:"#bbee66",  json:{bri: 230, sat:140, hue: 15000 }},
        { name:"Pale Green",     hexrgb:"#66ee66",  json:{bri: 230, sat:140, hue: 23000 }},
        { name:"Pale Cyan",      hexrgb:"#aaeeee",  json:{bri: 220, sat:143, hue: 34000 }},  
        { name:"Pale Blue",      hexrgb:"#9999ee",  json:{bri: 235, sat:141, hue: 42000 }},
        { name:"Pale Violet",    hexrgb:"#bb88ff",  json:{bri: 230, sat:142, hue: 48000 }},
        { name:"Pale Magenta",   hexrgb:"#ff99ec",  json:{bri: 220, sat:140, hue: 60000 }},
    ],

    [ 
        { name:"Dim 6500K", hexrgb:"#53657c",  json:{bri:  50,  xy:[0.3135, 0.3236] }},
        { name:"Dim 5000K", hexrgb:"#535c66",  json:{bri:  50,  xy:[0.3451, 0.3516] }},
        { name:"Dim 4200K", hexrgb:"#555555",  json:{bri:  50,  xy:[0.3720, 0.3713] }},
        { name:"Dim 3400K", hexrgb:"#5c503c",  json:{bri:  50,  xy:[0.4110, 0.3935] }},
        { name:"Dim 2700K", hexrgb:"#5c4400",  json:{bri:  50,  xy:[0.4599, 0.4106] }},
        
        { name:"Dark Red",       hexrgb:"#881200",  json:{bri: 25, sat:170, hue:    26 }},
        { name:"Dark Orange",    hexrgb:"#773011",  json:{bri: 40, sat:160, hue:  6500 }},
        { name:"Dark Yellow",    hexrgb:"#777711",  json:{bri: 50, sat:152, hue:  9900 }},
        { name:"Dark Lime",      hexrgb:"#448800",  json:{bri: 30, sat:170, hue: 15000 }},
        { name:"Dark Green",     hexrgb:"#007700",  json:{bri: 30, sat:170, hue: 23000 }},
        { name:"Dark Cyan",      hexrgb:"#117777",  json:{bri: 30, sat:173, hue: 34000 }},  
        { name:"Dark Blue",      hexrgb:"#303077",  json:{bri: 35, sat:171, hue: 42000 }},
        { name:"Dark Violet",    hexrgb:"#441177",  json:{bri: 30, sat:172, hue: 48000 }},
        { name:"Dark Magenta",   hexrgb:"#770077",  json:{bri: 30, sat:170, hue: 60000 }},
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
