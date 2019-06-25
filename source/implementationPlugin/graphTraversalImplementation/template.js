import _ from 'underscore'

export const shellscript = {
  /**
   *
   * @return {String} String of rendered HTML document content.
   */
  async initializeNestedUnit({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null }) {
    // Entrypoint Instance
    // views argument that will be initiallized inside templates:
    // loop through template and create rendered view content.
    let view = await nestedUnitInstance.loopInsertionPoint({ type: 'aggregateIntoTemplateObject' })

    assert(this.portAppInstance.config.clientSidePath, "• clientSidePath cannot be undefined. i.e. previous middlewares should've set it")
    let templatePath = path.join(this.portAppInstance.config.clientSidePath, unitInstance.file.filePath)
    let renderedContent
    switch (unitInstance.executionType) {
      default:
      case 'underscoreRendering':
        renderedContent = await this.underscoreRendering({ templatePath, view })
        break
    }

    switch (unitInstance.processRenderedContent) {
      case 'wrapJsTag':
        renderedContent = `<script type="module" async>${renderedContent}</script>`
        break
      default: // skip
    }

    return renderedContent
  },

  async underscoreRendering({ templatePath, view }) {
    // Load template file.
    let templateString = await filesystem.readFileSync(templatePath, 'utf-8')
    // Shared arguments between all templates being rendered
    const templateArgument = {
      templateController: this,
      context: this.portAppInstance.context,
      Application,
      argument: {},
    }
    let renderedContent = _.template(templateString)(
      Object.assign(
        {},
        templateArgument, // use templateArgument in current template
        { view, templateArgument }, // pass templateArgument to nested templates
      ),
    )
    return renderedContent
  },

  renderedContentString(viewName, viewObject) {
    // loop throught the strings array to combine them and print string code to the file.
    if (viewObject[viewName] && Array.isArray(viewObject[viewName])) {
      return viewObject[viewName].join('') // joins all array components into one string.
    }
  },

  traversePort: async function aggregateIntoTemplateObject() {
    let view = {}
    if (this.insertionPoint) {
      for (let insertionPoint of this.insertionPoint) {
        let children = await this.filterAndOrderChildren({ insertionPointKey: insertionPoint.key })
        let subsequent = await this.initializeInsertionPoint({ insertionPoint, children })
        if (!(insertionPoint.name in view)) view[insertionPoint.name] = []
        Array.prototype.push.apply(view[insertionPoint.name], subsequent)
      }
    }
    return view
  },
}

import { curried as getTableDocumentCurried } from '@dependency/databaseUtility/source/query/getTableDocument.query.js'

// getDocument['Unit']
let getDocument = {
  Unit: getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `template_unit` }),
  File: getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `template_file` }),
}

async pupolateUnitWithFile() { 
    await super.pupolateUnitWithFile({
        getDocument: getDocument['File'],
        fileKey: this.fileKey,
        extract: { destinationKey: 'file' }
    })
}
