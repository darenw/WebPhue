<svelte:options accessors />


<script>

export let name = "unnamed";
export let myhub;   
export let hib=-1;
export let model;
export let unique_id = "";


function turnOnOff(want)  {
    console.log("TURN ON/OFF BULB", myhub.name, hib, want);
    if (myhub)  {
        myhub.setBulbOnOff(hib,want);
    }
}

function setjson(json)  {
    if (myhub)  {
        myhub.setBulb(hib, json);
    }
}
</script>



<div class="whole">
<p><b>{name}</b> <span class="pale">{model}</span> {myhub.name}:{hib} </p>
<p><span class="pale">{unique_id}</span></p>

<div class="buttonbunch">
    <div class="bunchedbutton"><button on:click={ () => turnOnOff(1) } >ON</button></div>
    <div class="bunchedbutton"><button on:click={ () => turnOnOff(0) } >Off</button></div>
    <div class="bunchedbutton"><button on:click={ () => setjson({'bri':100,'hue':45000,'sat':211}) } >dimblue</button></div>
    <div class="bunchedbutton"><button on:click={ () => setjson({'bri':190,'hue':3000,'sat':111}) } >pink</button></div>
    <div class="bunchedbutton"><button on:click={ () => setjson({'bri':251,'hue':8000,'sat':11}) } >white</button></div>
    
</div>

</div><!-- class whole -->


<style>
.whole  { 
    border: #773 solid 5px;  
    border-radius:0.7em; 
    background:#fffad9;
    padding: .2rem;
    margin:2px;
    width:25rem;
    text-align: center;
}

p {
    padding:0;
    margin:0;
}

button { margin:0; }

.pale { color:#663; font-size:.8em; }

.buttonbunch {
    display: flex;
}
.bunchedbutton {
    padding:.013em;
    border:2px solid #263;
    border-radius:6px;
    font-size:0.7em;
}

</style>
