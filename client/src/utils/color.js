"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
function rgb(red, green, blue) {
    return {
        red: red,
        green: green,
        blue: blue
    };
}
exports.rgb = rgb;
function toSVG(c) {
    return 'rgb(' + c.red + ',' + c.green + ',' + c.blue + ')';
}
exports.toSVG = toSVG;
var ColorMap = /** @class */ (function () {
    function ColorMap(stops) {
        this.stops = stops;
    }
    ColorMap.prototype.getColor = function (t) {
        t = Math.max(0, Math.min(0.99999999, t));
        var i = Math.floor(t * this.stops.length);
        return this.stops[i];
    };
    return ColorMap;
}());
exports.ColorMap = ColorMap;
