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
            referenceMirrors: []
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
        return Object.keys(state.terrainInfluencedBy);
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
            // Stores inbound references from other hexes, to be used in content generation
            // { hexUUID: ###, mirrorText: "Text", readyTags: [], refineTags: [] }
            // mirrorText may contain references to the ready / needs-refinement tags to fill in details
            referenceMirrors: []
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
    setHexTerrain(hexUUID, terrain, maintainEdge) {
        const hex = this.hexByUUID
        const thisHex = hex(hexUUID);
        thisHex.terrain = terrain;
        if (terrain != 'Default' && maintainEdge) {
            this.maintainEmptyMapEdge(thisHex.row, thisHex.column)
        }
    },
    setHexIcon(hexUUID, icon) {
        const hex = this.hexByUUID
        const thisHex = hex(hexUUID);
        thisHex.icon = icon;
        console.log('hex', hexUUID,' now set with icon', thisHex.icon, 'from icon', icon)
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
                this.generateTerrain(hex.uuid, terrainSetup.odds);
            })
        })

        // Hex contents
        this.hexes.forEach((row) => {
            row.forEach((hex) => {
                this.generateHexContents(hex.uuid);
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
    generateTerrain(hexUUID, odds) {
        const terrainWithinTwoCount = this.terrainWithinTwo(hexUUID);
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

        // Just do a thing
        this.setHexTerrain(hexUUID, thisTerrain, false)
    },
    generateHexContents(hexUUID) {
        // Get hex to be filled
        const hexByUUID = this.hexByUUID;
        const thisHex = hexByUUID(hexUUID);

        // Refine and/or generate tags that indicate the type of content, if any
        thisHex.tags = this.generateHexTags(hexUUID, thisHex.terrain, thisHex.tags, 0.5)
        console.log('tags generated are', thisHex.tags)

        // Generate content from tags, selecting and filling a matching content template
        //from the tag(s) list(s)
        const descriptionElements = this.generateHexDescription(hexUUID, thisHex.tags, {mention: 'any'})
        thisHex.content = this.formatDescriptionForTiptap(descriptionElements)

        // Set icon to match contents
        var icon = null;
        thisHex.tags.forEach((tag) => {
            if (!Object.keys(this.contentTags).includes(tag)) {
                icon = this.contentTags[this.parentTypeTag(tag)][tag].icon
            }
        })
        console.log("setting icon for hex", thisHex.uuid, "which is", icon)
        this.setHexIcon(thisHex.uuid, icon);
    },
    // Refine any existing starter tags if needed (e.g., settlment -> town) and generate
    // additional tags as needed
    // pointOfInterestChance as a decimal
    generateHexTags(hexUUID, terrain, startingTags, pointOfInterestChance) {
        // If no starting tags, check chance of having a point of interest and generate
        // tags if it meets that chance
        console.log('starting tags', startingTags)
        if (startingTags.length == 0) {
            console.log("starting tags empty")
            if (Math.random() > pointOfInterestChance) {
                console.log("do not make any tags")
                return startingTags;
            } else {
                console.log('make tags')
                const newTags = this.generateHexTag(terrain);
                return newTags;
            }
        // If there are already things in startingTags, refine those as needed
        } else {
            console.log('starting tags not empty')
            var tags = startingTags
            startingTags.forEach((tag) => {
                if (Object.keys(this.contentTags).includes(tag)) {
                    tags = this.refineTag(tag, tags)
                }
            })
            return tags;
        }
    },
    // Generate a new tag (or an empty hex) based on input probabilities and the current terrain
    generateHexTag(terrain) {
        const typeTag = this.weightedRandom(this.pointOfInterest.type, this.pointOfInterest.odds)
        
        console.log('type tag', typeTag)
        return this.refineTag(typeTag, [typeTag])
    },
    refineTag(typeTag, tags) {
        console.log('regining - type tag', typeTag, 'tags', tags)
        var options = Object.keys(this.contentTags[typeTag])
        console.log('options', options)
        var optionWeights = []
        options.forEach((option) => {
            optionWeights.push(this.contentTags[typeTag][option].odds)
        })
        console.log('weights', optionWeights)

        tags.push(this.weightedRandom(options, optionWeights))
        console.log('full tags set is', tags)

        return tags;
    },
    // Take hex terrain and tags and generate actual content tags / crosslinks
    generateHexDescription(hexUUID, tags, hexOptions) {
        var descriptionElements = [];
        const reMention = new RegExp('@[a-zA-Z0-9]+')

        tags.forEach((tag) => {
            console.log('working on tag', tag)
            if (!Object.keys(this.contentTags).includes(tag)) {
                console.log('not a type tag', tag)
                const parentTypeTag = this.parentTypeTag(tag)
                console.log('parent tag', parentTypeTag)
                if (parentTypeTag != null) {
                    console.log('parent is not null - is', parentTypeTag, 'tag is', tag)
                    var options = []
                    var weights = []

                    this.contentTags[parentTypeTag][tag].description.forEach((option) => {
                        console.log('working on option', option)
                        if (hexOptions.mention == 'any' || (hexOptions.mention == 'no' && !reMention.test(option))) {
                            options.push(option.text);
                            weights.push(option.odds)
                        }  
                    })

                    console.log('set options', options, 'and weights', weights)
                    descriptionElements.push(
                        {
                            tag: tag,
                            type: parentTypeTag,
                            text: this.weightedRandom(options, weights)
                        }
                    )
                }
            }
        })

        console.log('description elements', descriptionElements)
        // Format it to work with tiptap
        return descriptionElements;
    },
    parentTypeTag(tag) {
        console.log('finding parent tag for ', tag)
        var parentTag = null;
        Object.keys(this.contentTags).forEach((typeTag) => {
            console.log('is it', typeTag)
            if (Object.keys(this.contentTags[typeTag]).includes(tag)) {
                console.log('it is')
                parentTag = typeTag;
            }
        })
        return parentTag;
    },
    /* Take shorthand from content store and convert to Tiptap-compatible format
    Parsing options: 
        "#text" = select a random one from this tag's "text" property
        "@thing" = mention a hex with tag "thing"
    */
    formatDescriptionForTiptap(descriptionElements) {
        console.log('formatting description')

        var description = {
            type: "doc", 
            content: []
        }

        // Just doing simplest case right now - need to put together a parser for mentions and such
        const reChoice = new RegExp('#[a-zA-Z0-9]+', 'g')
        const reMention = new RegExp('@[a-zA-Z0-9]+', 'g')

        for (let i = 0; i < descriptionElements.length; i++) {

            const element = descriptionElements[i]
            var text = element.text;
            console.log('element is', element, 'text is', text)
            const choiceMatches = text.match(reChoice);
            console.log('choice matches are', choiceMatches)

            const mentionMatches = text.match(reMention);
            console.log('mention matches are', mentionMatches)


            if (choiceMatches != null) {
                console.log('going to try and replace stuff from a list')
                choiceMatches.forEach((match) => {
                    const m = new RegExp(match)
                    console.log('trying to replace', match)
                    text = text.replace(m, this.randomChoice(this.contentTags[element.type][element.tag][match.substring(1)]))
                })
            }

            if (mentionMatches != null) {
                console.log('now try to handle mentions')
                // Title
                description.content.push(
                    {
                        type: "paragraph",
                        content: [
                            {
                                type: "text",
                                text: this.toTitleCase(element.tag),
                                marks: [
                                    {
                                        type: "bold"
                                    }
                                ]
                            }
                        ]
                    }
                )

                description.content.push(
                    {type: "paragraph"}
                )

                // Text with @mentions
                var splitText = text.split(/@[a-zA-Z0-9]+/);
                var resolvedMentions = [];
                console.log('split is', splitText)

                mentionMatches.forEach((match) => {
                    console.log('resolving mention match', match)
                    const hexUUID = this.getMatchingHex(match.substring(1))
                    console.log('with UUID', hexUUID)
                    resolvedMentions.push(hexUUID);
                })

                var line = {
                    type: "paragraph",
                    content: []
                }

                for (let j = 0; j < splitText.length; j++) {
                    console.log('will now push text ', splitText[j], 'and mention of hex', resolvedMentions[j])
                    if (j < splitText.length - 1) {
                        if (splitText[j] != "") {
                            line.content.push(
                                {
                                    type: "text",
                                    text: splitText[j]
                                }
                            )
                        }

                        line.content.push(
                            {
                                type: "mention",
                                attrs: {
                                    uuid: resolvedMentions[j]
                                }
                            }
                        )
                    } else {
                        if (splitText[j] != "") {
                            line.content.push(
                                {
                                    type: "text",
                                    text: splitText[j]
                                }
                            )
                        }
                    }
                }

                console.log('now actually pushing it')
                console.log(description.content)
                description.content.push(line)
                
            } else {
                // Title
                description.content.push(
                    {
                        type: "paragraph",
                        content: [
                            {
                                type: "text",
                                text: this.toTitleCase(element.tag),
                                marks: [
                                    {
                                        type: "bold"
                                    }
                                ]
                            }
                        ]
                    }
                )

                description.content.push(
                    {type: "paragraph"}
                )

                // Text
                description.content.push(
                    {
                        type: "paragraph",
                        content: [
                            {
                                type: "text",
                                text: text
                            }
                        ]
                    }
                )
            }

            if (i < descriptionElements.length - 1) {
                description.content.push(
                    {type: "paragraph"}
                )
            }
        }

        return description;
    },
    getMatchingHex(tag) {
        var validHexes = [];
        var emptyHexes = [];
        var hexCount = 0;

        this.hexes.flat().forEach((hex) => {
            if (hex.tags.length == 0) {
                emptyHexes.push(hex.uuid);
            } else if (hex.tags.includes(tag)) {
                validHexes.push(hex.uuid);
            }
            hexCount++;
        })

        if (validHexes.length > 0) {
            return this.randomChoice(validHexes);
        // Need to add a mechanism to apply the new tag
        } else if (emptyHexes.length > 0) {
            const hexByUUID = this.hexByUUID
            const thisHex = hexByUUID(this.randomChoice(emptyHexes))
            thisHex.tags.push(tag)
            return thisHex.uuid
        // Need to add a mechanism to apply the new tag
        } else {
            const thisHex = this.randomChoice(this.hexes)
            thisHex.tags.push(tag)
            return thisHex.uuid
        }
    },
    randomChoice(options) {
        console.log('choosing - options are', options)
        const index = Math.floor(Math.random() * options.length);
        console.log('index is', index)
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
      }
  }
})