"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.NodeFunction = NodeFunction;
var _prototypeChainDebug = require("@dependency/prototypeChainDebug");
var _decoratorUtility = require("@dependency/commonPattern/source/decoratorUtility.js");
var _extendedSubclassPattern = require("@dependency/commonPattern/source/extendedSubclassPattern.js");

function NodeFunction({ Superclass, getDocumentQuery } = {}) {var _dec, _dec2, _dec3, _class;
  let self = (_dec =
  (0, _decoratorUtility.conditional)({ decorator: _prototypeChainDebug.classDecorator, condition: process.env.SZN_DEBUG }), _dec2 =
  (0, _decoratorUtility.execute)({ staticMethod: 'initializeStaticClass', args: [] }), _dec3 =
  _extendedSubclassPattern.extendedSubclassPattern.Subclass(), _dec(_class = _dec2(_class = _dec3(_class = class
  Node extends Superclass {


    static initializeStaticClass(self) {
      self.getDocumentQuery = getDocumentQuery;
    }

    constructor(databaseDocumentKey) {
      super();
      this.key = databaseDocumentKey;
      return this;
    }






















































    async traverseGraph({ implementationType, nodeInstance, additionalChildNode, nodeConnectionKey } = {}) {

      console.log('default traverse Graph executed.');
    }}) || _class) || _class) || _class);


  return self;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9jb25zdHJ1Y3RhYmxlL05vZGUuY2xhc3MuanMiXSwibmFtZXMiOlsiTm9kZUZ1bmN0aW9uIiwiU3VwZXJjbGFzcyIsImdldERvY3VtZW50UXVlcnkiLCJzZWxmIiwiZGVjb3JhdG9yIiwicHJvdG90eXBlQ2hhaW5EZWJ1ZyIsImNvbmRpdGlvbiIsInByb2Nlc3MiLCJlbnYiLCJTWk5fREVCVUciLCJzdGF0aWNNZXRob2QiLCJhcmdzIiwiZXh0ZW5kZWRTdWJjbGFzc1BhdHRlcm4iLCJTdWJjbGFzcyIsIk5vZGUiLCJpbml0aWFsaXplU3RhdGljQ2xhc3MiLCJjb25zdHJ1Y3RvciIsImRhdGFiYXNlRG9jdW1lbnRLZXkiLCJrZXkiLCJ0cmF2ZXJzZUdyYXBoIiwiaW1wbGVtZW50YXRpb25UeXBlIiwibm9kZUluc3RhbmNlIiwiYWRkaXRpb25hbENoaWxkTm9kZSIsIm5vZGVDb25uZWN0aW9uS2V5IiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6IjtBQUNBO0FBQ0E7QUFDQTs7QUFFTyxTQUFTQSxZQUFULENBQXNCLEVBQUVDLFVBQUYsRUFBY0MsZ0JBQWQsS0FBbUMsRUFBekQsRUFBNkQ7QUFDbEUsTUFBSUMsSUFBSTtBQUNMLHFDQUFZLEVBQUVDLFNBQVMsRUFBRUMsbUNBQWIsRUFBa0NDLFNBQVMsRUFBRUMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLFNBQXpELEVBQVosQ0FESztBQUVMLGlDQUFRLEVBQUVDLFlBQVksRUFBRSx1QkFBaEIsRUFBeUNDLElBQUksRUFBRSxFQUEvQyxFQUFSLENBRks7QUFHTEMsbURBQXdCQyxRQUF4QixFQUhLLDhDQUNOO0FBR01DLEVBQUFBLElBSE4sU0FHbUJiLFVBSG5CLENBRzhCOzs7QUFHNUIsV0FBT2MscUJBQVAsQ0FBNkJaLElBQTdCLEVBQW1DO0FBQ2pDQSxNQUFBQSxJQUFJLENBQUNELGdCQUFMLEdBQXdCQSxnQkFBeEI7QUFDRDs7QUFFRGMsSUFBQUEsV0FBVyxDQUFDQyxtQkFBRCxFQUFzQjtBQUMvQjtBQUNBLFdBQUtDLEdBQUwsR0FBV0QsbUJBQVg7QUFDQSxhQUFPLElBQVA7QUFDRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVERCxVQUFNRSxhQUFOLENBQW9CLEVBQUVDLGtCQUFGLEVBQXNCQyxZQUF0QixFQUFvQ0MsbUJBQXBDLEVBQXlEQyxpQkFBekQsS0FBK0UsRUFBbkcsRUFBdUc7O0FBRXJHQyxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxrQ0FBWjtBQUNELEtBckUyQixDQUp4QixrQ0FBUjs7O0FBNEVBLFNBQU90QixJQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCdcbmltcG9ydCB7IGNsYXNzRGVjb3JhdG9yIGFzIHByb3RvdHlwZUNoYWluRGVidWcgfSBmcm9tICdAZGVwZW5kZW5jeS9wcm90b3R5cGVDaGFpbkRlYnVnJ1xuaW1wb3J0IHsgYWRkLCBleGVjdXRlLCBjb25kaXRpb25hbCB9IGZyb20gJ0BkZXBlbmRlbmN5L2NvbW1vblBhdHRlcm4vc291cmNlL2RlY29yYXRvclV0aWxpdHkuanMnXG5pbXBvcnQgeyBleHRlbmRlZFN1YmNsYXNzUGF0dGVybiB9IGZyb20gJ0BkZXBlbmRlbmN5L2NvbW1vblBhdHRlcm4vc291cmNlL2V4dGVuZGVkU3ViY2xhc3NQYXR0ZXJuLmpzJ1xuXG5leHBvcnQgZnVuY3Rpb24gTm9kZUZ1bmN0aW9uKHsgU3VwZXJjbGFzcywgZ2V0RG9jdW1lbnRRdWVyeSB9ID0ge30pIHtcbiAgbGV0IHNlbGYgPVxuICAgIEBjb25kaXRpb25hbCh7IGRlY29yYXRvcjogcHJvdG90eXBlQ2hhaW5EZWJ1ZywgY29uZGl0aW9uOiBwcm9jZXNzLmVudi5TWk5fREVCVUcgfSlcbiAgICBAZXhlY3V0ZSh7IHN0YXRpY01ldGhvZDogJ2luaXRpYWxpemVTdGF0aWNDbGFzcycsIGFyZ3M6IFtdIH0pXG4gICAgQGV4dGVuZGVkU3ViY2xhc3NQYXR0ZXJuLlN1YmNsYXNzKCkgLy8gaW4gY2FzZSBzcGVjaWZpY05lc3RlZFVuaXQgc3ViY2xhc3MgaXNuJ3QgcmVnaXN0ZXJlZCwgdGhpcyBjbGFzcyB3aWxsIGJlIHVzZWQgYXMgQ29udHJvbGxlciBzdWJjbGFzcyB3aGVuIGNhbGxlZC5cbiAgICBjbGFzcyBOb2RlIGV4dGVuZHMgU3VwZXJjbGFzcyB7XG4gICAgICBzdGF0aWMgZ2V0RG9jdW1lbnRRdWVyeVxuXG4gICAgICBzdGF0aWMgaW5pdGlhbGl6ZVN0YXRpY0NsYXNzKHNlbGYpIHtcbiAgICAgICAgc2VsZi5nZXREb2N1bWVudFF1ZXJ5ID0gZ2V0RG9jdW1lbnRRdWVyeVxuICAgICAgfVxuXG4gICAgICBjb25zdHJ1Y3RvcihkYXRhYmFzZURvY3VtZW50S2V5KSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5rZXkgPSBkYXRhYmFzZURvY3VtZW50S2V5XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogRGlyZWN0ZWQgR3JhcGggLSBHcmFwaCB0aGF0IGNhbiBoYXZlIG9wcG9zaXRlIHBvaW50ZXJzIGJldHdlZW4gc2FtZSAyIG5vZGVzLlxuICAgICAgICogT3JpZW50ZWQgZ3JhcGggaXMgYSBkaXJlY3RlZCBncmFwaCB0aGF0IGhhcyBvbmx5IG9uZSBkaXJlY3RyaW9uIGJldHdlZW4gZWFjaCAyIG5vZGVzIChpLmUuIG9uZSBhcnJvdyBwb2ludGluZyB0byBvbmUgZGlyZWN0aW9uIGZyb20gbm9kZSB0byBub2RlKVxuICAgICAgICogVE9ETzogY2hhbmdlICdpbml0aWFsaXplTmVzdGVkVW5pdCcgdG8gJ3RyYXZlcnNlR3JhcGgnXG4gICAgICAgKiBAcmV0dXJuIHtBcnJheSBvZiBPYmplY3RzfSAgZWFjaCBvYmplY3QgY29udGFpbnMgaW5zdHJ1Y3Rpb24gc2V0dGluZ3MgdG8gYmUgdXNlZCB0aHJvdWdoIGFuIGltcGxlbWVudGluZyBtb2R1bGUuXG4gICAgICAgKi9cbiAgICAgIC8vIEAoZnVuY3Rpb24gZGVmYXVsdFBhcmFtZXRlcnModGFyZ2V0Q2xhc3MsIG1ldGhvZE5hbWUsIHByb3BlcnR5RGVzY3JpcHRvcikgeyAvLyBtYWtlIGRlZmF1bHQgcGFyYW1ldGVycyBhY2Nlc2libGUgdG8gcHJpb3IgZGVjb3JhdG9yIHByb3h5IGhhbmRsZXJzXG4gICAgICAvLyAgICAgcHJvcGVydHlEZXNjcmlwdG9yLnZhbHVlID0gbmV3IFByb3h5KHByb3BlcnR5RGVzY3JpcHRvci52YWx1ZSwge1xuICAgICAgLy8gICAgICAgICBhcHBseTogYXN5bmMgKHRhcmdldCwgdGhpc0FyZywgYXJndW1lbnRzTGlzdCkgPT4ge1xuICAgICAgLy8gICAgICAgICAgICAgbGV0IGRlZmF1bHRBcmdzID0gW3tcbiAgICAgIC8vICAgICAgICAgICAgICAgICBpbXBsZW1lbnRhdGlvblR5cGU6IHRoaXNBcmcuc2hhcmVkQ29udGV4dC50cmF2ZXJzYWxJbXBsZW1lbnRhdGlvblR5cGUsXG4gICAgICAvLyAgICAgICAgICAgICAgICAgbm9kZUluc3RhbmNlOiB0aGlzQXJnLCAvLyB0aGUgY3VycmVudCBub2RlIHRvIGludGVyYWN0IHdpdGguXG4gICAgICAvLyAgICAgICAgICAgICAgICAgYWRkaXRpb25hbENoaWxkTm9kZTogW10sIC8vIGNoaWxkIG5vZGVzIHRvIGFkZCB0byB0aGUgY3VycmVudCBub2RlJ3MgY2hpbGRyZW4uIFRoZXNlIGFyZSBhZGRlZCBpbmRpcmVjdGx5IHRvIGEgbm9kZSB3aXRob3V0IGNoYW5naW5nIHRoZSBub2RlJ3MgY2hpbGRyZW4gaXRzZWxmLCBhcyBhIHdheSB0byBleHRlbmQgY3VycmVudCBub2Rlcy5cbiAgICAgIC8vICAgICAgICAgICAgICAgICBub2RlQ29ubmVjdGlvbktleTogbnVsbCAvLyBwYXRoUG9pbnRlcktleVxuICAgICAgLy8gICAgICAgICAgICAgfV1cbiAgICAgIC8vICAgICAgICAgICAgIGFyZ3VtZW50c0xpc3QgPSBkZWZhdWx0QXJncy5tYXAoKGRlZmF1bHRWYWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgIC8vICAgICAgICAgICAgICAgICBsZXQgcGFzc2VkVmFsdWUgPSBhcmd1bWVudHNMaXN0W2luZGV4XVxuICAgICAgLy8gICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBwYXNzZWRWYWx1ZSA9PSAnb2JqZWN0JyAmJiB0eXBlb2YgZGVmYXVsdFZhbHVlID09ICdvYmplY3QnKSB7XG4gICAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGRlZmF1bHRWYWx1ZSwgcGFzc2VkVmFsdWUpXG4gICAgICAvLyAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKCFwYXNzZWRWYWx1ZSkge1xuICAgICAgLy8gICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlXG4gICAgICAvLyAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgcGFzc2VkVmFsdWVcbiAgICAgIC8vICAgICAgICAgICAgICAgICB9XG4gICAgICAvLyAgICAgICAgICAgICB9KVxuICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHNMaXN0KVxuICAgICAgLy8gICAgICAgICB9XG4gICAgICAvLyAgICAgfSlcbiAgICAgIC8vICAgICByZXR1cm4gcHJvcGVydHlEZXNjcmlwdG9yXG4gICAgICAvLyB9KVxuICAgICAgLy8gQChmdW5jdGlvbiBydW5JbXBsZW1lbnRhdGlvbih0YXJnZXRDbGFzcywgbWV0aG9kTmFtZSwgcHJvcGVydHlEZXNjcmlwdG9yKSB7XG4gICAgICAvLyAgICAgbGV0IHByb3h5SGFuZGxlciA9IHtcbiAgICAgIC8vICAgICAgICAgYXBwbHk6IGFzeW5jICh0YXJnZXQsIHRoaXNBcmcsIGFyZ3VtZW50c0xpc3QpID0+IHtcbiAgICAgIC8vICAgICAgICAgICAgIGxldCB7XG4gICAgICAvLyAgICAgICAgICAgICAgICAgaW1wbGVtZW50YXRpb25UeXBlLFxuICAgICAgLy8gICAgICAgICAgICAgICAgIG5vZGVJbnN0YW5jZSxcbiAgICAgIC8vICAgICAgICAgICAgIH0gPSBhcmd1bWVudHNMaXN0WzBdXG4gICAgICAvLyAgICAgICAgICAgICBpZighaW1wbGVtZW50YXRpb25UeXBlICYmIG5vZGVJbnN0YW5jZS50YWcpXG4gICAgICAvLyAgICAgICAgICAgICAgICAgaW1wbGVtZW50YXRpb25UeXBlID0gbm9kZUluc3RhbmNlLnRhZy50cmF2ZXJzYWxJbXBsZW1lbnRhdGlvblR5cGVcblxuICAgICAgLy8gICAgICAgICAgICAgaWYoaW1wbGVtZW50YXRpb25UeXBlKSB7XG4gICAgICAvLyAgICAgICAgICAgICAgICAgbGV0IGNvbnRyb2xsZXIgPSB0aGlzQXJnLmNvbnRleHRJbnN0YW5jZVxuICAgICAgLy8gICAgICAgICAgICAgICAgIHJldHVybiBjb250cm9sbGVyLmludGVyY2VwdE1ldGhvZCh7IHRoaXNBcmcsIGltcGxlbWVudGF0aW9uVHlwZSwgbm9kZUluc3RhbmNlLCBhcmd1bWVudHNMaXN0LCBtZXRob2ROYW1lIH0pXG4gICAgICAvLyAgICAgICAgICAgICB9XG4gICAgICAvLyAgICAgICAgICAgICBlbHNlIHtcbiAgICAgIC8vICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCfigKIgbm8gaW1wbGVtZW50YXRpb24gc2VsZWN0ZWQgZm9yICcgKyBub2RlSW5zdGFuY2Uua2V5KVxuICAgICAgLy8gICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQuYXBwbHkodGhpc0FyZywgYXJndW1lbnRzTGlzdClcbiAgICAgIC8vICAgICAgICAgICAgIH1cbiAgICAgIC8vICAgICAgICAgfVxuICAgICAgLy8gICAgIH1cbiAgICAgIC8vICAgICBwcm9wZXJ0eURlc2NyaXB0b3IudmFsdWUgPSBuZXcgUHJveHkocHJvcGVydHlEZXNjcmlwdG9yLnZhbHVlLCBwcm94eUhhbmRsZXIpXG4gICAgICAvLyAgICAgcmV0dXJuIHByb3BlcnR5RGVzY3JpcHRvclxuICAgICAgLy8gfSlcbiAgICAgIGFzeW5jIHRyYXZlcnNlR3JhcGgoeyBpbXBsZW1lbnRhdGlvblR5cGUsIG5vZGVJbnN0YW5jZSwgYWRkaXRpb25hbENoaWxkTm9kZSwgbm9kZUNvbm5lY3Rpb25LZXkgfSA9IHt9KSB7XG4gICAgICAgIC8vIEVudHJ5cG9pbnQgSW5zdGFuY2VcbiAgICAgICAgY29uc29sZS5sb2coJ2RlZmF1bHQgdHJhdmVyc2UgR3JhcGggZXhlY3V0ZWQuJylcbiAgICAgIH1cbiAgICB9XG5cbiAgcmV0dXJuIHNlbGZcbn1cbiJdfQ==