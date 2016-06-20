/*

Provde Databse Functions

*/
'use strict';
let Datastore = require('nedb');
const _ = require('lodash');
let co = require('co');
class nedbProvider {
  constructor(conf, logger) {
      this.collections = {};
      let collections = conf.collections;
      let self = this;
       _.forEach(collections,function(conf,name){
          if(conf.fileName){
             logger.verbose("Collection "  , name , "had a fileName : " , conf.fileName );
             conf.autoload = true;
          }
          self.collections[name] = new Datastore(conf);
       });
  }
   //{ $or: [{ planet: 'Earth' }, { planet: 'Mars' }] }
  buildOrQuery(options,name){
    if(!_.isArray(options)){
      options = [options];
    }
     let obj = {$or: []};
     options.forEach(function (item) {
          let toInsert = {};
          toInsert[name] = item;
          obj["$or"].push(toInsert);
     });
     return obj;
  }

 *insert(collection, document) {
      let self = this;
    let doc = _.cloneDeep(document);
     doc._id = doc.id;
    return yield (function() {
      return function(cb) {
      self.collections[collection].insert(doc,function(err,newdoc){
            // docs
            if (err) {
            cb(err);
            throw err;
            }else {
              delete newdoc['_id'];
              cb(null, newdoc);
            }
          });
      };
    })();
  }
  *find(collection, filter={}, options) {
     options = options || {};
      let fil = filter || {};
      let self = this;
      if (options.limit) {
        if ((options.offset) && (options.offset !==0)){
          return yield (function() {
            return function(cb) {
              self.collections[collection].find(fil).skip(options.offset).limit(options.limit).exec(function (err, docs) {
                  // docs
                  if (err) {
                    cb(err);
                  }else {
                    let l = docs.length;
                  for(let i=0;i<l;i++){
                    _.unset(docs[i],'_id');
                  }
                    cb(null, docs);
                  }
                });
            };
          })();
        }else {
          return yield (function() {
            return function(cb) {
              self.collections[collection].find(fil).limit(options.limit).exec(function (err, docs) {
                  // docs
                  if (err) {
                    cb(err);
                  }else {
                   let l = docs.length;
                  for(let i=0;i<l;i++){
                    _.unset(docs[i],'_id');
                  }
                    cb(null, docs);
                  }
                });
            };
          })();
        }
      }else {
        return yield (function() {
          return function(cb) {
            self.collections[collection].find(fil,function (err, docs) {
                // docs
                if (err) {
                  cb(err);
                }else {
                  let l = docs.length;
                  for(let i=0;i<l;i++){
                    _.unset(docs[i],'_id');
                  }
                  /*docs.forEach(function(doc){
                    delete doc['_id'];
                  });*/
                  cb(null, docs);
                }
              });
          };
        })();
      }
  }
  *findByID(collection, identifications) {
    if(!_.isArray(identifications)){
      identifications = [identifications];
    }
    let q = this.buildOrQuery(identifications,"id");
    let self =this ;
    return yield (function() {
      return function(cb) {
        self.collections[collection].find(q).exec(function (err, docs) {
          if (docs){
            let l = docs.length;
                  for(let i=0;i<l;i++){
                    _.unset(docs[i],'_id');
                  }
           cb(null,docs)
        }else if (err) {
          cb(err);
        }
      });
      }
    })();
  }
  *update(collection, filter, document) {
          let self = this;

          let obj ={};
          obj.$set = {};
          Object.keys(document).forEach(function(key) {
              obj.$set[key] = document[key];
          });

         return yield (function() {
              return function(cb) {
                  self.collections[collection].update(filter, obj, { multi: true }, function (err, numReplaced) {
                      if (err) {
                          cb(err);
                      }else{
                        cb(null);
                      }
                  });
              }
             })();
  }
  *delete(collection, filter) {
    if (!_.isObject(filter)) {
        filter= {};
    }
    try {
      let self = this;
    return yield (function() {
      return function(cb) {
         self.collections[collection].remove(filter, { multi: true }, function (err, numRemoved) {
           if(err){
             cb(err);
           }else{
             //console.log(numRemoved);
              cb(null,numRemoved);
           }
         });
       }
    })();
    } catch (e) {
        throw  new Error(e);
    }
  }
}




//module.exports.nedbProvider = nedbProvider;

module.exports.create = function* create(conf, logger) {
  return new nedbProvider(conf,logger);
};