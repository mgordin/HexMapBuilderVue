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
        showTerrainsAsPanel: true,
        saveName: null,
        showLoadModal: false,
        loadName: null,
        showSaveNameModal: false,
        savingIndicator: false,
        exportToPNGTrigger: true,
        mapExportAsPNGShowHexNumbers: true,
        mapExportAsPNGShowHexIcons: true,
        baseFractionWithContent: 0.5,
        showInfoModal: false,
        terrainToBeRandomized: false,
        tagsToBeRandomized: false,
        descriptionToBeRandomized: false,
        mode: 'edit',
        mentionUUID: 1,
        viewModeProgress: 0,
        showViewModeLoaderModal: false,
        hexScale: 1,
        showHexLabels: true,
        currentTool: 'hex-editor',
        paintTerrain: 'Default',
        paintTerrainProperties: json.terrainToImage,
        paintedHexes: [],
        expandMapOpen: false,
        generateContentOnMapExpand: false,
        topRowsToAdd: 0,
        bottomRowsToAdd: 0,
        leftColumnsToAdd: 0,
        rightColumnsToAdd: 0,
        toggleAttributionModal: false
    }),
    getters: {
        activeHexImage(state) {
            const hs = useHexesStore();
            if (this.activeHexes.length == 1) {
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
            
        },
        getMentionUUID(state) {
            state.mentionUUID += 1
            return state.mentionUUID - 1
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
        toggleExpandMapModal() {
            this.expandMapOpen = !this.expandMapOpen;
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
        toggleInfoModal() {
            this.showInfoModal = !this.showInfoModal
        },
        listAllStored() {
            var m = []
            Object.keys(localStorage).forEach((key) => {
                m.push({
                    'key': key,
                    'value': localStorage.getItem(key)
                })
            })
        },
        toggleSaveNameModal() {
            this.showSaveNameModal = !this.showSaveNameModal
        },
        toggleViewModeLoaderModal () {
            this.showViewModeLoaderModal = !this.showViewModeLoaderModal

        },
        triggerExportToPNG() {
            this.exportToPNGTrigger = true;
        },
        setRandomizeIndicator(indicators) {
            if (indicators.includes('description')) {
                this.descriptionToBeRandomized = true;
            }
            if (indicators.includes('tags')) {
                this.tagsToBeRandomized = true;
            }
            if (indicators.includes('terrain')) {
                this.terrainToBeRandomized = true;
            }
        },
        removeRandomizeIndicator(indicators) {
            if (indicators.includes('description')) {
                this.descriptionToBeRandomized = false;
            }
            if (indicators.includes('tags')) {
                this.tagsToBeRandomized = false;
            }
            if (indicators.includes('terrain')) {
                this.terrainToBeRandomized = false;
            }
        },
        toggleViewMode() {
            const es = useEditorStore()
            if (this.mode == 'edit') {
                //es.toggleViewModeLoaderModal()
                this.mode = 'view'
                //es.toggleViewModeLoaderModal()
            } else {
                this.mode = 'edit'
            }
        },
        scrollDown(dist) {
            window.scrollBy(0, dist);
            console.log('scroll down ', dist)
        },
        jumpToHex(hexUUID) {
            const a = document.createElement('a');        
            a.href= "#" + hexUUID;
            a.click();
            URL.revokeObjectURL(a.href);
            window.scrollBy(0, -80);
        },
        hexClicked(hex, keys) {
            const hs = useHexesStore()

            if (this.mode == 'edit' && this.currentTool == 'hex-editor') {
                this.selectHex(hex, keys)
            } else if (this.mode == 'edit' && this.currentTool == 'terrain-painter') {
                hs.paintHexTerrain(hex, this.paintTerrain)
            } else if (this.mode == 'view') {
                this.jumpToHex(hex.uuid)
            }
        },
        selectPaintTerrain(terrain) {
            this.paintTerrain = terrain;
            Object.values(this.terrainToImage).forEach((element) => {
                element.selected = false;
            })
            this.paintTerrainProperties[terrain].selected = true;
        },
        expandMap() {
            const hs = useHexesStore();

            // Add rows or columns
            for (let i = 0; i < this.topRowsToAdd; i++) {
                hs.addRow('top', hs.countColumns, hs.defaultHexProperties);
            }
            for (let i = 0; i < this.bottomRowsToAdd; i++) {
                hs.addRow('bottom', hs.countColumns, hs.defaultHexProperties);
            }
            for (let i = 0; i < this.leftColumnsToAdd; i++) {
                hs.addColumn('left', hs.defaultHexProperties);
                hs.toggleLeftmostColumn();
            }
            for (let i = 0; i < this.rightColumnsToAdd; i++) {
                hs.addColumn('right', hs.defaultHexProperties);
            }
            hs.shiftHexNumbers();
            
            // Generate contents for the expanded sections if that's set
            const hexByPosition = hs.hexByPosition
            
            if (this.generateContentOnMapExpand) {
                if (this.topRowsToAdd > 0) {
                    for (let i = this.topRowsToAdd + 1; i > 1; i--) {
                        for (let j = 2; j < hs.countColumns; j++) {
                            hs.generateTerrain(hexByPosition(i,j), hs.terrainProperties[this.terrainType].odds, false)
                        }
                    }
                }
                if (this.bottomRowsToAdd > 0) {
                    for (let i = hs.countLines / 2 - 2; i < hs.countLines / 2 + this.bottomRowsToAdd - 2; i++) {
                        for (let j = 2; j < hs.countColumns; j++) {
                            const hexByPosition = hs.hexByPosition
                            hs.generateTerrain(hexByPosition(i,j), hs.terrainProperties[this.terrainType].odds, false)
                        }
                    }
                }
                if (this.leftColumnsToAdd > 0) {
                    for (let j = this.leftColumnsToAdd + 1; j > 1; j--) {
                        for (let i = 2; i < hs.countLines / 2; i++) {
                            console.log('trying to set ',i,j)
                            hs.generateTerrain(hexByPosition(i,j), hs.terrainProperties[this.terrainType].odds, false)
                        }
                    }
                }
                if (this.rightColumnsToAdd > 0) {
                    for (let j = hs.countColumns - 2; j < hs.countColumns + this.rightColumnsToAdd - 2; j++) {
                        for (let i = 2; i < hs.countLines / 2; i++) {
                            const hexByPosition = hs.hexByPosition
                            hs.generateTerrain(hexByPosition(i,j), hs.terrainProperties[this.terrainType].odds, false)
                        }
                    }
                }

                hs.hexes.forEach((line) => {
                    line.forEach((hex) => {
                        
                        if (hex.terrain != 'Default') {
                            if (hex.row <= this.topRowsToAdd ||
                                hex.row < (hs.countLines / 2 - this.bottomRowsToAdd) ||
                                hex.column < this.leftColumnsToAdd ||
                                hex.column > (hs.countColumns - this.rightColumnsToAdd)) 
                            {
                                hs.generateHexContents(hex, 'none');
                            }
                        }
                    })
                })



                //////////////////////////
                // Hex terrain
                // this.hexes.forEach((row) => {
                //     row.forEach((hex) => {

                //         if ((this.topRowsToAdd > 0 && hex.row != 1 && hex.row < this.topRowsToAdd + 1) ||
                //             (this.bottomRowsToAdd > 0 && hex.row != hs.countLines / 2 && hex.row > (this.countLines / 2 + this.topRowsToAdd - this.bottomRowsToAdd - 1)) ||
                //             (this.leftColumnsToAdd > 0 && hex.column != 1 && hex.column < this.leftColumnsToAdd + 1) ||
                //             (this.rightColumnsToAdd > 0 && hex.column != hs.countColumns && hex.column > (this.countColumns + this.leftColumnsToAdd - this.rightColumnsToAdd - 1))  
                //         ) {
                //             // this.generateTerrain(hex, terrainSetup.odds, false);

                //             hs.setHexTerrain(hex, 'bog', false)
                //         }
                //     })
                // })
                
                // Hex contents
                // this.hexes.forEach((row) => {
                //     row.forEach((hex) => {
                //         this.generateHexContents(hex, 'none');
                //     })
                // })
            }

            // Reset so that the modal fields aren't weird
            this.topRowsToAdd = 0;
            this.bottomRowsToAdd = 0;
            this.leftColumnsToAdd = 0;
            this.rightColumnsToAdd = 0;

            this.toggleExpandMapModal()
        }
    }
})