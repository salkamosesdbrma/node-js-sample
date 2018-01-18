var express = require('express')

var trends = require('google-trends')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.set('view engine', 'ejs');

app.get('/test', function(request, response) {
 
	trends.load(['kr'], function (err, result) {
	  console.log(err, JSON.stringify(result))
	  response.render('pages/test',{trends: JSON.parse(JSON.stringify(result))})
	})
})

app.get('/', function(request, response) {
	trends.load(['kr'], function (err, result) {
		response.send(JSON.parse(JSON.stringify(result)));
	})
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
