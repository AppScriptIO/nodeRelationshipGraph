"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.handlePropagation = void 0;var _skipFirstGeneratorNext2 = _interopRequireDefault(require("@babel/runtime/helpers/skipFirstGeneratorNext"));let _original_handlePropagation = async function*




handlePropagation({ nodeIteratorFeed, implementation, graphInstance = this }) {let _functionSent = yield;
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
},_modified_handlePropagation = (0, _skipFirstGeneratorNext2.default)(_original_handlePropagation);let handlePropagation = new Proxy(_original_handlePropagation, { apply(target, thisArgument, argumentsList) {return Reflect.apply(_modified_handlePropagation, thisArgument, argumentsList);} });exports.handlePropagation = handlePropagation;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NvdXJjZS9jb25zdHJ1Y3RhYmxlL0dyYXBoL21ldGhvZC9oYW5kbGVQcm9wYWdhdGlvbi5qcyJdLCJuYW1lcyI6WyJoYW5kbGVQcm9wYWdhdGlvbiIsIm5vZGVJdGVyYXRvckZlZWQiLCJpbXBsZW1lbnRhdGlvbiIsImdyYXBoSW5zdGFuY2UiLCJldmVudEVtaXR0ZXJDYWxsYmFjayIsImVtaXQiLCJ0cmF2ZXJzYWxJdGVyYXRvckZlZWQiLCJ0cmFwQXN5bmNJdGVyYXRvciIsIml0ZXJhdG9yIiwiaXRlcmF0b3JSZXN1bHQiLCJuZXh0IiwiZG9uZSIsInRyYXZlcnNhbENvbmZpZyIsInZhbHVlIiwicHJvbWlzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFLdUJBLGlCLENBQWtCLEVBQUVDLGdCQUFGLEVBQW9CQyxjQUFwQixFQUF3R0MsYUFBYSxHQUFHLElBQXhILEUsRUFBZ0k7QUFDdkssTUFBSSxFQUFFQyxvQkFBb0IsRUFBRUMsSUFBeEIsa0JBQUo7QUFDQSxNQUFJQyxxQkFBcUIsR0FBR0osY0FBYyxDQUFDLEVBQUVELGdCQUFGLEVBQW9CSSxJQUFwQixFQUFELENBQTFDLENBRnVLO0FBR3ZKRSxFQUFBQSxpQkFIdUosQ0FHcklDLFFBSHFJLEVBRzNIO0FBQzFDLFFBQUlDLGNBQWMsR0FBRyxNQUFNRCxRQUFRLENBQUNFLElBQVQsRUFBM0I7QUFDQSxXQUFPLENBQUNELGNBQWMsQ0FBQ0UsSUFBdkIsRUFBNkI7QUFDM0IsVUFBSUMsZUFBZSxHQUFHSCxjQUFjLENBQUNJLEtBQXJDO0FBQ0EsNkJBQU1ELGVBQU47QUFDQSxVQUFJLEVBQUVFLE9BQUYsbUJBQUo7QUFDQUwsTUFBQUEsY0FBYyxHQUFHLE1BQU1ELFFBQVEsQ0FBQ0UsSUFBVCxDQUFjLEVBQUVJLE9BQUYsRUFBZCxDQUF2QjtBQUNEO0FBQ0QsV0FBT0wsY0FBYyxDQUFDSSxLQUF0QjtBQUNELEdBWnNLLHNHQUd2Sk4saUJBSHVKLENBR3ZKQSxpQkFIdUo7QUFhdksseUJBQU8sT0FBT0EsaUJBQWlCLENBQUNELHFCQUFELENBQS9CO0FBQ0QsQyxzR0Fkc0JOLGlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBIYW5kbGVzIHRoZSBncmFwaCB0cmF2ZXJzYWwgcHJvcGFnYXRpb24gb3JkZXJcbiAqIEB5aWVsZHMgYSB0cmF2ZXJzYWwgY29uZmlndXJhdGlvbiBmZWVkL2l0ZXJhdG9yXG4gKiBAcmV0dXJuIHJlc3VsdHMgYXJyYXlcbiAqKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiogaGFuZGxlUHJvcGFnYXRpb24oeyBub2RlSXRlcmF0b3JGZWVkLCBpbXBsZW1lbnRhdGlvbiAvKiogQ29udHJvbHMgdGhlIGl0ZXJhdGlvbiBvdmVyIG5vZGVzIGFuZCBleGVjdXRpb24gYXJyYW5nZW1lbnQuICovLCBncmFwaEluc3RhbmNlID0gdGhpcyB9KSB7XG4gIGxldCB7IGV2ZW50RW1pdHRlckNhbGxiYWNrOiBlbWl0IH0gPSBmdW5jdGlvbi5zZW50XG4gIGxldCB0cmF2ZXJzYWxJdGVyYXRvckZlZWQgPSBpbXBsZW1lbnRhdGlvbih7IG5vZGVJdGVyYXRvckZlZWQsIGVtaXQgfSkgLy8gcGFzcyBpdGVyYXRvciB0byBpbXBsZW1lbnRhdGlvbiBhbmQgcHJvcGFnYXRlIGJhY2sgKHRocm91Z2ggcmV0dXJuIHN0YXRlbWVudCkgdGhlIHJlc3VsdHMgb2YgdGhlIG5vZGUgcHJvbWlzZXMgYWZ0ZXIgY29tcGxldGlvblxuICBhc3luYyBmdW5jdGlvbiogdHJhcEFzeW5jSXRlcmF0b3IoaXRlcmF0b3IpIHtcbiAgICBsZXQgaXRlcmF0b3JSZXN1bHQgPSBhd2FpdCBpdGVyYXRvci5uZXh0KClcbiAgICB3aGlsZSAoIWl0ZXJhdG9yUmVzdWx0LmRvbmUpIHtcbiAgICAgIGxldCB0cmF2ZXJzYWxDb25maWcgPSBpdGVyYXRvclJlc3VsdC52YWx1ZVxuICAgICAgeWllbGQgdHJhdmVyc2FsQ29uZmlnXG4gICAgICBsZXQgeyBwcm9taXNlIH0gPSBmdW5jdGlvbi5zZW50XG4gICAgICBpdGVyYXRvclJlc3VsdCA9IGF3YWl0IGl0ZXJhdG9yLm5leHQoeyBwcm9taXNlIH0pXG4gICAgfVxuICAgIHJldHVybiBpdGVyYXRvclJlc3VsdC52YWx1ZVxuICB9XG4gIHJldHVybiB5aWVsZCogdHJhcEFzeW5jSXRlcmF0b3IodHJhdmVyc2FsSXRlcmF0b3JGZWVkKVxufVxuIl19