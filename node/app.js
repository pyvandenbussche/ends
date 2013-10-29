// Module dependencies.
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');
 
var ConfigProvider = require('./configprovider').ConfigProvider;
var MongoDBProvider = require('./mongodbprovider').MongoDBProvider;
var mongoDBProvider = new MongoDBProvider('localhost', 27017);
var configApp = new ConfigProvider('../config.json');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
		var eps = JSON.parse(fs.readFileSync('./examples/index.json'));
		mongoDBProvider.endpointsCount(function(error,nbEndpoints){
		//console.log(docs);
			mongoDBProvider.getLastUpdate( function(error,lastUpdate){
			//console.log(lastUpdate);
				mongoDBProvider.getIndex( function(error,index){
				//console.log(index);
					var indexInterop = JSON.parse(JSON.stringify(index.interoperability.data), function(k, v) {
						if (k === "data") 
							this.values = v;
						else
							return v;
					});
					//PERFORMANCE
					mongoDBProvider.getPerfView( function(error,docs){
					//TODO precompute the data?
						var thresholds=[];
						var avgASKCold=0;
						var avgASKWarm=0;
						var avgJOINCold=0;
						var avgJOINWarm=0;
						var nbEndpointsTotal=0;
						for (i in docs){
							if(docs[i].threshold>0 && docs[i].threshold%100==0){
								if(thresholds[docs[i].threshold])thresholds[docs[i].threshold]++;
								else thresholds[docs[i].threshold]=1;
							}
							if(docs[i].askMeanCold+docs[i].joinMeanCold>0) nbEndpointsTotal++;
							avgASKCold+=docs[i].askMeanCold;
							avgASKWarm+=docs[i].askMeanWarm;
							avgJOINCold+=docs[i].joinMeanCold;
							avgJOINWarm+=docs[i].joinMeanWarm;
						}
						avgASKCold=avgASKCold/nbEndpointsTotal;
						avgASKWarm=avgASKWarm/nbEndpointsTotal;
						avgJOINCold=avgJOINCold/nbEndpointsTotal;
						avgJOINWarm=avgJOINWarm/nbEndpointsTotal;
						var mostCommonThreshold = [0,0];
						for (i in thresholds){
							if(thresholds[i]>mostCommonThreshold[1]){
								mostCommonThreshold[0]=i;
								mostCommonThreshold[1]=thresholds[i];
							}
						}
						res.render('content/index.jade',{
							configInstanceTitle: configApp.get('configInstanceTitle'),
							eps: eps,
							index:index,
							indexInterop:indexInterop,
							nbEndpoints: nbEndpoints,
							lastUpdate: lastUpdate[0].lastUpdate,
							perf: {"threshold":mostCommonThreshold[0],"data":[{"key": "Cold Tests","color": "#1f77b4","values": [{"label" : "Average ASK" ,"value" : avgASKCold },{"label" : "Average JOIN" ,"value" : avgJOINCold}]},{"key": "Warm Tests","color": "#2ca02c","values": [{"label" : "Average ASK" ,"value" : avgASKWarm} ,{"label" : "Average JOIN" ,"value" : avgJOINWarm}]}]},
							configInterop: JSON.parse(fs.readFileSync('./texts/interoperability.json')),
							configPerformance: JSON.parse(fs.readFileSync('./texts/performance.json')),
							configDisco: JSON.parse(fs.readFileSync('./texts/discoverability.json'))
							});
					});
				});
			});
		});
});

app.get('/api/endpointsAutoComplete', function(req, res){
		mongoDBProvider.autocomplete(req.param('q'), function(error,docs){
			//for(i in docs)console.log(docs[i].uri);
			if(docs){
				res.json(docs);
			}
			else res.end();
		});
});

app.get('/endpoint/:uri*', function(req, res){
		var ep = JSON.parse(fs.readFileSync('./examples/endpoint.json'));
		//console.log(req.param('uri'))
	//TODO deal with no URI
		mongoDBProvider.getEndpointView(req.param('uri'), function(error,docs){

			var perfParsed = JSON.parse(JSON.stringify(docs[0].performance), function(k, v) {
				if (k === "data") 
					this.values = v;
				else
					return v;
			});
			console.log(docs[0].availability);
			res.render('content/endpoint.jade',{
				ep: ep,
				lastUpdate: req.param('uri'),
				configInterop: JSON.parse(fs.readFileSync('./texts/interoperability.json')),
				configPerf: JSON.parse(fs.readFileSync('./texts/performance.json')),
				configDisco: JSON.parse(fs.readFileSync('./texts/discoverability.json')),
				epUri: req.param('uri'),
				epDetails: docs[0].endpoint,
				epPerf: perfParsed,
				epAvail: docs[0].availability,
				epInterop: docs[0].interoperability,
				epDisco: docs[0].discoverability
            });
		});
});

app.get('/availability', function(req, res){
		var epsAvail = JSON.parse(fs.readFileSync('./examples/availability.json'));
		mongoDBProvider.getAvailView( function(error,docs){
			var lastUpdate=0;
			var nbEndpointsUp=0;
			for (i in docs){
				if(docs[i].upNow==true) nbEndpointsUp++;
				if(docs[i].lastUpdate>lastUpdate)lastUpdate=docs[i].lastUpdate;
			}
			res.render('content/availability.jade',{
				lastUpdate: new Date(lastUpdate).toUTCString(),
				epsAvail: epsAvail,
				atasks_agg: docs,
				nbEndpointsUp:nbEndpointsUp,
				nbEndpointsTotal:docs.length
				});
		});
});

app.get('/discoverability', function(req, res){
		var epsDisco = JSON.parse(fs.readFileSync('./examples/discoverability.json'));
		mongoDBProvider.getDiscoView( function(error,docs){
		    var lastUpdate=0;
			var nbEndpointsVoID=0;
			var nbEndpointsSD=0;
			var nbEndpointsServerName=0;
			var nbEndpointsTotal=0;
			for (i in docs){
				nbEndpointsTotal++;
				if(docs[i].lastUpdate>lastUpdate) lastUpdate=docs[i].lastUpdate;
				if(docs[i].VoID==true)nbEndpointsVoID++;
				if(docs[i].SD==true)nbEndpointsSD++;
				if(docs[i].serverName.length>0&&docs[i].serverName!="missing") nbEndpointsServerName++;
			}
			res.render('content/discoverability.jade',{
				lastUpdate: new Date(lastUpdate).toUTCString(),
				nbEndpointsVoID: nbEndpointsVoID,
				nbEndpointsSD: nbEndpointsSD,
				nbEndpointsServerName: nbEndpointsServerName,
				nbEndpointsTotal: nbEndpointsTotal,
				dtasks_agg: docs,
				epsDisco: epsDisco,
				configDisco: JSON.parse(fs.readFileSync('./texts/discoverability.json'))
				});
		});
});

app.get('/performance', function(req, res){
		var epsPerf = JSON.parse(fs.readFileSync('./examples/performance.json'));
		mongoDBProvider.getPerfView( function(error,docs){
		    var lastUpdate=0;
			var nbEndpointsWithThreshold=0;
			var nbEndpointsTotal=0;
			var thresholds=[];
			for (i in docs){
				if(docs[i].lastUpdate>lastUpdate) lastUpdate=docs[i].lastUpdate;
				if(docs[i].threshold>0 && docs[i].threshold%100==0){
					nbEndpointsWithThreshold++;
					if(thresholds[docs[i].threshold])thresholds[docs[i].threshold]++;
					else thresholds[docs[i].threshold]=1;
				}
				if(docs[i].askMeanCold+docs[i].joinMeanCold>0) nbEndpointsTotal++;
			}
			var mostCommonThreshold = [0,0];
			for (i in thresholds){
				if(thresholds[i]>mostCommonThreshold[1]){
					mostCommonThreshold[0]=i;
					mostCommonThreshold[1]=thresholds[i];
				}
			}
			//console.log(mostCommonThreshold);
			res.render('content/performance.jade',{
				lastUpdate: new Date(lastUpdate).toUTCString(),
				epsPerf: epsPerf,
				configPerformance: JSON.parse(fs.readFileSync('./texts/performance.json')),
				ptasks_agg: docs,
				nbEndpointsWithThreshold: nbEndpointsWithThreshold,
				nbEndpointsTotal: nbEndpointsTotal,
				mostCommonThreshold: mostCommonThreshold[0]
				});
		});
});

app.get('/interoperability', function(req, res){
		var epsInter = JSON.parse(fs.readFileSync('./examples/interoperability.json'));
		var nbSPARQL1Features=28;
		var nbSPARQL11Features=20;
		mongoDBProvider.getInteropView( function(error,docs){
			var lastUpdate=0;
			var nbCompliantSPARQL1Features=0;
			var nbFullCompliantSPARQL1Features=0;
			var nbCompliantSPARQL11Features=0;
			var nbEndpointsTotal=0;
			var nbFullCompliantSPARQL11Features=0;
			for (i in docs){
				if(docs[i].nbCompliantSPARQL1Features+docs[i].nbCompliantSPARQL11Features>0)nbEndpointsTotal++;
				if(docs[i].nbCompliantSPARQL1Features>0){
					nbCompliantSPARQL1Features++;
					if(docs[i].nbCompliantSPARQL1Features==nbSPARQL1Features)nbFullCompliantSPARQL1Features++;
				}
				if(docs[i].nbCompliantSPARQL11Features>0){
					nbCompliantSPARQL11Features++;
					if(docs[i].nbCompliantSPARQL11Features==nbSPARQL11Features)nbFullCompliantSPARQL11Features++;
				}
				if(docs[i].lastUpdate>lastUpdate)lastUpdate=docs[i].lastUpdate;
			}
			//console.log(nbCompliantSPARQL1Features+' - '+nbFullCompliantSPARQL1Features+' - '+nbCompliantSPARQL11Features+' - '+nbFullCompliantSPARQL11Features);
			res.render('content/interoperability.jade',{
			lastUpdate: new Date(lastUpdate).toUTCString(),
			epsInter: epsInter,
			configInterop: JSON.parse(fs.readFileSync('./texts/interoperability.json')),
			nbSPARQL1Features: nbSPARQL1Features,
			nbSPARQL11Features: nbSPARQL11Features,
			nbCompliantSPARQL1Features: nbCompliantSPARQL1Features,
			nbFullCompliantSPARQL1Features: nbFullCompliantSPARQL1Features,
			nbCompliantSPARQL11Features: nbCompliantSPARQL11Features,
			nbFullCompliantSPARQL11Features: nbFullCompliantSPARQL11Features,
			ftasks_agg: docs,
			nbEndpointsTotal: nbEndpointsTotal
            });
		});
});

app.get('/iswc2013', function(req, res){
		mongoDBProvider.autocomplete(req.param('q'), function(error,docs){
			res.render('content/iswc2013.jade',{});
		});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});