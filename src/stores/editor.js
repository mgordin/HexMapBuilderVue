import { defineStore } from 'pinia'
import { useHexesStore } from '@/stores/hexes'
import json from '@/assets/hexConfig.json';


export const useEditorStore = defineStore({
    id: 'editor',
    state: () => ({
        showEditor: true,
        showViewer: false,
        showDocumentation: false,
        activeHexes: [1],
        activeRow: 1,
        selectedTerrain: null,
        selectedIcon: null,
        tagsSectionVisible: true,
        textSectionVisible: true,
        terrainSectionVisible: true,
        iconsSectionVisible: true,
        mentionedBySectionVisible: true,
        terrainToImage: json.terrainToImage,
        multipleHexesImage: json.multiple_hexes,
        iconProperties: json.icons,
        initializeMapModelShown: true,
        initializeHexRows: 8,
        initializeHexColumns: 8,
        mentioningHexes: [],
        currentSelectedContent: null,
        terrainType: "temperate forest",
        terrainDropdownOpen: false,
        settingsOpen: false,
        showTerrainsAsPanel: false,
        saveName: null,
        showLoadModal: false,
        loadName: null,
        showSaveNameModal: false,
        savingIndicator: false,
        exportToPNGTrigger: true,
        mapExportAsPNGShowHexNumbers: true,
        mapExportAsPNGShowHexIcons: true,
        baseFractionWithContent: 0.5
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
        },
        terrainDropdownOptions(state) {
            var terrains = [];
            Object.keys(state.terrainToImage).forEach((terrain) => {
                var t = state.terrainToImage[terrain]
                t["label"] = terrain
                terrains.push(t)
            })
            console.log('terrains are', terrains)
            return terrains
        },
        listSavedMaps(state) {

            const r = new RegExp("hexmapmaker-map-")
            var maps = []
            Object.keys(localStorage).forEach((key) => {
                if (r.test(key)) {
                    maps.push(key.replace(r, ""))
                }
            })
            return maps;
            
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

                const hs = useHexesStore();
                this.mentioningHexes = hs.mentionedByHexes(hex.uuid)
                //this.currentSelectedContent = hex.content
            }
        },
        deselectAllHexes() {
            this.activeHexes = [];
            this.title = "No hex selected"
            this.selectedTerrain = null
        },
        selectTerrain(terrain) {
            const hs = useHexesStore();
            const hexByUUID = hs.hexByUUID
            this.selectedTerrain = terrain;
            Object.values(this.terrainToImage).forEach((element) => {
                element.selected = false;
            })
            this.terrainToImage[terrain].selected = true;
            this.activeHexes.forEach((hexUUID) => {
                hs.setHexTerrain(hexByUUID(hexUUID), terrain, true)
            })
        },
        selectIcon(icon) {
            const hs = useHexesStore();
            const hexByUUID = hs.hexByUUID
            this.selectedIcon = icon;
            Object.values(this.iconProperties).forEach((element) => {
                element.selected = false;
            })
            this.iconProperties[icon].selected = true;
            this.activeHexes.forEach((hexUUID) => {
                hs.setHexIcon(hexByUUID(hexUUID), icon)
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
        },
        mentionTagHoverStart(hex) {
            this.currentSelectedContent = hex.content
        },
        toggleTerrainDropdown() {
            this.terrainDropdownOpen = !this.terrainDropdownOpen;
        },
        setTerrainType(terrainType) {
            this.terrainType = terrainType
        },
        logActive() {
            console.log(this.activeHexes)
        },
        toggleSettingsModal() {
            this.settingsOpen = !this.settingsOpen;
        },
        saveMapLocally() {      
            if (this.saveName == null || this.saveName == "") {
                this.toggleSaveNameModal()
            } else {
                this.showSaveNameModal = false
                const hs = useHexesStore()     
                const content = {
                    hexes: hs.hexes,
                    leftmostColumn: hs.leftmostColumn,
                    nthChildShift: hs.nthChildShift,
                    uuid: hs.uuid
                }

                this.localSave("hexmapmaker-map-" + this.saveName, content)
                this.savingIndicator = true
                setTimeout(() => {  this.savingIndicator = false }, 2000);

            }
            
        },
        loadLocalMap() {
            const hs = useHexesStore()

            const content = this.loadData("hexmapmaker-map-" + this.loadName)
            console.log('content is', content)

            hs.hexes = content.hexes;
            hs.leftmostColumn = content.leftmostColumn;
            hs.nthChildShift = content.nthChildShift;
            hs.uuid = content.uuid

            this.showLoadModal = false;
        },
        localSave(name, data) {
            localStorage.setItem(name, JSON.stringify(data));
        },
        loadData(name) {
            var loaded = JSON.parse(localStorage.getItem(name));
            return loaded
        },
        
        toggleLoadModal() {
            this.showLoadModal = !this.showLoadModal
        },
        listAllStored() {
            var m = []
            Object.keys(localStorage).forEach((key) => {
                m.push({
                    'key': key,
                    'value': localStorage.getItem(key)
                })
            })
            console.log('all keys and values', m)
        },
        toggleSaveNameModal() {
            this.showSaveNameModal = !this.showSaveNameModal
        },
        triggerExportToPNG() {
            this.exportToPNGTrigger = true;
        }
    }
})