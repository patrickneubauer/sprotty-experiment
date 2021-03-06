"use strict";
/*
 * Copyright (C) 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
/**
 * A helper class that allows to easily create fluent iterables.
 */
var FluentIterableImpl = /** @class */ (function () {
    function FluentIterableImpl(startFn, nextFn) {
        this.startFn = startFn;
        this.nextFn = nextFn;
    }
    FluentIterableImpl.prototype[Symbol.iterator] = function () {
        var _this = this;
        var _a;
        var iterator = (_a = {
                state: this.startFn(),
                next: function () { return _this.nextFn(iterator.state); }
            },
            _a[Symbol.iterator] = function () { return iterator; },
            _a);
        return iterator;
    };
    FluentIterableImpl.prototype.filter = function (callback) {
        return filterIterable(this, callback);
    };
    FluentIterableImpl.prototype.map = function (callback) {
        return mapIterable(this, callback);
    };
    FluentIterableImpl.prototype.forEach = function (callback) {
        var iterator = this[Symbol.iterator]();
        var index = 0;
        var result;
        do {
            result = iterator.next();
            if (result.value !== undefined)
                callback(result.value, index);
            index++;
        } while (!result.done);
    };
    return FluentIterableImpl;
}());
exports.FluentIterableImpl = FluentIterableImpl;
/**
 * Converts a FluentIterable into an array. If the input is an array, it is returned unchanged.
 */
function toArray(input) {
    if (input.constructor === Array) {
        return input;
    }
    var result = [];
    input.forEach(function (element) { return result.push(element); });
    return result;
}
exports.toArray = toArray;
exports.DONE_RESULT = Object.freeze({ done: true, value: undefined });
/**
 * Create a fluent iterable that filters the content of the given iterable or array.
 */
function filterIterable(input, callback) {
    return new FluentIterableImpl(function () { return createIterator(input); }, function (iterator) {
        var result;
        do {
            result = iterator.next();
        } while (!result.done && !callback(result.value));
        return result;
    });
}
exports.filterIterable = filterIterable;
/**
 * Create a fluent iterable that maps the content of the given iterable or array.
 */
function mapIterable(input, callback) {
    return new FluentIterableImpl(function () { return createIterator(input); }, function (iterator) {
        var _a = iterator.next(), done = _a.done, value = _a.value;
        if (done)
            return exports.DONE_RESULT;
        else
            return { done: false, value: callback(value) };
    });
}
exports.mapIterable = mapIterable;
/**
 * Create an iterator for the given iterable or array.
 */
function createIterator(collection) {
    var method = collection[Symbol.iterator];
    if (typeof method === 'function') {
        return method.call(collection);
    }
    var length = collection.length;
    if (typeof length === 'number' && length >= 0) {
        return new ArrayIterator(collection);
    }
    return { next: function () { return exports.DONE_RESULT; } };
}
/**
 * Iterator implementation for arrays.
 */
var ArrayIterator = /** @class */ (function () {
    function ArrayIterator(array) {
        this.array = array;
        this.index = 0;
    }
    ArrayIterator.prototype.next = function () {
        if (this.index < this.array.length)
            return { done: false, value: this.array[this.index++] };
        else
            return exports.DONE_RESULT;
    };
    ArrayIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    return ArrayIterator;
}());
