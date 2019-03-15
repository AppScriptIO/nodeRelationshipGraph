import assert from 'assert'
import { classDecorator as prototypeChainDebug} from '@dependency/prototypeChainDebug'
import { add, execute, conditional, executeOnceForEachInstance } from '@dependency/commonPattern/source/decoratorUtility.js'
import { extendedSubclassPattern } from '@dependency/commonPattern/source/extendedSubclassPattern.js'

export function DataItemFunction({ Superclass, getDocumentQuery } = {}) {
    let self =
    @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })
    @execute({ staticMethod: 'initializeStaticClass', args: [] })
    @extendedSubclassPattern.Subclass() // in case specificNestedUnit subclass isn't registered, this class will be used as Controller subclass when called. 
    class DataItem extends Superclass {

        static getDocumentQuery;

        static initializeStaticClass(self) {
            self.getDocumentQuery = getDocumentQuery
        }

        constructor(databaseDocumentKey) {
            super() 
            this.key = databaseDocumentKey
            return this
        }

        async initializeDataItem() {
            // let initializationImplementationType = dataItem.tag.initializationImplementationType
            console.log('• DataItem class, initializeDataItem function')
        }

        @executeOnceForEachInstance()
        async pupolateUnitWithFile({
            fileKey,
            getDocument, // function
            extract = null // object with two properties - extract: { sourceKey: 'key from source object', destinationKey: 'key to "this" destination' }
         }) {
            assert.strictEqual(Object.getPrototypeOf(self.rethinkdbConnection).constructor.name, 'TcpConnection')
            let file = await getDocument({ key: fileKey, connection: self.rethinkdbConnection })
            if(extract) this[extract.destinationKey] = (extract.sourceKey) ? file[extract.sourceKey] : file;
        }

        // TODO: Add function for loading file using the file object settings, i.e. load filepath as es6 module or as regular module with default export.
    }
    
    return self
}
