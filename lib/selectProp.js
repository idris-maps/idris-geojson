var where = require('lodash.where')
//var _ = require('underscore')

exports.all = function(collection, props, callback) {
	var resultProps = where(propsArray(collection), props)
	var resultIndexs = findIndexs(resultProps)
	callback(findFeatures(resultIndexs, collection))
}

exports.one = function(collection, props, callback) {
	var resultProps = where(propsArray(collection), props)
	var resultIndexs = findIndexs(resultProps)
	callback(findFirstFeature(resultIndexs, collection))
}

function findFirstFeature(indexs, collection) {
	var index = indexs[0]
	return collection.features[index]
}

function findFeatures(indexs, collection) {
	var c = {type:'FeatureCollection', features: []}
	for(i=0;i<indexs.length;i++) {
		var index = indexs[i]
		c.features.push(collection.features[index])
	}
	return c
}

function propsArray(collection) {
	var arr = []
	var feats = collection.features
	for(i=0;i<feats.length;i++) {
		feats[i].properties.idrisIndex = i
		arr.push(feats[i].properties)
	}
	return arr
}

function findIndexs(resultProps) {
	var indexs = []
	for(i=0;i<resultProps.length;i++) {
		indexs.push(resultProps[i].idrisIndex)
	}
	return indexs
}
