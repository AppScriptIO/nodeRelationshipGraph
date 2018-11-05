export function databaseModelAdapterFunction({ nodeArray }) {
    return {
        getNodeDocumentQuery: async function({ key }) {
            let node = nodeArray.filter(value => {
                return (value.key == key)
            })[0]
            if(!node) throw new Error(`• node key "${key}" not found in strage.`)
            return node
        }
    }
}
