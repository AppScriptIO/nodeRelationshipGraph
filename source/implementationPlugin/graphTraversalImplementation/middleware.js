"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.middleware = middleware;



function middleware({ thisArg }) {

  let self = {};

  Object.keys(self).forEach(function (key) {
    self[key] = self[key].bind(thisArg);
  }, {});
  return self;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NvdXJjZS9pbXBsZW1lbnRhdGlvblBsdWdpbi9ncmFwaFRyYXZlcnNhbEltcGxlbWVudGF0aW9uL21pZGRsZXdhcmUuanMiXSwibmFtZXMiOlsibWlkZGxld2FyZSIsInRoaXNBcmciLCJzZWxmIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJiaW5kIl0sIm1hcHBpbmdzIjoiOzs7O0FBSU8sU0FBU0EsVUFBVCxDQUFvQixFQUFDQyxPQUFELEVBQXBCLEVBQStCOztBQUVsQyxNQUFJQyxJQUFJLEdBQUcsRUFBWDs7QUFFQUMsRUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVlGLElBQVosRUFBa0JHLE9BQWxCLENBQTBCLFVBQVNDLEdBQVQsRUFBYztBQUNwQ0osSUFBQUEsSUFBSSxDQUFDSSxHQUFELENBQUosR0FBWUosSUFBSSxDQUFDSSxHQUFELENBQUosQ0FBVUMsSUFBVixDQUFlTixPQUFmLENBQVo7QUFDSCxHQUZELEVBRUcsRUFGSDtBQUdBLFNBQU9DLElBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDcmVhdGVzIG1pZGRsZXdhcmUgYXJyYXkgZnJvbSBncmFwaFxyXG4gKiBUaGUgZ3JhcGggdHJhdmVyc2FsIEByZXR1cm4ge0FycmF5IG9mIE9iamVjdHN9IHdoZXJlIGVhY2ggb2JqZWN0IGNvbnRhaW5zIGluc3RydWN0aW9uIHNldHRpbmdzIHRvIGJlIHVzZWQgdGhyb3VnaCBhbiBpbXBsZW1lbnRpbmcgbW9kdWxlIHRvIGFkZCB0byBhIGNoYWluIG9mIG1pZGRsZXdhcmVzLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG1pZGRsZXdhcmUoe3RoaXNBcmd9KSB7IC8vIGZ1bmN0aW9uIHdyYXBwZXIgdG8gc2V0IHRoaXNBcmcgb24gaW1wbGVtZW50YWlvbiBvYmplY3QgZnVuY3Rpb25zLlxyXG5cclxuICAgIGxldCBzZWxmID0ge31cclxuICAgIFxyXG4gICAgT2JqZWN0LmtleXMoc2VsZikuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcclxuICAgICAgICBzZWxmW2tleV0gPSBzZWxmW2tleV0uYmluZCh0aGlzQXJnKVxyXG4gICAgfSwge30pXHJcbiAgICByZXR1cm4gc2VsZlxyXG59Il19