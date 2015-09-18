exports.three = function(collection, callback) {
	var pts = {type: 'FeatureCollection', features: []}
	var lis = {type: 'FeatureCollection', features: []}
	var pls = {type: 'FeatureCollection', features: []}
	for(i=0;i<collection.features.length;i++) {
		var f = collection.features[i]
		var gt = f.geometry.type
		if(gt === 'Point' || gt === 'MultiPoint') {
			pts.features.push(f)
		}
		if(gt === 'LineString' || gt === 'MultiLineString') {
			lis.features.push(f)
		}
		if(gt === 'Polygon' || gt === 'MultiPolygon') {
			pls.features.push(f)
		}
	}
	var result = []
	if(pts.features.length !== 0) { result.push({geoType: 'Points', collection: pts}) }
	if(lis.features.length !== 0) { result.push({geoType: 'LineStrings', collection: lis}) }
	if(pls.features.length !== 0) { result.push({geoType: 'Polygons', collection: pls}) }
	callback(result)
}

exports.six = function(collection, callback) {
	var pts = {type: 'FeatureCollection', features: []}
	var lis = {type: 'FeatureCollection', features: []}
	var pls = {type: 'FeatureCollection', features: []}
	var mpts = {type: 'FeatureCollection', features: []}
	var mlis = {type: 'FeatureCollection', features: []}
	var mpls = {type: 'FeatureCollection', features: []}
	for(i=0;i<collection.features.length;i++) {
		var f = collection.features[i]
		var gt = f.geometry.type
		if(gt === 'Point') {
			pts.features.push(f)
		}
		if(gt === 'MultiPoint') {
			mpts.features.push(f)
		}
		if(gt === 'LineString') {
			lis.features.push(f)
		}
		if(gt === 'MultiLineString') {
			mlis.features.push(f)
		}
		if(gt === 'Polygon') {
			pls.features.push(f)
		}
		if(gt === 'MultiPolygon') {
			mpls.features.push(f)
		}
	}
	var result = []
	if(pts.features.length !== 0) { result.push({geoType: 'Points', collection: pts}) }
	if(lis.features.length !== 0) { result.push({geoType: 'LineStrings', collection: lis}) }
	if(pls.features.length !== 0) { result.push({geoType: 'Polygons', collection: pls}) }
	if(mpts.features.length !== 0) { result.push({geoType: 'MultiPoints', collection: mpts}) }
	if(mlis.features.length !== 0) { result.push({geoType: 'MultiLineStrings', collection: mlis}) }
	if(mpls.features.length !== 0) { result.push({geoType: 'MultiPolygons', collection: mpls}) }
	callback(result)
}
