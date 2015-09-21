# idris-geojson

Utilities for querying and handling GeoJSON data

## install

```
npm install idris-geojson
```

## Usage

```
var ig = require('idris-geojson')
```

### Select by properties

**.selectProp(** collection, object, callback **)**

```
ig.selectProp(countriesCollection, {continent: 'Europe'}, function(featureCollection) {
	// returns a featureCollection
})
```

**.selectOneProp(** collection, object, callback **)**

```
ig.selectOneProp(countriesCollection, {continent: 'Europe'}, function(feature) {
	// returns a feature
})
```

### Select by bounding box

```
var bbox = [[min_longitude, min_latitude],[max_longitude, max_latitude]]
```

**.selectWithinBbox(** collection, bbox, callback **)**

Cuts the features to fit inside the bounding box

```
ig.selectOneProp(countriesCollection, [[-12,35],[26,63]], function(feature) {
	// returns a featureCollection
})
```

**.selectOverlapBbox(** collection, bbox, callback **)**

Keeps features that overlap with the bounding box

```
ig.selectOneProp(countriesCollection, [[-12,35],[26,63]], function(feature) {
	// returns a featureCollection
})
```

### Bounding box utilities

**.bboxFromColl(** collection, callback **)**

Get the bounding box of a collection

```
ig.fromColl(collection, function(bbox) {
	// returns a bounding box
})

```

**.bboxFromFeat(** feature, callback **)**

Get the bounding box of a feature

```
ig.fromFeat(collection, function(bbox) {
	// returns a bounding box
})

```

**.featFromBbox(** bbox, callback **)**

Returns a polygon feature

```
ig.featFromBbox(bbox, function(feature) {
	// returns a feature
})

```

### Divide into geometry types

**.divBy3Geotypes(** collection , callback **)**

Divides the collection into three geometry types (points, linestrings and polygons). ```MultiPoint``` is in "Points", ```MultiLineString``` is in "LineStrings" and ```MultiPolygon``` is in "Polygons"

```
ig.divBy3Geotypes(collection, function(arrayOfCollections) {
	// returns a an array of featureCollection
})
```
The returned array contains objects with ```geoType``` and ```collection``` and could look like this

```
[ { geoType: 'Points',
    collection: { type: 'FeatureCollection', features: [Object] } },
  { geoType: 'LineStrings',
    collection: { type: 'FeatureCollection', features: [Object] } },
  { geoType: 'Polygons',
    collection: { type: 'FeatureCollection', features: [Object] } } ]
```

**.divBy6Geotypes(** collection , callback **)**

Divides the collection into all six geometry types (points, linestrings, polygons, multipoints, multilinestrings and multipolygons).

```
ig.divBy6Geotypes(collection, function(arrayOfCollections) {
	// returns a an array of featureCollection
})
```
The returned array contains objects with ```geoType``` and ```collection``` and could look like this

```
[ { geoType: 'Points',
    collection: { type: 'FeatureCollection', features: [Object] } },
  { geoType: 'MultiLineStrings',
    collection: { type: 'FeatureCollection', features: [Object] } },
  { geoType: 'LineStrings',
    collection: { type: 'FeatureCollection', features: [Object] } } ]
```

### Validation

**.separateValidFeatures(** collection, callback **)**

Separate valid features from invalid features

```
ig.separateValidFeatures(collection, function(valid, invalid) {
	// returns two featureCollections
	//
	// features in the "invalid" collection have an error property with the error message
})
```

**.onlyValidFeatures(** collection, callback **)**

Get only the valid features of a collection.

```
ig.onlyValidFeatures(collection, function(featureCollection) {
	// returns a collection with only valid features
})
```
