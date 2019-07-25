"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.entityPrototype = exports.Prototype = exports.Reference = exports.Graph = void 0;var _skipFirstGeneratorNext2 = _interopRequireDefault(require("@babel/runtime/helpers/skipFirstGeneratorNext"));var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));var _assert = _interopRequireDefault(require("assert"));
var _entity = require("@dependency/entity");


var _GraphTraversalClass = require("./GraphTraversal.class.js");
var _DatabaseClass = require("./Database.class.js");

var _ContextClass = require("./Context.class.js");
var _ImplementationManagementClass = require("./ImplementationManagement.class.js");
var _proxifyMethodDecorator = require("../utility/proxifyMethodDecorator.js");
var _mergeDefaultParameter = require("../utility/mergeDefaultParameter.js");
var _events = _interopRequireDefault(require("events"));
var _EvaluatorClass = require("./Evaluator.class.js");

var _removeUndefinedFromObject = require("../utility/removeUndefinedFromObject.js");
var _graphSchemeReference = require("../graphSchemeReference.js");var _dec, _dec2, _dec3, _obj;const Evaluator = (0, _EvaluatorClass.EvaluatorFunction)();









const { class: Graph, reference: Reference, constructablePrototype: Prototype, entityPrototype } = new _entity.Entity.clientInterface({ description: 'Graph' });exports.entityPrototype = entityPrototype;exports.Prototype = Prototype;exports.Reference = Reference;exports.Graph = Graph;

Object.assign(Reference, {
  key: {
    constructor: Symbol('Graph:key.constructor') } });











Object.assign(entityPrototype, (_dec =






















































































(0, _proxifyMethodDecorator.proxifyMethodDecorator)(async (target, thisArg, argumentsList, targetClass, methodName) => {

  let { nodeInstance, nodeKey, nodeID, graphInstance = thisArg } = argumentsList[0];
  let nodeData;
  if (nodeInstance) {
    nodeData = nodeInstance;
  } else if (nodeKey) {
    nodeData = await graphInstance.database.getNodeByKey({ key: nodeKey });
  } else if (nodeID) {
    nodeData = await graphInstance.database.getNodeByID({ id: nodeID });
  } else {
    throw new Error('• node identifier or object must be passed in.');
  }


  if (nodeData.labels.includes(_graphSchemeReference.nodeLabel.subgraphTemplate)) {
    let parameter = await graphInstance.laodSubgraphTemplateParameter({ node: nodeData });

    ['nodeInstance', 'nodeKey', 'nodeID'].forEach(property => delete argumentsList[0][property]);
    argumentsList[0].implementationKey = argumentsList[0].implementationKey ? Object.assign(parameter.traversalConfiguration, argumentsList[0].implementationKey) : parameter.traversalConfiguration;
    argumentsList[0].additionalChildNode = argumentsList[0].additionalChildNode ? [...argumentsList[0].additionalChildNode, ...parameter.additionalChildNode] : parameter.additionalChildNode;
    Object.assign(argumentsList[0], { nodeInstance: parameter.rootNode });
  } else {
    argumentsList[0].nodeInstance = nodeData;
  }
  return Reflect.apply(target, thisArg, argumentsList);
}), _dec2 =
(0, _proxifyMethodDecorator.proxifyMethodDecorator)((target, thisArg, argumentsList, targetClass, methodName) => {

  argumentsList = (0, _mergeDefaultParameter.mergeDefaultParameter)({
    passedArg: argumentsList,
    defaultArg: [
    {
      traversalDepth: 0,
      path: null,
      graphInstance: thisArg,
      additionalChildNode: [],
      nodeType: 'Stage' },

    { parentTraversalArg: null }] });


  return Reflect.apply(target, thisArg, argumentsList);
}), _dec3 =






(0, _proxifyMethodDecorator.proxifyMethodDecorator)((target, thisArg, argumentsList, targetClass, methodName) => {var _processData$handlePr, _graphInstance$Contex, _implementationKey, _parameterImplementat, _contextImplementatio;







  let { nodeInstance, implementationKey: parameterImplementationKey = {}, graphInstance } = argumentsList[0],
  { parentTraversalArg } = argumentsList[1];



  let implementationKey = (_processData$handlePr =
  {
    processData: 'returnDataItemKey',
    handlePropagation: 'chronological',
    traverseNode: 'iterateFork',
    aggregator: 'AggregatorArray',
    traversalInterception: 'processThenTraverse' || 'traverseThenProcess',
    evaluatePosition: 'evaluateCondition' }, (0,
  _removeUndefinedFromObject.removeUndefinedFromObject)(_processData$handlePr));


  let contextImplementationKey = graphInstance[_ContextClass.Context.reference.key.getter] ? (_graphInstance$Contex = graphInstance[_ContextClass.Context.reference.key.getter]()) === null || _graphInstance$Contex === void 0 ? void 0 : _graphInstance$Contex.implementationKey : {};

  let parentImplementationKey = parentTraversalArg ? parentTraversalArg[0].implementationKey || {} : {};

  _implementationKey = implementationKey,

  Object.assign(_implementationKey, parentImplementationKey, implementationKey, (_parameterImplementat = parameterImplementationKey, (0, _removeUndefinedFromObject.removeUndefinedFromObject)(_parameterImplementat)), (_contextImplementatio = contextImplementationKey, (0, _removeUndefinedFromObject.removeUndefinedFromObject)(_contextImplementatio)));
  argumentsList[0].implementationKey = implementationKey;


  let implementation = {
    dataProcess: graphInstance.traversal.processData[implementationKey.processData],
    handlePropagation: graphInstance.traversal.handlePropagation[implementationKey.handlePropagation],
    traverseNode: graphInstance.traversal.traverseNode[implementationKey.traverseNode],
    traversalInterception: graphInstance.traversal.traversalInterception[implementationKey.traversalInterception] || (({ targetFunction }) => new Proxy(targetFunction, {})),
    aggregator: graphInstance.traversal.aggregator[implementationKey.aggregator],
    evaluatePosition: graphInstance.traversal.evaluatePosition[implementationKey.evaluatePosition] };

  (0, _assert.default)(
  Object.entries(implementation).every(([key, value]) => Boolean(value)),
  '• All `implementation` concerete functions must be registered, the implementationKey provided doesn`t match any of the registered implementaions.');


  argumentsList = (0, _mergeDefaultParameter.mergeDefaultParameter)({
    passedArg: argumentsList,
    defaultArg: [
    {
      implementation }] });




  return Reflect.apply(target, thisArg, argumentsList);
}), (_obj = { async load({ graphData, graphInstance = this } = {}) {(0, _assert.default)(graphData.node && graphData.edge, `• Graph data object must contain node & edge arrays.`);return await graphInstance.database.loadGraphData({ nodeEntryData: graphData.node, connectionEntryData: graphData.edge });}, async print({ graphInstance = this } = {}) {console.log(`______ Graph elements: ____________________`);let count = await graphInstance.count();let allNode = await graphInstance.database.getAllNode();let allEdge = await graphInstance.database.getAllEdge();console.log(`#Vertex = ${count.node}`);for (let node of allNode) {console.log(node.identity);}console.log(`\n#Edge = ${count.connection}`);for (let edge of allEdge) {console.log(`${edge.start} --> ${edge.end}`);}console.log(`___________________________________________`);}, async count({ graphInstance = this } = {}) {return { node: await graphInstance.database.countNode(), connection: await graphInstance.database.countEdge() };}, async laodSubgraphTemplateParameter({ node, graphInstance = this }) {let rootRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: node.identity, connectionType: _graphSchemeReference.connectionType.root });(0, _assert.default)(rootRelationshipArray.every(n => n.destination.labels.includes(_graphSchemeReference.nodeLabel.stage)), `• Unsupported node type for a ROOT connection.`);let extendRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: node.identity, connectionType: _graphSchemeReference.connectionType.extend });(0, _assert.default)(extendRelationshipArray.every(n => n.destination.labels.includes(_graphSchemeReference.nodeLabel.subgraphTemplate)), `• Unsupported node type for a EXTEND connection.`);let configureRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'incoming', nodeID: node.identity, connectionType: _graphSchemeReference.connectionType.configure });(0, _assert.default)(configureRelationshipArray.every(n => n.destination.labels.includes(_graphSchemeReference.nodeLabel.configuration)), `• Unsupported node type for a EXTEND connection.`);let rootNode,traversalConfiguration = {},additionalChildNode = [];if (configureRelationshipArray.length > 0) {function extractTraversalConfigProperty(propertyObject) {return Object.entries(propertyObject).reduce((accumulator, [key, value]) => {if (_GraphTraversalClass.traversalOption.includes(key)) accumulator[key] = value;return accumulator;}, {});}let configureNode = configureRelationshipArray[0].destination;traversalConfiguration = extractTraversalConfigProperty(configureNode.properties);}let insertRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'incoming', nodeID: node.identity, connectionType: _graphSchemeReference.connectionType.insert });insertRelationshipArray.sort((former, latter) => former.connection.properties.order - latter.connection.properties.order);for (let insertRelationship of insertRelationshipArray) {let insertNode = insertRelationship.destination;(0, _assert.default)(insertNode.labels.includes(_graphSchemeReference.nodeLabel.stage), `• "${insertNode.labels}" Unsupported node type for a ROOT connection.`);additionalChildNode.push({ node: insertNode, placement: { position: insertRelationship.connection.properties.placement[0], connectionKey: insertRelationship.connection.properties.placement[1] } });}if (rootRelationshipArray.length > 0) {rootNode = rootRelationshipArray[0].destination;} else {let extendNode = extendRelationshipArray[0].destination;let recursiveCallResult = await graphInstance.laodSubgraphTemplateParameter.call(graphInstance, { node: extendNode, graphInstance });additionalChildNode = [...recursiveCallResult.additionalChildNode, ...additionalChildNode];traversalConfiguration = Object.assign(recursiveCallResult.traversalConfiguration, traversalConfiguration);rootNode = recursiveCallResult.rootNode;}return { rootNode, additionalChildNode, traversalConfiguration };},
  async traverse(
  {
    graphInstance,
    nodeInstance,
    traversalIteratorFeed,
    traversalDepth,
    path,
    concreteTraversal,
    implementationKey,
    implementation,
    additionalChildNode,
    eventEmitter = new _events.default(),
    aggregator = new (implementation.aggregator.bind(nodeInstance))(),
    nodeType,
    evaluation } =


















  {},
  { parentTraversalArg } = {})
  {var _ref;
    evaluation || (evaluation = await graphInstance.evaluatePosition({ evaluation, node: nodeInstance, implementation: implementation.evaluatePosition.bind(nodeInstance) }));


    traversalIteratorFeed || (traversalIteratorFeed = graphInstance.traverseNode.call(graphInstance, {
      node: nodeInstance,
      implementation: implementation.traverseNode,
      handlePropagationImplementation: implementation.handlePropagation,
      additionalChildNode }));


    let dataProcessCallback = (nextProcessData) =>
    graphInstance.dataProcess.call(graphInstance, { node: nodeInstance, nextProcessData, evaluation, aggregator, implementation: implementation.dataProcess, graphInstance });

    let proxyify = target => implementation.traversalInterception.call(graphInstance, { targetFunction: target, aggregator, dataProcessCallback });
    let result = await (_ref = graphInstance.recursiveIteration.bind(graphInstance), proxyify(_ref))({
      traversalIteratorFeed,
      nodeInstance,
      traversalDepth,
      eventEmitter,
      evaluation,
      additionalChildNode,
      parentTraversalArg: arguments });


    return result;
  },






  evaluatePosition: async function ({ evaluation, node, implementation, graphInstance = this }) {

    evaluation = new Evaluator({ propagation: _EvaluatorClass.evaluationOption.propagation.continue, aggregation: _EvaluatorClass.evaluationOption.aggregation.include });

    await implementation({ evaluation, node, graphInstance });
    return evaluation;
  },





  traverseNode: async function* ({ node, additionalChildNode, implementation, handlePropagationImplementation, graphInstance = this }) {
    let traversalIteratorFeed = await implementation.call(node, { node, additionalChildNode, graphInstance });
    async function* trapAsyncIterator(iterator) {
      for await (let traversalIteration of iterator) {
        let _handlePropagationImplementation;
        if (traversalIteration.traversalConfig.handlePropagationImplementation) {
          _handlePropagationImplementation = graphInstance.traversal.handlePropagation[traversalIteration.traversalConfig.handlePropagationImplementation];
          (0, _assert.default)(_handlePropagationImplementation, `• "${traversalIteration.traversalConfig.handlePropagationImplementation}" implementation isn't registered in traversal concrete instance.`);
        } else _handlePropagationImplementation = handlePropagationImplementation;
        let nextIterator = graphInstance.handlePropagation.call(graphInstance, { nodeIteratorFeed: traversalIteration.nextIterator, implementation: _handlePropagationImplementation.bind(node) });
        yield { nextIterator, forkNode: traversalIteration.forkNode };
      }
    }
    yield* trapAsyncIterator(traversalIteratorFeed);
  },






  handlePropagation: (function () {let _ref2 = async function* ({ nodeIteratorFeed, implementation, graphInstance = this }) {let _functionSent = yield;
      let { eventEmitterCallback: emit } = _functionSent;
      let traversalIteratorFeed = implementation({ nodeIteratorFeed, emit });let _original_trapAsyncIterator = async function*
      trapAsyncIterator(iterator) {let _functionSent2 = yield;
        let iteratorResult = await iterator.next();
        while (!iteratorResult.done) {
          let traversalConfig = iteratorResult.value;
          _functionSent2 = yield traversalConfig;
          let { promise } = _functionSent2;
          iteratorResult = await iterator.next({ promise });
        }
        return iteratorResult.value;
      },_modified_trapAsyncIterator = (0, _skipFirstGeneratorNext2.default)(_original_trapAsyncIterator);let trapAsyncIterator;trapAsyncIterator = new Proxy(_original_trapAsyncIterator, { apply(target, thisArgument, argumentsList) {return Reflect.apply(_modified_trapAsyncIterator, thisArgument, argumentsList);} });
      return _functionSent = yield* trapAsyncIterator(traversalIteratorFeed);
    },_ref3 = (0, _skipFirstGeneratorNext2.default)(_ref2);return new Proxy(_ref2, { apply(target, thisArgument, argumentsList) {return Reflect.apply(_ref3, thisArgument, argumentsList);} });})(),






  recursiveIteration: async function* ({
    traversalIteratorFeed,
    graphInstance = this,
    recursiveCallback = graphInstance.traverse.bind(graphInstance),
    traversalDepth,
    eventEmitter,
    evaluation,
    additionalChildNode,
    parentTraversalArg })


  {
    if (!evaluation.shouldContinue()) return;
    let eventEmitterCallback = (...args) => eventEmitter.emit('nodeTraversalCompleted', ...args);
    traversalDepth += 1;
    for await (let traversalIteration of traversalIteratorFeed) {
      let n = { iterator: traversalIteration.nextIterator, result: await traversalIteration.nextIterator.next({ eventEmitterCallback: eventEmitterCallback }) };
      while (!n.result.done) {
        let nextNode = n.result.value.node;

        let nextCallArgument = [Object.assign({ nodeInstance: nextNode, traversalDepth, additionalChildNode }), { parentTraversalArg }];
        let promise = recursiveCallback(...nextCallArgument);
        n.result = await n.iterator.next({ promise });
      }

      let portTraversalResult = { config: { name: traversalIteration.forkNode.properties.name }, result: n.result.value };
      yield portTraversalResult;
    }
  },

  dataProcess: async function ({ node, nextProcessData, aggregator, evaluation, implementation, graphInstance }) {
    if (!evaluation.shouldExecuteProcess()) return null;
    let executeConnectionArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: node.identity, connectionType: _graphSchemeReference.connectionType.execute });
    (0, _assert.default)(executeConnectionArray.every(n => n.destination.labels.includes(_graphSchemeReference.nodeLabel.process)), `• Unsupported node type for a EXECUTE connection.`);
    let resourceConnectionArray = await graphInstance.database.getNodeConnection({ direction: 'incoming', nodeID: node.identity, connectionType: _graphSchemeReference.connectionType.resource });
    (0, _assert.default)(resourceConnectionArray.every(n => n.destination.labels.includes(_graphSchemeReference.nodeLabel.file)), `• Unsupported node type for a RESOURCE connection.`);
    if (executeConnectionArray.length == 0) return null;

    let resourceNode;
    if (resourceConnectionArray.length > 0) resourceNode = resourceConnectionArray[0].destination;

    let executeConnection = executeConnectionArray[0].connection;
    let dataProcessImplementation;
    if (executeConnection.properties.processDataImplementation) {
      dataProcessImplementation = graphInstance.traversal.processData[executeConnection.properties.processDataImplementation];
      (0, _assert.default)(dataProcessImplementation, `• "${executeConnection.properties.processDataImplementation}" implementation isn't registered in traversal concrete instance.`);
    } else dataProcessImplementation = implementation;

    let executeNode = executeConnectionArray[0].destination;

    let result = await dataProcessImplementation.call(node, { node: executeNode, resourceNode });

    if (evaluation.shouldIncludeResult()) aggregator.add(result);
    return result;
  } }, ((0, _applyDecoratedDescriptor2.default)(_obj, "traverse", [_dec, _dec2, _dec3], Object.getOwnPropertyDescriptor(_obj, "traverse"), _obj)), _obj)));









Prototype[_entity.Constructable.reference.initialize.functionality].setter.call(Prototype, {
  [_entity.Entity.reference.key.concereteBehavior]({ targetInstance, concereteBehaviorList } = {}, previousResult) {} });









Prototype[_entity.Constructable.reference.constructor.functionality].setter.call(Prototype, {







  [Reference.key.constructor]({


    database,
    traversal,

    concreteBehaviorList = [],
    data,
    callerClass = this,
    mode = 'applicationInMemory' || 'databaseInMemory' })





  {
    (0, _assert.default)(database, '• Database concrete behavior must be passed.');
    (0, _assert.default)(traversal, '• traversal concrete behavior must be passed.');


    let instance = _entity.Constructable[_entity.Constructable.reference.constructor.functionality].switch.call(callerClass, { implementationKey: _entity.Entity.reference.key.concereteBehavior })({
      concreteBehaviorList: [...concreteBehaviorList, database, traversal],
      data });


    let concereteDatabase = instance[_entity.Entity.reference.getInstanceOf](_DatabaseClass.Database);
    instance.database = concereteDatabase[_DatabaseClass.Database.reference.key.getter]();
    let concreteTraversal = instance[_entity.Entity.reference.getInstanceOf](_GraphTraversalClass.GraphTraversal);
    instance.traversal = concreteTraversal[_ImplementationManagementClass.ImplementationManagement.reference.key.getter]();





    return instance;
  } });









Graph.clientInterface = Prototype[_entity.Constructable.reference.clientInterface.functionality].switch.call(Graph, {
  implementationKey: _entity.Entity.reference.key.instanceDelegatingToEntityInstancePrototype })(
{
  constructorImplementation: Reference.key.constructor,
  clientInterfaceInterceptCallback: false });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9jb25zdHJ1Y3RhYmxlL0dyYXBoLmNsYXNzLmpzIl0sIm5hbWVzIjpbIkV2YWx1YXRvciIsImNsYXNzIiwiR3JhcGgiLCJyZWZlcmVuY2UiLCJSZWZlcmVuY2UiLCJjb25zdHJ1Y3RhYmxlUHJvdG90eXBlIiwiUHJvdG90eXBlIiwiZW50aXR5UHJvdG90eXBlIiwiRW50aXR5IiwiY2xpZW50SW50ZXJmYWNlIiwiZGVzY3JpcHRpb24iLCJPYmplY3QiLCJhc3NpZ24iLCJrZXkiLCJjb25zdHJ1Y3RvciIsIlN5bWJvbCIsInRhcmdldCIsInRoaXNBcmciLCJhcmd1bWVudHNMaXN0IiwidGFyZ2V0Q2xhc3MiLCJtZXRob2ROYW1lIiwibm9kZUluc3RhbmNlIiwibm9kZUtleSIsIm5vZGVJRCIsImdyYXBoSW5zdGFuY2UiLCJub2RlRGF0YSIsImRhdGFiYXNlIiwiZ2V0Tm9kZUJ5S2V5IiwiZ2V0Tm9kZUJ5SUQiLCJpZCIsIkVycm9yIiwibGFiZWxzIiwiaW5jbHVkZXMiLCJub2RlTGFiZWwiLCJzdWJncmFwaFRlbXBsYXRlIiwicGFyYW1ldGVyIiwibGFvZFN1YmdyYXBoVGVtcGxhdGVQYXJhbWV0ZXIiLCJub2RlIiwiZm9yRWFjaCIsInByb3BlcnR5IiwiaW1wbGVtZW50YXRpb25LZXkiLCJ0cmF2ZXJzYWxDb25maWd1cmF0aW9uIiwiYWRkaXRpb25hbENoaWxkTm9kZSIsInJvb3ROb2RlIiwiUmVmbGVjdCIsImFwcGx5IiwicGFzc2VkQXJnIiwiZGVmYXVsdEFyZyIsInRyYXZlcnNhbERlcHRoIiwicGF0aCIsIm5vZGVUeXBlIiwicGFyZW50VHJhdmVyc2FsQXJnIiwicGFyYW1ldGVySW1wbGVtZW50YXRpb25LZXkiLCJwcm9jZXNzRGF0YSIsImhhbmRsZVByb3BhZ2F0aW9uIiwidHJhdmVyc2VOb2RlIiwiYWdncmVnYXRvciIsInRyYXZlcnNhbEludGVyY2VwdGlvbiIsImV2YWx1YXRlUG9zaXRpb24iLCJyZW1vdmVVbmRlZmluZWRGcm9tT2JqZWN0IiwiY29udGV4dEltcGxlbWVudGF0aW9uS2V5IiwiQ29udGV4dCIsImdldHRlciIsInBhcmVudEltcGxlbWVudGF0aW9uS2V5IiwidGFyZ2V0T2JqZWN0IiwiaW1wbGVtZW50YXRpb24iLCJkYXRhUHJvY2VzcyIsInRyYXZlcnNhbCIsInRhcmdldEZ1bmN0aW9uIiwiUHJveHkiLCJlbnRyaWVzIiwiZXZlcnkiLCJ2YWx1ZSIsIkJvb2xlYW4iLCJsb2FkIiwiZ3JhcGhEYXRhIiwiZWRnZSIsImxvYWRHcmFwaERhdGEiLCJub2RlRW50cnlEYXRhIiwiY29ubmVjdGlvbkVudHJ5RGF0YSIsInByaW50IiwiY29uc29sZSIsImxvZyIsImNvdW50IiwiYWxsTm9kZSIsImdldEFsbE5vZGUiLCJhbGxFZGdlIiwiZ2V0QWxsRWRnZSIsImlkZW50aXR5IiwiY29ubmVjdGlvbiIsInN0YXJ0IiwiZW5kIiwiY291bnROb2RlIiwiY291bnRFZGdlIiwicm9vdFJlbGF0aW9uc2hpcEFycmF5IiwiZ2V0Tm9kZUNvbm5lY3Rpb24iLCJkaXJlY3Rpb24iLCJjb25uZWN0aW9uVHlwZSIsInJvb3QiLCJuIiwiZGVzdGluYXRpb24iLCJzdGFnZSIsImV4dGVuZFJlbGF0aW9uc2hpcEFycmF5IiwiZXh0ZW5kIiwiY29uZmlndXJlUmVsYXRpb25zaGlwQXJyYXkiLCJjb25maWd1cmUiLCJjb25maWd1cmF0aW9uIiwibGVuZ3RoIiwiZXh0cmFjdFRyYXZlcnNhbENvbmZpZ1Byb3BlcnR5IiwicHJvcGVydHlPYmplY3QiLCJyZWR1Y2UiLCJhY2N1bXVsYXRvciIsInRyYXZlcnNhbE9wdGlvbiIsImNvbmZpZ3VyZU5vZGUiLCJwcm9wZXJ0aWVzIiwiaW5zZXJ0UmVsYXRpb25zaGlwQXJyYXkiLCJpbnNlcnQiLCJzb3J0IiwiZm9ybWVyIiwibGF0dGVyIiwib3JkZXIiLCJpbnNlcnRSZWxhdGlvbnNoaXAiLCJpbnNlcnROb2RlIiwicHVzaCIsInBsYWNlbWVudCIsInBvc2l0aW9uIiwiY29ubmVjdGlvbktleSIsImV4dGVuZE5vZGUiLCJyZWN1cnNpdmVDYWxsUmVzdWx0IiwidHJhdmVyc2UiLCJ0cmF2ZXJzYWxJdGVyYXRvckZlZWQiLCJjb25jcmV0ZVRyYXZlcnNhbCIsImV2ZW50RW1pdHRlciIsIkV2ZW50RW1pdHRlciIsImV2YWx1YXRpb24iLCJoYW5kbGVQcm9wYWdhdGlvbkltcGxlbWVudGF0aW9uIiwiZGF0YVByb2Nlc3NDYWxsYmFjayIsIm5leHRQcm9jZXNzRGF0YSIsInByb3h5aWZ5IiwicmVzdWx0IiwicmVjdXJzaXZlSXRlcmF0aW9uIiwiYXJndW1lbnRzIiwicHJvcGFnYXRpb24iLCJldmFsdWF0aW9uT3B0aW9uIiwiY29udGludWUiLCJhZ2dyZWdhdGlvbiIsImluY2x1ZGUiLCJ0cmFwQXN5bmNJdGVyYXRvciIsIml0ZXJhdG9yIiwidHJhdmVyc2FsSXRlcmF0aW9uIiwiX2hhbmRsZVByb3BhZ2F0aW9uSW1wbGVtZW50YXRpb24iLCJ0cmF2ZXJzYWxDb25maWciLCJuZXh0SXRlcmF0b3IiLCJub2RlSXRlcmF0b3JGZWVkIiwiZm9ya05vZGUiLCJldmVudEVtaXR0ZXJDYWxsYmFjayIsImVtaXQiLCJpdGVyYXRvclJlc3VsdCIsIm5leHQiLCJkb25lIiwicHJvbWlzZSIsInJlY3Vyc2l2ZUNhbGxiYWNrIiwic2hvdWxkQ29udGludWUiLCJhcmdzIiwibmV4dE5vZGUiLCJuZXh0Q2FsbEFyZ3VtZW50IiwicG9ydFRyYXZlcnNhbFJlc3VsdCIsImNvbmZpZyIsIm5hbWUiLCJzaG91bGRFeGVjdXRlUHJvY2VzcyIsImV4ZWN1dGVDb25uZWN0aW9uQXJyYXkiLCJleGVjdXRlIiwicHJvY2VzcyIsInJlc291cmNlQ29ubmVjdGlvbkFycmF5IiwicmVzb3VyY2UiLCJmaWxlIiwicmVzb3VyY2VOb2RlIiwiZXhlY3V0ZUNvbm5lY3Rpb24iLCJkYXRhUHJvY2Vzc0ltcGxlbWVudGF0aW9uIiwicHJvY2Vzc0RhdGFJbXBsZW1lbnRhdGlvbiIsImV4ZWN1dGVOb2RlIiwic2hvdWxkSW5jbHVkZVJlc3VsdCIsImFkZCIsIkNvbnN0cnVjdGFibGUiLCJpbml0aWFsaXplIiwiZnVuY3Rpb25hbGl0eSIsInNldHRlciIsImNvbmNlcmV0ZUJlaGF2aW9yIiwidGFyZ2V0SW5zdGFuY2UiLCJjb25jZXJldGVCZWhhdmlvckxpc3QiLCJwcmV2aW91c1Jlc3VsdCIsImNvbmNyZXRlQmVoYXZpb3JMaXN0IiwiZGF0YSIsImNhbGxlckNsYXNzIiwibW9kZSIsImluc3RhbmNlIiwic3dpdGNoIiwiY29uY2VyZXRlRGF0YWJhc2UiLCJnZXRJbnN0YW5jZU9mIiwiRGF0YWJhc2UiLCJHcmFwaFRyYXZlcnNhbCIsIkltcGxlbWVudGF0aW9uTWFuYWdlbWVudCIsImluc3RhbmNlRGVsZWdhdGluZ1RvRW50aXR5SW5zdGFuY2VQcm90b3R5cGUiLCJjb25zdHJ1Y3RvckltcGxlbWVudGF0aW9uIiwiY2xpZW50SW50ZXJmYWNlSW50ZXJjZXB0Q2FsbGJhY2siXSwibWFwcGluZ3MiOiI2ZEFBQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtFLDZCQUZBLE1BQU1BLFNBQVMsR0FBRyx3Q0FBbEI7Ozs7Ozs7Ozs7QUFZTyxNQUFNLEVBQUVDLEtBQUssRUFBRUMsS0FBVCxFQUFnQkMsU0FBUyxFQUFFQyxTQUEzQixFQUFzQ0Msc0JBQXNCLEVBQUVDLFNBQTlELEVBQXlFQyxlQUF6RSxLQUE2RixJQUFJQyxlQUFPQyxlQUFYLENBQTJCLEVBQUVDLFdBQVcsRUFBRSxPQUFmLEVBQTNCLENBQW5HLEM7O0FBRVBDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjUixTQUFkLEVBQXlCO0FBQ3ZCUyxFQUFBQSxHQUFHLEVBQUU7QUFDSEMsSUFBQUEsV0FBVyxFQUFFQyxNQUFNLENBQUMsdUJBQUQsQ0FEaEIsRUFEa0IsRUFBekI7Ozs7Ozs7Ozs7OztBQWNBSixNQUFNLENBQUNDLE1BQVAsQ0FBY0wsZUFBZDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QSxRQUFJcUUsaUJBQWlCLEdBQUdnRSxRQUFRLENBQUMzTCxlQUFPTCxTQUFQLENBQWlCbU0sYUFBbEIsQ0FBUixDQUF5Q0UsbUNBQXpDLENBQXhCO0FBQ0FMLElBQUFBLFFBQVEsQ0FBQ2hJLFNBQVQsR0FBcUJnRSxpQkFBaUIsQ0FBQ3NFLHdEQUF5QnRNLFNBQXpCLENBQW1DVSxHQUFuQyxDQUF1Q2lELE1BQXhDLENBQWpCLEVBQXJCOzs7Ozs7QUFNQSxXQUFPcUksUUFBUDtBQUNELEdBM0M0RSxFQUF0RSxDQUFUOzs7Ozs7Ozs7O0FBcURBak0sS0FBSyxDQUFDTyxlQUFOLEdBQStCSCxTQUFTLENBQUNpTCxzQkFBY3BMLFNBQWQsQ0FBd0JNLGVBQXhCLENBQXdDZ0wsYUFBekMsQ0FBVCxDQUFpRVcsTUFBeEUsTUFBQWxNLEtBQUssRUFBMEU7QUFDckdzQyxFQUFBQSxpQkFBaUIsRUFBRWhDLGVBQU9MLFNBQVAsQ0FBaUJVLEdBQWpCLENBQXFCNkwsMkNBRDZELEVBQTFFLENBQUw7QUFFckI7QUFDREMsRUFBQUEseUJBQXlCLEVBQUV2TSxTQUFTLENBQUNTLEdBQVYsQ0FBY0MsV0FEeEM7QUFFRDhMLEVBQUFBLGdDQUFnQyxFQUFFLEtBRmpDLEVBRnFCLENBQXhCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFzc2VydCBmcm9tICdhc3NlcnQnXG5pbXBvcnQgeyBFbnRpdHksIENvbnN0cnVjdGFibGUsIHN5bWJvbCB9IGZyb20gJ0BkZXBlbmRlbmN5L2VudGl0eSdcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuL05vZGUuY2xhc3MuanMnXG5pbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnLi9Db25uZWN0aW9uLmNsYXNzLmpzJ1xuaW1wb3J0IHsgR3JhcGhUcmF2ZXJzYWwsIHRyYXZlcnNhbE9wdGlvbiB9IGZyb20gJy4vR3JhcGhUcmF2ZXJzYWwuY2xhc3MuanMnXG5pbXBvcnQgeyBEYXRhYmFzZSB9IGZyb20gJy4vRGF0YWJhc2UuY2xhc3MuanMnXG5pbXBvcnQgeyBDYWNoZSB9IGZyb20gJy4vQ2FjaGUuY2xhc3MuanMnXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0LmNsYXNzLmpzJ1xuaW1wb3J0IHsgSW1wbGVtZW50YXRpb25NYW5hZ2VtZW50IH0gZnJvbSAnLi9JbXBsZW1lbnRhdGlvbk1hbmFnZW1lbnQuY2xhc3MuanMnXG5pbXBvcnQgeyBwcm94aWZ5TWV0aG9kRGVjb3JhdG9yIH0gZnJvbSAnLi4vdXRpbGl0eS9wcm94aWZ5TWV0aG9kRGVjb3JhdG9yLmpzJ1xuaW1wb3J0IHsgbWVyZ2VEZWZhdWx0UGFyYW1ldGVyIH0gZnJvbSAnLi4vdXRpbGl0eS9tZXJnZURlZmF1bHRQYXJhbWV0ZXIuanMnXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cydcbmltcG9ydCB7IEV2YWx1YXRvckZ1bmN0aW9uLCBldmFsdWF0aW9uT3B0aW9uIH0gZnJvbSAnLi9FdmFsdWF0b3IuY2xhc3MuanMnXG5jb25zdCBFdmFsdWF0b3IgPSBFdmFsdWF0b3JGdW5jdGlvbigpXG5pbXBvcnQgeyByZW1vdmVVbmRlZmluZWRGcm9tT2JqZWN0IH0gZnJvbSAnLi4vdXRpbGl0eS9yZW1vdmVVbmRlZmluZWRGcm9tT2JqZWN0LmpzJ1xuaW1wb3J0IHsgbm9kZUxhYmVsLCBjb25uZWN0aW9uVHlwZSB9IGZyb20gJy4uL2dyYXBoU2NoZW1lUmVmZXJlbmNlLmpzJ1xuXG4vKiogQ29uY2VwdHVhbCBHcmFwaFxuICogR3JhcGggQ2xhc3MgaG9sZHMgYW5kIG1hbmFnZXMgZ3JhcGggZWxlbWVudHMgYW5kIHRyYXZlcnNhbCBhbGdvcml0aG0gaW1wbGVtZW50YXRpb25zOlxuICogIC0gQ2FjaGU6IG9uLWRlbWFuZCByZXRyaXZlZCBub2RlcyBmcm9tIERCIGFyZSBjYWNoZWQuXG4gKiAgLSBEYXRhYmFzZTogZ2V0IGdyYXBoIGRhdGEgYW5kIGxvYWQgaXQgaW50byBtZW1vcnkuXG4gKiAgLSBUcmF2ZXJzYWw6IGltcGxlbWVudGF0aW9uIGZvciB0aGUgdHJhdmVyc2FsIGFsZ29yaXRobS5cbiAqICAtIENvbnRleHQ6IHNoYXJlZCBkYXRhIGFjY2Vzc2libGUgYmV0d2VlbiB0cmF2ZXJzYWxzLlxuICogVGhlIEdyYXBoIGluc3RhbmNlIHNob3VsZCBoYXZlIGFuIGFiaWxpdHkgdG8gc2V0L2NoYW5nZSBzdHJhdGVnaWVzL2ltcGxlbWVudGF0aW9ucyBvbiBydW50aW1lIGFuZCBhYmlsaXR5IHRvIHVzZSBtdWx0aXBsZSByZWdpc3RlcmVkIGltcGxlbWVudGF0aW9ucy5cbiAqL1xuZXhwb3J0IGNvbnN0IHsgY2xhc3M6IEdyYXBoLCByZWZlcmVuY2U6IFJlZmVyZW5jZSwgY29uc3RydWN0YWJsZVByb3RvdHlwZTogUHJvdG90eXBlLCBlbnRpdHlQcm90b3R5cGUgfSA9IG5ldyBFbnRpdHkuY2xpZW50SW50ZXJmYWNlKHsgZGVzY3JpcHRpb246ICdHcmFwaCcgfSlcblxuT2JqZWN0LmFzc2lnbihSZWZlcmVuY2UsIHtcbiAga2V5OiB7XG4gICAgY29uc3RydWN0b3I6IFN5bWJvbCgnR3JhcGg6a2V5LmNvbnN0cnVjdG9yJyksXG4gIH0sXG59KVxuXG4vKlxuICAgICAgICAgICAgICAgICAgIF8gICAgICAgIF8gICAgICAgICAgICAgICAgICAgIF9fX18gICAgICAgXyAgICAgICAgICAgICAgICAgIF8gICBfICAgICAgICAgICAgIFxuICAgXyBfXyAgXyBfXyBfX18gfCB8XyBfX18gfCB8XyBfICAgXyBfIF9fICAgX19ffCAgXyBcXCAgX19ffCB8IF9fXyAgX18gXyAgX18gX3wgfF8oXykgX19fICBfIF9fICBcbiAgfCAnXyBcXHwgJ19fLyBfIFxcfCBfXy8gXyBcXHwgX198IHwgfCB8ICdfIFxcIC8gXyBcXCB8IHwgfC8gXyBcXCB8LyBfIFxcLyBfYCB8LyBfYCB8IF9ffCB8LyBfIFxcfCAnXyBcXCBcbiAgfCB8XykgfCB8IHwgKF8pIHwgfHwgKF8pIHwgfF98IHxffCB8IHxfKSB8ICBfXy8gfF98IHwgIF9fLyB8ICBfXy8gKF98IHwgKF98IHwgfF98IHwgKF8pIHwgfCB8IHxcbiAgfCAuX18vfF98ICBcXF9fXy8gXFxfX1xcX19fLyBcXF9ffFxcX18sIHwgLl9fLyBcXF9fX3xfX19fLyBcXF9fX3xffFxcX19ffFxcX18sIHxcXF9fLF98XFxfX3xffFxcX19fL3xffCB8X3xcbiAgfF98ICAgICAgICAgICAgICAgICAgICAgICAgICAgfF9fXy98X3wgICAgICAgICAgICAgICAgICAgICAgICAgICB8X19fLyAgICAgICAgICAgICAgICAgICAgICAgICBcbiovXG5PYmplY3QuYXNzaWduKGVudGl0eVByb3RvdHlwZSwge1xuICAvLyBsb2FkIGdyYXBoIGludG8gbWVtb3J5XG4gIGFzeW5jIGxvYWQoeyBncmFwaERhdGEsIGdyYXBoSW5zdGFuY2UgPSB0aGlzIH0gPSB7fSkge1xuICAgIC8vIGxvYWQganNvbiBncmFwaCBkYXRhLlxuICAgIGFzc2VydChncmFwaERhdGEubm9kZSAmJiBncmFwaERhdGEuZWRnZSwgYOKAoiBHcmFwaCBkYXRhIG9iamVjdCBtdXN0IGNvbnRhaW4gbm9kZSAmIGVkZ2UgYXJyYXlzLmApXG4gICAgcmV0dXJuIGF3YWl0IGdyYXBoSW5zdGFuY2UuZGF0YWJhc2UubG9hZEdyYXBoRGF0YSh7IG5vZGVFbnRyeURhdGE6IGdyYXBoRGF0YS5ub2RlLCBjb25uZWN0aW9uRW50cnlEYXRhOiBncmFwaERhdGEuZWRnZSB9KVxuICB9LFxuICBhc3luYyBwcmludCh7IGdyYXBoSW5zdGFuY2UgPSB0aGlzIH0gPSB7fSkge1xuICAgIGNvbnNvbGUubG9nKGBfX19fX18gR3JhcGggZWxlbWVudHM6IF9fX19fX19fX19fX19fX19fX19fYClcbiAgICBsZXQgY291bnQgPSBhd2FpdCBncmFwaEluc3RhbmNlLmNvdW50KClcbiAgICBsZXQgYWxsTm9kZSA9IGF3YWl0IGdyYXBoSW5zdGFuY2UuZGF0YWJhc2UuZ2V0QWxsTm9kZSgpXG4gICAgbGV0IGFsbEVkZ2UgPSBhd2FpdCBncmFwaEluc3RhbmNlLmRhdGFiYXNlLmdldEFsbEVkZ2UoKVxuICAgIGNvbnNvbGUubG9nKGAjVmVydGV4ID0gJHtjb3VudC5ub2RlfWApXG4gICAgZm9yIChsZXQgbm9kZSBvZiBhbGxOb2RlKSB7XG4gICAgICBjb25zb2xlLmxvZyhub2RlLmlkZW50aXR5KVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhgXFxuI0VkZ2UgPSAke2NvdW50LmNvbm5lY3Rpb259YClcbiAgICBmb3IgKGxldCBlZGdlIG9mIGFsbEVkZ2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKGAke2VkZ2Uuc3RhcnR9IC0tPiAke2VkZ2UuZW5kfWApXG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fYClcbiAgfSxcbiAgYXN5bmMgY291bnQoeyBncmFwaEluc3RhbmNlID0gdGhpcyB9ID0ge30pIHtcbiAgICAvLyBjb3VudCBudW1iZXIgb2YgY2FjaGVkIGVsZW1lbnRzXG4gICAgcmV0dXJuIHtcbiAgICAgIG5vZGU6IGF3YWl0IGdyYXBoSW5zdGFuY2UuZGF0YWJhc2UuY291bnROb2RlKCksXG4gICAgICBjb25uZWN0aW9uOiBhd2FpdCBncmFwaEluc3RhbmNlLmRhdGFiYXNlLmNvdW50RWRnZSgpLFxuICAgIH1cbiAgfSxcbiAgLy8gbG9hZCBgc3ViZ3JhcGggdGVtcGxhdGVgIG5vZGUgcGFyYW1ldGVycyBmb3IgdHJhdmVyc2FsIGNhbGwgdXNhZ2UuXG4gIGFzeW5jIGxhb2RTdWJncmFwaFRlbXBsYXRlUGFyYW1ldGVyKHsgbm9kZSwgZ3JhcGhJbnN0YW5jZSA9IHRoaXMgfSkge1xuICAgIGxldCByb290UmVsYXRpb25zaGlwQXJyYXkgPSBhd2FpdCBncmFwaEluc3RhbmNlLmRhdGFiYXNlLmdldE5vZGVDb25uZWN0aW9uKHsgZGlyZWN0aW9uOiAnb3V0Z29pbmcnLCBub2RlSUQ6IG5vZGUuaWRlbnRpdHksIGNvbm5lY3Rpb25UeXBlOiBjb25uZWN0aW9uVHlwZS5yb290IH0pXG4gICAgYXNzZXJ0KHJvb3RSZWxhdGlvbnNoaXBBcnJheS5ldmVyeShuID0+IG4uZGVzdGluYXRpb24ubGFiZWxzLmluY2x1ZGVzKG5vZGVMYWJlbC5zdGFnZSkpLCBg4oCiIFVuc3VwcG9ydGVkIG5vZGUgdHlwZSBmb3IgYSBST09UIGNvbm5lY3Rpb24uYCkgLy8gdmVyaWZ5IG5vZGUgdHlwZVxuICAgIGxldCBleHRlbmRSZWxhdGlvbnNoaXBBcnJheSA9IGF3YWl0IGdyYXBoSW5zdGFuY2UuZGF0YWJhc2UuZ2V0Tm9kZUNvbm5lY3Rpb24oeyBkaXJlY3Rpb246ICdvdXRnb2luZycsIG5vZGVJRDogbm9kZS5pZGVudGl0eSwgY29ubmVjdGlvblR5cGU6IGNvbm5lY3Rpb25UeXBlLmV4dGVuZCB9KVxuICAgIGFzc2VydChleHRlbmRSZWxhdGlvbnNoaXBBcnJheS5ldmVyeShuID0+IG4uZGVzdGluYXRpb24ubGFiZWxzLmluY2x1ZGVzKG5vZGVMYWJlbC5zdWJncmFwaFRlbXBsYXRlKSksIGDigKIgVW5zdXBwb3J0ZWQgbm9kZSB0eXBlIGZvciBhIEVYVEVORCBjb25uZWN0aW9uLmApIC8vIHZlcmlmeSBub2RlIHR5cGVcbiAgICBsZXQgY29uZmlndXJlUmVsYXRpb25zaGlwQXJyYXkgPSBhd2FpdCBncmFwaEluc3RhbmNlLmRhdGFiYXNlLmdldE5vZGVDb25uZWN0aW9uKHsgZGlyZWN0aW9uOiAnaW5jb21pbmcnLCBub2RlSUQ6IG5vZGUuaWRlbnRpdHksIGNvbm5lY3Rpb25UeXBlOiBjb25uZWN0aW9uVHlwZS5jb25maWd1cmUgfSlcbiAgICBhc3NlcnQoY29uZmlndXJlUmVsYXRpb25zaGlwQXJyYXkuZXZlcnkobiA9PiBuLmRlc3RpbmF0aW9uLmxhYmVscy5pbmNsdWRlcyhub2RlTGFiZWwuY29uZmlndXJhdGlvbikpLCBg4oCiIFVuc3VwcG9ydGVkIG5vZGUgdHlwZSBmb3IgYSBFWFRFTkQgY29ubmVjdGlvbi5gKSAvLyB2ZXJpZnkgbm9kZSB0eXBlXG5cbiAgICBsZXQgcm9vdE5vZGUsXG4gICAgICB0cmF2ZXJzYWxDb25maWd1cmF0aW9uID0ge30sXG4gICAgICBhZGRpdGlvbmFsQ2hpbGROb2RlID0gW10gLy8gYWRkaXRpb25hbCBub2Rlc1xuXG4gICAgLy8gZ2V0IHRyYXZlcnNhbCBjb25maWd1cmF0aW9uIG5vZGVcbiAgICBpZiAoY29uZmlndXJlUmVsYXRpb25zaGlwQXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgZnVuY3Rpb24gZXh0cmFjdFRyYXZlcnNhbENvbmZpZ1Byb3BlcnR5KHByb3BlcnR5T2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZW50cmllcyhwcm9wZXJ0eU9iamVjdCkucmVkdWNlKChhY2N1bXVsYXRvciwgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgaWYgKHRyYXZlcnNhbE9wdGlvbi5pbmNsdWRlcyhrZXkpKSBhY2N1bXVsYXRvcltrZXldID0gdmFsdWVcbiAgICAgICAgICByZXR1cm4gYWNjdW11bGF0b3JcbiAgICAgICAgfSwge30pXG4gICAgICB9XG4gICAgICBsZXQgY29uZmlndXJlTm9kZSA9IGNvbmZpZ3VyZVJlbGF0aW9uc2hpcEFycmF5WzBdLmRlc3RpbmF0aW9uXG4gICAgICB0cmF2ZXJzYWxDb25maWd1cmF0aW9uID0gZXh0cmFjdFRyYXZlcnNhbENvbmZpZ1Byb3BlcnR5KGNvbmZpZ3VyZU5vZGUucHJvcGVydGllcylcbiAgICB9XG5cbiAgICAvLyBnZXQgYWRkaXRpb25hbCBub2Rlc1xuICAgIGxldCBpbnNlcnRSZWxhdGlvbnNoaXBBcnJheSA9IGF3YWl0IGdyYXBoSW5zdGFuY2UuZGF0YWJhc2UuZ2V0Tm9kZUNvbm5lY3Rpb24oeyBkaXJlY3Rpb246ICdpbmNvbWluZycsIG5vZGVJRDogbm9kZS5pZGVudGl0eSwgY29ubmVjdGlvblR5cGU6IGNvbm5lY3Rpb25UeXBlLmluc2VydCB9KVxuICAgIGluc2VydFJlbGF0aW9uc2hpcEFycmF5LnNvcnQoKGZvcm1lciwgbGF0dGVyKSA9PiBmb3JtZXIuY29ubmVjdGlvbi5wcm9wZXJ0aWVzLm9yZGVyIC0gbGF0dGVyLmNvbm5lY3Rpb24ucHJvcGVydGllcy5vcmRlcikgLy8gdXNpbmcgYG9yZGVyYCBwcm9wZXJ0eSAvLyBCdWxrIGFjdGlvbnMgb24gZm9ya3MgLSBzb3J0IGZvcmtzXG4gICAgZm9yIChsZXQgaW5zZXJ0UmVsYXRpb25zaGlwIG9mIGluc2VydFJlbGF0aW9uc2hpcEFycmF5KSB7XG4gICAgICBsZXQgaW5zZXJ0Tm9kZSA9IGluc2VydFJlbGF0aW9uc2hpcC5kZXN0aW5hdGlvblxuICAgICAgYXNzZXJ0KGluc2VydE5vZGUubGFiZWxzLmluY2x1ZGVzKG5vZGVMYWJlbC5zdGFnZSksIGDigKIgXCIke2luc2VydE5vZGUubGFiZWxzfVwiIFVuc3VwcG9ydGVkIG5vZGUgdHlwZSBmb3IgYSBST09UIGNvbm5lY3Rpb24uYCkgLy8gdmVyaWZ5IG5vZGUgdHlwZVxuICAgICAgYWRkaXRpb25hbENoaWxkTm9kZS5wdXNoKHtcbiAgICAgICAgbm9kZTogaW5zZXJ0Tm9kZSxcbiAgICAgICAgcGxhY2VtZW50OiB7XG4gICAgICAgICAgLy8gY29udmVudGlvbiBmb3IgZGF0YSBzdHJ1Y3R1cmUgb2YgcGxhY2VtZW50IGFycmF5IC0gMDogJ2JlZm9yZScgfCAnYWZ0ZXInLCAxOiBjb25uZWN0aW9uS2V5XG4gICAgICAgICAgcG9zaXRpb246IGluc2VydFJlbGF0aW9uc2hpcC5jb25uZWN0aW9uLnByb3BlcnRpZXMucGxhY2VtZW50WzBdLFxuICAgICAgICAgIGNvbm5lY3Rpb25LZXk6IGluc2VydFJlbGF0aW9uc2hpcC5jb25uZWN0aW9uLnByb3BlcnRpZXMucGxhY2VtZW50WzFdLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBnZXQgcm9vdE5vZGUgYW5kIGhhbmRsZSBleHRlbmRlZCBub2RlLlxuICAgIGlmIChyb290UmVsYXRpb25zaGlwQXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgcm9vdE5vZGUgPSByb290UmVsYXRpb25zaGlwQXJyYXlbMF0uZGVzdGluYXRpb25cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGV4dGVuZE5vZGUgPSBleHRlbmRSZWxhdGlvbnNoaXBBcnJheVswXS5kZXN0aW5hdGlvblxuICAgICAgbGV0IHJlY3Vyc2l2ZUNhbGxSZXN1bHQgPSBhd2FpdCBncmFwaEluc3RhbmNlOjpncmFwaEluc3RhbmNlLmxhb2RTdWJncmFwaFRlbXBsYXRlUGFyYW1ldGVyKHsgbm9kZTogZXh0ZW5kTm9kZSwgZ3JhcGhJbnN0YW5jZSB9KVxuICAgICAgYWRkaXRpb25hbENoaWxkTm9kZSA9IFsuLi5yZWN1cnNpdmVDYWxsUmVzdWx0LmFkZGl0aW9uYWxDaGlsZE5vZGUsIC4uLmFkZGl0aW9uYWxDaGlsZE5vZGVdXG4gICAgICB0cmF2ZXJzYWxDb25maWd1cmF0aW9uID0gT2JqZWN0LmFzc2lnbihyZWN1cnNpdmVDYWxsUmVzdWx0LnRyYXZlcnNhbENvbmZpZ3VyYXRpb24sIHRyYXZlcnNhbENvbmZpZ3VyYXRpb24pXG4gICAgICByb290Tm9kZSA9IHJlY3Vyc2l2ZUNhbGxSZXN1bHQucm9vdE5vZGVcbiAgICB9XG5cbiAgICByZXR1cm4geyByb290Tm9kZSwgYWRkaXRpb25hbENoaWxkTm9kZSwgdHJhdmVyc2FsQ29uZmlndXJhdGlvbiB9IC8vIHJvb3ROb2RlIHdpbGwgYmUgdXNlZCBhcyBlbnRyeXBvaW50IHRvIHRyYXZlcnNhbCBjYWxsXG4gIH0sXG5cbiAgLyoqIEdyYXBoIHRyYXZlcnNhbCAtIENvbnRyb2xzIHRoZSB0cmF2ZXJzaW5nIHRoZSBub2RlcyBpbiB0aGUgZ3JhcGguIFdoaWNoIGluY2x1ZGVzIHByb2Nlc3Npbmcgb2YgZGF0YSBpdGVtcyBhbmQgYWdncmVnYXRpb24gb2YgcmVzdWx0cy5cbiAgICogRHluYW1pYyBpbXBsZW1lbnRhdGlvbiAtIG5vdCByZXN0cmljdGVkIHRvIHNwZWNpZmljIGluaXRpYWxpemF0aW9uIGFsZ29yaXRobSwgcmF0aGVyIGNob29zZW4gZnJvbSBzZXR0aW5nIG9mIGVhY2ggbm9kZSBpbiB0aGUgdHJhdmVyc2VkIGdyYXBoLlxuICAgKi9cbiAgQHByb3hpZnlNZXRob2REZWNvcmF0b3IoYXN5bmMgKHRhcmdldCwgdGhpc0FyZywgYXJndW1lbnRzTGlzdCwgdGFyZ2V0Q2xhc3MsIG1ldGhvZE5hbWUpID0+IHtcbiAgICAvLyBjcmVhdGUgbm9kZSBpbnN0YW5jZSwgaW4gY2FzZSBzdHJpbmcga2V5IGlzIHBhc3NlZCBhcyBwYXJhbWV0ZXIuXG4gICAgbGV0IHsgbm9kZUluc3RhbmNlLCBub2RlS2V5LCBub2RlSUQsIGdyYXBoSW5zdGFuY2UgPSB0aGlzQXJnIH0gPSBhcmd1bWVudHNMaXN0WzBdXG4gICAgbGV0IG5vZGVEYXRhXG4gICAgaWYgKG5vZGVJbnN0YW5jZSkge1xuICAgICAgbm9kZURhdGEgPSBub2RlSW5zdGFuY2VcbiAgICB9IGVsc2UgaWYgKG5vZGVLZXkpIHtcbiAgICAgIG5vZGVEYXRhID0gYXdhaXQgZ3JhcGhJbnN0YW5jZS5kYXRhYmFzZS5nZXROb2RlQnlLZXkoeyBrZXk6IG5vZGVLZXkgfSkgLy8gcmV0cmlldmUgbm9kZSBkYXRhIG9uLWRlbWFuZFxuICAgIH0gZWxzZSBpZiAobm9kZUlEKSB7XG4gICAgICBub2RlRGF0YSA9IGF3YWl0IGdyYXBoSW5zdGFuY2UuZGF0YWJhc2UuZ2V0Tm9kZUJ5SUQoeyBpZDogbm9kZUlEIH0pIC8vIHJldHJpZXZlIG5vZGUgZGF0YSBvbi1kZW1hbmRcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfigKIgbm9kZSBpZGVudGlmaWVyIG9yIG9iamVjdCBtdXN0IGJlIHBhc3NlZCBpbi4nKVxuICAgIH1cblxuICAgIC8vIGRlYWwgd2l0aCBTdWJncmFwaFRlbXBsYXRlXG4gICAgaWYgKG5vZGVEYXRhLmxhYmVscy5pbmNsdWRlcyhub2RlTGFiZWwuc3ViZ3JhcGhUZW1wbGF0ZSkpIHtcbiAgICAgIGxldCBwYXJhbWV0ZXIgPSBhd2FpdCBncmFwaEluc3RhbmNlLmxhb2RTdWJncmFwaFRlbXBsYXRlUGFyYW1ldGVyKHsgbm9kZTogbm9kZURhdGEgfSlcbiAgICAgIC8vIHNldCBhZGRpdGlvbmFsIHBhcmFtZXRlcnNcbiAgICAgIDtbJ25vZGVJbnN0YW5jZScsICdub2RlS2V5JywgJ25vZGVJRCddLmZvckVhY2gocHJvcGVydHkgPT4gZGVsZXRlIGFyZ3VtZW50c0xpc3RbMF1bcHJvcGVydHldKSAvLyByZW1vdmUgc3ViZ3JhcGggdGVtcGxhdGUgbm9kZSByZWxhdGVkIGlkZW50aWZpZXJzLlxuICAgICAgYXJndW1lbnRzTGlzdFswXS5pbXBsZW1lbnRhdGlvbktleSA9IGFyZ3VtZW50c0xpc3RbMF0uaW1wbGVtZW50YXRpb25LZXkgPyBPYmplY3QuYXNzaWduKHBhcmFtZXRlci50cmF2ZXJzYWxDb25maWd1cmF0aW9uLCBhcmd1bWVudHNMaXN0WzBdLmltcGxlbWVudGF0aW9uS2V5KSA6IHBhcmFtZXRlci50cmF2ZXJzYWxDb25maWd1cmF0aW9uXG4gICAgICBhcmd1bWVudHNMaXN0WzBdLmFkZGl0aW9uYWxDaGlsZE5vZGUgPSBhcmd1bWVudHNMaXN0WzBdLmFkZGl0aW9uYWxDaGlsZE5vZGUgPyBbLi4uYXJndW1lbnRzTGlzdFswXS5hZGRpdGlvbmFsQ2hpbGROb2RlLCAuLi5wYXJhbWV0ZXIuYWRkaXRpb25hbENoaWxkTm9kZV0gOiBwYXJhbWV0ZXIuYWRkaXRpb25hbENoaWxkTm9kZVxuICAgICAgT2JqZWN0LmFzc2lnbihhcmd1bWVudHNMaXN0WzBdLCB7IG5vZGVJbnN0YW5jZTogcGFyYW1ldGVyLnJvb3ROb2RlIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGFyZ3VtZW50c0xpc3RbMF0ubm9kZUluc3RhbmNlID0gbm9kZURhdGEgLy8gc2V0IG5vZGUgZGF0YVxuICAgIH1cbiAgICByZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIHRoaXNBcmcsIGFyZ3VtZW50c0xpc3QpXG4gIH0pXG4gIEBwcm94aWZ5TWV0aG9kRGVjb3JhdG9yKCh0YXJnZXQsIHRoaXNBcmcgLypHcmFwaCBJbnN0YW5jZSovLCBhcmd1bWVudHNMaXN0LCB0YXJnZXRDbGFzcywgbWV0aG9kTmFtZSkgPT4ge1xuICAgIC8vIHNldCBkZWZhdWx0IHBhcmFtZXRlcnMgYW5kIGV4cG9zZSB0aGVtIHRvIHN1YnNlcXVlbnQgbWV0aG9kIGRlY29yYXRvcnMuXG4gICAgYXJndW1lbnRzTGlzdCA9IG1lcmdlRGVmYXVsdFBhcmFtZXRlcih7XG4gICAgICBwYXNzZWRBcmc6IGFyZ3VtZW50c0xpc3QsXG4gICAgICBkZWZhdWx0QXJnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0cmF2ZXJzYWxEZXB0aDogMCxcbiAgICAgICAgICBwYXRoOiBudWxsLCAvLyBUT0RPOiBpbXBsZW1lbnQgcGF0aCBzZXF1ZW5jZSBwcmVzZXJ2YXRpb24uIGFsbG93IGZvciB0aGUgbm9kZSB0cmF2ZXJzZSBmdW5jdGlvbiB0byByZWx5IG9uIHRoZSBjdXJyZW50IHBhdGggZGF0YS5cbiAgICAgICAgICBncmFwaEluc3RhbmNlOiB0aGlzQXJnLFxuICAgICAgICAgIGFkZGl0aW9uYWxDaGlsZE5vZGU6IFtdLCAvLyBjaGlsZCBub2RlcyB0byBhZGQgdG8gdGhlIGN1cnJlbnQgbm9kZSdzIGNoaWxkcmVuLiBUaGVzZSBhcmUgYWRkZWQgaW5kaXJlY3RseSB0byBhIG5vZGUgd2l0aG91dCBjaGFuZ2luZyB0aGUgbm9kZSdzIGNoaWxkcmVuIGl0c2VsZiwgYXMgYSB3YXkgdG8gZXh0ZW5kIGN1cnJlbnQgbm9kZXMuXG4gICAgICAgICAgbm9kZVR5cGU6ICdTdGFnZScsIC8vIFRyYXZlcnNhbCBzdGVwIG9yIHN0YWdlIC0gZGVmaW5lcyB3aGVuIGFuZCBob3cgdG8gcnVuIHByb2Nlc3Nlcy5cbiAgICAgICAgfSxcbiAgICAgICAgeyBwYXJlbnRUcmF2ZXJzYWxBcmc6IG51bGwgfSxcbiAgICAgIF0sXG4gICAgfSlcbiAgICByZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIHRoaXNBcmcsIGFyZ3VtZW50c0xpc3QpXG4gIH0pXG4gIC8qKiBcbiAgICogVE9ETzogIFJFRkFDVE9SIGFkZGluZyBUcmF2ZXJzYWwgZGVzY3JpcHRpb24gY2xhc3MgLSBhYmlsaXR5IHRvIHBpY2sgYSBkZWZpbmVkIHNldCBvZiBpbXBsZW1lbnRhdGlvbiBrZXlzIHRvIGJlIHVzZWQgdG8gZ2V0aGVyIC0gZS5nLiBpbXBsZW1lbnRhdGlvbiB0eXBlOiBDb25kaXRpb24sIE1pZGRsZXdhcmUsIFRlbXBsYXRlLCBTY2hlbWEsIFNoZWxsc2NyaXB0LlxuICAgIC0gaHR0cHM6Ly9uZW80ai5jb20vZG9jcy9qYXZhLXJlZmVyZW5jZS8zLjUvamF2YWRvY3Mvb3JnL25lbzRqL2dyYXBoZGIvdHJhdmVyc2FsL1RyYXZlcnNhbERlc2NyaXB0aW9uLmh0bWxcbiAgICAtIFNwbGl0IHRyYXZlcnNhbCBjb25maWd1cmF0aW9ucyB0aGF0IGFyZSBjb25maWd1cmVkIGJ5IHRoZSBub2RlIGdyYXBoIGRhdGEgaXRzZWxmIGZyb20gdGhvc2UgdGhhdCBhcmUgcGFzc2VkIHRvIHRoZSBjYWxsIGFzIHBhcmFtZXRlcnMuIE9SIG1lcmdlIHRoZW0sIGJ5IHVzaW5nIHNvbWUgYXMgZGVmYXVsdHMgaW4gY2FzZSBib3RoIGFyZSBzZXQuXG4gICAgLSBJbXBsZW1lbnQgJ2RlcHRoQWZmZWN0ZWQnIGZvciB0aGUgYWZmZWN0ZWQgZGVwdGggb2YgdGhlIGNvbmZpZ3VyZSBjb25uZWN0aW9ucyBvbiBhIHN0YWdlIGFuZCBpdHMgY2hpbGQgbm9kZXMuXG4gICAqL1xuICBAcHJveGlmeU1ldGhvZERlY29yYXRvcigodGFyZ2V0LCB0aGlzQXJnLCBhcmd1bWVudHNMaXN0LCB0YXJnZXRDbGFzcywgbWV0aG9kTmFtZSkgPT4ge1xuICAgIC8qKiBDaG9vc2UgY29uY3JldGUgaW1wbGVtZW50YXRpb25cbiAgICAgKiBQYXJhbWV0ZXIgaGlyZXJjaHkgZm9yIGdyYXBoIHRyYXZlcnNhbCBpbXBsZW1lbnRhdGlvbnM6ICgxIGFzIGZpcnN0IHByaW9yaXR5KVxuICAgICAqIDEuIHNoYXJlZCBjb250ZXh0IGNvbmZpZ3VyYXRpb25zIC0gdGhhdCBjb3VsZCBiZSB1c2VkIGFzIG92ZXJ3cml0aW5nIHZhbHVlcy4gZS5nLiBub2RlSW5zdGFuY2VbQ29udGV4dC5nZXRTaGFyZWRDb250ZXh0XS5jb25jZXJldGVJbXBsZW1lbnRhdGlvbktleXNcbiAgICAgKiAyLiBjYWxsIHBhcmFtZXRlcnMgdGhhdCBhcmUgcGFzc2VkIGRpcmVjdGx5XG4gICAgICogMy4gbm9kZSBpbnN0YW5jZSBjb25maWd1cmF0aW9uL3Byb3BlcnRpZXNcbiAgICAgKiA0LiBkZWZhdWx0IHZhbHVlcyBzcGVjaWZpZWQgaW4gdGhlIGZ1bmN0aW9uIHNjb3BlLlxuICAgICAqL1xuICAgIGxldCB7IG5vZGVJbnN0YW5jZSwgaW1wbGVtZW50YXRpb25LZXk6IHBhcmFtZXRlckltcGxlbWVudGF0aW9uS2V5ID0ge30sIGdyYXBoSW5zdGFuY2UgfSA9IGFyZ3VtZW50c0xpc3RbMF0sXG4gICAgICB7IHBhcmVudFRyYXZlcnNhbEFyZyB9ID0gYXJndW1lbnRzTGlzdFsxXVxuXG4gICAgLy8gVE9ETzogcmVmYWN0b3IgcGFyYW1ldGVyIGhpcmVyY2h5IG1lcmdpbmcgdG8gYmUgbW9yZSByZWFkYWJsZS5cbiAgICAvLyBpbXBsZW1lbnRhdGlvbiBrZXlzIG9mIG5vZGUgaW5zdGFuY2Ugb3duIGNvbmZpZyBwYXJhbWV0ZXJzIGFuZCBvZiBkZWZhdWx0IHZhbHVlcyBzZXQgaW4gZnVuY3Rpb24gc2NvcGVcbiAgICBsZXQgaW1wbGVtZW50YXRpb25LZXkgPVxuICAgICAge1xuICAgICAgICBwcm9jZXNzRGF0YTogJ3JldHVybkRhdGFJdGVtS2V5JyxcbiAgICAgICAgaGFuZGxlUHJvcGFnYXRpb246ICdjaHJvbm9sb2dpY2FsJyxcbiAgICAgICAgdHJhdmVyc2VOb2RlOiAnaXRlcmF0ZUZvcmsnLFxuICAgICAgICBhZ2dyZWdhdG9yOiAnQWdncmVnYXRvckFycmF5JyxcbiAgICAgICAgdHJhdmVyc2FsSW50ZXJjZXB0aW9uOiAncHJvY2Vzc1RoZW5UcmF2ZXJzZScgfHwgJ3RyYXZlcnNlVGhlblByb2Nlc3MnLFxuICAgICAgICBldmFsdWF0ZVBvc2l0aW9uOiAnZXZhbHVhdGVDb25kaXRpb24nLFxuICAgICAgfSB8PiByZW1vdmVVbmRlZmluZWRGcm9tT2JqZWN0IC8vIHJlbW92ZSB1bmRlZmluZWQgdmFsdWVzIGJlY2F1c2UgbmF0aXZlIE9iamVjdC5hc3NpZ24gZG9lc24ndCBvdmVycmlkZSBrZXlzIHdpdGggYHVuZGVmaW5lZGAgdmFsdWVzXG5cbiAgICAvLyBDb250ZXh0IGluc3RhbmNlIHBhcmFtZXRlclxuICAgIGxldCBjb250ZXh0SW1wbGVtZW50YXRpb25LZXkgPSBncmFwaEluc3RhbmNlW0NvbnRleHQucmVmZXJlbmNlLmtleS5nZXR0ZXJdID8gZ3JhcGhJbnN0YW5jZVtDb250ZXh0LnJlZmVyZW5jZS5rZXkuZ2V0dGVyXSgpPy5pbXBsZW1lbnRhdGlvbktleSA6IHt9XG4gICAgLy8gcGFyZW50IGFyZ3VtZW50c1xuICAgIGxldCBwYXJlbnRJbXBsZW1lbnRhdGlvbktleSA9IHBhcmVudFRyYXZlcnNhbEFyZyA/IHBhcmVudFRyYXZlcnNhbEFyZ1swXS5pbXBsZW1lbnRhdGlvbktleSB8fCB7fSA6IHt9XG4gICAgLy8gb3ZlcndyaXRlIChmb3IgYWxsIHN1YnRyYXZlcnNhbHMpIGltcGxlbWVudGF0aW9uIHRocm91Z2ggZGlyZWN0bHkgcGFzc2VkIHBhcmFtZXRlcnMgLSBvdmVyd3JpdGFibGUgdHJhdmVyc2FsIGltcGxlbWVudGF0aW9uIGlnbm9yaW5nIGVhY2ggbm9kZXMgY29uZmlndXJhdGlvbiwgaS5lLiBvdmVyd3JpdGFibGUgb3ZlciBub2RlSW5zdGFuY2Ugb3duIHByb3BlcnR5IGltcGxlbWVudGF0aW9uIGtleXNcbiAgICBpbXBsZW1lbnRhdGlvbktleVxuICAgICAgfD4gKHRhcmdldE9iamVjdCA9PlxuICAgICAgICBPYmplY3QuYXNzaWduKHRhcmdldE9iamVjdCwgcGFyZW50SW1wbGVtZW50YXRpb25LZXksIGltcGxlbWVudGF0aW9uS2V5LCBwYXJhbWV0ZXJJbXBsZW1lbnRhdGlvbktleSB8PiByZW1vdmVVbmRlZmluZWRGcm9tT2JqZWN0LCBjb250ZXh0SW1wbGVtZW50YXRpb25LZXkgfD4gcmVtb3ZlVW5kZWZpbmVkRnJvbU9iamVjdCkpXG4gICAgYXJndW1lbnRzTGlzdFswXS5pbXBsZW1lbnRhdGlvbktleSA9IGltcGxlbWVudGF0aW9uS2V5XG5cbiAgICAvLyBnZXQgaW1wbGVtZW50YXRpb24gZnVuY3Rpb25zXG4gICAgbGV0IGltcGxlbWVudGF0aW9uID0ge1xuICAgICAgZGF0YVByb2Nlc3M6IGdyYXBoSW5zdGFuY2UudHJhdmVyc2FsLnByb2Nlc3NEYXRhW2ltcGxlbWVudGF0aW9uS2V5LnByb2Nlc3NEYXRhXSxcbiAgICAgIGhhbmRsZVByb3BhZ2F0aW9uOiBncmFwaEluc3RhbmNlLnRyYXZlcnNhbC5oYW5kbGVQcm9wYWdhdGlvbltpbXBsZW1lbnRhdGlvbktleS5oYW5kbGVQcm9wYWdhdGlvbl0sXG4gICAgICB0cmF2ZXJzZU5vZGU6IGdyYXBoSW5zdGFuY2UudHJhdmVyc2FsLnRyYXZlcnNlTm9kZVtpbXBsZW1lbnRhdGlvbktleS50cmF2ZXJzZU5vZGVdLFxuICAgICAgdHJhdmVyc2FsSW50ZXJjZXB0aW9uOiBncmFwaEluc3RhbmNlLnRyYXZlcnNhbC50cmF2ZXJzYWxJbnRlcmNlcHRpb25baW1wbGVtZW50YXRpb25LZXkudHJhdmVyc2FsSW50ZXJjZXB0aW9uXSB8fCAoKHsgdGFyZ2V0RnVuY3Rpb24gfSkgPT4gbmV3IFByb3h5KHRhcmdldEZ1bmN0aW9uLCB7fSkpLCAvLyBpbiBjYXNlIG5vIGltcGxlbWVudGF0aW9uIGV4aXN0cyBmb3IgaW50ZXJjZXB0aW5nIHRyYXZlcnNhbCwgdXNlIGFuIGVtcHR5IHByb3h5LlxuICAgICAgYWdncmVnYXRvcjogZ3JhcGhJbnN0YW5jZS50cmF2ZXJzYWwuYWdncmVnYXRvcltpbXBsZW1lbnRhdGlvbktleS5hZ2dyZWdhdG9yXSxcbiAgICAgIGV2YWx1YXRlUG9zaXRpb246IGdyYXBoSW5zdGFuY2UudHJhdmVyc2FsLmV2YWx1YXRlUG9zaXRpb25baW1wbGVtZW50YXRpb25LZXkuZXZhbHVhdGVQb3NpdGlvbl0sXG4gICAgfVxuICAgIGFzc2VydChcbiAgICAgIE9iamVjdC5lbnRyaWVzKGltcGxlbWVudGF0aW9uKS5ldmVyeSgoW2tleSwgdmFsdWVdKSA9PiBCb29sZWFuKHZhbHVlKSksXG4gICAgICAn4oCiIEFsbCBgaW1wbGVtZW50YXRpb25gIGNvbmNlcmV0ZSBmdW5jdGlvbnMgbXVzdCBiZSByZWdpc3RlcmVkLCB0aGUgaW1wbGVtZW50YXRpb25LZXkgcHJvdmlkZWQgZG9lc25gdCBtYXRjaCBhbnkgb2YgdGhlIHJlZ2lzdGVyZWQgaW1wbGVtZW50YWlvbnMuJyxcbiAgICApXG4gICAgLy8gZGVlcCBtZXJnZSBvZiBuZXN0ZWQgcGFyYW1ldGVyIChUT0RPOiB1c2UgdXRpbGl0eSBmdW5jdGlvbiBmcm9tIGRpZmZlcmVudCBtb2R1bGUgdGhhdCBkb2VzIHRoaXMgZnVuY3Rpb24uKVxuICAgIGFyZ3VtZW50c0xpc3QgPSBtZXJnZURlZmF1bHRQYXJhbWV0ZXIoe1xuICAgICAgcGFzc2VkQXJnOiBhcmd1bWVudHNMaXN0LFxuICAgICAgZGVmYXVsdEFyZzogW1xuICAgICAgICB7XG4gICAgICAgICAgaW1wbGVtZW50YXRpb24sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pXG5cbiAgICByZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIHRoaXNBcmcsIGFyZ3VtZW50c0xpc3QpXG4gIH0pXG4gIGFzeW5jIHRyYXZlcnNlKFxuICAgIHtcbiAgICAgIGdyYXBoSW5zdGFuY2UsXG4gICAgICBub2RlSW5zdGFuY2UsXG4gICAgICB0cmF2ZXJzYWxJdGVyYXRvckZlZWQsIC8vIGl0ZXJhdG9yIHByb3ZpZGluZyBub2RlIHBhcmFtZXRlcnMgZm9yIHJlY3Vyc2l2ZSB0cmF2ZXJzYWwgY2FsbHMuXG4gICAgICB0cmF2ZXJzYWxEZXB0aCwgLy8gbGV2ZWwgb2YgcmVjdXJzaW9uIC0gYWxsb3dzIHRvIGlkZW50aWZ5IGVudHJ5cG9pbnQgbGV2ZWwgKHRvcGxldmVsKSB0aGF0IG5lZWRzIHRvIHJldHVybiB0aGUgdmFsdWUgb2YgYWdncmVnYXRvci5cbiAgICAgIHBhdGgsXG4gICAgICBjb25jcmV0ZVRyYXZlcnNhbCwgLy8gaW1wbGVtZW50YXRpb24gcmVnaXN0ZXJlZCBmdW5jdGlvbnNcbiAgICAgIGltcGxlbWVudGF0aW9uS2V5LCAvLyB1c2VkIGJ5IGRlY29yYXRvciB0byByZXRyZWl2ZSBpbXBsZW1lbnRhdGlvbiBmdW5jdGlvbnNcbiAgICAgIGltcGxlbWVudGF0aW9uLCAvLyBpbXBsZW1lbnRhdGlvbiBmdW5jdGlvbnNcbiAgICAgIGFkZGl0aW9uYWxDaGlsZE5vZGUsXG4gICAgICBldmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCksIC8vIGNyZWF0ZSBhbiBldmVudCBlbWl0dGVyIHRvIGNhdGNoIGV2ZW50cyBmcm9tIG5lc3RlZCBub2RlcyBvZiB0aGlzIG5vZGUgZHVyaW5nIHRoZWlyIHRyYXZlcnNhbHMuXG4gICAgICBhZ2dyZWdhdG9yID0gbmV3IChub2RlSW5zdGFuY2U6OmltcGxlbWVudGF0aW9uLmFnZ3JlZ2F0b3IpKCksIC8vIHVzZWQgdG8gYWdncmVnYXRlIHJlc3VsdHMgb2YgbmVzdGVkIG5vZGVzLlxuICAgICAgbm9kZVR5cGUsIC8vIHRoZSB0eXBlIG9mIG5vZGUgdG8gdHJhdmVyc2VcbiAgICAgIGV2YWx1YXRpb24sIC8vIGV2YWx1YXRpb24gb2JqZWN0IHRoYXQgY29udGFpbnMgY29uZmlndXJhdGlvbiByZWxhdGluZyB0byB0cmF2ZXJzZXIgYWN0aW9uIG9uIHRoZSBjdXJyZW50IHBvc2l0aW9uXG4gICAgfToge1xuICAgICAgZ3JhcGhJbnN0YW5jZTogR3JhcGgsXG4gICAgICBub2RlSW5zdGFuY2U6IFN0cmluZyB8IE5vZGUsXG4gICAgICBjb25jcmV0ZVRyYXZlcnNhbDogR3JhcGhUcmF2ZXJzYWwgLyoqIFRPRE86IEN1cnJlbnRseSBpdCBpcyBhbiBvYmplY3QgZGVyaXZlZCBmcm9tIGEgR3JhcGhUcmF2ZXJzYWwgaW5zdGFuY2UgKi8sXG4gICAgICB0cmF2ZXJzYWxEZXB0aDogTnVtYmVyLFxuICAgICAgaW1wbGVtZW50YWlvbjogT2JqZWN0LFxuICAgICAgaW1wbGVtZW50YXRpb25LZXk6IHtcbiAgICAgICAgLy8gdGhlIHRoZSBkZWZhdWx0IHJlZ2lzdGVyZWQgaW1wbGVtZW50YXRpb25zIG9yIGludGVybmFsIG1vZHVsZSBpbXBsZW1lbnRhdGlvbnMuXG4gICAgICAgIHByb2Nlc3NEYXRhOiAncmV0dXJuRGF0YUl0ZW1LZXknIHwgJ3JldHVybktleScgfCAndGltZW91dCcsXG4gICAgICAgIHRyYXZlcnNlTm9kZTogJ2FsbFByb21pc2UnIHwgJ2Nocm9ub2xvZ2ljYWwnIHwgJ3JhY2VGaXJzdFByb21pc2UnLFxuICAgICAgICBhZ2dyZWdhdG9yOiAnQWdncmVnYXRvckFycmF5JyB8ICdDb25kaXRpb25DaGVjaycsXG4gICAgICAgIHRyYXZlcnNhbEludGVyY2VwdGlvbjogJ3Byb2Nlc3NUaGVuVHJhdmVyc2UnIHwgJ2NvbmRpdGlvbkNoZWNrJyxcbiAgICAgIH0sXG4gICAgICBub2RlVHlwZTogJ1N0YWdlJyxcbiAgICAgIGV2YWx1YXRpb246IHtcbiAgICAgICAgcHJvY2VzczogJ2luY2x1ZGUnIHwgJ2V4Y2x1ZGUnLCAvLyBleGVjdXRlICYgaW5jbHVkZSBvciBkb24ndCBleGVjdXRlICYgZXhjbHVkZSBmcm9tIGFnZ3JlZ2F0ZWQgcmVzdWx0cy5cbiAgICAgICAgdHJhdmVyc2U6ICdjb250aW51ZScgfCAnYnJlYWsnLCAvLyB0cmF2ZXJzZSBuZWlnaGJvdXJzIG9yIG5vdC5cbiAgICAgIH0sXG4gICAgfSA9IHt9LFxuICAgIHsgcGFyZW50VHJhdmVyc2FsQXJnIH0gPSB7fSxcbiAgKSB7XG4gICAgZXZhbHVhdGlvbiB8fD0gYXdhaXQgZ3JhcGhJbnN0YW5jZS5ldmFsdWF0ZVBvc2l0aW9uKHsgZXZhbHVhdGlvbiwgbm9kZTogbm9kZUluc3RhbmNlLCBpbXBsZW1lbnRhdGlvbjogbm9kZUluc3RhbmNlOjppbXBsZW1lbnRhdGlvbi5ldmFsdWF0ZVBvc2l0aW9uIH0pXG5cbiAgICAvLyBDb3JlIGZ1bmN0aW9uYWxpdHkgcmVxdWlyZWQgaXMgdG8gdHJhdmVyc2Ugbm9kZXMsIGFueSBhZGRpdGlvbmFsIGlzIGFkZGVkIHRocm91Z2ggaW50ZXJjZXB0aW5nIHRoZSB0cmF2ZXJzYWwuXG4gICAgdHJhdmVyc2FsSXRlcmF0b3JGZWVkIHx8PSBncmFwaEluc3RhbmNlOjpncmFwaEluc3RhbmNlLnRyYXZlcnNlTm9kZSh7XG4gICAgICBub2RlOiBub2RlSW5zdGFuY2UsXG4gICAgICBpbXBsZW1lbnRhdGlvbjogaW1wbGVtZW50YXRpb24udHJhdmVyc2VOb2RlLFxuICAgICAgaGFuZGxlUHJvcGFnYXRpb25JbXBsZW1lbnRhdGlvbjogaW1wbGVtZW50YXRpb24uaGFuZGxlUHJvcGFnYXRpb24sXG4gICAgICBhZGRpdGlvbmFsQ2hpbGROb2RlLFxuICAgIH0pXG5cbiAgICBsZXQgZGF0YVByb2Nlc3NDYWxsYmFjayA9IG5leHRQcm9jZXNzRGF0YSA9PlxuICAgICAgZ3JhcGhJbnN0YW5jZTo6Z3JhcGhJbnN0YW5jZS5kYXRhUHJvY2Vzcyh7IG5vZGU6IG5vZGVJbnN0YW5jZSwgbmV4dFByb2Nlc3NEYXRhLCBldmFsdWF0aW9uLCBhZ2dyZWdhdG9yLCBpbXBsZW1lbnRhdGlvbjogaW1wbGVtZW50YXRpb24uZGF0YVByb2Nlc3MsIGdyYXBoSW5zdGFuY2UgfSlcblxuICAgIGxldCBwcm94eWlmeSA9IHRhcmdldCA9PiBncmFwaEluc3RhbmNlOjppbXBsZW1lbnRhdGlvbi50cmF2ZXJzYWxJbnRlcmNlcHRpb24oeyB0YXJnZXRGdW5jdGlvbjogdGFyZ2V0LCBhZ2dyZWdhdG9yLCBkYXRhUHJvY2Vzc0NhbGxiYWNrIH0pXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IChncmFwaEluc3RhbmNlOjpncmFwaEluc3RhbmNlLnJlY3Vyc2l2ZUl0ZXJhdGlvbiB8PiBwcm94eWlmeSkoe1xuICAgICAgdHJhdmVyc2FsSXRlcmF0b3JGZWVkLFxuICAgICAgbm9kZUluc3RhbmNlLFxuICAgICAgdHJhdmVyc2FsRGVwdGgsXG4gICAgICBldmVudEVtaXR0ZXIsXG4gICAgICBldmFsdWF0aW9uLFxuICAgICAgYWRkaXRpb25hbENoaWxkTm9kZSxcbiAgICAgIHBhcmVudFRyYXZlcnNhbEFyZzogYXJndW1lbnRzLFxuICAgIH0pXG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH0sXG5cbiAgLy9cbiAgLyoqXG4gICAqIE5vZGUncyBpbmNsdWRlL2V4Y2x1ZGUgZXZhbHVhdGlvbiAtIGV2YWx1YXRlIHdoZXRoZXIgb3Igbm90IGEgbm9kZSB3aG91bGQgYmUgaW5jbHVkZWQgaW4gdGhlIG5vZGUgZmVlZCBhbmQgc3Vic2VxdWVudGx5IGluIHRoZSB0cmF2ZXJzYWwuXG4gICAqIGNvbnRpbnVlIGNoaWxkIG5vZGVzIHRyYXZlcnNhbCBvciBicmVhayB0cmF2ZXJzYWwuXG4gICAqL1xuICBldmFsdWF0ZVBvc2l0aW9uOiBhc3luYyBmdW5jdGlvbih7IGV2YWx1YXRpb24sIG5vZGUsIGltcGxlbWVudGF0aW9uLCBncmFwaEluc3RhbmNlID0gdGhpcyB9KSB7XG4gICAgLy8gZGVmYXVsdCB2YWx1ZXNcbiAgICBldmFsdWF0aW9uID0gbmV3IEV2YWx1YXRvcih7IHByb3BhZ2F0aW9uOiBldmFsdWF0aW9uT3B0aW9uLnByb3BhZ2F0aW9uLmNvbnRpbnVlLCBhZ2dyZWdhdGlvbjogZXZhbHVhdGlvbk9wdGlvbi5hZ2dyZWdhdGlvbi5pbmNsdWRlIH0pIC8vIE5vdGU6IEFkZGl0aW9uYWwgZGVmYXVsdCB2YWx1ZXMgZm9yIEV2YWx1YXRvciBjb25zdHJ1Y3RvciBhcmUgc2V0IGFib3ZlIGR1cmluZyBpbml0aWFsaXphdGlvbiBvZiBFdmFsdWF0b3Igc3RhdGljIGNsYXNzLlxuICAgIC8vIG1hbmlwdWxhdGUgZXZhbHVhdGlvbiBjb25maWdcbiAgICBhd2FpdCBpbXBsZW1lbnRhdGlvbih7IGV2YWx1YXRpb24sIG5vZGUsIGdyYXBoSW5zdGFuY2UgfSlcbiAgICByZXR1cm4gZXZhbHVhdGlvblxuICB9LFxuXG4gIC8qKlxuICAgKiBUaGUgcHVycG9zZSBvZiB0aGlzIGZ1bmN0aW9uIGlzIHRvIGZpbmQgJiB5aWVsZCBuZXh0IG5vZGVzLlxuICAgKiBAeWllbGQgbm9kZSBmZWVkXG4gICAqKi9cbiAgdHJhdmVyc2VOb2RlOiBhc3luYyBmdW5jdGlvbiooeyBub2RlLCBhZGRpdGlvbmFsQ2hpbGROb2RlLCBpbXBsZW1lbnRhdGlvbiwgaGFuZGxlUHJvcGFnYXRpb25JbXBsZW1lbnRhdGlvbiwgZ3JhcGhJbnN0YW5jZSA9IHRoaXMgfSkge1xuICAgIGxldCB0cmF2ZXJzYWxJdGVyYXRvckZlZWQgPSBhd2FpdCBub2RlOjppbXBsZW1lbnRhdGlvbih7IG5vZGUsIGFkZGl0aW9uYWxDaGlsZE5vZGUsIGdyYXBoSW5zdGFuY2UgfSlcbiAgICBhc3luYyBmdW5jdGlvbiogdHJhcEFzeW5jSXRlcmF0b3IoaXRlcmF0b3IpIHtcbiAgICAgIGZvciBhd2FpdCAobGV0IHRyYXZlcnNhbEl0ZXJhdGlvbiBvZiBpdGVyYXRvcikge1xuICAgICAgICBsZXQgX2hhbmRsZVByb3BhZ2F0aW9uSW1wbGVtZW50YXRpb25cbiAgICAgICAgaWYgKHRyYXZlcnNhbEl0ZXJhdGlvbi50cmF2ZXJzYWxDb25maWcuaGFuZGxlUHJvcGFnYXRpb25JbXBsZW1lbnRhdGlvbikge1xuICAgICAgICAgIF9oYW5kbGVQcm9wYWdhdGlvbkltcGxlbWVudGF0aW9uID0gZ3JhcGhJbnN0YW5jZS50cmF2ZXJzYWwuaGFuZGxlUHJvcGFnYXRpb25bdHJhdmVyc2FsSXRlcmF0aW9uLnRyYXZlcnNhbENvbmZpZy5oYW5kbGVQcm9wYWdhdGlvbkltcGxlbWVudGF0aW9uXVxuICAgICAgICAgIGFzc2VydChfaGFuZGxlUHJvcGFnYXRpb25JbXBsZW1lbnRhdGlvbiwgYOKAoiBcIiR7dHJhdmVyc2FsSXRlcmF0aW9uLnRyYXZlcnNhbENvbmZpZy5oYW5kbGVQcm9wYWdhdGlvbkltcGxlbWVudGF0aW9ufVwiIGltcGxlbWVudGF0aW9uIGlzbid0IHJlZ2lzdGVyZWQgaW4gdHJhdmVyc2FsIGNvbmNyZXRlIGluc3RhbmNlLmApXG4gICAgICAgIH0gZWxzZSBfaGFuZGxlUHJvcGFnYXRpb25JbXBsZW1lbnRhdGlvbiA9IGhhbmRsZVByb3BhZ2F0aW9uSW1wbGVtZW50YXRpb25cbiAgICAgICAgbGV0IG5leHRJdGVyYXRvciA9IGdyYXBoSW5zdGFuY2U6OmdyYXBoSW5zdGFuY2UuaGFuZGxlUHJvcGFnYXRpb24oeyBub2RlSXRlcmF0b3JGZWVkOiB0cmF2ZXJzYWxJdGVyYXRpb24ubmV4dEl0ZXJhdG9yLCBpbXBsZW1lbnRhdGlvbjogbm9kZTo6X2hhbmRsZVByb3BhZ2F0aW9uSW1wbGVtZW50YXRpb24gfSlcbiAgICAgICAgeWllbGQgeyBuZXh0SXRlcmF0b3IsIGZvcmtOb2RlOiB0cmF2ZXJzYWxJdGVyYXRpb24uZm9ya05vZGUgfVxuICAgICAgfVxuICAgIH1cbiAgICB5aWVsZCogdHJhcEFzeW5jSXRlcmF0b3IodHJhdmVyc2FsSXRlcmF0b3JGZWVkKVxuICB9LFxuXG4gIC8qKlxuICAgKiBIYW5kbGVzIHRoZSBncmFwaCB0cmF2ZXJzYWwgcHJvcGFnYXRpb24gb3JkZXJcbiAgICogQHlpZWxkcyBhIHRyYXZlcnNhbCBjb25maWd1cmF0aW9uIGZlZWQvaXRlcmF0b3JcbiAgICogQHJldHVybiByZXN1bHRzIGFycmF5XG4gICAqKi9cbiAgaGFuZGxlUHJvcGFnYXRpb246IGFzeW5jIGZ1bmN0aW9uKih7IG5vZGVJdGVyYXRvckZlZWQsIGltcGxlbWVudGF0aW9uIC8qKiBDb250cm9scyB0aGUgaXRlcmF0aW9uIG92ZXIgbm9kZXMgYW5kIGV4ZWN1dGlvbiBhcnJhbmdlbWVudC4gKi8sIGdyYXBoSW5zdGFuY2UgPSB0aGlzIH0pIHtcbiAgICBsZXQgeyBldmVudEVtaXR0ZXJDYWxsYmFjazogZW1pdCB9ID0gZnVuY3Rpb24uc2VudFxuICAgIGxldCB0cmF2ZXJzYWxJdGVyYXRvckZlZWQgPSBpbXBsZW1lbnRhdGlvbih7IG5vZGVJdGVyYXRvckZlZWQsIGVtaXQgfSkgLy8gcGFzcyBpdGVyYXRvciB0byBpbXBsZW1lbnRhdGlvbiBhbmQgcHJvcGFnYXRlIGJhY2sgKHRocm91Z2ggcmV0dXJuIHN0YXRlbWVudCkgdGhlIHJlc3VsdHMgb2YgdGhlIG5vZGUgcHJvbWlzZXMgYWZ0ZXIgY29tcGxldGlvblxuICAgIGFzeW5jIGZ1bmN0aW9uKiB0cmFwQXN5bmNJdGVyYXRvcihpdGVyYXRvcikge1xuICAgICAgbGV0IGl0ZXJhdG9yUmVzdWx0ID0gYXdhaXQgaXRlcmF0b3IubmV4dCgpXG4gICAgICB3aGlsZSAoIWl0ZXJhdG9yUmVzdWx0LmRvbmUpIHtcbiAgICAgICAgbGV0IHRyYXZlcnNhbENvbmZpZyA9IGl0ZXJhdG9yUmVzdWx0LnZhbHVlXG4gICAgICAgIHlpZWxkIHRyYXZlcnNhbENvbmZpZ1xuICAgICAgICBsZXQgeyBwcm9taXNlIH0gPSBmdW5jdGlvbi5zZW50XG4gICAgICAgIGl0ZXJhdG9yUmVzdWx0ID0gYXdhaXQgaXRlcmF0b3IubmV4dCh7IHByb21pc2UgfSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYXRvclJlc3VsdC52YWx1ZVxuICAgIH1cbiAgICByZXR1cm4geWllbGQqIHRyYXBBc3luY0l0ZXJhdG9yKHRyYXZlcnNhbEl0ZXJhdG9yRmVlZClcbiAgfSxcblxuICAvKipcbiAgICogQ29udHJvbHMgZXhlY3V0aW9uIG9mIG5vZGUgdHJhdmVyc2FscyAmIEhhbmRzIG92ZXIgY29udHJvbCB0byBpbXBsZW1lbnRhdGlvbjpcbiAgICogIDEuIEFjY2VwdHMgbmV3IG5vZGVzIGZyb20gaW1wbGVtZW50aW5nIGZ1bmN0aW9uLlxuICAgKiAgMi4gcmV0dXJucyBiYWNrIHRvIHRoZSBpbXBsZW1lbnRpbmcgZnVuY3Rpb24gYSBwcm9taXNlLCBoYW5kaW5nIGNvbnRyb2wgb2YgZmxvdyBhbmQgYXJyYWdlbWVudCBvZiBydW5uaW5nIHRyYXZlcnNhbHMuXG4gICAqL1xuICByZWN1cnNpdmVJdGVyYXRpb246IGFzeW5jIGZ1bmN0aW9uKih7XG4gICAgdHJhdmVyc2FsSXRlcmF0b3JGZWVkIC8qKkZlZWRpbmcgaXRlcmF0b3IgdGhhdCB3aWxsIGFjY2VwdCBub2RlIHBhcmFtZXRlcnMgZm9yIHRyYXZlcnNhbHMqLyxcbiAgICBncmFwaEluc3RhbmNlID0gdGhpcyxcbiAgICByZWN1cnNpdmVDYWxsYmFjayA9IGdyYXBoSW5zdGFuY2U6OmdyYXBoSW5zdGFuY2UudHJhdmVyc2UsXG4gICAgdHJhdmVyc2FsRGVwdGgsXG4gICAgZXZlbnRFbWl0dGVyLFxuICAgIGV2YWx1YXRpb24sXG4gICAgYWRkaXRpb25hbENoaWxkTm9kZSxcbiAgICBwYXJlbnRUcmF2ZXJzYWxBcmcsXG4gIH06IHtcbiAgICBldmVudEVtaXR0ZXI6IEV2ZW50LFxuICB9KSB7XG4gICAgaWYgKCFldmFsdWF0aW9uLnNob3VsZENvbnRpbnVlKCkpIHJldHVybiAvLyBza2lwIHRyYXZlcnNhbFxuICAgIGxldCBldmVudEVtaXR0ZXJDYWxsYmFjayA9ICguLi5hcmdzKSA9PiBldmVudEVtaXR0ZXIuZW1pdCgnbm9kZVRyYXZlcnNhbENvbXBsZXRlZCcsIC4uLmFyZ3MpXG4gICAgdHJhdmVyc2FsRGVwdGggKz0gMSAvLyBpbmNyZWFzZSB0cmF2ZXJzYWwgZGVwdGhcbiAgICBmb3IgYXdhaXQgKGxldCB0cmF2ZXJzYWxJdGVyYXRpb24gb2YgdHJhdmVyc2FsSXRlcmF0b3JGZWVkKSB7XG4gICAgICBsZXQgbiA9IHsgaXRlcmF0b3I6IHRyYXZlcnNhbEl0ZXJhdGlvbi5uZXh0SXRlcmF0b3IsIHJlc3VsdDogYXdhaXQgdHJhdmVyc2FsSXRlcmF0aW9uLm5leHRJdGVyYXRvci5uZXh0KHsgZXZlbnRFbWl0dGVyQ2FsbGJhY2s6IGV2ZW50RW1pdHRlckNhbGxiYWNrIH0pIH1cbiAgICAgIHdoaWxlICghbi5yZXN1bHQuZG9uZSkge1xuICAgICAgICBsZXQgbmV4dE5vZGUgPSBuLnJlc3VsdC52YWx1ZS5ub2RlXG4gICAgICAgIC8vIPCflIEgcmVjdXJzaW9uIGNhbGxcbiAgICAgICAgbGV0IG5leHRDYWxsQXJndW1lbnQgPSBbT2JqZWN0LmFzc2lnbih7IG5vZGVJbnN0YW5jZTogbmV4dE5vZGUsIHRyYXZlcnNhbERlcHRoLCBhZGRpdGlvbmFsQ2hpbGROb2RlIH0pLCB7IHBhcmVudFRyYXZlcnNhbEFyZyB9XVxuICAgICAgICBsZXQgcHJvbWlzZSA9IHJlY3Vyc2l2ZUNhbGxiYWNrKC4uLm5leHRDYWxsQXJndW1lbnQpXG4gICAgICAgIG4ucmVzdWx0ID0gYXdhaXQgbi5pdGVyYXRvci5uZXh0KHsgcHJvbWlzZSB9KVxuICAgICAgfVxuICAgICAgLy8gbGFzdCBub2RlIGl0ZXJhdG9yIGZlZWQgc2hvdWxkIGJlIGFuIGFycmF5IG9mIHJlc29sdmVkIG5vZGUgcHJvbWlzZXMgdGhhdCB3aWxsIGJlIGZvcndhcmRlZCB0aHJvdWdoIHRoaXMgZnVuY3Rpb25cbiAgICAgIGxldCBwb3J0VHJhdmVyc2FsUmVzdWx0ID0geyBjb25maWc6IHsgbmFtZTogdHJhdmVyc2FsSXRlcmF0aW9uLmZvcmtOb2RlLnByb3BlcnRpZXMubmFtZSB9LCByZXN1bHQ6IG4ucmVzdWx0LnZhbHVlIH1cbiAgICAgIHlpZWxkIHBvcnRUcmF2ZXJzYWxSZXN1bHQgLy8gZm9yd2FyZCBhcnJheSBvZiByZXNvbHZlZCByZXN1bHRzXG4gICAgfVxuICB9LFxuXG4gIGRhdGFQcm9jZXNzOiBhc3luYyBmdW5jdGlvbih7IG5vZGUsIG5leHRQcm9jZXNzRGF0YSwgYWdncmVnYXRvciwgZXZhbHVhdGlvbiwgaW1wbGVtZW50YXRpb24sIGdyYXBoSW5zdGFuY2UgfSkge1xuICAgIGlmICghZXZhbHVhdGlvbi5zaG91bGRFeGVjdXRlUHJvY2VzcygpKSByZXR1cm4gbnVsbFxuICAgIGxldCBleGVjdXRlQ29ubmVjdGlvbkFycmF5ID0gYXdhaXQgZ3JhcGhJbnN0YW5jZS5kYXRhYmFzZS5nZXROb2RlQ29ubmVjdGlvbih7IGRpcmVjdGlvbjogJ291dGdvaW5nJywgbm9kZUlEOiBub2RlLmlkZW50aXR5LCBjb25uZWN0aW9uVHlwZTogY29ubmVjdGlvblR5cGUuZXhlY3V0ZSB9KVxuICAgIGFzc2VydChleGVjdXRlQ29ubmVjdGlvbkFycmF5LmV2ZXJ5KG4gPT4gbi5kZXN0aW5hdGlvbi5sYWJlbHMuaW5jbHVkZXMobm9kZUxhYmVsLnByb2Nlc3MpKSwgYOKAoiBVbnN1cHBvcnRlZCBub2RlIHR5cGUgZm9yIGEgRVhFQ1VURSBjb25uZWN0aW9uLmApIC8vIHZlcmlmeSBub2RlIHR5cGVcbiAgICBsZXQgcmVzb3VyY2VDb25uZWN0aW9uQXJyYXkgPSBhd2FpdCBncmFwaEluc3RhbmNlLmRhdGFiYXNlLmdldE5vZGVDb25uZWN0aW9uKHsgZGlyZWN0aW9uOiAnaW5jb21pbmcnLCBub2RlSUQ6IG5vZGUuaWRlbnRpdHksIGNvbm5lY3Rpb25UeXBlOiBjb25uZWN0aW9uVHlwZS5yZXNvdXJjZSB9KVxuICAgIGFzc2VydChyZXNvdXJjZUNvbm5lY3Rpb25BcnJheS5ldmVyeShuID0+IG4uZGVzdGluYXRpb24ubGFiZWxzLmluY2x1ZGVzKG5vZGVMYWJlbC5maWxlKSksIGDigKIgVW5zdXBwb3J0ZWQgbm9kZSB0eXBlIGZvciBhIFJFU09VUkNFIGNvbm5lY3Rpb24uYCkgLy8gdmVyaWZ5IG5vZGUgdHlwZVxuICAgIGlmIChleGVjdXRlQ29ubmVjdGlvbkFycmF5Lmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbCAvLyBza2lwIGlmIG5vIGV4ZWN1dGUgY29ubmVjdGlvblxuXG4gICAgbGV0IHJlc291cmNlTm9kZVxuICAgIGlmIChyZXNvdXJjZUNvbm5lY3Rpb25BcnJheS5sZW5ndGggPiAwKSByZXNvdXJjZU5vZGUgPSByZXNvdXJjZUNvbm5lY3Rpb25BcnJheVswXS5kZXN0aW5hdGlvblxuXG4gICAgbGV0IGV4ZWN1dGVDb25uZWN0aW9uID0gZXhlY3V0ZUNvbm5lY3Rpb25BcnJheVswXS5jb25uZWN0aW9uXG4gICAgbGV0IGRhdGFQcm9jZXNzSW1wbGVtZW50YXRpb25cbiAgICBpZiAoZXhlY3V0ZUNvbm5lY3Rpb24ucHJvcGVydGllcy5wcm9jZXNzRGF0YUltcGxlbWVudGF0aW9uKSB7XG4gICAgICBkYXRhUHJvY2Vzc0ltcGxlbWVudGF0aW9uID0gZ3JhcGhJbnN0YW5jZS50cmF2ZXJzYWwucHJvY2Vzc0RhdGFbZXhlY3V0ZUNvbm5lY3Rpb24ucHJvcGVydGllcy5wcm9jZXNzRGF0YUltcGxlbWVudGF0aW9uXVxuICAgICAgYXNzZXJ0KGRhdGFQcm9jZXNzSW1wbGVtZW50YXRpb24sIGDigKIgXCIke2V4ZWN1dGVDb25uZWN0aW9uLnByb3BlcnRpZXMucHJvY2Vzc0RhdGFJbXBsZW1lbnRhdGlvbn1cIiBpbXBsZW1lbnRhdGlvbiBpc24ndCByZWdpc3RlcmVkIGluIHRyYXZlcnNhbCBjb25jcmV0ZSBpbnN0YW5jZS5gKVxuICAgIH0gZWxzZSBkYXRhUHJvY2Vzc0ltcGxlbWVudGF0aW9uID0gaW1wbGVtZW50YXRpb25cblxuICAgIGxldCBleGVjdXRlTm9kZSA9IGV4ZWN1dGVDb25uZWN0aW9uQXJyYXlbMF0uZGVzdGluYXRpb25cbiAgICAvLyBFeGVjdXRlIG5vZGUgZGF0YUl0ZW1cbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgbm9kZTo6ZGF0YVByb2Nlc3NJbXBsZW1lbnRhdGlvbih7IG5vZGU6IGV4ZWN1dGVOb2RlLCByZXNvdXJjZU5vZGUgfSlcblxuICAgIGlmIChldmFsdWF0aW9uLnNob3VsZEluY2x1ZGVSZXN1bHQoKSkgYWdncmVnYXRvci5hZGQocmVzdWx0KVxuICAgIHJldHVybiByZXN1bHRcbiAgfSxcbn0pXG5cbi8qXG4gICBfICAgICAgIF8gXyAgIF8gICAgICAgXyBfICAgICAgICAgXG4gIChfKV8gX18gKF8pIHxfKF8pIF9fIF98IChfKV9fX19fX18gXG4gIHwgfCAnXyBcXHwgfCBfX3wgfC8gX2AgfCB8IHxfICAvIF8gXFxcbiAgfCB8IHwgfCB8IHwgfF98IHwgKF98IHwgfCB8LyAvICBfXy9cbiAgfF98X3wgfF98X3xcXF9ffF98XFxfXyxffF98Xy9fX19cXF9fX3xcbiovXG5Qcm90b3R5cGU6OlByb3RvdHlwZVtDb25zdHJ1Y3RhYmxlLnJlZmVyZW5jZS5pbml0aWFsaXplLmZ1bmN0aW9uYWxpdHldLnNldHRlcih7XG4gIFtFbnRpdHkucmVmZXJlbmNlLmtleS5jb25jZXJldGVCZWhhdmlvcl0oeyB0YXJnZXRJbnN0YW5jZSwgY29uY2VyZXRlQmVoYXZpb3JMaXN0IH0gPSB7fSwgcHJldmlvdXNSZXN1bHQpIHt9LFxufSlcblxuLypcbiAgICAgICAgICAgICAgICAgICAgICAgXyAgICAgICAgICAgICAgICAgICBfICAgICAgICAgICAgIFxuICAgIF9fXyBfX18gIF8gX18gIF9fX3wgfF8gXyBfXyBfICAgXyAgX19ffCB8XyBfX18gIF8gX18gXG4gICAvIF9fLyBfIFxcfCAnXyBcXC8gX198IF9ffCAnX198IHwgfCB8LyBfX3wgX18vIF8gXFx8ICdfX3xcbiAgfCAoX3wgKF8pIHwgfCB8IFxcX18gXFwgfF98IHwgIHwgfF98IHwgKF9ffCB8fCAoXykgfCB8ICAgXG4gICBcXF9fX1xcX19fL3xffCB8X3xfX18vXFxfX3xffCAgIFxcX18sX3xcXF9fX3xcXF9fXFxfX18vfF98ICAgXG4qL1xuUHJvdG90eXBlOjpQcm90b3R5cGVbQ29uc3RydWN0YWJsZS5yZWZlcmVuY2UuY29uc3RydWN0b3IuZnVuY3Rpb25hbGl0eV0uc2V0dGVyKHtcbiAgLyoqXG4gICAqIEdyYXBoIHdpbGwgY29udGFpbiB0aGUgcHJvdG90eXBlIGNoYWluIHRvIGluc3RhbGwgb24gdGhlIGluc3RhbmNlcyAocHJldmlvdXNseSAnY2xhc3NlcyBoaWVyYXJjaHkgY29ubmVjdGlvbnNgKVxuICAgKiAxLiBjb25maWd1cmVkQ29uc3RydWN0YWJsZTEgPSBHcmFwaCg8cGx1Z2lucz4pXG4gICAqIDIuIGNvbmZpZ3VyZWRDb25zdHJ1Y3RhYmxlMiA9IGNvbmZpZ3VyZWRDb25zdHJ1Y3RhYmxlMSg8Y29udGV4dD4pXG4gICAqIDMuIG5ldyBjb25maWd1cmVkQ29uc3RydWN0YWJsZTIoPGluc3RhbmNlIGRhdGE+KSAvLyBjcmVhdGVzIGluc3RhbmNlXG4gICAqIDQuIHRyYXZlcnNlIGdyYXBoOiBlLmcuIGluc3RhbmNlLnRyYXZlcnNlR3JhcGgoKVxuICAgKi9cbiAgW1JlZmVyZW5jZS5rZXkuY29uc3RydWN0b3JdKHtcbiAgICAvLyBDb25jZXJldGUgYmVoYXZpb3JzIC8gaW1wbGVtZW50YWlvbnNcbiAgICAvLyBjYWNoZSxcbiAgICBkYXRhYmFzZSxcbiAgICB0cmF2ZXJzYWwsXG4gICAgLy8gYWRkaXRpb25hbCBiZWhhdmlvcnNcbiAgICBjb25jcmV0ZUJlaGF2aW9yTGlzdCA9IFtdLFxuICAgIGRhdGEsIC8vIGRhdGEgdG8gYmUgbWVyZ2VkIGludG8gdGhlIGluc3RhbmNlXG4gICAgY2FsbGVyQ2xhc3MgPSB0aGlzLFxuICAgIG1vZGUgPSAnYXBwbGljYXRpb25Jbk1lbW9yeScgfHwgJ2RhdGFiYXNlSW5NZW1vcnknLFxuICB9OiB7XG4gICAgY2FjaGU6IENhY2hlLFxuICAgIGRhdGFiYXNlOiBEYXRhYmFzZSxcbiAgICB0cmF2ZXJzYWw6IEdyYXBoVHJhdmVyc2FsLFxuICAgIGNvbmNlcmV0ZUJlaGF2aW9yOiBMaXN0LFxuICB9KSB7XG4gICAgYXNzZXJ0KGRhdGFiYXNlLCAn4oCiIERhdGFiYXNlIGNvbmNyZXRlIGJlaGF2aW9yIG11c3QgYmUgcGFzc2VkLicpXG4gICAgYXNzZXJ0KHRyYXZlcnNhbCwgJ+KAoiB0cmF2ZXJzYWwgY29uY3JldGUgYmVoYXZpb3IgbXVzdCBiZSBwYXNzZWQuJylcbiAgICAvLyBjYWNoZSB8fD0gbmV3IENhY2hlLmNsaWVudEludGVyZmFjZSh7IGdyb3VwS2V5QXJyYXk6IFsnbm9kZScsICdjb25uZWN0aW9uJ10gfSlcblxuICAgIGxldCBpbnN0YW5jZSA9IGNhbGxlckNsYXNzOjpDb25zdHJ1Y3RhYmxlW0NvbnN0cnVjdGFibGUucmVmZXJlbmNlLmNvbnN0cnVjdG9yLmZ1bmN0aW9uYWxpdHldLnN3aXRjaCh7IGltcGxlbWVudGF0aW9uS2V5OiBFbnRpdHkucmVmZXJlbmNlLmtleS5jb25jZXJldGVCZWhhdmlvciB9KSh7XG4gICAgICBjb25jcmV0ZUJlaGF2aW9yTGlzdDogWy4uLmNvbmNyZXRlQmVoYXZpb3JMaXN0LCAvKmNhY2hlLCovIGRhdGFiYXNlLCB0cmF2ZXJzYWxdLFxuICAgICAgZGF0YSxcbiAgICB9KVxuICAgIC8vIGV4cG9zZSBmdW5jdGlvbmFsaXR5IGZvciBkaXJlY3Qgc2ltcGxpZmllZCBhY2Nlc3M6XG4gICAgbGV0IGNvbmNlcmV0ZURhdGFiYXNlID0gaW5zdGFuY2VbRW50aXR5LnJlZmVyZW5jZS5nZXRJbnN0YW5jZU9mXShEYXRhYmFzZSlcbiAgICBpbnN0YW5jZS5kYXRhYmFzZSA9IGNvbmNlcmV0ZURhdGFiYXNlW0RhdGFiYXNlLnJlZmVyZW5jZS5rZXkuZ2V0dGVyXSgpXG4gICAgbGV0IGNvbmNyZXRlVHJhdmVyc2FsID0gaW5zdGFuY2VbRW50aXR5LnJlZmVyZW5jZS5nZXRJbnN0YW5jZU9mXShHcmFwaFRyYXZlcnNhbClcbiAgICBpbnN0YW5jZS50cmF2ZXJzYWwgPSBjb25jcmV0ZVRyYXZlcnNhbFtJbXBsZW1lbnRhdGlvbk1hbmFnZW1lbnQucmVmZXJlbmNlLmtleS5nZXR0ZXJdKClcblxuICAgIC8vIGNvbmZpZ3VyZSBHcmFwaCBlbGVtZW50IGNsYXNzZXNcbiAgICAvLyBpbnN0YW5jZS5jb25maWd1cmVkTm9kZSA9IE5vZGUuY2xpZW50SW50ZXJmYWNlKHsgcGFyYW1ldGVyOiBbeyBjb25jcmV0ZUJlaGF2aW9yTGlzdDogW10gfV0gfSlcbiAgICAvLyBpbnN0YW5jZS5jb25maWd1cmVkQ29ubmVjdGlvbiA9IENvbm5lY3Rpb24uY2xpZW50SW50ZXJmYWNlKHsgcGFyYW1ldGVyOiBbeyBjb25jZXJldGVCZWhhdmlvcjogW10gfV0gfSlcblxuICAgIHJldHVybiBpbnN0YW5jZVxuICB9LFxufSlcblxuLypcbiAgICAgICAgXyBfICAgICAgICAgICAgXyAgIF9fXyAgICAgICBfICAgICAgICAgICAgIF9fICAgICAgICAgICAgICAgIFxuICAgIF9fX3wgKF8pIF9fXyBfIF9fIHwgfF98XyBffF8gX18gfCB8XyBfX18gXyBfXyAvIF98IF9fIF8gIF9fXyBfX18gXG4gICAvIF9ffCB8IHwvIF8gXFwgJ18gXFx8IF9ffHwgfHwgJ18gXFx8IF9fLyBfIFxcICdfX3wgfF8gLyBfYCB8LyBfXy8gXyBcXFxuICB8IChfX3wgfCB8ICBfXy8gfCB8IHwgfF8gfCB8fCB8IHwgfCB8fCAgX18vIHwgIHwgIF98IChffCB8IChffCAgX18vXG4gICBcXF9fX3xffF98XFxfX198X3wgfF98XFxfX3xfX198X3wgfF98XFxfX1xcX19ffF98ICB8X3wgIFxcX18sX3xcXF9fX1xcX19ffFxuKi9cbkdyYXBoLmNsaWVudEludGVyZmFjZSA9IEdyYXBoOjpQcm90b3R5cGVbQ29uc3RydWN0YWJsZS5yZWZlcmVuY2UuY2xpZW50SW50ZXJmYWNlLmZ1bmN0aW9uYWxpdHldLnN3aXRjaCh7XG4gIGltcGxlbWVudGF0aW9uS2V5OiBFbnRpdHkucmVmZXJlbmNlLmtleS5pbnN0YW5jZURlbGVnYXRpbmdUb0VudGl0eUluc3RhbmNlUHJvdG90eXBlLFxufSkoe1xuICBjb25zdHJ1Y3RvckltcGxlbWVudGF0aW9uOiBSZWZlcmVuY2Uua2V5LmNvbnN0cnVjdG9yLFxuICBjbGllbnRJbnRlcmZhY2VJbnRlcmNlcHRDYWxsYmFjazogZmFsc2UsXG59KVxuIl19