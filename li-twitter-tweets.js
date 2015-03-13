// Modules and stuff required
var gsheets = require('gsheets')
var fs = require('fs-extra')
var ifttnorch = require('iftt-norch-tools')

// Read config file
var data = fs.readFileSync('./config/config-twitter.json'), config
config = JSON.parse(data)

// Get csv-file as 'data' (object)
gsheets.getWorksheet(config.gsheetsKey, config.gsheetsWorksheet, function(err, result) {
  // Iterating through rows, adding and adjusting
  for (var i=0; i<result.data.length; i++) {
    var obj = result.data[i]

    // Date extraction and transformation
    obj.date = ifttnorch.date(obj.date)
    obj.id = ifttnorch.id(obj.date, obj.text, obj.type)
    obj.user = ifttnorch.twitterusers(obj.user, obj.text)
    obj.tags = ifttnorch.tags(obj.text)
    obj.links = ifttnorch.links(obj.text)
    obj.type = [config.type]
    
    // Create JSON from object
    var resultJSON = JSON.stringify(obj)
    console.log('Object #' + i)
    console.log(resultJSON + '\n\n\n')
  }
  // Create JSON from object
  //var resultJSON = JSON.stringify(result.data)

  
  // Escape characters that will create non-copliant JSON
  //var resultJSON = resultJSON.escapeUnescape()

  // Set file variable
  //var file = '/home/pi/lifeindex/li-twitter-tweets/twitter-tweets.json'

  // Write to file and read to check everything is all right (can compare to console.log before writing to confirm) 
  //fs.outputFileSync(file, resultJSON, 'utf8', function(err) {
    //console.log(err) // => null 
   
  //  fs.readFile(file, function(err, data) {
  //    console.log(resultJSON) // resultJSON 
  //  })
  //})

  //Index file with exec
  //var exec = require('child_process').exec;
  //exec('node /home/pi/node_modules/.bin/norch-indexer -d /home/pi/lifeindex/li-twitter-tweets/ -f type,user,tags','utf8', function (error, stdout, stderr) {
    // output is in stdout
    //console.log(stdout)
    //console.log(error)
    //console.log(stderr)
  //});

});


// Function for escaping and unescaping characers from JSON.stringify-process
// http://stackoverflow.com/questions/4253367/how-to-escape-a-json-string-containing-newline-characters-using-javascript
String.prototype.escapeUnescape = function() {
  return this.replace(/\\n/g, "\\n")
             .replace(/\\'/g, "\\'")
             .replace(/\\"/g, '\\"')
             .replace(/\\&/g, "\\&")
             .replace(/\\r/g, "\\r")
             .replace(/\\t/g, "\\t")
             .replace(/\\b/g, "\\b")
             .replace(/\\f/g, "\\f");
};
