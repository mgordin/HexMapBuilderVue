import { defineStore } from 'pinia'
import { useHexesStore } from '@/stores/hexes'

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
        terrainToImage: {
            Default: { file: "./terrain_tiles/flat/default-hex.png", selected: false },
            Volcano: { file: "./terrain_tiles/flat/1-greenlands_vulcano.png", selected: false },
            Forest: { file: "./terrain_tiles/flat/2-greenlands_forest.png", selected: false },
            Tundra: { file: "./terrain_tiles/flat/3-greenlands_tundra.png", selected: false },
            Trees: { file: "./terrain_tiles/flat/4-greenlands_trees.png", selected: false },
            Water: { file: "./terrain_tiles/flat/5-greenlands_water.png", selected: false },
            Hills: { file: "./terrain_tiles/flat/6-greenlands_hills.png", selected: false },
            River: { file: "./terrain_tiles/flat/7-greenlands_river.png", selected: false },
            Portal: { file: "./terrain_tiles/flat/8-greenlands_Portal.png", selected: false },
            Mountains: { file: "./terrain_tiles/flat/9-greenlands_mountains.png", selected: false },
            Lake: { file: "./terrain_tiles/flat/10-greenlands_lake.png", selected: false },
            Village: { file: "./terrain_tiles/flat/11-greenlands_village.png", selected: false },
            City: { file: "./terrain_tiles/flat/12-greenlands_city.png", selected: false }
        }
    }),
    getters: {
        
    },
    actions: {
        selectHex(hex) {
            // Set used hex to clicked hex and set its properties
            this.activeHexID = hex.id;
            this.title = "Editing Hex ".concat(hex.id)
            this.selectedTerrain = hex.terrain;

            // Select active hex's terrain in the terrain picker
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