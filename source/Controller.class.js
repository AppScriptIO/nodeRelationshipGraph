import EventEmitter from 'events'
import assert from 'assert'
import { mix } from 'mixwith'
import commonMethod from './commonMethod.mixin'
import createInstance from '@dependency/commonPattern/source/createInstance.staticMethod'
import { usingGenericInstance as populateInstancePropertyFromJson, usingThis as populateInstancePropertyFromJson_this } from '@dependency/populateObjectPropertyFromObject'
import addStaticSubclassToClassArray from '@dependency/commonPattern/source/addStaticSubclassToClassArray.staticMethod'
import { classDecorator as prototypeChainDebug} from '@dependency/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from '@dependency/commonPattern/source/decoratorUtility.js'
import { extendedSubclassPattern } from '@dependency/commonPattern/source/extendedSubclassPattern.js'
import { superclassInstanceContextPattern, cacheInstance } from '@dependency/commonPattern/source/superclassInstanceContextPattern.js'

/**
 * @class
 * @usage new instance is created for each check.
 */
export function ControllerFunction({
    methodInstanceName,
    Superclass = EventEmitter, // defaulting to EventEmitter and not Object / Function because extending Object/Function manipulates this prototype in new calls for some reason.
    mixin, 
    rethinkdbConnection = (!!Superclass) && Superclass.rethinkdbConnection
} = {}) {
    if(Superclass) Superclass.rethinkdbConnection = rethinkdbConnection // Setting this variable on Controller class below causes issues, which maybe related to the way rethinkdb is called or the proxies encapsulating the class.
    let mixinArray = [/*commonMethod*/]
    let self = 
        @add({ to: 'static'}, { 
            createInstance,
            populateInstancePropertyFromJson,
            addStaticSubclassToClassArray,
        })
        @add({ to: 'prototype'}, {
            populateInstancePropertyFromJson_this
        })
        @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })
        @extendedSubclassPattern.Superclass()
        @conditional({ decorator: extendedSubclassPattern.Subclass(), condition: (methodInstanceName && Superclass && Superclass.addSubclass != undefined ) })
        @conditional({ condition: mixin, decorator: applyMixin({ mixin }) })
        @superclassInstanceContextPattern() // applied on the mixin i.e. specific controller.
        class ReusableController extends mix(Superclass).with(...mixinArray) {

            @cacheInstance({
                cacheArrayName: 'nestedUnit',
                keyArgumentName: 'nestedUnitKey'
            })
            async getNestedUnit({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null}) {
                let instance = await this.callSubclass('NestedUnit', [nestedUnitKey])
                await instance.reflectDatabaseDataToAppObject()
                // add children trees: 
                instance.additionalChildNestedUnit = additionalChildNestedUnit
                // add pathPointerKey to allow applying additional corresponding additional children.
                instance.pathPointerKey = pathPointerKey
                return instance
            }

            @cacheInstance({ 
                cacheArrayName: 'unit',
                keyArgumentName: 'unitKey'
            })
            async getUnit({ unitKey }) {
                let instance = await this.callSubclass('Unit', [unitKey])
                await instance.reflectDatabaseDataToAppObject()
                return instance
            }
            
            /**
             * @description gets document from database using documentKey and populates the data to the instance.
             * during which 'jsonData' property is set. if it is set, it means that the instance is already populated with data.
             * 
             */
            async reflectDatabaseDataToAppObject({
                object = this, 
                key = this.key, 
                queryFunc = this.constructor.getDocumentQuery,
                connection = self.rethinkdbConnection
            } = {}) {
                assert.strictEqual(Object.getPrototypeOf(self.rethinkdbConnection).constructor.name, 'TcpConnection')
                if(!('jsonData' in object)) { // if not already populated with data.
                    let jsonData = await queryFunc({ key, connection })
                    assert(jsonData, `• "${key}" nestedUnit document must be present in the database, the requested key does not exist in database. The passed value is either undefined, null, or empty string.`)
                    await this.populateInstancePropertyFromJson_this({ jsonData })
                }
            }

        }

    return self
}
