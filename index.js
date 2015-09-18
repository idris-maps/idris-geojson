var selectProp = require('./lib/selectProp')
var selectBbox = require('./lib/selectBbox')
var divideGeoTypes = require('./lib/divideGeoTypes')
var bb = require('./lib/bbox')
var valid = require('./lib/validate')
var lineInt = require('./lib/lineIntersect')

//SELECT by property
exports.selectProp = function(collection, props, callback) {
	selectProp.all(collection, props, function(r) { callback(r) })
}

exports.selectOneProp = function(collection, props, callback) {
	selectProp.one(collection, props, function(r) { callback(r) })
}

//SELECT polygon by bbox
exports.selectWithinBbox = function(collection, bbox, callback) {
	selectBbox.within(collection, bbox, function(r) { callback(r) })
}
exports.selectOverlapBbox = function(collection, bbox, callback) {
	selectBbox.overlap(collection, bbox, function(r) { callback(r) })
}

//DIVIDE
exports.divBy3Geotypes = function(collection, callback) {
	divideGeoTypes.three(collection, function(r) { callback(r) })
}
exports.divBy6Geotypes = function(collection, callback) {
	divideGeoTypes.six(collection, function(r) { callback(r) })
}

//BBOX
exports.featFromBbox = function(bbox, callback) {
	callback(bb.createFeat(bbox))
}
exports.bboxFromFeat = function(feature, callback) {
	callback(bb.fromFeat(feature))
}
exports.bboxFromColl = function(collection, callback) {
	bb.fromColl(collection, function(r) { callback(r) })
}

//VALIDATE

exports.onlyValidFeatures = function(collection, callback) {
	valid.keepValid(collection, function(r) { callback(r) })
}
exports.separateValidFeatures = function(collection, callback) {
	valid.checkFeatures(collection, function(v,i) { callback(v,i) })
}

//LINE INTERSECT

exports.lineIntersectFeats = function(obj1, obj2, callback) {
	var coords1 = obj1.geometry.coordinates
	var coords2 = obj2.geometry.coordinates
	lineInt.all(coords1, coords2, function(r) {
		if(r === false) { callback(false) }
		else {
			var points = []
			for(i=0;i<r.length;i++) {
				var f = {type:'Feature', properties: {}, geometry: {type:'Point', coordinates: r[i]}}
				points.push(f)
			}
			callback(points)
		}
	})
}
exports.lineIntersectCoords = function(obj1, obj2, callback) {
	lineInt.all(obj1, obj2, function(r) { callback(r)})
}
