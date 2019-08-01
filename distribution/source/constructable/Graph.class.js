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
var _graphSchemeReference = require("../graphSchemeReference.js");
var _boltCypherModelAdapter = require("../implementationPlugin/databaseModelAdapter/boltCypherModelAdapter.js");
var _defaultImplementation = require("../implementationPlugin/graphTraversalImplementation/defaultImplementation.js");var _dec, _dec2, _dec3, _obj;const Evaluator = (0, _EvaluatorClass.EvaluatorFunction)();









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
    if (!parameter)
    return;

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


  let contextImplementationKey = (graphInstance[_ContextClass.Context.reference.key.getter] ? (_graphInstance$Contex = graphInstance[_ContextClass.Context.reference.key.getter]()) === null || _graphInstance$Contex === void 0 ? void 0 : _graphInstance$Contex.implementationKey : {}) || {};

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
}), (_obj = { async load({ graphData, graphInstance = this } = {}) {(0, _assert.default)(graphData.node && graphData.edge, `• Graph data object must contain node & edge arrays.`);return await graphInstance.database.loadGraphData({ nodeEntryData: graphData.node, connectionEntryData: graphData.edge });}, async print({ graphInstance = this } = {}) {console.log(`______ Graph elements: ____________________`);let count = await graphInstance.count();let allNode = await graphInstance.database.getAllNode();let allEdge = await graphInstance.database.getAllEdge();console.log(`#Vertex = ${count.node}`);for (let node of allNode) {console.log(node.identity);}console.log(`\n#Edge = ${count.connection}`);for (let edge of allEdge) {console.log(`${edge.start} --> ${edge.end}`);}console.log(`___________________________________________`);}, async count({ graphInstance = this } = {}) {return { node: await graphInstance.database.countNode(), connection: await graphInstance.database.countEdge() };}, async laodSubgraphTemplateParameter({ node, graphInstance = this }) {let rootRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: node.identity, connectionType: _graphSchemeReference.connectionType.root });(0, _assert.default)(rootRelationshipArray.every(n => n.destination.labels.includes(_graphSchemeReference.nodeLabel.stage)), `• Unsupported node type for a ROOT connection.`);let extendRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: node.identity, connectionType: _graphSchemeReference.connectionType.extend });(0, _assert.default)(extendRelationshipArray.every(n => n.destination.labels.includes(_graphSchemeReference.nodeLabel.subgraphTemplate)), `• Unsupported node type for a EXTEND connection.`);let configureRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'incoming', nodeID: node.identity, connectionType: _graphSchemeReference.connectionType.configure });(0, _assert.default)(configureRelationshipArray.every(n => n.destination.labels.includes(_graphSchemeReference.nodeLabel.configuration)), `• Unsupported node type for a EXTEND connection.`);let rootNode,traversalConfiguration = {},additionalChildNode = [];if (configureRelationshipArray.length > 0) {function extractTraversalConfigProperty(propertyObject) {return Object.entries(propertyObject).reduce((accumulator, [key, value]) => {if (_GraphTraversalClass.traversalOption.includes(key)) accumulator[key] = value;return accumulator;}, {});}let configureNode = configureRelationshipArray[0].destination;traversalConfiguration = extractTraversalConfigProperty(configureNode.properties);}let insertRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'incoming', nodeID: node.identity, connectionType: _graphSchemeReference.connectionType.insert });insertRelationshipArray.sort((former, latter) => former.connection.properties.order - latter.connection.properties.order);for (let insertRelationship of insertRelationshipArray) {let insertNode = insertRelationship.destination;(0, _assert.default)(insertNode.labels.includes(_graphSchemeReference.nodeLabel.stage), `• "${insertNode.labels}" Unsupported node type for a ROOT connection.`);additionalChildNode.push({ node: insertNode, placement: { position: insertRelationship.connection.properties.placement[0], connectionKey: insertRelationship.connection.properties.placement[1] } });}if (rootRelationshipArray.length > 0) {rootNode = rootRelationshipArray[0].destination;} else if (extendRelationshipArray.length > 0) {let extendNode = extendRelationshipArray[0].destination;let recursiveCallResult = await graphInstance.laodSubgraphTemplateParameter.call(graphInstance, { node: extendNode, graphInstance });additionalChildNode = [...recursiveCallResult.additionalChildNode, ...additionalChildNode];traversalConfiguration = Object.assign(recursiveCallResult.traversalConfiguration, traversalConfiguration);rootNode = recursiveCallResult.rootNode;} else {return;}return { rootNode, additionalChildNode, traversalConfiguration };},
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
    (0, _assert.default)(resourceConnectionArray.every(n => _graphSchemeReference.connectionProperty.context.includes(n.connection.properties.context)), `• Unsupported property value for a RESOURCE connection.`);
    if (executeConnectionArray.length == 0) return null;

    let resourceRelation;
    if (resourceConnectionArray.length > 0) resourceRelation = resourceConnectionArray[0];

    let executeConnection = executeConnectionArray[0].connection;
    let dataProcessImplementation;
    if (executeConnection.properties.processDataImplementation) {
      dataProcessImplementation = graphInstance.traversal.processData[executeConnection.properties.processDataImplementation];
      (0, _assert.default)(dataProcessImplementation, `• "${executeConnection.properties.processDataImplementation}" implementation isn't registered in traversal concrete instance.`);
    } else dataProcessImplementation = implementation;

    let executeNode = executeConnectionArray[0].destination;

    let result = await dataProcessImplementation.call(node, { node: executeNode, resourceRelation, graphInstance });

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
    database || (database = new _DatabaseClass.Database.clientInterface({
      implementationList: { boltCypherModelAdapter: (0, _boltCypherModelAdapter.boltCypherModelAdapterFunction)() },
      defaultImplementation: 'boltCypherModelAdapter' }));

    traversal || (traversal = new _GraphTraversalClass.GraphTraversal.clientInterface({
      implementationList: { defaultImplementation: _defaultImplementation.implementation },
      defaultImplementation: 'defaultImplementation' }));




    let instance = _entity.Constructable[_entity.Constructable.reference.constructor.functionality].switch.call(callerClass, { implementationKey: _entity.Entity.reference.key.concereteBehavior })({
      concreteBehaviorList: [...concreteBehaviorList, database, traversal],
      data });


    let concereteDatabase = instance[_entity.Entity.reference.getInstanceOf](_DatabaseClass.Database);
    instance.database = concereteDatabase[_DatabaseClass.Database.reference.key.getter]();
    let concreteTraversal = instance[_entity.Entity.reference.getInstanceOf](_GraphTraversalClass.GraphTraversal);
    instance.traversal = concreteTraversal[_ImplementationManagementClass.ImplementationManagement.reference.key.getter]();
    let context = instance[_entity.Entity.reference.getInstanceOf](_ContextClass.Context);
    instance.context = context[_ContextClass.Context.reference.key.getter]();





    return instance;
  } });









Graph.clientInterface = Prototype[_entity.Constructable.reference.clientInterface.functionality].switch.call(Graph, {
  implementationKey: _entity.Entity.reference.key.instanceDelegatingToEntityInstancePrototype })(
{
  constructorImplementation: Reference.key.constructor,
  clientInterfaceInterceptCallback: false });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9jb25zdHJ1Y3RhYmxlL0dyYXBoLmNsYXNzLmpzIl0sIm5hbWVzIjpbIkV2YWx1YXRvciIsImNsYXNzIiwiR3JhcGgiLCJyZWZlcmVuY2UiLCJSZWZlcmVuY2UiLCJjb25zdHJ1Y3RhYmxlUHJvdG90eXBlIiwiUHJvdG90eXBlIiwiZW50aXR5UHJvdG90eXBlIiwiRW50aXR5IiwiY2xpZW50SW50ZXJmYWNlIiwiZGVzY3JpcHRpb24iLCJPYmplY3QiLCJhc3NpZ24iLCJrZXkiLCJjb25zdHJ1Y3RvciIsIlN5bWJvbCIsInRhcmdldCIsInRoaXNBcmciLCJhcmd1bWVudHNMaXN0IiwidGFyZ2V0Q2xhc3MiLCJtZXRob2ROYW1lIiwibm9kZUluc3RhbmNlIiwibm9kZUtleSIsIm5vZGVJRCIsImdyYXBoSW5zdGFuY2UiLCJub2RlRGF0YSIsImRhdGFiYXNlIiwiZ2V0Tm9kZUJ5S2V5IiwiZ2V0Tm9kZUJ5SUQiLCJpZCIsIkVycm9yIiwibGFiZWxzIiwiaW5jbHVkZXMiLCJub2RlTGFiZWwiLCJzdWJncmFwaFRlbXBsYXRlIiwicGFyYW1ldGVyIiwibGFvZFN1YmdyYXBoVGVtcGxhdGVQYXJhbWV0ZXIiLCJub2RlIiwiZm9yRWFjaCIsInByb3BlcnR5IiwiaW1wbGVtZW50YXRpb25LZXkiLCJ0cmF2ZXJzYWxDb25maWd1cmF0aW9uIiwiYWRkaXRpb25hbENoaWxkTm9kZSIsInJvb3ROb2RlIiwiUmVmbGVjdCIsImFwcGx5IiwicGFzc2VkQXJnIiwiZGVmYXVsdEFyZyIsInRyYXZlcnNhbERlcHRoIiwicGF0aCIsIm5vZGVUeXBlIiwicGFyZW50VHJhdmVyc2FsQXJnIiwicGFyYW1ldGVySW1wbGVtZW50YXRpb25LZXkiLCJwcm9jZXNzRGF0YSIsImhhbmRsZVByb3BhZ2F0aW9uIiwidHJhdmVyc2VOb2RlIiwiYWdncmVnYXRvciIsInRyYXZlcnNhbEludGVyY2VwdGlvbiIsImV2YWx1YXRlUG9zaXRpb24iLCJyZW1vdmVVbmRlZmluZWRGcm9tT2JqZWN0IiwiY29udGV4dEltcGxlbWVudGF0aW9uS2V5IiwiQ29udGV4dCIsImdldHRlciIsInBhcmVudEltcGxlbWVudGF0aW9uS2V5IiwidGFyZ2V0T2JqZWN0IiwiaW1wbGVtZW50YXRpb24iLCJkYXRhUHJvY2VzcyIsInRyYXZlcnNhbCIsInRhcmdldEZ1bmN0aW9uIiwiUHJveHkiLCJlbnRyaWVzIiwiZXZlcnkiLCJ2YWx1ZSIsIkJvb2xlYW4iLCJsb2FkIiwiZ3JhcGhEYXRhIiwiZWRnZSIsImxvYWRHcmFwaERhdGEiLCJub2RlRW50cnlEYXRhIiwiY29ubmVjdGlvbkVudHJ5RGF0YSIsInByaW50IiwiY29uc29sZSIsImxvZyIsImNvdW50IiwiYWxsTm9kZSIsImdldEFsbE5vZGUiLCJhbGxFZGdlIiwiZ2V0QWxsRWRnZSIsImlkZW50aXR5IiwiY29ubmVjdGlvbiIsInN0YXJ0IiwiZW5kIiwiY291bnROb2RlIiwiY291bnRFZGdlIiwicm9vdFJlbGF0aW9uc2hpcEFycmF5IiwiZ2V0Tm9kZUNvbm5lY3Rpb24iLCJkaXJlY3Rpb24iLCJjb25uZWN0aW9uVHlwZSIsInJvb3QiLCJuIiwiZGVzdGluYXRpb24iLCJzdGFnZSIsImV4dGVuZFJlbGF0aW9uc2hpcEFycmF5IiwiZXh0ZW5kIiwiY29uZmlndXJlUmVsYXRpb25zaGlwQXJyYXkiLCJjb25maWd1cmUiLCJjb25maWd1cmF0aW9uIiwibGVuZ3RoIiwiZXh0cmFjdFRyYXZlcnNhbENvbmZpZ1Byb3BlcnR5IiwicHJvcGVydHlPYmplY3QiLCJyZWR1Y2UiLCJhY2N1bXVsYXRvciIsInRyYXZlcnNhbE9wdGlvbiIsImNvbmZpZ3VyZU5vZGUiLCJwcm9wZXJ0aWVzIiwiaW5zZXJ0UmVsYXRpb25zaGlwQXJyYXkiLCJpbnNlcnQiLCJzb3J0IiwiZm9ybWVyIiwibGF0dGVyIiwib3JkZXIiLCJpbnNlcnRSZWxhdGlvbnNoaXAiLCJpbnNlcnROb2RlIiwicHVzaCIsInBsYWNlbWVudCIsInBvc2l0aW9uIiwiY29ubmVjdGlvbktleSIsImV4dGVuZE5vZGUiLCJyZWN1cnNpdmVDYWxsUmVzdWx0IiwidHJhdmVyc2UiLCJ0cmF2ZXJzYWxJdGVyYXRvckZlZWQiLCJjb25jcmV0ZVRyYXZlcnNhbCIsImV2ZW50RW1pdHRlciIsIkV2ZW50RW1pdHRlciIsImV2YWx1YXRpb24iLCJoYW5kbGVQcm9wYWdhdGlvbkltcGxlbWVudGF0aW9uIiwiZGF0YVByb2Nlc3NDYWxsYmFjayIsIm5leHRQcm9jZXNzRGF0YSIsInByb3h5aWZ5IiwicmVzdWx0IiwicmVjdXJzaXZlSXRlcmF0aW9uIiwiYXJndW1lbnRzIiwicHJvcGFnYXRpb24iLCJldmFsdWF0aW9uT3B0aW9uIiwiY29udGludWUiLCJhZ2dyZWdhdGlvbiIsImluY2x1ZGUiLCJ0cmFwQXN5bmNJdGVyYXRvciIsIml0ZXJhdG9yIiwidHJhdmVyc2FsSXRlcmF0aW9uIiwiX2hhbmRsZVByb3BhZ2F0aW9uSW1wbGVtZW50YXRpb24iLCJ0cmF2ZXJzYWxDb25maWciLCJuZXh0SXRlcmF0b3IiLCJub2RlSXRlcmF0b3JGZWVkIiwiZm9ya05vZGUiLCJldmVudEVtaXR0ZXJDYWxsYmFjayIsImVtaXQiLCJpdGVyYXRvclJlc3VsdCIsIm5leHQiLCJkb25lIiwicHJvbWlzZSIsInJlY3Vyc2l2ZUNhbGxiYWNrIiwic2hvdWxkQ29udGludWUiLCJhcmdzIiwibmV4dE5vZGUiLCJuZXh0Q2FsbEFyZ3VtZW50IiwicG9ydFRyYXZlcnNhbFJlc3VsdCIsImNvbmZpZyIsIm5hbWUiLCJzaG91bGRFeGVjdXRlUHJvY2VzcyIsImV4ZWN1dGVDb25uZWN0aW9uQXJyYXkiLCJleGVjdXRlIiwicHJvY2VzcyIsInJlc291cmNlQ29ubmVjdGlvbkFycmF5IiwicmVzb3VyY2UiLCJjb25uZWN0aW9uUHJvcGVydHkiLCJjb250ZXh0IiwicmVzb3VyY2VSZWxhdGlvbiIsImV4ZWN1dGVDb25uZWN0aW9uIiwiZGF0YVByb2Nlc3NJbXBsZW1lbnRhdGlvbiIsInByb2Nlc3NEYXRhSW1wbGVtZW50YXRpb24iLCJleGVjdXRlTm9kZSIsInNob3VsZEluY2x1ZGVSZXN1bHQiLCJhZGQiLCJDb25zdHJ1Y3RhYmxlIiwiaW5pdGlhbGl6ZSIsImZ1bmN0aW9uYWxpdHkiLCJzZXR0ZXIiLCJjb25jZXJldGVCZWhhdmlvciIsInRhcmdldEluc3RhbmNlIiwiY29uY2VyZXRlQmVoYXZpb3JMaXN0IiwicHJldmlvdXNSZXN1bHQiLCJjb25jcmV0ZUJlaGF2aW9yTGlzdCIsImRhdGEiLCJjYWxsZXJDbGFzcyIsIm1vZGUiLCJEYXRhYmFzZSIsImltcGxlbWVudGF0aW9uTGlzdCIsImJvbHRDeXBoZXJNb2RlbEFkYXB0ZXIiLCJkZWZhdWx0SW1wbGVtZW50YXRpb24iLCJHcmFwaFRyYXZlcnNhbCIsImluc3RhbmNlIiwic3dpdGNoIiwiY29uY2VyZXRlRGF0YWJhc2UiLCJnZXRJbnN0YW5jZU9mIiwiSW1wbGVtZW50YXRpb25NYW5hZ2VtZW50IiwiaW5zdGFuY2VEZWxlZ2F0aW5nVG9FbnRpdHlJbnN0YW5jZVByb3RvdHlwZSIsImNvbnN0cnVjdG9ySW1wbGVtZW50YXRpb24iLCJjbGllbnRJbnRlcmZhY2VJbnRlcmNlcHRDYWxsYmFjayJdLCJtYXBwaW5ncyI6IjZkQUFBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHNILDZCQUpBLE1BQU1BLFNBQVMsR0FBRyx3Q0FBbEI7Ozs7Ozs7Ozs7QUFjTyxNQUFNLEVBQUVDLEtBQUssRUFBRUMsS0FBVCxFQUFnQkMsU0FBUyxFQUFFQyxTQUEzQixFQUFzQ0Msc0JBQXNCLEVBQUVDLFNBQTlELEVBQXlFQyxlQUF6RSxLQUE2RixJQUFJQyxlQUFPQyxlQUFYLENBQTJCLEVBQUVDLFdBQVcsRUFBRSxPQUFmLEVBQTNCLENBQW5HLEM7O0FBRVBDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjUixTQUFkLEVBQXlCO0FBQ3ZCUyxFQUFBQSxHQUFHLEVBQUU7QUFDSEMsSUFBQUEsV0FBVyxFQUFFQyxNQUFNLENBQUMsdUJBQUQsQ0FE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TzJJLFFBQVA7QUFDRCxHQXBENEUsRUFBdEUsQ0FBVDs7Ozs7Ozs7OztBQThEQXZNLEtBQUssQ0FBQ08sZUFBTixHQUErQkgsU0FBUyxDQUFDa0wsc0JBQWNyTCxTQUFkLENBQXdCTSxlQUF4QixDQUF3Q2lMLGFBQXpDLENBQVQsQ0FBaUVnQixNQUF4RSxNQUFBeE0sS0FBSyxFQUEwRTtBQUNyR3NDLEVBQUFBLGlCQUFpQixFQUFFaEMsZUFBT0wsU0FBUCxDQUFpQlUsR0FBakIsQ0FBcUJpTSwyQ0FENkQsRUFBMUUsQ0FBTDtBQUVyQjtBQUNEQyxFQUFBQSx5QkFBeUIsRUFBRTNNLFNBQVMsQ0FBQ1MsR0FBVixDQUFjQyxXQUR4QztBQUVEa00sRUFBQUEsZ0NBQWdDLEVBQUUsS0FGakMsRUFGcUIsQ0FBeEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCdcbmltcG9ydCB7IEVudGl0eSwgQ29uc3RydWN0YWJsZSwgc3ltYm9sIH0gZnJvbSAnQGRlcGVuZGVuY3kvZW50aXR5J1xuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4vTm9kZS5jbGFzcy5qcydcbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICcuL0Nvbm5lY3Rpb24uY2xhc3MuanMnXG5pbXBvcnQgeyBHcmFwaFRyYXZlcnNhbCwgdHJhdmVyc2FsT3B0aW9uIH0gZnJvbSAnLi9HcmFwaFRyYXZlcnNhbC5jbGFzcy5qcydcbmltcG9ydCB7IERhdGFiYXNlIH0gZnJvbSAnLi9EYXRhYmFzZS5jbGFzcy5qcydcbmltcG9ydCB7IENhY2hlIH0gZnJvbSAnLi9DYWNoZS5jbGFzcy5qcydcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQuY2xhc3MuanMnXG5pbXBvcnQgeyBJbXBsZW1lbnRhdGlvbk1hbmFnZW1lbnQgfSBmcm9tICcuL0ltcGxlbWVudGF0aW9uTWFuYWdlbWVudC5jbGFzcy5qcydcbmltcG9ydCB7IHByb3hpZnlNZXRob2REZWNvcmF0b3IgfSBmcm9tICcuLi91dGlsaXR5L3Byb3hpZnlNZXRob2REZWNvcmF0b3IuanMnXG5pbXBvcnQgeyBtZXJnZURlZmF1bHRQYXJhbWV0ZXIgfSBmcm9tICcuLi91dGlsaXR5L21lcmdlRGVmYXVsdFBhcmFtZXRlci5qcydcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IHsgRXZhbHVhdG9yRnVuY3Rpb24sIGV2YWx1YXRpb25PcHRpb24gfSBmcm9tICcuL0V2YWx1YXRvci5jbGFzcy5qcydcbmNvbnN0IEV2YWx1YXRvciA9IEV2YWx1YXRvckZ1bmN0aW9uKClcbmltcG9ydCB7IHJlbW92ZVVuZGVmaW5lZEZyb21PYmplY3QgfSBmcm9tICcuLi91dGlsaXR5L3JlbW92ZVVuZGVmaW5lZEZyb21PYmplY3QuanMnXG5pbXBvcnQgeyBub2RlTGFiZWwsIGNvbm5lY3Rpb25UeXBlLCBjb25uZWN0aW9uUHJvcGVydHkgfSBmcm9tICcuLi9ncmFwaFNjaGVtZVJlZmVyZW5jZS5qcydcbmltcG9ydCB7IGJvbHRDeXBoZXJNb2RlbEFkYXB0ZXJGdW5jdGlvbiB9IGZyb20gJy4uL2ltcGxlbWVudGF0aW9uUGx1Z2luL2RhdGFiYXNlTW9kZWxBZGFwdGVyL2JvbHRDeXBoZXJNb2RlbEFkYXB0ZXIuanMnXG5pbXBvcnQgeyBpbXBsZW1lbnRhdGlvbiBhcyBkZWZhdWx0SW1wbGVtZW50YXRpb24gfSBmcm9tICcuLi9pbXBsZW1lbnRhdGlvblBsdWdpbi9ncmFwaFRyYXZlcnNhbEltcGxlbWVudGF0aW9uL2RlZmF1bHRJbXBsZW1lbnRhdGlvbi5qcydcblxuLyoqIENvbmNlcHR1YWwgR3JhcGhcbiAqIEdyYXBoIENsYXNzIGhvbGRzIGFuZCBtYW5hZ2VzIGdyYXBoIGVsZW1lbnRzIGFuZCB0cmF2ZXJzYWwgYWxnb3JpdGhtIGltcGxlbWVudGF0aW9uczpcbiAqICAtIENhY2hlOiBvbi1kZW1hbmQgcmV0cml2ZWQgbm9kZXMgZnJvbSBEQiBhcmUgY2FjaGVkLlxuICogIC0gRGF0YWJhc2U6IGdldCBncmFwaCBkYXRhIGFuZCBsb2FkIGl0IGludG8gbWVtb3J5LlxuICogIC0gVHJhdmVyc2FsOiBpbXBsZW1lbnRhdGlvbiBmb3IgdGhlIHRyYXZlcnNhbCBhbGdvcml0aG0uXG4gKiAgLSBDb250ZXh0OiBzaGFyZWQgZGF0YSBhY2Nlc3NpYmxlIGJldHdlZW4gdHJhdmVyc2Fscy5cbiAqIFRoZSBHcmFwaCBpbnN0YW5jZSBzaG91bGQgaGF2ZSBhbiBhYmlsaXR5IHRvIHNldC9jaGFuZ2Ugc3RyYXRlZ2llcy9pbXBsZW1lbnRhdGlvbnMgb24gcnVudGltZSBhbmQgYWJpbGl0eSB0byB1c2UgbXVsdGlwbGUgcmVnaXN0ZXJlZCBpbXBsZW1lbnRhdGlvbnMuXG4gKi9cbmV4cG9ydCBjb25zdCB7IGNsYXNzOiBHcmFwaCwgcmVmZXJlbmNlOiBSZWZlcmVuY2UsIGNvbnN0cnVjdGFibGVQcm90b3R5cGU6IFByb3RvdHlwZSwgZW50aXR5UHJvdG90eXBlIH0gPSBuZXcgRW50aXR5LmNsaWVudEludGVyZmFjZSh7IGRlc2NyaXB0aW9uOiAnR3JhcGgnIH0pXG5cbk9iamVjdC5hc3NpZ24oUmVmZXJlbmNlLCB7XG4gIGtleToge1xuICAgIGNvbnN0cnVjdG9yOiBTeW1ib2woJ0dyYXBoOmtleS5jb25zdHJ1Y3RvcicpLFxuICB9LFxufSlcblxuLypcbiAgICAgICAgICAgICAgICAgICBfICAgICAgICBfICAgICAgICAgICAgICAgICAgICBfX19fICAgICAgIF8gICAgICAgICAgICAgICAgICBfICAgXyAgICAgICAgICAgICBcbiAgIF8gX18gIF8gX18gX19fIHwgfF8gX19fIHwgfF8gXyAgIF8gXyBfXyAgIF9fX3wgIF8gXFwgIF9fX3wgfCBfX18gIF9fIF8gIF9fIF98IHxfKF8pIF9fXyAgXyBfXyAgXG4gIHwgJ18gXFx8ICdfXy8gXyBcXHwgX18vIF8gXFx8IF9ffCB8IHwgfCAnXyBcXCAvIF8gXFwgfCB8IHwvIF8gXFwgfC8gXyBcXC8gX2AgfC8gX2AgfCBfX3wgfC8gXyBcXHwgJ18gXFwgXG4gIHwgfF8pIHwgfCB8IChfKSB8IHx8IChfKSB8IHxffCB8X3wgfCB8XykgfCAgX18vIHxffCB8ICBfXy8gfCAgX18vIChffCB8IChffCB8IHxffCB8IChfKSB8IHwgfCB8XG4gIHwgLl9fL3xffCAgXFxfX18vIFxcX19cXF9fXy8gXFxfX3xcXF9fLCB8IC5fXy8gXFxfX198X19fXy8gXFxfX198X3xcXF9fX3xcXF9fLCB8XFxfXyxffFxcX198X3xcXF9fXy98X3wgfF98XG4gIHxffCAgICAgICAgICAgICAgICAgICAgICAgICAgIHxfX18vfF98ICAgICAgICAgICAgICAgICAgICAgICAgICAgfF9fXy8gICAgICAgICAgICAgICAgICAgICAgICAgXG4qL1xuT2JqZWN0LmFzc2lnbihlbnRpdHlQcm90b3R5cGUsIHtcbiAgLy8gbG9hZCBncmFwaCBpbnRvIG1lbW9yeVxuICBhc3luYyBsb2FkKHsgZ3JhcGhEYXRhLCBncmFwaEluc3RhbmNlID0gdGhpcyB9ID0ge30pIHtcbiAgICAvLyBsb2FkIGpzb24gZ3JhcGggZGF0YS5cbiAgICBhc3NlcnQoZ3JhcGhEYXRhLm5vZGUgJiYgZ3JhcGhEYXRhLmVkZ2UsIGDigKIgR3JhcGggZGF0YSBvYmplY3QgbXVzdCBjb250YWluIG5vZGUgJiBlZGdlIGFycmF5cy5gKVxuICAgIHJldHVybiBhd2FpdCBncmFwaEluc3RhbmNlLmRhdGFiYXNlLmxvYWRHcmFwaERhdGEoeyBub2RlRW50cnlEYXRhOiBncmFwaERhdGEubm9kZSwgY29ubmVjdGlvbkVudHJ5RGF0YTogZ3JhcGhEYXRhLmVkZ2UgfSlcbiAgfSxcbiAgYXN5bmMgcHJpbnQoeyBncmFwaEluc3RhbmNlID0gdGhpcyB9ID0ge30pIHtcbiAgICBjb25zb2xlLmxvZyhgX19fX19fIEdyYXBoIGVsZW1lbnRzOiBfX19fX19fX19fX19fX19fX19fX2ApXG4gICAgbGV0IGNvdW50ID0gYXdhaXQgZ3JhcGhJbnN0YW5jZS5jb3VudCgpXG4gICAgbGV0IGFsbE5vZGUgPSBhd2FpdCBncmFwaEluc3RhbmNlLmRhdGFiYXNlLmdldEFsbE5vZGUoKVxuICAgIGxldCBhbGxFZGdlID0gYXdhaXQgZ3JhcGhJbnN0YW5jZS5kYXRhYmFzZS5nZXRBbGxFZGdlKClcbiAgICBjb25zb2xlLmxvZyhgI1ZlcnRleCA9ICR7Y291bnQubm9kZX1gKVxuICAgIGZvciAobGV0IG5vZGUgb2YgYWxsTm9kZSkge1xuICAgICAgY29uc29sZS5sb2cobm9kZS5pZGVudGl0eSlcbiAgICB9XG4gICAgY29uc29sZS5sb2coYFxcbiNFZGdlID0gJHtjb3VudC5jb25uZWN0aW9ufWApXG4gICAgZm9yIChsZXQgZWRnZSBvZiBhbGxFZGdlKSB7XG4gICAgICBjb25zb2xlLmxvZyhgJHtlZGdlLnN0YXJ0fSAtLT4gJHtlZGdlLmVuZH1gKVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhgX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX2ApXG4gIH0sXG4gIGFzeW5jIGNvdW50KHsgZ3JhcGhJbnN0YW5jZSA9IHRoaXMgfSA9IHt9KSB7XG4gICAgLy8gY291bnQgbnVtYmVyIG9mIGNhY2hlZCBlbGVtZW50c1xuICAgIHJldHVybiB7XG4gICAgICBub2RlOiBhd2FpdCBncmFwaEluc3RhbmNlLmRhdGFiYXNlLmNvdW50Tm9kZSgpLFxuICAgICAgY29ubmVjdGlvbjogYXdhaXQgZ3JhcGhJbnN0YW5jZS5kYXRhYmFzZS5jb3VudEVkZ2UoKSxcbiAgICB9XG4gIH0sXG4gIC8vIGxvYWQgYHN1YmdyYXBoIHRlbXBsYXRlYCBub2RlIHBhcmFtZXRlcnMgZm9yIHRyYXZlcnNhbCBjYWxsIHVzYWdlLlxuICBhc3luYyBsYW9kU3ViZ3JhcGhUZW1wbGF0ZVBhcmFtZXRlcih7IG5vZGUsIGdyYXBoSW5zdGFuY2UgPSB0aGlzIH0pIHtcbiAgICBsZXQgcm9vdFJlbGF0aW9uc2hpcEFycmF5ID0gYXdhaXQgZ3JhcGhJbnN0YW5jZS5kYXRhYmFzZS5nZXROb2RlQ29ubmVjdGlvbih7IGRpcmVjdGlvbjogJ291dGdvaW5nJywgbm9kZUlEOiBub2RlLmlkZW50aXR5LCBjb25uZWN0aW9uVHlwZTogY29ubmVjdGlvblR5cGUucm9vdCB9KVxuICAgIGFzc2VydChyb290UmVsYXRpb25zaGlwQXJyYXkuZXZlcnkobiA9PiBuLmRlc3RpbmF0aW9uLmxhYmVscy5pbmNsdWRlcyhub2RlTGFiZWwuc3RhZ2UpKSwgYOKAoiBVbnN1cHBvcnRlZCBub2RlIHR5cGUgZm9yIGEgUk9PVCBjb25uZWN0aW9uLmApIC8vIHZlcmlmeSBub2RlIHR5cGVcbiAgICBsZXQgZXh0ZW5kUmVsYXRpb25zaGlwQXJyYXkgPSBhd2FpdCBncmFwaEluc3RhbmNlLmRhdGFiYXNlLmdldE5vZGVDb25uZWN0aW9uKHsgZGlyZWN0aW9uOiAnb3V0Z29pbmcnLCBub2RlSUQ6IG5vZGUuaWRlbnRpdHksIGNvbm5lY3Rpb25UeXBlOiBjb25uZWN0aW9uVHlwZS5leHRlbmQgfSlcbiAgICBhc3NlcnQoZXh0ZW5kUmVsYXRpb25zaGlwQXJyYXkuZXZlcnkobiA9PiBuLmRlc3RpbmF0aW9uLmxhYmVscy5pbmNsdWRlcyhub2RlTGFiZWwuc3ViZ3JhcGhUZW1wbGF0ZSkpLCBg4oCiIFVuc3VwcG9ydGVkIG5vZGUgdHlwZSBmb3IgYSBFWFRFTkQgY29ubmVjdGlvbi5gKSAvLyB2ZXJpZnkgbm9kZSB0eXBlXG4gICAgbGV0IGNvbmZpZ3VyZVJlbGF0aW9uc2hpcEFycmF5ID0gYXdhaXQgZ3JhcGhJbnN0YW5jZS5kYXRhYmFzZS5nZXROb2RlQ29ubmVjdGlvbih7IGRpcmVjdGlvbjogJ2luY29taW5nJywgbm9kZUlEOiBub2RlLmlkZW50aXR5LCBjb25uZWN0aW9uVHlwZTogY29ubmVjdGlvblR5cGUuY29uZmlndXJlIH0pXG4gICAgYXNzZXJ0KGNvbmZpZ3VyZVJlbGF0aW9uc2hpcEFycmF5LmV2ZXJ5KG4gPT4gbi5kZXN0aW5hdGlvbi5sYWJlbHMuaW5jbHVkZXMobm9kZUxhYmVsLmNvbmZpZ3VyYXRpb24pKSwgYOKAoiBVbnN1cHBvcnRlZCBub2RlIHR5cGUgZm9yIGEgRVhURU5EIGNvbm5lY3Rpb24uYCkgLy8gdmVyaWZ5IG5vZGUgdHlwZVxuXG4gICAgbGV0IHJvb3ROb2RlLFxuICAgICAgdHJhdmVyc2FsQ29uZmlndXJhdGlvbiA9IHt9LFxuICAgICAgYWRkaXRpb25hbENoaWxkTm9kZSA9IFtdIC8vIGFkZGl0aW9uYWwgbm9kZXNcblxuICAgIC8vIGdldCB0cmF2ZXJzYWwgY29uZmlndXJhdGlvbiBub2RlXG4gICAgaWYgKGNvbmZpZ3VyZVJlbGF0aW9uc2hpcEFycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgIGZ1bmN0aW9uIGV4dHJhY3RUcmF2ZXJzYWxDb25maWdQcm9wZXJ0eShwcm9wZXJ0eU9iamVjdCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMocHJvcGVydHlPYmplY3QpLnJlZHVjZSgoYWNjdW11bGF0b3IsIFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIGlmICh0cmF2ZXJzYWxPcHRpb24uaW5jbHVkZXMoa2V5KSkgYWNjdW11bGF0b3Jba2V5XSA9IHZhbHVlXG4gICAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yXG4gICAgICAgIH0sIHt9KVxuICAgICAgfVxuICAgICAgbGV0IGNvbmZpZ3VyZU5vZGUgPSBjb25maWd1cmVSZWxhdGlvbnNoaXBBcnJheVswXS5kZXN0aW5hdGlvblxuICAgICAgdHJhdmVyc2FsQ29uZmlndXJhdGlvbiA9IGV4dHJhY3RUcmF2ZXJzYWxDb25maWdQcm9wZXJ0eShjb25maWd1cmVOb2RlLnByb3BlcnRpZXMpXG4gICAgfVxuXG4gICAgLy8gZ2V0IGFkZGl0aW9uYWwgbm9kZXNcbiAgICBsZXQgaW5zZXJ0UmVsYXRpb25zaGlwQXJyYXkgPSBhd2FpdCBncmFwaEluc3RhbmNlLmRhdGFiYXNlLmdldE5vZGVDb25uZWN0aW9uKHsgZGlyZWN0aW9uOiAnaW5jb21pbmcnLCBub2RlSUQ6IG5vZGUuaWRlbnRpdHksIGNvbm5lY3Rpb25UeXBlOiBjb25uZWN0aW9uVHlwZS5pbnNlcnQgfSlcbiAgICBpbnNlcnRSZWxhdGlvbnNoaXBBcnJheS5zb3J0KChmb3JtZXIsIGxhdHRlcikgPT4gZm9ybWVyLmNvbm5lY3Rpb24ucHJvcGVydGllcy5vcmRlciAtIGxhdHRlci5jb25uZWN0aW9uLnByb3BlcnRpZXMub3JkZXIpIC8vIHVzaW5nIGBvcmRlcmAgcHJvcGVydHkgLy8gQnVsayBhY3Rpb25zIG9uIGZvcmtzIC0gc29ydCBmb3Jrc1xuICAgIGZvciAobGV0IGluc2VydFJlbGF0aW9uc2hpcCBvZiBpbnNlcnRSZWxhdGlvbnNoaXBBcnJheSkge1xuICAgICAgbGV0IGluc2VydE5vZGUgPSBpbnNlcnRSZWxhdGlvbnNoaXAuZGVzdGluYXRpb25cbiAgICAgIGFzc2VydChpbnNlcnROb2RlLmxhYmVscy5pbmNsdWRlcyhub2RlTGFiZWwuc3RhZ2UpLCBg4oCiIFwiJHtpbnNlcnROb2RlLmxhYmVsc31cIiBVbnN1cHBvcnRlZCBub2RlIHR5cGUgZm9yIGEgUk9PVCBjb25uZWN0aW9uLmApIC8vIHZlcmlmeSBub2RlIHR5cGVcbiAgICAgIGFkZGl0aW9uYWxDaGlsZE5vZGUucHVzaCh7XG4gICAgICAgIG5vZGU6IGluc2VydE5vZGUsXG4gICAgICAgIHBsYWNlbWVudDoge1xuICAgICAgICAgIC8vIGNvbnZlbnRpb24gZm9yIGRhdGEgc3RydWN0dXJlIG9mIHBsYWNlbWVudCBhcnJheSAtIDA6ICdiZWZvcmUnIHwgJ2FmdGVyJywgMTogY29ubmVjdGlvbktleVxuICAgICAgICAgIHBvc2l0aW9uOiBpbnNlcnRSZWxhdGlvbnNoaXAuY29ubmVjdGlvbi5wcm9wZXJ0aWVzLnBsYWNlbWVudFswXSxcbiAgICAgICAgICBjb25uZWN0aW9uS2V5OiBpbnNlcnRSZWxhdGlvbnNoaXAuY29ubmVjdGlvbi5wcm9wZXJ0aWVzLnBsYWNlbWVudFsxXSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gZ2V0IHJvb3ROb2RlIGFuZCBoYW5kbGUgZXh0ZW5kZWQgbm9kZS5cbiAgICBpZiAocm9vdFJlbGF0aW9uc2hpcEFycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgIHJvb3ROb2RlID0gcm9vdFJlbGF0aW9uc2hpcEFycmF5WzBdLmRlc3RpbmF0aW9uXG4gICAgfSBlbHNlIGlmIChleHRlbmRSZWxhdGlvbnNoaXBBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgZXh0ZW5kTm9kZSA9IGV4dGVuZFJlbGF0aW9uc2hpcEFycmF5WzBdLmRlc3RpbmF0aW9uXG4gICAgICBsZXQgcmVjdXJzaXZlQ2FsbFJlc3VsdCA9IGF3YWl0IGdyYXBoSW5zdGFuY2U6OmdyYXBoSW5zdGFuY2UubGFvZFN1YmdyYXBoVGVtcGxhdGVQYXJhbWV0ZXIoeyBub2RlOiBleHRlbmROb2RlLCBncmFwaEluc3RhbmNlIH0pXG4gICAgICBhZGRpdGlvbmFsQ2hpbGROb2RlID0gWy4uLnJlY3Vyc2l2ZUNhbGxSZXN1bHQuYWRkaXRpb25hbENoaWxkTm9kZSwgLi4uYWRkaXRpb25hbENoaWxkTm9kZV1cbiAgICAgIHRyYXZlcnNhbENvbmZpZ3VyYXRpb24gPSBPYmplY3QuYXNzaWduKHJlY3Vyc2l2ZUNhbGxSZXN1bHQudHJhdmVyc2FsQ29uZmlndXJhdGlvbiwgdHJhdmVyc2FsQ29uZmlndXJhdGlvbilcbiAgICAgIHJvb3ROb2RlID0gcmVjdXJzaXZlQ2FsbFJlc3VsdC5yb290Tm9kZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gLy8gaW4gY2FzZSBubyBgUk9PVGAgcmVsYXRpb24gb3IgYEVYVEVORGAgYXJlIHByZXNlbnRcbiAgICB9XG5cbiAgICByZXR1cm4geyByb290Tm9kZSwgYWRkaXRpb25hbENoaWxkTm9kZSwgdHJhdmVyc2FsQ29uZmlndXJhdGlvbiB9IC8vIHJvb3ROb2RlIHdpbGwgYmUgdXNlZCBhcyBlbnRyeXBvaW50IHRvIHRyYXZlcnNhbCBjYWxsXG4gIH0sXG5cbiAgLyoqIEdyYXBoIHRyYXZlcnNhbCAtIENvbnRyb2xzIHRoZSB0cmF2ZXJzaW5nIHRoZSBub2RlcyBpbiB0aGUgZ3JhcGguIFdoaWNoIGluY2x1ZGVzIHByb2Nlc3Npbmcgb2YgZGF0YSBpdGVtcyBhbmQgYWdncmVnYXRpb24gb2YgcmVzdWx0cy5cbiAgICogRHluYW1pYyBpbXBsZW1lbnRhdGlvbiAtIG5vdCByZXN0cmljdGVkIHRvIHNwZWNpZmljIGluaXRpYWxpemF0aW9uIGFsZ29yaXRobSwgcmF0aGVyIGNob29zZW4gZnJvbSBzZXR0aW5nIG9mIGVhY2ggbm9kZSBpbiB0aGUgdHJhdmVyc2VkIGdyYXBoLlxuICAgKi9cbiAgQHByb3hpZnlNZXRob2REZWNvcmF0b3IoYXN5bmMgKHRhcmdldCwgdGhpc0FyZywgYXJndW1lbnRzTGlzdCwgdGFyZ2V0Q2xhc3MsIG1ldGhvZE5hbWUpID0+IHtcbiAgICAvLyBjcmVhdGUgbm9kZSBpbnN0YW5jZSwgaW4gY2FzZSBzdHJpbmcga2V5IGlzIHBhc3NlZCBhcyBwYXJhbWV0ZXIuXG4gICAgbGV0IHsgbm9kZUluc3RhbmNlLCBub2RlS2V5LCBub2RlSUQsIGdyYXBoSW5zdGFuY2UgPSB0aGlzQXJnIH0gPSBhcmd1bWVudHNMaXN0WzBdXG4gICAgbGV0IG5vZGVEYXRhXG4gICAgaWYgKG5vZGVJbnN0YW5jZSkge1xuICAgICAgbm9kZURhdGEgPSBub2RlSW5zdGFuY2VcbiAgICB9IGVsc2UgaWYgKG5vZGVLZXkpIHtcbiAgICAgIG5vZGVEYXRhID0gYXdhaXQgZ3JhcGhJbnN0YW5jZS5kYXRhYmFzZS5nZXROb2RlQnlLZXkoeyBrZXk6IG5vZGVLZXkgfSkgLy8gcmV0cmlldmUgbm9kZSBkYXRhIG9uLWRlbWFuZFxuICAgIH0gZWxzZSBpZiAobm9kZUlEKSB7XG4gICAgICBub2RlRGF0YSA9IGF3YWl0IGdyYXBoSW5zdGFuY2UuZGF0YWJhc2UuZ2V0Tm9kZUJ5SUQoeyBpZDogbm9kZUlEIH0pIC8vIHJldHJpZXZlIG5vZGUgZGF0YSBvbi1kZW1hbmRcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfigKIgbm9kZSBpZGVudGlmaWVyIG9yIG9iamVjdCBtdXN0IGJlIHBhc3NlZCBpbi4nKVxuICAgIH1cblxuICAgIC8vIGRlYWwgd2l0aCBTdWJncmFwaFRlbXBsYXRlXG4gICAgaWYgKG5vZGVEYXRhLmxhYmVscy5pbmNsdWRlcyhub2RlTGFiZWwuc3ViZ3JhcGhUZW1wbGF0ZSkpIHtcbiAgICAgIGxldCBwYXJhbWV0ZXIgPSBhd2FpdCBncmFwaEluc3RhbmNlLmxhb2RTdWJncmFwaFRlbXBsYXRlUGFyYW1ldGVyKHsgbm9kZTogbm9kZURhdGEgfSlcbiAgICAgIGlmICghcGFyYW1ldGVyKVxuICAgICAgICByZXR1cm4gLy8gaW4gY2FzZSBubyBkZXN0aW5hdGlvbiBub2RlIChST09UL0V4dGVuZCkgYXJlIHByZXNlbnRcbiAgICAgICAgLy8gc2V0IGFkZGl0aW9uYWwgcGFyYW1ldGVyc1xuICAgICAgO1snbm9kZUluc3RhbmNlJywgJ25vZGVLZXknLCAnbm9kZUlEJ10uZm9yRWFjaChwcm9wZXJ0eSA9PiBkZWxldGUgYXJndW1lbnRzTGlzdFswXVtwcm9wZXJ0eV0pIC8vIHJlbW92ZSBzdWJncmFwaCB0ZW1wbGF0ZSBub2RlIHJlbGF0ZWQgaWRlbnRpZmllcnMuXG4gICAgICBhcmd1bWVudHNMaXN0WzBdLmltcGxlbWVudGF0aW9uS2V5ID0gYXJndW1lbnRzTGlzdFswXS5pbXBsZW1lbnRhdGlvbktleSA/IE9iamVjdC5hc3NpZ24ocGFyYW1ldGVyLnRyYXZlcnNhbENvbmZpZ3VyYXRpb24sIGFyZ3VtZW50c0xpc3RbMF0uaW1wbGVtZW50YXRpb25LZXkpIDogcGFyYW1ldGVyLnRyYXZlcnNhbENvbmZpZ3VyYXRpb25cbiAgICAgIGFyZ3VtZW50c0xpc3RbMF0uYWRkaXRpb25hbENoaWxkTm9kZSA9IGFyZ3VtZW50c0xpc3RbMF0uYWRkaXRpb25hbENoaWxkTm9kZSA/IFsuLi5hcmd1bWVudHNMaXN0WzBdLmFkZGl0aW9uYWxDaGlsZE5vZGUsIC4uLnBhcmFtZXRlci5hZGRpdGlvbmFsQ2hpbGROb2RlXSA6IHBhcmFtZXRlci5hZGRpdGlvbmFsQ2hpbGROb2RlXG4gICAgICBPYmplY3QuYXNzaWduKGFyZ3VtZW50c0xpc3RbMF0sIHsgbm9kZUluc3RhbmNlOiBwYXJhbWV0ZXIucm9vdE5vZGUgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgYXJndW1lbnRzTGlzdFswXS5ub2RlSW5zdGFuY2UgPSBub2RlRGF0YSAvLyBzZXQgbm9kZSBkYXRhXG4gICAgfVxuICAgIHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgdGhpc0FyZywgYXJndW1lbnRzTGlzdClcbiAgfSlcbiAgQHByb3hpZnlNZXRob2REZWNvcmF0b3IoKHRhcmdldCwgdGhpc0FyZyAvKkdyYXBoIEluc3RhbmNlKi8sIGFyZ3VtZW50c0xpc3QsIHRhcmdldENsYXNzLCBtZXRob2ROYW1lKSA9PiB7XG4gICAgLy8gc2V0IGRlZmF1bHQgcGFyYW1ldGVycyBhbmQgZXhwb3NlIHRoZW0gdG8gc3Vic2VxdWVudCBtZXRob2QgZGVjb3JhdG9ycy5cbiAgICBhcmd1bWVudHNMaXN0ID0gbWVyZ2VEZWZhdWx0UGFyYW1ldGVyKHtcbiAgICAgIHBhc3NlZEFyZzogYXJndW1lbnRzTGlzdCxcbiAgICAgIGRlZmF1bHRBcmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRyYXZlcnNhbERlcHRoOiAwLFxuICAgICAgICAgIHBhdGg6IG51bGwsIC8vIFRPRE86IGltcGxlbWVudCBwYXRoIHNlcXVlbmNlIHByZXNlcnZhdGlvbi4gYWxsb3cgZm9yIHRoZSBub2RlIHRyYXZlcnNlIGZ1bmN0aW9uIHRvIHJlbHkgb24gdGhlIGN1cnJlbnQgcGF0aCBkYXRhLlxuICAgICAgICAgIGdyYXBoSW5zdGFuY2U6IHRoaXNBcmcsXG4gICAgICAgICAgYWRkaXRpb25hbENoaWxkTm9kZTogW10sIC8vIGNoaWxkIG5vZGVzIHRvIGFkZCB0byB0aGUgY3VycmVudCBub2RlJ3MgY2hpbGRyZW4uIFRoZXNlIGFyZSBhZGRlZCBpbmRpcmVjdGx5IHRvIGEgbm9kZSB3aXRob3V0IGNoYW5naW5nIHRoZSBub2RlJ3MgY2hpbGRyZW4gaXRzZWxmLCBhcyBhIHdheSB0byBleHRlbmQgY3VycmVudCBub2Rlcy5cbiAgICAgICAgICBub2RlVHlwZTogJ1N0YWdlJywgLy8gVHJhdmVyc2FsIHN0ZXAgb3Igc3RhZ2UgLSBkZWZpbmVzIHdoZW4gYW5kIGhvdyB0byBydW4gcHJvY2Vzc2VzLlxuICAgICAgICB9LFxuICAgICAgICB7IHBhcmVudFRyYXZlcnNhbEFyZzogbnVsbCB9LFxuICAgICAgXSxcbiAgICB9KVxuICAgIHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgdGhpc0FyZywgYXJndW1lbnRzTGlzdClcbiAgfSlcbiAgLyoqIFxuICAgKiBUT0RPOiAgUkVGQUNUT1IgYWRkaW5nIFRyYXZlcnNhbCBkZXNjcmlwdGlvbiBjbGFzcyAtIGFiaWxpdHkgdG8gcGljayBhIGRlZmluZWQgc2V0IG9mIGltcGxlbWVudGF0aW9uIGtleXMgdG8gYmUgdXNlZCB0byBnZXRoZXIgLSBlLmcuIGltcGxlbWVudGF0aW9uIHR5cGU6IENvbmRpdGlvbiwgTWlkZGxld2FyZSwgVGVtcGxhdGUsIFNjaGVtYSwgU2hlbGxzY3JpcHQuXG4gICAgLSBodHRwczovL25lbzRqLmNvbS9kb2NzL2phdmEtcmVmZXJlbmNlLzMuNS9qYXZhZG9jcy9vcmcvbmVvNGovZ3JhcGhkYi90cmF2ZXJzYWwvVHJhdmVyc2FsRGVzY3JpcHRpb24uaHRtbFxuICAgIC0gU3BsaXQgdHJhdmVyc2FsIGNvbmZpZ3VyYXRpb25zIHRoYXQgYXJlIGNvbmZpZ3VyZWQgYnkgdGhlIG5vZGUgZ3JhcGggZGF0YSBpdHNlbGYgZnJvbSB0aG9zZSB0aGF0IGFyZSBwYXNzZWQgdG8gdGhlIGNhbGwgYXMgcGFyYW1ldGVycy4gT1IgbWVyZ2UgdGhlbSwgYnkgdXNpbmcgc29tZSBhcyBkZWZhdWx0cyBpbiBjYXNlIGJvdGggYXJlIHNldC5cbiAgICAtIEltcGxlbWVudCAnZGVwdGhBZmZlY3RlZCcgZm9yIHRoZSBhZmZlY3RlZCBkZXB0aCBvZiB0aGUgY29uZmlndXJlIGNvbm5lY3Rpb25zIG9uIGEgc3RhZ2UgYW5kIGl0cyBjaGlsZCBub2Rlcy5cbiAgICovXG4gIEBwcm94aWZ5TWV0aG9kRGVjb3JhdG9yKCh0YXJnZXQsIHRoaXNBcmcsIGFyZ3VtZW50c0xpc3QsIHRhcmdldENsYXNzLCBtZXRob2ROYW1lKSA9PiB7XG4gICAgLyoqIENob29zZSBjb25jcmV0ZSBpbXBsZW1lbnRhdGlvblxuICAgICAqIFBhcmFtZXRlciBoaXJlcmNoeSBmb3IgZ3JhcGggdHJhdmVyc2FsIGltcGxlbWVudGF0aW9uczogKDEgYXMgZmlyc3QgcHJpb3JpdHkpXG4gICAgICogMS4gc2hhcmVkIGNvbnRleHQgY29uZmlndXJhdGlvbnMgLSB0aGF0IGNvdWxkIGJlIHVzZWQgYXMgb3ZlcndyaXRpbmcgdmFsdWVzLiBlLmcuIG5vZGVJbnN0YW5jZVtDb250ZXh0LmdldFNoYXJlZENvbnRleHRdLmNvbmNlcmV0ZUltcGxlbWVudGF0aW9uS2V5c1xuICAgICAqIDIuIGNhbGwgcGFyYW1ldGVycyB0aGF0IGFyZSBwYXNzZWQgZGlyZWN0bHlcbiAgICAgKiAzLiBub2RlIGluc3RhbmNlIGNvbmZpZ3VyYXRpb24vcHJvcGVydGllc1xuICAgICAqIDQuIGRlZmF1bHQgdmFsdWVzIHNwZWNpZmllZCBpbiB0aGUgZnVuY3Rpb24gc2NvcGUuXG4gICAgICovXG4gICAgbGV0IHsgbm9kZUluc3RhbmNlLCBpbXBsZW1lbnRhdGlvbktleTogcGFyYW1ldGVySW1wbGVtZW50YXRpb25LZXkgPSB7fSwgZ3JhcGhJbnN0YW5jZSB9ID0gYXJndW1lbnRzTGlzdFswXSxcbiAgICAgIHsgcGFyZW50VHJhdmVyc2FsQXJnIH0gPSBhcmd1bWVudHNMaXN0WzFdXG5cbiAgICAvLyBUT0RPOiByZWZhY3RvciBwYXJhbWV0ZXIgaGlyZXJjaHkgbWVyZ2luZyB0byBiZSBtb3JlIHJlYWRhYmxlLlxuICAgIC8vIGltcGxlbWVudGF0aW9uIGtleXMgb2Ygbm9kZSBpbnN0YW5jZSBvd24gY29uZmlnIHBhcmFtZXRlcnMgYW5kIG9mIGRlZmF1bHQgdmFsdWVzIHNldCBpbiBmdW5jdGlvbiBzY29wZVxuICAgIGxldCBpbXBsZW1lbnRhdGlvbktleSA9XG4gICAgICB7XG4gICAgICAgIHByb2Nlc3NEYXRhOiAncmV0dXJuRGF0YUl0ZW1LZXknLFxuICAgICAgICBoYW5kbGVQcm9wYWdhdGlvbjogJ2Nocm9ub2xvZ2ljYWwnLFxuICAgICAgICB0cmF2ZXJzZU5vZGU6ICdpdGVyYXRlRm9yaycsXG4gICAgICAgIGFnZ3JlZ2F0b3I6ICdBZ2dyZWdhdG9yQXJyYXknLFxuICAgICAgICB0cmF2ZXJzYWxJbnRlcmNlcHRpb246ICdwcm9jZXNzVGhlblRyYXZlcnNlJyB8fCAndHJhdmVyc2VUaGVuUHJvY2VzcycsXG4gICAgICAgIGV2YWx1YXRlUG9zaXRpb246ICdldmFsdWF0ZUNvbmRpdGlvbicsXG4gICAgICB9IHw+IHJlbW92ZVVuZGVmaW5lZEZyb21PYmplY3QgLy8gcmVtb3ZlIHVuZGVmaW5lZCB2YWx1ZXMgYmVjYXVzZSBuYXRpdmUgT2JqZWN0LmFzc2lnbiBkb2Vzbid0IG92ZXJyaWRlIGtleXMgd2l0aCBgdW5kZWZpbmVkYCB2YWx1ZXNcblxuICAgIC8vIENvbnRleHQgaW5zdGFuY2UgcGFyYW1ldGVyXG4gICAgbGV0IGNvbnRleHRJbXBsZW1lbnRhdGlvbktleSA9IChncmFwaEluc3RhbmNlW0NvbnRleHQucmVmZXJlbmNlLmtleS5nZXR0ZXJdID8gZ3JhcGhJbnN0YW5jZVtDb250ZXh0LnJlZmVyZW5jZS5rZXkuZ2V0dGVyXSgpPy5pbXBsZW1lbnRhdGlvbktleSA6IHt9KSB8fCB7fVxuICAgIC8vIHBhcmVudCBhcmd1bWVudHNcbiAgICBsZXQgcGFyZW50SW1wbGVtZW50YXRpb25LZXkgPSBwYXJlbnRUcmF2ZXJzYWxBcmcgPyBwYXJlbnRUcmF2ZXJzYWxBcmdbMF0uaW1wbGVtZW50YXRpb25LZXkgfHwge30gOiB7fVxuICAgIC8vIG92ZXJ3cml0ZSAoZm9yIGFsbCBzdWJ0cmF2ZXJzYWxzKSBpbXBsZW1lbnRhdGlvbiB0aHJvdWdoIGRpcmVjdGx5IHBhc3NlZCBwYXJhbWV0ZXJzIC0gb3ZlcndyaXRhYmxlIHRyYXZlcnNhbCBpbXBsZW1lbnRhdGlvbiBpZ25vcmluZyBlYWNoIG5vZGVzIGNvbmZpZ3VyYXRpb24sIGkuZS4gb3ZlcndyaXRhYmxlIG92ZXIgbm9kZUluc3RhbmNlIG93biBwcm9wZXJ0eSBpbXBsZW1lbnRhdGlvbiBrZXlzXG4gICAgaW1wbGVtZW50YXRpb25LZXlcbiAgICAgIHw+ICh0YXJnZXRPYmplY3QgPT5cbiAgICAgICAgT2JqZWN0LmFzc2lnbih0YXJnZXRPYmplY3QsIHBhcmVudEltcGxlbWVudGF0aW9uS2V5LCBpbXBsZW1lbnRhdGlvbktleSwgcGFyYW1ldGVySW1wbGVtZW50YXRpb25LZXkgfD4gcmVtb3ZlVW5kZWZpbmVkRnJvbU9iamVjdCwgY29udGV4dEltcGxlbWVudGF0aW9uS2V5IHw+IHJlbW92ZVVuZGVmaW5lZEZyb21PYmplY3QpKVxuICAgIGFyZ3VtZW50c0xpc3RbMF0uaW1wbGVtZW50YXRpb25LZXkgPSBpbXBsZW1lbnRhdGlvbktleVxuXG4gICAgLy8gZ2V0IGltcGxlbWVudGF0aW9uIGZ1bmN0aW9uc1xuICAgIGxldCBpbXBsZW1lbnRhdGlvbiA9IHtcbiAgICAgIGRhdGFQcm9jZXNzOiBncmFwaEluc3RhbmNlLnRyYXZlcnNhbC5wcm9jZXNzRGF0YVtpbXBsZW1lbnRhdGlvbktleS5wcm9jZXNzRGF0YV0sXG4gICAgICBoYW5kbGVQcm9wYWdhdGlvbjogZ3JhcGhJbnN0YW5jZS50cmF2ZXJzYWwuaGFuZGxlUHJvcGFnYXRpb25baW1wbGVtZW50YXRpb25LZXkuaGFuZGxlUHJvcGFnYXRpb25dLFxuICAgICAgdHJhdmVyc2VOb2RlOiBncmFwaEluc3RhbmNlLnRyYXZlcnNhbC50cmF2ZXJzZU5vZGVbaW1wbGVtZW50YXRpb25LZXkudHJhdmVyc2VOb2RlXSxcbiAgICAgIHRyYXZlcnNhbEludGVyY2VwdGlvbjogZ3JhcGhJbnN0YW5jZS50cmF2ZXJzYWwudHJhdmVyc2FsSW50ZXJjZXB0aW9uW2ltcGxlbWVudGF0aW9uS2V5LnRyYXZlcnNhbEludGVyY2VwdGlvbl0gfHwgKCh7IHRhcmdldEZ1bmN0aW9uIH0pID0+IG5ldyBQcm94eSh0YXJnZXRGdW5jdGlvbiwge30pKSwgLy8gaW4gY2FzZSBubyBpbXBsZW1lbnRhdGlvbiBleGlzdHMgZm9yIGludGVyY2VwdGluZyB0cmF2ZXJzYWwsIHVzZSBhbiBlbXB0eSBwcm94eS5cbiAgICAgIGFnZ3JlZ2F0b3I6IGdyYXBoSW5zdGFuY2UudHJhdmVyc2FsLmFnZ3JlZ2F0b3JbaW1wbGVtZW50YXRpb25LZXkuYWdncmVnYXRvcl0sXG4gICAgICBldmFsdWF0ZVBvc2l0aW9uOiBncmFwaEluc3RhbmNlLnRyYXZlcnNhbC5ldmFsdWF0ZVBvc2l0aW9uW2ltcGxlbWVudGF0aW9uS2V5LmV2YWx1YXRlUG9zaXRpb25dLFxuICAgIH1cbiAgICBhc3NlcnQoXG4gICAgICBPYmplY3QuZW50cmllcyhpbXBsZW1lbnRhdGlvbikuZXZlcnkoKFtrZXksIHZhbHVlXSkgPT4gQm9vbGVhbih2YWx1ZSkpLFxuICAgICAgJ+KAoiBBbGwgYGltcGxlbWVudGF0aW9uYCBjb25jZXJldGUgZnVuY3Rpb25zIG11c3QgYmUgcmVnaXN0ZXJlZCwgdGhlIGltcGxlbWVudGF0aW9uS2V5IHByb3ZpZGVkIGRvZXNuYHQgbWF0Y2ggYW55IG9mIHRoZSByZWdpc3RlcmVkIGltcGxlbWVudGFpb25zLicsXG4gICAgKVxuICAgIC8vIGRlZXAgbWVyZ2Ugb2YgbmVzdGVkIHBhcmFtZXRlciAoVE9ETzogdXNlIHV0aWxpdHkgZnVuY3Rpb24gZnJvbSBkaWZmZXJlbnQgbW9kdWxlIHRoYXQgZG9lcyB0aGlzIGZ1bmN0aW9uLilcbiAgICBhcmd1bWVudHNMaXN0ID0gbWVyZ2VEZWZhdWx0UGFyYW1ldGVyKHtcbiAgICAgIHBhc3NlZEFyZzogYXJndW1lbnRzTGlzdCxcbiAgICAgIGRlZmF1bHRBcmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIGltcGxlbWVudGF0aW9uLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KVxuXG4gICAgcmV0dXJuIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCB0aGlzQXJnLCBhcmd1bWVudHNMaXN0KVxuICB9KVxuICBhc3luYyB0cmF2ZXJzZShcbiAgICB7XG4gICAgICBncmFwaEluc3RhbmNlLFxuICAgICAgbm9kZUluc3RhbmNlLFxuICAgICAgdHJhdmVyc2FsSXRlcmF0b3JGZWVkLCAvLyBpdGVyYXRvciBwcm92aWRpbmcgbm9kZSBwYXJhbWV0ZXJzIGZvciByZWN1cnNpdmUgdHJhdmVyc2FsIGNhbGxzLlxuICAgICAgdHJhdmVyc2FsRGVwdGgsIC8vIGxldmVsIG9mIHJlY3Vyc2lvbiAtIGFsbG93cyB0byBpZGVudGlmeSBlbnRyeXBvaW50IGxldmVsICh0b3BsZXZlbCkgdGhhdCBuZWVkcyB0byByZXR1cm4gdGhlIHZhbHVlIG9mIGFnZ3JlZ2F0b3IuXG4gICAgICBwYXRoLFxuICAgICAgY29uY3JldGVUcmF2ZXJzYWwsIC8vIGltcGxlbWVudGF0aW9uIHJlZ2lzdGVyZWQgZnVuY3Rpb25zXG4gICAgICBpbXBsZW1lbnRhdGlvbktleSwgLy8gdXNlZCBieSBkZWNvcmF0b3IgdG8gcmV0cmVpdmUgaW1wbGVtZW50YXRpb24gZnVuY3Rpb25zXG4gICAgICBpbXBsZW1lbnRhdGlvbiwgLy8gaW1wbGVtZW50YXRpb24gZnVuY3Rpb25zXG4gICAgICBhZGRpdGlvbmFsQ2hpbGROb2RlLFxuICAgICAgZXZlbnRFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpLCAvLyBjcmVhdGUgYW4gZXZlbnQgZW1pdHRlciB0byBjYXRjaCBldmVudHMgZnJvbSBuZXN0ZWQgbm9kZXMgb2YgdGhpcyBub2RlIGR1cmluZyB0aGVpciB0cmF2ZXJzYWxzLlxuICAgICAgYWdncmVnYXRvciA9IG5ldyAobm9kZUluc3RhbmNlOjppbXBsZW1lbnRhdGlvbi5hZ2dyZWdhdG9yKSgpLCAvLyB1c2VkIHRvIGFnZ3JlZ2F0ZSByZXN1bHRzIG9mIG5lc3RlZCBub2Rlcy5cbiAgICAgIG5vZGVUeXBlLCAvLyB0aGUgdHlwZSBvZiBub2RlIHRvIHRyYXZlcnNlXG4gICAgICBldmFsdWF0aW9uLCAvLyBldmFsdWF0aW9uIG9iamVjdCB0aGF0IGNvbnRhaW5zIGNvbmZpZ3VyYXRpb24gcmVsYXRpbmcgdG8gdHJhdmVyc2VyIGFjdGlvbiBvbiB0aGUgY3VycmVudCBwb3NpdGlvblxuICAgIH06IHtcbiAgICAgIGdyYXBoSW5zdGFuY2U6IEdyYXBoLFxuICAgICAgbm9kZUluc3RhbmNlOiBTdHJpbmcgfCBOb2RlLFxuICAgICAgY29uY3JldGVUcmF2ZXJzYWw6IEdyYXBoVHJhdmVyc2FsIC8qKiBUT0RPOiBDdXJyZW50bHkgaXQgaXMgYW4gb2JqZWN0IGRlcml2ZWQgZnJvbSBhIEdyYXBoVHJhdmVyc2FsIGluc3RhbmNlICovLFxuICAgICAgdHJhdmVyc2FsRGVwdGg6IE51bWJlcixcbiAgICAgIGltcGxlbWVudGFpb246IE9iamVjdCxcbiAgICAgIGltcGxlbWVudGF0aW9uS2V5OiB7XG4gICAgICAgIC8vIHRoZSB0aGUgZGVmYXVsdCByZWdpc3RlcmVkIGltcGxlbWVudGF0aW9ucyBvciBpbnRlcm5hbCBtb2R1bGUgaW1wbGVtZW50YXRpb25zLlxuICAgICAgICBwcm9jZXNzRGF0YTogJ3JldHVybkRhdGFJdGVtS2V5JyB8ICdyZXR1cm5LZXknIHwgJ3RpbWVvdXQnLFxuICAgICAgICB0cmF2ZXJzZU5vZGU6ICdhbGxQcm9taXNlJyB8ICdjaHJvbm9sb2dpY2FsJyB8ICdyYWNlRmlyc3RQcm9taXNlJyxcbiAgICAgICAgYWdncmVnYXRvcjogJ0FnZ3JlZ2F0b3JBcnJheScgfCAnQ29uZGl0aW9uQ2hlY2snLFxuICAgICAgICB0cmF2ZXJzYWxJbnRlcmNlcHRpb246ICdwcm9jZXNzVGhlblRyYXZlcnNlJyB8ICdjb25kaXRpb25DaGVjaycsXG4gICAgICB9LFxuICAgICAgbm9kZVR5cGU6ICdTdGFnZScsXG4gICAgICBldmFsdWF0aW9uOiB7XG4gICAgICAgIHByb2Nlc3M6ICdpbmNsdWRlJyB8ICdleGNsdWRlJywgLy8gZXhlY3V0ZSAmIGluY2x1ZGUgb3IgZG9uJ3QgZXhlY3V0ZSAmIGV4Y2x1ZGUgZnJvbSBhZ2dyZWdhdGVkIHJlc3VsdHMuXG4gICAgICAgIHRyYXZlcnNlOiAnY29udGludWUnIHwgJ2JyZWFrJywgLy8gdHJhdmVyc2UgbmVpZ2hib3VycyBvciBub3QuXG4gICAgICB9LFxuICAgIH0gPSB7fSxcbiAgICB7IHBhcmVudFRyYXZlcnNhbEFyZyB9ID0ge30sXG4gICkge1xuICAgIGV2YWx1YXRpb24gfHw9IGF3YWl0IGdyYXBoSW5zdGFuY2UuZXZhbHVhdGVQb3NpdGlvbih7IGV2YWx1YXRpb24sIG5vZGU6IG5vZGVJbnN0YW5jZSwgaW1wbGVtZW50YXRpb246IG5vZGVJbnN0YW5jZTo6aW1wbGVtZW50YXRpb24uZXZhbHVhdGVQb3NpdGlvbiB9KVxuXG4gICAgLy8gQ29yZSBmdW5jdGlvbmFsaXR5IHJlcXVpcmVkIGlzIHRvIHRyYXZlcnNlIG5vZGVzLCBhbnkgYWRkaXRpb25hbCBpcyBhZGRlZCB0aHJvdWdoIGludGVyY2VwdGluZyB0aGUgdHJhdmVyc2FsLlxuICAgIHRyYXZlcnNhbEl0ZXJhdG9yRmVlZCB8fD0gZ3JhcGhJbnN0YW5jZTo6Z3JhcGhJbnN0YW5jZS50cmF2ZXJzZU5vZGUoe1xuICAgICAgbm9kZTogbm9kZUluc3RhbmNlLFxuICAgICAgaW1wbGVtZW50YXRpb246IGltcGxlbWVudGF0aW9uLnRyYXZlcnNlTm9kZSxcbiAgICAgIGhhbmRsZVByb3BhZ2F0aW9uSW1wbGVtZW50YXRpb246IGltcGxlbWVudGF0aW9uLmhhbmRsZVByb3BhZ2F0aW9uLFxuICAgICAgYWRkaXRpb25hbENoaWxkTm9kZSxcbiAgICB9KVxuXG4gICAgbGV0IGRhdGFQcm9jZXNzQ2FsbGJhY2sgPSBuZXh0UHJvY2Vzc0RhdGEgPT5cbiAgICAgIGdyYXBoSW5zdGFuY2U6OmdyYXBoSW5zdGFuY2UuZGF0YVByb2Nlc3MoeyBub2RlOiBub2RlSW5zdGFuY2UsIG5leHRQcm9jZXNzRGF0YSwgZXZhbHVhdGlvbiwgYWdncmVnYXRvciwgaW1wbGVtZW50YXRpb246IGltcGxlbWVudGF0aW9uLmRhdGFQcm9jZXNzLCBncmFwaEluc3RhbmNlIH0pXG5cbiAgICBsZXQgcHJveHlpZnkgPSB0YXJnZXQgPT4gZ3JhcGhJbnN0YW5jZTo6aW1wbGVtZW50YXRpb24udHJhdmVyc2FsSW50ZXJjZXB0aW9uKHsgdGFyZ2V0RnVuY3Rpb246IHRhcmdldCwgYWdncmVnYXRvciwgZGF0YVByb2Nlc3NDYWxsYmFjayB9KVxuICAgIGxldCByZXN1bHQgPSBhd2FpdCAoZ3JhcGhJbnN0YW5jZTo6Z3JhcGhJbnN0YW5jZS5yZWN1cnNpdmVJdGVyYXRpb24gfD4gcHJveHlpZnkpKHtcbiAgICAgIHRyYXZlcnNhbEl0ZXJhdG9yRmVlZCxcbiAgICAgIG5vZGVJbnN0YW5jZSxcbiAgICAgIHRyYXZlcnNhbERlcHRoLFxuICAgICAgZXZlbnRFbWl0dGVyLFxuICAgICAgZXZhbHVhdGlvbixcbiAgICAgIGFkZGl0aW9uYWxDaGlsZE5vZGUsXG4gICAgICBwYXJlbnRUcmF2ZXJzYWxBcmc6IGFyZ3VtZW50cyxcbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9LFxuXG4gIC8vXG4gIC8qKlxuICAgKiBOb2RlJ3MgaW5jbHVkZS9leGNsdWRlIGV2YWx1YXRpb24gLSBldmFsdWF0ZSB3aGV0aGVyIG9yIG5vdCBhIG5vZGUgd2hvdWxkIGJlIGluY2x1ZGVkIGluIHRoZSBub2RlIGZlZWQgYW5kIHN1YnNlcXVlbnRseSBpbiB0aGUgdHJhdmVyc2FsLlxuICAgKiBjb250aW51ZSBjaGlsZCBub2RlcyB0cmF2ZXJzYWwgb3IgYnJlYWsgdHJhdmVyc2FsLlxuICAgKi9cbiAgZXZhbHVhdGVQb3NpdGlvbjogYXN5bmMgZnVuY3Rpb24oeyBldmFsdWF0aW9uLCBub2RlLCBpbXBsZW1lbnRhdGlvbiwgZ3JhcGhJbnN0YW5jZSA9IHRoaXMgfSkge1xuICAgIC8vIGRlZmF1bHQgdmFsdWVzXG4gICAgZXZhbHVhdGlvbiA9IG5ldyBFdmFsdWF0b3IoeyBwcm9wYWdhdGlvbjogZXZhbHVhdGlvbk9wdGlvbi5wcm9wYWdhdGlvbi5jb250aW51ZSwgYWdncmVnYXRpb246IGV2YWx1YXRpb25PcHRpb24uYWdncmVnYXRpb24uaW5jbHVkZSB9KSAvLyBOb3RlOiBBZGRpdGlvbmFsIGRlZmF1bHQgdmFsdWVzIGZvciBFdmFsdWF0b3IgY29uc3RydWN0b3IgYXJlIHNldCBhYm92ZSBkdXJpbmcgaW5pdGlhbGl6YXRpb24gb2YgRXZhbHVhdG9yIHN0YXRpYyBjbGFzcy5cbiAgICAvLyBtYW5pcHVsYXRlIGV2YWx1YXRpb24gY29uZmlnXG4gICAgYXdhaXQgaW1wbGVtZW50YXRpb24oeyBldmFsdWF0aW9uLCBub2RlLCBncmFwaEluc3RhbmNlIH0pXG4gICAgcmV0dXJuIGV2YWx1YXRpb25cbiAgfSxcblxuICAvKipcbiAgICogVGhlIHB1cnBvc2Ugb2YgdGhpcyBmdW5jdGlvbiBpcyB0byBmaW5kICYgeWllbGQgbmV4dCBub2Rlcy5cbiAgICogQHlpZWxkIG5vZGUgZmVlZFxuICAgKiovXG4gIHRyYXZlcnNlTm9kZTogYXN5bmMgZnVuY3Rpb24qKHsgbm9kZSwgYWRkaXRpb25hbENoaWxkTm9kZSwgaW1wbGVtZW50YXRpb24sIGhhbmRsZVByb3BhZ2F0aW9uSW1wbGVtZW50YXRpb24sIGdyYXBoSW5zdGFuY2UgPSB0aGlzIH0pIHtcbiAgICBsZXQgdHJhdmVyc2FsSXRlcmF0b3JGZWVkID0gYXdhaXQgbm9kZTo6aW1wbGVtZW50YXRpb24oeyBub2RlLCBhZGRpdGlvbmFsQ2hpbGROb2RlLCBncmFwaEluc3RhbmNlIH0pXG4gICAgYXN5bmMgZnVuY3Rpb24qIHRyYXBBc3luY0l0ZXJhdG9yKGl0ZXJhdG9yKSB7XG4gICAgICBmb3IgYXdhaXQgKGxldCB0cmF2ZXJzYWxJdGVyYXRpb24gb2YgaXRlcmF0b3IpIHtcbiAgICAgICAgbGV0IF9oYW5kbGVQcm9wYWdhdGlvbkltcGxlbWVudGF0aW9uXG4gICAgICAgIGlmICh0cmF2ZXJzYWxJdGVyYXRpb24udHJhdmVyc2FsQ29uZmlnLmhhbmRsZVByb3BhZ2F0aW9uSW1wbGVtZW50YXRpb24pIHtcbiAgICAgICAgICBfaGFuZGxlUHJvcGFnYXRpb25JbXBsZW1lbnRhdGlvbiA9IGdyYXBoSW5zdGFuY2UudHJhdmVyc2FsLmhhbmRsZVByb3BhZ2F0aW9uW3RyYXZlcnNhbEl0ZXJhdGlvbi50cmF2ZXJzYWxDb25maWcuaGFuZGxlUHJvcGFnYXRpb25JbXBsZW1lbnRhdGlvbl1cbiAgICAgICAgICBhc3NlcnQoX2hhbmRsZVByb3BhZ2F0aW9uSW1wbGVtZW50YXRpb24sIGDigKIgXCIke3RyYXZlcnNhbEl0ZXJhdGlvbi50cmF2ZXJzYWxDb25maWcuaGFuZGxlUHJvcGFnYXRpb25JbXBsZW1lbnRhdGlvbn1cIiBpbXBsZW1lbnRhdGlvbiBpc24ndCByZWdpc3RlcmVkIGluIHRyYXZlcnNhbCBjb25jcmV0ZSBpbnN0YW5jZS5gKVxuICAgICAgICB9IGVsc2UgX2hhbmRsZVByb3BhZ2F0aW9uSW1wbGVtZW50YXRpb24gPSBoYW5kbGVQcm9wYWdhdGlvbkltcGxlbWVudGF0aW9uXG4gICAgICAgIGxldCBuZXh0SXRlcmF0b3IgPSBncmFwaEluc3RhbmNlOjpncmFwaEluc3RhbmNlLmhhbmRsZVByb3BhZ2F0aW9uKHsgbm9kZUl0ZXJhdG9yRmVlZDogdHJhdmVyc2FsSXRlcmF0aW9uLm5leHRJdGVyYXRvciwgaW1wbGVtZW50YXRpb246IG5vZGU6Ol9oYW5kbGVQcm9wYWdhdGlvbkltcGxlbWVudGF0aW9uIH0pXG4gICAgICAgIHlpZWxkIHsgbmV4dEl0ZXJhdG9yLCBmb3JrTm9kZTogdHJhdmVyc2FsSXRlcmF0aW9uLmZvcmtOb2RlIH1cbiAgICAgIH1cbiAgICB9XG4gICAgeWllbGQqIHRyYXBBc3luY0l0ZXJhdG9yKHRyYXZlcnNhbEl0ZXJhdG9yRmVlZClcbiAgfSxcblxuICAvKipcbiAgICogSGFuZGxlcyB0aGUgZ3JhcGggdHJhdmVyc2FsIHByb3BhZ2F0aW9uIG9yZGVyXG4gICAqIEB5aWVsZHMgYSB0cmF2ZXJzYWwgY29uZmlndXJhdGlvbiBmZWVkL2l0ZXJhdG9yXG4gICAqIEByZXR1cm4gcmVzdWx0cyBhcnJheVxuICAgKiovXG4gIGhhbmRsZVByb3BhZ2F0aW9uOiBhc3luYyBmdW5jdGlvbiooeyBub2RlSXRlcmF0b3JGZWVkLCBpbXBsZW1lbnRhdGlvbiAvKiogQ29udHJvbHMgdGhlIGl0ZXJhdGlvbiBvdmVyIG5vZGVzIGFuZCBleGVjdXRpb24gYXJyYW5nZW1lbnQuICovLCBncmFwaEluc3RhbmNlID0gdGhpcyB9KSB7XG4gICAgbGV0IHsgZXZlbnRFbWl0dGVyQ2FsbGJhY2s6IGVtaXQgfSA9IGZ1bmN0aW9uLnNlbnRcbiAgICBsZXQgdHJhdmVyc2FsSXRlcmF0b3JGZWVkID0gaW1wbGVtZW50YXRpb24oeyBub2RlSXRlcmF0b3JGZWVkLCBlbWl0IH0pIC8vIHBhc3MgaXRlcmF0b3IgdG8gaW1wbGVtZW50YXRpb24gYW5kIHByb3BhZ2F0ZSBiYWNrICh0aHJvdWdoIHJldHVybiBzdGF0ZW1lbnQpIHRoZSByZXN1bHRzIG9mIHRoZSBub2RlIHByb21pc2VzIGFmdGVyIGNvbXBsZXRpb25cbiAgICBhc3luYyBmdW5jdGlvbiogdHJhcEFzeW5jSXRlcmF0b3IoaXRlcmF0b3IpIHtcbiAgICAgIGxldCBpdGVyYXRvclJlc3VsdCA9IGF3YWl0IGl0ZXJhdG9yLm5leHQoKVxuICAgICAgd2hpbGUgKCFpdGVyYXRvclJlc3VsdC5kb25lKSB7XG4gICAgICAgIGxldCB0cmF2ZXJzYWxDb25maWcgPSBpdGVyYXRvclJlc3VsdC52YWx1ZVxuICAgICAgICB5aWVsZCB0cmF2ZXJzYWxDb25maWdcbiAgICAgICAgbGV0IHsgcHJvbWlzZSB9ID0gZnVuY3Rpb24uc2VudFxuICAgICAgICBpdGVyYXRvclJlc3VsdCA9IGF3YWl0IGl0ZXJhdG9yLm5leHQoeyBwcm9taXNlIH0pXG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0b3JSZXN1bHQudmFsdWVcbiAgICB9XG4gICAgcmV0dXJuIHlpZWxkKiB0cmFwQXN5bmNJdGVyYXRvcih0cmF2ZXJzYWxJdGVyYXRvckZlZWQpXG4gIH0sXG5cbiAgLyoqXG4gICAqIENvbnRyb2xzIGV4ZWN1dGlvbiBvZiBub2RlIHRyYXZlcnNhbHMgJiBIYW5kcyBvdmVyIGNvbnRyb2wgdG8gaW1wbGVtZW50YXRpb246XG4gICAqICAxLiBBY2NlcHRzIG5ldyBub2RlcyBmcm9tIGltcGxlbWVudGluZyBmdW5jdGlvbi5cbiAgICogIDIuIHJldHVybnMgYmFjayB0byB0aGUgaW1wbGVtZW50aW5nIGZ1bmN0aW9uIGEgcHJvbWlzZSwgaGFuZGluZyBjb250cm9sIG9mIGZsb3cgYW5kIGFycmFnZW1lbnQgb2YgcnVubmluZyB0cmF2ZXJzYWxzLlxuICAgKi9cbiAgcmVjdXJzaXZlSXRlcmF0aW9uOiBhc3luYyBmdW5jdGlvbiooe1xuICAgIHRyYXZlcnNhbEl0ZXJhdG9yRmVlZCAvKipGZWVkaW5nIGl0ZXJhdG9yIHRoYXQgd2lsbCBhY2NlcHQgbm9kZSBwYXJhbWV0ZXJzIGZvciB0cmF2ZXJzYWxzKi8sXG4gICAgZ3JhcGhJbnN0YW5jZSA9IHRoaXMsXG4gICAgcmVjdXJzaXZlQ2FsbGJhY2sgPSBncmFwaEluc3RhbmNlOjpncmFwaEluc3RhbmNlLnRyYXZlcnNlLFxuICAgIHRyYXZlcnNhbERlcHRoLFxuICAgIGV2ZW50RW1pdHRlcixcbiAgICBldmFsdWF0aW9uLFxuICAgIGFkZGl0aW9uYWxDaGlsZE5vZGUsXG4gICAgcGFyZW50VHJhdmVyc2FsQXJnLFxuICB9OiB7XG4gICAgZXZlbnRFbWl0dGVyOiBFdmVudCxcbiAgfSkge1xuICAgIGlmICghZXZhbHVhdGlvbi5zaG91bGRDb250aW51ZSgpKSByZXR1cm4gLy8gc2tpcCB0cmF2ZXJzYWxcbiAgICBsZXQgZXZlbnRFbWl0dGVyQ2FsbGJhY2sgPSAoLi4uYXJncykgPT4gZXZlbnRFbWl0dGVyLmVtaXQoJ25vZGVUcmF2ZXJzYWxDb21wbGV0ZWQnLCAuLi5hcmdzKVxuICAgIHRyYXZlcnNhbERlcHRoICs9IDEgLy8gaW5jcmVhc2UgdHJhdmVyc2FsIGRlcHRoXG4gICAgZm9yIGF3YWl0IChsZXQgdHJhdmVyc2FsSXRlcmF0aW9uIG9mIHRyYXZlcnNhbEl0ZXJhdG9yRmVlZCkge1xuICAgICAgbGV0IG4gPSB7IGl0ZXJhdG9yOiB0cmF2ZXJzYWxJdGVyYXRpb24ubmV4dEl0ZXJhdG9yLCByZXN1bHQ6IGF3YWl0IHRyYXZlcnNhbEl0ZXJhdGlvbi5uZXh0SXRlcmF0b3IubmV4dCh7IGV2ZW50RW1pdHRlckNhbGxiYWNrOiBldmVudEVtaXR0ZXJDYWxsYmFjayB9KSB9XG4gICAgICB3aGlsZSAoIW4ucmVzdWx0LmRvbmUpIHtcbiAgICAgICAgbGV0IG5leHROb2RlID0gbi5yZXN1bHQudmFsdWUubm9kZVxuICAgICAgICAvLyDwn5SBIHJlY3Vyc2lvbiBjYWxsXG4gICAgICAgIGxldCBuZXh0Q2FsbEFyZ3VtZW50ID0gW09iamVjdC5hc3NpZ24oeyBub2RlSW5zdGFuY2U6IG5leHROb2RlLCB0cmF2ZXJzYWxEZXB0aCwgYWRkaXRpb25hbENoaWxkTm9kZSB9KSwgeyBwYXJlbnRUcmF2ZXJzYWxBcmcgfV1cbiAgICAgICAgbGV0IHByb21pc2UgPSByZWN1cnNpdmVDYWxsYmFjayguLi5uZXh0Q2FsbEFyZ3VtZW50KVxuICAgICAgICBuLnJlc3VsdCA9IGF3YWl0IG4uaXRlcmF0b3IubmV4dCh7IHByb21pc2UgfSlcbiAgICAgIH1cbiAgICAgIC8vIGxhc3Qgbm9kZSBpdGVyYXRvciBmZWVkIHNob3VsZCBiZSBhbiBhcnJheSBvZiByZXNvbHZlZCBub2RlIHByb21pc2VzIHRoYXQgd2lsbCBiZSBmb3J3YXJkZWQgdGhyb3VnaCB0aGlzIGZ1bmN0aW9uXG4gICAgICBsZXQgcG9ydFRyYXZlcnNhbFJlc3VsdCA9IHsgY29uZmlnOiB7IG5hbWU6IHRyYXZlcnNhbEl0ZXJhdGlvbi5mb3JrTm9kZS5wcm9wZXJ0aWVzLm5hbWUgfSwgcmVzdWx0OiBuLnJlc3VsdC52YWx1ZSB9XG4gICAgICB5aWVsZCBwb3J0VHJhdmVyc2FsUmVzdWx0IC8vIGZvcndhcmQgYXJyYXkgb2YgcmVzb2x2ZWQgcmVzdWx0c1xuICAgIH1cbiAgfSxcblxuICBkYXRhUHJvY2VzczogYXN5bmMgZnVuY3Rpb24oeyBub2RlLCBuZXh0UHJvY2Vzc0RhdGEsIGFnZ3JlZ2F0b3IsIGV2YWx1YXRpb24sIGltcGxlbWVudGF0aW9uLCBncmFwaEluc3RhbmNlIH0pIHtcbiAgICBpZiAoIWV2YWx1YXRpb24uc2hvdWxkRXhlY3V0ZVByb2Nlc3MoKSkgcmV0dXJuIG51bGxcbiAgICBsZXQgZXhlY3V0ZUNvbm5lY3Rpb25BcnJheSA9IGF3YWl0IGdyYXBoSW5zdGFuY2UuZGF0YWJhc2UuZ2V0Tm9kZUNvbm5lY3Rpb24oeyBkaXJlY3Rpb246ICdvdXRnb2luZycsIG5vZGVJRDogbm9kZS5pZGVudGl0eSwgY29ubmVjdGlvblR5cGU6IGNvbm5lY3Rpb25UeXBlLmV4ZWN1dGUgfSlcbiAgICBhc3NlcnQoZXhlY3V0ZUNvbm5lY3Rpb25BcnJheS5ldmVyeShuID0+IG4uZGVzdGluYXRpb24ubGFiZWxzLmluY2x1ZGVzKG5vZGVMYWJlbC5wcm9jZXNzKSksIGDigKIgVW5zdXBwb3J0ZWQgbm9kZSB0eXBlIGZvciBhIEVYRUNVVEUgY29ubmVjdGlvbi5gKSAvLyB2ZXJpZnkgbm9kZSB0eXBlXG4gICAgbGV0IHJlc291cmNlQ29ubmVjdGlvbkFycmF5ID0gYXdhaXQgZ3JhcGhJbnN0YW5jZS5kYXRhYmFzZS5nZXROb2RlQ29ubmVjdGlvbih7IGRpcmVjdGlvbjogJ2luY29taW5nJywgbm9kZUlEOiBub2RlLmlkZW50aXR5LCBjb25uZWN0aW9uVHlwZTogY29ubmVjdGlvblR5cGUucmVzb3VyY2UgfSlcbiAgICBhc3NlcnQocmVzb3VyY2VDb25uZWN0aW9uQXJyYXkuZXZlcnkobiA9PiBjb25uZWN0aW9uUHJvcGVydHkuY29udGV4dC5pbmNsdWRlcyhuLmNvbm5lY3Rpb24ucHJvcGVydGllcy5jb250ZXh0KSksIGDigKIgVW5zdXBwb3J0ZWQgcHJvcGVydHkgdmFsdWUgZm9yIGEgUkVTT1VSQ0UgY29ubmVjdGlvbi5gKSAvLyB2ZXJpZnkgbm9kZSB0eXBlXG4gICAgaWYgKGV4ZWN1dGVDb25uZWN0aW9uQXJyYXkubGVuZ3RoID09IDApIHJldHVybiBudWxsIC8vIHNraXAgaWYgbm8gZXhlY3V0ZSBjb25uZWN0aW9uXG5cbiAgICBsZXQgcmVzb3VyY2VSZWxhdGlvblxuICAgIGlmIChyZXNvdXJjZUNvbm5lY3Rpb25BcnJheS5sZW5ndGggPiAwKSByZXNvdXJjZVJlbGF0aW9uID0gcmVzb3VyY2VDb25uZWN0aW9uQXJyYXlbMF1cblxuICAgIGxldCBleGVjdXRlQ29ubmVjdGlvbiA9IGV4ZWN1dGVDb25uZWN0aW9uQXJyYXlbMF0uY29ubmVjdGlvblxuICAgIGxldCBkYXRhUHJvY2Vzc0ltcGxlbWVudGF0aW9uXG4gICAgaWYgKGV4ZWN1dGVDb25uZWN0aW9uLnByb3BlcnRpZXMucHJvY2Vzc0RhdGFJbXBsZW1lbnRhdGlvbikge1xuICAgICAgZGF0YVByb2Nlc3NJbXBsZW1lbnRhdGlvbiA9IGdyYXBoSW5zdGFuY2UudHJhdmVyc2FsLnByb2Nlc3NEYXRhW2V4ZWN1dGVDb25uZWN0aW9uLnByb3BlcnRpZXMucHJvY2Vzc0RhdGFJbXBsZW1lbnRhdGlvbl1cbiAgICAgIGFzc2VydChkYXRhUHJvY2Vzc0ltcGxlbWVudGF0aW9uLCBg4oCiIFwiJHtleGVjdXRlQ29ubmVjdGlvbi5wcm9wZXJ0aWVzLnByb2Nlc3NEYXRhSW1wbGVtZW50YXRpb259XCIgaW1wbGVtZW50YXRpb24gaXNuJ3QgcmVnaXN0ZXJlZCBpbiB0cmF2ZXJzYWwgY29uY3JldGUgaW5zdGFuY2UuYClcbiAgICB9IGVsc2UgZGF0YVByb2Nlc3NJbXBsZW1lbnRhdGlvbiA9IGltcGxlbWVudGF0aW9uXG5cbiAgICBsZXQgZXhlY3V0ZU5vZGUgPSBleGVjdXRlQ29ubmVjdGlvbkFycmF5WzBdLmRlc3RpbmF0aW9uXG4gICAgLy8gRXhlY3V0ZSBub2RlIGRhdGFJdGVtXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IG5vZGU6OmRhdGFQcm9jZXNzSW1wbGVtZW50YXRpb24oeyBub2RlOiBleGVjdXRlTm9kZSwgcmVzb3VyY2VSZWxhdGlvbiwgZ3JhcGhJbnN0YW5jZSB9KVxuXG4gICAgaWYgKGV2YWx1YXRpb24uc2hvdWxkSW5jbHVkZVJlc3VsdCgpKSBhZ2dyZWdhdG9yLmFkZChyZXN1bHQpXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9LFxufSlcblxuLypcbiAgIF8gICAgICAgXyBfICAgXyAgICAgICBfIF8gICAgICAgICBcbiAgKF8pXyBfXyAoXykgfF8oXykgX18gX3wgKF8pX19fX19fXyBcbiAgfCB8ICdfIFxcfCB8IF9ffCB8LyBfYCB8IHwgfF8gIC8gXyBcXFxuICB8IHwgfCB8IHwgfCB8X3wgfCAoX3wgfCB8IHwvIC8gIF9fL1xuICB8X3xffCB8X3xffFxcX198X3xcXF9fLF98X3xfL19fX1xcX19ffFxuKi9cblByb3RvdHlwZTo6UHJvdG90eXBlW0NvbnN0cnVjdGFibGUucmVmZXJlbmNlLmluaXRpYWxpemUuZnVuY3Rpb25hbGl0eV0uc2V0dGVyKHtcbiAgW0VudGl0eS5yZWZlcmVuY2Uua2V5LmNvbmNlcmV0ZUJlaGF2aW9yXSh7IHRhcmdldEluc3RhbmNlLCBjb25jZXJldGVCZWhhdmlvckxpc3QgfSA9IHt9LCBwcmV2aW91c1Jlc3VsdCkge30sXG59KVxuXG4vKlxuICAgICAgICAgICAgICAgICAgICAgICBfICAgICAgICAgICAgICAgICAgIF8gICAgICAgICAgICAgXG4gICAgX19fIF9fXyAgXyBfXyAgX19ffCB8XyBfIF9fIF8gICBfICBfX198IHxfIF9fXyAgXyBfXyBcbiAgIC8gX18vIF8gXFx8ICdfIFxcLyBfX3wgX198ICdfX3wgfCB8IHwvIF9ffCBfXy8gXyBcXHwgJ19ffFxuICB8IChffCAoXykgfCB8IHwgXFxfXyBcXCB8X3wgfCAgfCB8X3wgfCAoX198IHx8IChfKSB8IHwgICBcbiAgIFxcX19fXFxfX18vfF98IHxffF9fXy9cXF9ffF98ICAgXFxfXyxffFxcX19ffFxcX19cXF9fXy98X3wgICBcbiovXG5Qcm90b3R5cGU6OlByb3RvdHlwZVtDb25zdHJ1Y3RhYmxlLnJlZmVyZW5jZS5jb25zdHJ1Y3Rvci5mdW5jdGlvbmFsaXR5XS5zZXR0ZXIoe1xuICAvKipcbiAgICogR3JhcGggd2lsbCBjb250YWluIHRoZSBwcm90b3R5cGUgY2hhaW4gdG8gaW5zdGFsbCBvbiB0aGUgaW5zdGFuY2VzIChwcmV2aW91c2x5ICdjbGFzc2VzIGhpZXJhcmNoeSBjb25uZWN0aW9uc2ApXG4gICAqIDEuIGNvbmZpZ3VyZWRDb25zdHJ1Y3RhYmxlMSA9IEdyYXBoKDxwbHVnaW5zPilcbiAgICogMi4gY29uZmlndXJlZENvbnN0cnVjdGFibGUyID0gY29uZmlndXJlZENvbnN0cnVjdGFibGUxKDxjb250ZXh0PilcbiAgICogMy4gbmV3IGNvbmZpZ3VyZWRDb25zdHJ1Y3RhYmxlMig8aW5zdGFuY2UgZGF0YT4pIC8vIGNyZWF0ZXMgaW5zdGFuY2VcbiAgICogNC4gdHJhdmVyc2UgZ3JhcGg6IGUuZy4gaW5zdGFuY2UudHJhdmVyc2VHcmFwaCgpXG4gICAqL1xuICBbUmVmZXJlbmNlLmtleS5jb25zdHJ1Y3Rvcl0oe1xuICAgIC8vIENvbmNlcmV0ZSBiZWhhdmlvcnMgLyBpbXBsZW1lbnRhaW9uc1xuICAgIC8vIGNhY2hlLFxuICAgIGRhdGFiYXNlLCAvLyBkYXRhYmFzZSBjb25jcmV0ZSBiZWhhdmlvclxuICAgIHRyYXZlcnNhbCwgLy8gdHJhdmVyc2FsIGNvbmNyZXRlIGJlaGF2aW9yXG4gICAgLy8gYWRkaXRpb25hbCBiZWhhdmlvcnNcbiAgICBjb25jcmV0ZUJlaGF2aW9yTGlzdCA9IFtdLFxuICAgIGRhdGEsIC8vIGRhdGEgdG8gYmUgbWVyZ2VkIGludG8gdGhlIGluc3RhbmNlXG4gICAgY2FsbGVyQ2xhc3MgPSB0aGlzLFxuICAgIG1vZGUgPSAnYXBwbGljYXRpb25Jbk1lbW9yeScgfHwgJ2RhdGFiYXNlSW5NZW1vcnknLFxuICB9OiB7XG4gICAgY2FjaGU6IENhY2hlLFxuICAgIGRhdGFiYXNlOiBEYXRhYmFzZSxcbiAgICB0cmF2ZXJzYWw6IEdyYXBoVHJhdmVyc2FsLFxuICAgIGNvbmNlcmV0ZUJlaGF2aW9yOiBMaXN0LFxuICB9KSB7XG4gICAgZGF0YWJhc2UgfHw9IG5ldyBEYXRhYmFzZS5jbGllbnRJbnRlcmZhY2Uoe1xuICAgICAgaW1wbGVtZW50YXRpb25MaXN0OiB7IGJvbHRDeXBoZXJNb2RlbEFkYXB0ZXI6IGJvbHRDeXBoZXJNb2RlbEFkYXB0ZXJGdW5jdGlvbigpIH0sXG4gICAgICBkZWZhdWx0SW1wbGVtZW50YXRpb246ICdib2x0Q3lwaGVyTW9kZWxBZGFwdGVyJyxcbiAgICB9KVxuICAgIHRyYXZlcnNhbCB8fD0gbmV3IEdyYXBoVHJhdmVyc2FsLmNsaWVudEludGVyZmFjZSh7XG4gICAgICBpbXBsZW1lbnRhdGlvbkxpc3Q6IHsgZGVmYXVsdEltcGxlbWVudGF0aW9uIH0sXG4gICAgICBkZWZhdWx0SW1wbGVtZW50YXRpb246ICdkZWZhdWx0SW1wbGVtZW50YXRpb24nLFxuICAgIH0pXG5cbiAgICAvLyBjYWNoZSB8fD0gbmV3IENhY2hlLmNsaWVudEludGVyZmFjZSh7IGdyb3VwS2V5QXJyYXk6IFsnbm9kZScsICdjb25uZWN0aW9uJ10gfSlcblxuICAgIGxldCBpbnN0YW5jZSA9IGNhbGxlckNsYXNzOjpDb25zdHJ1Y3RhYmxlW0NvbnN0cnVjdGFibGUucmVmZXJlbmNlLmNvbnN0cnVjdG9yLmZ1bmN0aW9uYWxpdHldLnN3aXRjaCh7IGltcGxlbWVudGF0aW9uS2V5OiBFbnRpdHkucmVmZXJlbmNlLmtleS5jb25jZXJldGVCZWhhdmlvciB9KSh7XG4gICAgICBjb25jcmV0ZUJlaGF2aW9yTGlzdDogWy4uLmNvbmNyZXRlQmVoYXZpb3JMaXN0LCAvKmNhY2hlLCovIGRhdGFiYXNlLCB0cmF2ZXJzYWxdLFxuICAgICAgZGF0YSxcbiAgICB9KVxuICAgIC8vIGV4cG9zZSBmdW5jdGlvbmFsaXR5IGZvciBkaXJlY3Qgc2ltcGxpZmllZCBhY2Nlc3M6XG4gICAgbGV0IGNvbmNlcmV0ZURhdGFiYXNlID0gaW5zdGFuY2VbRW50aXR5LnJlZmVyZW5jZS5nZXRJbnN0YW5jZU9mXShEYXRhYmFzZSlcbiAgICBpbnN0YW5jZS5kYXRhYmFzZSA9IGNvbmNlcmV0ZURhdGFiYXNlW0RhdGFiYXNlLnJlZmVyZW5jZS5rZXkuZ2V0dGVyXSgpXG4gICAgbGV0IGNvbmNyZXRlVHJhdmVyc2FsID0gaW5zdGFuY2VbRW50aXR5LnJlZmVyZW5jZS5nZXRJbnN0YW5jZU9mXShHcmFwaFRyYXZlcnNhbClcbiAgICBpbnN0YW5jZS50cmF2ZXJzYWwgPSBjb25jcmV0ZVRyYXZlcnNhbFtJbXBsZW1lbnRhdGlvbk1hbmFnZW1lbnQucmVmZXJlbmNlLmtleS5nZXR0ZXJdKClcbiAgICBsZXQgY29udGV4dCA9IGluc3RhbmNlW0VudGl0eS5yZWZlcmVuY2UuZ2V0SW5zdGFuY2VPZl0oQ29udGV4dClcbiAgICBpbnN0YW5jZS5jb250ZXh0ID0gY29udGV4dFtDb250ZXh0LnJlZmVyZW5jZS5rZXkuZ2V0dGVyXSgpXG5cbiAgICAvLyBjb25maWd1cmUgR3JhcGggZWxlbWVudCBjbGFzc2VzXG4gICAgLy8gaW5zdGFuY2UuY29uZmlndXJlZE5vZGUgPSBOb2RlLmNsaWVudEludGVyZmFjZSh7IHBhcmFtZXRlcjogW3sgY29uY3JldGVCZWhhdmlvckxpc3Q6IFtdIH1dIH0pXG4gICAgLy8gaW5zdGFuY2UuY29uZmlndXJlZENvbm5lY3Rpb24gPSBDb25uZWN0aW9uLmNsaWVudEludGVyZmFjZSh7IHBhcmFtZXRlcjogW3sgY29uY2VyZXRlQmVoYXZpb3I6IFtdIH1dIH0pXG5cbiAgICByZXR1cm4gaW5zdGFuY2VcbiAgfSxcbn0pXG5cbi8qXG4gICAgICAgIF8gXyAgICAgICAgICAgIF8gICBfX18gICAgICAgXyAgICAgICAgICAgICBfXyAgICAgICAgICAgICAgICBcbiAgICBfX198IChfKSBfX18gXyBfXyB8IHxffF8gX3xfIF9fIHwgfF8gX19fIF8gX18gLyBffCBfXyBfICBfX18gX19fIFxuICAgLyBfX3wgfCB8LyBfIFxcICdfIFxcfCBfX3x8IHx8ICdfIFxcfCBfXy8gXyBcXCAnX198IHxfIC8gX2AgfC8gX18vIF8gXFxcbiAgfCAoX198IHwgfCAgX18vIHwgfCB8IHxfIHwgfHwgfCB8IHwgfHwgIF9fLyB8ICB8ICBffCAoX3wgfCAoX3wgIF9fL1xuICAgXFxfX198X3xffFxcX19ffF98IHxffFxcX198X19ffF98IHxffFxcX19cXF9fX3xffCAgfF98ICBcXF9fLF98XFxfX19cXF9fX3xcbiovXG5HcmFwaC5jbGllbnRJbnRlcmZhY2UgPSBHcmFwaDo6UHJvdG90eXBlW0NvbnN0cnVjdGFibGUucmVmZXJlbmNlLmNsaWVudEludGVyZmFjZS5mdW5jdGlvbmFsaXR5XS5zd2l0Y2goe1xuICBpbXBsZW1lbnRhdGlvbktleTogRW50aXR5LnJlZmVyZW5jZS5rZXkuaW5zdGFuY2VEZWxlZ2F0aW5nVG9FbnRpdHlJbnN0YW5jZVByb3RvdHlwZSxcbn0pKHtcbiAgY29uc3RydWN0b3JJbXBsZW1lbnRhdGlvbjogUmVmZXJlbmNlLmtleS5jb25zdHJ1Y3RvcixcbiAgY2xpZW50SW50ZXJmYWNlSW50ZXJjZXB0Q2FsbGJhY2s6IGZhbHNlLFxufSlcbiJdfQ==