module.exports = function(feature) {
	var gt = feature.geometry.type
	var c = feature.geometry.coordinates
	if(gt === 'Point') { return [c] }
	if(gt === 'LineString') { return c }
	if(gt === 'Polygon') { return c[0] }
	if(gt === 'MultiPoint') { return c }
	if(gt === 'MultiLineString') {
		var arr = []
		for(i=0;i<c.length;i++) {
			var cc = c[i]
			for(j=0;j<cc.length;j++) {
				arr.push(cc[i])
			}
		}
		return arr
	}
	if(gt === 'MultiPolygon') {
		var arr = []
		for(i=0;i<c.length;i++) {
			var cc = c[i][0]
			for(j=0;j<cc.length;j++) {
				arr.push(cc[i])
			}
		}
		return arr
	}
}
