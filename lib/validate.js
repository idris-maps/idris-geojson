var gjv = require('geojson-validation')

exports.collection = function(data, callback) { 
	validCollection(data, function(valid) { 
		callback(valid)
	}) 
}

exports.checkFeatures = function(data, callback) {
	sepInvalid(data, function(valids,invalids) {
		for(i=0;i<invalids.length;i++) {
			gjv.isFeature(invalids[i], function(valid, errs) {
				invalids[i].properties.error = errs
			})
		}
		callback(valids, invalids)
	})
}

exports.keepValid = function(data, callback) {
	sepInvalid(data, function(valids, invalids) {
		callback(valids)
	})
}
 
function validCollection(data, callback) {
	gjv.isFeatureCollection(data, function(valid, errs) {
		callback(valid)
	})
}

function sepInvalid(data, callback) {
	var valids = {type:'FeatureCollection', features:[]}
	var invalids = {type:'FeatureCollection', features:[]}
	for(i=0;i<data.features.length;i++) {
		gjv.isFeature(data.features[i], function(valid, errs) {
			if(valid === false) { invalids.features.push(data.features[i]) }
			else { valids.features.push(data.features[i]) }
		})
	}
	callback(valids, invalids)
}
