import { defineStore } from 'pinia'
import { useEditorStore } from '@/stores/editor'
import { useMentionStore } from '@/stores/mentions'

export const useHexesStore = defineStore({
  id: 'hexes',
  state: () => ({
    hexes: [
        [{
            id: "1-1",
            row: 1,
            column: 1,
            terrain: 'Default',
            icons: null,
            content: "Fill in the contents of the hex...",
            tags: []
        }]
    ],
    defaultHexProperties: {
        terrain: "Default",
        icons: null,
        selected: false
    },
    sampleLocations: ['Ruin','Town','Village'],
    selectedSampleLocations: []
  }),
  getters: {
    countRows: (state) => state.hexes.length,
    countColumns(state) {
        var maxLength = 0;
        state.hexes.forEach((element) => {
            if (element.length > maxLength) {
                maxLength = element.length;
            }
        });
        return maxLength;
    },
    activeHex: (state) => {
        return (hexID) => state.hexes.flat().find(element => element.id == hexID);
    }
  },
  actions: {
    addHex(row, position, hexProperties) {
        if (row > this.countRows + 1) {
            row = this.countRows + 1;
        }
    
        if (row > this.countRows) {
            this.hexes.push([]);
        }
    
        var column = null;
        if (position == 'left') {
            column = 1;
        } else if (position == 'right') {
            column = this.hexes[row - 1].length + 1;
        }
    
        const hexID = row.toString().concat("-", column.toString());
    
        var hex = {
            id: hexID,
            row: row,
            column: column,
            terrain: hexProperties["terrain"],
            icons: hexProperties["icons"],
            content: "Fill in the contents of the hex...",
            selected: false
        };
    
        if (position == 'right') {
            this.hexes[row - 1].push(hex);
        } else if (position == 'left') {
            this.hexes[row - 1].unshift(hex);
        }
    },
    makeHexForTesting(row) {
        this.addHex(row, 'right', this.defaultHexProperties);
    },
    addRow(position, columns, defaultHexProperties) {
        if (columns == undefined) {
            columns = this.countColumns;
        }
    
        var row = null;
        if (position == 'bottom') {
            var row = this.countRows + 1;
            this.hexes.push([]);
        } else {
            var row = 1;
            this.hexes.upshift([]);
        }
    
        for (let i = 0; i < columns; i++) {
            this.addHex(row, 'right', defaultHexProperties)
        }
    
        if (row == 0) {
            this.shiftHexIDs('rowIncrease')
        }
    },
    fillRow(row, columns, defaultHexProperties) {
        const newHexes = columns - this.hexes[row - 1].length
        for (let i = 0; i < columns - 1; i++) {
            this.addHex(row, 'right', defaultHexProperties)
        }
    },
    initializeHexGrid(rows, columns, defaultHexProperties) {
        this.fillRow(1, columns, defaultHexProperties)
        for (let i = 1; i < rows; i++) {
            this.addRow("bottom", columns, defaultHexProperties);
        }
    },
    initializeMapForTesting() {
        this.initializeHexGrid(16, 4, this.defaultHexProperties);
    },
    removeHex(hexID) {
        const hex = this.activeHex;
        const hexToRemove = hex(hexID);
        this.hexes[hexToRemove.row - 1].splice(hexToRemove.column - 1)
    },
    setHexTerrain(hexID, terrain) {
        console.log(hexID, terrain)
        const hex = this.activeHex
        hex(hexID).terrain = terrain;
    },
    setHexIcon(hexID, icon) {},
    shiftHexIDs() {
        this.hexes.forEach((rowHexes, row) => {
            row.forEach((hex, column) => {
                hex.hexID = row.toString().concat("-", column.toString());
            })
        })
    },
    test1() {
        const ms = useMentionStore()
        console.log(ms.people)
    }
  }
})