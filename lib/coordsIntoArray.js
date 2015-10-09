module.exports = function(feature) {
	var gt = feature.geometry.type
	var c = feature.geometry.coordinates
	if(gt === 'Point') { return [c] }
	if(gt === 'LineString') { return c }
	if(gt === 'Polygon') { return c[0] }
	if(gt === 'MultiPoint') { return c }
	if(gt === 'MultiLineString') {
		loopMLS(0, c, [], function(arr) {
			return arr
		})
	}
	if(gt === 'MultiPolygon') {
		loopMP(0, c, [], function(arr) {
			return arr
		})
	}
}

function loopMP(count, c, arr, callback) {
	var index = count
	count = count + 1
	if(count === c.length + 1) {
		callback(arr)
	} else {
		var cc = c[index][0]
		for(j=0;j<cc.length;j++) {
			arr.push(cc[i])
		}
		setTimeout(function() {
			loopMLS(count, c, arr, callback)
		},0)
	}
}

function loopMLS(count, c, arr, callback) {
	var index = count
	count = count + 1
	if(count === c.length + 1) {
		callback(arr)
	} else {
		var cc = c[index]
		for(j=0;j<cc.length;j++) {
			arr.push(cc[i])
		}
		setTimeout(function() {
			loopMLS(count, c, arr, callback)
		},0)
	}
}
