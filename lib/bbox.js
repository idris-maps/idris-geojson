var cToA = require('./coordsIntoArray')

exports.createFeat = function(bbox) {
	return getFeatureFromBbox(bbox)
}

exports.fromFeat = function(feature) {
	var pointArray = cToA(feature)
	return getBboxFromPtArray(pointArray)
}

exports.fromColl = function(collection, callback) {
	var arrOfPointArrays = []
	loopArrOfPtArrs(0, collection.features, [], function(pointArray) {
		callback(getBboxFromPtArray(pointArray))
	})
}

function loopArrOfPtArrs(count, features, arr, callback) {
	var index = count
	count = count + 1
	if(count === features.length + 1) {
		callback(arr)
	} else {
		var f = features[index]
		var pts = cToA(f)
		for(i=0;i<pts.length;i++) {
			if(pts[i] !== undefined) { arr.push(pts[i]) }
		}
		loopArrOfPtArrs(count, features, arr, callback)
	}
}

function getFeatureFromBbox(bbox) {
	var bboxFeature = {type: 'Feature', properties: {}, geometry: {}}
	bboxFeature.geometry = {
		type: 'Polygon',
		coordinates: [[
			[bbox[1][0], bbox[0][1]], 
			[bbox[1][0], bbox[1][1]], 
			[bbox[0][0], bbox[1][1]], 
			[bbox[0][0], bbox[0][1]], 
			[bbox[1][0], bbox[0][1]]
		]]
	}
	return bboxFeature
}

function getBboxFromPtArray(arr) {
	var lngMin = 1000000
	var latMin = 1000000
	var lngMax = -1000000
	var latMax = -1000000
	for(i=0;i<arr.length;i++) {
		var p = arr[i]
		if(p[0] < lngMin) { lngMin = p[0] }
		if(p[0] > lngMax) { lngMax = p[0] }
		if(p[1] < latMin) { latMin = p[1] }
		if(p[1] > latMax) { latMax = p[1] }
	}	
	return [[lngMin,latMin],[lngMax,latMax]]
}
