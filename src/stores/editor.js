import { defineStore } from 'pinia'
import { useHexesStore } from '@/stores/hexes'
import json from '@/assets/hexConfig.json';

export const useEditorStore = defineStore({
    id: 'editor',
    state: () => ({
        activeHexes: ["1-1"],
        activeRow: 1,
        selectedTerrain: null,
        seletedIcons: null,
        title: "Placeholder",
        textSectionHidden: false,
        terrainSectionHidden: false,
        iconsSectionHidden: false,
        terrainToImage: json.terrainToImage,
        multipleHexesImage: json.multiple_hexes
    }),
    getters: {
        activeHexImage(state) {
            const hs = useHexesStore();
            if (this.activeHexes.length == 1) {
                return state.terrainToImage[hs.activeHex(state.activeHexes[0]).terrain].file
            } else {
                return state.multipleHexesImage.file
            }
        },
        selectedHexCount(state) {
            console.log(state.activeHexes.length)
            return state.activeHexes.length;
        }
    },
    actions: {
        selectHex(hex, event) {
            // Set used hex to clicked hex and set its properties
            if (event.shiftKey) {
                if (!this.activeHexes.includes(hex.id)) {
                    this.activeHexes.push(hex.id);
                }
            } else {
                this.activeHexes = [hex.id];
            }

            if (this.activeHexes.length > 1) {
                this.title = "Editing Hex ".concat(this.activeHexes)
                this.selectedTerrain = null

                // Select active hex's terrain in the terrain picker            
                Object.values(this.terrainToImage).forEach((element) => {
                    element.selected = false;
                })

                this.selectedIcons = null;
            } else {
                this.title = "Editing Hex ".concat(hex.id)
                this.selectedTerrain = hex.terrain;

                // Select active hex's terrain in the terrain picker            
                Object.values(this.terrainToImage).forEach((element) => {
                    element.selected = false;
                })
                this.terrainToImage[hex.terrain].selected = true;

                // Select active hex's icons (incomplete)
                this.selectedIcons = hex.icons;
            }
        },
        deselectAllHexes() {
            this.activeHexes = [];
            this.title = "No hex selected"
            this.selectedTerrain = null
        },
        selectTerrain(terrain) {
            const hs = useHexesStore();
            this.selectedTerrain = terrain;
            Object.values(this.terrainToImage).forEach((element) => {
                element.selected = false;
            })
            this.terrainToImage[terrain].selected = true;
            this.activeHexes.forEach((element) => {
                hs.setHexTerrain(element, terrain)
            })
        },
        toggleSection(section) {
            if (section == 'terrain') {
                this.terrainSectionHidden = !this.terrainSectionHidden;
            }
        },
        
    }
})