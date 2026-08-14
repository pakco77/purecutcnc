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

import { test, expect } from './fixtures'
import { seedGcodeExportProject } from './gcodeExport.helpers'

test.describe('Genmitsu task shell', () => {
  test('keeps the approved task order and reuses one closable drawer', async ({ app }) => {
    const functions = app.page.locator('.task-function')
    await expect(functions).toHaveText([
      'Workpiece',
      'Workflow',
      'Import',
      'Stock',
      'Geometry',
      'Operations',
      'Fixtures',
      'Tabs',
      'Origin',
    ])
    await expect(app.page.locator('.task-drawer')).toHaveCount(1)
    await expect(app.page.locator('.task-drawer h2')).toHaveText('Workflow')

    const stockTask = functions.filter({ hasText: 'Stock' })
    await stockTask.click()
    await expect(app.page.locator('.task-drawer')).toHaveCount(1)
    await expect(app.page.locator('.task-drawer h2')).toHaveText('Stock')

    await stockTask.click()
    await expect(app.page.locator('.task-drawer')).toHaveCount(0)
  })

  test('switching to Simulation leaves Workflow and the Inspector mounted', async ({ app }) => {
    await expect(app.page.locator('.task-drawer h2')).toHaveText('Workflow')
    await app.page.getByRole('tab', { name: 'Simulation' }).click()

    await expect(app.page.locator('.task-drawer h2')).toHaveText('Workflow')
    await expect(app.page.locator('.workflow-progress')).toBeVisible()
    await expect(app.page.locator('.task-inspector')).toBeVisible()
    await expect(app.page.getByText('Accept result', { exact: true })).toHaveCount(0)
    await expect(app.page.getByText('Needs changes', { exact: true })).toHaveCount(0)
  })

  test('machine state uses the task drawer without claiming a live connection', async ({ app }) => {
    await app.page.locator('.task-machine-state').click()

    await expect(app.page.locator('.task-drawer')).toHaveCount(1)
    await expect(app.page.locator('.task-drawer h2')).toHaveText('Machine setup')
    await expect(app.page.getByText('Configuration only — no live machine evidence')).toBeVisible()
    await expect(app.page.locator('.machine-setup-list li')).toHaveCount(5)
    await expect(app.page.locator('.task-carve-button')).toBeDisabled()
    await expect(app.page.locator('.task-run-state')).toBeDisabled()
  })

  test('generates enabled operation toolpaths offline from the pinned top action', async ({ app }) => {
    await seedGcodeExportProject(app.page)

    const generate = app.page.locator('.task-generate-button')
    await expect(generate).toBeEnabled()
    await generate.click()
    await app.page.locator('.task-function').filter({ hasText: 'Workflow' }).click()

    const operationsStep = app.page.locator('.workflow-step').filter({ hasText: 'Operations' })
    await expect(operationsStep).toContainText('Complete')
    await expect(app.page.locator('.task-machine-state')).toContainText('Offline')
  })
})
