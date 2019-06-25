export async function processDataItem({ dataItem, nodeInstance = this, executionType }) {
  switch (executionType) {
    default:
      return dataItem.key
      break
    case 'returnDataItemKey':
      let processedData = `${dataItem.key} processed`
      return processedData
      break
    // implementation delays promises for testing `iterateConnection` of promises e.g. `allPromise`, `raceFirstPromise`, etc.
    case 'timeout':
      let delay = dataItem.timerDelay || 0
      return await new Promise((resolve, reject) =>
        setTimeout(() => {
          // console.log(`${delay}ms passed for key ${dataItem.key}.`) // debug
          resolve(dataItem.key)
        }, delay),
      )
      break
  }
}

async function initializeDataItem({ dataItem, executionType = 'getDataItem' }) {
  let implementationObject = {
    async getResourceFile() {},
  }

  // specific execution implementation
  if (executionType) {
    let callback

    // pick implementation
    for (let index in implementationObject) {
      if (index == executionType) {
        callback = implementationObject[index]
        break
      }
    }

    // execute implementation
    return await callback.apply(this, arguments)
  }

  // default execution
  else return /// TODO:
}
