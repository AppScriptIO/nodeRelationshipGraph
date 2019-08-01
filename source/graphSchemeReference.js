"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.connectionProperty = exports.connectionType = exports.nodeLabel = void 0;const nodeLabel = {
  subgraphTemplate: 'SubgraphTemplate',
  port: 'Port',
  stage: 'Stage',
  process: 'Process',
  configuration: 'Configuration',
  evaluation: 'Evaluation',
  file: 'File' };exports.nodeLabel = nodeLabel;


const connectionType = {
  next: 'NEXT',
  fork: 'FORK',
  insert: 'INSERT',
  extend: 'EXTEND',
  root: 'ROOT',
  execute: 'EXECUTE',
  run: 'RUN',
  inherit: 'INHERIT',
  configure: 'CONFIGURE',
  default: 'DEFAULT',
  case: 'CASE',
  resource: 'RESOURCE' };exports.connectionType = connectionType;


const connectionProperty = {
  context: ['applicationReference', 'filesystemReference'] };exports.connectionProperty = connectionProperty;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS9ncmFwaFNjaGVtZVJlZmVyZW5jZS5qcyJdLCJuYW1lcyI6WyJub2RlTGFiZWwiLCJzdWJncmFwaFRlbXBsYXRlIiwicG9ydCIsInN0YWdlIiwicHJvY2VzcyIsImNvbmZpZ3VyYXRpb24iLCJldmFsdWF0aW9uIiwiZmlsZSIsImNvbm5lY3Rpb25UeXBlIiwibmV4dCIsImZvcmsiLCJpbnNlcnQiLCJleHRlbmQiLCJyb290IiwiZXhlY3V0ZSIsInJ1biIsImluaGVyaXQiLCJjb25maWd1cmUiLCJkZWZhdWx0IiwiY2FzZSIsInJlc291cmNlIiwiY29ubmVjdGlvblByb3BlcnR5IiwiY29udGV4dCJdLCJtYXBwaW5ncyI6IjRKQUFPLE1BQU1BLFNBQVMsR0FBRztBQUN2QkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBREs7QUFFdkJDLEVBQUFBLElBQUksRUFBRSxNQUZpQjtBQUd2QkMsRUFBQUEsS0FBSyxFQUFFLE9BSGdCO0FBSXZCQyxFQUFBQSxPQUFPLEVBQUUsU0FKYztBQUt2QkMsRUFBQUEsYUFBYSxFQUFFLGVBTFE7QUFNdkJDLEVBQUFBLFVBQVUsRUFBRSxZQU5XO0FBT3ZCQyxFQUFBQSxJQUFJLEVBQUUsTUFQaUIsRUFBbEIsQzs7O0FBVUEsTUFBTUMsY0FBYyxHQUFHO0FBQzVCQyxFQUFBQSxJQUFJLEVBQUUsTUFEc0I7QUFFNUJDLEVBQUFBLElBQUksRUFBRSxNQUZzQjtBQUc1QkMsRUFBQUEsTUFBTSxFQUFFLFFBSG9CO0FBSTVCQyxFQUFBQSxNQUFNLEVBQUUsUUFKb0I7QUFLNUJDLEVBQUFBLElBQUksRUFBRSxNQUxzQjtBQU01QkMsRUFBQUEsT0FBTyxFQUFFLFNBTm1CO0FBTzVCQyxFQUFBQSxHQUFHLEVBQUUsS0FQdUI7QUFRNUJDLEVBQUFBLE9BQU8sRUFBRSxTQVJtQjtBQVM1QkMsRUFBQUEsU0FBUyxFQUFFLFdBVGlCO0FBVTVCQyxFQUFBQSxPQUFPLEVBQUUsU0FWbUI7QUFXNUJDLEVBQUFBLElBQUksRUFBRSxNQVhzQjtBQVk1QkMsRUFBQUEsUUFBUSxFQUFFLFVBWmtCLEVBQXZCLEM7OztBQWVBLE1BQU1DLGtCQUFrQixHQUFHO0FBQ2hDQyxFQUFBQSxPQUFPLEVBQUUsQ0FBQyxzQkFBRCxFQUF5QixxQkFBekIsQ0FEdUIsRUFBM0IsQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBub2RlTGFiZWwgPSB7XG4gIHN1YmdyYXBoVGVtcGxhdGU6ICdTdWJncmFwaFRlbXBsYXRlJyxcbiAgcG9ydDogJ1BvcnQnLFxuICBzdGFnZTogJ1N0YWdlJyxcbiAgcHJvY2VzczogJ1Byb2Nlc3MnLFxuICBjb25maWd1cmF0aW9uOiAnQ29uZmlndXJhdGlvbicsXG4gIGV2YWx1YXRpb246ICdFdmFsdWF0aW9uJyxcbiAgZmlsZTogJ0ZpbGUnLFxufVxuXG5leHBvcnQgY29uc3QgY29ubmVjdGlvblR5cGUgPSB7XG4gIG5leHQ6ICdORVhUJyxcbiAgZm9yazogJ0ZPUksnLFxuICBpbnNlcnQ6ICdJTlNFUlQnLFxuICBleHRlbmQ6ICdFWFRFTkQnLFxuICByb290OiAnUk9PVCcsXG4gIGV4ZWN1dGU6ICdFWEVDVVRFJyxcbiAgcnVuOiAnUlVOJyxcbiAgaW5oZXJpdDogJ0lOSEVSSVQnLFxuICBjb25maWd1cmU6ICdDT05GSUdVUkUnLFxuICBkZWZhdWx0OiAnREVGQVVMVCcsXG4gIGNhc2U6ICdDQVNFJyxcbiAgcmVzb3VyY2U6ICdSRVNPVVJDRScsXG59XG5cbmV4cG9ydCBjb25zdCBjb25uZWN0aW9uUHJvcGVydHkgPSB7XG4gIGNvbnRleHQ6IFsnYXBwbGljYXRpb25SZWZlcmVuY2UnLCAnZmlsZXN5c3RlbVJlZmVyZW5jZSddLFxufVxuIl19