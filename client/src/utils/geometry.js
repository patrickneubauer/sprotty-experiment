"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
/**
 * (x,y) coordinates of the origin.
 */
exports.ORIGIN_POINT = Object.freeze({
    x: 0,
    y: 0
});
/**
 * Adds two points.
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {Point} The sum of the two points
 */
function add(p1, p2) {
    return {
        x: p1.x + p2.x,
        y: p1.y + p2.y
    };
}
exports.add = add;
/**
 * Subtracts two points.
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {Point} The difference of the two points
 */
function subtract(p1, p2) {
    return {
        x: p1.x - p2.x,
        y: p1.y - p2.y
    };
}
exports.subtract = subtract;
/**
 * A dimension with both width and height set to a negative value, which is considered as undefined.
 */
exports.EMPTY_DIMENSION = Object.freeze({
    width: -1,
    height: -1
});
/**
 * Checks whether the given dimention is valid, i.e. the width and height are non-zero.
 * @param {Dimension} b - Dimension object
 * @returns {boolean}
 */
function isValidDimension(d) {
    return d.width >= 0 && d.height >= 0;
}
exports.isValidDimension = isValidDimension;
exports.EMPTY_BOUNDS = Object.freeze({
    x: 0,
    y: 0,
    width: -1,
    height: -1
});
function isBounds(element) {
    return 'x' in element
        && 'y' in element
        && 'width' in element
        && 'height' in element;
}
exports.isBounds = isBounds;
/**
 * Combines the bounds of two objects into one, so that the new bounds
 * are the minimum bounds that covers both of the original bounds.
 * @param {Bounds} b0 - First bounds object
 * @param {Bounds} b1 - Second bounds object
 * @returns {Bounds} The combined bounds
 */
function combine(b0, b1) {
    var minX = Math.min(b0.x, b1.x);
    var minY = Math.min(b0.y, b1.y);
    var maxX = Math.max(b0.x + (b0.width >= 0 ? b0.width : 0), b1.x + (b1.width >= 0 ? b1.width : 0));
    var maxY = Math.max(b0.y + (b0.height >= 0 ? b0.height : 0), b1.y + (b1.height >= 0 ? b1.height : 0));
    return {
        x: minX, y: minY, width: maxX - minX, height: maxY - minY
    };
}
exports.combine = combine;
/**
 * Translates the given bounds.
 * @param {Bounds} b - Bounds object
 * @param {Point} p - Vector by which to translate the bounds
 * @returns {Bounds} The translated bounds
 */
function translate(b, p) {
    return {
        x: b.x + p.x,
        y: b.y + p.y,
        width: b.width,
        height: b.height
    };
}
exports.translate = translate;
/**
 * Returns the center point of the bounds of an object
 * @param {Bounds} b - Bounds object
 * @returns {Point} the center point
 */
function center(b) {
    return {
        x: b.x + (b.width >= 0 ? 0.5 * b.width : 0),
        y: b.y + (b.height >= 0 ? 0.5 * b.height : 0)
    };
}
exports.center = center;
function centerOfLine(s, e) {
    var b = {
        x: s.x > e.x ? e.x : s.x,
        y: s.y > e.y ? e.y : s.y,
        width: Math.abs(e.x - s.x),
        height: Math.abs(e.y - s.y)
    };
    return center(b);
}
exports.centerOfLine = centerOfLine;
/**
 * Checks whether the point p is included in the bounds b.
 */
function includes(b, p) {
    return p.x >= b.x && p.x <= b.x + b.width && p.y >= b.y && p.y <= b.y + b.height;
}
exports.includes = includes;
/**
 * Enumeration of possible directions (left, right, up, down)
 */
var Direction;
(function (Direction) {
    Direction[Direction["left"] = 0] = "left";
    Direction[Direction["right"] = 1] = "right";
    Direction[Direction["up"] = 2] = "up";
    Direction[Direction["down"] = 3] = "down";
})(Direction = exports.Direction || (exports.Direction = {}));
/**
 * Returns the "straight line" distance between two points.
 * @param {Point} a - First point
 * @param {Point} b - Second point
 * @returns {number} The Eucledian distance
 */
function euclideanDistance(a, b) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
}
exports.euclideanDistance = euclideanDistance;
/**
 * Returns the distance between two points in a grid, using a
 * strictly vertical and/or horizontal path (versus straight line).
 * @param {Point} a - First point
 * @param {Point} b - Second point
 * @returns {number} The Manhattan distance
 */
function manhattanDistance(a, b) {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
}
exports.manhattanDistance = manhattanDistance;
/**
 * Returns the maximum of the horizontal and the vertical distance.
 * @param {Point} a - First point
 * @param {Point} b - Second point
 * @returns {number} The maximum distance
 */
function maxDistance(a, b) {
    return Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
}
exports.maxDistance = maxDistance;
/**
 * Computes the angle in radians of the given point to the x-axis of the coordinate system.
 * The result is in the range [-pi, pi].
 * @param {Point} p - A point in the Eucledian plane
 */
function angleOfPoint(p) {
    return Math.atan2(p.y, p.x);
}
exports.angleOfPoint = angleOfPoint;
/**
 * Computes the angle in radians between the two given points (relative to the origin of the coordinate system).
 * The result is in the range [0, pi]. Returns NaN if the points are equal.
 * @param {Point} a - First point
 * @param {Point} b - Second point
 */
function angleBetweenPoints(a, b) {
    var lengthProduct = Math.sqrt((a.x * a.x + a.y * a.y) * (b.x * b.x + b.y * b.y));
    if (isNaN(lengthProduct) || lengthProduct === 0)
        return NaN;
    var dotProduct = a.x * b.x + a.y * b.y;
    return Math.acos(dotProduct / lengthProduct);
}
exports.angleBetweenPoints = angleBetweenPoints;
/**
 * Computes a point that is the original `point` shifted towards `refPoint` by the given `distance`.
 * @param {Point} point - Point to shift
 * @param {Point} refPoint - Point to shift towards
 * @param {Point} distance - Distance to shift
 */
function shiftTowards(point, refPoint, distance) {
    var diff = subtract(refPoint, point);
    var normalized = normalize(diff);
    var shift = { x: normalized.x * distance, y: normalized.y * distance };
    return add(point, shift);
}
exports.shiftTowards = shiftTowards;
/**
 * Computes the normalized vector from the vector given in `point`; that is, computing its unit vector.
 * @param {Point} point - Point representing the vector to be normalized
 * @returns {Point} The normalized point
 */
function normalize(point) {
    var mag = magnitude(point);
    if (mag === 0 || mag === 1) {
        return exports.ORIGIN_POINT;
    }
    return {
        x: point.x / mag,
        y: point.y / mag
    };
}
exports.normalize = normalize;
/**
 * Computes the magnitude of the vector given in `point`.
 * @param {Point} point - Point representing the vector to compute the magnitude for
 * @returns {number} The magnitude or also known as length of the `point`
 */
function magnitude(point) {
    return Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
}
exports.magnitude = magnitude;
/**
 * Converts from radians to degrees
 * @param {number} a - A value in radians
 * @returns {number} The converted value
 */
function toDegrees(a) {
    return a * 180 / Math.PI;
}
exports.toDegrees = toDegrees;
/**
 * Converts from degrees to radians
 * @param {number} a - A value in degrees
 * @returns {number} The converted value
 */
function toRadians(a) {
    return a * Math.PI / 180;
}
exports.toRadians = toRadians;
/**
 * Returns whether two numbers are almost equal, within a small margin (0.001)
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {boolean} True if the two numbers are almost equal
 */
function almostEquals(a, b) {
    return Math.abs(a - b) < 1e-3;
}
exports.almostEquals = almostEquals;
/**
 * A diamond or rhombus is a quadrilateral whose four sides all have the same length.
 * It consinsts of four points, a `topPoint`, `rightPoint`, `bottomPoint`, and a `leftPoint`,
 * which are connected by four lines -- the `topRightSideLight`, `topLeftSideLine`, `bottomRightSideLine`,
 * and the `bottomLeftSideLine`.
 */
var Diamond = /** @class */ (function () {
    function Diamond(bounds) {
        this.bounds = bounds;
    }
    Object.defineProperty(Diamond.prototype, "topPoint", {
        get: function () {
            return {
                x: this.bounds.x + this.bounds.width / 2,
                y: this.bounds.y
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Diamond.prototype, "rightPoint", {
        get: function () {
            return {
                x: this.bounds.x + this.bounds.width,
                y: this.bounds.y + this.bounds.height / 2
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Diamond.prototype, "bottomPoint", {
        get: function () {
            return {
                x: this.bounds.x + this.bounds.width / 2,
                y: this.bounds.y + this.bounds.height
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Diamond.prototype, "leftPoint", {
        get: function () {
            return {
                x: this.bounds.x,
                y: this.bounds.y + this.bounds.height / 2
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Diamond.prototype, "topRightSideLine", {
        get: function () {
            return new PointToPointLine(this.topPoint, this.rightPoint);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Diamond.prototype, "topLeftSideLine", {
        get: function () {
            return new PointToPointLine(this.topPoint, this.leftPoint);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Diamond.prototype, "bottomRightSideLine", {
        get: function () {
            return new PointToPointLine(this.bottomPoint, this.rightPoint);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Diamond.prototype, "bottomLeftSideLine", {
        get: function () {
            return new PointToPointLine(this.bottomPoint, this.leftPoint);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Return the closest side of this diamond to the specified `refPoint`.
     * @param {Point} refPoint a reference point
     * @returns {Line} a line representing the closest side
     */
    Diamond.prototype.closestSideLine = function (refPoint) {
        var c = center(this.bounds);
        if (refPoint.x > c.x) {
            if (refPoint.y > c.y) {
                return this.bottomRightSideLine;
            }
            else {
                return this.topRightSideLine;
            }
        }
        else {
            if (refPoint.y > c.y) {
                return this.bottomLeftSideLine;
            }
            else {
                return this.topLeftSideLine;
            }
        }
    };
    return Diamond;
}());
exports.Diamond = Diamond;
/**
 * A line made up from two points.
 */
var PointToPointLine = /** @class */ (function () {
    function PointToPointLine(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
    Object.defineProperty(PointToPointLine.prototype, "a", {
        get: function () {
            return this.p1.y - this.p2.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointToPointLine.prototype, "b", {
        get: function () {
            return this.p2.x - this.p1.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointToPointLine.prototype, "c", {
        get: function () {
            return this.p2.x * this.p1.y - this.p1.x * this.p2.y;
        },
        enumerable: true,
        configurable: true
    });
    PointToPointLine.prototype.intersection = function (other) {
        return {
            x: (this.c * other.b - other.c * this.b) / (this.a * other.b - other.a * this.b),
            y: (this.a * other.c - other.a * this.c) / (this.a * other.b - other.a * this.b)
        };
    };
    return PointToPointLine;
}());
exports.PointToPointLine = PointToPointLine;
