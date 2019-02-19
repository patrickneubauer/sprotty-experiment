"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
exports.hoverFeedbackFeature = Symbol('hoverFeedbackFeature');
function isHoverable(element) {
    return element.hasFeature(exports.hoverFeedbackFeature);
}
exports.isHoverable = isHoverable;
exports.popupFeature = Symbol('popupFeature');
function hasPopupFeature(element) {
    return element.hasFeature(exports.popupFeature);
}
exports.hasPopupFeature = hasPopupFeature;
