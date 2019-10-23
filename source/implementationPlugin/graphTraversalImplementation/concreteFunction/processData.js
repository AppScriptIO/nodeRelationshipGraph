"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.returnDataItemKey = returnDataItemKey;exports.timeout = timeout;exports.switchCase = switchCase;exports.executeScriptSpawn = executeScriptSpawn;exports.executeScriptSpawnIgnoreError = executeScriptSpawnIgnoreError;exports.executeScriptSpawnAsynchronous = executeScriptSpawnAsynchronous;exports.executeShellscriptFile = executeShellscriptFile;exports.returnMiddlewareFunction = exports.immediatelyExecuteMiddleware = exports.checkConditionReference = exports.executeFunctionReference = void 0;var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));var _path = _interopRequireDefault(require("path"));
var _assert = _interopRequireDefault(require("assert"));
var _child_process = require("child_process");
var _graphSchemeReference = require("../../../graphModel/graphSchemeReference.js");

async function returnDataItemKey({ stageNode, processNode }) {var _stageNode$properties, _stageNode$properties2;
  if ((_stageNode$properties = stageNode.properties) === null || _stageNode$properties === void 0 ? void 0 : _stageNode$properties.name) return `${(_stageNode$properties2 = stageNode.properties) === null || _stageNode$properties2 === void 0 ? void 0 : _stageNode$properties2.name}`;
}


async function timeout({ node }) {var _node$properties, _node$properties2;
  console.log('timeout');
  if (typeof ((_node$properties = node.properties) === null || _node$properties === void 0 ? void 0 : _node$properties.timerDelay) != 'number') throw new Error('• DataItem must have a delay value.');
  let delay = (_node$properties2 = node.properties) === null || _node$properties2 === void 0 ? void 0 : _node$properties2.timerDelay;
  return await new Promise((resolve, reject) =>
  setTimeout(() => {var _node$properties3;

    resolve((_node$properties3 = node.properties) === null || _node$properties3 === void 0 ? void 0 : _node$properties3.name);
  }, delay));

}





const executeReference = (contextPropertyName) =>
async function ({ node, graphInstance }) {
  let referenceContext = graphInstance.context[contextPropertyName];
  (0, _assert.default)(referenceContext, `• Context "${contextPropertyName}" variable is required to reference functions from graph database strings.`);

  let resource;
  const { resourceArray } = await graphInstance.databaseWrapper.getResource({ concreteDatabase: graphInstance.database, nodeID: node.identity });
  if (resourceArray.length > 1) throw new Error(`• Multiple resource relationships are not supported for Process node.`);else
  if (resourceArray.length == 0) return;else
  resource = resourceArray[0];

  (0, _assert.default)(resource.destination.labels.includes(_graphSchemeReference.nodeLabel.function), `• Unsupported Node type for resource connection.`);
  let functionName = resource.destination.properties.functionName || function (e) {throw e;}(new Error(`• function resource must have a "functionName" - ${resource.destination.properties.functionName}`));
  let functionCallback = referenceContext[functionName] || function (e) {throw e;}(new Error(`• reference function name doesn't exist.`));
  try {
    return await functionCallback({ node, context: graphInstance.context });
  } catch (error) {
    console.error(error) && process.exit();
  }
};


const executeFunctionReference = executeReference('functionContext');exports.executeFunctionReference = executeFunctionReference;








const checkConditionReference = executeReference('conditionContext');exports.checkConditionReference = checkConditionReference;

async function switchCase({ node, graphInstance, nextProcessData }) {
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











const immediatelyExecuteMiddleware = async ({ node, graphInstance, nextProcessData }, { nextFunction }) => {var _graphInstance$middle;
  let functionContext = graphInstance.context.functionContext;
  (0, _assert.default)(functionContext, `• Context "functionContext" variable is required to reference functions from graph database strings.`);
  (0, _assert.default)((_graphInstance$middle = graphInstance.middlewareParameter) === null || _graphInstance$middle === void 0 ? void 0 : _graphInstance$middle.context, `• Middleware graph traversal relies on graphInstance.middlewareParameter.context`);

  let resource;
  const { resourceArray } = await graphInstance.databaseWrapper.getResource({ concreteDatabase: graphInstance.database, nodeID: node.identity });
  if (resourceArray.length > 1) throw new Error(`• Multiple resource relationships are not supported for Process node.`);else
  if (resourceArray.length == 0) return;else
  resource = resourceArray[0];

  (0, _assert.default)(resource.destination.labels.includes(_graphSchemeReference.nodeLabel.function), `• Unsupported Node type for resource connection.`);
  let functionName = resource.destination.properties.functionName || function (e) {throw e;}(new Error(`• function resource must have a "functionName" - ${resource.destination.properties.functionName}`));
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

  (0, _assert.default)(resource.destination.labels.includes(_graphSchemeReference.nodeLabel.function), `• Unsupported Node type for resource connection.`);
  let functionName = resource.destination.properties.functionName || function (e) {throw e;}(new Error(`• function resource must have a "functionName" - ${resource.destination.properties.functionName}`));
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

async function executeShellscriptFile({ node }) {
  try {
    console.log(message);
    console.log(`\x1b[45m%s\x1b[0m`, `shellscript path: ${resource.properties.path}`);
    let absolutePath = _path.default.join('/', rootPath, resource.properties.path);
    (0, _child_process.execSync)(`sh ${absolutePath}`, { cwd: _path.default.dirname(absolutePath), shell: true, stdio: ['inherit', 'inherit', 'inherit'] });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NvdXJjZS9pbXBsZW1lbnRhdGlvblBsdWdpbi9ncmFwaFRyYXZlcnNhbEltcGxlbWVudGF0aW9uL2NvbmNyZXRlRnVuY3Rpb24vcHJvY2Vzc0RhdGEuanMiXSwibmFtZXMiOlsicmV0dXJuRGF0YUl0ZW1LZXkiLCJzdGFnZU5vZGUiLCJwcm9jZXNzTm9kZSIsInByb3BlcnRpZXMiLCJuYW1lIiwidGltZW91dCIsIm5vZGUiLCJjb25zb2xlIiwibG9nIiwidGltZXJEZWxheSIsIkVycm9yIiwiZGVsYXkiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInNldFRpbWVvdXQiLCJleGVjdXRlUmVmZXJlbmNlIiwiY29udGV4dFByb3BlcnR5TmFtZSIsImdyYXBoSW5zdGFuY2UiLCJyZWZlcmVuY2VDb250ZXh0IiwiY29udGV4dCIsInJlc291cmNlIiwicmVzb3VyY2VBcnJheSIsImRhdGFiYXNlV3JhcHBlciIsImdldFJlc291cmNlIiwiY29uY3JldGVEYXRhYmFzZSIsImRhdGFiYXNlIiwibm9kZUlEIiwiaWRlbnRpdHkiLCJsZW5ndGgiLCJkZXN0aW5hdGlvbiIsImxhYmVscyIsImluY2x1ZGVzIiwibm9kZUxhYmVsIiwiZnVuY3Rpb24iLCJmdW5jdGlvbk5hbWUiLCJmdW5jdGlvbkNhbGxiYWNrIiwiZXJyb3IiLCJwcm9jZXNzIiwiZXhpdCIsImV4ZWN1dGVGdW5jdGlvblJlZmVyZW5jZSIsImNoZWNrQ29uZGl0aW9uUmVmZXJlbmNlIiwic3dpdGNoQ2FzZSIsIm5leHRQcm9jZXNzRGF0YSIsImNhc2VBcnJheSIsImRlZmF1bHQiLCJkZWZhdWx0UmVsYXRpb25zaGlwIiwiZ2V0U3dpdGNoRWxlbWVudCIsInZhbHVlIiwiZ2V0VGFyZ2V0VmFsdWUiLCJjb21wYXJpc29uVmFsdWUiLCJjaG9zZW5Ob2RlIiwiY2FzZVJlbGF0aW9uc2hpcCIsImZpbHRlciIsImNvbm5lY3Rpb24iLCJleHBlY3RlZCIsImltbWVkaWF0ZWx5RXhlY3V0ZU1pZGRsZXdhcmUiLCJuZXh0RnVuY3Rpb24iLCJmdW5jdGlvbkNvbnRleHQiLCJtaWRkbGV3YXJlUGFyYW1ldGVyIiwibWlkZGxld2FyZUZ1bmN0aW9uIiwicmV0dXJuTWlkZGxld2FyZUZ1bmN0aW9uIiwibWVzc2FnZSIsInJvb3RQYXRoIiwicGF0aCIsIm5vcm1hbGl6ZSIsImpvaW4iLCJfX2Rpcm5hbWUiLCJleGVjdXRlU2NyaXB0U3Bhd24iLCJjaGlsZFByb2Nlc3MiLCJjb21tYW5kIiwiYXJndW1lbnQiLCJKU09OIiwic3RyaW5naWZ5Iiwib3B0aW9uIiwic3RhdHVzIiwiZXhlY3V0ZVNjcmlwdFNwYXduSWdub3JlRXJyb3IiLCJleGVjdXRlU2NyaXB0U3Bhd25Bc3luY2hyb25vdXMiLCJleGVjdXRlU2hlbGxzY3JpcHRGaWxlIiwiYWJzb2x1dGVQYXRoIiwiY3dkIiwiZGlybmFtZSIsInNoZWxsIiwic3RkaW8iLCJpbml0aWFsaXplTmVzdGVkVW5pdCIsIm5lc3RlZFVuaXRLZXkiLCJhZGRpdGlvbmFsQ2hpbGROZXN0ZWRVbml0IiwicGF0aFBvaW50ZXJLZXkiLCJ2aWV3IiwibmVzdGVkVW5pdEluc3RhbmNlIiwibG9vcEluc2VydGlvblBvaW50IiwidHlwZSIsInBvcnRBcHBJbnN0YW5jZSIsImNvbmZpZyIsImNsaWVudFNpZGVQYXRoIiwidGVtcGxhdGVQYXRoIiwidW5pdEluc3RhbmNlIiwiZmlsZSIsImZpbGVQYXRoIiwicmVuZGVyZWRDb250ZW50IiwicHJvY2Vzc0RhdGFJbXBsZW1lbnRhdGlvbiIsInVuZGVyc2NvcmVSZW5kZXJpbmciLCJwcm9jZXNzUmVuZGVyZWRDb250ZW50IiwidGVtcGxhdGVTdHJpbmciLCJmaWxlc3lzdGVtIiwicmVhZEZpbGVTeW5jIiwidGVtcGxhdGVBcmd1bWVudCIsInRlbXBsYXRlQ29udHJvbGxlciIsIkFwcGxpY2F0aW9uIiwidW5kZXJzY29yZSIsInRlbXBsYXRlIiwiT2JqZWN0IiwiYXNzaWduIiwicmVuZGVyZWRDb250ZW50U3RyaW5nIiwidmlld05hbWUiLCJ2aWV3T2JqZWN0IiwiQXJyYXkiLCJpc0FycmF5IiwidHJhdmVyc2VQb3J0IiwiYWdncmVnYXRlSW50b1RlbXBsYXRlT2JqZWN0IiwiaW5zZXJ0aW9uUG9pbnQiLCJjaGlsZHJlbiIsImZpbHRlckFuZE9yZGVyQ2hpbGRyZW4iLCJpbnNlcnRpb25Qb2ludEtleSIsImtleSIsInN1YnNlcXVlbnQiLCJpbml0aWFsaXplSW5zZXJ0aW9uUG9pbnQiLCJwcm90b3R5cGUiLCJwdXNoIiwiYXBwbHkiLCJzY2hlbWEiLCJhZGQiLCJleGVjdXRlIiwiY29uZGl0aW9uYWwiLCJleGVjdXRpb25MZXZlbCIsInJlcXVpcmUiLCJ0aGlzQXJnIiwic2VsZiIsInBhcmVudCIsInJlcXVlc3RPcHRpb24iLCJyZXF1ZXN0IiwiYm9keSIsImZpZWxkQXJyYXkiLCJmaWVsZCIsImZpbmQiLCJmaWVsZE5hbWUiLCJkYXRhc2V0IiwicmVzb2x2ZURhdGFzZXQiLCJwYXJlbnRSZXN1bHQiLCJzY2hlbWFNb2RlIiwiYXNzZXJ0Iiwibm90RXF1YWwiLCJ1bmRlZmluZWQiLCJkYXRhc2V0SGFuZGxpbmciLCJvYmplY3QiLCJwcm9taXNlQXJyYXkiLCJtYXAiLCJkb2N1bWVudCIsInN1YnNlcXVlbnREYXRhc2V0QXJyYXkiLCJhbGwiLCJzdWJzZXF1ZW50RGF0YXNldCIsImluZGV4IiwiZm9ybWF0RGF0YXNldE9mTmVzdGVkVHlwZSIsImV4dHJhZmllbGQiLCJmb3JFYWNoIiwia2V5cyIsImJpbmQiLCJhbGdvcml0aG0iLCJtb2R1bGUiLCJyZXNvbHZlciIsInJlc29sdmVyQXJndW1lbnQiLCJhcmdzIiwiQm9vbGVhbiIsInBvcnRDbGFzc0luc3RhbmNlIl0sIm1hcHBpbmdzIjoid3dCQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVPLGVBQWVBLGlCQUFmLENBQWlDLEVBQUVDLFNBQUYsRUFBYUMsV0FBYixFQUFqQyxFQUE2RDtBQUNsRSwrQkFBSUQsU0FBUyxDQUFDRSxVQUFkLDBEQUFJLHNCQUFzQkMsSUFBMUIsRUFB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QUE4QjtBQUM1QkMsSUFBQUEsWUFBWSxHQUFHLElBRGEsRUFBOUI7O0FBR0c7O0FBRUQsUUFBSUYsT0FBSjtBQUNBLFVBQU1xQixTQUFTLEdBQUcsS0FBS3RFLElBQUwsQ0FBVXNFLFNBQTVCO0FBQ0E7QUFDRUEsSUFBQUEsU0FBUyxDQUFDNUUsSUFEWjs7QUFHRSxXQUFLLE1BQUw7QUFDQTtBQUNFO0FBQ0UsY0FBSTZFLE1BQU0sR0FBR2pDLE9BQU8sQ0FBQ2dDLFNBQVMsQ0FBQ3ZHLElBQVgsQ0FBUCxDQUF3Qm5CLE9BQXJDO0FBQ0EsY0FBSSxPQUFPMkgsTUFBUCxLQUFrQixVQUF0QixFQUFrQ0EsTUFBTSxHQUFHQSxNQUFNLENBQUMzSCxPQUFoQjtBQUNsQyxjQUFJNEgsUUFBUSxHQUFHRCxNQUFNLEVBQXJCO0FBQ0EsY0FBSUUsZ0JBQWdCLEdBQUczRCxNQUFNLENBQUNDLE1BQVAsQ0FBYyxHQUFHLENBQUMsS0FBSzJELElBQU4sRUFBWUosU0FBUyxDQUFDaEcsUUFBdEIsRUFBZ0NsQixNQUFoQyxDQUF1Q3VILE9BQXZDLENBQWpCLENBQXZCO0FBQ0ExQixVQUFBQSxPQUFPLEdBQUcsTUFBTXVCLFFBQVEsQ0FBQztBQUN2QkksWUFBQUEsaUJBQWlCLEVBQUUsS0FBS2pGLGVBREQ7QUFFdkIrRSxZQUFBQSxJQUFJLEVBQUVELGdCQUZpQjtBQUd2QnRCLFlBQUFBLFlBSHVCLEVBQUQsQ0FBeEI7O0FBS0Q7QUFDRCxjQWhCSjs7O0FBbUJBLFdBQU9GLE9BQVA7QUFDRDtBQUNGLENBN0pEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0J1xuaW1wb3J0IHsgZXhlYywgZXhlY1N5bmMsIHNwYXduLCBzcGF3blN5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHsgbm9kZUxhYmVsLCBjb25uZWN0aW9uVHlwZSwgY29ubmVjdGlvblByb3BlcnR5IH0gZnJvbSAnLi4vLi4vLi4vZ3JhcGhNb2RlbC9ncmFwaFNjaGVtZVJlZmVyZW5jZS5qcydcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJldHVybkRhdGFJdGVtS2V5KHsgc3RhZ2VOb2RlLCBwcm9jZXNzTm9kZSB9KSB7XG4gIGlmIChzdGFnZU5vZGUucHJvcGVydGllcz8ubmFtZSkgcmV0dXJuIGAke3N0YWdlTm9kZS5wcm9wZXJ0aWVzPy5uYW1lfWBcbn1cblxuLy8gaW1wbGVtZW50YXRpb24gZGVsYXlzIHByb21pc2VzIGZvciB0ZXN0aW5nIGBpdGVyYXRlQ29ubmVjdGlvbmAgb2YgcHJvbWlzZXMgZS5nLiBgYWxsUHJvbWlzZWAsIGByYWNlRmlyc3RQcm9taXNlYCwgZXRjLlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRpbWVvdXQoeyBub2RlIH0pIHtcbiAgY29uc29sZS5sb2coJ3RpbWVvdXQnKVxuICBpZiAodHlwZW9mIG5vZGUucHJvcGVydGllcz8udGltZXJEZWxheSAhPSAnbnVtYmVyJykgdGhyb3cgbmV3IEVycm9yKCfigKIgRGF0YUl0ZW0gbXVzdCBoYXZlIGEgZGVsYXkgdmFsdWUuJylcbiAgbGV0IGRlbGF5ID0gbm9kZS5wcm9wZXJ0aWVzPy50aW1lckRlbGF5XG4gIHJldHVybiBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coYCR7ZGVsYXl9bXMgcGFzc2VkIGZvciBrZXkgJHtub2RlLmtleX0uYCkgLy8gZGVidWdcbiAgICAgIHJlc29sdmUobm9kZS5wcm9wZXJ0aWVzPy5uYW1lKVxuICAgIH0sIGRlbGF5KSxcbiAgKVxufVxuXG4vKipcbiAqIGBwcm9jZXNzRGF0YWAgaW1wbGVtZW50YXRpb24gb2YgYGdyYXBoVHJhdmVyc2FsYCBtb2R1bGVcbiAqIGV4ZWN1dGUgZnVuY3Rpb25zIHRocm91Z2ggYSBzdHJpbmcgcmVmZXJlbmNlIGZyb20gdGhlIGdyYXBoIGRhdGFiYXNlIHRoYXQgbWF0Y2ggdGhlIGtleSBvZiB0aGUgYXBwbGljYXRpb24gcmVmZXJlbmNlIGNvbnRleHQgb2JqZWN0XG4gKi9cbmNvbnN0IGV4ZWN1dGVSZWZlcmVuY2UgPSBjb250ZXh0UHJvcGVydHlOYW1lID0+XG4gIGFzeW5jIGZ1bmN0aW9uKHsgbm9kZSwgZ3JhcGhJbnN0YW5jZSB9KSB7XG4gICAgbGV0IHJlZmVyZW5jZUNvbnRleHQgPSBncmFwaEluc3RhbmNlLmNvbnRleHRbY29udGV4dFByb3BlcnR5TmFtZV1cbiAgICBhc3NlcnQocmVmZXJlbmNlQ29udGV4dCwgYOKAoiBDb250ZXh0IFwiJHtjb250ZXh0UHJvcGVydHlOYW1lfVwiIHZhcmlhYmxlIGlzIHJlcXVpcmVkIHRvIHJlZmVyZW5jZSBmdW5jdGlvbnMgZnJvbSBncmFwaCBkYXRhYmFzZSBzdHJpbmdzLmApXG5cbiAgICBsZXQgcmVzb3VyY2VcbiAgICBjb25zdCB7IHJlc291cmNlQXJyYXkgfSA9IGF3YWl0IGdyYXBoSW5zdGFuY2UuZGF0YWJhc2VXcmFwcGVyLmdldFJlc291cmNlKHsgY29uY3JldGVEYXRhYmFzZTogZ3JhcGhJbnN0YW5jZS5kYXRhYmFzZSwgbm9kZUlEOiBub2RlLmlkZW50aXR5IH0pXG4gICAgaWYgKHJlc291cmNlQXJyYXkubGVuZ3RoID4gMSkgdGhyb3cgbmV3IEVycm9yKGDigKIgTXVsdGlwbGUgcmVzb3VyY2UgcmVsYXRpb25zaGlwcyBhcmUgbm90IHN1cHBvcnRlZCBmb3IgUHJvY2VzcyBub2RlLmApXG4gICAgZWxzZSBpZiAocmVzb3VyY2VBcnJheS5sZW5ndGggPT0gMCkgcmV0dXJuXG4gICAgZWxzZSByZXNvdXJjZSA9IHJlc291cmNlQXJyYXlbMF1cblxuICAgIGFzc2VydChyZXNvdXJjZS5kZXN0aW5hdGlvbi5sYWJlbHMuaW5jbHVkZXMobm9kZUxhYmVsLmZ1bmN0aW9uKSwgYOKAoiBVbnN1cHBvcnRlZCBOb2RlIHR5cGUgZm9yIHJlc291cmNlIGNvbm5lY3Rpb24uYClcbiAgICBsZXQgZnVuY3Rpb25OYW1lID0gcmVzb3VyY2UuZGVzdGluYXRpb24ucHJvcGVydGllcy5mdW5jdGlvbk5hbWUgfHwgdGhyb3cgbmV3IEVycm9yKGDigKIgZnVuY3Rpb24gcmVzb3VyY2UgbXVzdCBoYXZlIGEgXCJmdW5jdGlvbk5hbWVcIiAtICR7cmVzb3VyY2UuZGVzdGluYXRpb24ucHJvcGVydGllcy5mdW5jdGlvbk5hbWV9YClcbiAgICBsZXQgZnVuY3Rpb25DYWxsYmFjayA9IHJlZmVyZW5jZUNvbnRleHRbZnVuY3Rpb25OYW1lXSB8fCB0aHJvdyBuZXcgRXJyb3IoYOKAoiByZWZlcmVuY2UgZnVuY3Rpb24gbmFtZSBkb2Vzbid0IGV4aXN0LmApXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBmdW5jdGlvbkNhbGxiYWNrKHsgbm9kZSwgY29udGV4dDogZ3JhcGhJbnN0YW5jZS5jb250ZXh0IH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpICYmIHByb2Nlc3MuZXhpdCgpXG4gICAgfVxuICB9XG5cbi8vIHVzZWQgZm9yIGV4ZWN1dGluZyB0YXNrc1xuZXhwb3J0IGNvbnN0IGV4ZWN1dGVGdW5jdGlvblJlZmVyZW5jZSA9IGV4ZWN1dGVSZWZlcmVuY2UoJ2Z1bmN0aW9uQ29udGV4dCcpXG5cbi8qXG4gICAgX19fXyAgICAgICAgICAgICAgICBfIF8gXyAgIF8gICAgICAgICAgICAgXG4gICAvIF9fX3xfX18gIF8gX18gICBfX3wgKF8pIHxfKF8pIF9fXyAgXyBfXyAgXG4gIHwgfCAgIC8gXyBcXHwgJ18gXFwgLyBfYCB8IHwgX198IHwvIF8gXFx8ICdfIFxcIFxuICB8IHxfX3wgKF8pIHwgfCB8IHwgKF98IHwgfCB8X3wgfCAoXykgfCB8IHwgfFxuICAgXFxfX19fXFxfX18vfF98IHxffFxcX18sX3xffFxcX198X3xcXF9fXy98X3wgfF98XG4qL1xuZXhwb3J0IGNvbnN0IGNoZWNrQ29uZGl0aW9uUmVmZXJlbmNlID0gZXhlY3V0ZVJlZmVyZW5jZSgnY29uZGl0aW9uQ29udGV4dCcpXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzd2l0Y2hDYXNlKHsgbm9kZSwgZ3JhcGhJbnN0YW5jZSwgbmV4dFByb2Nlc3NEYXRhIH0pIHtcbiAgY29uc3QgeyBjYXNlQXJyYXksIGRlZmF1bHQ6IGRlZmF1bHRSZWxhdGlvbnNoaXAgfSA9IGF3YWl0IGdyYXBoSW5zdGFuY2UuZGF0YWJhc2VXcmFwcGVyLmdldFN3aXRjaEVsZW1lbnQoeyBjb25jcmV0ZURhdGFiYXNlOiBncmFwaEluc3RhbmNlLmRhdGFiYXNlLCBub2RlSUQ6IG5vZGUuaWRlbnRpdHkgfSlcbiAgY29uc3QgdmFsdWUgPSBhd2FpdCBncmFwaEluc3RhbmNlLmRhdGFiYXNlV3JhcHBlci5nZXRUYXJnZXRWYWx1ZSh7IGNvbmNyZXRlRGF0YWJhc2U6IGdyYXBoSW5zdGFuY2UuZGF0YWJhc2UsIG5vZGVJRDogbm9kZS5pZGVudGl0eSB9KVxuXG4gIC8vIHJ1biBjb25kaXRpb24gY2hlY2tcbiAgbGV0IGNvbXBhcmlzb25WYWx1ZVxuICBpZiAodmFsdWUpIGNvbXBhcmlzb25WYWx1ZSA9IHZhbHVlXG4gIGVsc2UgY29tcGFyaXNvblZhbHVlID0gbmV4dFByb2Nlc3NEYXRhXG5cbiAgLy8gU3dpdGNoIGNhc2VzOiByZXR1cm4gZXZhbHVhdGlvbiBjb25maWd1cmF0aW9uXG4gIGxldCBjaG9zZW5Ob2RlXG4gIGlmIChjYXNlQXJyYXkpIHtcbiAgICAvLyBjb21wYXJlIGV4cGVjdGVkIHZhbHVlIHdpdGggcmVzdWx0XG4gICAgbGV0IGNhc2VSZWxhdGlvbnNoaXAgPSBjYXNlQXJyYXkuZmlsdGVyKGNhc2VSZWxhdGlvbnNoaXAgPT4gY2FzZVJlbGF0aW9uc2hpcC5jb25uZWN0aW9uLnByb3BlcnRpZXM/LmV4cGVjdGVkID09IGNvbXBhcmlzb25WYWx1ZSlbMF1cbiAgICBjaG9zZW5Ob2RlID0gY2FzZVJlbGF0aW9uc2hpcD8uZGVzdGluYXRpb25cbiAgfVxuICBjaG9zZW5Ob2RlIHx8PSBkZWZhdWx0UmVsYXRpb25zaGlwPy5kZXN0aW5hdGlvblxuXG4gIHJldHVybiBjaG9zZW5Ob2RlIHx8IG51bGxcbn1cblxuLypcbiAgIF9fICBfXyBfICAgICBfICAgICBfIF8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICB8ICBcXC8gIChfKSBfX3wgfCBfX3wgfCB8IF9fX19fICAgICAgX19fXyBfIF8gX18gX19fIFxuICB8IHxcXC98IHwgfC8gX2AgfC8gX2AgfCB8LyBfIFxcIFxcIC9cXCAvIC8gX2AgfCAnX18vIF8gXFxcbiAgfCB8ICB8IHwgfCAoX3wgfCAoX3wgfCB8ICBfXy9cXCBWICBWIC8gKF98IHwgfCB8ICBfXy9cbiAgfF98ICB8X3xffFxcX18sX3xcXF9fLF98X3xcXF9fX3wgXFxfL1xcXy8gXFxfXyxffF98ICBcXF9fX3xcbiAgQ3JlYXRlcyBtaWRkbGV3YXJlIGFycmF5IGZyb20gZ3JhcGgtICBUaGUgZ3JhcGggdHJhdmVyc2FsIEByZXR1cm4ge0FycmF5IG9mIE9iamVjdHN9IHdoZXJlIGVhY2ggb2JqZWN0IGNvbnRhaW5zIGluc3RydWN0aW9uIHNldHRpbmdzIHRvIGJlIHVzZWQgdGhyb3VnaCBhbiBpbXBsZW1lbnRpbmcgbW9kdWxlIHRvIGFkZCB0byBhIGNoYWluIG9mIG1pZGRsZXdhcmVzLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICBvciBJbW1lZGlhdGVseSBleGVjdXRlIG1pZGRsZXdhcmVcbiovXG4vLyBhIGZ1bmN0aW9uIHRoYXQgY29tcGxpZXMgd2l0aCBncmFwaFRyYXZlcnNhbCBwcm9jZXNzRGF0YSBpbXBsZW1lbnRhdGlvbi5cbmV4cG9ydCBjb25zdCBpbW1lZGlhdGVseUV4ZWN1dGVNaWRkbGV3YXJlID0gYXN5bmMgKHsgbm9kZSwgZ3JhcGhJbnN0YW5jZSwgbmV4dFByb2Nlc3NEYXRhIH0sIHsgbmV4dEZ1bmN0aW9uIH0pID0+IHtcbiAgbGV0IGZ1bmN0aW9uQ29udGV4dCA9IGdyYXBoSW5zdGFuY2UuY29udGV4dC5mdW5jdGlvbkNvbnRleHRcbiAgYXNzZXJ0KGZ1bmN0aW9uQ29udGV4dCwgYOKAoiBDb250ZXh0IFwiZnVuY3Rpb25Db250ZXh0XCIgdmFyaWFibGUgaXMgcmVxdWlyZWQgdG8gcmVmZXJlbmNlIGZ1bmN0aW9ucyBmcm9tIGdyYXBoIGRhdGFiYXNlIHN0cmluZ3MuYClcbiAgYXNzZXJ0KGdyYXBoSW5zdGFuY2UubWlkZGxld2FyZVBhcmFtZXRlcj8uY29udGV4dCwgYOKAoiBNaWRkbGV3YXJlIGdyYXBoIHRyYXZlcnNhbCByZWxpZXMgb24gZ3JhcGhJbnN0YW5jZS5taWRkbGV3YXJlUGFyYW1ldGVyLmNvbnRleHRgKVxuXG4gIGxldCByZXNvdXJjZVxuICBjb25zdCB7IHJlc291cmNlQXJyYXkgfSA9IGF3YWl0IGdyYXBoSW5zdGFuY2UuZGF0YWJhc2VXcmFwcGVyLmdldFJlc291cmNlKHsgY29uY3JldGVEYXRhYmFzZTogZ3JhcGhJbnN0YW5jZS5kYXRhYmFzZSwgbm9kZUlEOiBub2RlLmlkZW50aXR5IH0pXG4gIGlmIChyZXNvdXJjZUFycmF5Lmxlbmd0aCA+IDEpIHRocm93IG5ldyBFcnJvcihg4oCiIE11bHRpcGxlIHJlc291cmNlIHJlbGF0aW9uc2hpcHMgYXJlIG5vdCBzdXBwb3J0ZWQgZm9yIFByb2Nlc3Mgbm9kZS5gKVxuICBlbHNlIGlmIChyZXNvdXJjZUFycmF5Lmxlbmd0aCA9PSAwKSByZXR1cm5cbiAgZWxzZSByZXNvdXJjZSA9IHJlc291cmNlQXJyYXlbMF1cblxuICBhc3NlcnQocmVzb3VyY2UuZGVzdGluYXRpb24ubGFiZWxzLmluY2x1ZGVzKG5vZGVMYWJlbC5mdW5jdGlvbiksIGDigKIgVW5zdXBwb3J0ZWQgTm9kZSB0eXBlIGZvciByZXNvdXJjZSBjb25uZWN0aW9uLmApXG4gIGxldCBmdW5jdGlvbk5hbWUgPSByZXNvdXJjZS5kZXN0aW5hdGlvbi5wcm9wZXJ0aWVzLmZ1bmN0aW9uTmFtZSB8fCB0aHJvdyBuZXcgRXJyb3IoYOKAoiBmdW5jdGlvbiByZXNvdXJjZSBtdXN0IGhhdmUgYSBcImZ1bmN0aW9uTmFtZVwiIC0gJHtyZXNvdXJjZS5kZXN0aW5hdGlvbi5wcm9wZXJ0aWVzLmZ1bmN0aW9uTmFtZX1gKVxuICBsZXQgbWlkZGxld2FyZUZ1bmN0aW9uID0gZnVuY3Rpb25Db250ZXh0W2Z1bmN0aW9uTmFtZV0gfHwgdGhyb3cgbmV3IEVycm9yKGDigKIgcmVmZXJlbmNlIGZ1bmN0aW9uIG5hbWUgZG9lc24ndCBleGlzdC5gKVxuICB0cnkge1xuICAgIGF3YWl0IG1pZGRsZXdhcmVGdW5jdGlvbihncmFwaEluc3RhbmNlLm1pZGRsZXdhcmVQYXJhbWV0ZXIuY29udGV4dCwgbmV4dEZ1bmN0aW9uKSAvLyBleGVjdXRlIG1pZGRsZXdhcmVcbiAgICByZXR1cm4gbWlkZGxld2FyZUZ1bmN0aW9uIC8vIGFsbG93IHRvIGFnZ3JlZ2F0ZSBtaWRkbGV3YXJlIGZ1bmN0aW9uIGZvciBkZWJ1Z2dpbmcgcHVycG9zZXMuXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnJvcikgJiYgcHJvY2Vzcy5leGl0KClcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgcmV0dXJuTWlkZGxld2FyZUZ1bmN0aW9uID0gYXN5bmMgKHsgbm9kZSwgZ3JhcGhJbnN0YW5jZSB9KSA9PiB7XG4gIGxldCBmdW5jdGlvbkNvbnRleHQgPSBncmFwaEluc3RhbmNlLmNvbnRleHQuZnVuY3Rpb25Db250ZXh0XG4gIGFzc2VydChmdW5jdGlvbkNvbnRleHQsIGDigKIgQ29udGV4dCBcImZ1bmN0aW9uQ29udGV4dFwiIHZhcmlhYmxlIGlzIHJlcXVpcmVkIHRvIHJlZmVyZW5jZSBmdW5jdGlvbnMgZnJvbSBncmFwaCBkYXRhYmFzZSBzdHJpbmdzLmApXG5cbiAgbGV0IHJlc291cmNlXG4gIGNvbnN0IHsgcmVzb3VyY2VBcnJheSB9ID0gYXdhaXQgZ3JhcGhJbnN0YW5jZS5kYXRhYmFzZVdyYXBwZXIuZ2V0UmVzb3VyY2UoeyBjb25jcmV0ZURhdGFiYXNlOiBncmFwaEluc3RhbmNlLmRhdGFiYXNlLCBub2RlSUQ6IG5vZGUuaWRlbnRpdHkgfSlcbiAgaWYgKHJlc291cmNlQXJyYXkubGVuZ3RoID4gMSkgdGhyb3cgbmV3IEVycm9yKGDigKIgTXVsdGlwbGUgcmVzb3VyY2UgcmVsYXRpb25zaGlwcyBhcmUgbm90IHN1cHBvcnRlZCBmb3IgUHJvY2VzcyBub2RlLmApXG4gIGVsc2UgaWYgKHJlc291cmNlQXJyYXkubGVuZ3RoID09IDApIHJldHVyblxuICBlbHNlIHJlc291cmNlID0gcmVzb3VyY2VBcnJheVswXVxuXG4gIGFzc2VydChyZXNvdXJjZS5kZXN0aW5hdGlvbi5sYWJlbHMuaW5jbHVkZXMobm9kZUxhYmVsLmZ1bmN0aW9uKSwgYOKAoiBVbnN1cHBvcnRlZCBOb2RlIHR5cGUgZm9yIHJlc291cmNlIGNvbm5lY3Rpb24uYClcbiAgbGV0IGZ1bmN0aW9uTmFtZSA9IHJlc291cmNlLmRlc3RpbmF0aW9uLnByb3BlcnRpZXMuZnVuY3Rpb25OYW1lIHx8IHRocm93IG5ldyBFcnJvcihg4oCiIGZ1bmN0aW9uIHJlc291cmNlIG11c3QgaGF2ZSBhIFwiZnVuY3Rpb25OYW1lXCIgLSAke3Jlc291cmNlLmRlc3RpbmF0aW9uLnByb3BlcnRpZXMuZnVuY3Rpb25OYW1lfWApXG4gIGxldCBtaWRkbGV3YXJlRnVuY3Rpb24gPSBmdW5jdGlvbkNvbnRleHRbZnVuY3Rpb25OYW1lXSB8fCB0aHJvdyBuZXcgRXJyb3IoYOKAoiByZWZlcmVuY2UgZnVuY3Rpb24gbmFtZSBkb2Vzbid0IGV4aXN0LmApXG4gIHRyeSB7XG4gICAgcmV0dXJuIG1pZGRsZXdhcmVGdW5jdGlvblxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpICYmIHByb2Nlc3MuZXhpdCgpXG4gIH1cbn1cblxuLypcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXyAgICAgIF9fX19fICAgICAgICAgXyAgICAgX19fXyAgICAgICAgICAgIF8gICAgICAgXyAgIFxuICBfX19fXyAgX19fX18gIF9fXyBfICAgX3wgfF8gX198XyAgIF98XyBfIF9fX3wgfCBfXy8gX19ffCAgX19fIF8gX18oXylfIF9fIHwgfF8gXG4gLyBfIFxcIFxcLyAvIF8gXFwvIF9ffCB8IHwgfCBfXy8gXyBcXHwgfC8gX2AgLyBfX3wgfC8gL1xcX19fIFxcIC8gX198ICdfX3wgfCAnXyBcXHwgX198XG58ICBfXy8+ICA8ICBfXy8gKF9ffCB8X3wgfCB8fCAgX18vfCB8IChffCBcXF9fIFxcICAgPCAgX19fKSB8IChfX3wgfCAgfCB8IHxfKSB8IHxfIFxuXFxfX18vXy9cXF9cXF9fX3xcXF9fX3xcXF9fLF98XFxfX1xcX19ffHxffFxcX18sX3xfX18vX3xcXF9cXHxfX19fLyBcXF9fX3xffCAgfF98IC5fXy8gXFxfX3xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxffCAgICAgICAgXG4qL1xubGV0IG1lc3NhZ2UgPSBgIF9fX19fICAgICAgICAgICAgICAgICAgICAgICAgICBfICAgICAgICBcbnwgX19fX3xfXyAgX18gX19fICAgX19fICBfICAgXyB8IHxfICBfX18gXG58ICBffCAgXFxcXCBcXFxcLyAvLyBfIFxcXFwgLyBfX3x8IHwgfCB8fCBfX3wvIF8gXFxcXFxufCB8X19fICA+ICA8fCAgX18vfCAoX18gfCB8X3wgfHwgfF98ICBfXy8gICAgXG58X19fX198L18vXFxcXF9cXFxcXFxcXF9fX3wgXFxcXF9fX3wgXFxcXF9fLF98IFxcXFxfX3xcXFxcX19ffGBcbmNvbnN0IHJvb3RQYXRoID0gcGF0aC5ub3JtYWxpemUocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uLy4uLy4uLycpKVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZVNjcmlwdFNwYXduKHsgbm9kZSB9KSB7XG4gIGxldCBjaGlsZFByb2Nlc3NcbiAgdHJ5IHtcbiAgICBjb25zb2xlLmxvZyhtZXNzYWdlKVxuICAgIGNvbnNvbGUubG9nKGBcXHgxYls0NW0lc1xceDFiWzBtYCwgYCR7bm9kZS5jb21tYW5kfSAke25vZGUuYXJndW1lbnQuam9pbignICcpfWApXG4gICAgY2hpbGRQcm9jZXNzID0gc3Bhd25TeW5jKG5vZGUuY29tbWFuZCwgbm9kZS5hcmd1bWVudCwgSlNPTi5zdHJpbmdpZnkobm9kZS5vcHRpb24pKVxuICAgIGlmIChjaGlsZFByb2Nlc3Muc3RhdHVzID4gMCkgdGhyb3cgY2hpbGRQcm9jZXNzLmVycm9yXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcHJvY2Vzcy5leGl0KGNoaWxkUHJvY2Vzcy5zdGF0dXMpXG4gIH1cbiAgLy8gYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDUwMCkpIC8vIHdhaXQgeCBzZWNvbmRzIGJlZm9yZSBuZXh0IHNjcmlwdCBleGVjdXRpb24gLy8gaW1wb3J0YW50IHRvIHByZXZlbnQgJ3VuYWJsZSB0byByZS1vcGVuIHN0ZGluJyBlcnJvciBiZXR3ZWVuIHNoZWxscy5cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGV4ZWN1dGVTY3JpcHRTcGF3bklnbm9yZUVycm9yKHsgbm9kZSB9KSB7XG4gIGxldCBjaGlsZFByb2Nlc3NcbiAgdHJ5IHtcbiAgICBjb25zb2xlLmxvZyhtZXNzYWdlKVxuICAgIGNvbnNvbGUubG9nKGBcXHgxYls0NW0lc1xceDFiWzBtYCwgYCR7bm9kZS5jb21tYW5kfSAke25vZGUuYXJndW1lbnQuam9pbignICcpfWApXG4gICAgY2hpbGRQcm9jZXNzID0gc3Bhd25TeW5jKG5vZGUuY29tbWFuZCwgbm9kZS5hcmd1bWVudCwgSlNPTi5zdHJpbmdpZnkobm9kZS5vcHRpb24pKVxuICAgIGlmIChjaGlsZFByb2Nlc3Muc3RhdHVzID4gMCkgdGhyb3cgY2hpbGRQcm9jZXNzLmVycm9yXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5sb2coY2hpbGRQcm9jZXNzLnN0YXR1cylcbiAgfVxuICAvLyBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTAwKSkgLy8gd2FpdCB4IHNlY29uZHMgYmVmb3JlIG5leHQgc2NyaXB0IGV4ZWN1dGlvbiAvLyBpbXBvcnRhbnQgdG8gcHJldmVudCAndW5hYmxlIHRvIHJlLW9wZW4gc3RkaW4nIGVycm9yIGJldHdlZW4gc2hlbGxzLlxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZVNjcmlwdFNwYXduQXN5bmNocm9ub3VzKHsgbm9kZSB9KSB7XG4gIGxldCBjaGlsZFByb2Nlc3NcbiAgdHJ5IHtcbiAgICBjb25zb2xlLmxvZyhtZXNzYWdlKVxuICAgIGNvbnNvbGUubG9nKGBcXHgxYls0NW0lc1xceDFiWzBtYCwgYCR7bm9kZS5jb21tYW5kfSAke25vZGUuYXJndW1lbnQuam9pbignICcpfWApXG4gICAgY2hpbGRQcm9jZXNzID0gc3Bhd24obm9kZS5jb21tYW5kLCBub2RlLmFyZ3VtZW50LCBKU09OLnN0cmluZ2lmeShub2RlLm9wdGlvbikpXG4gICAgaWYgKGNoaWxkUHJvY2Vzcy5zdGF0dXMgPiAwKSB0aHJvdyBjaGlsZFByb2Nlc3MuZXJyb3JcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBwcm9jZXNzLmV4aXQoY2hpbGRQcm9jZXNzLnN0YXR1cylcbiAgfVxuICAvLyBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTAwKSkgLy8gd2FpdCB4IHNlY29uZHMgYmVmb3JlIG5leHQgc2NyaXB0IGV4ZWN1dGlvbiAvLyBpbXBvcnRhbnQgdG8gcHJldmVudCAndW5hYmxlIHRvIHJlLW9wZW4gc3RkaW4nIGVycm9yIGJldHdlZW4gc2hlbGxzLlxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZVNoZWxsc2NyaXB0RmlsZSh7IG5vZGUgfSkge1xuICB0cnkge1xuICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpXG4gICAgY29uc29sZS5sb2coYFxceDFiWzQ1bSVzXFx4MWJbMG1gLCBgc2hlbGxzY3JpcHQgcGF0aDogJHtyZXNvdXJjZS5wcm9wZXJ0aWVzLnBhdGh9YClcbiAgICBsZXQgYWJzb2x1dGVQYXRoID0gcGF0aC5qb2luKCcvJywgcm9vdFBhdGgsIHJlc291cmNlLnByb3BlcnRpZXMucGF0aClcbiAgICBleGVjU3luYyhgc2ggJHthYnNvbHV0ZVBhdGh9YCwgeyBjd2Q6IHBhdGguZGlybmFtZShhYnNvbHV0ZVBhdGgpLCBzaGVsbDogdHJ1ZSwgc3RkaW86IFsnaW5oZXJpdCcsICdpbmhlcml0JywgJ2luaGVyaXQnXSB9KVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHRocm93IGVycm9yXG4gICAgcHJvY2Vzcy5leGl0KDEpXG4gIH1cbiAgLy8gYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDUwMCkpIC8vIHdhaXQgeCBzZWNvbmRzIGJlZm9yZSBuZXh0IHNjcmlwdCBleGVjdXRpb24gLy8gaW1wb3J0YW50IHRvIHByZXZlbnQgJ3VuYWJsZSB0byByZS1vcGVuIHN0ZGluJyBlcnJvciBiZXR3ZWVuIHNoZWxscy5cbiAgcmV0dXJuIG51bGxcbn1cblxuLypcbiBcbiAgIF9fX19fICAgICAgICAgICAgICAgICAgICBfICAgICAgIF8gICAgICAgXG4gIHxfICAgX3xfXyBfIF9fIF9fXyAgXyBfXyB8IHwgX18gX3wgfF8gX19fIFxuICAgIHwgfC8gXyBcXCAnXyBgIF8gXFx8ICdfIFxcfCB8LyBfYCB8IF9fLyBfIFxcXG4gICAgfCB8ICBfXy8gfCB8IHwgfCB8IHxfKSB8IHwgKF98IHwgfHwgIF9fL1xuICAgIHxffFxcX19ffF98IHxffCB8X3wgLl9fL3xffFxcX18sX3xcXF9fXFxfX198XG4gICAgICAgICAgICAgICAgICAgICB8X3wgICAgICAgICAgICAgICAgICAgIFxuIFxuKi9cblxuLy8gbGV0IHVuZGVyc2NvcmUgPSByZXF1aXJlKCd1bmRlcnNjb3JlJylcbi8qKlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gU3RyaW5nIG9mIHJlbmRlcmVkIEhUTUwgZG9jdW1lbnQgY29udGVudC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gaW5pdGlhbGl6ZU5lc3RlZFVuaXQoeyBuZXN0ZWRVbml0S2V5LCBhZGRpdGlvbmFsQ2hpbGROZXN0ZWRVbml0ID0gW10sIHBhdGhQb2ludGVyS2V5ID0gbnVsbCB9KSB7XG4gIC8vIHZpZXdzIGFyZ3VtZW50IHRoYXQgd2lsbCBiZSBpbml0aWFsbGl6ZWQgaW5zaWRlIHRlbXBsYXRlczpcbiAgLy8gbG9vcCB0aHJvdWdoIHRlbXBsYXRlIGFuZCBjcmVhdGUgcmVuZGVyZWQgdmlldyBjb250ZW50LlxuICBsZXQgdmlldyA9IGF3YWl0IG5lc3RlZFVuaXRJbnN0YW5jZS5sb29wSW5zZXJ0aW9uUG9pbnQoeyB0eXBlOiAnYWdncmVnYXRlSW50b1RlbXBsYXRlT2JqZWN0JyB9KVxuXG4gIGFzc2VydCh0aGlzLnBvcnRBcHBJbnN0YW5jZS5jb25maWcuY2xpZW50U2lkZVBhdGgsIFwi4oCiIGNsaWVudFNpZGVQYXRoIGNhbm5vdCBiZSB1bmRlZmluZWQuIGkuZS4gcHJldmlvdXMgbWlkZGxld2FyZXMgc2hvdWxkJ3ZlIHNldCBpdFwiKVxuICBsZXQgdGVtcGxhdGVQYXRoID0gcGF0aC5qb2luKHRoaXMucG9ydEFwcEluc3RhbmNlLmNvbmZpZy5jbGllbnRTaWRlUGF0aCwgdW5pdEluc3RhbmNlLmZpbGUuZmlsZVBhdGgpXG4gIGxldCByZW5kZXJlZENvbnRlbnRcbiAgc3dpdGNoICh1bml0SW5zdGFuY2UucHJvY2Vzc0RhdGFJbXBsZW1lbnRhdGlvbikge1xuICAgIGRlZmF1bHQ6XG4gICAgY2FzZSAndW5kZXJzY29yZVJlbmRlcmluZyc6XG4gICAgICByZW5kZXJlZENvbnRlbnQgPSBhd2FpdCB0aGlzLnVuZGVyc2NvcmVSZW5kZXJpbmcoeyB0ZW1wbGF0ZVBhdGgsIHZpZXcgfSlcbiAgICAgIGJyZWFrXG4gIH1cblxuICBzd2l0Y2ggKHVuaXRJbnN0YW5jZS5wcm9jZXNzUmVuZGVyZWRDb250ZW50KSB7XG4gICAgY2FzZSAnd3JhcEpzVGFnJzpcbiAgICAgIHJlbmRlcmVkQ29udGVudCA9IGA8c2NyaXB0IHR5cGU9XCJtb2R1bGVcIiBhc3luYz4ke3JlbmRlcmVkQ29udGVudH08L3NjcmlwdD5gXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6IC8vIHNraXBcbiAgfVxuXG4gIHJldHVybiByZW5kZXJlZENvbnRlbnRcbn1cblxuYXN5bmMgZnVuY3Rpb24gdW5kZXJzY29yZVJlbmRlcmluZyh7IHRlbXBsYXRlUGF0aCwgdmlldyB9KSB7XG4gIC8vIExvYWQgdGVtcGxhdGUgZmlsZS5cbiAgbGV0IHRlbXBsYXRlU3RyaW5nID0gYXdhaXQgZmlsZXN5c3RlbS5yZWFkRmlsZVN5bmModGVtcGxhdGVQYXRoLCAndXRmLTgnKVxuICAvLyBTaGFyZWQgYXJndW1lbnRzIGJldHdlZW4gYWxsIHRlbXBsYXRlcyBiZWluZyByZW5kZXJlZFxuICBjb25zdCB0ZW1wbGF0ZUFyZ3VtZW50ID0ge1xuICAgIHRlbXBsYXRlQ29udHJvbGxlcjogdGhpcyxcbiAgICBjb250ZXh0OiB0aGlzLnBvcnRBcHBJbnN0YW5jZS5jb250ZXh0LFxuICAgIEFwcGxpY2F0aW9uLFxuICAgIGFyZ3VtZW50OiB7fSxcbiAgfVxuICBsZXQgcmVuZGVyZWRDb250ZW50ID0gdW5kZXJzY29yZS50ZW1wbGF0ZSh0ZW1wbGF0ZVN0cmluZykoXG4gICAgT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAgdGVtcGxhdGVBcmd1bWVudCwgLy8gdXNlIHRlbXBsYXRlQXJndW1lbnQgaW4gY3VycmVudCB0ZW1wbGF0ZVxuICAgICAgeyB2aWV3LCB0ZW1wbGF0ZUFyZ3VtZW50IH0sIC8vIHBhc3MgdGVtcGxhdGVBcmd1bWVudCB0byBuZXN0ZWQgdGVtcGxhdGVzXG4gICAgKSxcbiAgKVxuICByZXR1cm4gcmVuZGVyZWRDb250ZW50XG59XG5cbmZ1bmN0aW9uIHJlbmRlcmVkQ29udGVudFN0cmluZyh2aWV3TmFtZSwgdmlld09iamVjdCkge1xuICAvLyBsb29wIHRocm91Z2h0IHRoZSBzdHJpbmdzIGFycmF5IHRvIGNvbWJpbmUgdGhlbSBhbmQgcHJpbnQgc3RyaW5nIGNvZGUgdG8gdGhlIGZpbGUuXG4gIGlmICh2aWV3T2JqZWN0W3ZpZXdOYW1lXSAmJiBBcnJheS5pc0FycmF5KHZpZXdPYmplY3Rbdmlld05hbWVdKSkge1xuICAgIHJldHVybiB2aWV3T2JqZWN0W3ZpZXdOYW1lXS5qb2luKCcnKSAvLyBqb2lucyBhbGwgYXJyYXkgY29tcG9uZW50cyBpbnRvIG9uZSBzdHJpbmcuXG4gIH1cbn1cblxubGV0IHRyYXZlcnNlUG9ydCA9IGFzeW5jIGZ1bmN0aW9uIGFnZ3JlZ2F0ZUludG9UZW1wbGF0ZU9iamVjdCgpIHtcbiAgbGV0IHZpZXcgPSB7fVxuICBpZiAodGhpcy5pbnNlcnRpb25Qb2ludCkge1xuICAgIGZvciAobGV0IGluc2VydGlvblBvaW50IG9mIHRoaXMuaW5zZXJ0aW9uUG9pbnQpIHtcbiAgICAgIGxldCBjaGlsZHJlbiA9IGF3YWl0IHRoaXMuZmlsdGVyQW5kT3JkZXJDaGlsZHJlbih7IGluc2VydGlvblBvaW50S2V5OiBpbnNlcnRpb25Qb2ludC5rZXkgfSlcbiAgICAgIGxldCBzdWJzZXF1ZW50ID0gYXdhaXQgdGhpcy5pbml0aWFsaXplSW5zZXJ0aW9uUG9pbnQoeyBpbnNlcnRpb25Qb2ludCwgY2hpbGRyZW4gfSlcbiAgICAgIGlmICghKGluc2VydGlvblBvaW50Lm5hbWUgaW4gdmlldykpIHZpZXdbaW5zZXJ0aW9uUG9pbnQubmFtZV0gPSBbXVxuICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodmlld1tpbnNlcnRpb25Qb2ludC5uYW1lXSwgc3Vic2VxdWVudClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZpZXdcbn1cblxuLypcbiBcbiAgICAgICAgICAgIF8gICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgX19fICBfX198IHxfXyAgIF9fXyBfIF9fIF9fXyAgIF9fIF8gXG4gIC8gX198LyBfX3wgJ18gXFwgLyBfIFxcICdfIGAgXyBcXCAvIF9gIHxcbiAgXFxfXyBcXCAoX198IHwgfCB8ICBfXy8gfCB8IHwgfCB8IChffCB8XG4gIHxfX18vXFxfX198X3wgfF98XFxfX198X3wgfF98IHxffFxcX18sX3xcbiBBUEkgU2NoZW1hXG4gIChXaGlsZSB0aGUgZGF0YWJhc2UgbW9kZWxzIGFyZSBzZXBhcmF0ZSBpbiB0aGVpciBvd24gZnVuY3Rpb25zIG9yIGNvdWxkIGJlIGV4cG9zZWQgdGhyb3VnaCBhIGNsYXNzIG1vZHVsZSlcblxuICAtIFJlc29sdmVyIGZ1bmN0aW9uID0gYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgZGF0YS5cbiAgLSBEYXRhIGxvYWRlciA9IG1vZHVsZSB0aGF0IGFnZ3JlZ2F0ZXMgZHVwbGljYXRlIGNhbGxzLiBTb2x2aW5nIHRoZSBuKzEgcHJvYmxlbSwgd2hlcmUgZWFjaCBxdWVyeSBoYXMgYSBzdWJzZXF1ZW50IHF1ZXJ5LCBsaW5lYXIgZ3JhcGguIFRvIG5vZGVqcyBpdCB1c2VzIG5leHRUaWNrIGZ1bmN0aW9uIHRvIGFuYWx5c2UgdGhlIHByb21pc2VzIGJlZm9yZSB0aGVpciBleGVjdXRpb24gYW5kIHByZXZlbnQgbXVsdGlwbGUgcm91bmQgdHJpcHMgdG8gdGhlIHNlcnZlciBmb3IgdGhlIHNhbWUgZGF0YS5cbiAgLSBNYXBwaW5nIC0gdGhyb3VnaCByb3NvbHZlciBmdW5jdGlvbnMuXG4gIC0gU2NoZW1hID0gaXMgdGhlIHN0cnVjdHVyZSAmIHJlbGF0aW9uc2hpcHMgb2YgdGhlIGFwaSBkYXRhLiBpLmUuIGRlZmluZXMgaG93IGEgY2xpZW50IGNhbiBmZXRjaCBhbmQgdXBkYXRlIGRhdGEuXG4gICAgICBlYWNoIHNjaGVtYSBoYXMgYXBpIGVudHJ5cG9pbnRzLiBFYWNoIGZpZWxkIGNvcnJlc3BvbmRzIHRvIGEgcmVzb2x2ZXIgZnVuY3Rpb24uXG4gIERhdGEgZmV0Y2hpbmcgY29tcGxleGl0eSBhbmQgZGF0YSBzdHJ1Y3R1cmluZyBpcyBoYW5kbGVkIGJ5IHNlcnZlciBzaWRlIHJhdGhlciB0aGFuIGNsaWVudC5cblxuICAzIHR5cGVzIG9mIHBvc3NpYmxlIGFwaSBhY3Rpb25zOiBcbiAgLSBRdWVyeVxuICAtIE11dGF0aW9uXG4gIC0gU3Vic2NyaXB0aW9uIC0gY3JlYXRlcyBhIHN0ZWFkeSBjb25uZWN0aW9uIHdpdGggdGhlIHNlcnZlci5cblxuICBGZXRjaGluZyBhcHByb2FjaGVzOiBcbiAg4oCiIEltcGVyYXRpdmUgZmV0Y2hpbmc6IFxuICAgICAgLSBjb25zdHJ1Y3RzICYgc2VuZHMgSFRUUCByZXF1ZXN0LCBlLmcuIHVzaW5nIGpzIGZldGNoLlxuICAgICAgLSByZWNlaXZlICYgcGFyc2Ugc2VydmVyIHJlc3BvbnNlLlxuICAgICAgLSBzdG9yZSBkYXRhIGxvY2FsbHksIGUuZy4gaW4gbWVtb3J5IG9yIHBlcnNpc3RlbnQuIFxuICAgICAgLSBkaXNwbGF5IFVJLlxuICDigKIgRGVjbGFyYXRpdmUgZmV0Y2hpbmcgZS5nLiB1c2luZyBHcmFwaFFMIGNsaWVudHM6IFxuICAgICAgLSBEZXNjcmliZSBkYXRhIHJlcXVpcmVtZW50cy5cbiAgICAgIC0gRGlzcGxheSBpbmZvcm1hdGlvbiBpbiB0aGUgVUkuXG5cbiAgUmVxdWVzdDogXG4gIHtcbiAgICAgIGFjdGlvbjogcXVlcnksXG4gICAgICBlbnRyeXBvaW50OiB7XG4gICAgICAgICAga2V5OiBcIkFydGljbGVcIlxuICAgICAgfSxcbiAgICAgIGZ1bmN0aW9uOiB7XG4gICAgICAgICAgbmFtZTogXCJzaW5nbGVcIixcbiAgICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgICAgIGtleTogXCJhcnRpY2xlMVwiXG4gICAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZpZWxkOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBrZXluYW1lOiBcInRpdGxlXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5bmFtZTogXCJwYXJhZ3JhcGhcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBrZXluYW1lOiBcImF1dGhvcnNcIlxuICAgICAgICAgIH0sXG4gICAgICBdXG4gIH1cblxuICBSZXNwb25zZSA6XG4gIHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0aXRsZTogXCIuLi5cIixcbiAgICAgICAgICBwYXJhZ3JhcGg6ICcuLi4nLFxuICAgICAgICAgIGF1dGhvcjoge1xuICAgICAgICAgICAgICBuYW1lOiAnLi4uJyxcbiAgICAgICAgICAgICAgYWdlOiAyMFxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgfVxuXG5cbiAgTmVzdGVkIFVuaXQgZXhlY3V0aW9uIHN0ZXBzOiAgXG7igKIgXG4qL1xuXG5sZXQgc2NoZW1hID0gKCkgPT4ge1xuICAvKipcbiAgICogSW1wbGVtZW50YXRpb24gdHlwZSBhZ2dyZWdhdGVJbnRvQ29udGVudEFycmF5XG4gICAqL1xuICAvKiBleG1wbGUgcmVxdWVzdCBib2R5OiBcbntcbiAgICBcImZpZWxkTmFtZVwiOiBcImFydGljbGVcIixcbiAgICBcImZpZWxkXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJ0aXRsZVwiLFxuICAgICAgICAgICAgXCJmaWVsZFwiOiBbXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcInBhcmFncmFwaFwiLFxuICAgICAgICAgICAgXCJmaWVsZFwiOiBbXVxuICAgICAgICB9XG4gICAgXSxcbiAgICBcInNjaGVtYU1vZGVcIjogXCJub25TdHJpY3RcIiwgLy8gYWxsb3cgZW1wdHkgZGF0YXNldHMgZm9yIHNwZWNpZmllZCBmaWVsZHMgaW4gdGhlIG5lc3RlZCB1bml0IHNjaGVtYS5cbiAgICBcImV4dHJhZmllbGRcIjogdHJ1ZSAvLyBpbmNsdWRlcyBmaWVsZHMgdGhhdCBhcmUgbm90IGV4dHJhY3RlZCB1c2luZyB0aGUgc2NoZW1hLlxufSAqL1xuICBjb25zdCB7IGFkZCwgZXhlY3V0ZSwgY29uZGl0aW9uYWwsIGV4ZWN1dGlvbkxldmVsIH0gPSByZXF1aXJlKCdAZGVwZW5kZW5jeS9jb21tb25QYXR0ZXJuL3NvdXJjZS9kZWNvcmF0b3JVdGlsaXR5LmpzJylcbiAgZnVuY3Rpb24gc2NoZW1hKHsgdGhpc0FyZyB9KSB7XG4gICAgLy8gZnVuY3Rpb24gd3JhcHBlciB0byBzZXQgdGhpc0FyZyBvbiBpbXBsZW1lbnRhaW9uIG9iamVjdCBmdW5jdGlvbnMuXG5cbiAgICBsZXQgc2VsZiA9IHtcbiAgICAgIEBleGVjdXRpb25MZXZlbCgpXG4gICAgICBhc3luYyBpbml0aWFsaXplTmVzdGVkVW5pdCh7IG5lc3RlZFVuaXRLZXksIGFkZGl0aW9uYWxDaGlsZE5lc3RlZFVuaXQgPSBbXSwgcGF0aFBvaW50ZXJLZXkgPSBudWxsLCBwYXJlbnQgPSB0aGlzLCBhcmd1bWVudCA9IHt9IH0pIHtcbiAgICAgICAgLy8gRW50cnlwb2ludCBJbnN0YW5jZVxuICAgICAgICAvLyBleHRyYWN0IHJlcXVlc3QgZGF0YSBhY3Rpb24gYXJndW1lbnRzLiBhcmd1bWVudHMgZm9yIGEgcXVlcnkvbXV0YXRpb24vc3Vic2NyaXB0aW9uLlxuICAgICAgICBpZiAodGhpcy5leGVjdXRpb25MZXZlbCA9PSAndG9wTGV2ZWwnKSB7XG4gICAgICAgICAgbmVzdGVkVW5pdEluc3RhbmNlLnJlcXVlc3RPcHRpb24gPSB0aGlzLnBvcnRBcHBJbnN0YW5jZS5jb250ZXh0LnJlcXVlc3QuYm9keVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGNoaWxkL25lc3RlZFxuICAgICAgICAgIGxldCBmaWVsZEFycmF5ID0gcGFyZW50LnJlcXVlc3RPcHRpb24uZmllbGQgLy8gb2JqZWN0IGFycmF5XG4gICAgICAgICAgaWYgKChmaWVsZEFycmF5ICYmIGZpZWxkQXJyYXkubGVuZ3RoID09IDApIHx8ICFmaWVsZEFycmF5KSB7XG4gICAgICAgICAgICBuZXN0ZWRVbml0SW5zdGFuY2UucmVxdWVzdE9wdGlvbiA9IHt9IC8vIGNvbnRpbnVlIHRvIHJlc29sdmUgZGF0YXNldCBhbmQgYWxsIHN1YnNlcXVlbnQgTmVzdGVkdW5pdHMgb2YgbmVzdGVkIGRhdGFzZXQgaW4gY2FzZSBhcmUgb2JqZWN0cy5cbiAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkQXJyYXkpIHtcbiAgICAgICAgICAgIG5lc3RlZFVuaXRJbnN0YW5jZS5yZXF1ZXN0T3B0aW9uID0gZmllbGRBcnJheS5maW5kKGZpZWxkID0+IGZpZWxkLmZpZWxkTmFtZSA9PSB1bml0SW5zdGFuY2UuZmllbGROYW1lKSAvLyB3aGVyZSBmaWVsZE5hbWVzIG1hdGNoXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgZmllbGRuYW1lIGV4aXN0cyBpbiB0aGUgcmVxdWVzdCBvcHRpb24sIGlmIG5vdCBza2lwIG5lc3RlZCB1bml0LlxuICAgICAgICBpZiAoIW5lc3RlZFVuaXRJbnN0YW5jZS5yZXF1ZXN0T3B0aW9uKSByZXR1cm4gLy8gZmllbGROYW1lIHdhcyBub3Qgc3BlY2lmaWVkIGluIHRoZSBwYXJlbnQgbmVzdGVkVW5pdCwgdGhlcmVmb3JlIHNraXAgaXRzIGV4ZWN1dGlvblxuICAgICAgICBuZXN0ZWRVbml0SW5zdGFuY2UuZGF0YXNldCA9IGF3YWl0IHVuaXRJbnN0YW5jZS5yZXNvbHZlRGF0YXNldCh7IHBhcmVudFJlc3VsdDogYXJndW1lbnQuZGF0YXNldCB8fCBwYXJlbnQuZGF0YXNldCB9KVxuICAgICAgICAvLyBUT0RPOiBGaXggcmVxdWVzdE9wdGlvbiAtIGkuZS4gYWJvdmUgaXQgaXMgdXNlZCB0byBwYXNzIFwiZmllbGRcIiBvcHRpb24gb25seS5cbiAgICAgICAgaWYgKHRoaXMucG9ydEFwcEluc3RhbmNlLmNvbnRleHQucmVxdWVzdC5ib2R5LnNjaGVtYU1vZGUgPT0gJ25vblN0cmljdCcpIHtcbiAgICAgICAgICAvLyBEb24ndCBlbmZvcmNlIHN0cmljdCBzY2hlbWEsIGkuZS4gYWxsIG5lc3RlZCBjaGlsZHJlbiBzaG91bGQgZXhpc3QuXG4gICAgICAgICAgLy8gaWYobmVzdGVkVW5pdEluc3RhbmNlLmRhdGFzZXQpIG5lc3RlZFVuaXRJbnN0YW5jZS5kYXRhc2V0ID0gbnVsbCAvLyBUT0RPOiB0aHJvd3MgZXJyb3IgYXMgbmV4dCBpdCBpcyBiZWluZyB1c2VkLlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFzc2VydC5ub3RFcXVhbChuZXN0ZWRVbml0SW5zdGFuY2UuZGF0YXNldCwgdW5kZWZpbmVkLCBg4oCiIHJldHVybmVkIGRhdGFzZXQgY2Fubm90IGJlIHVuZGVmaW5lZCBmb3IgZmllbGROYW1lOiAke3VuaXRJbnN0YW5jZS5maWVsZE5hbWV9LmApXG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVjayB0eXBlIG9mIGRhdGFzZXRcbiAgICAgICAgbGV0IGRhdGFzZXRIYW5kbGluZ1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShuZXN0ZWRVbml0SW5zdGFuY2UuZGF0YXNldCkgJiYgbmVzdGVkVW5pdEluc3RhbmNlLmNoaWxkcmVuICYmIG5lc3RlZFVuaXRJbnN0YW5jZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgLy8gYXJyYXlcbiAgICAgICAgICBkYXRhc2V0SGFuZGxpbmcgPSAnc2VxdWVuY2UnXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG5lc3RlZFVuaXRJbnN0YW5jZS5kYXRhc2V0ID09ICdvYmplY3QnICYmIG5lc3RlZFVuaXRJbnN0YW5jZS5jaGlsZHJlbiAmJiBuZXN0ZWRVbml0SW5zdGFuY2UuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIC8vIG9iamVjdFxuICAgICAgICAgIGRhdGFzZXRIYW5kbGluZyA9ICduZXN0ZWQnXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gbm9uLW5lc3RlZCB2YWx1ZVxuICAgICAgICAgIGRhdGFzZXRIYW5kbGluZyA9ICdub25OZXN0ZWQnXG4gICAgICAgIH1cblxuICAgICAgICAvLyBoYW5kbGUgYXJyYXksIG9iamVjdCwgb3Igbm9uLW5lc3RlZCB2YWx1ZVxuICAgICAgICBsZXQgb2JqZWN0ID0ge30gLy8gZm9ybWF0dGVkIG9iamVjdCB3aXRoIHJlcXVlc3RlZCBmaWVsZHNcbiAgICAgICAgc3dpdGNoIChkYXRhc2V0SGFuZGxpbmcpIHtcbiAgICAgICAgICBjYXNlICdzZXF1ZW5jZSc6XG4gICAgICAgICAgICBsZXQgcHJvbWlzZUFycmF5ID0gbmVzdGVkVW5pdEluc3RhbmNlLmRhdGFzZXQubWFwKGRvY3VtZW50ID0+IHtcbiAgICAgICAgICAgICAgbGV0IGFyZ3VtZW50ID0ge31cbiAgICAgICAgICAgICAgYXJndW1lbnRbJ2RhdGFzZXQnXSA9IGRvY3VtZW50XG4gICAgICAgICAgICAgIHJldHVybiBuZXN0ZWRVbml0SW5zdGFuY2UubG9vcEluc2VydGlvblBvaW50KHsgdHlwZTogJ2FnZ3JlZ2F0ZUludG9Db250ZW50QXJyYXknLCBhcmd1bWVudCB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGxldCBzdWJzZXF1ZW50RGF0YXNldEFycmF5ID0gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZUFycmF5KVxuICAgICAgICAgICAgb2JqZWN0W3VuaXRJbnN0YW5jZS5maWVsZE5hbWVdID0gc3Vic2VxdWVudERhdGFzZXRBcnJheS5tYXAoKHN1YnNlcXVlbnREYXRhc2V0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXREYXRhc2V0T2ZOZXN0ZWRUeXBlKHtcbiAgICAgICAgICAgICAgICBzdWJzZXF1ZW50RGF0YXNldCxcbiAgICAgICAgICAgICAgICBkYXRhc2V0OiBuZXN0ZWRVbml0SW5zdGFuY2UuZGF0YXNldFtpbmRleF0sXG4gICAgICAgICAgICAgICAgb3B0aW9uOiB7XG4gICAgICAgICAgICAgICAgICBleHRyYWZpZWxkOiBuZXN0ZWRVbml0SW5zdGFuY2UucmVxdWVzdE9wdGlvbi5leHRyYWZpZWxkLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgJ25lc3RlZCc6IC8vIGlmIGZpZWxkIHRyZWF0ZWQgYXMgYW4gb2JqZWN0IHdpdGggbmVzdGVkIGZpZWxkc1xuICAgICAgICAgICAgbGV0IHN1YnNlcXVlbnREYXRhc2V0ID0gYXdhaXQgbmVzdGVkVW5pdEluc3RhbmNlLmxvb3BJbnNlcnRpb25Qb2ludCh7IHR5cGU6ICdhZ2dyZWdhdGVJbnRvQ29udGVudEFycmF5JyB9KVxuICAgICAgICAgICAgb2JqZWN0W3VuaXRJbnN0YW5jZS5maWVsZE5hbWVdID0gdGhpcy5mb3JtYXREYXRhc2V0T2ZOZXN0ZWRUeXBlKHtcbiAgICAgICAgICAgICAgc3Vic2VxdWVudERhdGFzZXQsXG4gICAgICAgICAgICAgIGRhdGFzZXQ6IG5lc3RlZFVuaXRJbnN0YW5jZS5kYXRhc2V0LFxuICAgICAgICAgICAgICBvcHRpb246IHtcbiAgICAgICAgICAgICAgICBleHRyYWZpZWxkOiBuZXN0ZWRVbml0SW5zdGFuY2UucmVxdWVzdE9wdGlvbi5leHRyYWZpZWxkLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNhc2UgJ25vbk5lc3RlZCc6XG4gICAgICAgICAgICAvLyBsb29waW5nIG92ZXIgbmVzdGVkIHVuaXRzIGNhbiBtYW5pcHVsYXRlIHRoZSBkYXRhIGluIGEgZGlmZmVyZW50IHdheSB0aGFuIHJlZ3VsYXIgYWdncmVnYXRpb24gaW50byBhbiBhcnJheS5cbiAgICAgICAgICAgIG9iamVjdFt1bml0SW5zdGFuY2UuZmllbGROYW1lXSA9IG5lc3RlZFVuaXRJbnN0YW5jZS5kYXRhc2V0XG5cbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICAvLyBkZWFsIHdpdGggcmVxdWVzdGVkIGFsbCBmaWVsZHMgd2l0aG91dCB0aGUgZmllbGQgb3B0aW9uIHdoZXJlIGV4ZWN1dGlvbiBvZiBzdWJuZXN0ZWR1bml0cyBpcyByZXF1aXJlZCB0byBtYW5pcHVsYXRlIHRoZSBkYXRhLlxuXG4gICAgICAgIHJldHVybiBvYmplY3RcbiAgICAgIH0sXG5cbiAgICAgIGZvcm1hdERhdGFzZXRPZk5lc3RlZFR5cGUoeyBzdWJzZXF1ZW50RGF0YXNldCwgZGF0YXNldCwgb3B0aW9uIH0pIHtcbiAgICAgICAgbGV0IG9iamVjdCA9IHt9XG4gICAgICAgIHN1YnNlcXVlbnREYXRhc2V0LmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgICAgIG9iamVjdCA9IE9iamVjdC5hc3NpZ24ob2JqZWN0LCBmaWVsZClcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKG9wdGlvbi5leHRyYWZpZWxkKSB7XG4gICAgICAgICAgLy8gZXh0cmFmaWVsZCBvcHRpb25cbiAgICAgICAgICBvYmplY3QgPSBPYmplY3QuYXNzaWduKGRhdGFzZXQsIG9iamVjdCkgLy8gb3ZlcnJpZGUgc3Vic2VxdWVudCBmaWVsZHMgYW5kIGtlZXAgdW50cmFja2VkIGZpZWxkcy5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqZWN0XG4gICAgICB9LFxuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKHNlbGYpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICBzZWxmW2tleV0gPSBzZWxmW2tleV0uYmluZCh0aGlzQXJnKVxuICAgIH0sIHt9KVxuICAgIHJldHVybiBzZWxmXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiByZXNvbHZlRGF0YXNldCh7XG4gICAgcGFyZW50UmVzdWx0ID0gbnVsbCxcbiAgICAvLyB0aGlzLmFyZ3MgLSBuZXN0ZWRVbml0IGFyZ3MgZmllbGQuXG4gIH0pIHtcbiAgICAvLyBbMl0gcmVxdWlyZSAmIGNoZWNrIGNvbmRpdGlvblxuICAgIGxldCBkYXRhc2V0XG4gICAgY29uc3QgYWxnb3JpdGhtID0gdGhpcy5maWxlLmFsZ29yaXRobSAvLyByZXNvbHZlciBmb3IgZGF0YXNldFxuICAgIHN3aXRjaCAoXG4gICAgICBhbGdvcml0aG0udHlwZSAvLyBpbiBvcmRlciB0byBjaG9vc2UgaG93IHRvIGhhbmRsZSB0aGUgYWxnb3JpdGhtIChhcyBhIG1vZHVsZSA/IGEgZmlsZSB0byBiZSBpbXBvcnRlZCA/Li4uKVxuICAgICkge1xuICAgICAgY2FzZSAnZmlsZSc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB7XG4gICAgICAgICAgbGV0IG1vZHVsZSA9IHJlcXVpcmUoYWxnb3JpdGhtLnBhdGgpLmRlZmF1bHRcbiAgICAgICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ2Z1bmN0aW9uJykgbW9kdWxlID0gbW9kdWxlLmRlZmF1bHQgLy8gY2FzZSBlczYgbW9kdWxlIGxvYWRlZCB3aXRoIHJlcXVpcmUgZnVuY3Rpb24gKHdpbGwgbG9hZCBpdCBhcyBhbiBvYmplY3QpXG4gICAgICAgICAgbGV0IHJlc29sdmVyID0gbW9kdWxlKCkgLyppbml0aWFsIGV4ZWN1dGUgZm9yIHNldHRpbmcgcGFyYW1ldGVyIGNvbnRleHQuKi9cbiAgICAgICAgICBsZXQgcmVzb2x2ZXJBcmd1bWVudCA9IE9iamVjdC5hc3NpZ24oLi4uW3RoaXMuYXJncywgYWxnb3JpdGhtLmFyZ3VtZW50XS5maWx0ZXIoQm9vbGVhbikpIC8vIHJlbW92ZSB1bmRlZmluZWQvbnVsbC9mYWxzZSBvYmplY3RzIGJlZm9yZSBtZXJnaW5nLlxuICAgICAgICAgIGRhdGFzZXQgPSBhd2FpdCByZXNvbHZlcih7XG4gICAgICAgICAgICBwb3J0Q2xhc3NJbnN0YW5jZTogdGhpcy5wb3J0QXBwSW5zdGFuY2UsIC8vIGNvbnRhaW5zIGFsc28gcG9ydENsYXNzSW5zdGFuY2UuY29udGV4dCBvZiB0aGUgcmVxdWVzdC5cbiAgICAgICAgICAgIGFyZ3M6IHJlc29sdmVyQXJndW1lbnQsXG4gICAgICAgICAgICBwYXJlbnRSZXN1bHQsIC8vIHBhcmVudCBkYXRhc2V0IHJlc3VsdC5cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGFzZXRcbiAgfVxufVxuIl19