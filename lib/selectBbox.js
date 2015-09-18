var intersect = require('turf-intersect')
var inside = require('turf-inside')
var within = require('turf-within')

var uLine = require('./selectBB-utils-line')
var uMultiPoint = require('./selectBB-utils-multipoint')
var uMultiLine = require('./selectBB-utils-multiline')
var divGT = require('./divideGeoTypes')
var bb = require('./bbox')
var multi = require('./multiCoords')
var lineInt = require('./lineIntersect')

exports.within = function(collection, bbox, callback) {
	var square = bb.createFeat(bbox)
	loop(0, collection.features, square, [], function(r) {
		callback({type:'FeatureCollection', features: r})
	})
}

exports.overlap = function(collection, bbox, callback) {
	var square = bb.createFeat(bbox)
	loop2(0, collection.features, square, [], function(r) {
		callback({type:'FeatureCollection', features: r})
	})
}

function loop2(count,features,square,endFeatures,callback) {
	var index = count
	count = count + 1
	if(count === features.length + 1) {
		callback(endFeatures)
	} else {
		var f = features[index]
		var geoType = f.geometry.type
		if(geoType === 'Polygon' || geoType === 'MultiPolygon') {
			var int = intersect(f,square)
			if(int !== undefined && int !== null) {
				endFeatures.push(f)
			}
			loop2(count, features, square, endFeatures, callback)
		} else if(geoType === 'Point') {
			var isInside = inside(f,square)
			if(isInside === true) {
				endFeatures.push(f)
			}
			loop2(count, features, square, endFeatures, callback)	
		} else if(geoType === 'MultiPoint') {
			var points = multi.point(f)
			uMultiPoint.checkOverlap(points, square, function(res) {
				if(res === true) { 
					endFeatures.push(f) 
				}
				loop2(count, features, square, endFeatures, callback)
			})
		} else if(geoType === 'LineString' || geoType === 'MultiLineString') {
			var bbox = bb.fromFeat(f)
			var bboxFeat = bb.createFeat(bbox)
			var int = intersect(bboxFeat,square)
			if(int !== undefined && int !== null) {
				endFeatures.push(f)
			}
			loop2(count, features, square, endFeatures, callback)
		}
	}
}


function loop(count,features,square,endFeatures,callback) {
	var index = count
	count = count + 1
	if(count === features.length + 1) {
		callback(endFeatures)
	} else {
		var f = features[index]
		var geoType = f.geometry.type
		if(geoType === 'Polygon' || geoType === 'MultiPolygon') {
			var p = f.properties
			var int = intersect(f,square)
			if(int !== undefined && int !== null) {
				int.properties = p
				endFeatures.push(int)
			}
			loop(count, features, square, endFeatures, callback)
		} else if(geoType === 'Point') {
			var isInside = inside(f,square)
			if(isInside === true) {
				endFeatures.push(f)
			}
			loop(count, features, square, endFeatures, callback)	
		} else if(geoType === 'MultiPoint') {
			var points = multi.point(f)
			uMultiPoint.checkPoints(points, square, function(res) {
				if(res !== null) { 
					endFeatures.push(res) 
				}
				loop(count, features, square, endFeatures, callback)
			})
		} else if(geoType === 'LineString') {
			var bbox = bb.fromFeat(f)
			var bboxFeat = bb.createFeat(bbox)
			var int = intersect(bboxFeat,square)
			if(int !== undefined && int !== null) {
				uLine.crop(f,square, function(newFeat) {
					endFeatures.push(newFeat)
				})
			}
			loop(count, features, square, endFeatures, callback)
		} else if(geoType === 'MultiLineString') {
			var lines = multi.line(f)
			var bbox = bb.fromFeat(f)
			var bboxFeat = bb.createFeat(bbox)
			uMultiLine.checkLines(lines, bboxFeat, square, function(res) {
				if(res !== null) {
					endFeatures.push(res)
				}
				loop(count, features, square, endFeatures, callback)
			})
		} else {
			loop(count,features,square,endFeatures,callback)		
		}
	}
}








