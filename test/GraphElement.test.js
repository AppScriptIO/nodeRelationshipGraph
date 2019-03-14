process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'

import { GraphElementFunction} from '../source/script.js'
import { databaseModelAdapterFunction } from '../source/implementationPlugin/databaseModelAdapter/memoryModelAdapter.js'
import * as graphData from './asset/graphData' // load sample data

suite('Graph Element', () => {

    let GraphElement = GraphElementFunction()

    let graphElement = new GraphElement({
        data: {
            label: { name: 'node' }, 
            key: 'node-key-1',
            dataItem: {
                key: 'dataItem-key-1',
            },
            connection: [],
            tag: {
                traversalImplementationType: 'logNode', // traversal implementation
                executionType: 'returnDataItemKey'
            }
        },
    }, { constructor: 'data' })

    test('test', () => {
        console.log(graphElement)
    })

})

    