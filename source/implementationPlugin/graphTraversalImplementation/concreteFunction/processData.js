"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.returnDataItemKey = returnDataItemKey;exports.timeout = timeout;exports.switchCase = switchCase;exports.executeScriptSpawn = executeScriptSpawn;exports.executeScriptSpawnIgnoreError = executeScriptSpawnIgnoreError;exports.executeScriptSpawnAsynchronous = executeScriptSpawnAsynchronous;exports.executeShellscriptFile = executeShellscriptFile;exports.returnMiddlewareFunction = exports.immediatelyExecuteMiddleware = exports.checkConditionReference = exports.executeFunctionReference = void 0;var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));var _path = _interopRequireDefault(require("path"));
var _assert = _interopRequireDefault(require("assert"));
var _child_process = require("child_process");
var _graphSchemeReference = require("../../../graphModel/graphSchemeReference.js");

async function returnDataItemKey({ stageNode, processNode }) {var _processNode$properti, _processNode$properti2;
  if ((_processNode$properti = processNode.properties) === null || _processNode$properti === void 0 ? void 0 : _processNode$properti.name) return `${(_processNode$properti2 = processNode.properties) === null || _processNode$properti2 === void 0 ? void 0 : _processNode$properti2.name}`;
}


async function timeout({ node }) {var _node$properties, _node$properties2;
  if (typeof ((_node$properties = node.properties) === null || _node$properties === void 0 ? void 0 : _node$properties.timerDelay) != 'number') throw new Error('• DataItem must have a delay value.');
  let delay = (_node$properties2 = node.properties) === null || _node$properties2 === void 0 ? void 0 : _node$properties2.timerDelay;
  return await new Promise((resolve, reject) =>
  setTimeout(() => {var _node$properties3;

    resolve((_node$properties3 = node.properties) === null || _node$properties3 === void 0 ? void 0 : _node$properties3.name);
  }, delay));

}





const executeReference = (contextPropertyName) =>
async function ({ node, graphInstance }, { traverseCallContext }) {
  let referenceContext = graphInstance.context[contextPropertyName];
  (0, _assert.default)(referenceContext, `• Context "${contextPropertyName}" variable is required to reference functions from graph database strings.`);

  let resource;
  const { resourceArray } = await graphInstance.databaseWrapper.getResource({ concreteDatabase: graphInstance.database, nodeID: node.identity });
  if (resourceArray.length > 1) throw new Error(`• Multiple resource relationships are not supported for Process node.`);else
  if (resourceArray.length == 0) return;else
  resource = resourceArray[0];

  (0, _assert.default)(resource.source.labels.includes(_graphSchemeReference.nodeLabel.function), `• Unsupported Node type for resource connection.`);
  let functionName = resource.source.properties.functionName || function (e) {throw e;}(new Error(`• function resource must have a "functionName" - ${resource.source.properties.functionName}`));
  let functionCallback = referenceContext[functionName] || function (e) {throw e;}(new Error(`• reference function name doesn't exist.`));
  try {
    return await functionCallback({ node, context: graphInstance.context, traverseCallContext });
  } catch (error) {
    console.error(error) && process.exit();
  }
};


const executeFunctionReference = executeReference('functionContext');exports.executeFunctionReference = executeFunctionReference;








const checkConditionReference = executeReference('conditionContext');exports.checkConditionReference = checkConditionReference;

async function switchCase({ node, graphInstance, nextProcessData }, { traverseCallContext }) {
  const { caseArray, default: defaultRelationship } = await graphInstance.databaseWrapper.getSwitchElement({ concreteDatabase: graphInstance.database, nodeID: node.identity });
  const value = await graphInstance.databaseWrapper.getTargetValue({ concreteDatabase: graphInstance.database, nodeID: node.identity });





  let comparisonValue;
  if (value) comparisonValue = value;else
  comparisonValue = nextProcessData;


  let chosenNode;
  if (caseArray) {

    let caseRelationship = caseArray.filter(caseRelationship => {var _caseRelationship$con;return ((_caseRelationship$con = caseRelationship.connection.properties) === null || _caseRelationship$con === void 0 ? void 0 : _caseRelationship$con.expected) == comparisonValue;})[0];
    chosenNode = caseRelationship === null || caseRelationship === void 0 ? void 0 : caseRelationship.destination;
  }
  chosenNode || (chosenNode = defaultRelationship === null || defaultRelationship === void 0 ? void 0 : defaultRelationship.destination);

  return chosenNode || null;
}











const immediatelyExecuteMiddleware = async ({ node, graphInstance, nextProcessData }, { additionalParameter }) => {var _graphInstance$middle;
  const { nextFunction } = additionalParameter;
  let functionContext = graphInstance.context.functionContext;
  (0, _assert.default)(functionContext, `• Context "functionContext" variable is required to reference functions from graph database strings.`);
  (0, _assert.default)((_graphInstance$middle = graphInstance.middlewareParameter) === null || _graphInstance$middle === void 0 ? void 0 : _graphInstance$middle.context, `• Middleware graph traversal relies on graphInstance.middlewareParameter.context`);

  let resource;
  const { resourceArray } = await graphInstance.databaseWrapper.getResource({ concreteDatabase: graphInstance.database, nodeID: node.identity });
  if (resourceArray.length > 1) throw new Error(`• Multiple resource relationships are not supported for Process node.`);else
  if (resourceArray.length == 0) return;else
  resource = resourceArray[0];

  (0, _assert.default)(resource.source.labels.includes(_graphSchemeReference.nodeLabel.function), `• Unsupported Node type for resource connection.`);
  let functionName = resource.source.properties.functionName || function (e) {throw e;}(new Error(`• function resource must have a "functionName" - ${resource.source.properties.functionName}`));
  let middlewareFunction = functionContext[functionName] || function (e) {throw e;}(new Error(`• reference function name doesn't exist.`));
  try {
    await middlewareFunction(graphInstance.middlewareParameter.context, nextFunction);
    return middlewareFunction;
  } catch (error) {
    console.error(error) && process.exit();
  }
};exports.immediatelyExecuteMiddleware = immediatelyExecuteMiddleware;

const returnMiddlewareFunction = async ({ node, graphInstance }) => {
  let functionContext = graphInstance.context.functionContext;
  (0, _assert.default)(functionContext, `• Context "functionContext" variable is required to reference functions from graph database strings.`);

  let resource;
  const { resourceArray } = await graphInstance.databaseWrapper.getResource({ concreteDatabase: graphInstance.database, nodeID: node.identity });
  if (resourceArray.length > 1) throw new Error(`• Multiple resource relationships are not supported for Process node.`);else
  if (resourceArray.length == 0) return;else
  resource = resourceArray[0];

  (0, _assert.default)(resource.source.labels.includes(_graphSchemeReference.nodeLabel.function), `• Unsupported Node type for resource connection.`);
  let functionName = resource.source.properties.functionName || function (e) {throw e;}(new Error(`• function resource must have a "functionName" - ${resource.source.properties.functionName}`));
  let middlewareFunction = functionContext[functionName] || function (e) {throw e;}(new Error(`• reference function name doesn't exist.`));
  try {
    return middlewareFunction;
  } catch (error) {
    console.error(error) && process.exit();
  }
};exports.returnMiddlewareFunction = returnMiddlewareFunction;









let message = ` _____                          _        
| ____|__  __ ___   ___  _   _ | |_  ___ 
|  _|  \\ \\/ // _ \\ / __|| | | || __|/ _ \\
| |___  >  <|  __/| (__ | |_| || |_|  __/    
|_____|/_/\\_\\\\___| \\___| \\__,_| \\__|\\___|`;
const rootPath = _path.default.normalize(_path.default.join(__dirname, '../../../../'));

async function executeScriptSpawn({ node }) {
  let childProcess;
  try {
    console.log(message);
    console.log(`\x1b[45m%s\x1b[0m`, `${node.command} ${node.argument.join(' ')}`);
    childProcess = (0, _child_process.spawnSync)(node.command, node.argument, JSON.stringify(node.option));
    if (childProcess.status > 0) throw childProcess.error;
  } catch (error) {
    process.exit(childProcess.status);
  }

}

async function executeScriptSpawnIgnoreError({ node }) {
  let childProcess;
  try {
    console.log(message);
    console.log(`\x1b[45m%s\x1b[0m`, `${node.command} ${node.argument.join(' ')}`);
    childProcess = (0, _child_process.spawnSync)(node.command, node.argument, JSON.stringify(node.option));
    if (childProcess.status > 0) throw childProcess.error;
  } catch (error) {
    console.log(childProcess.status);
  }

}

async function executeScriptSpawnAsynchronous({ node }) {
  let childProcess;
  try {
    console.log(message);
    console.log(`\x1b[45m%s\x1b[0m`, `${node.command} ${node.argument.join(' ')}`);
    childProcess = (0, _child_process.spawn)(node.command, node.argument, JSON.stringify(node.option));
    if (childProcess.status > 0) throw childProcess.error;
  } catch (error) {
    process.exit(childProcess.status);
  }

}

async function executeShellscriptFile({ node, graphInstance }) {
  let contextPropertyName = 'fileContext',
  referenceContext = graphInstance.context[contextPropertyName];
  (0, _assert.default)(referenceContext, `• Context "${contextPropertyName}" variable is required to reference functions from graph database strings.`);

  let resource;
  const { resourceArray } = await graphInstance.databaseWrapper.getResource({ concreteDatabase: graphInstance.database, nodeID: node.identity });
  if (resourceArray.length > 1) throw new Error(`• Multiple resource relationships are not supported for Process node.`);else
  if (resourceArray.length == 0) return;else
  resource = resourceArray[0];
  let scriptReferenceKey = resource.source.properties.referenceKey;
  (0, _assert.default)(scriptReferenceKey, `• resource File node (with key: ${resource.source.properties.key}) must have "referenceKey" property.`);

  try {
    console.log(message);
    let scriptPath = referenceContext[scriptReferenceKey];
    (0, _assert.default)(scriptPath, `• referenceKey of File node (referenceKey = ${scriptReferenceKey}) was not found in the graphInstance context: ${referenceContext} `);
    console.log(`\x1b[45m%s\x1b[0m`, `shellscript path: ${scriptPath}`);
    (0, _child_process.execSync)(`sh ${scriptPath}`, { cwd: _path.default.dirname(scriptPath), shell: true, stdio: ['inherit', 'inherit', 'inherit'] });
  } catch (error) {
    throw error;
    process.exit(1);
  }

  return null;
}

















async function initializeNestedUnit({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null }) {


  let view = await nestedUnitInstance.loopInsertionPoint({ type: 'aggregateIntoTemplateObject' });

  (0, _assert.default)(this.portAppInstance.config.clientSidePath, "• clientSidePath cannot be undefined. i.e. previous middlewares should've set it");
  let templatePath = _path.default.join(this.portAppInstance.config.clientSidePath, unitInstance.file.filePath);
  let renderedContent;
  switch (unitInstance.processDataImplementation) {
    default:
    case 'underscoreRendering':
      renderedContent = await this.underscoreRendering({ templatePath, view });
      break;}


  switch (unitInstance.processRenderedContent) {
    case 'wrapJsTag':
      renderedContent = `<script type="module" async>${renderedContent}</script>`;
      break;
    default:}


  return renderedContent;
}

async function underscoreRendering({ templatePath, view }) {

  let templateString = await filesystem.readFileSync(templatePath, 'utf-8');

  const templateArgument = {
    templateController: this,
    context: this.portAppInstance.context,
    Application,
    argument: {} };

  let renderedContent = underscore.template(templateString)(
  Object.assign(
  {},
  templateArgument,
  { view, templateArgument }));


  return renderedContent;
}

function renderedContentString(viewName, viewObject) {

  if (viewObject[viewName] && Array.isArray(viewObject[viewName])) {
    return viewObject[viewName].join('');
  }
}

let traversePort = async function aggregateIntoTemplateObject() {
  let view = {};
  if (this.insertionPoint) {
    for (let insertionPoint of this.insertionPoint) {
      let children = await this.filterAndOrderChildren({ insertionPointKey: insertionPoint.key });
      let subsequent = await this.initializeInsertionPoint({ insertionPoint, children });
      if (!(insertionPoint.name in view)) view[insertionPoint.name] = [];
      Array.prototype.push.apply(view[insertionPoint.name], subsequent);
    }
  }
  return view;
};











































































let schema = () => {



















  const { add, execute, conditional, executionLevel } = require('@dependency/commonPattern/source/decoratorUtility.js');
  function schema({ thisArg }) {var _dec, _obj;


    let self = (_dec =
    executionLevel(), (_obj = {
      async initializeNestedUnit({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null, parent = this, argument = {} }) {


        if (this.executionLevel == 'topLevel') {
          nestedUnitInstance.requestOption = this.portAppInstance.context.request.body;
        } else {

          let fieldArray = parent.requestOption.field;
          if (fieldArray && fieldArray.length == 0 || !fieldArray) {
            nestedUnitInstance.requestOption = {};
          } else if (fieldArray) {
            nestedUnitInstance.requestOption = fieldArray.find(field => field.fieldName == unitInstance.fieldName);
          }
        }


        if (!nestedUnitInstance.requestOption) return;
        nestedUnitInstance.dataset = await unitInstance.resolveDataset({ parentResult: argument.dataset || parent.dataset });

        if (this.portAppInstance.context.request.body.schemaMode == 'nonStrict') {


        } else {
          _assert.default.notEqual(nestedUnitInstance.dataset, undefined, `• returned dataset cannot be undefined for fieldName: ${unitInstance.fieldName}.`);
        }


        let datasetHandling;
        if (Array.isArray(nestedUnitInstance.dataset) && nestedUnitInstance.children && nestedUnitInstance.children.length > 0) {

          datasetHandling = 'sequence';
        } else if (typeof nestedUnitInstance.dataset == 'object' && nestedUnitInstance.children && nestedUnitInstance.children.length > 0) {

          datasetHandling = 'nested';
        } else {

          datasetHandling = 'nonNested';
        }


        let object = {};
        switch (datasetHandling) {
          case 'sequence':
            let promiseArray = nestedUnitInstance.dataset.map(document => {
              let argument = {};
              argument['dataset'] = document;
              return nestedUnitInstance.loopInsertionPoint({ type: 'aggregateIntoContentArray', argument });
            });
            let subsequentDatasetArray = await Promise.all(promiseArray);
            object[unitInstance.fieldName] = subsequentDatasetArray.map((subsequentDataset, index) => {
              return this.formatDatasetOfNestedType({
                subsequentDataset,
                dataset: nestedUnitInstance.dataset[index],
                option: {
                  extrafield: nestedUnitInstance.requestOption.extrafield } });


            });

            break;
          case 'nested':
            let subsequentDataset = await nestedUnitInstance.loopInsertionPoint({ type: 'aggregateIntoContentArray' });
            object[unitInstance.fieldName] = this.formatDatasetOfNestedType({
              subsequentDataset,
              dataset: nestedUnitInstance.dataset,
              option: {
                extrafield: nestedUnitInstance.requestOption.extrafield } });



            break;
          default:
          case 'nonNested':

            object[unitInstance.fieldName] = nestedUnitInstance.dataset;

            break;}




        return object;
      },

      formatDatasetOfNestedType({ subsequentDataset, dataset, option }) {
        let object = {};
        subsequentDataset.forEach(field => {
          object = Object.assign(object, field);
        });
        if (option.extrafield) {

          object = Object.assign(dataset, object);
        }
        return object;
      } }, ((0, _applyDecoratedDescriptor2.default)(_obj, "initializeNestedUnit", [_dec], Object.getOwnPropertyDescriptor(_obj, "initializeNestedUnit"), _obj)), _obj));


    Object.keys(self).forEach(function (key) {
      self[key] = self[key].bind(thisArg);
    }, {});
    return self;
  }

  async function resolveDataset({
    parentResult = null })

  {

    let dataset;
    const algorithm = this.file.algorithm;
    switch (
    algorithm.type) {

      case 'file':
      default:
        {
          let module = require(algorithm.path).default;
          if (typeof module !== 'function') module = module.default;
          let resolver = module();
          let resolverArgument = Object.assign(...[this.args, algorithm.argument].filter(Boolean));
          dataset = await resolver({
            portClassInstance: this.portAppInstance,
            args: resolverArgument,
            parentResult });

        }
        break;}


    return dataset;
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NvdXJjZS9pbXBsZW1lbnRhdGlvblBsdWdpbi9ncmFwaFRyYXZlcnNhbEltcGxlbWVudGF0aW9uL2NvbmNyZXRlRnVuY3Rpb24vcHJvY2Vzc0RhdGEuanMiXSwibmFtZXMiOlsicmV0dXJuRGF0YUl0ZW1LZXkiLCJzdGFnZU5vZGUiLCJwcm9jZXNzTm9kZSIsInByb3BlcnRpZXMiLCJuYW1lIiwidGltZW91dCIsIm5vZGUiLCJ0aW1lckRlbGF5IiwiRXJyb3IiLCJkZWxheSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic2V0VGltZW91dCIsImV4ZWN1dGVSZWZlcmVuY2UiLCJjb250ZXh0UHJvcGVydHlOYW1lIiwiZ3JhcGhJbnN0YW5jZSIsInRyYXZlcnNlQ2FsbENvbnRleHQiLCJyZWZlcmVuY2VDb250ZXh0IiwiY29udGV4dCIsInJlc291cmNlIiwicmVzb3VyY2VBcnJheSIsImRhdGFiYXNlV3JhcHBlciIsImdldFJlc291cmNlIiwiY29uY3JldGVEYXRhYmFzZSIsImRhdGFiYXNlIiwibm9kZUlEIiwiaWRlbnRpdHkiLCJsZW5ndGgiLCJzb3VyY2UiLCJsYWJlbHMiLCJpbmNsdWRlcyIsIm5vZGVMYWJlbCIsImZ1bmN0aW9uIiwiZnVuY3Rpb25OYW1lIiwiZnVuY3Rpb25DYWxsYmFjayIsImVycm9yIiwiY29uc29sZSIsInByb2Nlc3MiLCJleGl0IiwiZXhlY3V0ZUZ1bmN0aW9uUmVmZXJlbmNlIiwiY2hlY2tDb25kaXRpb25SZWZlcmVuY2UiLCJzd2l0Y2hDYXNlIiwibmV4dFByb2Nlc3NEYXRhIiwiY2FzZUFycmF5IiwiZGVmYXVsdCIsImRlZmF1bHRSZWxhdGlvbnNoaXAiLCJnZXRTd2l0Y2hFbGVtZW50IiwidmFsdWUiLCJnZXRUYXJnZXRWYWx1ZSIsImNvbXBhcmlzb25WYWx1ZSIsImNob3Nlbk5vZGUiLCJjYXNlUmVsYXRpb25zaGlwIiwiZmlsdGVyIiwiY29ubmVjdGlvbiIsImV4cGVjdGVkIiwiZGVzdGluYXRpb24iLCJpbW1lZGlhdGVseUV4ZWN1dGVNaWRkbGV3YXJlIiwiYWRkaXRpb25hbFBhcmFtZXRlciIsIm5leHRGdW5jdGlvbiIsImZ1bmN0aW9uQ29udGV4dCIsIm1pZGRsZXdhcmVQYXJhbWV0ZXIiLCJtaWRkbGV3YXJlRnVuY3Rpb24iLCJyZXR1cm5NaWRkbGV3YXJlRnVuY3Rpb24iLCJtZXNzYWdlIiwicm9vdFBhdGgiLCJwYXRoIiwibm9ybWFsaXplIiwiam9pbiIsIl9fZGlybmFtZSIsImV4ZWN1dGVTY3JpcHRTcGF3biIsImNoaWxkUHJvY2VzcyIsImxvZyIsImNvbW1hbmQiLCJhcmd1bWVudCIsIkpTT04iLCJzdHJpbmdpZnkiLCJvcHRpb24iLCJzdGF0dXMiLCJleGVjdXRlU2NyaXB0U3Bhd25JZ25vcmVFcnJvciIsImV4ZWN1dGVTY3JpcHRTcGF3bkFzeW5jaHJvbm91cyIsImV4ZWN1dGVTaGVsbHNjcmlwdEZpbGUiLCJzY3JpcHRSZWZlcmVuY2VLZXkiLCJyZWZlcmVuY2VLZXkiLCJrZXkiLCJzY3JpcHRQYXRoIiwiY3dkIiwiZGlybmFtZSIsInNoZWxsIiwic3RkaW8iLCJpbml0aWFsaXplTmVzdGVkVW5pdCIsIm5lc3RlZFVuaXRLZXkiLCJhZGRpdGlvbmFsQ2hpbGROZXN0ZWRVbml0IiwicGF0aFBvaW50ZXJLZXkiLCJ2aWV3IiwibmVzdGVkVW5pdEluc3RhbmNlIiwibG9vcEluc2VydGlvblBvaW50IiwidHlwZSIsInBvcnRBcHBJbnN0YW5jZSIsImNvbmZpZyIsImNsaWVudFNpZGVQYXRoIiwidGVtcGxhdGVQYXRoIiwidW5pdEluc3RhbmNlIiwiZmlsZSIsImZpbGVQYXRoIiwicmVuZGVyZWRDb250ZW50IiwicHJvY2Vzc0RhdGFJbXBsZW1lbnRhdGlvbiIsInVuZGVyc2NvcmVSZW5kZXJpbmciLCJwcm9jZXNzUmVuZGVyZWRDb250ZW50IiwidGVtcGxhdGVTdHJpbmciLCJmaWxlc3lzdGVtIiwicmVhZEZpbGVTeW5jIiwidGVtcGxhdGVBcmd1bWVudCIsInRlbXBsYXRlQ29udHJvbGxlciIsIkFwcGxpY2F0aW9uIiwidW5kZXJzY29yZSIsInRlbXBsYXRlIiwiT2JqZWN0IiwiYXNzaWduIiwicmVuZGVyZWRDb250ZW50U3RyaW5nIiwidmlld05hbWUiLCJ2aWV3T2JqZWN0IiwiQXJyYXkiLCJpc0FycmF5IiwidHJhdmVyc2VQb3J0IiwiYWdncmVnYXRlSW50b1RlbXBsYXRlT2JqZWN0IiwiaW5zZXJ0aW9uUG9pbnQiLCJjaGlsZHJlbiIsImZpbHRlckFuZE9yZGVyQ2hpbGRyZW4iLCJpbnNlcnRpb25Qb2ludEtleSIsInN1YnNlcXVlbnQiLCJpbml0aWFsaXplSW5zZXJ0aW9uUG9pbnQiLCJwcm90b3R5cGUiLCJwdXNoIiwiYXBwbHkiLCJzY2hlbWEiLCJhZGQiLCJleGVjdXRlIiwiY29uZGl0aW9uYWwiLCJleGVjdXRpb25MZXZlbCIsInJlcXVpcmUiLCJ0aGlzQXJnIiwic2VsZiIsInBhcmVudCIsInJlcXVlc3RPcHRpb24iLCJyZXF1ZXN0IiwiYm9keSIsImZpZWxkQXJyYXkiLCJmaWVsZCIsImZpbmQiLCJmaWVsZE5hbWUiLCJkYXRhc2V0IiwicmVzb2x2ZURhdGFzZXQiLCJwYXJlbnRSZXN1bHQiLCJzY2hlbWFNb2RlIiwiYXNzZXJ0Iiwibm90RXF1YWwiLCJ1bmRlZmluZWQiLCJkYXRhc2V0SGFuZGxpbmciLCJvYmplY3QiLCJwcm9taXNlQXJyYXkiLCJtYXAiLCJkb2N1bWVudCIsInN1YnNlcXVlbnREYXRhc2V0QXJyYXkiLCJhbGwiLCJzdWJzZXF1ZW50RGF0YXNldCIsImluZGV4IiwiZm9ybWF0RGF0YXNldE9mTmVzdGVkVHlwZSIsImV4dHJhZmllbGQiLCJmb3JFYWNoIiwia2V5cyIsImJpbmQiLCJhbGdvcml0aG0iLCJtb2R1bGUiLCJyZXNvbHZlciIsInJlc29sdmVyQXJndW1lbnQiLCJhcmdzIiwiQm9vbGVhbiIsInBvcnRDbGFzc0luc3RhbmNlIl0sIm1hcHBpbmdzIjoid3dCQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVPLGVBQWVBLGlCQUFmLENBQWlD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QUNBO0FBQ0VBLElBQUFBLFNBQVMsQ0FBQzNFLElBRFo7O0FBR0UsV0FBSyxNQUFMO0FBQ0E7QUFDRTtBQUNFLGNBQUk0RSxNQUFNLEdBQUdqQyxPQUFPLENBQUNnQyxTQUFTLENBQUMxRyxJQUFYLENBQVAsQ0FBd0JyQixPQUFyQztBQUNBLGNBQUksT0FBT2dJLE1BQVAsS0FBa0IsVUFBdEIsRUFBa0NBLE1BQU0sR0FBR0EsTUFBTSxDQUFDaEksT0FBaEI7QUFDbEMsY0FBSWlJLFFBQVEsR0FBR0QsTUFBTSxFQUFyQjtBQUNBLGNBQUlFLGdCQUFnQixHQUFHMUQsTUFBTSxDQUFDQyxNQUFQLENBQWMsR0FBRyxDQUFDLEtBQUswRCxJQUFOLEVBQVlKLFNBQVMsQ0FBQ2xHLFFBQXRCLEVBQWdDckIsTUFBaEMsQ0FBdUM0SCxPQUF2QyxDQUFqQixDQUF2QjtBQUNBMUIsVUFBQUEsT0FBTyxHQUFHLE1BQU11QixRQUFRLENBQUM7QUFDdkJJLFlBQUFBLGlCQUFpQixFQUFFLEtBQUtoRixlQUREO0FBRXZCOEUsWUFBQUEsSUFBSSxFQUFFRCxnQkFGaUI7QUFHdkJ0QixZQUFBQSxZQUh1QixFQUFELENBQXhCOztBQUtEO0FBQ0QsY0FoQko7OztBQW1CQSxXQUFPRixPQUFQO0FBQ0Q7QUFDRixDQTdKRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCdcbmltcG9ydCB7IGV4ZWMsIGV4ZWNTeW5jLCBzcGF3biwgc3Bhd25TeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCB7IG5vZGVMYWJlbCwgY29ubmVjdGlvblR5cGUsIGNvbm5lY3Rpb25Qcm9wZXJ0eSB9IGZyb20gJy4uLy4uLy4uL2dyYXBoTW9kZWwvZ3JhcGhTY2hlbWVSZWZlcmVuY2UuanMnXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXR1cm5EYXRhSXRlbUtleSh7IHN0YWdlTm9kZSwgcHJvY2Vzc05vZGUgfSkge1xuICBpZiAocHJvY2Vzc05vZGUucHJvcGVydGllcz8ubmFtZSkgcmV0dXJuIGAke3Byb2Nlc3NOb2RlLnByb3BlcnRpZXM/Lm5hbWV9YFxufVxuXG4vLyBpbXBsZW1lbnRhdGlvbiBkZWxheXMgcHJvbWlzZXMgZm9yIHRlc3RpbmcgYGl0ZXJhdGVDb25uZWN0aW9uYCBvZiBwcm9taXNlcyBlLmcuIGBhbGxQcm9taXNlYCwgYHJhY2VGaXJzdFByb21pc2VgLCBldGMuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGltZW91dCh7IG5vZGUgfSkge1xuICBpZiAodHlwZW9mIG5vZGUucHJvcGVydGllcz8udGltZXJEZWxheSAhPSAnbnVtYmVyJykgdGhyb3cgbmV3IEVycm9yKCfigKIgRGF0YUl0ZW0gbXVzdCBoYXZlIGEgZGVsYXkgdmFsdWUuJylcbiAgbGV0IGRlbGF5ID0gbm9kZS5wcm9wZXJ0aWVzPy50aW1lckRlbGF5XG4gIHJldHVybiBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coYCR7ZGVsYXl9bXMgcGFzc2VkIGZvciBrZXkgJHtub2RlLmtleX0uYCkgLy8gZGVidWdcbiAgICAgIHJlc29sdmUobm9kZS5wcm9wZXJ0aWVzPy5uYW1lKVxuICAgIH0sIGRlbGF5KSxcbiAgKVxufVxuXG4vKipcbiAqIGBwcm9jZXNzRGF0YWAgaW1wbGVtZW50YXRpb24gb2YgYGdyYXBoVHJhdmVyc2FsYCBtb2R1bGVcbiAqIGV4ZWN1dGUgZnVuY3Rpb25zIHRocm91Z2ggYSBzdHJpbmcgcmVmZXJlbmNlIGZyb20gdGhlIGdyYXBoIGRhdGFiYXNlIHRoYXQgbWF0Y2ggdGhlIGtleSBvZiB0aGUgYXBwbGljYXRpb24gcmVmZXJlbmNlIGNvbnRleHQgb2JqZWN0XG4gKi9cbmNvbnN0IGV4ZWN1dGVSZWZlcmVuY2UgPSBjb250ZXh0UHJvcGVydHlOYW1lID0+XG4gIGFzeW5jIGZ1bmN0aW9uKHsgbm9kZSwgZ3JhcGhJbnN0YW5jZSB9LCB7IHRyYXZlcnNlQ2FsbENvbnRleHQgfSkge1xuICAgIGxldCByZWZlcmVuY2VDb250ZXh0ID0gZ3JhcGhJbnN0YW5jZS5jb250ZXh0W2NvbnRleHRQcm9wZXJ0eU5hbWVdXG4gICAgYXNzZXJ0KHJlZmVyZW5jZUNvbnRleHQsIGDigKIgQ29udGV4dCBcIiR7Y29udGV4dFByb3BlcnR5TmFtZX1cIiB2YXJpYWJsZSBpcyByZXF1aXJlZCB0byByZWZlcmVuY2UgZnVuY3Rpb25zIGZyb20gZ3JhcGggZGF0YWJhc2Ugc3RyaW5ncy5gKVxuXG4gICAgbGV0IHJlc291cmNlXG4gICAgY29uc3QgeyByZXNvdXJjZUFycmF5IH0gPSBhd2FpdCBncmFwaEluc3RhbmNlLmRhdGFiYXNlV3JhcHBlci5nZXRSZXNvdXJjZSh7IGNvbmNyZXRlRGF0YWJhc2U6IGdyYXBoSW5zdGFuY2UuZGF0YWJhc2UsIG5vZGVJRDogbm9kZS5pZGVudGl0eSB9KVxuICAgIGlmIChyZXNvdXJjZUFycmF5Lmxlbmd0aCA+IDEpIHRocm93IG5ldyBFcnJvcihg4oCiIE11bHRpcGxlIHJlc291cmNlIHJlbGF0aW9uc2hpcHMgYXJlIG5vdCBzdXBwb3J0ZWQgZm9yIFByb2Nlc3Mgbm9kZS5gKVxuICAgIGVsc2UgaWYgKHJlc291cmNlQXJyYXkubGVuZ3RoID09IDApIHJldHVyblxuICAgIGVsc2UgcmVzb3VyY2UgPSByZXNvdXJjZUFycmF5WzBdXG5cbiAgICBhc3NlcnQocmVzb3VyY2Uuc291cmNlLmxhYmVscy5pbmNsdWRlcyhub2RlTGFiZWwuZnVuY3Rpb24pLCBg4oCiIFVuc3VwcG9ydGVkIE5vZGUgdHlwZSBmb3IgcmVzb3VyY2UgY29ubmVjdGlvbi5gKVxuICAgIGxldCBmdW5jdGlvbk5hbWUgPSByZXNvdXJjZS5zb3VyY2UucHJvcGVydGllcy5mdW5jdGlvbk5hbWUgfHwgdGhyb3cgbmV3IEVycm9yKGDigKIgZnVuY3Rpb24gcmVzb3VyY2UgbXVzdCBoYXZlIGEgXCJmdW5jdGlvbk5hbWVcIiAtICR7cmVzb3VyY2Uuc291cmNlLnByb3BlcnRpZXMuZnVuY3Rpb25OYW1lfWApXG4gICAgbGV0IGZ1bmN0aW9uQ2FsbGJhY2sgPSByZWZlcmVuY2VDb250ZXh0W2Z1bmN0aW9uTmFtZV0gfHwgdGhyb3cgbmV3IEVycm9yKGDigKIgcmVmZXJlbmNlIGZ1bmN0aW9uIG5hbWUgZG9lc24ndCBleGlzdC5gKVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgZnVuY3Rpb25DYWxsYmFjayh7IG5vZGUsIGNvbnRleHQ6IGdyYXBoSW5zdGFuY2UuY29udGV4dCwgdHJhdmVyc2VDYWxsQ29udGV4dCB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKSAmJiBwcm9jZXNzLmV4aXQoKVxuICAgIH1cbiAgfVxuXG4vLyB1c2VkIGZvciBleGVjdXRpbmcgdGFza3NcbmV4cG9ydCBjb25zdCBleGVjdXRlRnVuY3Rpb25SZWZlcmVuY2UgPSBleGVjdXRlUmVmZXJlbmNlKCdmdW5jdGlvbkNvbnRleHQnKVxuXG4vKlxuICAgIF9fX18gICAgICAgICAgICAgICAgXyBfIF8gICBfICAgICAgICAgICAgIFxuICAgLyBfX198X19fICBfIF9fICAgX198IChfKSB8XyhfKSBfX18gIF8gX18gIFxuICB8IHwgICAvIF8gXFx8ICdfIFxcIC8gX2AgfCB8IF9ffCB8LyBfIFxcfCAnXyBcXCBcbiAgfCB8X198IChfKSB8IHwgfCB8IChffCB8IHwgfF98IHwgKF8pIHwgfCB8IHxcbiAgIFxcX19fX1xcX19fL3xffCB8X3xcXF9fLF98X3xcXF9ffF98XFxfX18vfF98IHxffFxuKi9cbmV4cG9ydCBjb25zdCBjaGVja0NvbmRpdGlvblJlZmVyZW5jZSA9IGV4ZWN1dGVSZWZlcmVuY2UoJ2NvbmRpdGlvbkNvbnRleHQnKVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3dpdGNoQ2FzZSh7IG5vZGUsIGdyYXBoSW5zdGFuY2UsIG5leHRQcm9jZXNzRGF0YSB9LCB7IHRyYXZlcnNlQ2FsbENvbnRleHQgfSkge1xuICBjb25zdCB7IGNhc2VBcnJheSwgZGVmYXVsdDogZGVmYXVsdFJlbGF0aW9uc2hpcCB9ID0gYXdhaXQgZ3JhcGhJbnN0YW5jZS5kYXRhYmFzZVdyYXBwZXIuZ2V0U3dpdGNoRWxlbWVudCh7IGNvbmNyZXRlRGF0YWJhc2U6IGdyYXBoSW5zdGFuY2UuZGF0YWJhc2UsIG5vZGVJRDogbm9kZS5pZGVudGl0eSB9KVxuICBjb25zdCB2YWx1ZSA9IGF3YWl0IGdyYXBoSW5zdGFuY2UuZGF0YWJhc2VXcmFwcGVyLmdldFRhcmdldFZhbHVlKHsgY29uY3JldGVEYXRhYmFzZTogZ3JhcGhJbnN0YW5jZS5kYXRhYmFzZSwgbm9kZUlEOiBub2RlLmlkZW50aXR5IH0pXG5cbiAgLyogcnVuIGNvbmRpdGlvbiBjaGVjayBhZ2FpbnN0IGNvbXBhcmlzb24gdmFsdWUuIEhpZXJhcmNoeSBvZiBjb21wYXJpc29uIHZhbHVlIGNhbGN1bGF0aW9uOiBcbiAgICAxLiBWQUxVRSByZWxhdGlvbnNoaXAgZGF0YS5cbiAgICAyLiBORVhUIHN0YWdlcyByZXN1bHQgXG4gICovXG4gIGxldCBjb21wYXJpc29uVmFsdWVcbiAgaWYgKHZhbHVlKSBjb21wYXJpc29uVmFsdWUgPSB2YWx1ZVxuICBlbHNlIGNvbXBhcmlzb25WYWx1ZSA9IG5leHRQcm9jZXNzRGF0YVxuXG4gIC8vIFN3aXRjaCBjYXNlczogcmV0dXJuIGV2YWx1YXRpb24gY29uZmlndXJhdGlvblxuICBsZXQgY2hvc2VuTm9kZVxuICBpZiAoY2FzZUFycmF5KSB7XG4gICAgLy8gY29tcGFyZSBleHBlY3RlZCB2YWx1ZSB3aXRoIHJlc3VsdFxuICAgIGxldCBjYXNlUmVsYXRpb25zaGlwID0gY2FzZUFycmF5LmZpbHRlcihjYXNlUmVsYXRpb25zaGlwID0+IGNhc2VSZWxhdGlvbnNoaXAuY29ubmVjdGlvbi5wcm9wZXJ0aWVzPy5leHBlY3RlZCA9PSBjb21wYXJpc29uVmFsdWUpWzBdXG4gICAgY2hvc2VuTm9kZSA9IGNhc2VSZWxhdGlvbnNoaXA/LmRlc3RpbmF0aW9uXG4gIH1cbiAgY2hvc2VuTm9kZSB8fD0gZGVmYXVsdFJlbGF0aW9uc2hpcD8uZGVzdGluYXRpb25cblxuICByZXR1cm4gY2hvc2VuTm9kZSB8fCBudWxsXG59XG5cbi8qXG4gICBfXyAgX18gXyAgICAgXyAgICAgXyBfICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgfCAgXFwvICAoXykgX198IHwgX198IHwgfCBfX19fXyAgICAgIF9fX18gXyBfIF9fIF9fXyBcbiAgfCB8XFwvfCB8IHwvIF9gIHwvIF9gIHwgfC8gXyBcXCBcXCAvXFwgLyAvIF9gIHwgJ19fLyBfIFxcXG4gIHwgfCAgfCB8IHwgKF98IHwgKF98IHwgfCAgX18vXFwgViAgViAvIChffCB8IHwgfCAgX18vXG4gIHxffCAgfF98X3xcXF9fLF98XFxfXyxffF98XFxfX198IFxcXy9cXF8vIFxcX18sX3xffCAgXFxfX198XG4gIENyZWF0ZXMgbWlkZGxld2FyZSBhcnJheSBmcm9tIGdyYXBoLSAgVGhlIGdyYXBoIHRyYXZlcnNhbCBAcmV0dXJuIHtBcnJheSBvZiBPYmplY3RzfSB3aGVyZSBlYWNoIG9iamVjdCBjb250YWlucyBpbnN0cnVjdGlvbiBzZXR0aW5ncyB0byBiZSB1c2VkIHRocm91Z2ggYW4gaW1wbGVtZW50aW5nIG1vZHVsZSB0byBhZGQgdG8gYSBjaGFpbiBvZiBtaWRkbGV3YXJlcy4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgb3IgSW1tZWRpYXRlbHkgZXhlY3V0ZSBtaWRkbGV3YXJlXG4qL1xuLy8gYSBmdW5jdGlvbiB0aGF0IGNvbXBsaWVzIHdpdGggZ3JhcGhUcmF2ZXJzYWwgcHJvY2Vzc0RhdGEgaW1wbGVtZW50YXRpb24uXG5leHBvcnQgY29uc3QgaW1tZWRpYXRlbHlFeGVjdXRlTWlkZGxld2FyZSA9IGFzeW5jICh7IG5vZGUsIGdyYXBoSW5zdGFuY2UsIG5leHRQcm9jZXNzRGF0YSB9LCB7IGFkZGl0aW9uYWxQYXJhbWV0ZXIgfSkgPT4ge1xuICBjb25zdCB7IG5leHRGdW5jdGlvbiB9ID0gYWRkaXRpb25hbFBhcmFtZXRlclxuICBsZXQgZnVuY3Rpb25Db250ZXh0ID0gZ3JhcGhJbnN0YW5jZS5jb250ZXh0LmZ1bmN0aW9uQ29udGV4dFxuICBhc3NlcnQoZnVuY3Rpb25Db250ZXh0LCBg4oCiIENvbnRleHQgXCJmdW5jdGlvbkNvbnRleHRcIiB2YXJpYWJsZSBpcyByZXF1aXJlZCB0byByZWZlcmVuY2UgZnVuY3Rpb25zIGZyb20gZ3JhcGggZGF0YWJhc2Ugc3RyaW5ncy5gKVxuICBhc3NlcnQoZ3JhcGhJbnN0YW5jZS5taWRkbGV3YXJlUGFyYW1ldGVyPy5jb250ZXh0LCBg4oCiIE1pZGRsZXdhcmUgZ3JhcGggdHJhdmVyc2FsIHJlbGllcyBvbiBncmFwaEluc3RhbmNlLm1pZGRsZXdhcmVQYXJhbWV0ZXIuY29udGV4dGApXG5cbiAgbGV0IHJlc291cmNlXG4gIGNvbnN0IHsgcmVzb3VyY2VBcnJheSB9ID0gYXdhaXQgZ3JhcGhJbnN0YW5jZS5kYXRhYmFzZVdyYXBwZXIuZ2V0UmVzb3VyY2UoeyBjb25jcmV0ZURhdGFiYXNlOiBncmFwaEluc3RhbmNlLmRhdGFiYXNlLCBub2RlSUQ6IG5vZGUuaWRlbnRpdHkgfSlcbiAgaWYgKHJlc291cmNlQXJyYXkubGVuZ3RoID4gMSkgdGhyb3cgbmV3IEVycm9yKGDigKIgTXVsdGlwbGUgcmVzb3VyY2UgcmVsYXRpb25zaGlwcyBhcmUgbm90IHN1cHBvcnRlZCBmb3IgUHJvY2VzcyBub2RlLmApXG4gIGVsc2UgaWYgKHJlc291cmNlQXJyYXkubGVuZ3RoID09IDApIHJldHVyblxuICBlbHNlIHJlc291cmNlID0gcmVzb3VyY2VBcnJheVswXVxuXG4gIGFzc2VydChyZXNvdXJjZS5zb3VyY2UubGFiZWxzLmluY2x1ZGVzKG5vZGVMYWJlbC5mdW5jdGlvbiksIGDigKIgVW5zdXBwb3J0ZWQgTm9kZSB0eXBlIGZvciByZXNvdXJjZSBjb25uZWN0aW9uLmApXG4gIGxldCBmdW5jdGlvbk5hbWUgPSByZXNvdXJjZS5zb3VyY2UucHJvcGVydGllcy5mdW5jdGlvbk5hbWUgfHwgdGhyb3cgbmV3IEVycm9yKGDigKIgZnVuY3Rpb24gcmVzb3VyY2UgbXVzdCBoYXZlIGEgXCJmdW5jdGlvbk5hbWVcIiAtICR7cmVzb3VyY2Uuc291cmNlLnByb3BlcnRpZXMuZnVuY3Rpb25OYW1lfWApXG4gIGxldCBtaWRkbGV3YXJlRnVuY3Rpb24gPSBmdW5jdGlvbkNvbnRleHRbZnVuY3Rpb25OYW1lXSB8fCB0aHJvdyBuZXcgRXJyb3IoYOKAoiByZWZlcmVuY2UgZnVuY3Rpb24gbmFtZSBkb2Vzbid0IGV4aXN0LmApXG4gIHRyeSB7XG4gICAgYXdhaXQgbWlkZGxld2FyZUZ1bmN0aW9uKGdyYXBoSW5zdGFuY2UubWlkZGxld2FyZVBhcmFtZXRlci5jb250ZXh0LCBuZXh0RnVuY3Rpb24pIC8vIGV4ZWN1dGUgbWlkZGxld2FyZVxuICAgIHJldHVybiBtaWRkbGV3YXJlRnVuY3Rpb24gLy8gYWxsb3cgdG8gYWdncmVnYXRlIG1pZGRsZXdhcmUgZnVuY3Rpb24gZm9yIGRlYnVnZ2luZyBwdXJwb3Nlcy5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKSAmJiBwcm9jZXNzLmV4aXQoKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCByZXR1cm5NaWRkbGV3YXJlRnVuY3Rpb24gPSBhc3luYyAoeyBub2RlLCBncmFwaEluc3RhbmNlIH0pID0+IHtcbiAgbGV0IGZ1bmN0aW9uQ29udGV4dCA9IGdyYXBoSW5zdGFuY2UuY29udGV4dC5mdW5jdGlvbkNvbnRleHRcbiAgYXNzZXJ0KGZ1bmN0aW9uQ29udGV4dCwgYOKAoiBDb250ZXh0IFwiZnVuY3Rpb25Db250ZXh0XCIgdmFyaWFibGUgaXMgcmVxdWlyZWQgdG8gcmVmZXJlbmNlIGZ1bmN0aW9ucyBmcm9tIGdyYXBoIGRhdGFiYXNlIHN0cmluZ3MuYClcblxuICBsZXQgcmVzb3VyY2VcbiAgY29uc3QgeyByZXNvdXJjZUFycmF5IH0gPSBhd2FpdCBncmFwaEluc3RhbmNlLmRhdGFiYXNlV3JhcHBlci5nZXRSZXNvdXJjZSh7IGNvbmNyZXRlRGF0YWJhc2U6IGdyYXBoSW5zdGFuY2UuZGF0YWJhc2UsIG5vZGVJRDogbm9kZS5pZGVudGl0eSB9KVxuICBpZiAocmVzb3VyY2VBcnJheS5sZW5ndGggPiAxKSB0aHJvdyBuZXcgRXJyb3IoYOKAoiBNdWx0aXBsZSByZXNvdXJjZSByZWxhdGlvbnNoaXBzIGFyZSBub3Qgc3VwcG9ydGVkIGZvciBQcm9jZXNzIG5vZGUuYClcbiAgZWxzZSBpZiAocmVzb3VyY2VBcnJheS5sZW5ndGggPT0gMCkgcmV0dXJuXG4gIGVsc2UgcmVzb3VyY2UgPSByZXNvdXJjZUFycmF5WzBdXG5cbiAgYXNzZXJ0KHJlc291cmNlLnNvdXJjZS5sYWJlbHMuaW5jbHVkZXMobm9kZUxhYmVsLmZ1bmN0aW9uKSwgYOKAoiBVbnN1cHBvcnRlZCBOb2RlIHR5cGUgZm9yIHJlc291cmNlIGNvbm5lY3Rpb24uYClcbiAgbGV0IGZ1bmN0aW9uTmFtZSA9IHJlc291cmNlLnNvdXJjZS5wcm9wZXJ0aWVzLmZ1bmN0aW9uTmFtZSB8fCB0aHJvdyBuZXcgRXJyb3IoYOKAoiBmdW5jdGlvbiByZXNvdXJjZSBtdXN0IGhhdmUgYSBcImZ1bmN0aW9uTmFtZVwiIC0gJHtyZXNvdXJjZS5zb3VyY2UucHJvcGVydGllcy5mdW5jdGlvbk5hbWV9YClcbiAgbGV0IG1pZGRsZXdhcmVGdW5jdGlvbiA9IGZ1bmN0aW9uQ29udGV4dFtmdW5jdGlvbk5hbWVdIHx8IHRocm93IG5ldyBFcnJvcihg4oCiIHJlZmVyZW5jZSBmdW5jdGlvbiBuYW1lIGRvZXNuJ3QgZXhpc3QuYClcbiAgdHJ5IHtcbiAgICByZXR1cm4gbWlkZGxld2FyZUZ1bmN0aW9uXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnJvcikgJiYgcHJvY2Vzcy5leGl0KClcbiAgfVxufVxuXG4vKlxuICAgICAgICAgICAgICAgICAgICAgICAgICBfICAgICAgX19fX18gICAgICAgICBfICAgICBfX19fICAgICAgICAgICAgXyAgICAgICBfICAgXG4gIF9fX19fICBfX19fXyAgX19fIF8gICBffCB8XyBfX3xfICAgX3xfIF8gX19ffCB8IF9fLyBfX198ICBfX18gXyBfXyhfKV8gX18gfCB8XyBcbiAvIF8gXFwgXFwvIC8gXyBcXC8gX198IHwgfCB8IF9fLyBfIFxcfCB8LyBfYCAvIF9ffCB8LyAvXFxfX18gXFwgLyBfX3wgJ19ffCB8ICdfIFxcfCBfX3xcbnwgIF9fLz4gIDwgIF9fLyAoX198IHxffCB8IHx8ICBfXy98IHwgKF98IFxcX18gXFwgICA8ICBfX18pIHwgKF9ffCB8ICB8IHwgfF8pIHwgfF8gXG5cXF9fXy9fL1xcX1xcX19ffFxcX19ffFxcX18sX3xcXF9fXFxfX198fF98XFxfXyxffF9fXy9ffFxcX1xcfF9fX18vIFxcX19ffF98ICB8X3wgLl9fLyBcXF9ffFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfF98ICAgICAgICBcbiovXG5sZXQgbWVzc2FnZSA9IGAgX19fX18gICAgICAgICAgICAgICAgICAgICAgICAgIF8gICAgICAgIFxufCBfX19ffF9fICBfXyBfX18gICBfX18gIF8gICBfIHwgfF8gIF9fXyBcbnwgIF98ICBcXFxcIFxcXFwvIC8vIF8gXFxcXCAvIF9ffHwgfCB8IHx8IF9ffC8gXyBcXFxcXG58IHxfX18gID4gIDx8ICBfXy98IChfXyB8IHxffCB8fCB8X3wgIF9fLyAgICBcbnxfX19fX3wvXy9cXFxcX1xcXFxcXFxcX19ffCBcXFxcX19ffCBcXFxcX18sX3wgXFxcXF9ffFxcXFxfX198YFxuY29uc3Qgcm9vdFBhdGggPSBwYXRoLm5vcm1hbGl6ZShwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vLi4vLi4vJykpXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleGVjdXRlU2NyaXB0U3Bhd24oeyBub2RlIH0pIHtcbiAgbGV0IGNoaWxkUHJvY2Vzc1xuICB0cnkge1xuICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpXG4gICAgY29uc29sZS5sb2coYFxceDFiWzQ1bSVzXFx4MWJbMG1gLCBgJHtub2RlLmNvbW1hbmR9ICR7bm9kZS5hcmd1bWVudC5qb2luKCcgJyl9YClcbiAgICBjaGlsZFByb2Nlc3MgPSBzcGF3blN5bmMobm9kZS5jb21tYW5kLCBub2RlLmFyZ3VtZW50LCBKU09OLnN0cmluZ2lmeShub2RlLm9wdGlvbikpXG4gICAgaWYgKGNoaWxkUHJvY2Vzcy5zdGF0dXMgPiAwKSB0aHJvdyBjaGlsZFByb2Nlc3MuZXJyb3JcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBwcm9jZXNzLmV4aXQoY2hpbGRQcm9jZXNzLnN0YXR1cylcbiAgfVxuICAvLyBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTAwKSkgLy8gd2FpdCB4IHNlY29uZHMgYmVmb3JlIG5leHQgc2NyaXB0IGV4ZWN1dGlvbiAvLyBpbXBvcnRhbnQgdG8gcHJldmVudCAndW5hYmxlIHRvIHJlLW9wZW4gc3RkaW4nIGVycm9yIGJldHdlZW4gc2hlbGxzLlxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZVNjcmlwdFNwYXduSWdub3JlRXJyb3IoeyBub2RlIH0pIHtcbiAgbGV0IGNoaWxkUHJvY2Vzc1xuICB0cnkge1xuICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpXG4gICAgY29uc29sZS5sb2coYFxceDFiWzQ1bSVzXFx4MWJbMG1gLCBgJHtub2RlLmNvbW1hbmR9ICR7bm9kZS5hcmd1bWVudC5qb2luKCcgJyl9YClcbiAgICBjaGlsZFByb2Nlc3MgPSBzcGF3blN5bmMobm9kZS5jb21tYW5kLCBub2RlLmFyZ3VtZW50LCBKU09OLnN0cmluZ2lmeShub2RlLm9wdGlvbikpXG4gICAgaWYgKGNoaWxkUHJvY2Vzcy5zdGF0dXMgPiAwKSB0aHJvdyBjaGlsZFByb2Nlc3MuZXJyb3JcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmxvZyhjaGlsZFByb2Nlc3Muc3RhdHVzKVxuICB9XG4gIC8vIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCA1MDApKSAvLyB3YWl0IHggc2Vjb25kcyBiZWZvcmUgbmV4dCBzY3JpcHQgZXhlY3V0aW9uIC8vIGltcG9ydGFudCB0byBwcmV2ZW50ICd1bmFibGUgdG8gcmUtb3BlbiBzdGRpbicgZXJyb3IgYmV0d2VlbiBzaGVsbHMuXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleGVjdXRlU2NyaXB0U3Bhd25Bc3luY2hyb25vdXMoeyBub2RlIH0pIHtcbiAgbGV0IGNoaWxkUHJvY2Vzc1xuICB0cnkge1xuICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpXG4gICAgY29uc29sZS5sb2coYFxceDFiWzQ1bSVzXFx4MWJbMG1gLCBgJHtub2RlLmNvbW1hbmR9ICR7bm9kZS5hcmd1bWVudC5qb2luKCcgJyl9YClcbiAgICBjaGlsZFByb2Nlc3MgPSBzcGF3bihub2RlLmNvbW1hbmQsIG5vZGUuYXJndW1lbnQsIEpTT04uc3RyaW5naWZ5KG5vZGUub3B0aW9uKSlcbiAgICBpZiAoY2hpbGRQcm9jZXNzLnN0YXR1cyA+IDApIHRocm93IGNoaWxkUHJvY2Vzcy5lcnJvclxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHByb2Nlc3MuZXhpdChjaGlsZFByb2Nlc3Muc3RhdHVzKVxuICB9XG4gIC8vIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCA1MDApKSAvLyB3YWl0IHggc2Vjb25kcyBiZWZvcmUgbmV4dCBzY3JpcHQgZXhlY3V0aW9uIC8vIGltcG9ydGFudCB0byBwcmV2ZW50ICd1bmFibGUgdG8gcmUtb3BlbiBzdGRpbicgZXJyb3IgYmV0d2VlbiBzaGVsbHMuXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleGVjdXRlU2hlbGxzY3JpcHRGaWxlKHsgbm9kZSwgZ3JhcGhJbnN0YW5jZSB9KSB7XG4gIGxldCBjb250ZXh0UHJvcGVydHlOYW1lID0gJ2ZpbGVDb250ZXh0JyxcbiAgICByZWZlcmVuY2VDb250ZXh0ID0gZ3JhcGhJbnN0YW5jZS5jb250ZXh0W2NvbnRleHRQcm9wZXJ0eU5hbWVdXG4gIGFzc2VydChyZWZlcmVuY2VDb250ZXh0LCBg4oCiIENvbnRleHQgXCIke2NvbnRleHRQcm9wZXJ0eU5hbWV9XCIgdmFyaWFibGUgaXMgcmVxdWlyZWQgdG8gcmVmZXJlbmNlIGZ1bmN0aW9ucyBmcm9tIGdyYXBoIGRhdGFiYXNlIHN0cmluZ3MuYClcblxuICBsZXQgcmVzb3VyY2VcbiAgY29uc3QgeyByZXNvdXJjZUFycmF5IH0gPSBhd2FpdCBncmFwaEluc3RhbmNlLmRhdGFiYXNlV3JhcHBlci5nZXRSZXNvdXJjZSh7IGNvbmNyZXRlRGF0YWJhc2U6IGdyYXBoSW5zdGFuY2UuZGF0YWJhc2UsIG5vZGVJRDogbm9kZS5pZGVudGl0eSB9KVxuICBpZiAocmVzb3VyY2VBcnJheS5sZW5ndGggPiAxKSB0aHJvdyBuZXcgRXJyb3IoYOKAoiBNdWx0aXBsZSByZXNvdXJjZSByZWxhdGlvbnNoaXBzIGFyZSBub3Qgc3VwcG9ydGVkIGZvciBQcm9jZXNzIG5vZGUuYClcbiAgZWxzZSBpZiAocmVzb3VyY2VBcnJheS5sZW5ndGggPT0gMCkgcmV0dXJuXG4gIGVsc2UgcmVzb3VyY2UgPSByZXNvdXJjZUFycmF5WzBdXG4gIGxldCBzY3JpcHRSZWZlcmVuY2VLZXkgPSByZXNvdXJjZS5zb3VyY2UucHJvcGVydGllcy5yZWZlcmVuY2VLZXlcbiAgYXNzZXJ0KHNjcmlwdFJlZmVyZW5jZUtleSwgYOKAoiByZXNvdXJjZSBGaWxlIG5vZGUgKHdpdGgga2V5OiAke3Jlc291cmNlLnNvdXJjZS5wcm9wZXJ0aWVzLmtleX0pIG11c3QgaGF2ZSBcInJlZmVyZW5jZUtleVwiIHByb3BlcnR5LmApXG5cbiAgdHJ5IHtcbiAgICBjb25zb2xlLmxvZyhtZXNzYWdlKVxuICAgIGxldCBzY3JpcHRQYXRoID0gcmVmZXJlbmNlQ29udGV4dFtzY3JpcHRSZWZlcmVuY2VLZXldXG4gICAgYXNzZXJ0KHNjcmlwdFBhdGgsIGDigKIgcmVmZXJlbmNlS2V5IG9mIEZpbGUgbm9kZSAocmVmZXJlbmNlS2V5ID0gJHtzY3JpcHRSZWZlcmVuY2VLZXl9KSB3YXMgbm90IGZvdW5kIGluIHRoZSBncmFwaEluc3RhbmNlIGNvbnRleHQ6ICR7cmVmZXJlbmNlQ29udGV4dH0gYClcbiAgICBjb25zb2xlLmxvZyhgXFx4MWJbNDVtJXNcXHgxYlswbWAsIGBzaGVsbHNjcmlwdCBwYXRoOiAke3NjcmlwdFBhdGh9YClcbiAgICBleGVjU3luYyhgc2ggJHtzY3JpcHRQYXRofWAsIHsgY3dkOiBwYXRoLmRpcm5hbWUoc2NyaXB0UGF0aCksIHNoZWxsOiB0cnVlLCBzdGRpbzogWydpbmhlcml0JywgJ2luaGVyaXQnLCAnaW5oZXJpdCddIH0pXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgZXJyb3JcbiAgICBwcm9jZXNzLmV4aXQoMSlcbiAgfVxuICAvLyBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTAwKSkgLy8gd2FpdCB4IHNlY29uZHMgYmVmb3JlIG5leHQgc2NyaXB0IGV4ZWN1dGlvbiAvLyBpbXBvcnRhbnQgdG8gcHJldmVudCAndW5hYmxlIHRvIHJlLW9wZW4gc3RkaW4nIGVycm9yIGJldHdlZW4gc2hlbGxzLlxuICByZXR1cm4gbnVsbFxufVxuXG4vKlxuIFxuICAgX19fX18gICAgICAgICAgICAgICAgICAgIF8gICAgICAgXyAgICAgICBcbiAgfF8gICBffF9fIF8gX18gX19fICBfIF9fIHwgfCBfXyBffCB8XyBfX18gXG4gICAgfCB8LyBfIFxcICdfIGAgXyBcXHwgJ18gXFx8IHwvIF9gIHwgX18vIF8gXFxcbiAgICB8IHwgIF9fLyB8IHwgfCB8IHwgfF8pIHwgfCAoX3wgfCB8fCAgX18vXG4gICAgfF98XFxfX198X3wgfF98IHxffCAuX18vfF98XFxfXyxffFxcX19cXF9fX3xcbiAgICAgICAgICAgICAgICAgICAgIHxffCAgICAgICAgICAgICAgICAgICAgXG4gXG4qL1xuXG4vLyBsZXQgdW5kZXJzY29yZSA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKVxuLyoqXG4gKlxuICogQHJldHVybiB7U3RyaW5nfSBTdHJpbmcgb2YgcmVuZGVyZWQgSFRNTCBkb2N1bWVudCBjb250ZW50LlxuICovXG5hc3luYyBmdW5jdGlvbiBpbml0aWFsaXplTmVzdGVkVW5pdCh7IG5lc3RlZFVuaXRLZXksIGFkZGl0aW9uYWxDaGlsZE5lc3RlZFVuaXQgPSBbXSwgcGF0aFBvaW50ZXJLZXkgPSBudWxsIH0pIHtcbiAgLy8gdmlld3MgYXJndW1lbnQgdGhhdCB3aWxsIGJlIGluaXRpYWxsaXplZCBpbnNpZGUgdGVtcGxhdGVzOlxuICAvLyBsb29wIHRocm91Z2ggdGVtcGxhdGUgYW5kIGNyZWF0ZSByZW5kZXJlZCB2aWV3IGNvbnRlbnQuXG4gIGxldCB2aWV3ID0gYXdhaXQgbmVzdGVkVW5pdEluc3RhbmNlLmxvb3BJbnNlcnRpb25Qb2ludCh7IHR5cGU6ICdhZ2dyZWdhdGVJbnRvVGVtcGxhdGVPYmplY3QnIH0pXG5cbiAgYXNzZXJ0KHRoaXMucG9ydEFwcEluc3RhbmNlLmNvbmZpZy5jbGllbnRTaWRlUGF0aCwgXCLigKIgY2xpZW50U2lkZVBhdGggY2Fubm90IGJlIHVuZGVmaW5lZC4gaS5lLiBwcmV2aW91cyBtaWRkbGV3YXJlcyBzaG91bGQndmUgc2V0IGl0XCIpXG4gIGxldCB0ZW1wbGF0ZVBhdGggPSBwYXRoLmpvaW4odGhpcy5wb3J0QXBwSW5zdGFuY2UuY29uZmlnLmNsaWVudFNpZGVQYXRoLCB1bml0SW5zdGFuY2UuZmlsZS5maWxlUGF0aClcbiAgbGV0IHJlbmRlcmVkQ29udGVudFxuICBzd2l0Y2ggKHVuaXRJbnN0YW5jZS5wcm9jZXNzRGF0YUltcGxlbWVudGF0aW9uKSB7XG4gICAgZGVmYXVsdDpcbiAgICBjYXNlICd1bmRlcnNjb3JlUmVuZGVyaW5nJzpcbiAgICAgIHJlbmRlcmVkQ29udGVudCA9IGF3YWl0IHRoaXMudW5kZXJzY29yZVJlbmRlcmluZyh7IHRlbXBsYXRlUGF0aCwgdmlldyB9KVxuICAgICAgYnJlYWtcbiAgfVxuXG4gIHN3aXRjaCAodW5pdEluc3RhbmNlLnByb2Nlc3NSZW5kZXJlZENvbnRlbnQpIHtcbiAgICBjYXNlICd3cmFwSnNUYWcnOlxuICAgICAgcmVuZGVyZWRDb250ZW50ID0gYDxzY3JpcHQgdHlwZT1cIm1vZHVsZVwiIGFzeW5jPiR7cmVuZGVyZWRDb250ZW50fTwvc2NyaXB0PmBcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDogLy8gc2tpcFxuICB9XG5cbiAgcmV0dXJuIHJlbmRlcmVkQ29udGVudFxufVxuXG5hc3luYyBmdW5jdGlvbiB1bmRlcnNjb3JlUmVuZGVyaW5nKHsgdGVtcGxhdGVQYXRoLCB2aWV3IH0pIHtcbiAgLy8gTG9hZCB0ZW1wbGF0ZSBmaWxlLlxuICBsZXQgdGVtcGxhdGVTdHJpbmcgPSBhd2FpdCBmaWxlc3lzdGVtLnJlYWRGaWxlU3luYyh0ZW1wbGF0ZVBhdGgsICd1dGYtOCcpXG4gIC8vIFNoYXJlZCBhcmd1bWVudHMgYmV0d2VlbiBhbGwgdGVtcGxhdGVzIGJlaW5nIHJlbmRlcmVkXG4gIGNvbnN0IHRlbXBsYXRlQXJndW1lbnQgPSB7XG4gICAgdGVtcGxhdGVDb250cm9sbGVyOiB0aGlzLFxuICAgIGNvbnRleHQ6IHRoaXMucG9ydEFwcEluc3RhbmNlLmNvbnRleHQsXG4gICAgQXBwbGljYXRpb24sXG4gICAgYXJndW1lbnQ6IHt9LFxuICB9XG4gIGxldCByZW5kZXJlZENvbnRlbnQgPSB1bmRlcnNjb3JlLnRlbXBsYXRlKHRlbXBsYXRlU3RyaW5nKShcbiAgICBPYmplY3QuYXNzaWduKFxuICAgICAge30sXG4gICAgICB0ZW1wbGF0ZUFyZ3VtZW50LCAvLyB1c2UgdGVtcGxhdGVBcmd1bWVudCBpbiBjdXJyZW50IHRlbXBsYXRlXG4gICAgICB7IHZpZXcsIHRlbXBsYXRlQXJndW1lbnQgfSwgLy8gcGFzcyB0ZW1wbGF0ZUFyZ3VtZW50IHRvIG5lc3RlZCB0ZW1wbGF0ZXNcbiAgICApLFxuICApXG4gIHJldHVybiByZW5kZXJlZENvbnRlbnRcbn1cblxuZnVuY3Rpb24gcmVuZGVyZWRDb250ZW50U3RyaW5nKHZpZXdOYW1lLCB2aWV3T2JqZWN0KSB7XG4gIC8vIGxvb3AgdGhyb3VnaHQgdGhlIHN0cmluZ3MgYXJyYXkgdG8gY29tYmluZSB0aGVtIGFuZCBwcmludCBzdHJpbmcgY29kZSB0byB0aGUgZmlsZS5cbiAgaWYgKHZpZXdPYmplY3Rbdmlld05hbWVdICYmIEFycmF5LmlzQXJyYXkodmlld09iamVjdFt2aWV3TmFtZV0pKSB7XG4gICAgcmV0dXJuIHZpZXdPYmplY3Rbdmlld05hbWVdLmpvaW4oJycpIC8vIGpvaW5zIGFsbCBhcnJheSBjb21wb25lbnRzIGludG8gb25lIHN0cmluZy5cbiAgfVxufVxuXG5sZXQgdHJhdmVyc2VQb3J0ID0gYXN5bmMgZnVuY3Rpb24gYWdncmVnYXRlSW50b1RlbXBsYXRlT2JqZWN0KCkge1xuICBsZXQgdmlldyA9IHt9XG4gIGlmICh0aGlzLmluc2VydGlvblBvaW50KSB7XG4gICAgZm9yIChsZXQgaW5zZXJ0aW9uUG9pbnQgb2YgdGhpcy5pbnNlcnRpb25Qb2ludCkge1xuICAgICAgbGV0IGNoaWxkcmVuID0gYXdhaXQgdGhpcy5maWx0ZXJBbmRPcmRlckNoaWxkcmVuKHsgaW5zZXJ0aW9uUG9pbnRLZXk6IGluc2VydGlvblBvaW50LmtleSB9KVxuICAgICAgbGV0IHN1YnNlcXVlbnQgPSBhd2FpdCB0aGlzLmluaXRpYWxpemVJbnNlcnRpb25Qb2ludCh7IGluc2VydGlvblBvaW50LCBjaGlsZHJlbiB9KVxuICAgICAgaWYgKCEoaW5zZXJ0aW9uUG9pbnQubmFtZSBpbiB2aWV3KSkgdmlld1tpbnNlcnRpb25Qb2ludC5uYW1lXSA9IFtdXG4gICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh2aWV3W2luc2VydGlvblBvaW50Lm5hbWVdLCBzdWJzZXF1ZW50KVxuICAgIH1cbiAgfVxuICByZXR1cm4gdmlld1xufVxuXG4vKlxuIFxuICAgICAgICAgICAgXyAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICBfX18gIF9fX3wgfF9fICAgX19fIF8gX18gX19fICAgX18gXyBcbiAgLyBfX3wvIF9ffCAnXyBcXCAvIF8gXFwgJ18gYCBfIFxcIC8gX2AgfFxuICBcXF9fIFxcIChfX3wgfCB8IHwgIF9fLyB8IHwgfCB8IHwgKF98IHxcbiAgfF9fXy9cXF9fX3xffCB8X3xcXF9fX3xffCB8X3wgfF98XFxfXyxffFxuIEFQSSBTY2hlbWFcbiAgKFdoaWxlIHRoZSBkYXRhYmFzZSBtb2RlbHMgYXJlIHNlcGFyYXRlIGluIHRoZWlyIG93biBmdW5jdGlvbnMgb3IgY291bGQgYmUgZXhwb3NlZCB0aHJvdWdoIGEgY2xhc3MgbW9kdWxlKVxuXG4gIC0gUmVzb2x2ZXIgZnVuY3Rpb24gPSBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBkYXRhLlxuICAtIERhdGEgbG9hZGVyID0gbW9kdWxlIHRoYXQgYWdncmVnYXRlcyBkdXBsaWNhdGUgY2FsbHMuIFNvbHZpbmcgdGhlIG4rMSBwcm9ibGVtLCB3aGVyZSBlYWNoIHF1ZXJ5IGhhcyBhIHN1YnNlcXVlbnQgcXVlcnksIGxpbmVhciBncmFwaC4gVG8gbm9kZWpzIGl0IHVzZXMgbmV4dFRpY2sgZnVuY3Rpb24gdG8gYW5hbHlzZSB0aGUgcHJvbWlzZXMgYmVmb3JlIHRoZWlyIGV4ZWN1dGlvbiBhbmQgcHJldmVudCBtdWx0aXBsZSByb3VuZCB0cmlwcyB0byB0aGUgc2VydmVyIGZvciB0aGUgc2FtZSBkYXRhLlxuICAtIE1hcHBpbmcgLSB0aHJvdWdoIHJvc29sdmVyIGZ1bmN0aW9ucy5cbiAgLSBTY2hlbWEgPSBpcyB0aGUgc3RydWN0dXJlICYgcmVsYXRpb25zaGlwcyBvZiB0aGUgYXBpIGRhdGEuIGkuZS4gZGVmaW5lcyBob3cgYSBjbGllbnQgY2FuIGZldGNoIGFuZCB1cGRhdGUgZGF0YS5cbiAgICAgIGVhY2ggc2NoZW1hIGhhcyBhcGkgZW50cnlwb2ludHMuIEVhY2ggZmllbGQgY29ycmVzcG9uZHMgdG8gYSByZXNvbHZlciBmdW5jdGlvbi5cbiAgRGF0YSBmZXRjaGluZyBjb21wbGV4aXR5IGFuZCBkYXRhIHN0cnVjdHVyaW5nIGlzIGhhbmRsZWQgYnkgc2VydmVyIHNpZGUgcmF0aGVyIHRoYW4gY2xpZW50LlxuXG4gIDMgdHlwZXMgb2YgcG9zc2libGUgYXBpIGFjdGlvbnM6IFxuICAtIFF1ZXJ5XG4gIC0gTXV0YXRpb25cbiAgLSBTdWJzY3JpcHRpb24gLSBjcmVhdGVzIGEgc3RlYWR5IGNvbm5lY3Rpb24gd2l0aCB0aGUgc2VydmVyLlxuXG4gIEZldGNoaW5nIGFwcHJvYWNoZXM6IFxuICDigKIgSW1wZXJhdGl2ZSBmZXRjaGluZzogXG4gICAgICAtIGNvbnN0cnVjdHMgJiBzZW5kcyBIVFRQIHJlcXVlc3QsIGUuZy4gdXNpbmcganMgZmV0Y2guXG4gICAgICAtIHJlY2VpdmUgJiBwYXJzZSBzZXJ2ZXIgcmVzcG9uc2UuXG4gICAgICAtIHN0b3JlIGRhdGEgbG9jYWxseSwgZS5nLiBpbiBtZW1vcnkgb3IgcGVyc2lzdGVudC4gXG4gICAgICAtIGRpc3BsYXkgVUkuXG4gIOKAoiBEZWNsYXJhdGl2ZSBmZXRjaGluZyBlLmcuIHVzaW5nIEdyYXBoUUwgY2xpZW50czogXG4gICAgICAtIERlc2NyaWJlIGRhdGEgcmVxdWlyZW1lbnRzLlxuICAgICAgLSBEaXNwbGF5IGluZm9ybWF0aW9uIGluIHRoZSBVSS5cblxuICBSZXF1ZXN0OiBcbiAge1xuICAgICAgYWN0aW9uOiBxdWVyeSxcbiAgICAgIGVudHJ5cG9pbnQ6IHtcbiAgICAgICAgICBrZXk6IFwiQXJ0aWNsZVwiXG4gICAgICB9LFxuICAgICAgZnVuY3Rpb246IHtcbiAgICAgICAgICBuYW1lOiBcInNpbmdsZVwiLFxuICAgICAgICAgIGFyZ3M6IHtcbiAgICAgICAgICAgICAga2V5OiBcImFydGljbGUxXCJcbiAgICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZmllbGQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleW5hbWU6IFwidGl0bGVcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBrZXluYW1lOiBcInBhcmFncmFwaFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleW5hbWU6IFwiYXV0aG9yc1wiXG4gICAgICAgICAgfSxcbiAgICAgIF1cbiAgfVxuXG4gIFJlc3BvbnNlIDpcbiAge1xuICAgICAgZGF0YToge1xuICAgICAgICAgIHRpdGxlOiBcIi4uLlwiLFxuICAgICAgICAgIHBhcmFncmFwaDogJy4uLicsXG4gICAgICAgICAgYXV0aG9yOiB7XG4gICAgICAgICAgICAgIG5hbWU6ICcuLi4nLFxuICAgICAgICAgICAgICBhZ2U6IDIwXG4gICAgICAgICAgfVxuICAgICAgfVxuICB9XG5cblxuICBOZXN0ZWQgVW5pdCBleGVjdXRpb24gc3RlcHM6ICBcbuKAoiBcbiovXG5cbmxldCBzY2hlbWEgPSAoKSA9PiB7XG4gIC8qKlxuICAgKiBJbXBsZW1lbnRhdGlvbiB0eXBlIGFnZ3JlZ2F0ZUludG9Db250ZW50QXJyYXlcbiAgICovXG4gIC8qIGV4bXBsZSByZXF1ZXN0IGJvZHk6IFxue1xuICAgIFwiZmllbGROYW1lXCI6IFwiYXJ0aWNsZVwiLFxuICAgIFwiZmllbGRcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcInRpdGxlXCIsXG4gICAgICAgICAgICBcImZpZWxkXCI6IFtdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwicGFyYWdyYXBoXCIsXG4gICAgICAgICAgICBcImZpZWxkXCI6IFtdXG4gICAgICAgIH1cbiAgICBdLFxuICAgIFwic2NoZW1hTW9kZVwiOiBcIm5vblN0cmljdFwiLCAvLyBhbGxvdyBlbXB0eSBkYXRhc2V0cyBmb3Igc3BlY2lmaWVkIGZpZWxkcyBpbiB0aGUgbmVzdGVkIHVuaXQgc2NoZW1hLlxuICAgIFwiZXh0cmFmaWVsZFwiOiB0cnVlIC8vIGluY2x1ZGVzIGZpZWxkcyB0aGF0IGFyZSBub3QgZXh0cmFjdGVkIHVzaW5nIHRoZSBzY2hlbWEuXG59ICovXG4gIGNvbnN0IHsgYWRkLCBleGVjdXRlLCBjb25kaXRpb25hbCwgZXhlY3V0aW9uTGV2ZWwgfSA9IHJlcXVpcmUoJ0BkZXBlbmRlbmN5L2NvbW1vblBhdHRlcm4vc291cmNlL2RlY29yYXRvclV0aWxpdHkuanMnKVxuICBmdW5jdGlvbiBzY2hlbWEoeyB0aGlzQXJnIH0pIHtcbiAgICAvLyBmdW5jdGlvbiB3cmFwcGVyIHRvIHNldCB0aGlzQXJnIG9uIGltcGxlbWVudGFpb24gb2JqZWN0IGZ1bmN0aW9ucy5cblxuICAgIGxldCBzZWxmID0ge1xuICAgICAgQGV4ZWN1dGlvbkxldmVsKClcbiAgICAgIGFzeW5jIGluaXRpYWxpemVOZXN0ZWRVbml0KHsgbmVzdGVkVW5pdEtleSwgYWRkaXRpb25hbENoaWxkTmVzdGVkVW5pdCA9IFtdLCBwYXRoUG9pbnRlcktleSA9IG51bGwsIHBhcmVudCA9IHRoaXMsIGFyZ3VtZW50ID0ge30gfSkge1xuICAgICAgICAvLyBFbnRyeXBvaW50IEluc3RhbmNlXG4gICAgICAgIC8vIGV4dHJhY3QgcmVxdWVzdCBkYXRhIGFjdGlvbiBhcmd1bWVudHMuIGFyZ3VtZW50cyBmb3IgYSBxdWVyeS9tdXRhdGlvbi9zdWJzY3JpcHRpb24uXG4gICAgICAgIGlmICh0aGlzLmV4ZWN1dGlvbkxldmVsID09ICd0b3BMZXZlbCcpIHtcbiAgICAgICAgICBuZXN0ZWRVbml0SW5zdGFuY2UucmVxdWVzdE9wdGlvbiA9IHRoaXMucG9ydEFwcEluc3RhbmNlLmNvbnRleHQucmVxdWVzdC5ib2R5XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gY2hpbGQvbmVzdGVkXG4gICAgICAgICAgbGV0IGZpZWxkQXJyYXkgPSBwYXJlbnQucmVxdWVzdE9wdGlvbi5maWVsZCAvLyBvYmplY3QgYXJyYXlcbiAgICAgICAgICBpZiAoKGZpZWxkQXJyYXkgJiYgZmllbGRBcnJheS5sZW5ndGggPT0gMCkgfHwgIWZpZWxkQXJyYXkpIHtcbiAgICAgICAgICAgIG5lc3RlZFVuaXRJbnN0YW5jZS5yZXF1ZXN0T3B0aW9uID0ge30gLy8gY29udGludWUgdG8gcmVzb2x2ZSBkYXRhc2V0IGFuZCBhbGwgc3Vic2VxdWVudCBOZXN0ZWR1bml0cyBvZiBuZXN0ZWQgZGF0YXNldCBpbiBjYXNlIGFyZSBvYmplY3RzLlxuICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGRBcnJheSkge1xuICAgICAgICAgICAgbmVzdGVkVW5pdEluc3RhbmNlLnJlcXVlc3RPcHRpb24gPSBmaWVsZEFycmF5LmZpbmQoZmllbGQgPT4gZmllbGQuZmllbGROYW1lID09IHVuaXRJbnN0YW5jZS5maWVsZE5hbWUpIC8vIHdoZXJlIGZpZWxkTmFtZXMgbWF0Y2hcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVjayBpZiBmaWVsZG5hbWUgZXhpc3RzIGluIHRoZSByZXF1ZXN0IG9wdGlvbiwgaWYgbm90IHNraXAgbmVzdGVkIHVuaXQuXG4gICAgICAgIGlmICghbmVzdGVkVW5pdEluc3RhbmNlLnJlcXVlc3RPcHRpb24pIHJldHVybiAvLyBmaWVsZE5hbWUgd2FzIG5vdCBzcGVjaWZpZWQgaW4gdGhlIHBhcmVudCBuZXN0ZWRVbml0LCB0aGVyZWZvcmUgc2tpcCBpdHMgZXhlY3V0aW9uXG4gICAgICAgIG5lc3RlZFVuaXRJbnN0YW5jZS5kYXRhc2V0ID0gYXdhaXQgdW5pdEluc3RhbmNlLnJlc29sdmVEYXRhc2V0KHsgcGFyZW50UmVzdWx0OiBhcmd1bWVudC5kYXRhc2V0IHx8IHBhcmVudC5kYXRhc2V0IH0pXG4gICAgICAgIC8vIFRPRE86IEZpeCByZXF1ZXN0T3B0aW9uIC0gaS5lLiBhYm92ZSBpdCBpcyB1c2VkIHRvIHBhc3MgXCJmaWVsZFwiIG9wdGlvbiBvbmx5LlxuICAgICAgICBpZiAodGhpcy5wb3J0QXBwSW5zdGFuY2UuY29udGV4dC5yZXF1ZXN0LmJvZHkuc2NoZW1hTW9kZSA9PSAnbm9uU3RyaWN0Jykge1xuICAgICAgICAgIC8vIERvbid0IGVuZm9yY2Ugc3RyaWN0IHNjaGVtYSwgaS5lLiBhbGwgbmVzdGVkIGNoaWxkcmVuIHNob3VsZCBleGlzdC5cbiAgICAgICAgICAvLyBpZihuZXN0ZWRVbml0SW5zdGFuY2UuZGF0YXNldCkgbmVzdGVkVW5pdEluc3RhbmNlLmRhdGFzZXQgPSBudWxsIC8vIFRPRE86IHRocm93cyBlcnJvciBhcyBuZXh0IGl0IGlzIGJlaW5nIHVzZWQuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXNzZXJ0Lm5vdEVxdWFsKG5lc3RlZFVuaXRJbnN0YW5jZS5kYXRhc2V0LCB1bmRlZmluZWQsIGDigKIgcmV0dXJuZWQgZGF0YXNldCBjYW5ub3QgYmUgdW5kZWZpbmVkIGZvciBmaWVsZE5hbWU6ICR7dW5pdEluc3RhbmNlLmZpZWxkTmFtZX0uYClcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrIHR5cGUgb2YgZGF0YXNldFxuICAgICAgICBsZXQgZGF0YXNldEhhbmRsaW5nXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KG5lc3RlZFVuaXRJbnN0YW5jZS5kYXRhc2V0KSAmJiBuZXN0ZWRVbml0SW5zdGFuY2UuY2hpbGRyZW4gJiYgbmVzdGVkVW5pdEluc3RhbmNlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAvLyBhcnJheVxuICAgICAgICAgIGRhdGFzZXRIYW5kbGluZyA9ICdzZXF1ZW5jZSdcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbmVzdGVkVW5pdEluc3RhbmNlLmRhdGFzZXQgPT0gJ29iamVjdCcgJiYgbmVzdGVkVW5pdEluc3RhbmNlLmNoaWxkcmVuICYmIG5lc3RlZFVuaXRJbnN0YW5jZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgLy8gb2JqZWN0XG4gICAgICAgICAgZGF0YXNldEhhbmRsaW5nID0gJ25lc3RlZCdcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBub24tbmVzdGVkIHZhbHVlXG4gICAgICAgICAgZGF0YXNldEhhbmRsaW5nID0gJ25vbk5lc3RlZCdcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGhhbmRsZSBhcnJheSwgb2JqZWN0LCBvciBub24tbmVzdGVkIHZhbHVlXG4gICAgICAgIGxldCBvYmplY3QgPSB7fSAvLyBmb3JtYXR0ZWQgb2JqZWN0IHdpdGggcmVxdWVzdGVkIGZpZWxkc1xuICAgICAgICBzd2l0Y2ggKGRhdGFzZXRIYW5kbGluZykge1xuICAgICAgICAgIGNhc2UgJ3NlcXVlbmNlJzpcbiAgICAgICAgICAgIGxldCBwcm9taXNlQXJyYXkgPSBuZXN0ZWRVbml0SW5zdGFuY2UuZGF0YXNldC5tYXAoZG9jdW1lbnQgPT4ge1xuICAgICAgICAgICAgICBsZXQgYXJndW1lbnQgPSB7fVxuICAgICAgICAgICAgICBhcmd1bWVudFsnZGF0YXNldCddID0gZG9jdW1lbnRcbiAgICAgICAgICAgICAgcmV0dXJuIG5lc3RlZFVuaXRJbnN0YW5jZS5sb29wSW5zZXJ0aW9uUG9pbnQoeyB0eXBlOiAnYWdncmVnYXRlSW50b0NvbnRlbnRBcnJheScsIGFyZ3VtZW50IH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgbGV0IHN1YnNlcXVlbnREYXRhc2V0QXJyYXkgPSBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlQXJyYXkpXG4gICAgICAgICAgICBvYmplY3RbdW5pdEluc3RhbmNlLmZpZWxkTmFtZV0gPSBzdWJzZXF1ZW50RGF0YXNldEFycmF5Lm1hcCgoc3Vic2VxdWVudERhdGFzZXQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmZvcm1hdERhdGFzZXRPZk5lc3RlZFR5cGUoe1xuICAgICAgICAgICAgICAgIHN1YnNlcXVlbnREYXRhc2V0LFxuICAgICAgICAgICAgICAgIGRhdGFzZXQ6IG5lc3RlZFVuaXRJbnN0YW5jZS5kYXRhc2V0W2luZGV4XSxcbiAgICAgICAgICAgICAgICBvcHRpb246IHtcbiAgICAgICAgICAgICAgICAgIGV4dHJhZmllbGQ6IG5lc3RlZFVuaXRJbnN0YW5jZS5yZXF1ZXN0T3B0aW9uLmV4dHJhZmllbGQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAnbmVzdGVkJzogLy8gaWYgZmllbGQgdHJlYXRlZCBhcyBhbiBvYmplY3Qgd2l0aCBuZXN0ZWQgZmllbGRzXG4gICAgICAgICAgICBsZXQgc3Vic2VxdWVudERhdGFzZXQgPSBhd2FpdCBuZXN0ZWRVbml0SW5zdGFuY2UubG9vcEluc2VydGlvblBvaW50KHsgdHlwZTogJ2FnZ3JlZ2F0ZUludG9Db250ZW50QXJyYXknIH0pXG4gICAgICAgICAgICBvYmplY3RbdW5pdEluc3RhbmNlLmZpZWxkTmFtZV0gPSB0aGlzLmZvcm1hdERhdGFzZXRPZk5lc3RlZFR5cGUoe1xuICAgICAgICAgICAgICBzdWJzZXF1ZW50RGF0YXNldCxcbiAgICAgICAgICAgICAgZGF0YXNldDogbmVzdGVkVW5pdEluc3RhbmNlLmRhdGFzZXQsXG4gICAgICAgICAgICAgIG9wdGlvbjoge1xuICAgICAgICAgICAgICAgIGV4dHJhZmllbGQ6IG5lc3RlZFVuaXRJbnN0YW5jZS5yZXF1ZXN0T3B0aW9uLmV4dHJhZmllbGQsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY2FzZSAnbm9uTmVzdGVkJzpcbiAgICAgICAgICAgIC8vIGxvb3Bpbmcgb3ZlciBuZXN0ZWQgdW5pdHMgY2FuIG1hbmlwdWxhdGUgdGhlIGRhdGEgaW4gYSBkaWZmZXJlbnQgd2F5IHRoYW4gcmVndWxhciBhZ2dyZWdhdGlvbiBpbnRvIGFuIGFycmF5LlxuICAgICAgICAgICAgb2JqZWN0W3VuaXRJbnN0YW5jZS5maWVsZE5hbWVdID0gbmVzdGVkVW5pdEluc3RhbmNlLmRhdGFzZXRcblxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRlYWwgd2l0aCByZXF1ZXN0ZWQgYWxsIGZpZWxkcyB3aXRob3V0IHRoZSBmaWVsZCBvcHRpb24gd2hlcmUgZXhlY3V0aW9uIG9mIHN1Ym5lc3RlZHVuaXRzIGlzIHJlcXVpcmVkIHRvIG1hbmlwdWxhdGUgdGhlIGRhdGEuXG5cbiAgICAgICAgcmV0dXJuIG9iamVjdFxuICAgICAgfSxcblxuICAgICAgZm9ybWF0RGF0YXNldE9mTmVzdGVkVHlwZSh7IHN1YnNlcXVlbnREYXRhc2V0LCBkYXRhc2V0LCBvcHRpb24gfSkge1xuICAgICAgICBsZXQgb2JqZWN0ID0ge31cbiAgICAgICAgc3Vic2VxdWVudERhdGFzZXQuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgICAgb2JqZWN0ID0gT2JqZWN0LmFzc2lnbihvYmplY3QsIGZpZWxkKVxuICAgICAgICB9KVxuICAgICAgICBpZiAob3B0aW9uLmV4dHJhZmllbGQpIHtcbiAgICAgICAgICAvLyBleHRyYWZpZWxkIG9wdGlvblxuICAgICAgICAgIG9iamVjdCA9IE9iamVjdC5hc3NpZ24oZGF0YXNldCwgb2JqZWN0KSAvLyBvdmVycmlkZSBzdWJzZXF1ZW50IGZpZWxkcyBhbmQga2VlcCB1bnRyYWNrZWQgZmllbGRzLlxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmplY3RcbiAgICAgIH0sXG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMoc2VsZikuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHNlbGZba2V5XSA9IHNlbGZba2V5XS5iaW5kKHRoaXNBcmcpXG4gICAgfSwge30pXG4gICAgcmV0dXJuIHNlbGZcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIHJlc29sdmVEYXRhc2V0KHtcbiAgICBwYXJlbnRSZXN1bHQgPSBudWxsLFxuICAgIC8vIHRoaXMuYXJncyAtIG5lc3RlZFVuaXQgYXJncyBmaWVsZC5cbiAgfSkge1xuICAgIC8vIFsyXSByZXF1aXJlICYgY2hlY2sgY29uZGl0aW9uXG4gICAgbGV0IGRhdGFzZXRcbiAgICBjb25zdCBhbGdvcml0aG0gPSB0aGlzLmZpbGUuYWxnb3JpdGhtIC8vIHJlc29sdmVyIGZvciBkYXRhc2V0XG4gICAgc3dpdGNoIChcbiAgICAgIGFsZ29yaXRobS50eXBlIC8vIGluIG9yZGVyIHRvIGNob29zZSBob3cgdG8gaGFuZGxlIHRoZSBhbGdvcml0aG0gKGFzIGEgbW9kdWxlID8gYSBmaWxlIHRvIGJlIGltcG9ydGVkID8uLi4pXG4gICAgKSB7XG4gICAgICBjYXNlICdmaWxlJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHtcbiAgICAgICAgICBsZXQgbW9kdWxlID0gcmVxdWlyZShhbGdvcml0aG0ucGF0aCkuZGVmYXVsdFxuICAgICAgICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAnZnVuY3Rpb24nKSBtb2R1bGUgPSBtb2R1bGUuZGVmYXVsdCAvLyBjYXNlIGVzNiBtb2R1bGUgbG9hZGVkIHdpdGggcmVxdWlyZSBmdW5jdGlvbiAod2lsbCBsb2FkIGl0IGFzIGFuIG9iamVjdClcbiAgICAgICAgICBsZXQgcmVzb2x2ZXIgPSBtb2R1bGUoKSAvKmluaXRpYWwgZXhlY3V0ZSBmb3Igc2V0dGluZyBwYXJhbWV0ZXIgY29udGV4dC4qL1xuICAgICAgICAgIGxldCByZXNvbHZlckFyZ3VtZW50ID0gT2JqZWN0LmFzc2lnbiguLi5bdGhpcy5hcmdzLCBhbGdvcml0aG0uYXJndW1lbnRdLmZpbHRlcihCb29sZWFuKSkgLy8gcmVtb3ZlIHVuZGVmaW5lZC9udWxsL2ZhbHNlIG9iamVjdHMgYmVmb3JlIG1lcmdpbmcuXG4gICAgICAgICAgZGF0YXNldCA9IGF3YWl0IHJlc29sdmVyKHtcbiAgICAgICAgICAgIHBvcnRDbGFzc0luc3RhbmNlOiB0aGlzLnBvcnRBcHBJbnN0YW5jZSwgLy8gY29udGFpbnMgYWxzbyBwb3J0Q2xhc3NJbnN0YW5jZS5jb250ZXh0IG9mIHRoZSByZXF1ZXN0LlxuICAgICAgICAgICAgYXJnczogcmVzb2x2ZXJBcmd1bWVudCxcbiAgICAgICAgICAgIHBhcmVudFJlc3VsdCwgLy8gcGFyZW50IGRhdGFzZXQgcmVzdWx0LlxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YXNldFxuICB9XG59XG4iXX0=