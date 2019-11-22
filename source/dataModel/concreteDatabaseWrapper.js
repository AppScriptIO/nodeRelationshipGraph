"use strict";var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.isSelfEdge = isSelfEdge;exports.getResource = getResource;exports.getValue = getValue;exports.getExecution = getExecution;exports.getFork = getFork;exports.getNext = getNext;exports.getConfigure = getConfigure;exports.getCase = getCase;exports.getDefault = getDefault;exports.getReference = getReference;exports.getExtend = getExtend;exports.getInsert = getInsert;exports.getRerouteTraverseReferenceElement = getRerouteTraverseReferenceElement;exports.getReferenceResolutionElement = getReferenceResolutionElement;exports.getSwitchElement = getSwitchElement;exports.getValueElement = getValueElement;

var _assert = _interopRequireDefault(require("assert"));
var schemeReference = _interopRequireWildcard(require("../dataModel/graphSchemeReference.js"));

function isSelfEdge(edge) {
  return edge.source.identity == edge.destination.identity;
}

async function getResource({ concreteDatabase, nodeID }) {
  let resourceArray = await concreteDatabase.getNodeConnection({ direction: 'incoming', nodeID, connectionType: schemeReference.connectionType.resource });
  (0, _assert.default)(
  resourceArray.every(n => schemeReference.connectionProperty.context.includes(n.connection.properties.context)),
  `• Unsupported property value for a RESOURCE connection.`);

  return { resourceArray };
}

async function getValue({ concreteDatabase, nodeID }) {
  let valueArray = await concreteDatabase.getNodeConnection({ direction: 'incoming', nodeID, connectionType: schemeReference.connectionType.value });
  (0, _assert.default)(
  valueArray.every(n => schemeReference.connectionProperty.type.includes(n.connection.properties.type)),
  `• Unsupported "type" property value for a VALUE connection.`);

  return { valueArray: valueArray };
}

async function getExecution({ concreteDatabase, nodeID }) {
  let executeArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID, connectionType: schemeReference.connectionType.execute });
  (0, _assert.default)(
  executeArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.process)),
  `• Unsupported node type for a EXECUTE connection.`);

  return { executeArray };
}

async function getFork({ concreteDatabase, nodeID }) {
  let forkArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID: nodeID, connectionType: schemeReference.connectionType.fork });
  (0, _assert.default)(
  forkArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.port)),
  `• Unsupported property value for a FORK connection.`);

  return { forkArray };
}

async function getNext({ concreteDatabase, nodeID }) {
  let nextArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID: nodeID, connectionType: schemeReference.connectionType.next });
  (0, _assert.default)(
  nextArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.stage) || n.destination.labels.includes(schemeReference.nodeLabel.reroute)),
  `• Unsupported property value for a NEXT connection.`);

  return { nextArray };
}

async function getConfigure({ concreteDatabase, nodeID }) {
  let configureArray = await concreteDatabase.getNodeConnection({ direction: 'incoming', nodeID: nodeID, connectionType: schemeReference.connectionType.configure });
  (0, _assert.default)(
  configureArray.every(n => n.source.labels.includes(schemeReference.nodeLabel.configuration) || n.source.labels.includes(schemeReference.nodeLabel.reroute)),
  `• Unsupported node type for a CONFIGURE connection.`);

  (0, _assert.default)(
  configureArray.every(n => n.connection.properties.setting),
  `• Missing "setting" property on a CONFIGURE connection.`);


  return { configureArray };
}

async function getCase({ concreteDatabase, nodeID }) {
  let caseArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID, connectionType: schemeReference.connectionType.case });

  return { caseArray };
}

async function getDefault({ concreteDatabase, nodeID }) {
  let defaultArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID, connectionType: schemeReference.connectionType.default });

  return { defaultArray };
}

async function getReference({ concreteDatabase, nodeID }) {
  let referenceArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID: nodeID, connectionType: schemeReference.connectionType.reference });
  (0, _assert.default)(
  referenceArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.stage) || n.destination.labels.includes(schemeReference.nodeLabel.reroute)),
  `• Unsupported node type for a ${schemeReference.connectionType.reference} connection.`);

  return { referenceArray };
}

async function getExtend({ concreteDatabase, nodeID }) {
  let extendArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID: nodeID, connectionType: schemeReference.connectionType.extend });
  (0, _assert.default)(
  extendArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.reroute)),
  `• Unsupported node type for a EXTEND connection.`);

  return { extendArray };
}

async function getInsert({ concreteDatabase, nodeID }) {
  let insertArray = await concreteDatabase.getNodeConnection({ direction: 'incoming', nodeID: nodeID, connectionType: schemeReference.connectionType.insert });
  (0, _assert.default)(
  insertArray.every(n => n.source.labels.includes(schemeReference.nodeLabel.stage)),
  `• Unsupported node type for a INSERT connection.`);

  return { insertArray };
}










async function getRerouteTraverseReferenceElement({ concreteDatabase, nodeID }) {
  const { extendArray } = await getExtend({ concreteDatabase, nodeID });
  const { insertArray } = await getInsert({ concreteDatabase, nodeID });

  if (extendArray.length > 1) throw new Error(`• Multiple extend relationships are not supported for Reroute node.`);

  return { extend: extendArray.length > 0 ? extendArray[0] : null, insertArray };
}

async function getReferenceResolutionElement({ concreteDatabase, nodeID }) {
  const { referenceArray } = await getReference({ concreteDatabase, nodeID });

  if (referenceArray.length > 1) throw new Error(`• Multiple reference relationships are not supported for Reroute node.`);

  return { reference: referenceArray.length > 0 ? referenceArray[0] : null };
}

async function getSwitchElement({ concreteDatabase, nodeID }) {
  const { caseArray } = await getCase({ concreteDatabase, nodeID });
  const { defaultArray } = await getDefault({ concreteDatabase, nodeID });

  if (defaultArray.length > 1) throw new Error(`• Multiple default relationships are not supported for Switch node.`);

  return { caseArray: caseArray.length > 0 ? caseArray : null, default: defaultArray.length > 0 ? defaultArray[0] : null };
}


async function getValueElement({ concreteDatabase, nodeID }) {

  let value;
  const { valueArray } = await getValue({ concreteDatabase, nodeID });
  if (valueArray.length > 1) throw new Error(`• Multiple VALUE relationships are not supported for Process node.`);else
  if (valueArray.length != 0 && valueArray[0]) return valueArray[0];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9kYXRhTW9kZWwvY29uY3JldGVEYXRhYmFzZVdyYXBwZXIuanMiXSwibmFtZXMiOlsiaXNTZWxmRWRnZSIsImVkZ2UiLCJzb3VyY2UiLCJpZGVudGl0eSIsImRlc3RpbmF0aW9uIiwiZ2V0UmVzb3VyY2UiLCJjb25jcmV0ZURhdGFiYXNlIiwibm9kZUlEIiwicmVzb3VyY2VBcnJheSIsImdldE5vZGVDb25uZWN0aW9uIiwiZGlyZWN0aW9uIiwiY29ubmVjdGlvblR5cGUiLCJzY2hlbWVSZWZlcmVuY2UiLCJyZXNvdXJjZSIsImV2ZXJ5IiwibiIsImNvbm5lY3Rpb25Qcm9wZXJ0eSIsImNvbnRleHQiLCJpbmNsdWRlcyIsImNvbm5lY3Rpb24iLCJwcm9wZXJ0aWVzIiwiZ2V0VmFsdWUiLCJ2YWx1ZUFycmF5IiwidmFsdWUiLCJ0eXBlIiwiZ2V0RXhlY3V0aW9uIiwiZXhlY3V0ZUFycmF5IiwiZXhlY3V0ZSIsImxhYmVscyIsIm5vZGVMYWJlbCIsInByb2Nlc3MiLCJnZXRGb3JrIiwiZm9ya0FycmF5IiwiZm9yayIsInBvcnQiLCJnZXROZXh0IiwibmV4dEFycmF5IiwibmV4dCIsInN0YWdlIiwicmVyb3V0ZSIsImdldENvbmZpZ3VyZSIsImNvbmZpZ3VyZUFycmF5IiwiY29uZmlndXJlIiwiY29uZmlndXJhdGlvbiIsInNldHRpbmciLCJnZXRDYXNlIiwiY2FzZUFycmF5IiwiY2FzZSIsImdldERlZmF1bHQiLCJkZWZhdWx0QXJyYXkiLCJkZWZhdWx0IiwiZ2V0UmVmZXJlbmNlIiwicmVmZXJlbmNlQXJyYXkiLCJyZWZlcmVuY2UiLCJnZXRFeHRlbmQiLCJleHRlbmRBcnJheSIsImV4dGVuZCIsImdldEluc2VydCIsImluc2VydEFycmF5IiwiaW5zZXJ0IiwiZ2V0UmVyb3V0ZVRyYXZlcnNlUmVmZXJlbmNlRWxlbWVudCIsImxlbmd0aCIsIkVycm9yIiwiZ2V0UmVmZXJlbmNlUmVzb2x1dGlvbkVsZW1lbnQiLCJnZXRTd2l0Y2hF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QUFPQSxVQUFVLENBQUMsQ0FBRCxDQUFqQjtBQUNuRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBVc2UgY29uY3JldGUgRGF0YWJhc2UgY2xhc3MgaW5zdGFuY2VzIHRvIHJldHJpZXZlIG5vZGVzIGFuZCB2ZXJpZnkgdGhlIHJlc3VsdHMgd2l0aCBhIHNjaGVtYSAtIHdyYXAgdGhlIGNvbmNyZXRlIGRhdGFiYXNlIHdpdGggbW9yZSBzcGVjaWZpYyBxdWVyeSBmdW5jdGlvbnMgKi9cblxuaW1wb3J0IGFzc2VydCBmcm9tICdhc3NlcnQnXG5pbXBvcnQgKiBhcyBzY2hlbWVSZWZlcmVuY2UgZnJvbSAnLi4vZGF0YU1vZGVsL2dyYXBoU2NoZW1lUmVmZXJlbmNlLmpzJ1xuXG5leHBvcnQgZnVuY3Rpb24gaXNTZWxmRWRnZShlZGdlKSB7XG4gIHJldHVybiBlZGdlLnNvdXJjZS5pZGVudGl0eSA9PSBlZGdlLmRlc3RpbmF0aW9uLmlkZW50aXR5XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRSZXNvdXJjZSh7IGNvbmNyZXRlRGF0YWJhc2UsIG5vZGVJRCB9KSB7XG4gIGxldCByZXNvdXJjZUFycmF5ID0gYXdhaXQgY29uY3JldGVEYXRhYmFzZS5nZXROb2RlQ29ubmVjdGlvbih7IGRpcmVjdGlvbjogJ2luY29taW5nJywgbm9kZUlELCBjb25uZWN0aW9uVHlwZTogc2NoZW1lUmVmZXJlbmNlLmNvbm5lY3Rpb25UeXBlLnJlc291cmNlIH0pXG4gIGFzc2VydChcbiAgICByZXNvdXJjZUFycmF5LmV2ZXJ5KG4gPT4gc2NoZW1lUmVmZXJlbmNlLmNvbm5lY3Rpb25Qcm9wZXJ0eS5jb250ZXh0LmluY2x1ZGVzKG4uY29ubmVjdGlvbi5wcm9wZXJ0aWVzLmNvbnRleHQpKSxcbiAgICBg4oCiIFVuc3VwcG9ydGVkIHByb3BlcnR5IHZhbHVlIGZvciBhIFJFU09VUkNFIGNvbm5lY3Rpb24uYCxcbiAgKSAvLyB2ZXJpZnkgbm9kZSB0eXBlXG4gIHJldHVybiB7IHJlc291cmNlQXJyYXkgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VmFsdWUoeyBjb25jcmV0ZURhdGFiYXNlLCBub2RlSUQgfSkge1xuICBsZXQgdmFsdWVBcnJheSA9IGF3YWl0IGNvbmNyZXRlRGF0YWJhc2UuZ2V0Tm9kZUNvbm5lY3Rpb24oeyBkaXJlY3Rpb246ICdpbmNvbWluZycsIG5vZGVJRCwgY29ubmVjdGlvblR5cGU6IHNjaGVtZVJlZmVyZW5jZS5jb25uZWN0aW9uVHlwZS52YWx1ZSB9KVxuICBhc3NlcnQoXG4gICAgdmFsdWVBcnJheS5ldmVyeShuID0+IHNjaGVtZVJlZmVyZW5jZS5jb25uZWN0aW9uUHJvcGVydHkudHlwZS5pbmNsdWRlcyhuLmNvbm5lY3Rpb24ucHJvcGVydGllcy50eXBlKSksXG4gICAgYOKAoiBVbnN1cHBvcnRlZCBcInR5cGVcIiBwcm9wZXJ0eSB2YWx1ZSBmb3IgYSBWQUxVRSBjb25uZWN0aW9uLmAsXG4gICkgLy8gdmVyaWZ5IG5vZGUgdHlwZVxuICByZXR1cm4geyB2YWx1ZUFycmF5OiB2YWx1ZUFycmF5IH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEV4ZWN1dGlvbih7IGNvbmNyZXRlRGF0YWJhc2UsIG5vZGVJRCB9KSB7XG4gIGxldCBleGVjdXRlQXJyYXkgPSBhd2FpdCBjb25jcmV0ZURhdGFiYXNlLmdldE5vZGVDb25uZWN0aW9uKHsgZGlyZWN0aW9uOiAnb3V0Z29pbmcnLCBub2RlSUQsIGNvbm5lY3Rpb25UeXBlOiBzY2hlbWVSZWZlcmVuY2UuY29ubmVjdGlvblR5cGUuZXhlY3V0ZSB9KVxuICBhc3NlcnQoXG4gICAgZXhlY3V0ZUFycmF5LmV2ZXJ5KG4gPT4gbi5kZXN0aW5hdGlvbi5sYWJlbHMuaW5jbHVkZXMoc2NoZW1lUmVmZXJlbmNlLm5vZGVMYWJlbC5wcm9jZXNzKSksXG4gICAgYOKAoiBVbnN1cHBvcnRlZCBub2RlIHR5cGUgZm9yIGEgRVhFQ1VURSBjb25uZWN0aW9uLmAsXG4gICkgLy8gdmVyaWZ5IG5vZGUgdHlwZVxuICByZXR1cm4geyBleGVjdXRlQXJyYXkgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Rm9yayh7IGNvbmNyZXRlRGF0YWJhc2UsIG5vZGVJRCB9KSB7XG4gIGxldCBmb3JrQXJyYXkgPSBhd2FpdCBjb25jcmV0ZURhdGFiYXNlLmdldE5vZGVDb25uZWN0aW9uKHsgZGlyZWN0aW9uOiAnb3V0Z29pbmcnLCBub2RlSUQ6IG5vZGVJRCwgY29ubmVjdGlvblR5cGU6IHNjaGVtZVJlZmVyZW5jZS5jb25uZWN0aW9uVHlwZS5mb3JrIH0pXG4gIGFzc2VydChcbiAgICBmb3JrQXJyYXkuZXZlcnkobiA9PiBuLmRlc3RpbmF0aW9uLmxhYmVscy5pbmNsdWRlcyhzY2hlbWVSZWZlcmVuY2Uubm9kZUxhYmVsLnBvcnQpKSxcbiAgICBg4oCiIFVuc3VwcG9ydGVkIHByb3BlcnR5IHZhbHVlIGZvciBhIEZPUksgY29ubmVjdGlvbi5gLFxuICApIC8vIHZlcmlmeSBub2RlIHR5cGVcbiAgcmV0dXJuIHsgZm9ya0FycmF5IH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldE5leHQoeyBjb25jcmV0ZURhdGFiYXNlLCBub2RlSUQgfSkge1xuICBsZXQgbmV4dEFycmF5ID0gYXdhaXQgY29uY3JldGVEYXRhYmFzZS5nZXROb2RlQ29ubmVjdGlvbih7IGRpcmVjdGlvbjogJ291dGdvaW5nJywgbm9kZUlEOiBub2RlSUQsIGNvbm5lY3Rpb25UeXBlOiBzY2hlbWVSZWZlcmVuY2UuY29ubmVjdGlvblR5cGUubmV4dCB9KVxuICBhc3NlcnQoXG4gICAgbmV4dEFycmF5LmV2ZXJ5KG4gPT4gbi5kZXN0aW5hdGlvbi5sYWJlbHMuaW5jbHVkZXMoc2NoZW1lUmVmZXJlbmNlLm5vZGVMYWJlbC5zdGFnZSkgfHwgbi5kZXN0aW5hdGlvbi5sYWJlbHMuaW5jbHVkZXMoc2NoZW1lUmVmZXJlbmNlLm5vZGVMYWJlbC5yZXJvdXRlKSksXG4gICAgYOKAoiBVbnN1cHBvcnRlZCBwcm9wZXJ0eSB2YWx1ZSBmb3IgYSBORVhUIGNvbm5lY3Rpb24uYCxcbiAgKSAvLyB2ZXJpZnkgbm9kZSB0eXBlXG4gIHJldHVybiB7IG5leHRBcnJheSB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDb25maWd1cmUoeyBjb25jcmV0ZURhdGFiYXNlLCBub2RlSUQgfSkge1xuICBsZXQgY29uZmlndXJlQXJyYXkgPSBhd2FpdCBjb25jcmV0ZURhdGFiYXNlLmdldE5vZGVDb25uZWN0aW9uKHsgZGlyZWN0aW9uOiAnaW5jb21pbmcnLCBub2RlSUQ6IG5vZGVJRCwgY29ubmVjdGlvblR5cGU6IHNjaGVtZVJlZmVyZW5jZS5jb25uZWN0aW9uVHlwZS5jb25maWd1cmUgfSlcbiAgYXNzZXJ0KFxuICAgIGNvbmZpZ3VyZUFycmF5LmV2ZXJ5KG4gPT4gbi5zb3VyY2UubGFiZWxzLmluY2x1ZGVzKHNjaGVtZVJlZmVyZW5jZS5ub2RlTGFiZWwuY29uZmlndXJhdGlvbikgfHwgbi5zb3VyY2UubGFiZWxzLmluY2x1ZGVzKHNjaGVtZVJlZmVyZW5jZS5ub2RlTGFiZWwucmVyb3V0ZSkpLFxuICAgIGDigKIgVW5zdXBwb3J0ZWQgbm9kZSB0eXBlIGZvciBhIENPTkZJR1VSRSBjb25uZWN0aW9uLmAsXG4gICkgLy8gdmVyaWZ5IG5vZGUgdHlwZVxuICBhc3NlcnQoXG4gICAgY29uZmlndXJlQXJyYXkuZXZlcnkobiA9PiBuLmNvbm5lY3Rpb24ucHJvcGVydGllcy5zZXR0aW5nKSxcbiAgICBg4oCiIE1pc3NpbmcgXCJzZXR0aW5nXCIgcHJvcGVydHkgb24gYSBDT05GSUdVUkUgY29ubmVjdGlvbi5gLFxuICApXG5cbiAgcmV0dXJuIHsgY29uZmlndXJlQXJyYXkgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q2FzZSh7IGNvbmNyZXRlRGF0YWJhc2UsIG5vZGVJRCB9KSB7XG4gIGxldCBjYXNlQXJyYXkgPSBhd2FpdCBjb25jcmV0ZURhdGFiYXNlLmdldE5vZGVDb25uZWN0aW9uKHsgZGlyZWN0aW9uOiAnb3V0Z29pbmcnLCBub2RlSUQsIGNvbm5lY3Rpb25UeXBlOiBzY2hlbWVSZWZlcmVuY2UuY29ubmVjdGlvblR5cGUuY2FzZSB9KVxuICAvLyBOb3RlOiBub2RlIHR5cGUgY291bGQgYmUgYW55IG5vZGVcbiAgcmV0dXJuIHsgY2FzZUFycmF5IH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERlZmF1bHQoeyBjb25jcmV0ZURhdGFiYXNlLCBub2RlSUQgfSkge1xuICBsZXQgZGVmYXVsdEFycmF5ID0gYXdhaXQgY29uY3JldGVEYXRhYmFzZS5nZXROb2RlQ29ubmVjdGlvbih7IGRpcmVjdGlvbjogJ291dGdvaW5nJywgbm9kZUlELCBjb25uZWN0aW9uVHlwZTogc2NoZW1lUmVmZXJlbmNlLmNvbm5lY3Rpb25UeXBlLmRlZmF1bHQgfSlcbiAgLy8gTm90ZTogbm9kZSB0eXBlIGNvdWxkIGJlIGFueSBub2RlXG4gIHJldHVybiB7IGRlZmF1bHRBcnJheSB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRSZWZlcmVuY2UoeyBjb25jcmV0ZURhdGFiYXNlLCBub2RlSUQgfSkge1xuICBsZXQgcmVmZXJlbmNlQXJyYXkgPSBhd2FpdCBjb25jcmV0ZURhdGFiYXNlLmdldE5vZGVDb25uZWN0aW9uKHsgZGlyZWN0aW9uOiAnb3V0Z29pbmcnLCBub2RlSUQ6IG5vZGVJRCwgY29ubmVjdGlvblR5cGU6IHNjaGVtZVJlZmVyZW5jZS5jb25uZWN0aW9uVHlwZS5yZWZlcmVuY2UgfSlcbiAgYXNzZXJ0KFxuICAgIHJlZmVyZW5jZUFycmF5LmV2ZXJ5KG4gPT4gbi5kZXN0aW5hdGlvbi5sYWJlbHMuaW5jbHVkZXMoc2NoZW1lUmVmZXJlbmNlLm5vZGVMYWJlbC5zdGFnZSkgfHwgbi5kZXN0aW5hdGlvbi5sYWJlbHMuaW5jbHVkZXMoc2NoZW1lUmVmZXJlbmNlLm5vZGVMYWJlbC5yZXJvdXRlKSksXG4gICAgYOKAoiBVbnN1cHBvcnRlZCBub2RlIHR5cGUgZm9yIGEgJHtzY2hlbWVSZWZlcmVuY2UuY29ubmVjdGlvblR5cGUucmVmZXJlbmNlfSBjb25uZWN0aW9uLmAsXG4gICkgLy8gdmVyaWZ5IG5vZGUgdHlwZVxuICByZXR1cm4geyByZWZlcmVuY2VBcnJheSB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRFeHRlbmQoeyBjb25jcmV0ZURhdGFiYXNlLCBub2RlSUQgfSkge1xuICBsZXQgZXh0ZW5kQXJyYXkgPSBhd2FpdCBjb25jcmV0ZURhdGFiYXNlLmdldE5vZGVDb25uZWN0aW9uKHsgZGlyZWN0aW9uOiAnb3V0Z29pbmcnLCBub2RlSUQ6IG5vZGVJRCwgY29ubmVjdGlvblR5cGU6IHNjaGVtZVJlZmVyZW5jZS5jb25uZWN0aW9uVHlwZS5leHRlbmQgfSlcbiAgYXNzZXJ0KFxuICAgIGV4dGVuZEFycmF5LmV2ZXJ5KG4gPT4gbi5kZXN0aW5hdGlvbi5sYWJlbHMuaW5jbHVkZXMoc2NoZW1lUmVmZXJlbmNlLm5vZGVMYWJlbC5yZXJvdXRlKSksXG4gICAgYOKAoiBVbnN1cHBvcnRlZCBub2RlIHR5cGUgZm9yIGEgRVhURU5EIGNvbm5lY3Rpb24uYCxcbiAgKSAvLyB2ZXJpZnkgbm9kZSB0eXBlXG4gIHJldHVybiB7IGV4dGVuZEFycmF5IH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEluc2VydCh7IGNvbmNyZXRlRGF0YWJhc2UsIG5vZGVJRCB9KSB7XG4gIGxldCBpbnNlcnRBcnJheSA9IGF3YWl0IGNvbmNyZXRlRGF0YWJhc2UuZ2V0Tm9kZUNvbm5lY3Rpb24oeyBkaXJlY3Rpb246ICdpbmNvbWluZycsIG5vZGVJRDogbm9kZUlELCBjb25uZWN0aW9uVHlwZTogc2NoZW1lUmVmZXJlbmNlLmNvbm5lY3Rpb25UeXBlLmluc2VydCB9KVxuICBhc3NlcnQoXG4gICAgaW5zZXJ0QXJyYXkuZXZlcnkobiA9PiBuLnNvdXJjZS5sYWJlbHMuaW5jbHVkZXMoc2NoZW1lUmVmZXJlbmNlLm5vZGVMYWJlbC5zdGFnZSkpLFxuICAgIGDigKIgVW5zdXBwb3J0ZWQgbm9kZSB0eXBlIGZvciBhIElOU0VSVCBjb25uZWN0aW9uLmAsXG4gICkgLy8gdmVyaWZ5IG5vZGUgdHlwZVxuICByZXR1cm4geyBpbnNlcnRBcnJheSB9XG59XG5cbi8qXG4gICAgICBfICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXyAgICAgICAgICAgXyAgICAgICAgICAgICAgICAgICAgICAgICBfICAgICAgICAgICBcbiAgICAgLyBcXCAgIF9fIF8gIF9fIF8gXyBfXyBfX18gIF9fIF8gIF9fIF98IHxfIF9fXyAgX198IHwgICBfXyBfIF8gICBfICBfX18gXyBfXyhfKSBfX18gIF9fXyBcbiAgICAvIF8gXFwgLyBfYCB8LyBfYCB8ICdfXy8gXyBcXC8gX2AgfC8gX2AgfCBfXy8gXyBcXC8gX2AgfCAgLyBfYCB8IHwgfCB8LyBfIFxcICdfX3wgfC8gXyBcXC8gX198XG4gICAvIF9fXyBcXCAoX3wgfCAoX3wgfCB8IHwgIF9fLyAoX3wgfCAoX3wgfCB8fCAgX18vIChffCB8IHwgKF98IHwgfF98IHwgIF9fLyB8ICB8IHwgIF9fL1xcX18gXFxcbiAgL18vICAgXFxfXFxfXywgfFxcX18sIHxffCAgXFxfX198XFxfXywgfFxcX18sX3xcXF9fXFxfX198XFxfXyxffCAgXFxfXywgfFxcX18sX3xcXF9fX3xffCAgfF98XFxfX198fF9fXy9cbiAgICAgICAgICB8X19fLyB8X19fLyAgICAgICAgICB8X19fLyAgICAgICAgICAgICAgICAgICAgICAgICAgfF98ICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuKi9cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFJlcm91dGVUcmF2ZXJzZVJlZmVyZW5jZUVsZW1lbnQoeyBjb25jcmV0ZURhdGFiYXNlLCBub2RlSUQgfSkge1xuICBjb25zdCB7IGV4dGVuZEFycmF5IH0gPSBhd2FpdCBnZXRFeHRlbmQoeyBjb25jcmV0ZURhdGFiYXNlLCBub2RlSUQgfSlcbiAgY29uc3QgeyBpbnNlcnRBcnJheSB9ID0gYXdhaXQgZ2V0SW5zZXJ0KHsgY29uY3JldGVEYXRhYmFzZSwgbm9kZUlEIH0pXG5cbiAgaWYgKGV4dGVuZEFycmF5Lmxlbmd0aCA+IDEpIHRocm93IG5ldyBFcnJvcihg4oCiIE11bHRpcGxlIGV4dGVuZCByZWxhdGlvbnNoaXBzIGFyZSBub3Qgc3VwcG9ydGVkIGZvciBSZXJvdXRlIG5vZGUuYClcblxuICByZXR1cm4geyBleHRlbmQ6IGV4dGVuZEFycmF5Lmxlbmd0aCA+IDAgPyBleHRlbmRBcnJheVswXSA6IG51bGwsIGluc2VydEFycmF5IH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFJlZmVyZW5jZVJlc29sdXRpb25FbGVtZW50KHsgY29uY3JldGVEYXRhYmFzZSwgbm9kZUlEIH0pIHtcbiAgY29uc3QgeyByZWZlcmVuY2VBcnJheSB9ID0gYXdhaXQgZ2V0UmVmZXJlbmNlKHsgY29uY3JldGVEYXRhYmFzZSwgbm9kZUlEIH0pXG5cbiAgaWYgKHJlZmVyZW5jZUFycmF5Lmxlbmd0aCA+IDEpIHRocm93IG5ldyBFcnJvcihg4oCiIE11bHRpcGxlIHJlZmVyZW5jZSByZWxhdGlvbnNoaXBzIGFyZSBub3Qgc3VwcG9ydGVkIGZvciBSZXJvdXRlIG5vZGUuYClcblxuICByZXR1cm4geyByZWZlcmVuY2U6IHJlZmVyZW5jZUFycmF5Lmxlbmd0aCA+IDAgPyByZWZlcmVuY2VBcnJheVswXSA6IG51bGwgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U3dpdGNoRWxlbWVudCh7IGNvbmNyZXRlRGF0YWJhc2UsIG5vZGVJRCB9KSB7XG4gIGNvbnN0IHsgY2FzZUFycmF5IH0gPSBhd2FpdCBnZXRDYXNlKHsgY29uY3JldGVEYXRhYmFzZSwgbm9kZUlEIH0pXG4gIGNvbnN0IHsgZGVmYXVsdEFycmF5IH0gPSBhd2FpdCBnZXREZWZhdWx0KHsgY29uY3JldGVEYXRhYmFzZSwgbm9kZUlEIH0pXG5cbiAgaWYgKGRlZmF1bHRBcnJheS5sZW5ndGggPiAxKSB0aHJvdyBuZXcgRXJyb3IoYOKAoiBNdWx0aXBsZSBkZWZhdWx0IHJlbGF0aW9uc2hpcHMgYXJlIG5vdCBzdXBwb3J0ZWQgZm9yIFN3aXRjaCBub2RlLmApXG5cbiAgcmV0dXJuIHsgY2FzZUFycmF5OiBjYXNlQXJyYXkubGVuZ3RoID4gMCA/IGNhc2VBcnJheSA6IG51bGwsIGRlZmF1bHQ6IGRlZmF1bHRBcnJheS5sZW5ndGggPiAwID8gZGVmYXVsdEFycmF5WzBdIDogbnVsbCB9XG59XG5cbi8vIFZhbHVlIGNvbm5lY3Rpb24gY29uY2VwdCBpbXBsZW1lbnRhdGlvblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFZhbHVlRWxlbWVudCh7IGNvbmNyZXRlRGF0YWJhc2UsIG5vZGVJRCB9KSB7XG4gIC8vIGdldCBWQUxVRSBjb25uZWN0aW9uXG4gIGxldCB2YWx1ZVxuICBjb25zdCB7IHZhbHVlQXJyYXkgfSA9IGF3YWl0IGdldFZhbHVlKHsgY29uY3JldGVEYXRhYmFzZSwgbm9kZUlEIH0pXG4gIGlmICh2YWx1ZUFycmF5Lmxlbmd0aCA+IDEpIHRocm93IG5ldyBFcnJvcihg4oCiIE11bHRpcGxlIFZBTFVFIHJlbGF0aW9uc2hpcHMgYXJlIG5vdCBzdXBwb3J0ZWQgZm9yIFByb2Nlc3Mgbm9kZS5gKVxuICBlbHNlIGlmICh2YWx1ZUFycmF5Lmxlbmd0aCAhPSAwICYmIHZhbHVlQXJyYXlbMF0pIHJldHVybiB2YWx1ZUFycmF5WzBdXG59XG4iXX0=