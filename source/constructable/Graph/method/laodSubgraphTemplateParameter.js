"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.laodSubgraphTemplateParameter = laodSubgraphTemplateParameter;

var _GraphTraversalClass = require("../../GraphTraversal.class.js");

function extractTraversalConfigProperty(propertyObject) {
  return Object.entries(propertyObject).reduce((accumulator, [key, value]) => {
    if (_GraphTraversalClass.traversalOption.includes(key)) accumulator[key] = value;
    return accumulator;
  }, {});
}


async function laodSubgraphTemplateParameter({ node, graphInstance = this }) {
  let { configureArray } = await graphInstance.databaseWrapper.getConfigure({ concreteDatabase: graphInstance.database, nodeID: node.identity });
  const { root, extend, insertArray } = await graphInstance.databaseWrapper.getSubgraphTemplateElement({ concreteDatabase: graphInstance.database, nodeID: node.identity });


  let traversalConfiguration = {};
  for (let configure of configureArray) {
    Object.assign(traversalConfiguration, extractTraversalConfigProperty(configure.destination.properties));
  }


  let additionalChildNode = [];
  insertArray.sort((former, latter) => former.connection.properties.order - latter.connection.properties.order);
  for (let insert of insertArray) {var _insert$connection$pr, _insert$connection$pr2;
    additionalChildNode.push({
      node: insert.destination,
      placement: {

        position: (_insert$connection$pr = insert.connection.properties) === null || _insert$connection$pr === void 0 ? void 0 : _insert$connection$pr.placement[0],
        connectionKey: (_insert$connection$pr2 = insert.connection.properties) === null || _insert$connection$pr2 === void 0 ? void 0 : _insert$connection$pr2.placement[1] } });


  }


  let rootNode;
  if (root) {
    rootNode = root.destination;
  } else if (extend) {
    let recursiveCallResult = await graphInstance.laodSubgraphTemplateParameter.call(graphInstance, { node: extend.destination, graphInstance });
    additionalChildNode = [...recursiveCallResult.additionalChildNode, ...additionalChildNode];
    traversalConfiguration = Object.assign(recursiveCallResult.traversalConfiguration, traversalConfiguration);
    rootNode = recursiveCallResult.rootNode;
  } else {
    return;
  }

  return { rootNode, additionalChildNode, traversalConfiguration };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NvdXJjZS9jb25zdHJ1Y3RhYmxlL0dyYXBoL21ldGhvZC9sYW9kU3ViZ3JhcGhUZW1wbGF0ZVBhcmFtZXRlci5qcyJdLCJuYW1lcyI6WyJleHRyYWN0VHJhdmVyc2FsQ29uZmlnUHJvcGVydHkiLCJwcm9wZXJ0eU9iamVjdCIsIk9iamVjdCIsImVudHJpZXMiLCJyZWR1Y2UiLCJhY2N1bXVsYXRvciIsImtleSIsInZhbHVlIiwidHJhdmVyc2FsT3B0aW9uIiwiaW5jbHVkZXMiLCJsYW9kU3ViZ3JhcGhUZW1wbGF0ZVBhcmFtZXRlciIsIm5vZGUiLCJncmFwaEluc3RhbmNlIiwiY29uZmlndXJlQXJyYXkiLCJkYXRhYmFzZVdyYXBwZXIiLCJnZXRDb25maWd1cmUiLCJjb25jcmV0ZURhdGFiYXNlIiwiZGF0YWJhc2UiLCJub2RlSUQiLCJpZGVudGl0eSIsInJvb3QiLCJleHRlbmQiLCJpbnNlcnRBcnJheSIsImdldFN1YmdyYXBoVGVtcGxhdGVFbGVtZW50IiwidHJhdmVyc2FsQ29uZmlndXJhdGlvbiIsImNvbmZpZ3VyZSIsImFzc2lnbiIsImRlc3RpbmF0aW9uIiwicHJvcGVydGllcyIsImFkZGl0aW9uYWxDaGlsZE5vZGUiLCJzb3J0IiwiZm9ybWVyIiwibGF0dGVyIiwiY29ubmVjdGlvbiIsIm9yZGVyIiwiaW5zZXJ0IiwicHVzaCIsInBsYWNlbWVudCIsInBvc2l0aW9uIiwiY29ubmVjdGlvbktleSIsInJvb3ROb2RlIiwicmVjdXJzaXZlQ2FsbFJlc3VsdCJdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7QUFFQSxTQUFTQSw4QkFBVCxDQUF3Q0MsY0FBeEMsRUFBd0Q7QUFDdEQsU0FBT0MsTUFBTSxDQUFDQyxPQUFQLENBQWVGLGNBQWYsRUFBK0JHLE1BQS9CLENBQXNDLENBQUNDLFdBQUQsRUFBYyxDQUFDQyxHQUFELEVBQU1DLEtBQU4sQ0FBZCxLQUErQjtBQUMxRSxRQUFJQyxxQ0FBZ0JDLFFBQWhCLENBQXlCSCxHQUF6QixDQUFKLEVBQW1DRCxXQUFXLENBQUNDLEdBQUQsQ0FBWCxHQUFtQkMsS0FBbkI7QUFDbkMsV0FBT0YsV0FBUDtBQUNELEdBSE0sRUFHSixFQUhJLENBQVA7QUFJRDs7O0FBR00sZUFBZUssNkJBQWYsQ0FBNkMsRUFBRUMsSUFBRixFQUFRQyxhQUFhLEdBQUcsSUFBeEIsRUFBN0MsRUFBNkU7QUFDbEYsTUFBSSxFQUFFQyxjQUFGLEtBQXFCLE1BQU1ELGFBQWEsQ0FBQ0UsZUFBZCxDQUE4QkMsWUFBOUIsQ0FBMkMsRUFBRUMsZ0JBQWdCLEVBQUVKLGFBQWEsQ0FBQ0ssUUFBbEMsRUFBNENDLE1BQU0sRUFBRVAsSUFBSSxDQUFDUSxRQUF6RCxFQUEzQyxDQUEvQjtBQUNBLFFBQU0sRUFBRUMsSUFBRixFQUFRQyxNQUFSLEVBQWdCQyxXQUFoQixLQUFnQyxNQUFNVixhQUFhLENBQUNFLGVBQWQsQ0FBOEJTLDBCQUE5QixDQUF5RCxFQUFFUCxnQkFBZ0IsRUFBRUosYUFBYSxDQUFDSyxRQUFsQyxFQUE0Q0MsTUFBTSxFQUFFUCxJQUFJLENBQUNRLFFBQXpELEVBQXpELENBQTVDOzs7QUFHQSxNQUFJSyxzQkFBc0IsR0FBRyxFQUE3QjtBQUNBLE9BQUssSUFBSUMsU0FBVCxJQUFzQlosY0FBdEIsRUFBc0M7QUFDcENYLElBQUFBLE1BQU0sQ0FBQ3dCLE1BQVAsQ0FBY0Ysc0JBQWQsRUFBc0N4Qiw4QkFBOEIsQ0FBQ3lCLFNBQVMsQ0FBQ0UsV0FBVixDQUFzQkMsVUFBdkIsQ0FBcEU7QUFDRDs7O0FBR0QsTUFBSUMsbUJBQW1CLEdBQUcsRUFBMUI7QUFDQVAsRUFBQUEsV0FBVyxDQUFDUSxJQUFaLENBQWlCLENBQUNDLE1BQUQsRUFBU0MsTUFBVCxLQUFvQkQsTUFBTSxDQUFDRSxVQUFQLENBQWtCTCxVQUFsQixDQUE2Qk0sS0FBN0IsR0FBcUNGLE1BQU0sQ0FBQ0MsVUFBUCxDQUFrQkwsVUFBbEIsQ0FBNkJNLEtBQXZHO0FBQ0EsT0FBSyxJQUFJQyxNQUFULElBQW1CYixXQUFuQixFQUFnQztBQUM5Qk8sSUFBQUEsbUJBQW1CLENBQUNPLElBQXBCLENBQXlCO0FBQ3ZCekIsTUFBQUEsSUFBSSxFQUFFd0IsTUFBTSxDQUFDUixXQURVO0FBRXZCVSxNQUFBQSxTQUFTLEVBQUU7O0FBRVRDLFFBQUFBLFFBQVEsMkJBQUVILE1BQU0sQ0FBQ0YsVUFBUCxDQUFrQkwsVUFBcEIsMERBQUUsc0JBQThCUyxTQUE5QixDQUF3QyxDQUF4QyxDQUZEO0FBR1RFLFFBQUFBLGFBQWEsNEJBQUVKLE1BQU0sQ0FBQ0YsVUFBUCxDQUFrQkwsVUFBcEIsMkRBQUUsdUJBQThCUyxTQUE5QixDQUF3QyxDQUF4QyxDQUhOLEVBRlksRUFBekI7OztBQVFEOzs7QUFHRCxNQUFJRyxRQUFKO0FBQ0EsTUFBSXBCLElBQUosRUFBVTtBQUNSb0IsSUFBQUEsUUFBUSxHQUFHcEIsSUFBSSxDQUFDTyxXQUFoQjtBQUNELEdBRkQsTUFFTyxJQUFJTixNQUFKLEVBQVk7QUFDakIsUUFBSW9CLG1CQUFtQixHQUFHLE1BQXFCN0IsYUFBYSxDQUFDRiw2QkFBN0IsTUFBQUUsYUFBYSxFQUE4QyxFQUFFRCxJQUFJLEVBQUVVLE1BQU0sQ0FBQ00sV0FBZixFQUE0QmYsYUFBNUIsRUFBOUMsQ0FBN0M7QUFDQWlCLElBQUFBLG1CQUFtQixHQUFHLENBQUMsR0FBR1ksbUJBQW1CLENBQUNaLG1CQUF4QixFQUE2QyxHQUFHQSxtQkFBaEQsQ0FBdEI7QUFDQUwsSUFBQUEsc0JBQXNCLEdBQUd0QixNQUFNLENBQUN3QixNQUFQLENBQWNlLG1CQUFtQixDQUFDakIsc0JBQWxDLEVBQTBEQSxzQkFBMUQsQ0FBekI7QUFDQWdCLElBQUFBLFFBQVEsR0FBR0MsbUJBQW1CLENBQUNELFFBQS9CO0FBQ0QsR0FMTSxNQUtBO0FBQ0w7QUFDRDs7QUFFRCxTQUFPLEVBQUVBLFFBQUYsRUFBWVgsbUJBQVosRUFBaUNMLHNCQUFqQyxFQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCdcbmltcG9ydCB7IG5vZGVMYWJlbCwgY29ubmVjdGlvblR5cGUsIGNvbm5lY3Rpb25Qcm9wZXJ0eSB9IGZyb20gJy4uLy4uLy4uL2dyYXBoTW9kZWwvZ3JhcGhTY2hlbWVSZWZlcmVuY2UuanMnXG5pbXBvcnQgeyB0cmF2ZXJzYWxPcHRpb24gfSBmcm9tICcuLi8uLi9HcmFwaFRyYXZlcnNhbC5jbGFzcy5qcydcblxuZnVuY3Rpb24gZXh0cmFjdFRyYXZlcnNhbENvbmZpZ1Byb3BlcnR5KHByb3BlcnR5T2JqZWN0KSB7XG4gIHJldHVybiBPYmplY3QuZW50cmllcyhwcm9wZXJ0eU9iamVjdCkucmVkdWNlKChhY2N1bXVsYXRvciwgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgaWYgKHRyYXZlcnNhbE9wdGlvbi5pbmNsdWRlcyhrZXkpKSBhY2N1bXVsYXRvcltrZXldID0gdmFsdWVcbiAgICByZXR1cm4gYWNjdW11bGF0b3JcbiAgfSwge30pXG59XG5cbi8vIGxvYWQgYHN1YmdyYXBoIHRlbXBsYXRlYCBub2RlIHBhcmFtZXRlcnMgZm9yIHRyYXZlcnNhbCBjYWxsIHVzYWdlLlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxhb2RTdWJncmFwaFRlbXBsYXRlUGFyYW1ldGVyKHsgbm9kZSwgZ3JhcGhJbnN0YW5jZSA9IHRoaXMgfSkge1xuICBsZXQgeyBjb25maWd1cmVBcnJheSB9ID0gYXdhaXQgZ3JhcGhJbnN0YW5jZS5kYXRhYmFzZVdyYXBwZXIuZ2V0Q29uZmlndXJlKHsgY29uY3JldGVEYXRhYmFzZTogZ3JhcGhJbnN0YW5jZS5kYXRhYmFzZSwgbm9kZUlEOiBub2RlLmlkZW50aXR5IH0pXG4gIGNvbnN0IHsgcm9vdCwgZXh0ZW5kLCBpbnNlcnRBcnJheSB9ID0gYXdhaXQgZ3JhcGhJbnN0YW5jZS5kYXRhYmFzZVdyYXBwZXIuZ2V0U3ViZ3JhcGhUZW1wbGF0ZUVsZW1lbnQoeyBjb25jcmV0ZURhdGFiYXNlOiBncmFwaEluc3RhbmNlLmRhdGFiYXNlLCBub2RlSUQ6IG5vZGUuaWRlbnRpdHkgfSlcblxuICAvLyBnZXQgdHJhdmVyc2FsIGNvbmZpZ3VyYXRpb24gbm9kZVxuICBsZXQgdHJhdmVyc2FsQ29uZmlndXJhdGlvbiA9IHt9XG4gIGZvciAobGV0IGNvbmZpZ3VyZSBvZiBjb25maWd1cmVBcnJheSkge1xuICAgIE9iamVjdC5hc3NpZ24odHJhdmVyc2FsQ29uZmlndXJhdGlvbiwgZXh0cmFjdFRyYXZlcnNhbENvbmZpZ1Byb3BlcnR5KGNvbmZpZ3VyZS5kZXN0aW5hdGlvbi5wcm9wZXJ0aWVzKSlcbiAgfVxuXG4gIC8vIGdldCBhZGRpdGlvbmFsIG5vZGVzXG4gIGxldCBhZGRpdGlvbmFsQ2hpbGROb2RlID0gW10gLy8gYWRkaXRpb25hbCBub2Rlc1xuICBpbnNlcnRBcnJheS5zb3J0KChmb3JtZXIsIGxhdHRlcikgPT4gZm9ybWVyLmNvbm5lY3Rpb24ucHJvcGVydGllcy5vcmRlciAtIGxhdHRlci5jb25uZWN0aW9uLnByb3BlcnRpZXMub3JkZXIpIC8vIHVzaW5nIGBvcmRlcmAgcHJvcGVydHkgLy8gQnVsayBhY3Rpb25zIG9uIGZvcmtzIC0gc29ydCBmb3Jrc1xuICBmb3IgKGxldCBpbnNlcnQgb2YgaW5zZXJ0QXJyYXkpIHtcbiAgICBhZGRpdGlvbmFsQ2hpbGROb2RlLnB1c2goe1xuICAgICAgbm9kZTogaW5zZXJ0LmRlc3RpbmF0aW9uLFxuICAgICAgcGxhY2VtZW50OiB7XG4gICAgICAgIC8vIGNvbnZlbnRpb24gZm9yIGRhdGEgc3RydWN0dXJlIG9mIHBsYWNlbWVudCBhcnJheSAtIDA6ICdiZWZvcmUnIHwgJ2FmdGVyJywgMTogY29ubmVjdGlvbktleVxuICAgICAgICBwb3NpdGlvbjogaW5zZXJ0LmNvbm5lY3Rpb24ucHJvcGVydGllcz8ucGxhY2VtZW50WzBdLFxuICAgICAgICBjb25uZWN0aW9uS2V5OiBpbnNlcnQuY29ubmVjdGlvbi5wcm9wZXJ0aWVzPy5wbGFjZW1lbnRbMV0sXG4gICAgICB9LFxuICAgIH0pXG4gIH1cblxuICAvLyBnZXQgcm9vdE5vZGUgYW5kIGhhbmRsZSBleHRlbmRlZCBub2RlLlxuICBsZXQgcm9vdE5vZGVcbiAgaWYgKHJvb3QpIHtcbiAgICByb290Tm9kZSA9IHJvb3QuZGVzdGluYXRpb25cbiAgfSBlbHNlIGlmIChleHRlbmQpIHtcbiAgICBsZXQgcmVjdXJzaXZlQ2FsbFJlc3VsdCA9IGF3YWl0IGdyYXBoSW5zdGFuY2U6OmdyYXBoSW5zdGFuY2UubGFvZFN1YmdyYXBoVGVtcGxhdGVQYXJhbWV0ZXIoeyBub2RlOiBleHRlbmQuZGVzdGluYXRpb24sIGdyYXBoSW5zdGFuY2UgfSlcbiAgICBhZGRpdGlvbmFsQ2hpbGROb2RlID0gWy4uLnJlY3Vyc2l2ZUNhbGxSZXN1bHQuYWRkaXRpb25hbENoaWxkTm9kZSwgLi4uYWRkaXRpb25hbENoaWxkTm9kZV1cbiAgICB0cmF2ZXJzYWxDb25maWd1cmF0aW9uID0gT2JqZWN0LmFzc2lnbihyZWN1cnNpdmVDYWxsUmVzdWx0LnRyYXZlcnNhbENvbmZpZ3VyYXRpb24sIHRyYXZlcnNhbENvbmZpZ3VyYXRpb24pXG4gICAgcm9vdE5vZGUgPSByZWN1cnNpdmVDYWxsUmVzdWx0LnJvb3ROb2RlXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIC8vIGluIGNhc2Ugbm8gYFJPT1RgIHJlbGF0aW9uIG9yIGBFWFRFTkRgIGFyZSBwcmVzZW50XG4gIH1cblxuICByZXR1cm4geyByb290Tm9kZSwgYWRkaXRpb25hbENoaWxkTm9kZSwgdHJhdmVyc2FsQ29uZmlndXJhdGlvbiB9IC8vIHJvb3ROb2RlIHdpbGwgYmUgdXNlZCBhcyBlbnRyeXBvaW50IHRvIHRyYXZlcnNhbCBjYWxsXG59XG4iXX0=