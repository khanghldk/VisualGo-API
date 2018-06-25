var express = require('express');
var router = express.Router();
var Sort = require('../models/Sort');

router.post('/', function (req, res, next) {

  let type = req.body.type;
  let data = req.body.data;

  switch (type) {
    case 'bubbleSort':
      res.json(Sort.getBubbleSortData(data));
      break;
    case 'selectionSort':
      res.json(Sort.getSelectionSortData(data));
      break;
    case 'cocktailShakerSort':
      res.json(Sort.getCocktailShakerSortData(data));
      break;
    case 'combSort':
      res.json(Sort.getCombSortData(data));
      break;
    case 'insertionSort':
      res.json(Sort.getInsertionSortData(data));
      break;
    case 'mergeSort':
      res.json(Sort.getMergeSortData(data));
      break;
    case 'quickSort':
      res.json(Sort.getQuickSortData(data));
      break;
    case 'shellSort':
      res.json(Sort.getShellSortData(data));
      break;
  }
});

module.exports = router;