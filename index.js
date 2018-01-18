var express = require('express')
var trends = require('google-trends')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
	trends.load(['in'], function (err, result) {
		var res= "";
		var test = JSON.parse(JSON.stringify(result));
		var objectKeysArray = Object.keys(test);
		objectKeysArray.forEach(function(objKey) {
			var objValue = test[objKey];
			objValue.forEach(function(trenddata) {
				res += trenddata.title + "<br/>";
			})
		})
		response.send(res)
	})
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
