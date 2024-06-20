<script>
export let dialog;

</script>


<dialog bind:this={dialog} on:close>
   <slot/>
</dialog>


<style>
d { border: solid #4488dd 12px; }
</style>



