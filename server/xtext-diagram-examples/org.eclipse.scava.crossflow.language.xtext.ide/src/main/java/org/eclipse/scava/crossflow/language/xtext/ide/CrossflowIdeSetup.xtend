/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
package org.eclipse.scava.crossflow.language.xtext.ide

import com.google.inject.Guice
import org.eclipse.xtext.util.Modules2
import org.eclipse.scava.crossflow.language.xtext.CrossflowRuntimeModule
import org.eclipse.scava.crossflow.language.xtext.CrossflowStandaloneSetup

/**
 * Initialization support for running Xtext languages as language servers.
 */
class CrossflowIdeSetup extends CrossflowStandaloneSetup {

	override createInjector() {
		Guice.createInjector(Modules2.mixin(new CrossflowRuntimeModule, new CrossflowIdeModule))
	}
	
}
