"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.dataProcess = dataProcess;

async function dataProcess({ node, nextProcessData, aggregator, evaluation, implementation, graphInstance }) {
  if (!evaluation.shouldExecuteProcess()) return null;
  const { resource, execute } = await graphInstance.databaseWrapper.getProcessElement({ concreteDatabase: graphInstance.database, nodeID: node.identity });
  if (!execute) return null;

  if (execute.connection.properties.processDataImplementation)
  implementation =
  graphInstance.traversal.processData[execute.connection.properties.processDataImplementation] || function (e) {throw e;}(
  new Error(`• "${execute.connection.properties.processDataImplementation}" implementation isn't registered in traversal concrete instance.`));


  let result = await implementation.call(node, { node: execute.destination, resource, graphInstance });

  if (evaluation.shouldIncludeResult()) aggregator.add(result);
  return result;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NvdXJjZS9jb25zdHJ1Y3RhYmxlL0dyYXBoL21ldGhvZC9kYXRhUHJvY2Vzcy5qcyJdLCJuYW1lcyI6WyJkYXRhUHJvY2VzcyIsIm5vZGUiLCJuZXh0UHJvY2Vzc0RhdGEiLCJhZ2dyZWdhdG9yIiwiZXZhbHVhdGlvbiIsImltcGxlbWVudGF0aW9uIiwiZ3JhcGhJbnN0YW5jZSIsInNob3VsZEV4ZWN1dGVQcm9jZXNzIiwicmVzb3VyY2UiLCJleGVjdXRlIiwiZGF0YWJhc2VXcmFwcGVyIiwiZ2V0UHJvY2Vzc0VsZW1lbnQiLCJjb25jcmV0ZURhdGFiYXNlIiwiZGF0YWJhc2UiLCJub2RlSUQiLCJpZGVudGl0eSIsImNvbm5lY3Rpb24iLCJwcm9wZXJ0aWVzIiwicHJvY2Vzc0RhdGFJbXBsZW1lbnRhdGlvbiIsInRyYXZlcnNhbCIsInByb2Nlc3NEYXRhIiwiRXJyb3IiLCJyZXN1bHQiLCJkZXN0aW5hdGlvbiIsInNob3VsZEluY2x1ZGVSZXN1bHQiLCJhZGQiXSwibWFwcGluZ3MiOiI7O0FBRU8sZUFBZUEsV0FBZixDQUEyQixFQUFFQyxJQUFGLEVBQVFDLGVBQVIsRUFBeUJDLFVBQXpCLEVBQXFDQyxVQUFyQyxFQUFpREMsY0FBakQsRUFBaUVDLGFBQWpFLEVBQTNCLEVBQTZHO0FBQ2xILE1BQUksQ0FBQ0YsVUFBVSxDQUFDRyxvQkFBWCxFQUFMLEVBQXdDLE9BQU8sSUFBUDtBQUN4QyxRQUFNLEVBQUVDLFFBQUYsRUFBWUMsT0FBWixLQUF3QixNQUFNSCxhQUFhLENBQUNJLGVBQWQsQ0FBOEJDLGlCQUE5QixDQUFnRCxFQUFFQyxnQkFBZ0IsRUFBRU4sYUFBYSxDQUFDTyxRQUFsQyxFQUE0Q0MsTUFBTSxFQUFFYixJQUFJLENBQUNjLFFBQXpELEVBQWhELENBQXBDO0FBQ0EsTUFBSSxDQUFDTixPQUFMLEVBQWMsT0FBTyxJQUFQOztBQUVkLE1BQUlBLE9BQU8sQ0FBQ08sVUFBUixDQUFtQkMsVUFBbkIsQ0FBOEJDLHlCQUFsQztBQUNFYixFQUFBQSxjQUFjO0FBQ1pDLEVBQUFBLGFBQWEsQ0FBQ2EsU0FBZCxDQUF3QkMsV0FBeEIsQ0FBb0NYLE9BQU8sQ0FBQ08sVUFBUixDQUFtQkMsVUFBbkIsQ0FBOEJDLHlCQUFsRTtBQUNNLE1BQUlHLEtBQUosQ0FBVyxNQUFLWixPQUFPLENBQUNPLFVBQVIsQ0FBbUJDLFVBQW5CLENBQThCQyx5QkFBMEIsbUVBQXhFLENBRE4sQ0FERjs7O0FBS0YsTUFBSUksTUFBTSxHQUFHLE1BQVlqQixjQUFOLE1BQUFKLElBQUksRUFBaUIsRUFBRUEsSUFBSSxFQUFFUSxPQUFPLENBQUNjLFdBQWhCLEVBQTZCZixRQUE3QixFQUF1Q0YsYUFBdkMsRUFBakIsQ0FBdkI7O0FBRUEsTUFBSUYsVUFBVSxDQUFDb0IsbUJBQVgsRUFBSixFQUFzQ3JCLFVBQVUsQ0FBQ3NCLEdBQVgsQ0FBZUgsTUFBZjtBQUN0QyxTQUFPQSxNQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCdcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRhdGFQcm9jZXNzKHsgbm9kZSwgbmV4dFByb2Nlc3NEYXRhLCBhZ2dyZWdhdG9yLCBldmFsdWF0aW9uLCBpbXBsZW1lbnRhdGlvbiwgZ3JhcGhJbnN0YW5jZSB9KSB7XG4gIGlmICghZXZhbHVhdGlvbi5zaG91bGRFeGVjdXRlUHJvY2VzcygpKSByZXR1cm4gbnVsbFxuICBjb25zdCB7IHJlc291cmNlLCBleGVjdXRlIH0gPSBhd2FpdCBncmFwaEluc3RhbmNlLmRhdGFiYXNlV3JhcHBlci5nZXRQcm9jZXNzRWxlbWVudCh7IGNvbmNyZXRlRGF0YWJhc2U6IGdyYXBoSW5zdGFuY2UuZGF0YWJhc2UsIG5vZGVJRDogbm9kZS5pZGVudGl0eSB9KVxuICBpZiAoIWV4ZWN1dGUpIHJldHVybiBudWxsIC8vIHNraXAgaWYgbm8gZXhlY3V0ZSBjb25uZWN0aW9uXG5cbiAgaWYgKGV4ZWN1dGUuY29ubmVjdGlvbi5wcm9wZXJ0aWVzLnByb2Nlc3NEYXRhSW1wbGVtZW50YXRpb24pXG4gICAgaW1wbGVtZW50YXRpb24gPVxuICAgICAgZ3JhcGhJbnN0YW5jZS50cmF2ZXJzYWwucHJvY2Vzc0RhdGFbZXhlY3V0ZS5jb25uZWN0aW9uLnByb3BlcnRpZXMucHJvY2Vzc0RhdGFJbXBsZW1lbnRhdGlvbl0gfHxcbiAgICAgIHRocm93IG5ldyBFcnJvcihg4oCiIFwiJHtleGVjdXRlLmNvbm5lY3Rpb24ucHJvcGVydGllcy5wcm9jZXNzRGF0YUltcGxlbWVudGF0aW9ufVwiIGltcGxlbWVudGF0aW9uIGlzbid0IHJlZ2lzdGVyZWQgaW4gdHJhdmVyc2FsIGNvbmNyZXRlIGluc3RhbmNlLmApXG5cbiAgLy8gRXhlY3V0ZSBub2RlIGRhdGFJdGVtXG4gIGxldCByZXN1bHQgPSBhd2FpdCBub2RlOjppbXBsZW1lbnRhdGlvbih7IG5vZGU6IGV4ZWN1dGUuZGVzdGluYXRpb24sIHJlc291cmNlLCBncmFwaEluc3RhbmNlIH0pXG5cbiAgaWYgKGV2YWx1YXRpb24uc2hvdWxkSW5jbHVkZVJlc3VsdCgpKSBhZ2dyZWdhdG9yLmFkZChyZXN1bHQpXG4gIHJldHVybiByZXN1bHRcbn1cbiJdfQ==