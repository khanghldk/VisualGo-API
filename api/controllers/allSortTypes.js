var HIGHLIGHT_NONE = "lightblue";
var HIGHLIGHT_STANDARD = "green";
var HIGHLIGHT_SPECIAL = "#DC143C";
var HIGHLIGHT_SORTED = "orange";

var HIGHLIGHT_LEFT = "#3CB371";
var HIGHLIGHT_RIGHT = "#9932CC";
var HIGHLIGHT_PIVOT = "yellow";

var POSITION_USE_PRIMARY = "a";
var POSITION_USE_SECONDARY_IN_DEFAULT_POSITION = "b";

var Entry = function (value, highlight, position, secondaryPositionStatus) {
    this.value = value; // number
    this.highlight = highlight; // string, use HIGHLIGHT_ constants
    this.position = position; // number
    this.secondaryPositionStatus = secondaryPositionStatus; // integer, +ve for position overwrite, -ve for absolute postion (-1 for 0th absolution position)
}

var Backlink = function (value, highlight, entryPosition, secondaryPositionStatus) {
    this.value = value; // number
    this.highlight = highlight; // string, use HIGHLIGHT_ constants
    this.entryPosition = entryPosition; // number
    this.secondaryPositionStatus = secondaryPositionStatus; // integer, +ve for position overwrite
}

var State = function (entries, backlinks, barsCountOffset, status, lineNo, logMessage) {
    this.entries = entries; // array of Entry's
    this.backlinks = backlinks; // array of Backlink's
    this.barsCountOffset = barsCountOffset; // how many bars to "disregard" (+ve) or to "imagine" (-ve) w.r.t. state.entries.length when calculating the centre position
    this.status = status;
    this.lineNo = lineNo; //integer or array, line of the code to highlight
    this.logMessage = logMessage;
}


var EntryBacklinkHelper = new Object();
EntryBacklinkHelper.appendList = function (entries, backlinks, numArray) {
    for (var i = 0; i < numArray.length; i++) {
        EntryBacklinkHelper.append(entries, backlinks, numArray[i]);
    }
}

EntryBacklinkHelper.append = function (entries, backlinks, newNumber) {
    entries.push(new Entry(newNumber, HIGHLIGHT_NONE, entries.length, POSITION_USE_PRIMARY));
    backlinks.push(new Backlink(newNumber, HIGHLIGHT_NONE, backlinks.length, POSITION_USE_PRIMARY));
}

EntryBacklinkHelper.update = function (entries, backlinks) {
    for (var i = 0; i < backlinks.length; i++) {
        entries[backlinks[i].entryPosition].highlight = backlinks[i].highlight;
        entries[backlinks[i].entryPosition].position = i;
        entries[backlinks[i].entryPosition].secondaryPositionStatus = backlinks[i].secondaryPositionStatus;
    }
}

EntryBacklinkHelper.copyEntry = function (oldEntry) {
    return new Entry(oldEntry.value, oldEntry.highlight, oldEntry.position, oldEntry.secondaryPositionStatus);
}

EntryBacklinkHelper.copyBacklink = function (oldBacklink) {
    return new Backlink(oldBacklink.value, oldBacklink.highlight, oldBacklink.entryPosition, oldBacklink.secondaryPositionStatus);
}

EntryBacklinkHelper.swapBacklinks = function (backlinks, i, j) {
    var swaptemp = backlinks[i];
    backlinks[i] = backlinks[j];
    backlinks[j] = swaptemp;
}

// class StateHelper
var StateHelper = new Object();

StateHelper.createNewState = function (numArray) {
    var entries = new Array();
    var backlinks = new Array();
    EntryBacklinkHelper.appendList(entries, backlinks, numArray);
    return new State(entries, backlinks, 0, "", 0);
}

StateHelper.copyState = function (oldState) {
    var newEntries = new Array();
    var newBacklinks = new Array();
    for (var i = 0; i < oldState.backlinks.length; i++) {
        newEntries.push(EntryBacklinkHelper.copyEntry(oldState.entries[i]));
        newBacklinks.push(EntryBacklinkHelper.copyBacklink(oldState.backlinks[i]));
    }

    var newLineNo = oldState.lineNo;
    if (newLineNo instanceof Array)
        newLineNo = oldState.lineNo.slice();

    return new State(newEntries, newBacklinks, oldState.barsCountOffset, oldState.status, newLineNo, oldState.logMessage);
}

StateHelper.updateCopyPush = function (list, stateToPush) {
    EntryBacklinkHelper.update(stateToPush.entries, stateToPush.backlinks);
    list.push(StateHelper.copyState(stateToPush));
}

var initLogMessage = function (state) {
    state.logMessage = "original array = [";

    for (var i = 0; i < state.backlinks.length - 1; i++) {
        state.logMessage += state.backlinks[i].value + ", ";
    }

    state.logMessage += state.backlinks[state.backlinks.length - 1].value + "]";
}

var generateRandomNumber = function (min, max) { //generates a random integer between min and max (both inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var statelist;

exports.bubbleSort = function (dataList) {
    statelist = [StateHelper.createNewState(dataList)];
    var numElements = statelist[0].backlinks.length;
    var state = StateHelper.copyState(statelist[0]);
    var swapCounter = 0;

    //initLogMessage(state);

    var swapped;
    var indexOfLastUnsortedElement = numElements;
    do {
        swapped = false;

        // Set the swapped flag to false.
        // Then iterate from 1 to {endIdx} inclusive.
        state.status = '<div>Set the swapped flag to false.</div><div>Then iterate from 1 to {endIdx} inclusive.</div>'.replace("{endIdx}", indexOfLastUnsortedElement - 1);
        state.logMessage = '<div>Set the swapped flag to false.</div><div>Then iterate from 1 to {endIdx} inclusive.</div>'.replace("{endIdx}", indexOfLastUnsortedElement - 1)
            + state.logMessage;
        state.lineNo = [2, 3];
        StateHelper.updateCopyPush(statelist, state);

        for (var i = 1; i < indexOfLastUnsortedElement; i++) {
            state.backlinks[i - 1].highlight = HIGHLIGHT_STANDARD;
            state.backlinks[i].highlight = HIGHLIGHT_STANDARD;

            // Checking if {val1} > {val2} and swap them if that is true.
            // The current value of swapped = {swapped}.
            state.status = '<div>Checking if {val1} &gt; {val2} and swap them if that is true.</div><div>The current value of swapped = {swapped}.</div>'
                .replace("{val1}", state.backlinks[i - 1].value)
                .replace("{val2}", state.backlinks[i].value)
                .replace("{swapped}", swapped);
            state.logMessage = '<div>Checking if {val1} &gt; {val2} and swap them if that is true.</div><div>The current value of swapped = {swapped}.</div>'
                .replace("{val1}", state.backlinks[i - 1].value)
                .replace("{val2}", state.backlinks[i].value)
                .replace("{swapped}", swapped) + state.logMessage;
            state.lineNo = 4;
            StateHelper.updateCopyPush(statelist, state);

            if (state.backlinks[i - 1].value > state.backlinks[i].value) {
                swapped = true;

                // Swapping the positions of {val1} and {val2}.
                // Set swapped = true.
                state.status = '<div>Swapping the positions of {val1} and {val2}.</div><div>Set swapped = true.</div>'
                    .replace("{val1}", state.backlinks[i - 1].value)
                    .replace("{val2}", state.backlinks[i].value);
                // state.logMessage = '<div>swap {val1} and {val2}</div>'
                //     .replace("{val1}", state.backlinks[i - 1].value)
                //     .replace("{val2}", state.backlinks[i].value) + state.logMessage;
                state.logMessage = '<div>Swapping the positions of {val1} and {val2}.</div><div>Set swapped = true.</div>'
                    .replace("{val1}", state.backlinks[i - 1].value)
                    .replace("{val2}", state.backlinks[i].value) + state.logMessage;
                if (this.computeInversionIndex) {
                    swapCounter++;
                    // For inversion index computation: Add 1 to swapCounter.
                    // The current value of swapCounter = {swapCounter}.
                    state.status += ' For inversion index: Add 1 to swapCounter.<div>Current value of swapCounter = {swapCounter}.</div>'.replace("{swapCounter}", swapCounter);
                }

                state.lineNo = [5, 6];

                EntryBacklinkHelper.swapBacklinks(state.backlinks, i, i - 1);
                StateHelper.updateCopyPush(statelist, state);
            }

            state.backlinks[i - 1].highlight = HIGHLIGHT_NONE;
            state.backlinks[i].highlight = HIGHLIGHT_NONE;
        }

        indexOfLastUnsortedElement--;
        state.backlinks[indexOfLastUnsortedElement].highlight = HIGHLIGHT_SORTED;
        if (swapped == false) {
            // No swap is done in this pass.
            // We can terminate Bubble Sort now.
            state.status = '<div>No swap is done in this pass.</div><div>We can terminate Bubble Sort now</div>';
            state.logMessage = '<div>No swap is done in this pass.</div><div>We can terminate Bubble Sort now</div>' + state.logMessage;
        } else {
            // Mark last unsorted element as sorted now.
            // As at least one swap is done in this pass, we continue.
            state.status = '<div>Mark last unsorted element as sorted now.</div><div>As at least one swap is done in this pass, we continue.</div>';
            state.logMessage = '<div>Mark last unsorted element as sorted now.</div><div>As at least one swap is done in this pass, we continue.</div>' + state.logMessage;
        }
        state.lineNo = 7;
        StateHelper.updateCopyPush(statelist, state);
    }
    while (swapped);

    for (var i = 0; i < numElements; i++)
        state.backlinks[i].highlight = HIGHLIGHT_SORTED;

    // The array/list is now sorted.
    state.status = '<div>List sorted!</div>';
    state.logMessage = '<div>List sorted!</div>' + state.logMessage;
    if (this.computeInversionIndex)
    // Inversion Index = {swapCounter}.
        state.status += ' Inversion Index = {swapCounter}.'.replace("swapCounter", swapCounter);

        state.lineNo = 0;
    StateHelper.updateCopyPush(statelist, state);

    return statelist;
}

exports.selectionSort = function (dataList) {
    statelist = [StateHelper.createNewState(dataList)];
    var numElements = statelist[0].backlinks.length;
    var state = StateHelper.copyState(statelist[0]);

    initLogMessage(state);

    for (var i = 0; i < numElements - 1; i++) {
        var minPosition = i;

        // Iteration {iteration}: Set {val} as the current minimum.
        // Then iterate through the rest to find the true minimum.
        state.status = '<div>Iteration {iteration}: Set {val} as the current minimum, then iterate through the remaining unsorted elements to find the true minimum.</div>'
            .replace("{iteration}", (i + 1))
            .replace("{val}", state.backlinks[i].value);
        state.logMessage = '<div>Iteration {iteration}: Set {val} as the current minimum, then iterate through the remaining unsorted elements to find the true minimum.</div>'
            .replace("{iteration}", (i + 1))
            .replace("{val}", state.backlinks[i].value) + state.logMessage;
        state.lineNo = [1, 2, 3];
        state.backlinks[minPosition].highlight = HIGHLIGHT_SPECIAL;

        StateHelper.updateCopyPush(statelist, state);

        for (var j = i + 1; j < numElements; j++) {
            // Check if {val} is smaller than the current minimum ({minVal}).
            state.status = '<div>Check if {val} is smaller than the current minimum ({minVal}).</div>'
                .replace("{val}", state.backlinks[j].value)
                .replace("{minVal}", state.backlinks[minPosition].value);
            state.logMessage = '<div>Check if {val} is smaller than the current minimum ({minVal}).</div>'
                .replace("{val}", state.backlinks[j].value)
                .replace("{minVal}", state.backlinks[minPosition].value) + state.logMessage;
            state.lineNo = 4;
            state.backlinks[j].highlight = HIGHLIGHT_STANDARD;
            StateHelper.updateCopyPush(statelist, state);

            state.backlinks[j].highlight = HIGHLIGHT_NONE;

            if (state.backlinks[j].value < state.backlinks[minPosition].value) {
                state.status = '<div>Set {val} as the new minimum.</div>'
                    .replace("{val}", state.backlinks[j].value);
                // state.logMessage = '<div>{val} is the current minimum</div>'
                //     .replace("{val}", state.backlinks[j].value) + state.logMessage;
                state.logMessage = '<div>Set {val} as the new minimum.</div>'
                    .replace("{val}", state.backlinks[j].value) + state.logMessage;
                state.lineNo = 5;
                state.backlinks[minPosition].highlight = HIGHLIGHT_NONE;
                state.backlinks[j].highlight = HIGHLIGHT_SPECIAL;

                minPosition = j;
                StateHelper.updateCopyPush(statelist, state);
            }
        }

        if (minPosition != i) { // Highlight the first-most unswapped position, if it isn't the minimum
            // Set {val} as the new minimum.
            state.status = '<div>Swap the minimum ({minVal}) with the first unsorted element ({element}).</div>'
                .replace("{minVal}", state.backlinks[minPosition].value)
                .replace("{element}", state.backlinks[i].value);

            // state.logMessage = '<div>swap {minVal} and {element}</div>'
            //     .replace("{minVal}", state.backlinks[minPosition].value)
            //     .replace("{element}", state.backlinks[i].value) + state.logMessage;
            state.logMessage = '<div>Swap the minimum ({minVal}) with the first unsorted element ({element}).</div>'
                .replace("{minVal}", state.backlinks[minPosition].value)
                .replace("{element}", state.backlinks[i].value) + state.logMessage;

            state.lineNo = 6;
            state.backlinks[i].highlight = HIGHLIGHT_SPECIAL;
            StateHelper.updateCopyPush(statelist, state);

            EntryBacklinkHelper.swapBacklinks(state.backlinks, minPosition, i);
            StateHelper.updateCopyPush(statelist, state);
        }
        else {
            // As the minimum is the first unsorted element, no swap is necessary.
            state.status = '<div>As the minimum is the first unsorted element, no swap is necessary.</div>';
            state.logMessage = '<div>As the minimum is the first unsorted element, no swap is necessary.</div>' + state.logMessage;
            state.lineNo = 6;
            StateHelper.updateCopyPush(statelist, state);
        }

        // {val} is now considered sorted.
        state.status = '<div>{val} is now considered sorted.</div>'.replace("{val}", state.backlinks[i].value);
        state.logMessage = '<div>{val} is now considered sorted.</div>'.replace("{val}", state.backlinks[i].value) + state.logMessage;
        state.backlinks[minPosition].highlight = HIGHLIGHT_NONE;
        state.backlinks[i].highlight = HIGHLIGHT_SORTED;
        StateHelper.updateCopyPush(statelist, state);
    }

    for (var i = 0; i < numElements; i++)
        state.backlinks[i].highlight = HIGHLIGHT_SORTED; // highlight everything
    // The array/list is now sorted.
    // (After all iterations, the last element will naturally be sorted.)
    state.status = 'List sorted!' + '<br>' + '(After all iterations, the last element will naturally be sorted.)';
    state.logMessage = "<div>List sorted!</div>" + state.logMessage;
    state.status.lineNo = 0;
    StateHelper.updateCopyPush(statelist, state);

    return statelist;
}

var quickSortUseRandomizedPivot;

var quickSortStart = function () {

    var numElements = statelist[0].backlinks.length;
    var state = StateHelper.copyState(statelist[statelist.length - 1]);

    initLogMessage(state);

    statelist = quickSortSplit(state, 0, numElements - 1);

    state.lineNo = 0;
    state.status = '<div>List sorted!</div>';
    state.logMessage = '<div>List sorted!</div>' + state.logMessage;

    for (var i = 0; i < numElements; i++)
        state.backlinks[i].highlight = HIGHLIGHT_SORTED; //unhighlight everything
    StateHelper.updateCopyPush(statelist, state);

    return statelist;
}

var quickSortSplit = function (state, startIndex, endIndex) { //startIndex & endIndex inclusive
    state.status = '<div>Working on partition [{partition}] (index {startIndex} to {endIndex} both inclusive).</div>'
        .replace("{partition}", state.backlinks.slice(startIndex, endIndex + 1).map(function (d) {
            return d.value;
        }))
        .replace("{startIndex}", startIndex).replace("{endIndex}", endIndex);
    state.logMessage = '<div>Working on partition [{partition}] (index {startIndex} to {endIndex} both inclusive).</div>'
        .replace("{partition}", state.backlinks.slice(startIndex, endIndex + 1).map(function (d) {
            return d.value;
        }))
        .replace("{startIndex}", startIndex).replace("{endIndex}", endIndex) + state.logMessage;
    state.lineNo = 1;

    if (startIndex > endIndex)
        return;

    if (startIndex == endIndex) {
        state.status += '<div>Since partition size == 1, element inside partition is necessarily at sorted position.</div>';
        state.logMessage += '<div>Since partition size == 1, element inside partition is necessarily at sorted position.</div>' + state.logMessage;
        state.backlinks[startIndex].highlight = HIGHLIGHT_SORTED;
        StateHelper.updateCopyPush(statelist, state);
        return;
    }

    var middleIndex = quickSortPartition(state, startIndex, endIndex);
    quickSortSplit(state, startIndex, middleIndex - 1);
    quickSortSplit(state, middleIndex + 1, endIndex);

    return statelist;
}

var quickSortPartition = function (state, startIndex, endIndex) {

    var pivotIndex;
    if (quickSortUseRandomizedPivot) {

        pivotIndex = generateRandomNumber(startIndex, endIndex);

        state.status += '<div>Randomly selected {pivot} (index {index}) as pivot.</div>'
            .replace("{pivot}", state.backlinks[pivotIndex].value)
            .replace("{index}", pivotIndex);
        state.logMessage += '<div>Randomly selected {pivot} (index {index}) as pivot.</div>'
            .replace("{pivot}", state.backlinks[pivotIndex].value)
            .replace("{index}", pivotIndex) + state.logMessage;
        state.lineNo = [1, 2];

        state.backlinks[pivotIndex].highlight = HIGHLIGHT_PIVOT;
        StateHelper.updateCopyPush(statelist, state);

        if (pivotIndex != startIndex) {
            state.status = '<div>Swap pivot ({pivot}}, index {index}) with first element ({first}, index {firstIndex}). (storeIndex = {storeIndex}.)</div>'
                .replace("{pivot}", state.backlinks[pivotIndex].value)
                .replace("{index}", pivotIndex)
                .replace("{first}", state.backlinks[startIndex].value)
                .replace("{firstIndex}", startIndex)
                .replace("{storeIndex}", (startIndex + 1));
            state.logMessage = '<div>Swap pivot ({pivot}}, index {index}) with first element ({first}, index {firstIndex}). (storeIndex = {storeIndex}.)</div>'
                .replace("{pivot}", state.backlinks[pivotIndex].value)
                .replace("{index}", pivotIndex)
                .replace("{first}", state.backlinks[startIndex].value)
                .replace("{firstIndex}", startIndex)
                .replace("{storeIndex}", (startIndex + 1)) + state.logMessage;

            state.lineNo = [2, 3];

            EntryBacklinkHelper.swapBacklinks(state.backlinks, pivotIndex, startIndex);
            pivotIndex = startIndex;
            StateHelper.updateCopyPush(statelist, state);
        }
    }
    else {
        pivotIndex = startIndex;

        state.status += '<div>Selecting {pivot} as pivot. (storeIndex = {storeIndex}.)</div>'
            .replace("{pivot}", state.backlinks[pivotIndex].value)
            .replace("{storeIndex}", (startIndex + 1));

        // state.logMessage = '<div>Select {val} as pivot</div>'
        //     .replace("{val}", state.backlinks[pivotIndex].value) + state.logMessage;
        state.logMessage += '<div>Selecting {pivot} as pivot. (storeIndex = {storeIndex}.)</div>'
            .replace("{pivot}", state.backlinks[pivotIndex].value)
            .replace("{storeIndex}", (startIndex + 1)) + state.logMessage;

        state.lineNo = [1, 2, 3];

        state.backlinks[pivotIndex].highlight = HIGHLIGHT_PIVOT;
        StateHelper.updateCopyPush(statelist, state);
    }

    var storeIndex = pivotIndex + 1;
    var pivotValue = state.backlinks[pivotIndex].value;

    for (var i = storeIndex; i <= endIndex; i++) {
        state.status = '<div>Checking if {val} < {pivot} (pivot).</div>'
            .replace("{val}", state.backlinks[i].value)
            .replace("{pivot}", pivotValue);
        state.logMessage = '<div>Checking if {val} < {pivot} (pivot).</div>'
            .replace("{val}", state.backlinks[i].value)
            .replace("{pivot}", pivotValue) + state.logMessage;
        state.lineNo = [4, 5];

        state.backlinks[i].highlight = HIGHLIGHT_SPECIAL;
        StateHelper.updateCopyPush(statelist, state);
        if (state.backlinks[i].value < pivotValue) {

            state.status = '<div>{val} < {pivot} (pivot) is true. <div>Swapping index {idx} (value = {valI}) with element at storeIndex (index = {storeIdx}, value = {storeVal}).</div> (Value of storeIndex after swap = {newStoreIdx}).</div>'
                .replace("{idx}", i)
                .replace("{val}", state.backlinks[i].value)
                .replace("{valI}", state.backlinks[i].value)
                .replace("{pivot}", pivotValue)
                .replace("{storeIdx}", storeIndex)
                .replace("{storeVal}", state.backlinks[storeIndex].value)
                .replace("{newStoreIdx}", (storeIndex + 1));
            state.logMessage = '<div>{val} < {pivot} (pivot) is true. <div>Swapping index {idx} (value = {valI}) with element at storeIndex (index = {storeIdx}, value = {storeVal}).</div> (Value of storeIndex after swap = {newStoreIdx}).</div>'
                .replace("{idx}", i)
                .replace("{val}", state.backlinks[i].value)
                .replace("{valI}", state.backlinks[i].value)
                .replace("{pivot}", pivotValue)
                .replace("{storeIdx}", storeIndex)
                .replace("{storeVal}", state.backlinks[storeIndex].value)
                .replace("{newStoreIdx}", (storeIndex + 1)) + state.logMessage;

            state.lineNo = [4, 6];

            if (i != storeIndex) {
                state.logMessage = '<div>Swap {val1} and {val2}</div>'
                    .replace("{val1}", state.backlinks[i].value)
                    .replace("{val2}", state.backlinks[storeIndex].value) + state.logMessage;
                EntryBacklinkHelper.swapBacklinks(state.backlinks, storeIndex, i);
                StateHelper.updateCopyPush(statelist, state);
            }

            state.backlinks[storeIndex].highlight = HIGHLIGHT_LEFT;
            storeIndex++;
        }
        else {
            state.backlinks[i].highlight = HIGHLIGHT_RIGHT;
        }
    }
    state.status = '<div>Iteration complete.</div>';
    state.logMessage = '<div>Iteration complete.</div>' + state.logMessage;
    state.lineNo = 4;
    StateHelper.updateCopyPush(statelist, state);
    if (storeIndex - 1 != pivotIndex) {
        state.status = '<div>Swapping pivot (index = {pivotIdx}, value = {pivot}) with element at storeIndex - 1 (index = {newIdx}, value = {newVal}).</div>'
            .replace("{pivotIdx}", pivotIndex)
            .replace("{pivot}", pivotValue)
            .replace("{newIdx}", (storeIndex - 1))
            .replace("{newVal}", state.backlinks[storeIndex - 1].value);

        // state.logMessage = '<div>Swap {val1} and {val2}</div>'
        //     .replace("{val1}", pivotValue)
        //     .replace("{val2}", state.backlinks[storeIndex - 1].value) + state.logMessage;
        state.logMessage = '<div>Swapping pivot (index = {pivotIdx}, value = {pivot}) with element at storeIndex - 1 (index = {newIdx}, value = {newVal}).</div>'
            .replace("{pivotIdx}", pivotIndex)
            .replace("{pivot}", pivotValue)
            .replace("{newIdx}", (storeIndex - 1))
            .replace("{newVal}", state.backlinks[storeIndex - 1].value) + state.logMessage;

        state.lineNo = 7;
        EntryBacklinkHelper.swapBacklinks(state.backlinks, storeIndex - 1, pivotIndex);
        StateHelper.updateCopyPush(statelist, state);
    }

    state.status = '<div>Pivot is now at its sorted position.</div>';
    state.logMessage = '<div>Pivot is now at its sorted position.</div>' + state.logMessage;
    state.lineNo = 7;

    for (var i = startIndex; i <= endIndex; i++)
        state.backlinks[i].highlight = HIGHLIGHT_NONE; //unhighlight everything
    state.backlinks[storeIndex - 1].highlight = HIGHLIGHT_SORTED;
    StateHelper.updateCopyPush(statelist, state);

    return storeIndex - 1;
}

exports.quickSort = function (dataList) {
    statelist = [StateHelper.createNewState(dataList)];
    quickSortUseRandomizedPivot = false;
    statelist = quickSortStart(statelist);
    return statelist;
}

exports.insertionSort = function (dataList) {
    statelist = [StateHelper.createNewState(dataList)];
    var numElements = statelist[0].backlinks.length;
    var state = StateHelper.copyState(statelist[0]);

    initLogMessage(state);

    // Mark first element is sorted
    state.status = "<div>Mark the first element ({first}) as sorted.</div>"
        .replace('{first}', state.backlinks[0].value);
    state.logMessage = "<div>Mark the first element ({first}) as sorted.</div>"
        .replace('{first}', state.backlinks[0].value) + state.logMessage;
    state.backlinks[0].highlight = HIGHLIGHT_SORTED;
    state.lineNo = 1;
    StateHelper.updateCopyPush(statelist, state);

    // Start loop forward
    for (var i = 1; i < numElements; i++) {
        state.backlinks[i].highlight = HIGHLIGHT_SPECIAL;
        state.lineNo = [2, 3];
        state.status = "<div>Extract the first unsorted element ({val}).</div>"
            .replace('{val}', state.backlinks[i].value);
        state.logMessage = "<div>Extract the first unsorted element ({val}).</div>"
            .replace('{val}', state.backlinks[i].value) + state.logMessage;
        StateHelper.updateCopyPush(statelist, state);
        state.backlinks[i].secondaryPositionStatus = POSITION_USE_SECONDARY_IN_DEFAULT_POSITION;

        // Start loop backward from i index
        for (var j = (i - 1); j >= 0; j--) {
            state.backlinks[j].highlight = HIGHLIGHT_STANDARD;
            state.lineNo = 4;
            state.status = "<div>Figure where to insert extracted element; comparing with sorted element {val}.</div>".replace('{val}', state.backlinks[j].value);
            state.logMessage = "<div>Figure where to insert extracted element; comparing with sorted element {val}.</div>".replace('{val}', state.backlinks[j].value) + state.logMessage;
            StateHelper.updateCopyPush(statelist, state);
            if (state.backlinks[j].value > state.backlinks[j + 1].value) {
                // Swap
                state.backlinks[j].highlight = HIGHLIGHT_SORTED;
                state.lineNo = [5, 6];
                state.status = "<div>{val1} > {val2} is true, hence move current sorted element ({val}) to the right by 1.</div>"
                    .replace('{val1}', state.backlinks[j].value)
                    .replace('{val2}', state.backlinks[j + 1].value)
                    .replace('{val}', state.backlinks[j].value);
                state.logMessage = "<div>{val1} > {val2} is true, hence move current sorted element ({val}) to the right by 1.</div>"
                    .replace('{val1}', state.backlinks[j].value)
                    .replace('{val2}', state.backlinks[j + 1].value)
                    .replace('{val}', state.backlinks[j].value) + state.logMessage;
                EntryBacklinkHelper.swapBacklinks(state.backlinks, j, j + 1);

                if (j > 0) {
                    state.backlinks[j - 1].highlight = HIGHLIGHT_STANDARD;
                    StateHelper.updateCopyPush(statelist, state);
                }
            } else {
                state.backlinks[j].highlight = HIGHLIGHT_SORTED;
                state.backlinks[j + 1].highlight = HIGHLIGHT_SORTED;
                state.lineNo = 7;
                state.status = "<div>{val1} > {val2} is false, insert element at current position.</div>"
                    .replace('{val1}', state.backlinks[j].value)
                    .replace('{val2}', state.backlinks[j + 1].value);
                state.logMessage = "<div>{val1} > {val2} is false, insert element at current position.</div>"
                    .replace('{val1}', state.backlinks[j].value)
                    .replace('{val2}', state.backlinks[j + 1].value) + state.logMessage;
                state.backlinks[j + 1].secondaryPositionStatus = POSITION_USE_PRIMARY;
                StateHelper.updateCopyPush(statelist, state);
                break;
            }

            if (j == 0) {
                StateHelper.updateCopyPush(statelist, state);

                state.backlinks[j].secondaryPositionStatus = POSITION_USE_PRIMARY;
                // StateHelper.updateCopyPush(statelist, state);
                state.backlinks[j].highlight = HIGHLIGHT_SORTED;
                StateHelper.updateCopyPush(statelist, state);

            }
        } // End backward loop
    } // End forward loop

    state.lineNo = 0;
    state.status = "<div>List sorted!</div>";
    state.logMessage = "<div>List sorted!</div>" + state.logMessage;
    StateHelper.updateCopyPush(statelist, state);

    return statelist;
}

exports.cocktailShakerSort = function (dataList) {
    statelist = [StateHelper.createNewState(dataList)];
    var numElements = statelist[0].backlinks.length;
    var state = StateHelper.copyState(statelist[0]);

    initLogMessage(state);

    var swapped = true;
    var start = 0;
    var end = numElements;

    // Start while loop
    while (swapped) {
        // Reset the swapped flag to enter the loop
        swapped = false;
        state.lineNo = 2;
        StateHelper.updateCopyPush(statelist, state);

        // Start loop forward, sort like bubble sort
        for (var i = start; i < end - 1; i++) {
            state.backlinks[i].highlight = HIGHLIGHT_STANDARD;
            state.lineNo = 3;
            state.status = "<div>Extract left unsorted element ({val}).</div>".replace('{val}', state.backlinks[i].value);
            state.logMessage = "<div>Extract left unsorted element ({val}).</div>".replace('{val}', state.backlinks[i].value) + state.logMessage;
            StateHelper.updateCopyPush(statelist, state);

            if (i + 1 <= end) {
                state.backlinks[i + 1].highlight = HIGHLIGHT_SPECIAL;
                state.lineNo = 4;
                state.status = "<div>Checking if {val1} > {val2}.</div>".replace('{val1}', state.backlinks[i].value).replace('{val2}', state.backlinks[i + 1].value);
                state.logMessage = "<div>Checking if {val1} > {val2}.</div>".replace('{val1}', state.backlinks[i].value).replace('{val2}', state.backlinks[i + 1].value) + state.logMessage;
                StateHelper.updateCopyPush(statelist, state);
            }

            if (state.backlinks[i].value > state.backlinks[i + 1].value) {
                EntryBacklinkHelper.swapBacklinks(state.backlinks, i, i + 1);
                state.backlinks[i].highlight = HIGHLIGHT_NONE;
                state.lineNo = 5;
                if (i === end - 2) {
                    state.backlinks[end - 1].highlight = HIGHLIGHT_SORTED;
                }
                state.status = "<div>{val1} > {val2}, swap positions of {val1} and {val2}</div><div>Set swapped = true</div>"
                    .replace(/{val1}/g, state.backlinks[i + 1].value)
                    .replace(/{val2}/g, state.backlinks[i].value);
                state.logMessage = "<div>{val1} > {val2}, swap positions of {val1} and {val2}</div><div>Set swapped = true</div>"
                    .replace(/{val1}/g, state.backlinks[i + 1].value)
                    .replace(/{val2}/g, state.backlinks[i].value) + state.logMessage;
                StateHelper.updateCopyPush(statelist, state);
                swapped = true;
            } else {
                state.backlinks[i].highlight = HIGHLIGHT_NONE;
                if (i < end - 2) {
                    state.backlinks[i + 1].highlight = HIGHLIGHT_STANDARD;
                } else if (i === end - 2) {
                    state.backlinks[end - 1].highlight = HIGHLIGHT_SORTED;
                }
                StateHelper.updateCopyPush(statelist, state);
            }
        }

        if (!swapped) {
            state.lineNo = 6;
            state.status = "<div>There\'s no unsorted element left.</div>";
            state.logMessage = "<div>There\'s no unsorted element left.</div>" + state.logMessage;
            StateHelper.updateCopyPush(statelist, state);
            break;
        } else {
            // Set swapped flag to run loop backward
            swapped = false;

            // Last index is already sorted
            end = end - 1;
            state.lineNo = 7;
            state.status = "<div>Element ({val}) is sorted.</div><div>Set swapped = false.</div>".replace('{val}', state.backlinks[end].value);
            state.logMessage = "<div>Element ({val}) is sorted.</div><div>Set swapped = false.</div>".replace('{val}', state.backlinks[end].value) + state.logMessage;
            StateHelper.updateCopyPush(statelist, state);
        }

        for (var i = end - 1; i > start; i--) {
            state.backlinks[i].highlight = HIGHLIGHT_STANDARD;
            state.lineNo = 8;
            state.status = "<div>Extract right unsorted element ({val})</div>".replace('{val}', state.backlinks[i].value);
            state.logMessage = "<div>Extract right unsorted element ({val})</div>".replace('{val}', state.backlinks[i].value) + state.logMessage;
            StateHelper.updateCopyPush(statelist, state);

            if (i - 1 >= start) {
                state.backlinks[i - 1].highlight = HIGHLIGHT_SPECIAL;
                state.lineNo = 9;
                state.status = "<div>Checking if {val1} < {val2}</div>".replace('{val1}', state.backlinks[i].value).replace('{val2}', state.backlinks[i - 1].value);
                state.logMessage = "<div>Checking if {val1} < {val2}</div>".replace('{val1}', state.backlinks[i].value).replace('{val2}', state.backlinks[i - 1].value);
                StateHelper.updateCopyPush(statelist, state);
            }

            if (state.backlinks[i].value < state.backlinks[i - 1].value) {
                EntryBacklinkHelper.swapBacklinks(state.backlinks, i, i - 1);
                state.backlinks[i].highlight = HIGHLIGHT_NONE;
                state.lineNo = 10;
                if (i === start + 1) {
                    state.backlinks[start].highlight = HIGHLIGHT_SORTED;
                }
                state.status = "<div>{val1} < {val2}, swap positions of {val1} and {val2}</div><div>Set swapped = true</div>"
                    .replace(/{val1}/g, state.backlinks[i - 1].value)
                    .replace(/{val2}/g, state.backlinks[i].value);
                state.logMessage = "<div>{val1} < {val2}, swap positions of {val1} and {val2}</div><div>Set swapped = true</div>"
                    .replace(/{val1}/g, state.backlinks[i - 1].value)
                    .replace(/{val2}/g, state.backlinks[i].value) + state.logMessage;
                StateHelper.updateCopyPush(statelist, state);
                swapped = true;
            } else {
                state.backlinks[i].highlight = HIGHLIGHT_NONE;
                if (i > start + 1) {
                    state.backlinks[i - 1].highlight = HIGHLIGHT_STANDARD;
                } else if (i === start + 1) {
                    state.backlinks[start].highlight = HIGHLIGHT_SORTED;
                }
                StateHelper.updateCopyPush(statelist, state);
            }
        }

        // First index is already sorted
        state.lineNo = 12;
        start = start + 1;
        state.status = "<div>Element ({val}) is sorted.</div><div>Set swapped = false.</div>".replace('{val}', state.backlinks[start].value);
        state.logMessage = "<div>Element ({val}) is sorted.</div><div>Set swapped = false.</div>".replace('{val}', state.backlinks[start].value) + state.logMessage;
        StateHelper.updateCopyPush(statelist, state);
    } // End while loop

    state.status = "List sorted!";
    for (var i = 0; i < numElements; i++) {
        state.backlinks[i].highlight = HIGHLIGHT_SORTED;
    }
    state.lineNo = 0;
    StateHelper.updateCopyPush(statelist, state);

    return statelist;
}

exports.combSort = function (dataList) {
    statelist = [StateHelper.createNewState(dataList)];
    var numElements = statelist[0].backlinks.length;
    var state = StateHelper.copyState(statelist[0]);

    initLogMessage(state);

    var gap = numElements;
    var swapped = false;

    state.status = "<div>Create gap = list length (gap = {gap}), swapped = false</div>".replace('{gap}', gap);
    state.logMessage = "<div>Create gap = list length (gap = {gap}), swapped = false</div>".replace('{gap}', gap) + state.logMessage;
    state.lineNo = 1;
    StateHelper.updateCopyPush(statelist, state);

    while(swapped || gap != 1) {
        gap = Math.floor(gap / 1.3);
        if (gap < 1)
            gap = 1;
        state.status = "<div>Gap / 1.3 = {gap}, set swapped = false.</div>".replace('{gap}', gap);
        state.logMessage = "<div>Gap / 1.3 = {gap}, set swapped = false.</div>".replace('{gap}', gap) + state.logMessage;
        state.lineNo = 3;
        StateHelper.updateCopyPush(statelist, state);

        for (var i = 0; i < numElements - gap; i++) {
            state.backlinks[i].highlight = HIGHLIGHT_STANDARD;
            state.backlinks[i + gap].highlight = HIGHLIGHT_STANDARD;
            state.status = "<div>Check if {val1} > {val2}.</div>"
                .replace('{val1}', state.backlinks[i].value)
                .replace('{val2}', state.backlinks[i + gap].value);
            state.logMessage = "<div>Check if {val1} > {val2}.</div>"
                .replace('{val1}', state.backlinks[i].value)
                .replace('{val2}', state.backlinks[i + gap].value) + state.logMessage;
            state.lineNo = 6;
            StateHelper.updateCopyPush(statelist, state);

            if (state.backlinks[i].value > state.backlinks[i + gap].value) {
                EntryBacklinkHelper.swapBacklinks(state.backlinks, i, i + gap);
                state.status = "<div>{val1} > {val2}, swap position of ({val1}) and ({val2}). Swapped = true.</div>"
                    .replace(/{val1}/g, state.backlinks[i + gap].value)
                    .replace(/{val2}/g, state.backlinks[i].value);
                state.logMessage = "<div>{val1} > {val2}, swap position of ({val1}) and ({val2}). Swapped = true.</div>"
                    .replace(/{val1}/g, state.backlinks[i + gap].value)
                    .replace(/{val2}/g, state.backlinks[i].value) + state.logMessage;
                state.lineNo = [7, 8];
                StateHelper.updateCopyPush(statelist, state);
            }

            state.backlinks[i].highlight = HIGHLIGHT_NONE;
            state.backlinks[i + gap].highlight = HIGHLIGHT_NONE;
            StateHelper.updateCopyPush(statelist, state);
        }
    }

    state.status = "<div>List sorted!</div>";
    state.logMessage = "<div>List sorted!</div>" + state.logMessage;
    for (var i = 0; i < numElements; i++) {
        state.backlinks[i].highlight = HIGHLIGHT_SORTED;
    }
    state.lineNo = 0;
    StateHelper.updateCopyPush(statelist, state);

    return statelist;
}

exports.shellSort = function (dataList) {
    statelist = [StateHelper.createNewState(dataList)];
    var numElements = statelist[0].backlinks.length;
    var state = StateHelper.copyState(statelist[0]);

    initLogMessage(state);

    var firstRun = true;

    // Start big gap loop, then reduce gap by 1
    // You have to floor the gap, or it will get bug
    for (var gap = Math.floor(numElements / 2); gap > 0; gap = Math.floor(gap / 2)) {
        if (firstRun) {
            state.status = "<div>Create gap by diving list length in 2 (gap = {gap}).</div>".replace('{gap}', gap);
            state.logMessage = "<div>Create gap by diving list length in 2 (gap = {gap}).</div>".replace('{gap}', gap) + state.logMessage;
            state.lineNo = 1;
            StateHelper.updateCopyPush(statelist, state);
            firstRun = false;
        } else {
            state.status = "<div>Divide gap length by 2 (gap = {gap}).</div>".replace('{gap}', gap);
            state.logMessage = "<div>Divide gap length by 2 (gap = {gap}).</div>".replace('{gap}', gap) + state.logMessage;
            state.lineNo = 3;
            StateHelper.updateCopyPush(statelist, state);
        }

        for (var i = gap; i < numElements; i++) {

            for (var j = i; j >= gap;) {
                state.backlinks[j].highlight = HIGHLIGHT_STANDARD;
                state.backlinks[j].secondaryPositionStatus = POSITION_USE_SECONDARY_IN_DEFAULT_POSITION;
                state.backlinks[j - gap].highlight = HIGHLIGHT_STANDARD;
                state.backlinks[j - gap].secondaryPositionStatus = POSITION_USE_SECONDARY_IN_DEFAULT_POSITION;
                state.status = "<div>Checking if {val1} > {val2}.</div>"
                    .replace('{val1}', state.backlinks[j - gap].value)
                    .replace('{val2}', state.backlinks[j].value);
                state.logMessage = "<div>Checking if {val1} > {val2}.</div>"
                    .replace('{val1}', state.backlinks[j - gap].value)
                    .replace('{val2}', state.backlinks[j].value) + state.logMessage;
                state.lineNo = 5;
                StateHelper.updateCopyPush(statelist, state);
                if (state.backlinks[j - gap].value > state.backlinks[j].value) {
                    EntryBacklinkHelper.swapBacklinks(state.backlinks, j, j - gap);
                    state.status = "<div>{val1} > {val2}, swap position of ({val1}) and ({val2}).</div>"
                        .replace(/{val1}/g, state.backlinks[j].value)
                        .replace(/{val2}/g, state.backlinks[j - gap].value);
                    state.logMessage = "<div>{val1} > {val2}, swap position of ({val1}) and ({val2}).</div>"
                        .replace(/{val1}/g, state.backlinks[j].value)
                        .replace(/{val2}/g, state.backlinks[j - gap].value) + state.logMessage;
                    state.lineNo = 6;
                    StateHelper.updateCopyPush(statelist, state);

                    state.backlinks[j].secondaryPositionStatus = POSITION_USE_PRIMARY;
                    state.backlinks[j - gap].secondaryPositionStatus = POSITION_USE_PRIMARY;
                    state.backlinks[j].highlight = HIGHLIGHT_NONE;
                    state.backlinks[j - gap].highlight = HIGHLIGHT_NONE;
                    StateHelper.updateCopyPush(statelist, state);
                } else {
                    state.backlinks[j].secondaryPositionStatus = POSITION_USE_PRIMARY;
                    state.backlinks[j - gap].secondaryPositionStatus = POSITION_USE_PRIMARY;
                    state.backlinks[j].highlight = HIGHLIGHT_NONE;
                    state.backlinks[j - gap].highlight = HIGHLIGHT_NONE;
                    StateHelper.updateCopyPush(statelist, state);
                    break;
                }
                j -= gap;
            }
        } // End for i
    } // End for gap

    state.status = "<div>List sorted!</div>";
    state.logMessage = "<div>List sorted!</div>" + state.logMessage;
    for (var i = 0; i < numElements; i++) {
        state.backlinks[i].highlight = HIGHLIGHT_SORTED;
    }
    state.lineNo = 0;
    StateHelper.updateCopyPush(statelist, state);

    return statelist;
}

exports.mergeSort = function (dataList) {
    statelist = [StateHelper.createNewState(dataList)];
    var numElements = statelist[0].backlinks.length;
    var state = StateHelper.copyState(statelist[0]);

    this.mergeSortSplit(state, 0, numElements);

    state.status = "<div>List sorted!</div>";
    for (var i = 0; i < numElements; i++) {
        state.backlinks[i].highlight = HIGHLIGHT_SORTED;
    }
    state.logMessage = "<div>List sorted!</div>" + state.logMessage;
    StateHelper.updateCopyPush(statelist, state);

    return statelist;
}

exports.mergeSortSplit = function (state, startIndex, endIndex) {
    if (endIndex - startIndex <= 1) {
        return;
    }

    var midIndex = Math.ceil((startIndex + endIndex) / 2);
    this.mergeSortSplit(state, startIndex, midIndex);
    this.mergeSortSplit(state, midIndex, endIndex);
    this.mergeSortMerge(state, startIndex, midIndex, endIndex);

    // Copy sorted array back to original array

    state.status = "<div>Copy sorted elements back to original array.</div>";
    state.logMessage = "<div>Copy sorted elements back to original array.</div>" + state.logMessage;

    state.lineNo = 7;

    var duplicatedArray = new Array();
    for (var i = startIndex; i < endIndex; i++) {
        var newPosition = state.backlinks[i].secondaryPositionStatus;
        duplicatedArray[newPosition] = state.backlinks[i];
    }

    for (var i = startIndex; i < endIndex; i++) {
        state.backlinks[i] = duplicatedArray[i];
    }

    for (var i = startIndex; i < endIndex; i++) {
        state.backlinks[i].secondaryPositionStatus = POSITION_USE_PRIMARY;
        state.backlinks[i].highlight = HIGHLIGHT_NONE;
        StateHelper.updateCopyPush(statelist, state);
    }
}

exports.mergeSortMerge = function (state, startIndex, midIndex, endIndex) {
    var leftIndex = startIndex;
    var rightIndex = midIndex;

    for (var i = startIndex; i < endIndex; i++) {
        state.backlinks[i].highlight = HIGHLIGHT_STANDARD;
    }

    state.status = "<div>We now merge partitions [{partition1}] (index {startIdx1} to {endIdx1} both inclusive) and [{partition2}] (index {startIdx2} to {endIdx2} both inclusive).</div>"
        .replace('{partition1}', state.backlinks.slice(startIndex, midIndex).map(function (d) {
            return d.value;
        }))
        .replace('{startIdx1}', startIndex).replace('{endIdx1}', (midIndex - 1))
        .replace('{partition2}', state.backlinks.slice(midIndex, endIndex).map(function (d) {
            return d.value;
        }))
        .replace('{startIdx2}', midIndex).replace('{endIdx2}', (endIndex - 1));
    state.logMessage = "<div>We now merge partitions [{partition1}] (index {startIdx1} to {endIdx1} both inclusive) and [{partition2}] (index {startIdx2} to {endIdx2} both inclusive).</div>"
        .replace('{partition1}', state.backlinks.slice(startIndex, midIndex).map(function (d) {
            return d.value;
        }))
        .replace('{startIdx1}', startIndex).replace('{endIdx1}', (midIndex - 1))
        .replace('{partition2}', state.backlinks.slice(midIndex, endIndex).map(function (d) {
            return d.value;
        }))
        .replace('{startIdx2}', midIndex).replace('{endIdx2}', (endIndex - 1)) + state.logMessage;

    state.lineNo = 2;
    StateHelper.updateCopyPush(statelist, state);

    for (var i = startIndex; i < endIndex; i++) {

        if (leftIndex < midIndex && (rightIndex >= endIndex || state.backlinks[leftIndex].value <= state.backlinks[rightIndex].value)) {
            state.backlinks[leftIndex].secondaryPositionStatus = i;

            if (rightIndex < endIndex) {
                state.status = "<div>Since {leftPart} (left partition) <= {rightPart} (right partition), we copy {leftPart} into new array.</div>"
                    .replace(/{leftPart}/g, state.backlinks[leftIndex].value).replace('{rightPart}', state.backlinks[rightIndex].value);
                state.logMessage = "<div>Since {leftPart} (left partition) <= {rightPart} (right partition), we copy {leftPart} into new array.</div>"
                    .replace(/{leftPart}/g, state.backlinks[leftIndex].value).replace('{rightPart}', state.backlinks[rightIndex].value) + state.logMessage;
            }
            else {
                state.status = "<div>Since right partition is empty, we copy {leftPart} (left partition) into new array.</div>".replace('{leftPart}', state.backlinks[leftIndex].value);
                state.logMessage = "<div>Since right partition is empty, we copy {leftPart} (left partition) into new array.</div>".replace('{leftPart}', state.backlinks[leftIndex].value)
                    + state.logMessage;
            }

            state.lineNo = [3, 4, 5];

            leftIndex++;
            StateHelper.updateCopyPush(statelist, state);
        } else {
            state.backlinks[rightIndex].secondaryPositionStatus = i;

            state.lineNo = [3, 6];

            if (leftIndex < midIndex) {
                state.status = "<div>Since {leftPart} (left partition) > {rightPart} (right partition), we copy {rightPart} into new array.</div>"
                    .replace('{leftPart}', state.backlinks[leftIndex].value).replace(/{rightPart}/g, state.backlinks[rightIndex].value);
                state.logMessage = "<div>Since {leftPart} (left partition) > {rightPart} (right partition), we copy {rightPart} into new array.</div>"
                    .replace('{leftPart}', state.backlinks[leftIndex].value).replace(/{rightPart}/g, state.backlinks[rightIndex].value) + state.logMessage;
            }
            else {
                state.status = "<div>Since left partition is empty, we copy {rightPart} (right partition) into new array.</div>".replace('{rightPart}', state.backlinks[rightIndex].value);
                state.logMessage = "<div>Since left partition is empty, we copy {rightPart} (right partition) into new array.</div>".replace('{rightPart}', state.backlinks[rightIndex].value) + state.logMessage;
            }
            state.lineNo = [3, 6];

            rightIndex++;
            StateHelper.updateCopyPush(statelist, state);
        }
    }
}
