export function distanceGPSReverse(lat, lng, angle, distance){
    return destinationPoint(lat, lng, angle, distance);
}

const toRad = function(angle) {
    return angle * Math.PI / 180;
 }
 
 const toDeg = function(angle) {
    return angle * 180 / Math.PI;
 }
 
 const destinationPoint = function(lat, lng, brng, dist) {
    dist = dist / 6371;  
    brng = toRad(brng);  
 
    var lat1 = toRad(lat), lon1 = toRad(lng);
 
    var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) + 
                         Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
 
    var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                                 Math.cos(lat1), 
                                 Math.cos(dist) - Math.sin(lat1) *
                                 Math.sin(lat2));
 
    if (isNaN(lat2) || isNaN(lon2)) return null;
 
    return {
        "lat": toDeg(lat2),
        "lng": toDeg(lon2),
    };
 }