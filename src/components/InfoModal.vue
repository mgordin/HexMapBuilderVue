<script setup>
import { useHexesStore } from '@/stores/hexes'
import { useEditorStore } from '@/stores/editor'

const hs = useHexesStore();
const es = useEditorStore();
</script>


<template>
<div class="modal" v-bind:class="{'is-active': es.showInfoModal}">
    <div class="modal-background"></div>
    <div class="modal-card info-modal">
        <header class="modal-card-head">
            <p class="modal-card-title">Info</p>
            <button class="delete" aria-label="close" @click="es.toggleInfoModal"></button>
        </header>
        <section class="modal-card-body">
            <header class="subtitle">Tags by category</header>
            <table class="table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Tag count</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="category in Object.keys(hs.contentTags)">
                        <td> {{category}} </td>
                        <td> {{Object.keys(hs.contentTags[category]).length}} </td>
                        <td>{{Object.keys(hs.contentTags[category]).join(', ')}}</td>
                    </tr>
                </tbody>
            </table>
        </section>
        <footer class="modal-card-foot">
            
        </footer>
    </div>
</div>
</template>


<style>
.info-modal {
    min-height: 70vh;
    min-width: 40vw;
}
</style>