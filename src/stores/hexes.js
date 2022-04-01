import { defineStore } from 'pinia'
import { useEditorStore } from '@/stores/editor'
import { useMentionStore } from '@/stores/mentions'

export const useHexesStore = defineStore({
  id: 'hexes',
  state: () => ({
    hexes: [
        [{
            uuid: 1,
            id: "1-1",
            row: 1,
            column: 1,
            terrain: 'Default',
            icons: null,
            content: {
                "type": "doc",
                "content": [
                    {
                        "type": "paragraph",
                        "content": [
                            {
                                "type": "text",
                                "text": "Fill in the contents of the hex..."
                            }
                        ]
                    }
                ]
            },
            tags: []
        }]
    ],
    defaultHexProperties: {
        terrain: "Default",
        icons: null,
        selected: false
    },
    sampleLocations: ['Ruin','Town','Village'],
    selectedSampleLocations: [],
    uuid: 1,
    columnsAddedRight: 0,
    columnsAddedLeft: 0,
    rowsAddedTop: 0,
    rowsAddedBottom: 0,
    nthChildShift: 83.5
  }),
  getters: {
    countRows: (state) => state.hexes.length,
    allRowsEqual: (state) => {
        var shortestRow = state.hexes[0].length;
        var longestRow = state.hexes[0].length;
        state.hexes.forEach((rowOfHexes) => {
            if (rowOfHexes.length < shortestRow) {
                console.log('shortest row', rowOfHexes.length, rowOfHexes)
                shortestRow = rowOfHexes.length;
            } else if (rowOfHexes.length > longestRow) {
                console.log('longest row', rowOfHexes.length, rowOfHexes)
                longestRow = rowOfHexes.length;
            }
        })
        return shortestRow == longestRow
    },
    countColumns: (state) => {
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
    },
    hexByUUID: (state) => {
        return (uuid) => state.hexes.flat().find(element => element.uuid == uuid);
    },
    getShiftPixels: (state) => {
        return state.nthChildShift.toString().concat('px');
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
            uuid: this.setUUID(),
            id: hexID,
            row: row,
            column: column,
            terrain: hexProperties["terrain"],
            icons: hexProperties["icons"],
            content: {
                "type": "doc",
                "content": [
                    {
                        "type": "paragraph",
                        "content": [
                            {
                                "type": "text",
                                "text": "Fill in the contents of the hex..."
                            }
                        ]
                    }
                ]
            },
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
    makeHexForTestingLeft(row) {
        this.addHex(row, 'left', this.defaultHexProperties);
    },
    addRow(position, columns, defaultHexProperties) {
        if (columns == undefined) {
            columns = this.countColumns;
        }
    
        var row = null;
        if (position == 'bottom') {
            var row = this.countRows + 1;
            this.hexes.push([]);
            this.rowsAddedBottom++
        } else {
            var row = 1;
            this.hexes.unshift([]);
            this.rowsAddedTop++
        }
    
        for (let i = 0; i < columns; i++) {
            this.addHex(row, 'right', defaultHexProperties)
        }
    
        if (row == 0) {
            this.shiftHexIDs('rowIncrease')
        }
    },
    addColumn(position, defaultHexProperties) {
        if (position == 'right') {
            if (this.columnsAddedRight % 2 == 0) {
                this.hexes.forEach((element, index) => {
                    if (!(index % 2 == 0)) {
                        console.log('adding to odd')
                        this.addHex(index + 1, position, defaultHexProperties)
                    }
                })
            } else {
                this.hexes.forEach((element, index) => {
                    if (index % 2 == 0) {
                        console.log('adding to odd')
                        this.addHex(index + 1, position, defaultHexProperties)
                    }
                })
            }
            this.columnsAddedRight++
        } else {
            this.hexes.forEach((element, index) => {
                if (this.nthChildShift > 0) {
                    if (!(index % 2 == 0)) {
                        this.addHex(index + 1, position, defaultHexProperties)
                    }
                } else {
                    if (index % 2 == 0) {
                        this.addHex(index + 1, position, defaultHexProperties)
                    }
                }
            })
            this.nthChildShift = -1 * this.nthChildShift
        }
    },
    oddToNegative(number) {
        if (number % 2 == 0) {
            return 1;
        } else {
            return -1;
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
        this.columnsAddedRight = columns * 2 - 1;
        this.rowsAddedBottom = rows / 2 - 1;
    },
    initializeMapForTesting() {
        this.initializeHexGrid(16, 4, this.defaultHexProperties);
    },
    removeHex(hexID) {
        const hex = this.activeHex;
        const hexToRemove = hex(hexID);
        this.hexes[hexToRemove.row - 1].splice(hexToRemove.column - 1)
    },
    setHexTerrain(hexUUID, terrain) {
        console.log(hexUUID, terrain)
        const hex = this.hexByUUID
        const thisHex = hex(hexUUID);
        thisHex.terrain = terrain;
        if (terrain != 'Default') {
            this.maintainEmptyMapEdge(thisHex.row, thisHex.column)
        }
    },
    setHexIcon(hexID, icon) {},
    shiftHexNumbers() {
        this.hexes.forEach((rowOfHexes, row) => {
            rowOfHexes.forEach((hex, column) => {
                hex.id = (row + 1).toString().concat("-", (column + 1).toString());
                hex.row = row + 1;
                hex.column = column + 1;
            })
        })
    },
    setUUID() {
        this.uuid++;
        return this.uuid;
    },
    logHexes() {
        console.log(this.hexes)
    },
    changeHex11Name() {
        this.hexes[0][0].id = "new ID"
    },
    maintainEmptyMapEdge(row, column) {
        if (row == 1) {
            this.addRow('top', this.countColumns, this.defaultHexProperties);
        } else if (row == this.countRows) {
            this.addRow('bottom', this.countColumns, this.defaultHexProperties);
        }
        if (column == 1) {
            console.log('adding column left')
            this.addColumn('left', this.defaultHexProperties);
        } else if (column == this.countColumns) {
            console.log('adding column right')
            this.addColumn('right', this.defaultHexProperties);
        }
        this.shiftHexNumbers();
    },
    logTracking() {
        console.log('rows added bottom', this.rowsAddedBottom, 'rows added top', this.rowsAddedTop, 
        'columns added right', this.columnsAddedRight, 'columns added left', this.columnsAddedLeft)
        console.log('shift', this.nthChildShift)
    }
  }
})