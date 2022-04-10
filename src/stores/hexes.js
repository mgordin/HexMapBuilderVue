import { defineStore } from 'pinia'
import { useEditorStore } from '@/stores/editor'
import json from '@/assets/hexConfig.json';


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
            icon: null,
            content: null,
            tags: []
        }]
    ],
    defaultHexProperties: {
        terrain: "Default",
        icon: null,
        selected: false
    },
    sampleLocations: ['Ruin','Town','Village'],
    selectedSampleLocations: [],
    uuid: 1,
    columnsAddedRight: 0,
    columnsAddedLeft: 0,
    nthChildShift: 83.5,
    leftmostColumn: 'odd',
    terrainProperties: json.terrainProperties,
    terrainInfluencedBy: json.terrainInfluencedBy
  }),
  getters: {
    countLines: (state) => state.hexes.length,
    allLinesEqual: (state) => {
        var shortestLine = state.hexes[0].length;
        var longestLine = state.hexes[0].length;
        state.hexes.forEach((lineOfHexes) => {
            if (lineOfHexes.length < shortestLine) {
                shortestLine = lineOfHexes.length;
            } else if (lineOfHexes.length > longestLine) {
                longestLine = lineOfHexes.length;
            }
        })
        return shortestLine == longestLine
    },
    countColumns: (state) => {
        var maxColumn = 0;
        state.hexes.forEach((element) => {
            if (element[element.length - 1].column > maxColumn) {
                maxColumn = element[element.length - 1].column;
            }
        });
        return maxColumn;
    },
    activeHex: (state) => {
        return (hexID) => state.hexes.flat().find(element => element.id == hexID);
    },
    hexByUUID: (state) => {
        return (uuid) => state.hexes.flat().find(element => element.uuid == uuid);
    },
    hexByPosition: (state) => {
        return (row, column) => {
            var line = null;
            var lineIndex = null;
            if (column % 2 == 0) {
                line = row * 2 - 1
            } else {
                line = row * 2 - 2
            }
            if (state.leftmostColumn == 'odd') {
                if (column % 2 == 0) {
                    lineIndex = column/2 - 1
                } else {
                    lineIndex = Math.floor(column/2)
                }
            } else {
                if (column % 2 == 0) {
                    lineIndex = column/2 - 1
                } else {
                    lineIndex = Math.floor(column/2)
                }
            }
            return state.hexes[line][lineIndex]
        }
    },
    getShiftPixels: (state) => {
        return state.nthChildShift.toString().concat('px');
    },
  },
  actions: {
    addHex(line, position, hexProperties) {
        if (line > this.countLines + 1) {
            line = this.countLines + 1;
        }
    
        if (line > this.countLines) {
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
            icon: hexProperties["icon"],
            content: null,
            selected: false,
            tags: []
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
    
        // Add row on the bottom
        if (position == 'bottom') {
            if (this.leftmostColumn == 'odd') {
                var line = this.countLines + 1;
            } else {
                var line = this.countLines + 2;
            }
            this.hexes.push([]);
            this.hexes.push([]);
        // Add row on the top
        } else {
            if (this.leftmostColumn == 'odd') {
                var line = 1;
            } else {
                var line = 2;
            }
            this.hexes.unshift([]);
            this.hexes.unshift([]);
            this.shiftHexNumbers()
        }

        var whichLine = this.leftmostColumn;
        var startOn = this.leftmostColumn;
        
        for (let i = 0; i < columns; i++) {   
            this.addHex(line, 'right', defaultHexProperties)

            if (startOn == 'odd') {
                if (whichLine == 'odd') {
                    whichLine = 'even'
                    line++
                } else {
                    whichLine = 'odd'
                    line = line - 1
                }
            } else {
                if (whichLine == 'even') {
                    whichLine = 'odd'
                    line = line - 1
                } else {
                    whichLine = 'even'
                    line++
                }
            }
        }
        
    },
    addColumn(position, defaultHexProperties) {
        if (position == 'right') {
            if (this.columnsAddedRight % 2 == 0) {
                this.hexes.forEach((element, index) => {
                    if (!(index % 2 == 0)) {
                        this.addHex(index + 1, position, defaultHexProperties)
                    }
                })
            } else {
                this.hexes.forEach((element, index) => {
                    if (index % 2 == 0) {
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
    fillFirstRow(columns, defaultHexProperties) {
        var line = 2;
        var whichRow = 'even';
        for (let i = 1; i < columns; i++) {            
            this.addHex(line, 'right', defaultHexProperties)

            if (whichRow == 'odd') {
                whichRow = 'even'
                line++
            } else {
                whichRow = 'odd'
                line--
            }
        
        }
    },
    initializeHexGrid(rows, columns) {
        const es = useEditorStore()
        this.fillFirstRow(columns, this.defaultHexProperties)
        for (let i = 1; i < rows; i++) {
            this.addRow("bottom", columns, this.defaultHexProperties);
        }
        this.columnsAddedRight = columns - 1;
        es.closeInitializeMapModal()
    },
    initializeMapForTesting() {
        this.initializeHexGrid(8, 8);
    },
    removeHex(hexID) {
        const hex = this.activeHex;
        const hexToRemove = hex(hexID);
        this.hexes[hexToRemove.row - 1].splice(hexToRemove.column - 1)
    },
    setHexTerrain(hexUUID, terrain, maintainEdge) {
        const hex = this.hexByUUID
        const thisHex = hex(hexUUID);
        thisHex.terrain = terrain;
        thisHex.tags.push(terrain)
        if (terrain != 'Default' && maintainEdge) {
            this.maintainEmptyMapEdge(thisHex.row, thisHex.column)
        }
    },
    setHexIcon(hexUUID, icon) {
        const hex = this.hexByUUID
        const thisHex = hex(hexUUID);
        thisHex.icon = icon;
    },
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
            this.addRow('top', this.countColumns, this.defaultHexProperties);
        } else if (row == this.countLines / 2) {
            this.addRow('bottom', this.countColumns, this.defaultHexProperties);
        }
        if (column == 1) {
            this.addColumn('left', this.defaultHexProperties);
            this.toggleLeftmostColumn();
        } else if (column == this.countColumns) {
            this.addColumn('right', this.defaultHexProperties);
        }
        this.shiftHexNumbers();
    },
    toggleLeftmostColumn() {
        if (this.leftmostColumn == 'odd') {
            this.leftmostColumn = 'even'
        } else {
            this.leftmostColumn = 'odd'
        }
    },
    // Return as { tag: {one-away: count, two-away: count, three-away: count}, }
    tagsWithinTwo(hexUUID) {
        var tags = {};
        
        const hex = this.hexByUUID
        const thisHex = hex(hexUUID);

        var oneAwayHexes = null;
        var twoAwayHexes = null;

        // Even line
        if (thisHex.row % 2 == 0) {
            oneAwayHexes = [
                {row: -1, column: 0},
                {row: 1, column: 0},
                {row: 0, column: 1},
                {row: 1, column: 1},
                {row: 0, column: -1},
                {row: 1, column: -1}
            ];
            twoAwayHexes = [
                {row: -2, column: 0},
                {row: 2, column: 0},
                {row: -1, column: 1},
                {row: 2, column: 1},
                {row: -1, column: 2},
                {row: 0, column: 2},
                {row: 1, column: 2},
                {row: 2, column: -1},
                {row: -1, column: -1},
                {row: -1, column: -2},
                {row: 0, column: -2},
                {row: 1, column: -2}
            ];
        // Odd line
        } else { 
            oneAwayHexes = [
                {row: -1, column: 0},
                {row: 1, column: 0},
                {row: -1, column: 1},
                {row: 0, column: 1},
                {row: -1, column: -1},
                {row: 0, column: -1}
            ];
            twoAwayHexes = [
                {row: -2, column: 0},
                {row: 2, column: 0},
                {row: -2, column: 1},
                {row: 1, column: 1},
                {row: -1, column: 2},
                {row: 0, column: 2},
                {row: 1, column: 2},
                {row: -2, column: -1},
                {row: 1, column: -1},
                {row: -1, column: -2},
                {row: 0, column: -2},
                {row: 1, column: -2}
            ];
        }

        const hexByPosition = this.hexByPosition;
        var temp = []
        oneAwayHexes.forEach((element) => {
            console.log('tags within one: trying hex', thisHex.row + element.row, thisHex.column + element.column)
            console.log('rows, columns', this.countRows, this.countColumns)
            if ((thisHex.row + element.row) >= 1 && (thisHex.column + element.column) >= 1 && 
                (thisHex.row + element.row) <= this.hexes.length/2 && (thisHex.column + element.column) <= this.countColumns) {
                    console.log('do it')
                    const hexTags = hexByPosition(thisHex.row + element.row, thisHex.column + element.column).tags
                    hexTags.forEach((tag) => {
                        if (Object.keys(tags).includes(tag)) {
                            tags[tag]['one-away']++
                        } else {
                            tags[tag] = {'one-away': 1, 'two-away': 0}
                        }
                    })
                }
            
        })
        twoAwayHexes.forEach((element) => {
            if ((thisHex.row + element.row) >= 1 && (thisHex.column + element.column) >= 1 && 
                (thisHex.row + element.row) <= this.hexes.length/2 && (thisHex.column + element.column) <= this.countColumns) {
                    const hexTags = hexByPosition(thisHex.row + element.row, thisHex.column + element.column).tags
                    hexTags.forEach((tag) => {
                        if (Object.keys(tags).includes(tag)) {
                            tags[tag]['two-away']++
                        } else {
                            tags[tag] = {'one-away': 0, 'two-away': 1}
                        }
                    })
                }
            
        })

        return tags;
    },
    fillMap(terrainType, rows, columns) {
        // Terrain
        const terrainSetup = this.terrainProperties[terrainType];

        this.seedTerrain(terrainSetup.seeds, rows, columns);

        this.hexes.forEach((row) => {
            row.forEach((hex) => {
                this.generateTerrain(hex.uuid, terrainSetup.odds);
            })
        })

        // Hex contents
        /* this.hexes.forEach((row) => {
            row.forEach((hex) => {
                this.generateHexContents(hex.uuid);
            })
        }) */

        // Maintain empty map edge
        this.addRow('top', this.countColumns, this.defaultHexProperties)
        this.addRow('bottom', this.countColumns, this.defaultHexProperties)
        this.addColumn('right', this.defaultHexProperties)
        this.addColumn('left', this.defaultHexProperties)
    },
    // ***** Add this at some point ?? ***** //
    seedTerrain(seeds, rows, columns) {
        return null
    },
    generateTerrain(hexUUID, odds) {
        const tagsWithinTwoCount = this.tagsWithinTwo(hexUUID);

        console.log('for hex ', hexUUID, 'tags within two is', tagsWithinTwoCount)

        var withinOneMap = {
            0: 0,
            1: 4,
            2: 7,
            3: 9,
            4: 11,
            5: 12,
            6: 13
        }

        const primaryMapOne = {
            0: 0,
            1: 7,
            2: 10,
            3: 13,
            4: 15,
            5: 17,
            6: 19
        }

        const primaryMapTwo = {
            0: 0,
            1: 1,
            2: 2.5,
            3: 4,
            4: 5,
            5: 6,
            6: 7,
            7: 7.5,
            8: 8,
            9: 9,
            10: 9.5,
            11: 10,
            12: 11
        }

        const secondaryMapOne = {
            0: 0,
            1: 2,
            2: 4,
            3: 6,
            4: 7,
            5: 8,
            6: 9
        }

        const secondaryMapTwo = {
            0: 0,
            1: 0.5,
            2: 1,
            3: 2,
            4: 2.5,
            5: 3,
            6: 4,
            7: 4.5,
            8: 5,
            9: 6,
            10: 6.5,
            11: 7,
            12: 7.5
        }

        const tertiaryMapOne = {
            0: 0,
            1: 1,
            2: 2,
            3: 3,
            4: 3.5,
            5: 4,
            6: 4.5
        }

        const tertiaryMapTwo = {
            0: 0,
            1: 1/3,
            2: 2/3,
            3: 1,
            4: 4/3,
            5: 5/3,
            6: 2,
            7: 7/3,
            8: 8/3,
            9: 3,
            10: 3,
            11: 3.5,
            12: 3.5
        }

        console.log('starting odds', odds)

        var terrains = []
        var terrainWeights = []
       
        Object.keys(odds).forEach((tag) => {
            var tempOdds = odds[tag];
            Object.keys(tagsWithinTwoCount).forEach((withinTwoTag) => {
                if (this.terrainInfluencedBy[tag].primary.includes(withinTwoTag)) {
                    tempOdds = tempOdds + primaryMapOne[tagsWithinTwoCount[withinTwoTag]['one-away']] + 
                        primaryMapOne[tagsWithinTwoCount[withinTwoTag]['two-away']]
                } else if (this.terrainInfluencedBy[tag].secondary.includes(withinTwoTag)) {
                    tempOdds = tempOdds + secondaryMapOne[tagsWithinTwoCount[withinTwoTag]['one-away']] + 
                        secondaryMapOne[tagsWithinTwoCount[withinTwoTag]['two-away']]
                } else if (this.terrainInfluencedBy[tag].tertiary.includes(withinTwoTag)) {
                    tempOdds = tempOdds + tertiaryMapOne[tagsWithinTwoCount[withinTwoTag]['one-away']] + 
                        tertiaryMapOne[tagsWithinTwoCount[withinTwoTag]['two-away']]
                }
            })
            terrains.push(tag)
            terrainWeights.push(tempOdds)
        })

        console.log('odds', odds, 'terrains', terrains, 'weights', terrainWeights)

        const thisTerrain = this.weightedRandom(terrains, terrainWeights)

        // Just do a thing
        this.setHexTerrain(hexUUID, thisTerrain, false)
    },
    generateHexContents(hexUUID) {
        // Get hex to be filled
        const hexByUUID = this.hexByUUID;
        const thisHex = hexByUUID(hexUUID);

        // Refine and/or generate tags
        thisHex.tags = this.generateHexTags(hexUUID, thisHex.terrain, thisHex.tags)

        // Generate content from tags
        thisHex.content = this.generateHexDescription(hexUUID, thisHex.terrain, thisHex.tags)

        // Set icon to match contents
        this.setHexIcon(hexUUID, icon);
    },
    // Refine any existing starter tags if needed (e.g., settlment -> town) and generate
    // additional tags as needed
    generateHexTags(hexUUID, terrain, startingTags) {
        var tags = startingTags
        startingTags.forEach((tag) => {
            if (this.tagNeedingRefinement.includes(tag)) {
                tags = refineTag(tag, tags)
            }
        })
        tags = generateTags()
    },
    // Take hex terrain and tags and generate actual content tags / crosslinks
    generateHexDescription(hexUUID, terrain, tags) {
        // Select content somehow??

        // Format it to work with tiptap
        return this.formatContent(content)
    },
    // Take shorthand from content store and convert to Tiptap-compatible format
    formatContent(content) {

    },
    weightedRandom(items, weights) {
        if (items.length !== weights.length) {
          throw new Error('Items and weights must be of the same size');
        }
      
        if (!items.length) {
          throw new Error('Items must not be empty');
        }
      
        // Preparing the cumulative weights array.
        // For example:
        // - weights = [1, 4, 3]
        // - cumulativeWeights = [1, 5, 8]
        const cumulativeWeights = [];
        for (let i = 0; i < weights.length; i += 1) {
          cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
        }
      
        // Getting the random number in a range of [0...sum(weights)]
        // For example:
        // - weights = [1, 4, 3]
        // - maxCumulativeWeight = 8
        // - range for the random number is [0...8]
        const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
        const randomNumber = maxCumulativeWeight * Math.random();
      
        // Picking the random item based on its weight.
        // The items with higher weight will be picked more often.
        for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
          if (cumulativeWeights[itemIndex] >= randomNumber) {
            return items[itemIndex]
          }
        }
    }
  }
})