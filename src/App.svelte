<script>
  import { onMount } from 'svelte';
  import svelteLogo from './assets/svelte.svg';
  import Hub from './lib/Hub.svelte';
  
  // Obviously hardcoding Hue system config info here is bad idea. 
  // TODO:  obtain this from a persistent data store
  const hub1_config_dsw = { 
        name: "Hub1",
        ipaddr: "192.168.1.85",
        key: "2SauenjyuxCMB2rHKSFxp06oZGtNhEy4OiCuQel8"
  }
  
  const hub2_config_dsw = { 
        name: "Hub1",
        ipaddr: "192.168.1.9",
        key: "cTiCCIRzOjL1mNuoN1ndDwaQhFSlpsojUIfjKT-u"
  }
  
  
  let hub1;
  let hub2;
  
  let all_hubs = [hub1, hub2];  // ineffective here; good stuff happens in onMount()
  
  
  async function turnAllOnOff(want)   {
    for (let hub of all_hubs)  {
        hub.turnAllOnOff(want);
    }
  }
  
  
  onMount(() => {
    console.log("MOUNT ", hub1, hub2);
    all_hubs = [hub1, hub2];
  });
</script>


<main>

    <Hub {...hub1_config_dsw}  bind:this={hub1}/>
    <Hub {...hub2_config_dsw}  bind:this={hub2}/>

    <div class="buttonbunch"> 
        <div class="bunchedbutton"><button on:click={ () => turnAllOnOff(0) }>All Off</button></div>
        <div class="bunchedbutton"><button on:click={ () => turnAllOnOff(1) }>All ON</button></div>
    </div>
    
    <address>
    Source: <a href="https://github.com/darenw/WebPhue">WebPhue</a> at GitHub 
    <span style="margin-left:5em;" />
    Made using
        <a href="https://svelte.dev" target="_blank" rel="noreferrer">Svelte <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" /></a>
    </address>
    
</main>

<style>

.buttonbunch {
    display: flex;
    background:#d8d8fd;
    border:4px solid #55a;
    padding:.53rem;
    margin-top:1em;
}
.bunchedbutton {
    padding:.013em;
    border:2px solid #448;
    border-radius:6px;
}

address  {
    margin-top:2em;
    padding-top:1em;
    background: #ccc;
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
