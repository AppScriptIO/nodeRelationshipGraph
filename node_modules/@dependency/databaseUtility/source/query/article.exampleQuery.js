"use strict";

// Input:
let aggregatedKey = 'a1';
let languageKey = 'English';
var relationship = r.db('webappContent').table('relationship');
var article = r.db('webappContent').table('article');
let language = r.db('webappContent').table('language');
let aggregatedArticle = article.filter({
  key: aggregatedKey
}); // article.indexCreate('key')
// language.indexCreate('key')

let version = aggregatedArticle.concatMap(function (document) {
  return document('version');
}).concatMap(function (document) {
  let related = article.getAll(document, {
    index: 'key'
  });
  return related;
}); //.eqJoin(
//  function(document) { return document }, 
//  article, { index: 'key'}
//)

let aggregatedArticleWithVersion = aggregatedArticle.merge(function (document) {
  return {
    version: version.coerceTo('array')
  };
}); // relationship.indexCreate('articleKey', function(document) { return document('article')('documentKey') });

let result = relationship.map(function (document) {
  return {
    relationship: document
  };
}).concatMap(function (document) {
  let related = article.getAll(document('relationship')('article')('documentKey'), {
    index: 'key'
  });
  return related.map(function (relatedDocument) {
    return document.merge({
      article: relatedDocument
    });
  });
}).concatMap(function (document) {
  let related = language.getAll(document('relationship')('language')('documentKey'), {
    index: 'key'
  });
  return related.map(function (relatedDocument) {
    return document.merge({
      language: relatedDocument
    });
  });
}).filter(function (document) {
  return document('language')('key').eq(languageKey);
}).filter(function (document) {
  return version.contains(function (version) {
    return document('article')('key').eq(version('key'));
  });
}).getField('article');
aggregatedArticleWithVersion;