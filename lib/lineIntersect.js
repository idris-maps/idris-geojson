exports.one = function(line1, line2, callback) {
	callback(intersection(line1,line2))
}

exports.oneSync = function(line1, line2, callback) {
	return intersection(line1,line2)
}

exports.all = function(lineCoordinates1, lineCoordinates2, callback) {
	var allLines1 = []
	for(i=0;i<lineCoordinates1.length;i++) {
		if(i !== 0) {
			var pt = lineCoordinates1[i]
			var prevPt = lineCoordinates1[i - 1]
			allLines1.push([prevPt, pt])
		}
	}
	var allLines2 = []
	for(i=0;i<lineCoordinates2.length;i++) {
		if(i !== 0) {
			var pt = lineCoordinates2[i]
			var prevPt = lineCoordinates2[i - 1]
			allLines2.push([prevPt, pt])
		}
	}
	var results = []
	for(i=0;i<allLines1.length;i++) {
		var line1 = allLines1[i]
		for(j=0;j<allLines2.length;j++) {
			var line2 = allLines2[j]
			results.push(intersection(line1,line2))
		}
	}
	var answer = []
	for(i=0;i<results.length;i++) {
		if(results[i].x !== undefined && results[i].y !== undefined) {
			answer.push([results[i].x, results[i].y])
		}
	}
	if(answer.length === 0) {
		callback(false)
	} else {
		callback(answer)
	}
}

function intersection(line1, line2) {
	var p0 = {x: line1[0][0], y: line1[0][1]}
	var p1 = {x: line1[1][0], y: line1[1][1]}
	var p2 = {x: line2[0][0], y: line2[0][1]}
	var p3 = {x: line2[1][0], y: line2[1][1]}
	return getCollisionPt(p0, p1, p2, p3)
}
/*
http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
*/

function getCollisionPt(p0, p1, p2, p3) {
    var s1, s2;
    s1 = {x: p1.x - p0.x, y: p1.y - p0.y};
    s2 = {x: p3.x - p2.x, y: p3.y - p2.y};

    var s10_x = p1.x - p0.x;
    var s10_y = p1.y - p0.y;
    var s32_x = p3.x - p2.x;
    var s32_y = p3.y - p2.y;

    var denom = s10_x * s32_y - s32_x * s10_y;

    if(denom == 0) {
        return false;
    }

    var denom_positive = denom > 0;

    var s02_x = p0.x - p2.x;
    var s02_y = p0.y - p2.y;

    var s_numer = s10_x * s02_y - s10_y * s02_x;

    if((s_numer < 0) == denom_positive) {
        return false;
    }

    var t_numer = s32_x * s02_y - s32_y * s02_x;

    if((t_numer < 0) == denom_positive) {
        return false;
    }

    if((s_numer > denom) == denom_positive || (t_numer > denom) == denom_positive) {
        return false;
    }

    var t = t_numer / denom;

    var p = {x: p0.x + (t * s10_x), y: p0.y + (t * s10_y)};
    return p;
}
