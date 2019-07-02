export async function returnDataItemKey({ dataItem, nodeInstance = this }) {
  let processedData = `${dataItem.name} processed`
  return processedData
}

// implementation delays promises for testing `iterateConnection` of promises e.g. `allPromise`, `raceFirstPromise`, etc.
export async function timeout({ dataItem, nodeInstance = this }) {
  let delay = dataItem.timerDelay || 0
  return await new Promise((resolve, reject) =>
    setTimeout(() => {
      // console.log(`${delay}ms passed for key ${dataItem.key}.`) // debug
      resolve(dataItem.name)
    }, delay),
  )
}

export async function returnKey({ dataItem, nodeInstance = this }) {
  return dataItem.key
}

async function initializeDataItem({ dataItem, processData = 'getDataItem' }) {
  let implementationObject = {
    async getResourceFile() {},
  }

  // specific execution implementation
  if (processData) {
    let callback

    // pick implementation
    for (let index in implementationObject) {
      if (index == processData) {
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
