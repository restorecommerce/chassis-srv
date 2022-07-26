// TODO Re-implement
const removeBufferFields = (object, ctx) => {
  // Check if the cfg file contains any bufferFields and remove them
  if (!object) {
    object = {};
  }
  if (ctx.config && ctx.config.services) {
    const service = ctx.config.services;
    const servicesKeys = Object.keys(ctx.config.services);
    for (let key of servicesKeys) {
      // bufferFields
      if (service[key] && service[key][ctx.method] && service[key][ctx.method].bufferFields) {
        let bufferFields = service[key][ctx.method].bufferFields;
        const bufferKeys = Object.keys(bufferFields);
        for (let key of bufferKeys) {
          const bufferField = bufferFields[key];
          // if any bufferField is found
          // delete it from the cloned object
          if (object[bufferField]) {
            delete object[bufferField];
          }
          // delete it from the test case
          if (object.items && object.items[0]
            && object.items[0].data) {
            delete object.items[0].data;
          }
        }
      }
      // maskFields
      if (service[key] && service[key][ctx.method] && service[key][ctx.method].maskFields) {
        let maskFields = service[key][ctx.method].maskFields;
        for (let maskField of maskFields) {
          // if any maskField is configured, mask it
          if (object[maskField]) {
            const maskLength = object[maskField].length;
            object[maskField] = '*'.repeat(maskLength);
          }
          // delete it from the test case
          if (object.items && object.items[0]
            && object.items[0].data) {
            delete object.items[0].data;
          }
        }
      }
    }
  }
  return object;
};

export {};
