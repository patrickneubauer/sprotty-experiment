/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
package org.eclipse.scava.crossflow.language.xtext.web

import com.google.inject.Guice
import com.google.inject.Injector
import org.eclipse.xtext.util.Modules2
import org.eclipse.scava.crossflow.language.xtext.CrossflowRuntimeModule
import org.eclipse.scava.crossflow.language.xtext.CrossflowStandaloneSetup
import org.eclipse.scava.crossflow.language.xtext.ide.CrossflowIdeModule
import org.eclipse.xtext.web.server.DefaultWebModule

/**
 * Initialization support for running Xtext languages in web applications.
 */
class CrossflowWebSetup extends CrossflowStandaloneSetup {
	
	override Injector createInjector() {
		return Guice.createInjector(Modules2.mixin(new CrossflowRuntimeModule, new CrossflowIdeModule, new CrossflowWebModule))
	}
	
}
 