<script setup>

import { useHexesStore } from '@/stores/hexes'
import { useEditorStore } from '@/stores/editor'


const hs = useHexesStore();
const es = useEditorStore();

</script>

<template>

<div class="modal" v-bind:class="{'is-active': es.showAttributionModal}">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Attribution</p>
            <button class="delete" aria-label="close" @click="es.toggleAttributionModal"></button>
        </header>
        <section class="modal-card-body">
            <p>Icons are sourced from flaticon, as attributed below.</p>
            <a href="https://www.flaticon.com/free-icons/architecture" title="architecture icons">Architecture icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/architecture-and-city" title="architecture and city icons">Architecture and city icons created by tulpahn - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/barn" title="barn icons">Barn icons created by AmethystDesign - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/bow" title="bow icons">Bow icons created by max.icons - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/bridge" title="bridge icons">Bridge icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/broken" title="broken icons">Broken icons created by surang - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/cabain" title="cabain icons">Cabain icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/cabin" title="cabin icons">Cabin icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/castle" title="castle icons">Castle icons created by Pause08 - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/cave" title="cave icons">Cave icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/chimera" title="chimera icons">Chimera icons created by max.icons - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/collapse" title="collapse icons">Collapse icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/crystal-ball" title="crystal ball icons">Crystal ball icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/cultures" title="cultures icons">Cultures icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/destruction" title="destruction icons">Destruction icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/druid" title="druid icons">Druid icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/elf" title="elf icons">Elf icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/fairy" title="fairy icons">Fairy icons created by Chanut-is-Industries - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/fortress" title="fortress icons">Fortress icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/gallow" title="gallow icons">Gallow icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/haunted-house" title="haunted house icons">Haunted house icons created by mikan933 - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/heritage" title="heritage icons">Heritage icons created by Flat Icons - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/hood" title="hood icons">Hood icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/hot-spring" title="hot spring icons">Hot spring icons created by winnievinzence - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/hot-spring" title="hot spring icons">Hot spring icons created by Smashicons - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/hut" title="hut icons">Hut icons created by Smashicons - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/library" title="library icons">Library icons created by BZZRINCANTATION - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/lumberjack" title="lumberjack icons">Lumberjack icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/manor" title="manor icons">Manor icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/medieval" title="medieval icons">Medieval icons created by max.icons - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/medieval" title="medieval icons">Medieval icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/modern" title="modern icons">Modern icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/monastery" title="monastery icons">Monastery icons created by GOWI - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/mongolia" title="mongolia icons">Mongolia icons created by Wichai.wi - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/neighborhood" title="neighborhood icons">Neighborhood icons created by itim2101 - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/observatory" title="observatory icons">Observatory icons created by Smashicons - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/pond" title="pond icons">Pond icons created by Mihimihi - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/pond" title="pond icons">Pond icons created by Chanut-is-Industries - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/portal" title="portal icons">Portal icons created by Vitaly Gorbachev - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/quarry" title="quarry icons">Quarry icons created by Marz Gallery - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/queen" title="queen icons">Queen icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/ruins" title="ruins icons">Ruins icons created by kerismaker - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/ruined" title="ruined icons">Ruined icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/shipwreck" title="shipwreck icons">Shipwreck icons created by Freepik - Flaticon</a>    
            <br/>
            <a href="https://www.flaticon.com/free-icons/shrine" title="shrine icons">Shrine icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/stonehenge" title="stonehenge icons">Stonehenge icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/sword" title="sword icons">Sword icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/telescope" title="telescope icons">Telescope icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/tent" title="tent icons">Tent icons created by Sweetline Graphic - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/toad" title="toad icons">Toad icons created by Freepik - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/witch" title="witch icons">Witch icons created by DinosoftLabs - Flaticon</a>
            <br/>
            <a href="https://www.flaticon.com/free-icons/wolf" title="wolf icons">Wolf icons created by tulpahn - Flaticon</a>
        </section>
        <footer class="modal-card-foot">
        </footer>
    </div>
</div>

</template>

<style>

</style>