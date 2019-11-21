// convert to radians
var toRad = function (num) {
    return num * Math.PI / 180
}
//fn
function haversine(AIRPORT, PLANE) {
    var radius = 6371000;

    var start = AIRPORT
    var end = PLANE

    var dLat = toRad(end.latitude - start.latitude)
    var dLon = toRad(end.longitude - start.longitude)
    var lat1 = toRad(start.latitude)
    var lat2 = toRad(end.latitude)

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return radius * c
}