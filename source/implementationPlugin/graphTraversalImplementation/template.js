"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.shellscript = shellscript;var _underscore = _interopRequireDefault(require("underscore"));

function shellscript({ thisArg }) {

  let self = {




    async initializeNestedUnit({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null }) {


      let view = await nestedUnitInstance.loopInsertionPoint({ type: 'aggregateIntoTemplateObject' });

      assert(this.portAppInstance.config.clientSidePath, '• clientSidePath cannot be undefined. i.e. previous middlewares should\'ve set it');
      let templatePath = path.join(this.portAppInstance.config.clientSidePath, unitInstance.file.filePath);
      let renderedContent;
      switch (unitInstance.executionType) {
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
    },

    async underscoreRendering({ templatePath, view }) {

      let templateString = await filesystem.readFileSync(templatePath, 'utf-8');

      const templateArgument = {
        templateController: this,
        context: this.portAppInstance.context,
        Application,
        argument: {} };

      let renderedContent = _underscore.default.template(templateString)(
      Object.assign(
      {},
      templateArgument,
      { view, templateArgument }));


      return renderedContent;
    },

    renderedContentString(viewName, viewObject) {

      if (viewObject[viewName] && Array.isArray(viewObject[viewName])) {
        return viewObject[viewName].join('');
      }
    },

    traversePort: async function aggregateIntoTemplateObject() {
      let view = {};
      if (this.insertionPoint) {
        for (let insertionPoint of this.insertionPoint) {
          let children = await this.filterAndOrderChildren({ insertionPointKey: insertionPoint.key });
          let subsequent = await this.initializeInsertionPoint({ insertionPoint, children });
          if (!(insertionPoint.name in view)) view[insertionPoint.name] = [];
          Array.prototype.push.apply(
          view[insertionPoint.name],
          subsequent);

        }
      }
      return view;
    } };



  Object.keys(self).forEach(function (key) {
    self[key] = self[key].bind(thisArg);
  }, {});
  return self;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NvdXJjZS9pbXBsZW1lbnRhdGlvblBsdWdpbi9ncmFwaFRyYXZlcnNhbEltcGxlbWVudGF0aW9uL3RlbXBsYXRlLmpzIl0sIm5hbWVzIjpbInNoZWxsc2NyaXB0IiwidGhpc0FyZyIsInNlbGYiLCJpbml0aWFsaXplTmVzdGVkVW5pdCIsIm5lc3RlZFVuaXRLZXkiLCJhZGRpdGlvbmFsQ2hpbGROZXN0ZWRVbml0IiwicGF0aFBvaW50ZXJLZXkiLCJ2aWV3IiwibmVzdGVkVW5pdEluc3RhbmNlIiwibG9vcEluc2VydGlvblBvaW50IiwidHlwZSIsImFzc2VydCIsInBvcnRBcHBJbnN0YW5jZSIsImNvbmZpZyIsImNsaWVudFNpZGVQYXRoIiwidGVtcGxhdGVQYXRoIiwicGF0aCIsImpvaW4iLCJ1bml0SW5zdGFuY2UiLCJmaWxlIiwiZmlsZVBhdGgiLCJyZW5kZXJlZENvbnRlbnQiLCJleGVjdXRpb25UeXBlIiwidW5kZXJzY29yZVJlbmRlcmluZyIsInByb2Nlc3NSZW5kZXJlZENvbnRlbnQiLCJ0ZW1wbGF0ZVN0cmluZyIsImZpbGVzeXN0ZW0iLCJyZWFkRmlsZVN5bmMiLCJ0ZW1wbGF0ZUFyZ3VtZW50IiwidGVtcGxhdGVDb250cm9sbGVyIiwiY29udGV4dCIsIkFwcGxpY2F0aW9uIiwiYXJndW1lbnQiLCJfIiwidGVtcGxhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJyZW5kZXJlZENvbnRlbnRTdHJpbmciLCJ2aWV3TmFtZSIsInZpZXdPYmplY3QiLCJBcnJheSIsImlzQXJyYXkiLCJ0cmF2ZXJzZVBvcnQiLCJhZ2dyZWdhdGVJbnRvVGVtcGxhdGVPYmplY3QiLCJpbnNlcnRpb25Qb2ludCIsImNoaWxkcmVuIiwiZmlsdGVyQW5kT3JkZXJDaGlsZHJlbiIsImluc2VydGlvblBvaW50S2V5Iiwia2V5Iiwic3Vic2VxdWVudCIsImluaXRpYWxpemVJbnNlcnRpb25Qb2ludCIsIm5hbWUiLCJwcm90b3R5cGUiLCJwdXNoIiwiYXBwbHki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QixDQUF2QjtBQUNBLGNBQUcsRUFBRUQsY0FBYyxDQUFDTyxJQUFmLElBQXVCNUMsSUFBekIsQ0FBSCxFQUFtQ0EsSUFBSSxDQUFDcUMsY0FBYyxDQUFDTyxJQUFoQixDQUFKLEdBQTRCLEVBQTVCO0FBQ25DWCxVQUFBQSxLQUFLLENBQUNZLFNBQU4sQ0FBZ0JDLElBQWhCLENBQXFCQyxLQUFyQjtBQUNJL0MsVUFBQUEsSUFBSSxDQUFDcUMsY0FBYyxDQUFDTyxJQUFoQixDQURSO0FBRUlGLFVBQUFBLFVBRko7O0FBSUg7QUFDSjtBQUNELGFBQU8xQyxJQUFQO0FBQ0gsS0F2RU0sRUFBWDs7OztBQTJFQTRCLEVBQUFBLE1BQU0sQ0FBQ29CLElBQVAsQ0FBWXJELElBQVosRUFBa0JzRCxPQUFsQixDQUEwQixVQUFTUixHQUFULEVBQWM7QUFDcEM5QyxJQUFBQSxJQUFJLENBQUM4QyxHQUFELENBQUosR0FBWTlDLElBQUksQ0FBQzhDLEdBQUQsQ0FBSixDQUFVUyxJQUFWLENBQWV4RCxPQUFmLENBQVo7QUFDSCxHQUZELEVBRUcsRUFGSDtBQUdBLFNBQU9DLElBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2hlbGxzY3JpcHQoe3RoaXNBcmd9KSB7IC8vIGZ1bmN0aW9uIHdyYXBwZXIgdG8gc2V0IHRoaXNBcmcgb24gaW1wbGVtZW50YWlvbiBvYmplY3QgZnVuY3Rpb25zLlxyXG5cclxuICAgIGxldCBzZWxmID0ge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gU3RyaW5nIG9mIHJlbmRlcmVkIEhUTUwgZG9jdW1lbnQgY29udGVudC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBhc3luYyBpbml0aWFsaXplTmVzdGVkVW5pdCh7IG5lc3RlZFVuaXRLZXksIGFkZGl0aW9uYWxDaGlsZE5lc3RlZFVuaXQgPSBbXSwgcGF0aFBvaW50ZXJLZXkgPSBudWxsIH0pIHsgLy8gRW50cnlwb2ludCBJbnN0YW5jZVxyXG4gICAgICAgICAgICAvLyB2aWV3cyBhcmd1bWVudCB0aGF0IHdpbGwgYmUgaW5pdGlhbGxpemVkIGluc2lkZSB0ZW1wbGF0ZXM6XHJcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0ZW1wbGF0ZSBhbmQgY3JlYXRlIHJlbmRlcmVkIHZpZXcgY29udGVudC5cclxuICAgICAgICAgICAgbGV0IHZpZXcgPSBhd2FpdCBuZXN0ZWRVbml0SW5zdGFuY2UubG9vcEluc2VydGlvblBvaW50KHsgdHlwZTogJ2FnZ3JlZ2F0ZUludG9UZW1wbGF0ZU9iamVjdCcgfSlcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGFzc2VydCh0aGlzLnBvcnRBcHBJbnN0YW5jZS5jb25maWcuY2xpZW50U2lkZVBhdGgsICfigKIgY2xpZW50U2lkZVBhdGggY2Fubm90IGJlIHVuZGVmaW5lZC4gaS5lLiBwcmV2aW91cyBtaWRkbGV3YXJlcyBzaG91bGRcXCd2ZSBzZXQgaXQnKVxyXG4gICAgICAgICAgICBsZXQgdGVtcGxhdGVQYXRoID0gcGF0aC5qb2luKHRoaXMucG9ydEFwcEluc3RhbmNlLmNvbmZpZy5jbGllbnRTaWRlUGF0aCwgdW5pdEluc3RhbmNlLmZpbGUuZmlsZVBhdGgpXHJcbiAgICAgICAgICAgIGxldCByZW5kZXJlZENvbnRlbnQ7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodW5pdEluc3RhbmNlLmV4ZWN1dGlvblR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBjYXNlICd1bmRlcnNjb3JlUmVuZGVyaW5nJzpcclxuICAgICAgICAgICAgICAgICAgICByZW5kZXJlZENvbnRlbnQgPSBhd2FpdCB0aGlzLnVuZGVyc2NvcmVSZW5kZXJpbmcoeyB0ZW1wbGF0ZVBhdGgsIHZpZXcgfSlcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKHVuaXRJbnN0YW5jZS5wcm9jZXNzUmVuZGVyZWRDb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICd3cmFwSnNUYWcnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVkQ29udGVudCA9IGA8c2NyaXB0IHR5cGU9XCJtb2R1bGVcIiBhc3luYz4ke3JlbmRlcmVkQ29udGVudH08L3NjcmlwdD5gXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IC8vIHNraXBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlcmVkQ29udGVudFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGFzeW5jIHVuZGVyc2NvcmVSZW5kZXJpbmcoeyB0ZW1wbGF0ZVBhdGgsIHZpZXcgfSkge1xyXG4gICAgICAgICAgICAvLyBMb2FkIHRlbXBsYXRlIGZpbGUuXHJcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZVN0cmluZyA9IGF3YWl0IGZpbGVzeXN0ZW0ucmVhZEZpbGVTeW5jKHRlbXBsYXRlUGF0aCwgJ3V0Zi04JylcclxuICAgICAgICAgICAgLy8gU2hhcmVkIGFyZ3VtZW50cyBiZXR3ZWVuIGFsbCB0ZW1wbGF0ZXMgYmVpbmcgcmVuZGVyZWRcclxuICAgICAgICAgICAgY29uc3QgdGVtcGxhdGVBcmd1bWVudCA9IHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlQ29udHJvbGxlcjogdGhpcyxcclxuICAgICAgICAgICAgICAgIGNvbnRleHQ6IHRoaXMucG9ydEFwcEluc3RhbmNlLmNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBBcHBsaWNhdGlvbixcclxuICAgICAgICAgICAgICAgIGFyZ3VtZW50OiB7fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCByZW5kZXJlZENvbnRlbnQgPSBfLnRlbXBsYXRlKHRlbXBsYXRlU3RyaW5nKShcclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oXHJcbiAgICAgICAgICAgICAgICAgICAge30sIFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlQXJndW1lbnQsIC8vIHVzZSB0ZW1wbGF0ZUFyZ3VtZW50IGluIGN1cnJlbnQgdGVtcGxhdGVcclxuICAgICAgICAgICAgICAgICAgICB7IHZpZXcsIHRlbXBsYXRlQXJndW1lbnQgfSAvLyBwYXNzIHRlbXBsYXRlQXJndW1lbnQgdG8gbmVzdGVkIHRlbXBsYXRlc1xyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXJlZENvbnRlbnQgICAgICAgICAgICAgICAgICBcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICByZW5kZXJlZENvbnRlbnRTdHJpbmcodmlld05hbWUsIHZpZXdPYmplY3QpIHtcclxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdodCB0aGUgc3RyaW5ncyBhcnJheSB0byBjb21iaW5lIHRoZW0gYW5kIHByaW50IHN0cmluZyBjb2RlIHRvIHRoZSBmaWxlLiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZih2aWV3T2JqZWN0W3ZpZXdOYW1lXSAmJiBBcnJheS5pc0FycmF5KHZpZXdPYmplY3Rbdmlld05hbWVdKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZpZXdPYmplY3Rbdmlld05hbWVdLmpvaW4oJycpIC8vIGpvaW5zIGFsbCBhcnJheSBjb21wb25lbnRzIGludG8gb25lIHN0cmluZy5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHRyYXZlcnNlUG9ydDogYXN5bmMgZnVuY3Rpb24gYWdncmVnYXRlSW50b1RlbXBsYXRlT2JqZWN0KCkge1xyXG4gICAgICAgICAgICBsZXQgdmlldyA9IHt9XHJcbiAgICAgICAgICAgIGlmKHRoaXMuaW5zZXJ0aW9uUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGluc2VydGlvblBvaW50IG9mIHRoaXMuaW5zZXJ0aW9uUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSBhd2FpdCB0aGlzLmZpbHRlckFuZE9yZGVyQ2hpbGRyZW4oeyBpbnNlcnRpb25Qb2ludEtleTogaW5zZXJ0aW9uUG9pbnQua2V5IH0pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdWJzZXF1ZW50ID0gYXdhaXQgdGhpcy5pbml0aWFsaXplSW5zZXJ0aW9uUG9pbnQoeyBpbnNlcnRpb25Qb2ludCwgY2hpbGRyZW4gfSkgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZighKGluc2VydGlvblBvaW50Lm5hbWUgaW4gdmlldykpIHZpZXdbaW5zZXJ0aW9uUG9pbnQubmFtZV0gPSBbXVxyXG4gICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlld1tpbnNlcnRpb25Qb2ludC5uYW1lXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2VxdWVudCBcclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZpZXc7ICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIE9iamVjdC5rZXlzKHNlbGYpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgc2VsZltrZXldID0gc2VsZltrZXldLmJpbmQodGhpc0FyZylcclxuICAgIH0sIHt9KVxyXG4gICAgcmV0dXJuIHNlbGZcclxufSJdfQ==