var sorting = require('../controllers/allSortTypes');

var Sort = {
    getBubbleSortData: function(data) {
        return sorting.bubbleSort(data);
    },
    getSelectionSortData: function(data) {
        return sorting.selectionSort(data);
    },
    getQuickSortData: function(data) {
        return sorting.quickSort(data);
    },
    getInsertionSortData: function(data) {
        return sorting.insertionSort(data);
    },
    getCocktailShakerSortData: function(data) {
        return sorting.cocktailShakerSort(data);
    },
    getCombSortData: function(data) {
        return sorting.combSort(data);
    },
    getShellSortData: function(data) {
        return sorting.shellSort(data);
    },
    getMergeSortData: function(data) {
        return sorting.mergeSort(data);
    },
};

module.exports = Sort;


