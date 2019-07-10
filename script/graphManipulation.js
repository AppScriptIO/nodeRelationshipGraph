#!/usr/bin/env node

// temporary file used to transfer data to graph structure:
const neo4jGraphDatabase = require('neo4j-driver').v1
let neo4jGraphDBDriver = neo4jGraphDatabase.driver('bolt://localhost', neo4jGraphDatabase.auth.basic('neo4j', 'test'))

;(async () => {
  let session = await neo4jGraphDBDriver.session()

  let nodeArray = [
    /**
     * Common functionality
     */
    {
      name: 'Common functions',
      key: '0c01c061-92d4-44ad-8cda-098352c107ea',
      unitKey: 'empty',
      insertionPoint: [{ key: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1, executionType: 'chronological' }],
      children: [
        // bodyparser
        {
          nestedUnit: '84sfad-f783-410e-a5c9-a21679a45beb',
          pathPointerKey: '9460ba3c-e9f4-415b-b7c3-96eef0c6382e',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 2 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
        // useragentDetection
        {
          nestedUnit: 'd908335b-b60a-4a00-8c33-b9bc4a9c64ec',
          pathPointerKey: '9460ba3c-e9f4-415b-b7c3-96eef0c6382e',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
        // common functionality
        {
          nestedUnit: '89feb0a1-51c8-4801-b945-ef38955dbf92',
          pathPointerKey: '9460ba3c-e9f4-415b-b7c3-96eef0c6382e',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 2 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
        // not Found
        {
          nestedUnit: 'dca2b793-f783-410e-a5c9-a21679a45beb',
          pathPointerKey: '9460ba3c-e9f4-415b-b7c3-96eef0c6382e',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 3 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
      ],
    },
    { name: 'bodyparser', key: '84sfad-f783-410e-a5c9-a21679a45beb', unitKey: '984safdasf-0ae9-4dd0-aae8-4796bbe0581f' },
    { name: 'useragentDetection', key: 'd908335b-b60a-4a00-8c33-b9bc4a9c64ec', unitKey: '3544ab32-f236-4e66-aacd-6fdf20df069b' },
    { name: 'commonFunctionality middlewares', key: '89feb0a1-51c8-4801-b945-ef38955dbf92', unitKey: '73873bfd-a667-4de3-900c-c06320e8dc67' },
    { name: 'notFound', key: 'dca2b793-f783-410e-a5c9-a21679a45beb', unitKey: '5e93b08c-557a-4d67-adc7-a06447f4ebad' },
    {
      name: 'Common functions + language content',
      key: 'x8q2-8cda-098352c107ea',
      unitKey: 'empty',
      insertionPoint: [{ key: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1, executionType: 'chronological' }],
      children: [
        // common functionality container
        {
          nestedUnit: '0c01c061-92d4-44ad-8cda-098352c107ea',
          pathPointerKey: '9460ba3c-e9f4-415b-b7c3-96eef0c6382e',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 2 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
        // languageContent
        {
          nestedUnit: '963ad5-ol23l-a5c9-a21679a45beb',
          pathPointerKey: '9460ba3c-e9f4-415b-b7c3-96eef0c6382e',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
      ],
    },
    { name: 'languageContent', key: '963ad5-ol23l-a5c9-a21679a45beb', unitKey: '8av2-4dd0-aae8-4796bbe0581f' },
    {
      name: 'set response headers + Common functions + language content + cache',
      key: 'q632g2-2bh5sdfag-098352c107ea',
      unitKey: 'empty',
      insertionPoint: [{ key: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1, executionType: 'chronological' }],
      children: [
        // set response headers
        {
          nestedUnit: '231weg-ol23l-a5c9-a21679a45beb',
          pathPointerKey: '9460ba3c-e9f4-415b-b7c3-96eef0c6382e',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
        // Common functions + language content
        {
          nestedUnit: 'x8q2-8cda-098352c107ea',
          pathPointerKey: '9460ba3c-e9f4-415b-b7c3-96eef0c6382e',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 2 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
        // cache control
        {
          nestedUnit: '1k2s6-9t5-a21679a45beb',
          pathPointerKey: '9460ba3c-e9f4-415b-b7c3-96eef0c6382e',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 3 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
      ],
    },
    { name: 'set response headers', key: '231weg-ol23l-a5c9-a21679a45beb', unitKey: '8f8f8f-3asa3-6d66-4796bbe0581f' },
    { name: 'set response headers for cache control', key: '1k2s6-9t5-a21679a45beb', unitKey: '5yuk3-sadf9-a17d741946c5' },

    /**
     * WebappUI Port:
     */

    {
      // ✔
      name: 'Service worker file wrapper',
      key: '9sadf6-630c-avs985-4b0d52706981',
      unitKey: 'empty',
      insertionPoint: [{ key: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1, executionType: 'chronological' }],
      children: [
        // common function + language content
        {
          nestedUnit: 'x8q2-8cda-098352c107ea',
          pathPointerKey: '9460ba3c-e9f4-415b-b7c3-96eef0c6382e',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
        // Service worker file
        {
          nestedUnit: '366b44e7-1c26-478c-86b7-70f9504f7586',
          pathPointerKey: '9460ba3c-e9f4-415b-b7c3-96eef0c6382e',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 2 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
      ],
    },
    { name: 'Service worker file', key: '366b44e7-1c26-478c-86b7-70f9504f7586', unitKey: '7a33a77a-4679-41e0-984a-8be96e56526d' },

    {
      // ✔
      name: 'Root template',
      key: '91140de5-9ab6-43cd-91fd-9eae5843c74c',
      unitKey: 'empty',
      insertionPoint: [{ key: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1, executionType: 'chronological' }],
      children: [
        // common function + language content
        {
          nestedUnit: 'x8q2-8cda-098352c107ea',
          pathPointerKey: '9460ba3c-e9f4-415b-b7c3-96eef0c6382e',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
        // renderTemplateDocument - fallback middleware, in case the file was not found.
        {
          nestedUnit: '93afadbe-3b35-42b5-9ce8-1a8d99667e93',
          pathPointerKey: 'renderPPKey',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
      ],
    },

    {
      // ✔
      name: 'Root folder & template',
      key: '12asd-9ab6-43cd-91fd-9eae5843c74c',
      unitKey: 'empty',
      insertionPoint: [{ key: 'IP', order: 1, executionType: 'chronological' }],
      children: [
        // Root template
        {
          nestedUnit: '91140de5-9ab6-43cd-91fd-9eae5843c74c',
          pathPointerKey: 'templatePPKey',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'IP', order: 1 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
        // Static root files
        {
          nestedUnit: '22w3-9ce8-1a8d99667e93',
          pathPointerKey: 'x',
          insertionPosition: {
            insertionPathPointer: 'templatePPKey',
            insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1',
            order: 1,
            placement: { type: 'before', pathPointer: 'renderPPKey' },
          },
        },
      ],
    },

    { name: 'renderTemplateDocument - main root template', key: '93afadbe-3b35-42b5-9ce8-1a8d99667e93', unitKey: '122c9a40-5872-4219-ad4e-ad1c237deacd' },
    { name: 'static template files', key: '22w3-9ce8-1a8d99667e93', unitKey: '20c4b7dd-66de-4b89-9188-f1601f9fc217' },

    /**
     * CDN Port:
     */
    {
      // ✔
      name: 'Upload folder & common functions',
      key: '9w9f-9ab6-43cd-91fd-9eae5843c74c',
      unitKey: 'empty',
      insertionPoint: [{ key: 'IP', order: 1, executionType: 'chronological' }],
      children: [
        // set response headers + Common functions + language content + cache
        {
          nestedUnit: 'q632g2-2bh5sdfag-098352c107ea',
          pathPointerKey: 'templatePPKey',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'IP', order: 1 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
        // Static upload files
        {
          nestedUnit: '81cc5f3a-ff61-454f-b6bb-49713c841c29',
          pathPointerKey: 'x',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'IP', order: 1, placement: { type: null, pathPointer: null } },
        },
      ],
    },
    { name: 'Static upload files', key: '81cc5f3a-ff61-454f-b6bb-49713c841c29', unitKey: '8w7g2-0ae9-4dd0-aae8-4796bbe0581f' },
    {
      // ✔
      name: 'Asset folder & common functions',
      key: 'a8sdf52-43cd-91fd-9eae5843c74c',
      unitKey: 'empty',
      insertionPoint: [{ key: 'IP', order: 1, executionType: 'chronological' }],
      children: [
        // set response headers + Common functions + language content + cache
        {
          nestedUnit: 'q632g2-2bh5sdfag-098352c107ea',
          pathPointerKey: 'templatePPKey',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'IP', order: 1 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
        // Static Asset files
        {
          nestedUnit: 'da18242e-792e-4e44-a12b-b280f6331b7c',
          pathPointerKey: 'x',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'IP', order: 1, placement: { type: null, pathPointer: null } },
        },
      ],
    },
    { name: 'Static assets', key: 'da18242e-792e-4e44-a12b-b280f6331b7c', unitKey: 'c2539d29-d217-41c9-a984-a17d741946c5' },
    {
      // ✔
      name: 'Asset folder redered & common functions',
      key: '2yvc-91fd-9eae5843c74c',
      unitKey: 'empty',
      insertionPoint: [{ key: 'IP', order: 1, executionType: 'chronological' }],
      children: [
        // set response headers + Common functions + language content + cache
        {
          nestedUnit: 'q632g2-2bh5sdfag-098352c107ea',
          pathPointerKey: 'templatePPKey',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'IP', order: 1 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
        // rendered Asset files
        {
          nestedUnit: '2a18242e-792e-4e44-a12b-b280f6331b71',
          pathPointerKey: 'x',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'IP', order: 1, placement: { type: null, pathPointer: null } },
        },
      ],
    },
    { name: 'assets render javascript', key: '2a18242e-792e-4e44-a12b-b280f6331b71', unitKey: 'qwv35-41c9-a984-a17d741946c5' },

    {
      name: 'serve files/directories with @ prefix',
      key: '8sdfa8df-1c26-478c-86b7-70f9504f7586',
      unitKey: 'empty',
      insertionPoint: [{ key: 'IP', order: 1, executionType: 'chronological' }],
      children: [
        // set response headers + Common functions + language content + cache
        {
          nestedUnit: 'q632g2-2bh5sdfag-098352c107ea',
          pathPointerKey: 'templatePPKey',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'IP', order: 1 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
        // middleware for mapping '@' directory path and applying new path to request object (for next middlewares to use)
        {
          nestedUnit: '22hh-4e44-a12b-b280f6331b71',
          pathPointerKey: 'x',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'IP', order: 2 /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ },
        },
        // rendered Asset files
        {
          nestedUnit: '2a18242e-792e-4e44-a12b-b280f6331b71',
          pathPointerKey: 'x',
          insertionPosition: { insertionPathPointer: null, insertionPoint: 'IP', order: 1, placement: { type: null, pathPointer: null } },
        },
        // Babel transform javascript - among the transformation - named modules paths
        { nestedUnit: 'oo2d-a12b-b280f6331b71', pathPointerKey: 'x', insertionPosition: { insertionPathPointer: null, insertionPoint: 'IP', order: 1, placement: { type: null, pathPointer: null } } },
      ],
    },
    { name: '@ directory folder map', key: '22hh-4e44-a12b-b280f6331b71', unitKey: 'xyz12-a984-a17d741946c5' },
    { name: 'Babel transform javascript - named modules paths', key: 'oo2d-a12b-b280f6331b71', unitKey: '1882-q2f-a17d741946c5' },
  ]

  for (let node of nodeArray) {
    if (node.children) {
      let children = node.children.filter(child => Boolean(child.insertionPosition.insertionPathPointer))
      for (let connection of children) {
        console.log(connection)
        // let result = await session.run(`
        //     // MATCH (snext:Stage { key: '${connection.nestedUnit}'})
        //     // MATCH (s:Stage {key:'${node.key}'})-[:HAS_PORT]->(p:Port { key: '${connection.insertionPosition.insertionPoint}'})
        //     // CREATE (p)-[l:NEXT { order: ${connection.insertionPosition.order} }]->(snext)
        //     // RETURN l
        //   `)
        // for (let record of result.records) {
        //   let createdNode = record.toObject()
        //   console.log(createdNode)
        // }
      }
    }
  }

  session.close()
  neo4jGraphDBDriver.close()
})()

async function createPort() {
  if (node.insertionPoint)
    for (let port of node.insertionPoint) {
      let result = await session.run(`
    MATCH (stage:Stage { key: '${node.key}' })
    CREATE (port:Port { key: '${port.key}', traverseNodeImplementation: '${port.executionType}' }), 
    (stage)-[:HAS_PORT { order: ${port.order}}]->(port)
    RETURN stage
  `)
    }
}
