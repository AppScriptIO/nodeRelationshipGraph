import path from 'path'
import assert from 'assert'
import { exec, execSync, spawn, spawnSync } from 'child_process'
import { nodeLabel, connectionType, connectionProperty } from '../../../graphModel/graphSchemeReference.js'

export async function returnDataItemKey({ node }) {
  let processedData = `${node.properties?.name}`
  return processedData
}

// implementation delays promises for testing `iterateConnection` of promises e.g. `allPromise`, `raceFirstPromise`, etc.
export async function timeout({ node }) {
  if (typeof node.properties?.timerDelay != 'number') throw new Error('• DataItem must have a delay value.')
  let delay = node.properties?.timerDelay
  return await new Promise((resolve, reject) =>
    setTimeout(() => {
      // console.log(`${delay}ms passed for key ${node.key}.`) // debug
      resolve(node.properties?.name)
    }, delay),
  )
}

/**
 * `processData` implementation of `graphTraversal` module
 * Executes tasks through a string reference from the database that match the key of the application task context object (task.js exported object).
 */
export async function executeFunctionReference({ node, resource, graphInstance }) {
  let functionContext = graphInstance.context.functionContext
  assert(functionContext, `• Context "functionContext" variable is required to reference functions from graph database strings.`)

  if (resource) {
    assert(resource.destination.labels.includes(nodeLabel.function), `• Unsupported Node type for resource connection.`)
    let functionName = resource.destination.properties.functionName || throw new Error(`• function resource must have a "functionName" - ${resource.destination.properties.functionName}`)
    let functionCallback = functionContext[functionName] || throw new Error(`• reference function name doesn't exist.`)
    try {
      await functionCallback({ node, context: graphInstance.context })
    } catch (error) {
      console.error(error) && process.exit()
    }
  }
}

/*
                          _      _____         _     ____            _       _   
  _____  _____  ___ _   _| |_ __|_   _|_ _ ___| | __/ ___|  ___ _ __(_)_ __ | |_ 
 / _ \ \/ / _ \/ __| | | | __/ _ \| |/ _` / __| |/ /\___ \ / __| '__| | '_ \| __|
|  __/>  <  __/ (__| |_| | ||  __/| | (_| \__ \   <  ___) | (__| |  | | |_) | |_ 
\___/_/\_\___|\___|\__,_|\__\___||_|\__,_|___/_|\_\|____/ \___|_|  |_| .__/ \__|
                                                                     |_|        
*/
let message = ` _____                          _        
| ____|__  __ ___   ___  _   _ | |_  ___ 
|  _|  \\ \\/ // _ \\ / __|| | | || __|/ _ \\
| |___  >  <|  __/| (__ | |_| || |_|  __/    
|_____|/_/\\_\\\\___| \\___| \\__,_| \\__|\\___|`
const rootPath = path.normalize(path.join(__dirname, '../../../../'))

export async function executeScriptSpawn({ node, resource }) {
  let childProcess
  try {
    console.log(message)
    console.log(`\x1b[45m%s\x1b[0m`, `${node.command} ${node.argument.join(' ')}`)
    childProcess = spawnSync(node.command, node.argument, JSON.stringify(node.option))
    if (childProcess.status > 0) throw childProcess.error
  } catch (error) {
    process.exit(childProcess.status)
  }
  // await new Promise(resolve => setTimeout(resolve, 500)) // wait x seconds before next script execution // important to prevent 'unable to re-open stdin' error between shells.
}

export async function executeScriptSpawnIgnoreError({ node, resource }) {
  let childProcess
  try {
    console.log(message)
    console.log(`\x1b[45m%s\x1b[0m`, `${node.command} ${node.argument.join(' ')}`)
    childProcess = spawnSync(node.command, node.argument, JSON.stringify(node.option))
    if (childProcess.status > 0) throw childProcess.error
  } catch (error) {
    console.log(childProcess.status)
  }
  // await new Promise(resolve => setTimeout(resolve, 500)) // wait x seconds before next script execution // important to prevent 'unable to re-open stdin' error between shells.
}

export async function executeScriptSpawnAsynchronous({ node, resource }) {
  let childProcess
  try {
    console.log(message)
    console.log(`\x1b[45m%s\x1b[0m`, `${node.command} ${node.argument.join(' ')}`)
    childProcess = spawn(node.command, node.argument, JSON.stringify(node.option))
    if (childProcess.status > 0) throw childProcess.error
  } catch (error) {
    process.exit(childProcess.status)
  }
  // await new Promise(resolve => setTimeout(resolve, 500)) // wait x seconds before next script execution // important to prevent 'unable to re-open stdin' error between shells.
}

export async function executeShellscriptFile({ node, resource }) {
  try {
    console.log(message)
    console.log(`\x1b[45m%s\x1b[0m`, `shellscript path: ${resource.properties.path}`)
    let absolutePath = path.join('/', rootPath, resource.properties.path)
    execSync(`sh ${absolutePath}`, { cwd: path.dirname(absolutePath), shell: true, stdio: ['inherit', 'inherit', 'inherit'] })
  } catch (error) {
    throw error
    process.exit(1)
  }
  // await new Promise(resolve => setTimeout(resolve, 500)) // wait x seconds before next script execution // important to prevent 'unable to re-open stdin' error between shells.
  return null
}

/*
   __  __ _     _     _ _                             
  |  \/  (_) __| | __| | | _____      ____ _ _ __ ___ 
  | |\/| | |/ _` |/ _` | |/ _ \ \ /\ / / _` | '__/ _ \
  | |  | | | (_| | (_| | |  __/\ V  V / (_| | | |  __/
  |_|  |_|_|\__,_|\__,_|_|\___| \_/\_/ \__,_|_|  \___|
  Creates middleware array from graph-  The graph traversal @return {Array of Objects} where each object contains instruction settings to be used through an implementing module to add to a chain of middlewares.                                                   
*/

/*
 
   _____                    _       _       
  |_   _|__ _ __ ___  _ __ | | __ _| |_ ___ 
    | |/ _ \ '_ ` _ \| '_ \| |/ _` | __/ _ \
    | |  __/ | | | | | |_) | | (_| | ||  __/
    |_|\___|_| |_| |_| .__/|_|\__,_|\__\___|
                     |_|                    
 
*/

// let underscore = require('underscore')
/**
 *
 * @return {String} String of rendered HTML document content.
 */
async function initializeNestedUnit({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null }) {
  // views argument that will be initiallized inside templates:
  // loop through template and create rendered view content.
  let view = await nestedUnitInstance.loopInsertionPoint({ type: 'aggregateIntoTemplateObject' })

  assert(this.portAppInstance.config.clientSidePath, "• clientSidePath cannot be undefined. i.e. previous middlewares should've set it")
  let templatePath = path.join(this.portAppInstance.config.clientSidePath, unitInstance.file.filePath)
  let renderedContent
  switch (unitInstance.processDataImplementation) {
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
}

async function underscoreRendering({ templatePath, view }) {
  // Load template file.
  let templateString = await filesystem.readFileSync(templatePath, 'utf-8')
  // Shared arguments between all templates being rendered
  const templateArgument = {
    templateController: this,
    context: this.portAppInstance.context,
    Application,
    argument: {},
  }
  let renderedContent = underscore.template(templateString)(
    Object.assign(
      {},
      templateArgument, // use templateArgument in current template
      { view, templateArgument }, // pass templateArgument to nested templates
    ),
  )
  return renderedContent
}

function renderedContentString(viewName, viewObject) {
  // loop throught the strings array to combine them and print string code to the file.
  if (viewObject[viewName] && Array.isArray(viewObject[viewName])) {
    return viewObject[viewName].join('') // joins all array components into one string.
  }
}

let traversePort = async function aggregateIntoTemplateObject() {
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
}

/*
 
            _                          
   ___  ___| |__   ___ _ __ ___   __ _ 
  / __|/ __| '_ \ / _ \ '_ ` _ \ / _` |
  \__ \ (__| | | |  __/ | | | | | (_| |
  |___/\___|_| |_|\___|_| |_| |_|\__,_|
 API Schema
  (While the database models are separate in their own functions or could be exposed through a class module)

  - Resolver function = a function that returns data.
  - Data loader = module that aggregates duplicate calls. Solving the n+1 problem, where each query has a subsequent query, linear graph. To nodejs it uses nextTick function to analyse the promises before their execution and prevent multiple round trips to the server for the same data.
  - Mapping - through rosolver functions.
  - Schema = is the structure & relationships of the api data. i.e. defines how a client can fetch and update data.
      each schema has api entrypoints. Each field corresponds to a resolver function.
  Data fetching complexity and data structuring is handled by server side rather than client.

  3 types of possible api actions: 
  - Query
  - Mutation
  - Subscription - creates a steady connection with the server.

  Fetching approaches: 
  • Imperative fetching: 
      - constructs & sends HTTP request, e.g. using js fetch.
      - receive & parse server response.
      - store data locally, e.g. in memory or persistent. 
      - display UI.
  • Declarative fetching e.g. using GraphQL clients: 
      - Describe data requirements.
      - Display information in the UI.

  Request: 
  {
      action: query,
      entrypoint: {
          key: "Article"
      },
      function: {
          name: "single",
          args: {
              key: "article1"
          }
      },
      field: [
          {
              keyname: "title"
          },
          {
              keyname: "paragraph"
          },
          {
              keyname: "authors"
          },
      ]
  }

  Response :
  {
      data: {
          title: "...",
          paragraph: '...',
          author: {
              name: '...',
              age: 20
          }
      }
  }


  Nested Unit execution steps:  
• 
*/

let schema = () => {
  /**
   * Implementation type aggregateIntoContentArray
   */
  /* exmple request body: 
{
    "fieldName": "article",
    "field": [
        {
            "fieldName": "title",
            "field": []
        },
        {
            "fieldName": "paragraph",
            "field": []
        }
    ],
    "schemaMode": "nonStrict", // allow empty datasets for specified fields in the nested unit schema.
    "extrafield": true // includes fields that are not extracted using the schema.
} */
  const { add, execute, conditional, executionLevel } = require('@dependency/commonPattern/source/decoratorUtility.js')
  function schema({ thisArg }) {
    // function wrapper to set thisArg on implementaion object functions.

    let self = {
      @executionLevel()
      async initializeNestedUnit({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null, parent = this, argument = {} }) {
        // Entrypoint Instance
        // extract request data action arguments. arguments for a query/mutation/subscription.
        if (this.executionLevel == 'topLevel') {
          nestedUnitInstance.requestOption = this.portAppInstance.context.request.body
        } else {
          // child/nested
          let fieldArray = parent.requestOption.field // object array
          if ((fieldArray && fieldArray.length == 0) || !fieldArray) {
            nestedUnitInstance.requestOption = {} // continue to resolve dataset and all subsequent Nestedunits of nested dataset in case are objects.
          } else if (fieldArray) {
            nestedUnitInstance.requestOption = fieldArray.find(field => field.fieldName == unitInstance.fieldName) // where fieldNames match
          }
        }

        // check if fieldname exists in the request option, if not skip nested unit.
        if (!nestedUnitInstance.requestOption) return // fieldName was not specified in the parent nestedUnit, therefore skip its execution
        nestedUnitInstance.dataset = await unitInstance.resolveDataset({ parentResult: argument.dataset || parent.dataset })
        // TODO: Fix requestOption - i.e. above it is used to pass "field" option only.
        if (this.portAppInstance.context.request.body.schemaMode == 'nonStrict') {
          // Don't enforce strict schema, i.e. all nested children should exist.
          // if(nestedUnitInstance.dataset) nestedUnitInstance.dataset = null // TODO: throws error as next it is being used.
        } else {
          assert.notEqual(nestedUnitInstance.dataset, undefined, `• returned dataset cannot be undefined for fieldName: ${unitInstance.fieldName}.`)
        }

        // check type of dataset
        let datasetHandling
        if (Array.isArray(nestedUnitInstance.dataset) && nestedUnitInstance.children && nestedUnitInstance.children.length > 0) {
          // array
          datasetHandling = 'sequence'
        } else if (typeof nestedUnitInstance.dataset == 'object' && nestedUnitInstance.children && nestedUnitInstance.children.length > 0) {
          // object
          datasetHandling = 'nested'
        } else {
          // non-nested value
          datasetHandling = 'nonNested'
        }

        // handle array, object, or non-nested value
        let object = {} // formatted object with requested fields
        switch (datasetHandling) {
          case 'sequence':
            let promiseArray = nestedUnitInstance.dataset.map(document => {
              let argument = {}
              argument['dataset'] = document
              return nestedUnitInstance.loopInsertionPoint({ type: 'aggregateIntoContentArray', argument })
            })
            let subsequentDatasetArray = await Promise.all(promiseArray)
            object[unitInstance.fieldName] = subsequentDatasetArray.map((subsequentDataset, index) => {
              return this.formatDatasetOfNestedType({
                subsequentDataset,
                dataset: nestedUnitInstance.dataset[index],
                option: {
                  extrafield: nestedUnitInstance.requestOption.extrafield,
                },
              })
            })

            break
          case 'nested': // if field treated as an object with nested fields
            let subsequentDataset = await nestedUnitInstance.loopInsertionPoint({ type: 'aggregateIntoContentArray' })
            object[unitInstance.fieldName] = this.formatDatasetOfNestedType({
              subsequentDataset,
              dataset: nestedUnitInstance.dataset,
              option: {
                extrafield: nestedUnitInstance.requestOption.extrafield,
              },
            })

            break
          default:
          case 'nonNested':
            // looping over nested units can manipulate the data in a different way than regular aggregation into an array.
            object[unitInstance.fieldName] = nestedUnitInstance.dataset

            break
        }

        // deal with requested all fields without the field option where execution of subnestedunits is required to manipulate the data.

        return object
      },

      formatDatasetOfNestedType({ subsequentDataset, dataset, option }) {
        let object = {}
        subsequentDataset.forEach(field => {
          object = Object.assign(object, field)
        })
        if (option.extrafield) {
          // extrafield option
          object = Object.assign(dataset, object) // override subsequent fields and keep untracked fields.
        }
        return object
      },
    }

    Object.keys(self).forEach(function(key) {
      self[key] = self[key].bind(thisArg)
    }, {})
    return self
  }

  async function resolveDataset({
    parentResult = null,
    // this.args - nestedUnit args field.
  }) {
    // [2] require & check condition
    let dataset
    const algorithm = this.file.algorithm // resolver for dataset
    switch (
      algorithm.type // in order to choose how to handle the algorithm (as a module ? a file to be imported ?...)
    ) {
      case 'file':
      default:
        {
          let module = require(algorithm.path).default
          if (typeof module !== 'function') module = module.default // case es6 module loaded with require function (will load it as an object)
          let resolver = module() /*initial execute for setting parameter context.*/
          let resolverArgument = Object.assign(...[this.args, algorithm.argument].filter(Boolean)) // remove undefined/null/false objects before merging.
          dataset = await resolver({
            portClassInstance: this.portAppInstance, // contains also portClassInstance.context of the request.
            args: resolverArgument,
            parentResult, // parent dataset result.
          })
        }
        break
    }

    return dataset
  }
}
