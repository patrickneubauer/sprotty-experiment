/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
package org.eclipse.scava.crossflow.language.xtext


/**
 * Initialization support for running Xtext languages without Equinox extension registry.
 */
class CrossflowStandaloneSetup extends CrossflowStandaloneSetupGenerated {

	def static void doSetup() {
		new CrossflowStandaloneSetup().createInjectorAndDoEMFRegistration()
	}
}
