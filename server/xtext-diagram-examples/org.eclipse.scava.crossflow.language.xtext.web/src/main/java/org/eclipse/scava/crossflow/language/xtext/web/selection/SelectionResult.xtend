/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
package org.eclipse.scava.crossflow.language.xtext.web.selection

import org.eclipse.xtend.lib.annotations.Data
import org.eclipse.xtext.web.server.IServiceResult

@Data
class SelectionResult implements IServiceResult {
	
	int offset
	
}