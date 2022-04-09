import { defineStore } from 'pinia'
import { useHexesStore } from '@/stores/hexes'
import json from '@/assets/hexConfig.json';

export const useEditorStore = defineStore({
    id: 'editor',
    state: () => ({
        activeHexes: [1],
        activeRow: 1,
        selectedTerrain: null,
        selectedIcon: null,
        tagsSectionVisible: true,
        textSectionVisible: true,
        terrainSectionVisible: true,
        iconsSectionVisible: true,
        terrainToImage: json.terrainToImage,
        multipleHexesImage: json.multiple_hexes,
        iconProperties: json.icons,
        initializeMapModelShown: true,
        initializeHexRows: 8,
        initializeHexColumns: 8
    }),
    getters: {
        activeHexImage(state) {
            const hs = useHexesStore();
            if (this.activeHexes.length == 1) {
                console.log('trying to read terrain path for', hs.hexByUUID(state.activeHexes[0]).terrain)
                return state.terrainToImage[hs.hexByUUID(state.activeHexes[0]).terrain].file
            } else {
                return state.multipleHexesImage.file
            }
        },
        selectedHexCount(state) {
            return state.activeHexes.length;
        },
        title(state) {
            const hs = useHexesStore();
            const hexByUUID = hs.hexByUUID
            if (state.activeHexes.length > 1) {
                return "Editing " + state.activeHexes.length + " hexes";
            } else {
                return "Editing Hex ".concat(hexByUUID(state.activeHexes).id);
            }
        }
    },
    actions: {
        selectHex(hex, event) {
            // Set used hex to clicked hex and set its properties
            if (event.shiftKey) {
                if (!this.activeHexes.includes(hex.uuid)) {
                    this.activeHexes.push(hex.uuid);
                } else if (this.activeHexes.includes(hex.uuid) && this.activeHexes.length > 1) {
                    const matchingIndex = this.activeHexes.indexOf(hex.uuid)
                    if (matchingIndex > -1) {
                        this.activeHexes.splice(matchingIndex, 1); // 2nd parameter means remove one item only
                      }
                }
            } else {
                this.activeHexes = [hex.uuid];
            }

            if (this.activeHexes.length > 1) {
                this.selectedTerrain = null

                this.selectedIcon = null

                // Select active hex's terrain in the terrain picker            
                Object.values(this.terrainToImage).forEach((element) => {
                    element.selected = false;
                })

            } else {
               
                this.selectedTerrain = hex.terrain;


                // Select active hex's terrain in the terrain picker            
                Object.values(this.terrainToImage).forEach((element) => {
                    element.selected = false;
                })
                this.terrainToImage[hex.terrain].selected = true;

                Object.values(this.iconProperties).forEach((element) => {
                    element.selected = false;
                })
                if (hex.icon != null) {
                    this.iconProperties[hex.icon].selected = true;
                }
                

                // Select active hex's icons (incomplete)
                this.selectedIcon = hex.icon;
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
                hs.setHexTerrain(element, terrain, true)
            })
        },
        selectIcon(icon) {
            const hs = useHexesStore();
            this.selectedIcon = icon;
            Object.values(this.iconProperties).forEach((element) => {
                element.selected = false;
            })
            this.iconProperties[icon].selected = true;
            this.activeHexes.forEach((element) => {
                hs.setHexIcon(element, icon)
            })
        },
        toggleSection(section) {
            if (section == 'terrain') {
                this.terrainSectionVisible = !this.terrainSectionVisible;
            } else if (section == 'icons') {
                this.iconsSectionVisible = !this.iconsSectionVisible;
            } else if (section == 'text') {
                this.textSectionVisible = !this.textSectionVisible;
            } else if (section == 'tags') {
                this.tagsSectionVisible = !this.tagsSectionVisible;
            }
        },
        closeInitializeMapModal() {
            this.initializeMapModelShown = false;
        },
        logInitializeMapModelShown() {
            console.log(this.initializeMapModelShown)
        }
    }
})