var intersect = require('turf-intersect')
var inside = require('turf-inside')
var within = require('turf-within')
var divGT = require('./divideGeoTypes')
var bb = require('./bbox')
var multi = require('./multiCoords')
var lineInt = require('./lineIntersect')

exports.crop = function(f,square,callback) {
	var fProp = f.properties
	var c = f.geometry.coordinates
	var sLines = getSquareLines(square)
	var allPoints = addInside(c, square)
	var points = setTrueIfOnBorder(allPoints, sLines)
	var partlyOutside = false
	for(i=0;i<points.length;i++) {
		if(points[i].inside === false) { partlyOutside = true; break }
	}
	if(partlyOutside === false) {
		callback(f)
	} else {
		var pointsInside = removeOutside(points)
		var pointsMaybeCut = addBorderPoints(pointsInside,sLines)
		if(checkIfCut(pointsMaybeCut) === false) {
			f.geometry.coordinates = pointsMaybeCut
			callback(f)
		} else {
			cutLoop(0, pointsMaybeCut, [], [], function(newCoords) {
				f.geometry.coordinates = newCoords
				f.geometry.type = 'MultiLineString'
				callback(f)
			})
		}
	}
}

function cutLoop(count, points, tempArr, finalArr, callback) {
	var index = count
	count = count + 1
	if(count === points.length + 1) {
		finalArr.push(tempArr)
		callback(finalArr)
	} else {
		var pointZ = points[index]
		if(pointZ === 'cut') {
			if(tempArr.length > 1) {
				finalArr.push(tempArr)
				tempArr = []
			}
		} else {
			tempArr.push(pointZ)
		}
		cutLoop(count, points, tempArr, finalArr, callback)
	}
}

function checkIfCut(pointsMaybeCut) {
	var answer = false
	for(z=0;z<pointsMaybeCut.length;z++) {
		if(pointsMaybeCut[z] === 'cut') {
			answer = true;
			break
		}
	}
	return answer
}

function addBorderPoints(pointsInside,sLines) {
	var all = []
	for(i=0;i<pointsInside.length;i++) {
		var prev = pointsInside[i - 1]
		var p = pointsInside[i]
		var next = pointsInside[i + 1]
		if(p.inside === true) { all.push(p.point) }
		else {
			if(prev === undefined) {
				if(next.inside === true) {
					var line = [p.point,next.point]
					var x = findCrossing(line, sLines)
					if(x !== null) {
						all.push([x.x, x.y])
					}
				}
			} else if(next === undefined) {
				if(prev.inside === true) {
					var line = [prev.point,p.point]
					var x = findCrossing(line, sLines)
					if(x !== null) {
						all.push([x.x, x.y])
					}
				}
			} else {
				if(prev.inside === true && next.inside === true) {
					var line1 = [prev.point,p.point]
					var x1 = findCrossing(line1, sLines)
					if(x1 !== null) {
						all.push([x1.x, x1.y])
					}
					all.push('cut')
					var line2 = [p.point,next.point]
					var x2 = findCrossing(line2, sLines)
					if(x2 !== null) {
						all.push([x2.x, x2.y])
					}
				} else if(next.inside === false && prev.inside === true) {
					var line = [prev.point,p.point]
					var x = findCrossing(line, sLines)
					if(x !== null) {
						all.push([x.x, x.y])
					}
					all.push('cut')
				} else if(prev.inside === false && next.inside === true) {
					all.push('cut')
					var line = [p.point,next.point]
					var x = findCrossing(line, sLines)
					if(x !== null) {
						all.push([x.x, x.y])
					}
				}
			}
		}
	}
	return all
}

function findCrossing(line, sLines) {
	var resp = null
	for(y=0;y<sLines.length;y++) {
		var x = lineInt.oneSync(line, sLines[y])
		if(x !== false) { resp = x }
	}
	return resp
}

function setTrueIfOnBorder(pts,sLines) {
	for(i=0;i<pts.length;i++) {
		if(pts[i].inside === false) {
			if(onBorder(pts[i].point,sLines) === true) {
				pts[i].inside = true
			}
		}
	}
	return pts
}

function onBorder(point,sLines) {
	var xs = []
	var ys = []
	for(z=0;z<sLines.length;z++) {
		var sl = sLines[z]
		if(sl[0][0] === sl[1][0]) { xs.push(sl[0][0]) }
		if(sl[0][1] === sl[1][1]) { ys.push(sl[0][1]) }
	}
	if(xs[0] > xs[1]) {
		var xMin = xs[1]
		var xMax = xs[0]	
	} else {
		var xMin = xs[0]
		var xMax = xs[1]
	} 
	if(ys[0] > ys[1]) {
		var yMin = ys[1]
		var yMax = ys[0]	
	} else {
		var yMin = ys[0]
		var yMax = ys[1]
	} 
	var on = null
	if(point[0] === xMin) { on = 'x'; }
	if(point[0] === xMax) { on = 'x'; }
	if(point[1] === yMin) { on = 'y'; }
	if(point[1] === yMax) { on = 'y'; }
	if(on === 'x') {
		if(point[1] > yMin && point[1] < yMax) {
			return true
		} else { return false }
	} else if(on === 'y') {
		if(point[0] > xMin && point[0] < xMax) {
			return true
		} else { return false }
	} else {
		return false
	}
}

function addInside(c, square) {
	var cs = []
	for(k=0;k<c.length;k++) {
		var pt = {type:'Feature', geometry: {type:'Point', coordinates:c[k]}}
		var isInside = inside(pt, square)
		cs.push({inside: isInside, point: c[k]})
	}
	return cs
}

function removeOutside(points) {
	var pointsInside = []
	for(i=0;i<points.length;i++) {
		if(points[i].inside === true) { 
			if(points[i - 1] !== undefined) {
				if(points[i - 1].inside === false) { pointsInside.push(points[i - 1]) }
			}
			pointsInside.push(points[i])
			if(points[i + 1] !== undefined) {
				if(points[i + 1].inside === false) { pointsInside.push(points[i + 1]) }
			}
		}
	}
	return pointsInside
}

function getSquareLines(square) {
	var cc = square.geometry.coordinates
	var c = cc[0]
	return [
		[c[0],c[1]],
		[c[1],c[2]],
		[c[2],c[3]],
		[c[3],c[4]]
	]
}
/*
function checkIfMultiLine(final, callback) {
	var simpl = true
	var simplCoords = []
	for(i=0;i<final.length;i++) { 
		simplCoords.push([final[i][0], final[i][1]])
		if(final[i][2] === 'start') { simpl = false; break }
	}
	callback(simpl, simplCoords)
}

function getFinal(c, square, callback) {
	var cs = checkIfPointsInside(c, square)
	var pointsInside = removeUselessPoints(cs)
	var final = getFinalPoints(pointsInside, square)
	callback(final)
}

function loopBbOverlap(count, features, square, endFeatures, callback) {
	var index = count
	count = count + 1
	if(count === features.length + 1) {
		callback(endFeatures)
	} else {
		var f = features[index]
		var bbox = bb.fromFeat(f)
		var bboxFeat = bb.createFeat(bbox)
		var int = intersect(bboxFeat,square)
		if(int !== undefined && int !== null) {
			endFeatures.push(f)
		}
		loopBbOverlap(count, features, square, endFeatures, callback)
	}
}

function removeUselessPoints(cs) {
	var pointsInside = []
	for(i=0;i<cs.length;i++) {
		if(cs[i].isInside === true) { 
			if(cs[i - 1] !== undefined) {
				if(cs[i - 1].isInside !== true) { pointsInside.push(cs[i - 1]) }
			}
			pointsInside.push(cs[i])
			if(cs[i + 1] !== undefined) {
				if(cs[i + 1].isInside !== true) { pointsInside.push(cs[i + 1]) }
			}
		}
	}
	return pointsInside
}

function getFinalPoints(pointsInside, square) {
	var final = []
	for(i=0;i<pointsInside.length;i++) {
		var p = pointsInside[i]
		var pPrev = pointsInside[i - 1]
		var pNext = pointsInside[i + 1]
		if(p.isInside === true) { 
			final.push(p.point) 
		} else {
			if(pPrev !== undefined && pPrev.isInside === true) {
				var line = [pPrev.point, p.point]
				var sLines = getSquareLines(square)
				for(j=0;j<sLines.length;j++) {
					var linInt = lineInt.oneSync(line, sLines[j])
					if(linInt !== false) {
						final.push([linInt.x, linInt.y, 'end'])
					}
				}
			} else if(pNext !== undefined && pNext.isInside === true) {
				var line = [p.point, pNext.point]
				var sLines = getSquareLines(square)
				for(j=0;j<sLines.length;j++) {
					var linInt = lineInt.oneSync(line, sLines[j])
					if(linInt !== false) {
						final.push([linInt.x, linInt.y, 'start'])
					}
				}					
			}
		}
	}
	return final
}



function multiLineLoop(count, points, tempArr, final, callback) {
	var index = count
	count = count + 1
	if(count === points.length + 1) {
		final.push(tempArr)
		callback(final)
	} else {
		var p = points[index]
		if(p[2] === 'start') {
			final.push(tempArr)
			tempArr = []
		}
		tempArr.push([p[0],p[1]])
		multiLineLoop(count, points, tempArr, final, callback)
	}
}



function getSquareLines(square) {
	var cc = square.geometry.coordinates
	var c = cc[0]
	return [
		[c[0],c[1]],
		[c[1],c[2]],
		[c[2],c[3]],
		[c[3],c[4]]
	]
}

function checkIfPointsInside(c, square) {
	var cs = []
	for(k=0;k<c.length;k++) {
		var pt = {type:'Feature', geometry: {type:'Point', coordinates:c[k]}}
		var isInside = inside(pt, square)
		cs.push({isInside: isInside, point: c[k]})
	}
	return cs
}
*/
