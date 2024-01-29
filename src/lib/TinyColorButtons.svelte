<script>
import  { createEventDispatcher } from 'svelte';
import  { onMount } from 'svelte'


export let chosen_color_json = {};

const dispatch = createEventDispatcher();

const hardcoded_colors = [
    [ 
        { name:"DimBlue",  hexrgb:"#181876",  json:{bri: 12, sat:239, hue:45000 }},
        { name:"vivid magenta",  hexrgb:"#f812c6",  json:{bri: 62, sat:255, hue:61000 }},
        { name:"Yellow",   hexrgb:"#fdfd94",  json:{bri: 252, sat:201, hue:9710 }},
        { name:"White",    hexrgb:"#fcfcfc",  json:{bri: 248, sat:5, hue:1500 }},
        { name:"MidWhite", hexrgb:"#bcbcbc",  json:{bri: 110, sat:2, hue:10 }}
    ],
    [ 
        { name:"Orange",   hexrgb:"#f0d020",  json:{bri: 182, sat:241, hue:6600 }},
        { name:"lt pale green",  hexrgb:"#cfffcf",  json:{bri: 222, sat:80, hue:26500 }},
        { name:"Really Red",   hexrgb:"#ff1000",  json:{bri: 190, sat:255, hue: 10 }},
        { name:"pink",    hexrgb:"#fcacfc",  json:{bri: 210, sat:90, hue:55100 }},
        { name:"Blue", hexrgb:"#1c11bc",  json:{bri: 190, sat:210, hue:44800 }}
    ],
    [ 
        { name:"Green",   hexrgb:"#22f022",   json:{bri: 150, sat:203, hue:25000 }},
        { name:"Dark Green",  hexrgb:"#085806",  json:{bri: 22, sat:190, hue:23000 }},
        { name:"Brown",   hexrgb:"#6c5128",   json:{bri: 30, sat:173, hue:7500 }},
        { name:"warm pink", hexrgb:"#ff00ff",   json:{bri: 190, sat:83, hue:100 }},
        { name:"aqua",    hexrgb:"#60f0f0",   json:{bri: 220, sat:211, hue:37000 }}
    ],
];


let tinybutsize = 12;

$: nrows = hardcoded_colors.length;
$: ncols = hardcoded_colors[0].length;   // DANGER! Assuming all rows are same
$: canvas_h = nrows * tinybutsize + 1;
$: canvas_w = ncols * tinybutsize + 1;


function onCanvasBlur(ev) {
}

function onCanvasFocus(ev) {
}



function clickColor(ev, justmoving)   {
    let ix = Math.floor( ev.offsetX / tinybutsize );
    let iy = Math.floor( ev.offsetY / tinybutsize );
    if (ix<0 || ix>=ncols || iy<0 || iy>=nrows) return;
    let z = hardcoded_colors[iy][ix];
    chosen_color_json = z.json;
    dispatch( (justmoving)? 'color_hover' : 'color_chosen',   {
        json: chosen_color_json,
        name: z.name
    });
}

function emitMouseOut(ev)  {
    dispatch('mouseout');
}

function onMouseMove(ev)  {
}

let the_canvas;
onMount( () => {
    let context = the_canvas.getContext('2d');
    
    // Paint neutral dark gray background
    context.beginPath();
    context.fillStyle = '#444';
    context.rect(0,0,canvas_w,canvas_h);
    context.fill();
    
    // Paint the color sample chips
    for (let iy=0; iy<nrows; iy++)   {
        const topy = tinybutsize * iy;
        for (let ix=0; ix<ncols; ix++)   {
            const colordef = hardcoded_colors[iy][ix];
            const rgb = colordef.hexrgb;
            const leftx = tinybutsize * ix;
            context.beginPath();
            context.fillStyle = rgb;
            context.rect(leftx+1, topy+1, tinybutsize-1, tinybutsize-1);
            context.fill();
    }}
});


</script>



<!---------------------------   H T M L   ---------------------------->

<div class="surrounding" width={canvas_w+6} height={canvas_h+6}>
<canvas 
    bind:this={the_canvas}
    width={canvas_w}
    height={canvas_h} 
    on:focus={onCanvasFocus}
    on:blur={onCanvasBlur}
    on:mousemove={ (ev) => clickColor(ev,true) }
    on:click|stopPropagation={ (ev) => clickColor(ev,false) }
    on:mouseout={emitMouseOut}
    />
</div>


<!---------------------------   S T Y L E   ---------------------------->
<style>
.surrounding {
    border: 1px solid black;
    padding:2px;
    padding-bottom:0;
    background:#444;
    float:left;
}

canvas {
    padding:0;
    margin:0;
    cursor: pointer;
}
</style>
