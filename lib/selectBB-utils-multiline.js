var intersect = require('turf-intersect')
var uLine = require('./selectBB-utils-line')

exports.checkLines = function(features, bboxFeat, square, callback) {
	loop(0, features, bboxFeat, square, [], function(lines) {
		if(lines.length === 0) {
			callback(null)
		} else if(lines.length === 1) {
			callback(lines[0])
		} else {
			var newFeat = {
				type: 'Feature',
				properties: lines[0].properties,
				geometry: {
					type: 'MultiLineString',
					coordinates: []
				}
			}
			for(zz=0;zz<lines.length;zz++) {
				newFeat.geometry.coordinates.push(lines[zz].geometry.coordinates)		
			}
			callback(newFeat)
		}
	})
}

function loop(count, features, bboxFeat, square, fOverlap, callback) {
	var index = count
	count = count + 1
	if(count === features.length + 1) {
		callback(fOverlap)	
	} else {
		var fL = features[index]
		var intL = intersect(fL,bboxFeat)
		if(intL !== undefined && intL !== null) {
			uLine.crop(fL, square, function(newFeat) {
				fOverlap.push(newFeat)
			})
		}
		loop(count, features, bboxFeat, square, fOverlap, callback)
	}
}
