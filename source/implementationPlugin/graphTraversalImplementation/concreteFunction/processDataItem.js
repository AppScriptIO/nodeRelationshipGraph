export async function returnDataItemKey({ dataItem, nodeInstance = this }) {
  let processedData = `${dataItem.key} processed`
  return processedData
}

// implementation delays promises for testing `iterateConnection` of promises e.g. `allPromise`, `raceFirstPromise`, etc.
export async function timeout({ dataItem, nodeInstance = this }) {
  let delay = dataItem.timerDelay || 0
  return await new Promise((resolve, reject) =>
    setTimeout(() => {
      // console.log(`${delay}ms passed for key ${dataItem.key}.`) // debug
      resolve(dataItem.key)
    }, delay),
  )
}

export async function returnKey({ dataItem, nodeInstance = this }) {
  return dataItem.key
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
