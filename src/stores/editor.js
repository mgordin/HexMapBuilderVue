import { defineStore } from 'pinia'
import { useHexesStore } from '@/stores/hexes'
import json from '@/assets/hexConfig.json';

export const useEditorStore = defineStore({
    id: 'editor',
    state: () => ({
        activeHex: {
            id: "0-0",
            terrain: 'Default',
            icons: null
        },
        activeHexID: "1-1",
        activeRow: 1,
        selectedTerrain: null,
        seletedIcons: null,
        title: "Placeholder",
        textSectionHidden: false,
        terrainSectionHidden: false,
        iconsSectionHidden: false,
        terrainToImage: json.terrainToImage
    }),
    getters: {
        
    },
    actions: {
        selectHex(hex, event) {
            // Set used hex to clicked hex and set its properties
            this.activeHexID = hex.id;
            this.title = "Editing Hex ".concat(hex.id)
            this.selectedTerrain = hex.terrain;

            // Select active hex's terrain in the terrain picker
            console.log(event.shiftKey)
            
            Object.values(this.terrainToImage).forEach((element) => {
                element.selected = false;
            })
            this.terrainToImage[hex.terrain].selected = true;

            // Select active hex's icons (incomplete)
            this.selectedIcons = hex.icons;
        },
        selectTerrain(terrain) {
            const hs = useHexesStore();
            this.selectedTerrain = terrain;
            Object.values(this.terrainToImage).forEach((element) => {
                element.selected = false;
            })
            this.terrainToImage[terrain].selected = true;
            hs.setHexTerrain(this.activeHexID, terrain)
        },
        toggleSection(section) {
            if (section == 'terrain') {
                this.terrainSectionHidden = !this.terrainSectionHidden;
            }
        }
    }
})