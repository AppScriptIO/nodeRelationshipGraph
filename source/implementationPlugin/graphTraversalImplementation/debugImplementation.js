"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.aggregateIntoArray = aggregateIntoArray;
var _promiseProperRace = _interopRequireDefault(require("@dependency/promiseProperRace"));

function aggregateIntoArray({ thisArg }) {


  let self = {

    traverseGraph: async function* ({
      nodeInstance,
      controller = nodeInstance.contextInstance,
      iteratePort = self.iteratePort,
      iterateConnection = self.iterateConnection,
      executeDataItem = self.executeDataItem,
      aggregationArray = [],
      subsequentArray = [] })
    {

      let dataItem;
      if (nodeInstance.tag && nodeInstance.tag.dataItemType == 'reference') {


        dataItem = await controller.initializeDataItem.apply(controller, [{ dataItemKey: nodeInstance.dataItem && nodeInstance.dataItem.key }]);
      } else {

        dataItem = nodeInstance.dataItem;
      }


      let nodeResult = dataItem ? await executeDataItem({ dataItem, executionType: nodeInstance.tag && nodeInstance.tag.executionType }) : null;


      aggregationArray.push(nodeResult);


      if (nodeInstance.port) {
        subsequentArray = await iteratePort({ nodePortArray: nodeInstance.port });
      } else if (nodeInstance.connection && nodeInstance.connection.length != 0) {
        subsequentArray = await iterateConnection({ nodeConnectionArray: nodeInstance.connection });
      }

      Array.prototype.push.apply(aggregationArray, subsequentArray);

      return aggregationArray;
    },


    async initializeDataItem({ dataItem, nodeInstance = thisArg, executionType }) {
      let implementationObject = {
        async getResourceFile() {} };



      if (executionType) {
        let callback;


        for (let index in implementationObject) {
          if (index == executionType) {
            callback = implementationObject[index];
            break;
          }
        }


        return await callback.apply(this, arguments);
      } else


        return;
    },

    async executeDataItem({ dataItem, nodeInstance = thisArg, executionType }) {
      let implementationObject = {
        async returnDataItemKey() {
          return dataItem.key;
        },

        async timeout() {
          let delay = dataItem.timerDelay || 0;
          return await new Promise((resolve, reject) =>
          setTimeout(() => {

            resolve(dataItem.key);
          }, delay));

        } };



      if (executionType) {
        let callback;


        for (let index in implementationObject) {
          if (index == executionType) {
            callback = implementationObject[index];
            break;
          }
        }


        return await callback.apply(this, arguments);
      } else


        return dataItem.key;
    },




    async iteratePort({ nodePortArray = thisArg.port, executePort = self.executePort }) {

      nodePortArray = nodePortArray.filter(item => item.tag.direction == 'output');


      function sortAccordingToOrder(former, latter) {
        return former.order - latter.order;
      }
      nodePortArray.sort(sortAccordingToOrder);

      let aggregationArray = [];
      for (let nodePort of nodePortArray) {
        let subsequentArray = await executePort({ nodePort: nodePort });
        Array.prototype.push.apply(aggregationArray, subsequentArray);
      }

      return aggregationArray;
    },




    async executePort({ nodePort, nodeInstance = thisArg, iterateConnection = self.iterateConnection, executionTypeArray }) {

      let currentPortConnectionArray = nodeInstance.connection.filter(item => item.source.portKey == nodePort.key);

      return await iterateConnection({ nodeConnectionArray: currentPortConnectionArray, implementationType: nodePort.tag && nodePort.tag.iterateConnectionImplementation });
    },





    async iterateConnection({
      nodeConnectionArray = thisArg.connection || [],
      executeConnection = self.executeConnection,
      implementationType = thisArg.tag && thisArg.tag.iterateConnectionImplementation,
      aggregationArray = [] } =
    {}) {

      nodeConnectionArray = nodeConnectionArray.filter(item => item.tag.direction == 'outgoing');


      function sortAccordingToOrder(former, latter) {
        return former.source.position.order - latter.source.position.order;
      }
      nodeConnectionArray.sort(sortAccordingToOrder);

      let implementationObject = {

        async simpleChronological() {
          for (let nodeConnection of nodeConnectionArray) {
            let subsequentArray = await executeConnection({ nodeConnection });
            Array.prototype.push.apply(aggregationArray, subsequentArray);
          }
          aggregationArray = aggregationArray.filter(item => item);
          return aggregationArray;
        },

        async chronological() {
          let array = await nodeConnectionArray.reduce(async (accumulatorPromise, nodeConnection, index) => {

            let accumulatorArray = await accumulatorPromise;
            let subsequentResult = await executeConnection({ nodeConnection });


            let subsequentArray = Array.isArray(subsequentResult) ? subsequentResult : [subsequentResult];


            accumulatorArray.length != 0 ? Array.prototype.push.apply(accumulatorArray, subsequentArray) : accumulatorArray = subsequentArray.slice();

            return accumulatorArray;
          }, Promise.resolve([]));
          return array;
        },





        async allPromise() {
          let nodePromiseArray = [];
          nodePromiseArray = nodeConnectionArray.map(nodeConnection => {
            return new Promise(async (resolve, reject) => {
              let result = await executeConnection({ nodeConnection });
              resolve(result);
            });
          });

          let nodeResolvedResultArray = await Promise.all(nodePromiseArray).catch(error => {
            if (process.env.SZN_DEBUG == 'true') console.error(`🔀⚠️ \`Promise.all\` for nodeConnectionArray rejected because: ${error}`);else
            console.log(error);
          });

          let array = nodeResolvedResultArray.
          reduce((accumulatorArray, nodeResult, index) => {
            let subsequentArray = Array.isArray(nodeResult) ? nodeResult : [nodeResult];


            accumulatorArray.length != 0 ? Array.prototype.push.apply(accumulatorArray, subsequentArray) : accumulatorArray = subsequentArray.slice();

            return accumulatorArray;
          }, []).
          filter(item => item);
          return array;
        },



        async raceFirstPromise() {
          let nodePromiseArray = [];
          nodePromiseArray = nodeConnectionArray.map(nodeConnection => {
            return new Promise(async (resolve, reject) => {
              try {
                let result = await executeConnection({ nodeConnection });
                resolve(result);
              } catch (error) {
                reject(error);
              }
            });
          });

          let nodeResolvedResult = await (0, _promiseProperRace.default)(nodePromiseArray).
          then(resolvedPromiseArray => {
            return resolvedPromiseArray[0];
          }).
          catch(error => {
            if (process.env.SZN_DEBUG == 'true') console.error(`🔀⚠️ promiseProperRace rejected because: ${error}`);else
            console.log(`🔀⚠️ promiseProperRace rejected because: ${error}`);
          });
          return nodeResolvedResult ? nodeResolvedResult : false;
        } };



      let callback;
      for (let index in implementationObject) {
        if (index == implementationType) {
          callback = implementationObject[index];
          break;
        }
      }


      if (!callback && implementationType) console.error(`• no implementation found for "${implementationType}", node connection iteration stopped.`);else

        if (!callback) callback = implementationObject['simpleChronological'];


      return callback.apply(this, arguments);
    },




    async executeConnection({ nodeConnection, iterateDestinationNode = self.iterateDestinationNode }) {
      return await iterateDestinationNode({ connectionDestinationNodeArray: nodeConnection.destination.node });
    },




    async iterateDestinationNode({ connectionDestinationNodeArray, executeDestinationNode = self.executeDestinationNode, aggregationArray = [] } = {}) {

      for (let destinationNode of connectionDestinationNodeArray) {
        let subsequentArray = await executeDestinationNode({ destinationNodeKey: destinationNode.key });
        Array.prototype.push.apply(aggregationArray, subsequentArray);
      }
      return aggregationArray;
    },




    async executeDestinationNode({ destinationNodeKey, controller = thisArg.contextInstance }) {
      return await controller.traverseGraph({ nodeKey: destinationNodeKey });
    },







    async filterAndOrderChildren({ insertionPointKey, children = this.children }) {
      let ownFilteredChildren = await this.filterAndModifyChildrenArray(children, insertionPointKey, null);
      let additionalFilteredChildren = await this.filterAndModifyChildrenArray(this.additionalChildNestedUnit, insertionPointKey, this.pathPointerKey);
      let merged = await this.mergeAndOrderChildren(ownFilteredChildren, additionalFilteredChildren);
      return merged;
    },






    async filterAndModifyChildrenArray(children, insertionPointKey, pathPointerKey) {
      return children.filter((child, index) => {

        let result = child.insertionPosition.insertionPoint == insertionPointKey && child.insertionPosition.insertionPathPointer == pathPointerKey;

        return result;
      });
    },

    async mergeAndOrderChildren(ownFilteredChildren, additionalFilteredChildren) {



      let firstChildren = [],
      lastChildren = [],
      orderedChildren = [];
      await additionalFilteredChildren.sort((prior, subsequent) => {
        return prior.order <= subsequent.order ? 1 : -1;
      });
      await ownFilteredChildren.sort((prior, subsequent) => {
        return prior.order <= subsequent.order ? 1 : -1;
      });


      additionalFilteredChildren = additionalFilteredChildren.filter((child, index) => {

        if (!child.insertionPosition.placement.pathPointer && child.insertionPosition.placement.type) {
          switch (child.insertionPosition.placement.type) {
            case 'before':
              firstChildren.push(child);
              break;
            case 'after':
            default:
              lastChildren.push(child);
              break;}

          return false;

        }
        return true;
      });


      ownFilteredChildren.map((ownChild, ownChildIndex) => {
        orderedChildren.push(ownChild);
        let currentChildPosition = orderedChildren.length - 1;
        additionalFilteredChildren.map((additionalChild, additionalChildIndex) => {
          if (
          additionalChild.insertionPosition.placement.type &&
          additionalChild.insertionPosition.placement.pathPointer &&
          additionalChild.insertionPosition.placement.pathPointer == ownChild.pathPointerKey)
          {
            switch (additionalChild.insertionPosition.placement.type) {
              case 'before':
                orderedChildren.splice(currentChildPosition, 0, additionalChild);
                break;
              case 'after':
              default:
                orderedChildren.splice(currentChildPosition + 1, 0, additionalChild);
                break;}

          }
        });
      });

      return Array.prototype.concat(firstChildren, orderedChildren, lastChildren);
    },

    async addAdditionalChildNestedUnit({ nestedUnit }) {

      if (nestedUnit.children.length != 0) {
        await Array.prototype.push.apply(nestedUnit.children, nestedUnit.additionalChildNestedUnit);
      } else {
        nestedUnit.children = await nestedUnit.additionalChildNestedUnit.slice();
      }
    } };


  Object.keys(self).forEach(function (key) {
    self[key] = self[key].bind(thisArg);
  }, {});
  return self;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NvdXJjZS9pbXBsZW1lbnRhdGlvblBsdWdpbi9ncmFwaFRyYXZlcnNhbEltcGxlbWVudGF0aW9uL2RlYnVnSW1wbGVtZW50YXRpb24uanMiXSwibmFtZXMiOlsiYWdncmVnYXRlSW50b0FycmF5IiwidGhpc0FyZyIsInNlbGYiLCJ0cmF2ZXJzZUdyYXBoIiwibm9kZUluc3RhbmNlIiwiY29udHJvbGxlciIsImNvbnRleHRJbnN0YW5jZSIsIml0ZXJhdGVQb3J0IiwiaXRlcmF0ZUNvbm5lY3Rpb24iLCJleGVjdXRlRGF0YUl0ZW0iLCJhZ2dyZWdhdGlvbkFycmF5Iiwic3Vic2VxdWVudEFycmF5IiwiZGF0YUl0ZW0iLCJ0YWciLCJkYXRhSXRlbVR5cGUiLCJpbml0aWFsaXplRGF0YUl0ZW0iLCJhcHBseSIsImRhdGFJdGVtS2V5Iiwia2V5Iiwibm9kZVJlc3VsdCIsImV4ZWN1dGlvblR5cGUiLCJwdXNoIiwicG9ydCIsIm5vZGVQb3J0QXJyYXkiLCJjb25uZWN0aW9uIiwibGVuZ3RoIiwibm9kZUNvbm5lY3Rpb25BcnJheSIsIkFycmF5IiwicHJvdG90eXBlIiwiaW1wbGVtZW50YXRpb25PYmplY3QiLCJnZXRSZXNvdXJjZUZpbGUiLCJjYWxsYmFjayIsImluZGV4IiwiYXJndW1lbnRzIiwicmV0dXJuRGF0YUl0ZW1LZXkiLCJ0aW1lb3V0IiwiZGVsYXkiLCJ0aW1lckRlbGF5IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzZXRUaW1lb3V0IiwiZXhlY3V0ZVBvcnQiLCJmaWx0ZXIiLCJpdGVtIiwiZGlyZWN0aW9uIiwic29ydEFjY29yZGluZ1RvT3JkZXIiLCJmb3JtZXIiLCJsYXR0ZXIiLCJvcmRlciIsInNvcnQiLCJub2RlUG9ydCIsImV4ZWN1dGlvblR5cGVBcnJheSIsImN1cnJlbnRQb3J0Q29ubmVjdGlvbkFycmF5Iiwic291cmNlIiwicG9ydEtleSIsImltcGxlbWVudGF0aW9uVHlwZSIsIml0ZXJhdGVDb25uZWN0aW9uSW1wbGVtZW50YXRpb24iLCJleGVjdXRlQ29ubmVjdGlvbiIsInBvc2l0aW9uIiwic2ltcGxlQ2hyb25vbG9naWNhbCIsIm5vZGVDb25uZWN0aW9uIiwiY2hyb25vbG9naWNhbCIsImFycmF5IiwicmVkdWNlIiwiYWNjdW11bGF0b3JQcm9taXNlIiwiYWNjdW11bGF0b3JBcnJheSIsInN1YnNlcXVlbnRSZXN1bHQiLCJpc0FycmF5Iiwic2xpY2UiLCJhbGxQcm9taXNlIiwibm9kZVByb21pc2VBcnJheSIsIm1hcCIsInJlc3VsdCIsIm5vZGVSZXNvbHZlZFJlc3VsdEFycmF5IiwiYWxsIiwiY2F0Y2giLCJlcnJvciIsInByb2Nlc3MiLCJlbnYiLCJTWk5fREVCVUciLCJjb25zb2xlIiwibG9nIiwicmFjZUZpcnN0UHJvbWlzZSIsIm5vZGVSZXNvbHZlZFJlc3VsdCIsInRoZW4iLCJyZXNvbHZlZFByb21pc2VBcnJheSIsIml0ZXJhdGVEZXN0aW5hdGlvbk5vZGUiLCJjb25uZWN0aW9uRGVzdGluYXRpb25Ob2RlQXJyYXkiLCJkZXN0aW5hdGlvbiIsIm5vZGUiLCJleGVjdXRlRGVzdGluYXRpb25Ob2RlIiwiZGVzdGluYXRpb25Ob2RlIiwiZGVzdGluYXRpb25Ob2RlS2V5Iiwibm9kZUtleSIsImZpbHRlckFuZE9yZGVyQ2hpbGRyZW4iLCJpbnNlcnRpb25Qb2ludEtleSIsImNoaWxkcmVuIiwib3duRmlsdGVyZWRDaGlsZHJlbiIsImZpbHRlckFuZE1vZGlmeUNoaWxkcmVuQXJyYXkiLCJhZGRpdGlvbmFsRmlsdGVyZWRDaGlsZHJlbiIsImFkZGl0aW9uYWxDaGlsZE5lc3RlZFVuaXQiLCJwYXRoUG9pbnRlcktleSIsIm1lcmdlZCIsIm1lcmdlQW5kT3JkZXJDaGlsZHJlbiIsImNoaWxkIiwiaW5zZXJ0aW9uUG9zaXRpb24iLCJpbnNlcnRpb25Qb2ludCIsImluc2VydGlvblBhdGhQb2ludGVyIiwiZmlyc3RDaGlsZHJlbiIsImxhc3RDaGlsZHJlbiIsIm9yZGVyZWRDaGlsZHJlbiIsInByaW9yIiwic3Vic2VxdWVudCIsInBsYWNlbWVudCIsInBhdGhQb2ludGVyIiwidHlwZSIsIm93bkNoaWxkIiwib3duQ2hpbGRJbmRleCIsImN1cnJlbnRDaGlsZFBvc2l0aW9uIiwiYWRkaXRpb25hbENoaWxkIiwiYWRkaXRpb25hbENoaWxkSW5kZXgiLCJzcGxpY2UiLCJjb25jYXQiLCJhZGRBZGRpdGlvbmFsQ2hpbGROZXN0ZWRVbml0IiwibmVzdGVkVW5pdCIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwiYmluZCJdLCJtYXBwaW5ncyI6IjtBQUNBOztBQUVPLFNBQVNBLGtCQUFULENBQTRCLEVBQUVDLE9BQUYsRUFBNUIsRUFBeUM7OztBQUc5QyxNQUFJQyxJQUFJLEdBQUc7O0FBRVRDLElBQUFBLGFBQWEsRUFBRSxpQkFBZ0I7QUFDN0JDLE1BQUFBLFlBRDZCO0FBRTdCQyxNQUFBQSxVQUFVLEdBQUdELFlBQVksQ0FBQ0UsZUFGRztBQUc3QkMsTUFBQUEsV0FBVyxHQUFHTCxJQUFJLENBQUNLLFdBSFU7QUFJN0JDLE1BQUFBLGlCQUFpQixHQUFHTixJQUFJLENBQUNNLGlCQUpJO0FBSzdCQyxNQUFBQSxlQUFlLEdBQUdQLElBQUksQ0FBQ08sZUFMTTtBQU03QkMsTUFBQUEsZ0JBQWdCLEdBQUcsRUFOVTtBQU83QkMsTUFBQUEsZUFBZSxHQUFHLEVBUFcsRUFBaEI7QUFRWjs7QUFFRCxVQUFJQyxRQUFKO0FBQ0EsVUFBSVIsWUFBWSxDQUFDUyxHQUFiLElBQW9CVCxZQUFZLENBQUNTLEdBQWIsQ0FBaUJDLFlBQWpCLElBQWlDLFdBQXpELEVBQXNFOzs7QUFHcEVGLFFBQUFBLFFBQVEsR0FBRyxNQUFNUCxVQUFVLENBQUNVLGtCQUFYLENBQThCQyxLQUE5QixDQUFvQ1gsVUFBcEMsRUFBZ0QsQ0FBQyxFQUFFWSxXQUFXLEVBQUViLFlBQVksQ0FBQ1EsUUFBYixJQUF5QlIsWUFBWSxDQUFDUSxRQUFiLENBQXNCTSxHQUE5RCxFQUFELENBQWhELENBQWpCO0FBQ0QsT0FKRCxNQUlPOztBQUVMTixRQUFB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TUUsS0FBSyxDQUFDQyxTQUFOLENBQWdCUCxJQUFoQixDQUFxQkwsS0FBckIsQ0FBMkI2RyxVQUFVLENBQUM1QixRQUF0QyxFQUFnRDRCLFVBQVUsQ0FBQ3hCLHlCQUEzRCxDQUFOO0FBQ0QsT0FGRCxNQUVPO0FBQ0x3QixRQUFBQSxVQUFVLENBQUM1QixRQUFYLEdBQXNCLE1BQU00QixVQUFVLENBQUN4Qix5QkFBWCxDQUFxQ2hDLEtBQXJDLEVBQTVCO0FBQ0Q7QUFDRixLQXpYUSxFQUFYOzs7QUE0WEF5RCxFQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWTdILElBQVosRUFBa0I4SCxPQUFsQixDQUEwQixVQUFTOUcsR0FBVCxFQUFjO0FBQ3RDaEIsSUFBQUEsSUFBSSxDQUFDZ0IsR0FBRCxDQUFKLEdBQVloQixJQUFJLENBQUNnQixHQUFELENBQUosQ0FBVStHLElBQVYsQ0FBZWhJLE9BQWYsQ0FBWjtBQUNELEdBRkQsRUFFRyxFQUZIO0FBR0EsU0FBT0MsSUFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFzc2VydCBmcm9tICdhc3NlcnQnXHJcbmltcG9ydCBwcm9taXNlUHJvcGVyUmFjZSBmcm9tICdAZGVwZW5kZW5jeS9wcm9taXNlUHJvcGVyUmFjZSdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZ2dyZWdhdGVJbnRvQXJyYXkoeyB0aGlzQXJnIH0pIHtcclxuICAvLyBmdW5jdGlvbiB3cmFwcGVyIHRvIHNldCB0aGlzQXJnIG9uIGltcGxlbWVudGFpb24gb2JqZWN0IGZ1bmN0aW9ucy5cclxuXHJcbiAgbGV0IHNlbGYgPSB7XHJcbiAgICAvLyBUT0RPOiBzcGVjaWZ5IHRoZSBwYXJhbWV0ZXIgaGlyZXJjaHkgdGhhdCB3aWxsIGJlIHVzZWQgaW4gZ3JhcGggdHJhdmVyc2FsIGFuZCB0aGUgbG9jYXRpb24gb2YgdGhlIHBhcmFtZXRlcnMgKGluc3RhbmNlLCBjb250ZXh0IGluc3RhbmNlLCBzdGF0aWMgc3VwZXJjbGFzcywgZ2xvYmFsLCB3aGF0ZXZlci4pXHJcbiAgICB0cmF2ZXJzZUdyYXBoOiBhc3luYyBmdW5jdGlvbiooe1xyXG4gICAgICBub2RlSW5zdGFuY2UsXHJcbiAgICAgIGNvbnRyb2xsZXIgPSBub2RlSW5zdGFuY2UuY29udGV4dEluc3RhbmNlLCAvLyBnZXQgc2hhcmVkIGNvbnRyb2xsZXJcclxuICAgICAgaXRlcmF0ZVBvcnQgPSBzZWxmLml0ZXJhdGVQb3J0LFxyXG4gICAgICBpdGVyYXRlQ29ubmVjdGlvbiA9IHNlbGYuaXRlcmF0ZUNvbm5lY3Rpb24sXHJcbiAgICAgIGV4ZWN1dGVEYXRhSXRlbSA9IHNlbGYuZXhlY3V0ZURhdGFJdGVtLFxyXG4gICAgICBhZ2dyZWdhdGlvbkFycmF5ID0gW10sXHJcbiAgICAgIHN1YnNlcXVlbnRBcnJheSA9IFtdLFxyXG4gICAgfSkge1xyXG4gICAgICAvLyBnZXQgbm9kZSBkYXRhSXRlbSAtIGVpdGhlciBkYXRhSXRlbSBpbnN0YW5jZSBvYmplY3Qgb3IgcmVndWxhciBvYmplY3RcclxuICAgICAgbGV0IGRhdGFJdGVtXHJcbiAgICAgIGlmIChub2RlSW5zdGFuY2UudGFnICYmIG5vZGVJbnN0YW5jZS50YWcuZGF0YUl0ZW1UeXBlID09ICdyZWZlcmVuY2UnKSB7XHJcbiAgICAgICAgLy8gY3JlYXRpbmcgZGF0YSBpdGVtIGluc3RhbmNlXHJcbiAgICAgICAgLy8gbG9hZCBkYXRhSXRlbSBieSByZWZlcmVuY2UgaS5lLiB1c2luZyBga2V5YFxyXG4gICAgICAgIGRhdGFJdGVtID0gYXdhaXQgY29udHJvbGxlci5pbml0aWFsaXplRGF0YUl0ZW0uYXBwbHkoY29udHJvbGxlciwgW3sgZGF0YUl0ZW1LZXk6IG5vZGVJbnN0YW5jZS5kYXRhSXRlbSAmJiBub2RlSW5zdGFuY2UuZGF0YUl0ZW0ua2V5IH1dKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIGRlZmF1bHQgZGF0YUl0ZW0gYnkgcHJvcGVydHlcclxuICAgICAgICBkYXRhSXRlbSA9IG5vZGVJbnN0YW5jZS5kYXRhSXRlbVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBFeGVjdXRlIG5vZGUgZGF0YUl0ZW1cclxuICAgICAgbGV0IG5vZGVSZXN1bHQgPSBkYXRhSXRlbSA/IGF3YWl0IGV4ZWN1dGVEYXRhSXRlbSh7IGRhdGFJdGVtLCBleGVjdXRpb25UeXBlOiBub2RlSW5zdGFuY2UudGFnICYmIG5vZGVJbnN0YW5jZS50YWcuZXhlY3V0aW9uVHlwZSB9KSA6IG51bGxcclxuXHJcbiAgICAgIC8vIFByb2Nlc3MgcmV0dXJuZWQgcmVzdWx0XHJcbiAgICAgIGFnZ3JlZ2F0aW9uQXJyYXkucHVzaChub2RlUmVzdWx0KVxyXG5cclxuICAgICAgLy8gSXRlcmF0ZSBvdmVyIGNvbm5lY3Rpb25cclxuICAgICAgaWYgKG5vZGVJbnN0YW5jZS5wb3J0KSB7XHJcbiAgICAgICAgc3Vic2VxdWVudEFycmF5ID0gYXdhaXQgaXRlcmF0ZVBvcnQoeyBub2RlUG9ydEFycmF5OiBub2RlSW5zdGFuY2UucG9ydCB9KVxyXG4gICAgICB9IGVsc2UgaWYgKG5vZGVJbnN0YW5jZS5jb25uZWN0aW9uICYmIG5vZGVJbnN0YW5jZS5jb25uZWN0aW9uLmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgc3Vic2VxdWVudEFycmF5ID0gYXdhaXQgaXRlcmF0ZUNvbm5lY3Rpb24oeyBub2RlQ29ubmVjdGlvbkFycmF5OiBub2RlSW5zdGFuY2UuY29ubmVjdGlvbiB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShhZ2dyZWdhdGlvbkFycmF5LCBzdWJzZXF1ZW50QXJyYXkpXHJcblxyXG4gICAgICByZXR1cm4gYWdncmVnYXRpb25BcnJheVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBUT0RPOiBjcmVhdGUgbXVsdGlwbGUgaW1wbGVtZW50YXRpb25zXHJcbiAgICBhc3luYyBpbml0aWFsaXplRGF0YUl0ZW0oeyBkYXRhSXRlbSwgbm9kZUluc3RhbmNlID0gdGhpc0FyZywgZXhlY3V0aW9uVHlwZSB9KSB7XHJcbiAgICAgIGxldCBpbXBsZW1lbnRhdGlvbk9iamVjdCA9IHtcclxuICAgICAgICBhc3luYyBnZXRSZXNvdXJjZUZpbGUoKSB7fSxcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gc3BlY2lmaWMgZXhlY3V0aW9uIGltcGxlbWVudGF0aW9uXHJcbiAgICAgIGlmIChleGVjdXRpb25UeXBlKSB7XHJcbiAgICAgICAgbGV0IGNhbGxiYWNrXHJcblxyXG4gICAgICAgIC8vIHBpY2sgaW1wbGVtZW50YXRpb25cclxuICAgICAgICBmb3IgKGxldCBpbmRleCBpbiBpbXBsZW1lbnRhdGlvbk9iamVjdCkge1xyXG4gICAgICAgICAgaWYgKGluZGV4ID09IGV4ZWN1dGlvblR5cGUpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sgPSBpbXBsZW1lbnRhdGlvbk9iamVjdFtpbmRleF1cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGV4ZWN1dGUgaW1wbGVtZW50YXRpb25cclxuICAgICAgICByZXR1cm4gYXdhaXQgY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBkZWZhdWx0IGV4ZWN1dGlvblxyXG4gICAgICBlbHNlIHJldHVybiAvLy8gVE9ETzpcclxuICAgIH0sXHJcblxyXG4gICAgYXN5bmMgZXhlY3V0ZURhdGFJdGVtKHsgZGF0YUl0ZW0sIG5vZGVJbnN0YW5jZSA9IHRoaXNBcmcsIGV4ZWN1dGlvblR5cGUgfSkge1xyXG4gICAgICBsZXQgaW1wbGVtZW50YXRpb25PYmplY3QgPSB7XHJcbiAgICAgICAgYXN5bmMgcmV0dXJuRGF0YUl0ZW1LZXkoKSB7XHJcbiAgICAgICAgICByZXR1cm4gZGF0YUl0ZW0ua2V5XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBpbXBsZW1lbnRhdGlvbiBkZWxheXMgcHJvbWlzZXMgZm9yIHRlc3RpbmcgYGl0ZXJhdGVDb25uZWN0aW9uYCBvZiBwcm9taXNlcyBlLmcuIGBhbGxQcm9taXNlYCwgYHJhY2VGaXJzdFByb21pc2VgLCBldGMuXHJcbiAgICAgICAgYXN5bmMgdGltZW91dCgpIHtcclxuICAgICAgICAgIGxldCBkZWxheSA9IGRhdGFJdGVtLnRpbWVyRGVsYXkgfHwgMFxyXG4gICAgICAgICAgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGAke2RlbGF5fW1zIHBhc3NlZCBmb3Iga2V5ICR7ZGF0YUl0ZW0ua2V5fS5gKSAvLyBkZWJ1Z1xyXG4gICAgICAgICAgICAgIHJlc29sdmUoZGF0YUl0ZW0ua2V5KVxyXG4gICAgICAgICAgICB9LCBkZWxheSksXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgfSxcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gc3BlY2lmaWMgZXhlY3V0aW9uIGltcGxlbWVudGF0aW9uXHJcbiAgICAgIGlmIChleGVjdXRpb25UeXBlKSB7XHJcbiAgICAgICAgbGV0IGNhbGxiYWNrXHJcblxyXG4gICAgICAgIC8vIHBpY2sgaW1wbGVtZW50YXRpb25cclxuICAgICAgICBmb3IgKGxldCBpbmRleCBpbiBpbXBsZW1lbnRhdGlvbk9iamVjdCkge1xyXG4gICAgICAgICAgaWYgKGluZGV4ID09IGV4ZWN1dGlvblR5cGUpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sgPSBpbXBsZW1lbnRhdGlvbk9iamVjdFtpbmRleF1cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGV4ZWN1dGUgaW1wbGVtZW50YXRpb25cclxuICAgICAgICByZXR1cm4gYXdhaXQgY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBkZWZhdWx0IGV4ZWN1dGlvblxyXG4gICAgICBlbHNlIHJldHVybiBkYXRhSXRlbS5rZXlcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gbG9vcHMgdGhyb3VnaCBhbGwgdGhlIGBub2RlIHBvcnRzYCBhbmQgaW5pdGlhbGl6ZXMgZWFjaCBvbmUgdG8gZXhlY3V0ZSB0aGUgYG5vZGUgY29ubmVjdGlvbnNgIHNwZWNpZmljIGZvciBpdC5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgaXRlcmF0ZVBvcnQoeyBub2RlUG9ydEFycmF5ID0gdGhpc0FyZy5wb3J0LCBleGVjdXRlUG9ydCA9IHNlbGYuZXhlY3V0ZVBvcnQgfSkge1xyXG4gICAgICAvLyBmaWx0ZXIgcG9ydCBhcnJheSB0byBtYXRjaCBvdXRnb2luZyBwb3J0cyBvbmx5XHJcbiAgICAgIG5vZGVQb3J0QXJyYXkgPSBub2RlUG9ydEFycmF5LmZpbHRlcihpdGVtID0+IGl0ZW0udGFnLmRpcmVjdGlvbiA9PSAnb3V0cHV0JylcclxuXHJcbiAgICAgIC8vIHNvcnQgYXJyYXlcclxuICAgICAgZnVuY3Rpb24gc29ydEFjY29yZGluZ1RvT3JkZXIoZm9ybWVyLCBsYXR0ZXIpIHtcclxuICAgICAgICByZXR1cm4gZm9ybWVyLm9yZGVyIC0gbGF0dGVyLm9yZGVyXHJcbiAgICAgIH0gLy8gdXNpbmcgYG9yZGVyYCBwcm9wZXJ0eVxyXG4gICAgICBub2RlUG9ydEFycmF5LnNvcnQoc29ydEFjY29yZGluZ1RvT3JkZXIpXHJcblxyXG4gICAgICBsZXQgYWdncmVnYXRpb25BcnJheSA9IFtdXHJcbiAgICAgIGZvciAobGV0IG5vZGVQb3J0IG9mIG5vZGVQb3J0QXJyYXkpIHtcclxuICAgICAgICBsZXQgc3Vic2VxdWVudEFycmF5ID0gYXdhaXQgZXhlY3V0ZVBvcnQoeyBub2RlUG9ydDogbm9kZVBvcnQgfSlcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShhZ2dyZWdhdGlvbkFycmF5LCBzdWJzZXF1ZW50QXJyYXkpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBhZ2dyZWdhdGlvbkFycmF5XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhlY3V0ZSBub2RlIHBvcnQgd2l0aCByZWxldmFudCBpbXBsZW1lbnRhdGlvbiAtIENhbGwgY29ycmVjdCBleGVjdXRpb24gdHlwZSBtZXRob2QgYWNjb3JkaW5nIHRvIGBub2RlIHBvcnRgIHNldHRpbmdzXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGV4ZWN1dGVQb3J0KHsgbm9kZVBvcnQsIG5vZGVJbnN0YW5jZSA9IHRoaXNBcmcsIGl0ZXJhdGVDb25uZWN0aW9uID0gc2VsZi5pdGVyYXRlQ29ubmVjdGlvbiwgZXhlY3V0aW9uVHlwZUFycmF5IH0pIHtcclxuICAgICAgLy8gZmlsdGVyIGNvbm5lY3Rpb24gdG8gbWF0Y2ggdGhlIGN1cnJlbnQgcG9ydFxyXG4gICAgICBsZXQgY3VycmVudFBvcnRDb25uZWN0aW9uQXJyYXkgPSBub2RlSW5zdGFuY2UuY29ubmVjdGlvbi5maWx0ZXIoaXRlbSA9PiBpdGVtLnNvdXJjZS5wb3J0S2V5ID09IG5vZGVQb3J0LmtleSlcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCBpdGVyYXRlQ29ubmVjdGlvbih7IG5vZGVDb25uZWN0aW9uQXJyYXk6IGN1cnJlbnRQb3J0Q29ubmVjdGlvbkFycmF5LCBpbXBsZW1lbnRhdGlvblR5cGU6IG5vZGVQb3J0LnRhZyAmJiBub2RlUG9ydC50YWcuaXRlcmF0ZUNvbm5lY3Rpb25JbXBsZW1lbnRhdGlvbiB9KVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIExvb3BzIHRocm91Z2ggbm9kZSBjb25uZWN0aW9uIHRvIHRyYXZlcnNlIHRoZSBjb25uZWN0ZWQgbm9kZXMnIGdyYXBoc1xyXG4gICAgICogQHBhcmFtIHsqfSBub2RlQ29ubmVjdGlvbkFycmF5IC0gYXJyYXkgb2YgY29ubmVjdGlvbiBmb3IgdGhlIHBhcnRpY3VsYXIgbm9kZVxyXG4gICAgICovXHJcbiAgICBhc3luYyBpdGVyYXRlQ29ubmVjdGlvbih7XHJcbiAgICAgIG5vZGVDb25uZWN0aW9uQXJyYXkgPSB0aGlzQXJnLmNvbm5lY3Rpb24gfHwgW10sXHJcbiAgICAgIGV4ZWN1dGVDb25uZWN0aW9uID0gc2VsZi5leGVjdXRlQ29ubmVjdGlvbixcclxuICAgICAgaW1wbGVtZW50YXRpb25UeXBlID0gdGhpc0FyZy50YWcgJiYgdGhpc0FyZy50YWcuaXRlcmF0ZUNvbm5lY3Rpb25JbXBsZW1lbnRhdGlvbixcclxuICAgICAgYWdncmVnYXRpb25BcnJheSA9IFtdLFxyXG4gICAgfSA9IHt9KSB7XHJcbiAgICAgIC8vIGZpbHRlciBjb25uZWN0aW9uIGFycmF5IHRvIG1hdGNoIG91dGdvaW5nIGNvbm5lY3Rpb25zIG9ubHlcclxuICAgICAgbm9kZUNvbm5lY3Rpb25BcnJheSA9IG5vZGVDb25uZWN0aW9uQXJyYXkuZmlsdGVyKGl0ZW0gPT4gaXRlbS50YWcuZGlyZWN0aW9uID09ICdvdXRnb2luZycpXHJcblxyXG4gICAgICAvLyBzb3J0IGNvbm5lY3Rpb24gYXJyYXlcclxuICAgICAgZnVuY3Rpb24gc29ydEFjY29yZGluZ1RvT3JkZXIoZm9ybWVyLCBsYXR0ZXIpIHtcclxuICAgICAgICByZXR1cm4gZm9ybWVyLnNvdXJjZS5wb3NpdGlvbi5vcmRlciAtIGxhdHRlci5zb3VyY2UucG9zaXRpb24ub3JkZXJcclxuICAgICAgfSAvLyB1c2luZyBgb3JkZXJgIHByb3BlcnR5XHJcbiAgICAgIG5vZGVDb25uZWN0aW9uQXJyYXkuc29ydChzb3J0QWNjb3JkaW5nVG9PcmRlcilcclxuXHJcbiAgICAgIGxldCBpbXBsZW1lbnRhdGlvbk9iamVjdCA9IHtcclxuICAgICAgICAvLyBpbXBsZW1lbnRhdGlvbiB1c2luZyBwbGFpbiBcImZvciBsb29wc1wiIHdoaWNoIHdhaXQgZm9yIGFzeW5jIGZ1bmN0aW9uXHJcbiAgICAgICAgYXN5bmMgc2ltcGxlQ2hyb25vbG9naWNhbCgpIHtcclxuICAgICAgICAgIGZvciAobGV0IG5vZGVDb25uZWN0aW9uIG9mIG5vZGVDb25uZWN0aW9uQXJyYXkpIHtcclxuICAgICAgICAgICAgbGV0IHN1YnNlcXVlbnRBcnJheSA9IGF3YWl0IGV4ZWN1dGVDb25uZWN0aW9uKHsgbm9kZUNvbm5lY3Rpb24gfSlcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoYWdncmVnYXRpb25BcnJheSwgc3Vic2VxdWVudEFycmF5KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYWdncmVnYXRpb25BcnJheSA9IGFnZ3JlZ2F0aW9uQXJyYXkuZmlsdGVyKGl0ZW0gPT4gaXRlbSkgLy8gcmVtb3ZlIG51bGwgcmVzdWx0cywgd2hlcmUgbmVzdGVkIHVuaXQgaXMgbm90IGV4ZWN1dGVkIChpLmUuIGZpZWxkcyBhcmUgbm90IG1lbnRpb25lZCBpIG50aGUgcmVxdWVzdC4pXHJcbiAgICAgICAgICByZXR1cm4gYWdncmVnYXRpb25BcnJheVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gaW1wbGVtZW50YXRpb24gdXNpbmcgYXJyYXkucmVkdWNlIHRvIHNlcXVlbnRpYWxseSBhY2N1bW9sYXRlIHZhbHVlcyBmcm9tIGBhc3luYyBmdW5jdGlvbnNgLlxyXG4gICAgICAgIGFzeW5jIGNocm9ub2xvZ2ljYWwoKSB7XHJcbiAgICAgICAgICBsZXQgYXJyYXkgPSBhd2FpdCBub2RlQ29ubmVjdGlvbkFycmF5LnJlZHVjZShhc3luYyAoYWNjdW11bGF0b3JQcm9taXNlLCBub2RlQ29ubmVjdGlvbiwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgLy8gc2VxdWVudGlhbCBhY2N1bW9sYXRpb24gb2YgcmVzdWx0c1xyXG4gICAgICAgICAgICBsZXQgYWNjdW11bGF0b3JBcnJheSA9IGF3YWl0IGFjY3VtdWxhdG9yUHJvbWlzZVxyXG4gICAgICAgICAgICBsZXQgc3Vic2VxdWVudFJlc3VsdCA9IGF3YWl0IGV4ZWN1dGVDb25uZWN0aW9uKHsgbm9kZUNvbm5lY3Rpb24gfSlcclxuXHJcbiAgICAgICAgICAgIC8vIHN1YnNlcXVlbnRSZXN1bHQgY2FuIGJlIGFuIGFycmF5IG9yIHNpbmdsZSBpdGVtXHJcbiAgICAgICAgICAgIGxldCBzdWJzZXF1ZW50QXJyYXkgPSBBcnJheS5pc0FycmF5KHN1YnNlcXVlbnRSZXN1bHQpID8gc3Vic2VxdWVudFJlc3VsdCA6IFtzdWJzZXF1ZW50UmVzdWx0XSAvLyBjaGFuZ2UgdG8gYXJyYXkgaWYgbm90XHJcblxyXG4gICAgICAgICAgICAvLyBjb2NhdGluYXRlIGFycmF5c1xyXG4gICAgICAgICAgICBhY2N1bXVsYXRvckFycmF5Lmxlbmd0aCAhPSAwID8gQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoYWNjdW11bGF0b3JBcnJheSwgc3Vic2VxdWVudEFycmF5KSA6IChhY2N1bXVsYXRvckFycmF5ID0gc3Vic2VxdWVudEFycmF5LnNsaWNlKCkpIC8vIHByZXZlbnRzIGVycm9yIHdoZW4gYWNjdWxhdG9yIGlzIG5vdCBhbiBhcnJheS5cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvckFycmF5XHJcbiAgICAgICAgICB9LCBQcm9taXNlLnJlc29sdmUoW10pKVxyXG4gICAgICAgICAgcmV0dXJuIGFycmF5XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJbnN1cmVzIGFsbCBub2RlQ29ubmVjdGlvbiBwcm9taXNlcyByZXNvbHZlcy5cclxuICAgICAgICAgKiBQcmVzZXJ2ZXMgdGhlIG9yZGVyIG9mIG5vZGVzIG9yaWdpbmFsIGluIGNvbm5lY3Rpb24gYXJyYXksIGkuZS4gZG9lcyBub3Qgb3JkZXIgdGhlIG5vZGUgcmVzdWx0cyBhY2NvcmRpbmcgdG8gdGhlIGV4ZWN1dGlvbiBjb21wbGV0aW9uLCByYXRoZXIgYWNjb3JkaW5nIHRvIHRoZSBmaXJzdCB2aXNpdGVkIGR1cmluZyB0cmF2ZXJzYWwuXHJcbiAgICAgICAgICoqL1xyXG5cclxuICAgICAgICBhc3luYyBhbGxQcm9taXNlKCkge1xyXG4gICAgICAgICAgbGV0IG5vZGVQcm9taXNlQXJyYXkgPSBbXVxyXG4gICAgICAgICAgbm9kZVByb21pc2VBcnJheSA9IG5vZGVDb25uZWN0aW9uQXJyYXkubWFwKG5vZGVDb25uZWN0aW9uID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZXhlY3V0ZUNvbm5lY3Rpb24oeyBub2RlQ29ubmVjdGlvbiB9KVxyXG4gICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICBsZXQgbm9kZVJlc29sdmVkUmVzdWx0QXJyYXkgPSBhd2FpdCBQcm9taXNlLmFsbChub2RlUHJvbWlzZUFycmF5KS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5TWk5fREVCVUcgPT0gJ3RydWUnKSBjb25zb2xlLmVycm9yKGDwn5SA4pqg77iPIFxcYFByb21pc2UuYWxsXFxgIGZvciBub2RlQ29ubmVjdGlvbkFycmF5IHJlamVjdGVkIGJlY2F1c2U6ICR7ZXJyb3J9YClcclxuICAgICAgICAgICAgZWxzZSBjb25zb2xlLmxvZyhlcnJvcilcclxuICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgbGV0IGFycmF5ID0gbm9kZVJlc29sdmVkUmVzdWx0QXJyYXlcclxuICAgICAgICAgICAgLnJlZHVjZSgoYWNjdW11bGF0b3JBcnJheSwgbm9kZVJlc3VsdCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICBsZXQgc3Vic2VxdWVudEFycmF5ID0gQXJyYXkuaXNBcnJheShub2RlUmVzdWx0KSA/IG5vZGVSZXN1bHQgOiBbbm9kZVJlc3VsdF1cclxuXHJcbiAgICAgICAgICAgICAgLy8gY29jYXRpbmF0ZSBhcnJheXNcclxuICAgICAgICAgICAgICBhY2N1bXVsYXRvckFycmF5Lmxlbmd0aCAhPSAwID8gQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoYWNjdW11bGF0b3JBcnJheSwgc3Vic2VxdWVudEFycmF5KSA6IChhY2N1bXVsYXRvckFycmF5ID0gc3Vic2VxdWVudEFycmF5LnNsaWNlKCkpIC8vIHByZXZlbnRzIGVycm9yIHdoZW4gYWNjdWxhdG9yIGlzIG5vdCBhbiBhcnJheS5cclxuXHJcbiAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yQXJyYXlcclxuICAgICAgICAgICAgfSwgW10pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoaXRlbSA9PiBpdGVtKSAvLyByZW1vdmUgbnVsbCByZXN1bHRzLCB3aGVyZSBuZXN0ZWQgdW5pdCBpcyBub3QgZXhlY3V0ZWQgKGkuZS4gZmllbGRzIGFyZSBub3QgbWVudGlvbmVkIGkgbnRoZSByZXF1ZXN0LilcclxuICAgICAgICAgIHJldHVybiBhcnJheVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmFjZSBwcm9taXNlIG9mIG5vZGVzIC0gZmlyc3QgdG8gcmVzb2x2ZSBpcyB0aGUgb25lIHRvIGJlIHJldHVybmVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYXN5bmMgcmFjZUZpcnN0UHJvbWlzZSgpIHtcclxuICAgICAgICAgIGxldCBub2RlUHJvbWlzZUFycmF5ID0gW11cclxuICAgICAgICAgIG5vZGVQcm9taXNlQXJyYXkgPSBub2RlQ29ubmVjdGlvbkFycmF5Lm1hcChub2RlQ29ubmVjdGlvbiA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBleGVjdXRlQ29ubmVjdGlvbih7IG5vZGVDb25uZWN0aW9uIH0pXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdClcclxuICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgbGV0IG5vZGVSZXNvbHZlZFJlc3VsdCA9IGF3YWl0IHByb21pc2VQcm9wZXJSYWNlKG5vZGVQcm9taXNlQXJyYXkpXHJcbiAgICAgICAgICAgIC50aGVuKHJlc29sdmVkUHJvbWlzZUFycmF5ID0+IHtcclxuICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZWRQcm9taXNlQXJyYXlbMF0gLy8gYXMgb25seSBvbmUgcHJvbWlzZSBpcyByZXR1cm4gaW4gdGhlIGFycmF5IC0gdGhlIGZpcnN0IHByb21pc2UgdG8gYmUgcmVzb2x2ZWQuXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52LlNaTl9ERUJVRyA9PSAndHJ1ZScpIGNvbnNvbGUuZXJyb3IoYPCflIDimqDvuI8gcHJvbWlzZVByb3BlclJhY2UgcmVqZWN0ZWQgYmVjYXVzZTogJHtlcnJvcn1gKVxyXG4gICAgICAgICAgICAgIGVsc2UgY29uc29sZS5sb2coYPCflIDimqDvuI8gcHJvbWlzZVByb3BlclJhY2UgcmVqZWN0ZWQgYmVjYXVzZTogJHtlcnJvcn1gKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgcmV0dXJuIG5vZGVSZXNvbHZlZFJlc3VsdCA/IG5vZGVSZXNvbHZlZFJlc3VsdCA6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gcmV0cmVpdmUgbWF0Y2hpbmcgaW1wbGVtZW50YXRpb24gdG8gZXhlY3V0ZS5cclxuICAgICAgbGV0IGNhbGxiYWNrXHJcbiAgICAgIGZvciAobGV0IGluZGV4IGluIGltcGxlbWVudGF0aW9uT2JqZWN0KSB7XHJcbiAgICAgICAgaWYgKGluZGV4ID09IGltcGxlbWVudGF0aW9uVHlwZSkge1xyXG4gICAgICAgICAgY2FsbGJhY2sgPSBpbXBsZW1lbnRhdGlvbk9iamVjdFtpbmRleF1cclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vIHNldCBmYWxsYmFjayB2YWx1ZSBmb3IgY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgICAgLy8gaW4gY2FzZSBgaW1wbGVtZW50YXRpb25UeXBlYCBleGlzdCwgaS5lLiB3YXMgbm90IGZvdW5kIGluIHRoZSByZWdpc3RlcmVkIGltcGxlbWVuYXRpb24gYXJyYXkuXHJcbiAgICAgIGlmICghY2FsbGJhY2sgJiYgaW1wbGVtZW50YXRpb25UeXBlKSBjb25zb2xlLmVycm9yKGDigKIgbm8gaW1wbGVtZW50YXRpb24gZm91bmQgZm9yIFwiJHtpbXBsZW1lbnRhdGlvblR5cGV9XCIsIG5vZGUgY29ubmVjdGlvbiBpdGVyYXRpb24gc3RvcHBlZC5gKVxyXG4gICAgICAvLyBkZWZhdWx0IGltcGxlbWVudGF0aW9uXHJcbiAgICAgIGVsc2UgaWYgKCFjYWxsYmFjaykgY2FsbGJhY2sgPSBpbXBsZW1lbnRhdGlvbk9iamVjdFsnc2ltcGxlQ2hyb25vbG9naWNhbCddXHJcblxyXG4gICAgICAvLyBleGVjdXRlIGltcGxlbWVudGF0aW9uXHJcbiAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhlY3V0ZSBub2RlIGNvbm5lY3Rpb24gaW1wbGVtZW50YXRpb25cclxuICAgICAqL1xyXG4gICAgYXN5bmMgZXhlY3V0ZUNvbm5lY3Rpb24oeyBub2RlQ29ubmVjdGlvbiwgaXRlcmF0ZURlc3RpbmF0aW9uTm9kZSA9IHNlbGYuaXRlcmF0ZURlc3RpbmF0aW9uTm9kZSB9KSB7XHJcbiAgICAgIHJldHVybiBhd2FpdCBpdGVyYXRlRGVzdGluYXRpb25Ob2RlKHsgY29ubmVjdGlvbkRlc3RpbmF0aW9uTm9kZUFycmF5OiBub2RlQ29ubmVjdGlvbi5kZXN0aW5hdGlvbi5ub2RlIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTG9vcCB0aHJvdWdoIGNvbm5lY3RlZCBub2Rlc1xyXG4gICAgICovXHJcbiAgICBhc3luYyBpdGVyYXRlRGVzdGluYXRpb25Ob2RlKHsgY29ubmVjdGlvbkRlc3RpbmF0aW9uTm9kZUFycmF5LCBleGVjdXRlRGVzdGluYXRpb25Ob2RlID0gc2VsZi5leGVjdXRlRGVzdGluYXRpb25Ob2RlLCBhZ2dyZWdhdGlvbkFycmF5ID0gW10gfSA9IHt9KSB7XHJcbiAgICAgIC8vIGl0ZXJhdGlvbiBpbXBsZW1lbnRhaXRvblxyXG4gICAgICBmb3IgKGxldCBkZXN0aW5hdGlvbk5vZGUgb2YgY29ubmVjdGlvbkRlc3RpbmF0aW9uTm9kZUFycmF5KSB7XHJcbiAgICAgICAgbGV0IHN1YnNlcXVlbnRBcnJheSA9IGF3YWl0IGV4ZWN1dGVEZXN0aW5hdGlvbk5vZGUoeyBkZXN0aW5hdGlvbk5vZGVLZXk6IGRlc3RpbmF0aW9uTm9kZS5rZXkgfSlcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShhZ2dyZWdhdGlvbkFycmF5LCBzdWJzZXF1ZW50QXJyYXkpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGFnZ3JlZ2F0aW9uQXJyYXlcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlIGNvbm5lY3Rpb24gZGVzdGluYXRpb24gbm9kZSBpbXBsZW1lbnRhdGlvblxyXG4gICAgICovXHJcbiAgICBhc3luYyBleGVjdXRlRGVzdGluYXRpb25Ob2RlKHsgZGVzdGluYXRpb25Ob2RlS2V5LCBjb250cm9sbGVyID0gdGhpc0FyZy5jb250ZXh0SW5zdGFuY2UgfSkge1xyXG4gICAgICByZXR1cm4gYXdhaXQgY29udHJvbGxlci50cmF2ZXJzZUdyYXBoKHsgbm9kZUtleTogZGVzdGluYXRpb25Ob2RlS2V5IH0pXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIGZpbHRlcnMgJiBtb2RpZmllcyBhcnJheSBieSByZW1vdmluZyB0cnV0aHkgaW5kZXhlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge2FueX0ge2luc2VydGlvblBvaW50S2V5LCBpbnNlcnRpb25QYXRoID0gbnVsbH1cclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGZpbHRlckFuZE9yZGVyQ2hpbGRyZW4oeyBpbnNlcnRpb25Qb2ludEtleSwgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuIH0pIHtcclxuICAgICAgbGV0IG93bkZpbHRlcmVkQ2hpbGRyZW4gPSBhd2FpdCB0aGlzLmZpbHRlckFuZE1vZGlmeUNoaWxkcmVuQXJyYXkoY2hpbGRyZW4sIGluc2VydGlvblBvaW50S2V5LCBudWxsKVxyXG4gICAgICBsZXQgYWRkaXRpb25hbEZpbHRlcmVkQ2hpbGRyZW4gPSBhd2FpdCB0aGlzLmZpbHRlckFuZE1vZGlmeUNoaWxkcmVuQXJyYXkodGhpcy5hZGRpdGlvbmFsQ2hpbGROZXN0ZWRVbml0LCBpbnNlcnRpb25Qb2ludEtleSwgdGhpcy5wYXRoUG9pbnRlcktleSlcclxuICAgICAgbGV0IG1lcmdlZCA9IGF3YWl0IHRoaXMubWVyZ2VBbmRPcmRlckNoaWxkcmVuKG93bkZpbHRlcmVkQ2hpbGRyZW4sIGFkZGl0aW9uYWxGaWx0ZXJlZENoaWxkcmVuKVxyXG4gICAgICByZXR1cm4gbWVyZ2VkXHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgY2hpbGRyZW4gY29ycmVzcG9uZGluZyB0byB0aGUgY3VycmVudCBpbnNlcnRpb24gcG9pbnQuXHJcbiAgICAgKiAvLyBUYWtlIGludG8gY29uc2lkZXJhdGlvbiB0aGUgaW5kaXJlY3QgY2hpbGRyZW4gYWRkZWQgZnJvbSBwcmV2aW91cyAoaW5oZXJldGVkKSB0cmVlcy5cclxuICAgICAqIC8vIGZpbHRlcmVkVHJlZUNoaWxkcmVuICsgaW1tZWRpYXRlTmV4dENoaWxkcmVuXHJcbiAgICAgKiAvLyBsZXQgbmV4dENoaWxkcmVuO1xyXG4gICAgICovXHJcbiAgICBhc3luYyBmaWx0ZXJBbmRNb2RpZnlDaGlsZHJlbkFycmF5KGNoaWxkcmVuLCBpbnNlcnRpb25Qb2ludEtleSwgcGF0aFBvaW50ZXJLZXkpIHtcclxuICAgICAgcmV0dXJuIGNoaWxkcmVuLmZpbHRlcigoY2hpbGQsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgLy8gZmlsdGVyIGNoaWxkcmVuIHRoYXQgY29ycmVzcG9udCB0byB0aGUgY3VycmVudCBpbnNlcnRpb25wb2ludC5cclxuICAgICAgICBsZXQgcmVzdWx0ID0gY2hpbGQuaW5zZXJ0aW9uUG9zaXRpb24uaW5zZXJ0aW9uUG9pbnQgPT0gaW5zZXJ0aW9uUG9pbnRLZXkgJiYgY2hpbGQuaW5zZXJ0aW9uUG9zaXRpb24uaW5zZXJ0aW9uUGF0aFBvaW50ZXIgPT0gcGF0aFBvaW50ZXJLZXlcclxuICAgICAgICAvLyBpZiAocmVzdWx0KSBjaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpOyAvLyB3YXMgbWVudCB0byBpbmNyZWFzZSB0aGUgcGVyZm9ybWFuY2Ugb2YgdGhlIHByb2dyYW0sIHByZXZlbnRpbmcgcmVjaGVja2luZyBvZiBhbHJlYWR5IGNoZWNrZWQgYXJyYXkgaXRlbXMuIEJ1dCBpdCBjYXVzZXMgc29tZSBpc3N1ZXMuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIC8vIG9yZGVyIGFkZGl0aW9uYWwgY2hpbGRyZW4gdGhhdCB3aWxsIGJlIG1peGVkIGludG8gb3duQ2hpbGRyZW4uIEFjY29yZGluZyB0byBhIHNldHRpbmcgdGhhdCBuZWVkcyB0byBiZSBhZGRlZCBpbnRvIGVhY2ggY2hpbGQgb2JqZWN0LlxyXG4gICAgYXN5bmMgbWVyZ2VBbmRPcmRlckNoaWxkcmVuKG93bkZpbHRlcmVkQ2hpbGRyZW4sIGFkZGl0aW9uYWxGaWx0ZXJlZENoaWxkcmVuKSB7XHJcbiAgICAgIC8vIG1ldHJnZSAyIGFycmF5cy4sIGFwcGVuZGluZyBvbmUgdG8gdGhlIG90aGVyLlxyXG4gICAgICAvLyBsZXQgZmlsdGVyZWRDaGlsZHJlbiA9IFtdXHJcbiAgICAgIC8vIGF3YWl0IEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGZpbHRlcmVkQ2hpbGRyZW4sIG93bkZpbHRlcmVkQ2hpbGRyZW4sIGFkZGl0aW9uYWxGaWx0ZXJlZENoaWxkcmVuKTtcclxuICAgICAgbGV0IGZpcnN0Q2hpbGRyZW4gPSBbXSxcclxuICAgICAgICBsYXN0Q2hpbGRyZW4gPSBbXSxcclxuICAgICAgICBvcmRlcmVkQ2hpbGRyZW4gPSBbXVxyXG4gICAgICBhd2FpdCBhZGRpdGlvbmFsRmlsdGVyZWRDaGlsZHJlbi5zb3J0KChwcmlvciwgc3Vic2VxdWVudCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBwcmlvci5vcmRlciA8PSBzdWJzZXF1ZW50Lm9yZGVyID8gMSA6IC0xXHJcbiAgICAgIH0pXHJcbiAgICAgIGF3YWl0IG93bkZpbHRlcmVkQ2hpbGRyZW4uc29ydCgocHJpb3IsIHN1YnNlcXVlbnQpID0+IHtcclxuICAgICAgICByZXR1cm4gcHJpb3Iub3JkZXIgPD0gc3Vic2VxdWVudC5vcmRlciA/IDEgOiAtMVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgLy8gZmlsdGVyIGNoaWxkcmVuIHRoYXQgY29ycmVzcG9udCB0byB0aGUgY3VycmVudCBpbnNlcnRpb25wb2ludC5cclxuICAgICAgYWRkaXRpb25hbEZpbHRlcmVkQ2hpbGRyZW4gPSBhZGRpdGlvbmFsRmlsdGVyZWRDaGlsZHJlbi5maWx0ZXIoKGNoaWxkLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIC8vIGRlZmF1bHQgZmFsbGJhY2sgaXMgdG8gYWRkIHRoZSBjaGlsZCB0byB0aGUgYmVnaW5uaW5nL2VuZCBvZiB0aGUgYXJyYXksIGluIGNhc2Ugbm8gcGF0aFBvaW50ZXJLZXkgaXMgc3BlY2lmaWVkIChwYXRoUG9pbnRlcktleSBkZWNpZGVzIHdoaWNoIG5vZGUgdG8gcGxhY2UgdGhlIGNoaWxkIHJlbGF0aXZlIHRvKS5cclxuICAgICAgICBpZiAoIWNoaWxkLmluc2VydGlvblBvc2l0aW9uLnBsYWNlbWVudC5wYXRoUG9pbnRlciAmJiBjaGlsZC5pbnNlcnRpb25Qb3NpdGlvbi5wbGFjZW1lbnQudHlwZSkge1xyXG4gICAgICAgICAgc3dpdGNoIChjaGlsZC5pbnNlcnRpb25Qb3NpdGlvbi5wbGFjZW1lbnQudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdiZWZvcmUnOlxyXG4gICAgICAgICAgICAgIGZpcnN0Q2hpbGRyZW4ucHVzaChjaGlsZClcclxuICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdhZnRlcic6XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgbGFzdENoaWxkcmVuLnB1c2goY2hpbGQpXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgICAgLy8gYWRkaXRpb25hbEZpbHRlcmVkQ2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgfSlcclxuXHJcbiAgICAgIC8vIGluc2VydCBhZGRpdGlvbmFsIGNoaWxkIGlmIGl0IG1hdGNoZXMgY3VycmVudCBjaGlsZCBwYXRoIHBvaW50ZXIga2V5LlxyXG4gICAgICBvd25GaWx0ZXJlZENoaWxkcmVuLm1hcCgob3duQ2hpbGQsIG93bkNoaWxkSW5kZXgpID0+IHtcclxuICAgICAgICBvcmRlcmVkQ2hpbGRyZW4ucHVzaChvd25DaGlsZCkgLy8gYWRkIGNoaWxkIHRvIG9yZGVyZWQgYXJyYXlcclxuICAgICAgICBsZXQgY3VycmVudENoaWxkUG9zaXRpb24gPSBvcmRlcmVkQ2hpbGRyZW4ubGVuZ3RoIC0gMSAvLyBsYXN0IGFycmF5IGl0ZW0gaW5kZXguXHJcbiAgICAgICAgYWRkaXRpb25hbEZpbHRlcmVkQ2hpbGRyZW4ubWFwKChhZGRpdGlvbmFsQ2hpbGQsIGFkZGl0aW9uYWxDaGlsZEluZGV4KSA9PiB7XHJcbiAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIGFkZGl0aW9uYWxDaGlsZC5pbnNlcnRpb25Qb3NpdGlvbi5wbGFjZW1lbnQudHlwZSAmJlxyXG4gICAgICAgICAgICBhZGRpdGlvbmFsQ2hpbGQuaW5zZXJ0aW9uUG9zaXRpb24ucGxhY2VtZW50LnBhdGhQb2ludGVyICYmXHJcbiAgICAgICAgICAgIGFkZGl0aW9uYWxDaGlsZC5pbnNlcnRpb25Qb3NpdGlvbi5wbGFjZW1lbnQucGF0aFBvaW50ZXIgPT0gb3duQ2hpbGQucGF0aFBvaW50ZXJLZXlcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGFkZGl0aW9uYWxDaGlsZC5pbnNlcnRpb25Qb3NpdGlvbi5wbGFjZW1lbnQudHlwZSkge1xyXG4gICAgICAgICAgICAgIGNhc2UgJ2JlZm9yZSc6XHJcbiAgICAgICAgICAgICAgICBvcmRlcmVkQ2hpbGRyZW4uc3BsaWNlKGN1cnJlbnRDaGlsZFBvc2l0aW9uLCAwLCBhZGRpdGlvbmFsQ2hpbGQpIC8vIGluc2VydCBiZWZvcmUgY3VycmVudFBvc2l0aW9uXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgIGNhc2UgJ2FmdGVyJzpcclxuICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgb3JkZXJlZENoaWxkcmVuLnNwbGljZShjdXJyZW50Q2hpbGRQb3NpdGlvbiArIDEsIDAsIGFkZGl0aW9uYWxDaGlsZCkgLy8gaW5zZXJ0IGFmdGVyIGN1cnJlbnRQb3NpdGlvbi5cclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQoZmlyc3RDaGlsZHJlbiwgb3JkZXJlZENoaWxkcmVuLCBsYXN0Q2hpbGRyZW4pXHJcbiAgICB9LFxyXG5cclxuICAgIGFzeW5jIGFkZEFkZGl0aW9uYWxDaGlsZE5lc3RlZFVuaXQoeyBuZXN0ZWRVbml0IH0pIHtcclxuICAgICAgLy8gQWRkIHRoZSByZXN0IG9mIHRoZSBpbW1lZGlhdGUgY2hpbGRyZW4gdG8gdGhlIG5leHQgdHJlZSBhcyBhZGRpdGlvbmFsIGNoaWxkcmVuLiBwcm9wYWdhdGUgY2hpbGRyZW4gdG8gdGhlIG5leHQgdHJlZS5cclxuICAgICAgaWYgKG5lc3RlZFVuaXQuY2hpbGRyZW4ubGVuZ3RoICE9IDApIHtcclxuICAgICAgICBhd2FpdCBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShuZXN0ZWRVbml0LmNoaWxkcmVuLCBuZXN0ZWRVbml0LmFkZGl0aW9uYWxDaGlsZE5lc3RlZFVuaXQpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbmVzdGVkVW5pdC5jaGlsZHJlbiA9IGF3YWl0IG5lc3RlZFVuaXQuYWRkaXRpb25hbENoaWxkTmVzdGVkVW5pdC5zbGljZSgpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfVxyXG5cclxuICBPYmplY3Qua2V5cyhzZWxmKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xyXG4gICAgc2VsZltrZXldID0gc2VsZltrZXldLmJpbmQodGhpc0FyZylcclxuICB9LCB7fSlcclxuICByZXR1cm4gc2VsZlxyXG59XHJcbiJdfQ==