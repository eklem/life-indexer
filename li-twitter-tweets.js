// Modules and stuff required
var gsheets = require('gsheets')
var fs = require('fs-extra')
var ifttnorch = require('iftt-norch-tools')
var si = require('search-index')

// Read config file
var data = fs.readFileSync('/home/pi/node_modules/life-indexer/config/config-twitter.json'), config
config = JSON.parse(data)


// Get csv-file as 'data' (object)
gsheets.getWorksheet(config.gsheetsKey, config.gsheetsWorksheet, function(err, result) {
  
  // Check if ANY changes since last indexing process
  if (result.updated != config.lastUpdated) {

    //console.log('Index is not up to date.\nLast updated: ' + config.lastUpdated + '\n    New date: ' + result.updated)
    var newTweets = []

    // Iterating through rows of data from spreadsheet
    for (var i=0; i<result.data.length; i++) {
      var obj = result.data[i]

      // Getting date and checking if indexed before
      obj.date = ifttnorch.date(obj.date)
      if (obj.date > config.lastUpdated) {
        
        // Document processing the rest
        obj.datehuman = ifttnorch.datehuman(obj.date)
        obj.id = ifttnorch.id(obj.date, obj.text, obj.type)
        obj.user = ifttnorch.twitterusers(obj.user, obj.text)
        obj.tags = ifttnorch.tags(obj.text)
        obj.links = ifttnorch.links(obj.text)
        obj.type = [config.type]
        
        // Push to array that will be indexed
        newTweets.push(obj)
      }
    }

  }
  else {
    console.log('Index is up to date.\nNothing to index.\nLast update: ' + config.lastUpdated + '\n    New date: ' + result.updated)
  }
  
  console.dir(newTweets)
  console.dir(config)

  //si.add({'batchName': config.batchname, 'filters': config.filters}, newTweets, function(err) {
  //  if (!err) console.log('indexed!')
  //})

});
