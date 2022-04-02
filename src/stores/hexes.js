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
    nthChildShift: 83.5,
    leftmostColumn: 'odd'
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
        console.log('counting columns')
        var maxColumn = 0;
        state.hexes.forEach((element) => {
            if (element[element.length - 1].column > maxColumn) {
                console.log('count columns', element, element[element.length - 1].column)
                maxColumn = element[element.length - 1].column;
            }
        });
        console.log('max column', maxColumn)
        return maxColumn;
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
    addHex(line, position, hexProperties) {
        if (line > this.countRows + 1) {
            line = this.countRows + 1;
        }
    
        if (line > this.countRows) {
            this.hexes.push([]);
        }
    
        var column = null;
        if (position == 'left') {
            column = 1;
        } else if (position == 'right') {
            column = this.hexes[line - 1].length + 1;
        }
    
        const fixedRow = Math.ceil((line)/2);
        const fixedColumn = (column)*2 - (line) % 2
        const hexID = (fixedRow).toString().concat("-", (fixedColumn).toString());

        var hex = {
            uuid: this.setUUID(),
            id: hexID,
            row: fixedRow,
            column: fixedColumn,
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
            this.hexes[line - 1].push(hex);
        } else if (position == 'left') {
            this.hexes[line - 1].unshift(hex);
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
    
        if (position == 'bottom') {
            var line = this.countRows + 1;
            this.hexes.push([]);
            this.rowsAddedBottom++
        } else {
            var line = 1;
            this.hexes.unshift([]);
            this.hexes.unshift([]);
            this.shiftHexNumbers()
            this.rowsAddedTop++
        }

        var whichLine = 'odd';
        for (let i = 0; i < columns; i++) {            
            this.addHex(line, 'right', defaultHexProperties)

            if (whichLine == 'odd') {
                whichLine = 'even'
                line++
            } else {
                whichLine = 'odd'
                line = line - 1
            }
        
        }
        
    },
    addColumn(position, defaultHexProperties) {
        if (position == 'right') {
            console.log('adding column - right side')
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
            console.log('adding column - left side')
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
    fillFirstRow(columns, defaultHexProperties) {
        var row = 2;
        var whichRow = 'even';
        for (let i = 1; i < columns; i++) {            
            this.addHex(row, 'right', defaultHexProperties)

            if (whichRow == 'odd') {
                whichRow = 'even'
                row++
            } else {
                whichRow = 'odd'
                row--
            }
        
        }
    },
    initializeHexGrid(rows, columns, defaultHexProperties) {
        this.fillFirstRow(columns, defaultHexProperties)
        for (let i = 1; i < rows; i++) {
            this.addRow("bottom", columns, defaultHexProperties);
        }
        this.columnsAddedRight = columns * 2 - 1;
        this.rowsAddedBottom = rows / 2 - 1;
    },
    initializeMapForTesting() {
        this.initializeHexGrid(8, 8, this.defaultHexProperties);
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
                hex.row = Math.ceil((row + 1)/2);
                if (this.leftmostColumn == 'odd') {
                    hex.column = (column + 1)*2 - (row + 1) % 2
                } else {
                    hex.column = (column + 1)*2 - (row % 2)
                }
                hex.id = (hex.row).toString().concat("-", (hex.column).toString());
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
            console.log('adding row to top')
            this.addRow('top', this.countColumns, this.defaultHexProperties);
        } else if (row == this.countRows / 2) {
            this.addRow('bottom', this.countColumns, this.defaultHexProperties);
        }
        if (column == 1) {
            console.log('adding column left')
            this.addColumn('left', this.defaultHexProperties);
            this.toggleLeftmostColumn();
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
    },
    toggleLeftmostColumn() {
        if (this.leftmostColumn == 'odd') {
            this.leftmostColumn = 'even'
        } else {
            this.leftmostColumn = 'odd'
        }
    }
  }
})