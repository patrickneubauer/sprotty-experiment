"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
var smodel_1 = require("./smodel");
/**
 * Model element types can include a colon to separate the basic type and a sub-type. This function
 * extracts the basic type of a model element.
 */
function getBasicType(schema) {
    if (!schema.type)
        return '';
    var colonIndex = schema.type.indexOf(':');
    if (colonIndex >= 0)
        return schema.type.substring(0, colonIndex);
    else
        return schema.type;
}
exports.getBasicType = getBasicType;
/**
 * Model element types can include a colon to separate the basic type and a sub-type. This function
 * extracts the sub-type of a model element.
 */
function getSubType(schema) {
    if (!schema.type)
        return '';
    var colonIndex = schema.type.indexOf(':');
    if (colonIndex >= 0)
        return schema.type.substring(colonIndex + 1);
    else
        return schema.type;
}
exports.getSubType = getSubType;
/**
 * Find the element with the given identifier. If you need to find multiple elements, using an
 * SModelIndex might be more effective.
 */
function findElement(parent, elementId) {
    if (parent.id === elementId)
        return parent;
    if (parent.children !== undefined) {
        for (var _i = 0, _a = parent.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var result = findElement(child, elementId);
            if (result !== undefined)
                return result;
        }
    }
    return undefined;
}
exports.findElement = findElement;
/**
 * Find a parent element that satisfies the given predicate.
 */
function findParent(element, predicate) {
    var current = element;
    while (current !== undefined) {
        if (predicate(current))
            return current;
        else if (current instanceof smodel_1.SChildElement)
            current = current.parent;
        else
            current = undefined;
    }
    return current;
}
exports.findParent = findParent;
/**
 * Find a parent element that implements the feature identified with the given predicate.
 */
function findParentByFeature(element, predicate) {
    var current = element;
    while (current !== undefined) {
        if (predicate(current))
            return current;
        else if (current instanceof smodel_1.SChildElement)
            current = current.parent;
        else
            current = undefined;
    }
    return current;
}
exports.findParentByFeature = findParentByFeature;
/**
 * Translate a point from the coordinate system of the source element to the coordinate system
 * of the target element.
 */
function translatePoint(point, source, target) {
    if (source !== target) {
        // Translate from the source to the root element
        while (source instanceof smodel_1.SChildElement) {
            point = source.localToParent(point);
            source = source.parent;
            if (source === target)
                return point;
        }
        // Translate from the root to the target element
        var targetTrace = [];
        while (target instanceof smodel_1.SChildElement) {
            targetTrace.push(target);
            target = target.parent;
        }
        if (source !== target)
            throw new Error("Incompatible source and target: " + source.id + ", " + target.id);
        for (var i = targetTrace.length - 1; i >= 0; i--) {
            point = targetTrace[i].parentToLocal(point);
        }
    }
    return point;
}
exports.translatePoint = translatePoint;
