export function databaseModelAdapterFunction({ nodeArray, dataItemArray } = {}) {
  let a = {
    getByKey: key => {
      return a.getNodeDocumentQuery(key)
    },
    getAll: () => {
      return nodeArray
    },
    getNodeDocumentQuery: async function({ key }) {
      let node = nodeArray.filter(value => value.key == key)[0]
      if (!node) throw new Error(`• node key "${key}" not found in array.`)
      return node
    },
    getDataItemDocumentQuery: async function({ key }) {
      let dataItem = dataItemArray.filter(value => {
        return value.key == key
      })[0]
      if (!dataItem) throw new Error(`• dataItem key "${key}" not found in array.`)
      return dataItem
    },
  }
  return a
}
