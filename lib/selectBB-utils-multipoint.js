var inside = require('turf-inside')

exports.checkPoints = function(features, square, callback) {
	loop(0,features,square,[],function(fInside) {
		if(fInside.length === 0) { 
			callback(null)
		} else if(fInside.length === 1) {
			callback(fInside[0])
		} else {
			var newFeat = {
				type: 'Feature',
				properties: fInside[0].properties,
				geometry: {
					type: 'MultiPoint',
					coordinates: []
				}
			}
			for(zz=0;zz<fInside.length;zz++) {
				newFeat.geometry.coordinates.push(fInside[zz].geometry.coordinates)		
			}
			callback(newFeat)
		}
	})
}

exports.checkOverlap = function(features, square, callback) {
	loop(0,features,square,[],function(fInside) {
		if(fInside.length === 0) {
			callback(false)		
		} else {
			callback(true)
		}
	})
}

function loop(count,features,square,fInside,callback) {
	var index = count
	count = count + 1
	if(count === features.length + 1) {
		callback(fInside)
	} else {
		var f1 = features[index]
		var isInside = inside(f1, square)
		if(isInside === true) {
			fInside.push(f1)
		}
		loop(count,features,square,fInside,callback)
	}
}
