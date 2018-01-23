var request = require('request')
var async = require('async')
var parser = require('xml2js').parseString

module.exports = {
  load: function (countries, cb) {
    if (countries instanceof Array === false) {
      countries = [countries]
    }

    var tasks = {}
    for (var i = 0, country = null; i < countries.length; i++) {
      country = countries[i]

      if (typeof DOMAINS[country] !== 'undefined') {
        tasks[country] = (function (code) {
          return function (cb) {
            loadWords(code, cb)
          }
        }(country))
      }
    }

    async.parallel(tasks, cb)
  }
}

var loadWords = function (country, cb) {
  return request({
    method: 'GET',
    url: 'https://trends.google.co.in/trends/hottrends/atom/feed?pn=%s'.replace('%s', DOMAINS[country])
  }, function (err, res, body) {
    if (err) {
      return cb(err)
    }

    async.waterfall([
      function (cb) {
        parser(body, cb)
      },
      function (obj, cb) {
        extractWords(obj.rss.channel[0].item, cb)
      }
    ], function (err, result) {
      cb(err, result)
    })
  })
}

var extractWords = function (items, cb) {
  var words = []
  if(items!=null) {
    for (var i = 0, item = null; i < items.length; i++) {
      item = items[i]

      words.push({
        title: item.title[0],
        link: item.link[0],
        ctime: Math.floor(new Date(item.pubDate[0]) / 1000),
        news: {
          picture: {
            url: item['ht:picture'][0],
            source: item['ht:picture_source'][0]
          },
          items: extractNews(item['ht:news_item'])
        }
      })
    }
  }

  cb(null, words)
}

var extractNews = function (items) {
  var news = []
  if(items!=null) {
    for (var i = 0, item = null; i < items.length; i++) {
      item = items[i]

      news.push({
        title: item['ht:news_item_title'][0],
        snippet: item['ht:news_item_snippet'][0],
        url: item['ht:news_item_url'][0],
        source: item['ht:news_item_source'][0]
      })
    }
  }

  return news
}

var DOMAINS = {
  "argentina": "p30",
  "australia": "p8",
  "austria": "p44",
  "belgium": "p41",
  "brazil": "p18",
  "canada": "p13",
  "chile": "p38",
  "colombia": "p32",
  "czech_republic": "p43",
  "denmark": "p49",
  "egypt": "p29",
  "finland": "p50",
  "france": "p16",
  "germany": "p15",
  "greece": "p48",
  "hong_kong": "p10",
  "hungary": "p45",
  "india": "p3",
  "indonesia": "p19",
  "israel": "p6",
  "italy": "p27",
  "japan": "p4",
  "kenya": "p37",
  "malaysia": "p34",
  "mexico": "p21",
  "netherlands": "p17",
  "nigeria": "p52",
  "norway": "p51",
  "philippines": "p25",
  "poland": "p31",
  "portugal": "p47",
  "romania": "p39",
  "russia": "p14",
  "saudi arabia": "p36",
  "singapore": "p5",
  "south_africa": "p40",
  "south_korea": "p23",
  "spain": "p26",
  "sweden": "p42",
  "switzerland": "p46",
  "taiwan": "p12",
  "thailand": "p33",
  "turkey": "p24",
  "ukraine": "p35",
  "united kingdom": "p9",
  "united states": "p1",
  "vietnam": "p28"
}
