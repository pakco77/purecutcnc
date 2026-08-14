/**
 * Copyright 2026 Franja (Frank) Povazanj
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { newProject } from '../../types/project'
import { defaultOperationForTarget } from '../../store/helpers/operationDefaults'
import { deriveTaskShellFacts } from './taskShellModel'

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`Assertion failed: ${message}`)
}

{
  const project = newProject()
  const facts = deriveTaskShellFacts(project, new Set())

  const machineStep = facts.workflow.find((step) => step.id === 'machine')
  assert(machineStep?.complete === false, 'machine setup must not be inferred complete')
  assert(machineStep?.unavailable === true, 'machine setup must disclose missing live control')
  assert(facts.workflow.find((step) => step.id === 'carve')?.unavailable === true, 'carve must remain unavailable')
}

{
  const project = newProject()
  const enabled = defaultOperationForTarget(project, 'surface_clean', 'rough', { source: 'stock' }, 0)
  const disabled = { ...enabled, id: 'disabled', enabled: false }
  project.operations = [enabled, disabled]

  const pending = deriveTaskShellFacts(project, new Set())
  const ready = deriveTaskShellFacts(project, new Set([enabled.id]))

  assert(pending.workflow.find((step) => step.id === 'operations')?.complete === false, 'missing toolpath must remain pending')
  assert(ready.workflow.find((step) => step.id === 'operations')?.complete === true, 'all enabled toolpaths must complete operations')
}

console.log('taskShellModel tests: OK')
