exports.point = function(feature) {
	var features = []
	var c = feature.geometry.coordinates
	var p = feature.properties
	for(i=0;i<c.length;i++) {
		var pt = c[i]
		var f = {type:'Feature', properties: {}, geometry: {}}
		f.geometry.type = 'Point'
		f.geometry.coordinates = pt
		f.properties = p
		features.push(f)
	}
	return features
}

exports.line = function(feature) {
	var features = []
	var c = feature.geometry.coordinates
	var p = feature.properties
	for(x=0;x<c.length;x++) {
		var pt = c[x]
		var f = {type:'Feature', properties: {}, geometry: {}}
		f.geometry.type = 'LineString'
		f.geometry.coordinates = pt
		f.properties = p
		features.push(f)
	}
	return features
}

exports.polygon = function(feature) {
	var features = []
	var c = feature.geometry.coordinates
	var p = feature.properties
	for(i=0;i<c.length;i++) {
		var pt = c[i]
		var f = {type:'Feature', properties: {}, geometry: {}}
		f.geometry.type = 'Polygon'
		f.geometry.coordinates = pt
		f.properties = p
		features.push(f)
	}
	return features
}
