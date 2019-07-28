function createStage() {
  ;`
    create (stage:Stage { key: '' })

    // add execute connection
    create (stage)-[execute:EXECUTE { key: '' }]->(stage)
    set stage:Process
  `
}
