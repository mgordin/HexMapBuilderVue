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
            tags: [],
            startingTags: [],
            referenceMirrors: [],
            mentionTagHovered: false
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
    terrainInfluencedBy: json.terrainInfluencedBy,
    primaryMapOne: {
        0: 0,
        1: 7,
        2: 10,
        3: 13,
        4: 15,
        5: 17,
        6: 19
    },
    primaryMapTwo: {
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
    },
    secondaryMapOne: {
        0: 0,
        1: 2,
        2: 4,
        3: 6,
        4: 7,
        5: 8,
        6: 9
    },
    secondaryMapTwo: {
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
    },
    tertiaryMapOne: {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 3.5,
        5: 4,
        6: 4.5
    },
    tertiaryMapTwo: {
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
    },
    contentTags: {
        "settlement": json.contentTags.settlement,
        "ruin": json.contentTags.ruin,
        "wilderness": json.contentTags.wilderness
    },
    globalFillLists: json.globalFillLists,
    pointOfInterest: {
        type: ["settlement", "ruin", "wilderness"],
        odds: [1,1,1]
    }
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
    tagList: (state) => {
        var tags = Object.keys(state.contentTags)
        Object.keys(state.contentTags).forEach((tag) => {
            tags = tags.concat(Object.keys(state.contentTags[tag]))
        })
        return tags;
    }
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
            tags: [],
            startingTags: [],
            mentionTagHovered: false
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
            this.shiftHexNumbers()
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
    setHexTerrain(thisHex, terrain, maintainEdge) {
        console.log('hex is', thisHex)
        thisHex.terrain = terrain;
        if (terrain != 'Default' && maintainEdge) {
            this.maintainEmptyMapEdge(thisHex.row, thisHex.column)
        }
    },
    setHexIcon(thisHex, icon) {
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
    // Return as { tag: {one-away: count, two-away: count}, }
    terrainWithinTwo(hexUUID) {
        var terrains = {};
        
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
            if ((thisHex.row + element.row) >= 1 && (thisHex.column + element.column) >= 1 && 
                (thisHex.row + element.row) <= this.hexes.length/2 && (thisHex.column + element.column) <= this.countColumns) {
                    const hexTerrain = hexByPosition(thisHex.row + element.row, thisHex.column + element.column).tags
                    if (Object.keys(terrains).includes(hexTerrain)) {
                        terrains[hexTerrain]['one-away']++
                    } else {
                        terrains[hexTerrain] = {'one-away': 1, 'two-away': 0}
                    }
                }
            
        })
        twoAwayHexes.forEach((element) => {
            if ((thisHex.row + element.row) >= 1 && (thisHex.column + element.column) >= 1 && 
                (thisHex.row + element.row) <= this.hexes.length/2 && (thisHex.column + element.column) <= this.countColumns) {
                    const hexTerrain = hexByPosition(thisHex.row + element.row, thisHex.column + element.column).terrain
                    if (Object.keys(terrains).includes(hexTerrain)) {
                        terrains[hexTerrain]['two-away']++
                    } else {
                        terrains[hexTerrain] = {'one-away': 0, 'two-away': 1}
                    }
                }
            
        })

        return terrains;
    },
    fillMap(terrainType, rows, columns) {
        // Terrain
        const terrainSetup = this.terrainProperties[terrainType];

        this.seedTerrain(terrainSetup.seeds, rows, columns);

        this.hexes.forEach((row) => {
            row.forEach((hex) => {
                this.generateTerrain(hex, terrainSetup.odds, false);
            })
        })

        // Hex contents
        this.hexes.forEach((row) => {
            row.forEach((hex) => {
                this.generateHexContents(hex, 'none');
            })
        })

        // Maintain empty map edge
        this.addRow('top', this.countColumns, this.defaultHexProperties)
        this.addRow('bottom', this.countColumns, this.defaultHexProperties)
        this.addColumn('right', this.defaultHexProperties)
        this.addColumn('left', this.defaultHexProperties)
        this.toggleLeftmostColumn();
        this.shiftHexNumbers();
    },
    // ***** Add this at some point ?? ***** //
    seedTerrain(seeds, rows, columns) {
        return null
    },
    generateTerrain(thisHex, odds, maintainEmptyEdge) {
        console.log('generateTerrain')
        const terrainWithinTwoCount = this.terrainWithinTwo(thisHex.uuid);
        var terrains = []
        var terrainWeights = []
       
        Object.keys(odds).forEach((tag) => {
            var tempOdds = odds[tag];
            Object.keys(terrainWithinTwoCount).forEach((withinTwoTerrain) => {
                if (this.terrainInfluencedBy[tag].primary.includes(withinTwoTerrain)) {
                    tempOdds = tempOdds + this.primaryMapOne[terrainWithinTwoCount[withinTwoTerrain]['one-away']] + 
                        this.primaryMapOne[terrainWithinTwoCount[withinTwoTerrain]['two-away']]
                } else if (this.terrainInfluencedBy[tag].secondary.includes(withinTwoTerrain)) {
                    tempOdds = tempOdds + this.secondaryMapOne[terrainWithinTwoCount[withinTwoTerrain]['one-away']] + 
                        this.secondaryMapOne[terrainWithinTwoCount[withinTwoTerrain]['two-away']]
                } else if (this.terrainInfluencedBy[tag].tertiary.includes(withinTwoTerrain)) {
                    tempOdds = tempOdds + this.tertiaryMapOne[terrainWithinTwoCount[withinTwoTerrain]['one-away']] + 
                        this.tertiaryMapOne[terrainWithinTwoCount[withinTwoTerrain]['two-away']]
                }
            })
            terrains.push(tag)
            terrainWeights.push(tempOdds)
        })

        const thisTerrain = this.weightedRandom(terrains, terrainWeights)

        console.log('passing hex to setHexTerrain', thisHex)
        this.setHexTerrain(thisHex, thisTerrain, maintainEmptyEdge)
    },
    // overwrite options: 'full' - change everything, 'description' - keep tags, generate new description,
    // 'none' - don't change it
    generateHexContents(thisHex, overwrite) {
        console.log("!!!!!!!!!!!!! Contents for hex", thisHex.id, "from generateHexContents")


        var startedWithTags = true
        if (thisHex.tags.length == 0) {
            startedWithTags = false
        }

        // Refine and/or generate tags that indicate the type of content, if any
        thisHex.tags = this.generateHexTags(thisHex, 0.5, overwrite)

        if (!startedWithTags || overwrite == 'full' || overwrite == 'description') {
            // Generate content from tags, selecting and filling a matching content template
            //from the tag(s) list(s)
            const descriptionElements = this.generateHexDescription(thisHex, {mention: 'any'})
            var resolveNewTags = []
            const startingDescription = {
                type: "doc", 
                content: []
            }

            thisHex.content = this.formatDescriptionForTiptap(thisHex, startingDescription, descriptionElements, resolveNewTags)

            // Set icon to match contents
            var icon = null;
            thisHex.tags.forEach((tag) => {
                if (!Object.keys(this.contentTags).includes(tag)) {
                    icon = this.contentTags[this.parentTypeTag(tag)][tag].icon
                }
            })
            this.setHexIcon(thisHex, icon);

            resolveNewTags.forEach((hexUpdate) => {
                const hexByUUID = this.hexByUUID
                const newHex = hexByUUID(hexUpdate.uuid)
                this.resolveHexTagUpdate(newHex, hexUpdate.tag)
            })
        }
    },
    // Refine any existing starter tags if needed (e.g., settlment -> town) and generate
    // additional tags as needed
    // pointOfInterestChance as a decimal
    generateHexTags(thisHex, pointOfInterestChance, overwrite) {
        // If no starting tags, check chance of having a point of interest and generate
        // tags if it meets that chance
        if (overwrite == "full") {
            thisHex.tags = []
        }
        if (thisHex.tags.length == 0) {
            if (overwrite == 'full' || overwrite == 'description') {
                const newTags = this.generateHexTag(thisHex.terrain);
                return newTags;
            } else if (Math.random() > pointOfInterestChance) {
                return thisHex.tags;
            } else {
                const newTags = this.generateHexTag(thisHex.terrain);
                return newTags;
            }
        // If there are already things in startingTags, refine those as needed
        } else {
            return this.refineTags(thisHex.tags);
        }
    },
    refineTags(tags) {
        const tagsToRefine = tags.filter(
            tag => Object.keys(this.contentTags).includes(tag) && 
            (tags.filter(t => Object.keys(this.contentTags[tag]).includes(t))).length == 0
        )
        tagsToRefine.forEach((tag) => {
            tags = this.refineTag(tag, tags)
        })
        return tags
    },
    // Generate a new tag (or an empty hex) based on input probabilities and the current terrain
    generateHexTag(terrain) {
        const typeTag = this.weightedRandom(this.pointOfInterest.type, this.pointOfInterest.odds)
        
        return this.refineTag(typeTag, [typeTag])
    },
    refineTag(typeTag, tags) {
        if (Object.keys(this.contentTags).includes(typeTag)) {
            var options = Object.keys(this.contentTags[typeTag])
            var optionWeights = []
            options.forEach((option) => {
                optionWeights.push(this.contentTags[typeTag][option].odds)
            })

            tags.push(this.weightedRandom(options, optionWeights))

            return tags;
        } else {
            return tags;
        }
    },
    // Take hex terrain and tags and generate actual content tags / crosslinks
    generateHexDescription(thisHex, hexOptions) {
        var descriptionElements = [];
        const reMention = new RegExp('@[-a-zA-Z0-9:|=]+', 'g')

        thisHex.tags.forEach((tag) => {
            if (!Object.keys(this.contentTags).includes(tag)) {
                const parentTypeTag = this.parentTypeTag(tag)
                if (parentTypeTag != null) {
                    var options = []
                    var weights = []

                    var tagDetails = this.contentTags[parentTypeTag][tag];
                    Object.keys(tagDetails).forEach((field) => {
                        if (tagDetails[field][0] == 'ref') {
                            const s = tagDetails[field][1].split(":");
                            tagDetails[field] = this.contentTags[s[0]][s[1]][field]
                        }
                    })

                    // Description
                    var descriptionsAndHooks = ""
                    console.log(tag, tagDetails.description)
                    tagDetails.description.forEach((option) => {
                        if (hexOptions.mention == 'any') {
                            options.push(option.text);
                            weights.push(option.odds);
                        } else if (hexOptions.mention == 'no' && !reMention.test(option.text)) {
                            options.push(option.text);
                            weights.push(option.odds);
                        }
                    })

                    descriptionsAndHooks = descriptionsAndHooks + this.weightedRandom(options, weights)

                    // Hooks
                    options = []
                    weights = []
                    console.log(tag, tagDetails.hook)
                    tagDetails.hook.forEach((option) => {
                        if (hexOptions.mention == 'any') {
                            options.push(option.text);
                            weights.push(option.odds);
                        } else if (hexOptions.mention == 'no' && !reMention.test(option.text)) {
                            options.push(option.text);
                            weights.push(option.odds);
                        }
                    })

                    descriptionsAndHooks = descriptionsAndHooks + "\n" + this.weightedRandom(options, weights)

                    descriptionElements.push(
                        {
                            tag: tag,
                            type: parentTypeTag,
                            text: descriptionsAndHooks
                        }
                    )
                }
            }
        })

        // Format it to work with tiptap
        return descriptionElements;
    },
    parentTypeTag(tag) {
        var parentTag = null;
        Object.keys(this.contentTags).forEach((typeTag) => {
            if (Object.keys(this.contentTags[typeTag]).includes(tag)) {
                parentTag = typeTag;
            }
        })
        return parentTag;
    },
    resolveNameAndTerrain(element, terrain) {
        const name = this.randomChoice(this.contentTags[element.type][element.tag].names);
        element.text = element.text.replace('&name', name);
        element.text = element.text.replace('&terrain', terrain);
        console.log('element is now', element)

        return {'element': element, 'name': name};
    }, 
    resolveContentChoices(element) {
        const reChoice = new RegExp('[#!][a-zA-Z0-9|]+')

        var text = element.text;
        console.log('text:', element)
        const choiceMatches = text.match(reChoice);
        console.log('element', element)
        console.log('text:', text)
        console.log('matches:', choiceMatches)


        if (choiceMatches != null) {
            choiceMatches.forEach((match) => {
                const matchSplitOptions = match.split("||")
                const choiceType = matchSplitOptions[0].substring(0,1)
                matchSplitOptions[0] = matchSplitOptions[0].substring(1)
                const choiceList = this.randomChoice(matchSplitOptions)
                console.log('opt:', matchSplitOptions)
                console.log('choiceList:', choiceList)
                if (choiceType == "#") {
                    text = text.replace(reChoice, this.randomChoice(this.contentTags[element.type][element.tag][choiceList]))
                } else if (choiceType == "!") {
                    text = text.replace(reChoice, this.randomChoice(this.globalFillLists[choiceList]))
                }
                
                console.log('new text:', text)
            })
            element.text = text
            return this.resolveContentChoices(element)
        } else {
            return text;
        }
    },
    resolveLineBreaks(text) {
        const reBreak = new RegExp('\\n','g')
        
        if (!reBreak.test(text)) {
            return [{type: "text", content: text}]
        } else {
            var blocks = [];

            var splitText = text.split(/\n/);

            for (let i = 0; i < splitText.length; i++) {
                
                if (splitText[i] != "") {
                    blocks.push({type: "text", content: splitText[i]})
                }
                if (i < splitText.length - 1) {
                    blocks.push({type: "break", content: "\n"})
                }
            }


            return blocks;
        }
    },
    // Mention syntax example: @tagOptionA||tagOptionB:dist=lt3s
    resolveContentMentions(thisHex, blocks, resolveNewTags) {
        var updatedBlocks = [];

        // Regex to use instead for getting params above: const r = new RegExp('@[a-zA-Z0-9|:<=>]+', 'g')
        const reMention = new RegExp('@[-a-zA-Z0-9|:=]+', 'g')

        console.log('blocks', blocks)
        blocks.forEach((block) => {
            const mentionMatches = block.content.match(reMention);
            if (mentionMatches == null) {
                updatedBlocks.push(block)
            } else {
                var splitText = block.content.split(/@[-a-zA-Z0-9|:=]+/);
                var resolvedMentions = [];

                // Loop through mentions and resolve them
                mentionMatches.forEach((match) => {

                    var matchSplitParams = match.split(":")
                    const matchSplitOptions = matchSplitParams[0].split("||")
                    matchSplitOptions[0] = matchSplitOptions[0].substring(1)
                    var matchConstraints = matchSplitParams.slice(1)

                    const reDistance = new RegExp('([a-z]+)([0-9]+)([a-z]+)')

                    for (let i = 0; i < matchConstraints.length; i++) {
                        const constraint = matchConstraints[i]
                        const distanceConstraint = constraint.match(reDistance)
                        if (distanceConstraint != null) {
                            matchConstraints[i] = {
                                condition: distanceConstraint[1],
                                distanceBound: distanceConstraint[2],
                                conditionType: distanceConstraint[3]
                            }
                        }
                    }

                    const matchParams = {
                        tag: this.randomChoice(matchSplitOptions),
                        constraints: matchConstraints
                    }

                    const t1 = performance.now()
                    const matchingHex = this.getMatchingHex(matchParams, thisHex)
                    const t2 = performance.now()
                    console.log('MENT-TIME: getMatchingHex', t2 - t1)
                    resolvedMentions.push(matchingHex.uuid);
                    if (matchingHex.type != 'existing') {
                        resolveNewTags.push({tag: matchParams.tag, uuid: matchingHex.uuid})
                    }
                })

                // Make a blocks array where each thing that should end us as a node
                // is its own block
                for (let i = 0; i < splitText.length; i++) {
                    
                    if (splitText[i] != "") {
                        updatedBlocks.push({type: "text", content: splitText[i]})
                    }
                    if (i < splitText.length - 1) {
                        updatedBlocks.push({type: "mention", content: resolvedMentions[i]})
                    }
                }
            }
        })

        return updatedBlocks;
    },
    setTiptapNodes(description, blocks, tag, name) {

        description.content.push({
            type: "paragraph",
            content: [{
                type: "text",
                text: this.toTitleCase(name),
                marks: [
                    {
                        type: "bold"
                    }
                ]
            }]
        });

        var paragraph = {
            type: "paragraph",
            content: []
        };


        blocks.forEach((block) => {
            // Node should be a paragraph break - end previous node and add that
            if (block.type == "break") {
                if (paragraph.content.length > 0) {
                    description.content.push(paragraph)
                    paragraph = {
                        type: "paragraph",
                        content: []
                    };
                }
                description.content.push({type: "paragraph"})
            // Node is just text
            } else if (block.type == "text") {
                paragraph.content.push({
                    type: "text",
                    text: block.content
                })
            // Node is an @-mention of a hex
            } else if (block.type == "mention") {
                paragraph.content.push({
                    type: "mention",
                    attrs: {
                        uuid: block.content
                    }
                })
            }
        })
        if (paragraph.content.length > 0) {
            description.content.push(paragraph)
        }

        return description;
    },
    addLineBreak(description) {
        description.content.push(
            {type: "paragraph"}
        )
        return description;
    },
    formatDescriptionForTiptap(thisHex, startingDescription, descriptionElements, resolveNewTags) {

        var description = startingDescription;

        for (let i = 0; i < descriptionElements.length; i++) {
            var element = descriptionElements[i];
            
            var elementPlus = this.resolveNameAndTerrain(element, thisHex.terrain)
            console.log('en', elementPlus)
            var text = this.resolveContentChoices(elementPlus.element);
            console.log('t', text)

            var blocks = this.resolveLineBreaks(text);

            blocks = this.resolveContentMentions(thisHex, blocks, resolveNewTags);
            console.log('blocks pt2', blocks)

            description = this.setTiptapNodes(description, blocks, element.tag, elementPlus.name);
            if (i < descriptionElements.length - 1) {
                description = this.addLineBreak(description)
            }
        }
        return description;
    },
    resolveMatchingHexConstraints(constraints, activeHex, checkHex) {
        if (constraints.length == 0) {
            return 'preferred';
        } else {
            return this.checkHexDistanceConstraint(constraints, activeHex, checkHex);
        }
    },
    // syntax for constraints is as [constraint][distance][type]
    // constraint = lt, lte, gt, gte, eq
    // distance = the distance number
    // type = s for soft constraint, h for hard constraint
    checkHexDistanceConstraint(constraints, thisHex, checkHex) {

        const distance = this.hexToHexDistance(thisHex, checkHex)

        for (let i = 0; i < constraints.length; i++) {
                
            if (constraints[i].condition == 'lt') {
                if (constraints[i].conditionType == 's') {
                    if (distance < constraints[i].distanceBound) {
                        return 'preferred'
                    } else {
                        
                        return 'accepted'
                    }
                } else {
                    if (distance < constraints[i].distanceBound) {
                        return 'preferred'
                    } else {
                        
                        return 'invalid'
                    }
                }
            } else if (constraints[i].condition == 'lte') {
                if (constraints[i].conditionType == 's') {
                    if (distance <= constraints[i].distanceBound) {
                        
                        return 'preferred'
                    } else {
                        
                        return 'accepted'
                    }
                } else {
                    if (distance <= constraints[i].distanceBound) {
                        
                        return 'preferred'
                    } else {
                        
                        return 'invalid'
                    }
                }
            } else if (constraints[i].condition == 'gt') {
                if (constraints[i].conditionType == 's') {
                    if (distance > constraints[i].distanceBound) {
                        
                        return 'preferred'
                    } else {
                        
                        return 'accepted'
                    }
                } else {
                    if (distance > constraints[i].distanceBound) {
                        
                        return 'preferred'
                    } else {
                        
                        return 'invalid'
                    }
                }
            } else if (constraints[i].condition == 'gte') {
                if (constraints[i].conditionType == 's') {
                    if (distance >= constraints[i].distanceBound) {
                        
                        return 'preferred'
                    } else {
                        
                        return 'accepted'
                    }
                } else {
                    if (distance >= constraints[i].distanceBound) {
                        
                        return 'preferred'
                    } else {
                        
                        return 'invalid'
                    }
                }
            } else if (constraints[i].condition == 'eq') {
                if (constraints[i].conditionType == 's') {
                    if (distance == constraints[i].distanceBound) {
                        
                        return 'preferred'
                    } else {
                        
                        return 'accepted'
                    }
                } else {
                    if (distance == constraints[i].distanceBound) {
                        
                        return 'preferred'
                    } else {
                        
                        return 'invalid'
                    }
                }
            }
        }

    },
    getMatchingHex(matchParams, thisHex) {
        
        // Quickly now to not break it yet
        const tag = matchParams.tag

        var taggedHexes = {preferred: [], accepted: []};
        var emptyHexes = {preferred: [], accepted: []};
        var otherHexes = {preferred: [], accepted: []};

        // Check through all hexes and find ones matching the (soft or hard) constraints
        const h = this.hexes.flat()
        var t0 = performance.now()

        h.forEach((hex) => {
            if (hex.tags.length == 0 && hex.uuid != thisHex.uuid) {
                const c = this.resolveMatchingHexConstraints(matchParams.constraints, thisHex, hex)
                if (c == 'preferred') {
                    emptyHexes.preferred.push(hex.uuid);
                } else if (c == 'accepted') {
                    emptyHexes.accepted.push(hex.uuid);
                }
            } else if (hex.tags.includes(tag) && hex.uuid != thisHex.uuid) {
                const c = this.resolveMatchingHexConstraints(matchParams.constraints, thisHex, hex)
                if (c == 'preferred') {
                    taggedHexes.preferred.push(hex.uuid);
                } else if (c == 'accepted') {
                    taggedHexes.accepted.push(hex.uuid);
                }
            } else {
                const c = this.resolveMatchingHexConstraints(matchParams.constraints, thisHex, hex)
                if (c == 'preferred') {
                    otherHexes.preferred.push(hex.uuid);
                } else if (c == 'accepted') {
                    otherHexes.accepted.push(hex.uuid);
                }
            }
        })
        var tf = performance.now()
        console.log("CONST---TIME: ", tf - t0)

      


        const t1 = performance.now()
        var matchType = null;
        if (taggedHexes.preferred.length > 2) {
            const c = { uuid: this.randomChoice(taggedHexes.preferred), type: 'existing' };
            const t2 = performance.now()
            console.log('RESOLVE---TIME: 1: ', t2 - t1)
            return c;

        } else if (taggedHexes.preferred.length > 0 && emptyHexes.preferred.length > 4) {
            if (this.randomChoice(['empty', 'existing']) == 'existing') {
                const c = { uuid: this.randomChoice(taggedHexes.preferred), type: 'existing' };
                const t2 = performance.now()
                console.log('RESOLVE---TIME: 2: ', t2 - t1)
                return c

            } else {
                const hexByUUID = this.hexByUUID
                const thisHex = hexByUUID(this.randomChoice(emptyHexes.preferred))
                thisHex.startingTags.push(tag)
                const c = { uuid: thisHex.uuid, type: "empty" }
                const t2 = performance.now()
                console.log('RESOLVE---TIME: 3: ', t2 - t1)
                return c;
            }
        } else if (taggedHexes.preferred.length > 0) {
            const c = { uuid: this.randomChoice(taggedHexes.preferred), type: 'existing' };
            const t2 = performance.now()
            console.log('RESOLVE---TIME: 4: ', t2 - t1)
            return c;

        // Need to add a mechanism to apply the new tag
        } else if (emptyHexes.preferred.length > 0) {
            const hexByUUID = this.hexByUUID
            const thisHex = hexByUUID(this.randomChoice(emptyHexes.preferred))
            thisHex.startingTags.push(tag)
            const c = { uuid: thisHex.uuid, type: "empty" }
            const t2 = performance.now()
            console.log('RESOLVE---TIME: 5: ', t2 - t1)
            return c;

        } else if (otherHexes.preferred.length > 0) {
            const hexByUUID = this.hexByUUID
            const thisHex = hexByUUID(this.randomChoice(otherHexes.preferred))
            thisHex.startingTags.push(tag)
            const c = { uuid: thisHex.uuid, type: "random" }
            const t2 = performance.now()
            console.log('RESOLVE---TIME: 6: ', t2 - t1)
            return c;

        } else if (taggedHexes.preferred.length > 2) {
            const c = { uuid: this.randomChoice(taggedHexes.preferred), type: 'existing' };
            const t2 = performance.now()
            console.log('RESOLVE---TIME: 7: ', t2 - t1)
            return c;

        } else if (taggedHexes.preferred.length > 0 && emptyHexes.length.preferred > 4) {
            if (this.randomChoice(['empty', 'existing']) == 'existing') {
                const c = { uuid: this.randomChoice(taggedHexes.preferred), type: 'existing' };
                const t2 = performance.now()
                console.log('RESOLVE---TIME: 8: ', t2 - t1)
                return c;

            } else {
                const hexByUUID = this.hexByUUID
                const thisHex = hexByUUID(this.randomChoice(emptyHexes.preferred))
                thisHex.startingTags.push(tag)
                const c = { uuid: thisHex.uuid, type: "empty" }
                const t2 = performance.now()
                console.log('RESOLVE---TIME: 9: ', t2 - t1)
                return c;
            }
        } else if (taggedHexes.accepted.length > 0) {
            const c = { uuid: this.randomChoice(taggedHexes.accepted), type: 'existing' };
            const t2 = performance.now()
            console.log('RESOLVE---TIME: 10: ', t2 - t1)
            return c;

        // Need to add a mechanism to apply the new tag
        } else if (emptyHexes.accepted.length > 0) {
            const hexByUUID = this.hexByUUID
            const thisHex = hexByUUID(this.randomChoice(emptyHexes.accepted))
            thisHex.startingTags.push(tag)
            const c = { uuid: thisHex.uuid, type: "empty" }
            const t2 = performance.now()
            console.log('RESOLVE---TIME: 11: ', t2 - t1)
            return c;

        } else if (otherHexes.accepted.length > 0) {
            const hexByUUID = this.hexByUUID
            const thisHex = hexByUUID(this.randomChoice(otherHexes.accepted))
            thisHex.startingTags.push(tag)
            const c = { uuid: thisHex.uuid, type: "random" }
            const t2 = performance.now()
            console.log('RESOLVE---TIME: 12: ', t2 - t1)
            return c;

        // Need to add a mechanism to apply the new tag
        } else {
            const thisHex = this.randomChoice(this.hexes.flat())
            thisHex.startingTags.push(tag)
            const c = { uuid: thisHex.uuid, type: "random" }
            const t2 = performance.now()
            console.log('RESOLVE---TIME: 13: ', t2 - t1)
            return c;
        }
    },
    resolveHexTagUpdate(thisHex, tag) {        

        console.log("!!!!!!-------------!!!!!!! Contents for hex", thisHex.id, "from resolveHexTagUpdate !!!!!!-------------!!!!!!!")


        var useMentions = 'any'
        if (thisHex.tags.length > 0) {
            useMentions = 'no'
        }

        var tags = this.refineTag(tag, [tag])
        tags.forEach((tag) => {
            thisHex.tags.push(tag)
        })
        
        const descriptionElements = this.generateHexDescription(thisHex, {mention: useMentions})
        var resolveNewTags = []
        var startingDescription = {
            type: "doc", 
            content: []
        }
        if (thisHex.content != null) {
            startingDescription = thisHex.content
        }
        thisHex.content = this.formatDescriptionForTiptap(thisHex, startingDescription, descriptionElements, resolveNewTags)

         // Set icon to match contents
         var icon = null;
         thisHex.tags.forEach((tag) => {
             if (!Object.keys(this.contentTags).includes(tag)) {
                 icon = this.contentTags[this.parentTypeTag(tag)][tag].icon
             }
         })
         this.setHexIcon(thisHex, icon);

         resolveNewTags.forEach((hexUpdate) => {
             const hexByUUID = this.hexByUUID
             const newHex = hexByUUID(hexUpdate.uuid)
             this.resolveHexTagUpdate(newHex, hexUpdate.tag)
         })

    },
    cubeHex(q, r, s) {
        if (Math.round(q + r + s) !== 0) throw "q + r + s must be 0";
        return {q: q, r: r, s: s};
    },
    convertToCubeCoordinates(row, col) {
        var offset = 1
        if (this.leftmostColumn == 'odd') {
            var offset = -1
        }
        var q = col-1;
        var r = row-1 - (col-1 + offset * ((col-1) & 1)) / 2;
        var s = -q - r;

        return this.cubeHex(q, r, s);
    },
    cubeHexSubtract(cubeHexA, cubeHexB) {
        return this.cubeHex(cubeHexA.q - cubeHexB.q, cubeHexA.r - cubeHexB.r, cubeHexA.s - cubeHexB.s);
    },
    cubeHexLength(cubeHex) {
        return (Math.abs(cubeHex.q) + Math.abs(cubeHex.r) + Math.abs(cubeHex.s)) / 2;
    },
    cubeHexDistance(cubeHexA, cubeHexB) {
        return this.cubeHexLength(this.cubeHexSubtract(cubeHexA, cubeHexB));
    },
    hexToHexDistance(hexA, hexB) {
        const cubeHexA = this.convertToCubeCoordinates(hexA.row, hexA.column);
        const cubeHexB = this.convertToCubeCoordinates(hexB.row, hexB.column);
        return this.cubeHexDistance(cubeHexA, cubeHexB);
    },
    randomChoice(options) {
        const index = Math.floor(Math.random() * options.length);
        return options[index];
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
    },
    toTitleCase(str) {
        return str.replace(
          /\w\S*/g,
          function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }
        );
    },
    logHexDistances() {
        const es = useEditorStore();
        const hexByUUID = this.hexByUUID;
        console.log("active hexes are", es.activeHexes)
        const hexA = hexByUUID(es.activeHexes[0])
        const hexB = hexByUUID(es.activeHexes[1])
        console.log("Distance between hexes", hexA.id, "and", hexB.id, "is", this.hexToHexDistance(hexA, hexB))
    },
    mentionedByHexes(hexUUID) {
        var mentioningHexes = []
        this.hexes.flat().forEach((hex) => {
            if (hex.content != null) {
                if (hex.content.content.length > 0) {
                        hex.content.content.forEach((paragraph) => {
                            if (paragraph.content != undefined) {
                                paragraph.content.forEach((node) => {
                                    if (node.type == 'mention') {
                                        if (node.attrs.uuid == hexUUID) {
                                            mentioningHexes.push(hex)
                                        }
                                    }
                                })
                            }
                            
                        })
                }
            }
            
        })
        return mentioningHexes
    },
    exportMap() {

        const content = {
            hexes: this.hexes,
            leftmostColumn: this.leftmostColumn,
            nthChildShift: this.nthChildShift,
            uuid: this.uuid
        }

        const a = document.createElement('a');
        const file = new Blob([JSON.stringify(content)], {type: 'application/json'});
        
        a.href= URL.createObjectURL(file);
        a.download = "map.json";
        a.click();

        URL.revokeObjectURL(a.href);
    },
    loadMap() {
        var input = document.createElement('input');
        input.type = 'file';

        input.onchange = e => { 

            // getting a hold of the file reference
            var file = e.target.files[0]; 

            // setting up the reader
            var reader = new FileReader();
            reader.readAsText(file,'UTF-8');

            // here we tell the reader what to do when it's done reading...
            reader.onload = readerEvent => {
                var content = readerEvent.target.result; // this is the content!
                content = JSON.parse(content)
                this.hexes = content.hexes;
                this.leftmostColumn = content.leftmostColumn;
                this.nthChildShift = content.nthChildShift;
                this.uuid = content.uuid
            }
        }

        input.click();
    },
    rerandomizeHexes(randomizeType) {
        const es = useEditorStore()
        const hexByUUID = this.hexByUUID
        es.activeHexes.forEach((hexUUID) => {
            this.rerandomizeHex(hexByUUID(hexUUID), randomizeType)
        })
    },
    rerandomizeHex(thisHex, randomizeType) {
        const es = useEditorStore();

        if (randomizeType == 'description') {
            this.generateHexContents(thisHex, 'description');

        } else if (randomizeType == 'tags+description') {
            this.generateHexContents(thisHex, 'full');

        } else if (randomizeType == 'terrain') {
            this.generateTerrain(thisHex, this.terrainProperties[es.terrainType].odds, true);

        } else if (randomizeType == 'all') {
            this.generateTerrain(thisHex, this.terrainProperties[es.terrainType].odds, true);
            this.generateHexContents(thisHex, 'full')
        }
    },
    initializeMap(terrainType, rows, columns) {
        this.initializeHexGrid(rows, columns)
        this.fillMap(terrainType, rows, columns)
    },
    getContentAsHTML(content) {
        const e = new Editor({
            content: content,
          })
        return e.getHTML()
    },
    getContentAsPlainText(content) {
        var text = ""
        console.log(content)
        if (content != null) {
            const hexByUUID = this.hexByUUID
            content.content.forEach((paragraph) => {
                console.log('par')
                if (Object.keys(paragraph).includes('content')) {
                    paragraph.content.forEach((node) => {
                        console.log('node')
                        if (node.type == "text") {
                            text = text + node.text
                        } else if (node.type == "mention") {
                            text = text + hexByUUID(node.attrs.uuid)
                        }
                    })
                }
            })
        }
        console.log(text)
        return text.substring(0, 60)
    }
  }
  
})