/*
	From wikipedia: https://en.wikipedia.org/wiki/GeoJSON
*/

var point = { 
	"type": "Point", 
	"coordinates": [30, 10]
}

var lineString = {
	"type": "LineString", 
	"coordinates": [
		[30, 10], [10, 30], [40, 40]
	]
}

var polygon = {
	"type": "Polygon", 
	"coordinates": [
		[[30, 10], [40, 40], [20, 40], [10, 20], [30, 10]]
	]	
}

var polygonHole = {
	"type": "Polygon", 
	"coordinates": [
		[[35, 10], [45, 45], [15, 40], [10, 20], [35, 10]], 
		[[20, 30], [35, 35], [30, 20], [20, 30]]
	]
}

var multiPoint = { 
	"type": "MultiPoint", 
	"coordinates": [
		[10, 40], [40, 30], [20, 20], [30, 10]
	]
}

var multiLineString = {
	"type": "MultiLineString", 
	"coordinates": [
		[[10, 10], [20, 20], [10, 40]], 
		[[40, 40], [30, 30], [40, 20], [30, 10]]
	]
}

var multiPolygon = {
	"type": "MultiPolygon", 
	"coordinates": [
		[
			[[30, 20], [45, 40], [10, 40], [30, 20]]
		], 
		[
			[[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]
		]
	]
}

var multiPolygonHole = { 
	"type": "MultiPolygon", 
	"coordinates": [
		[
			[[40, 40], [20, 45], [45, 30], [40, 40]]
		], 
		[
			[[20, 35], [10, 30], [10, 10], [30, 5], [45, 20], [20, 35]], 
			[[30, 20], [20, 15], [20, 25], [30, 20]]
		]
	]
}

var collection = {
	type: 'FeatureCollection',
	features: [
		{type: 'Feature', properties: { id: 0 }, geometry:point},
		{type: 'Feature', properties: { id: 1 }, geometry:lineString},
		{type: 'Feature', properties: { id: 2 }, geometry:polygon},
		{type: 'Feature', properties: { id: 3 }, geometry:polygonHole},
		{type: 'Feature', properties: { id: 4 }, geometry:multiPoint},
		{type: 'Feature', properties: { id: 5 }, geometry:multiLineString},
		{type: 'Feature', properties: { id: 6 }, geometry:multiPolygon},
		{type: 'Feature', properties: { id: 7 }, geometry:multiPolygonHole}
	]
}

exports.point = point
exports.lineString = lineString
exports.polygon = polygon
exports.polygonHole = polygonHole
exports.multiPoint = multiPoint
exports.multiLineString = multiLineString
exports.multiPolygon = multiPolygon
exports.multiPolygonHole = multiPolygonHole
exports.collection = collection
