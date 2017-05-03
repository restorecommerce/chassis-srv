'use strict';

/*  eslint-disable require-yield */
/*  eslint-disable no-continue */

import * as ProtoBuf from "protobufjs";
const fs = require('fs');

const grpc = require('grpc');
const _ = require('lodash');

function findType(t: any, builder: any): any {
  let ns = t;
  while (ns.className !== 'Namespace') {
    ns = ns.parent;
  }
  const pkgName = ns.fqn().substring(1);
  const fqn = t.fqn();
  const subPath = fqn.substring(pkgName.length + 2);

  const files = _.keys(builder.files);
  let foundAst;
  const foundFile = _.find(files, (file) => {
    // TODO - there is no old ProtoBuf.Dot.Parse method - modify this accordingly.
    const parser = builder;
    const ast = parser.parse();
    if (pkgName === ast.package) {
      const lt = lookupType(subPath, ast);
      if (_.isNil(lt)) {
        return false;
      }
      foundAst = ast;
      // TODO lookup subPath + name
      return true;
    }
    return false;
  });
  return {
    ast: foundAst,
    file: foundFile,
  };
}

function lookupType(path: string, node: any): any {
  const elements = path.split('.');
  const msg = _.find(node.messages, { name: elements[0] });
  if (!_.isNil(msg)) {
    const newPath = path.substring(elements[0].length + 1);
    if (newPath.length > 0) {
      return lookupType(newPath, msg);
    }
    return msg;
  }
  const service = _.find(node.services, { name: elements[0] });
  if (!_.isNil(service)) {
    const newPath = path.substring(elements[0].length + 1);
    if (newPath.length > 0) {
      return lookupType(newPath, service);
    }
    return service;
  }
  const rpc = _.get(node.rpc, elements[0]);
  if (!_.isNil(rpc)) {
    const newPath = path.substring(elements[0].length + 1);
    if (newPath.length > 0) {
      return lookupType(newPath, rpc);
    }
    return rpc;
  }
  return null;
}

function isEmpty(value: any): boolean {
  return _.isNil(value) || _.isEmpty(value) || _.size(value) === 0;
}

const stringToTypeMap = {
  double: 1,
  float: 2,
  int64: 3,
  uint64: 4,
  int32: 5,
  string: 9,
};

function getOneOfIndex(field: any, oneofs: any): any {
  if (_.isNil(oneofs)) {
    return undefined;
  }
  const index = _.findIndex(oneofs[field.name], field.index);
  if (index < 0) return undefined;
  return index;
}

const stringToLabelMap = {
  optional: 1,
  required: 2,
  repeated: 3,
};

function createFieldDescriptorProto(field: any, oneofs: any): any {
  const fdp: any = {
    name: field.name,
    number: field.id,
    label: stringToLabelMap[field.rule],
    type: stringToTypeMap[field.type],
    typeName: field.type,
    // extendee
    oneofIndex: getOneOfIndex(field, oneofs),
    // jsonName
  };
  if (field.options) {
    fdp.options = {
      packed: field.options.packed,
      deprecated: field.options.deprecated,
    };
    fdp.defaultValue = `${field.options.default}`;
  }
  return fdp;
}

function createEnumDescriptorProto(enumType: any): any {
  const values = _.map(enumType.values, (value) => {
    return {
      name: value.name,
      number: value.id,
      // options
    };
  });
  return {
    name: enumType.name,
    value: values,
    options: enumType.options,
  };
}

const messageOptions = [
  'message_set_wire_format',
  'no_standard_descriptor_accessor',
  'deprecated',
  'map_entry'
];

function createMessageOptions(options: any): any {
  const opts = _.pick(options, messageOptions);
  return _.mapKeys(opts, (value, key) => {
    return _.camelCase(key);
  });
}

function createFileOptions(options: any): any {
  return _.mapKeys(options, (value, key) => {
    return _.camelCase(key);
  });
}

function createDescriptorProto(message: any): any {
  const fields = _.map(message.fields, (field) => {
    return createFieldDescriptorProto(field, message.oneofs);
  });
  const nestedType = _.map(message.nestedType, (type) => {
    return createDescriptorProto(type);
  });
  const oneofs = _.map(message.oneofs, (value) => {
    return {
      name: value.name,
    };
  });
  const enums = _.map(message.enums, createEnumDescriptorProto);
  return {
    name: message.name,
    field: fields,
    // extension
    nestedType,
    enumType: enums,
    // extensionRange
    oneofDecl: oneofs,
    options: createMessageOptions(message.options),
    // reservedRange
    // reservedName
  };
}

function createFileDescriptorProto(file: any, ast: any): any {
  const messages = _.map(ast.messages, createDescriptorProto);
  return {
    name: file,
    package: ast.package,
    dependency: ast.imports,
    // publicDependency
    // weakDependency
    messageType: messages,
    // enumType
    // service
    // extension
    options: createFileOptions(ast.options),
    // sourceCodeInfo
    syntax: ast.syntax,
  };
}

/**
 * An implementation of the grpc.reflection.v1alpha.ServerReflection service.
 * Uses the provided builder and config to reflection on served endpoints.
 */
export class ServerReflection {

  builder: any;
  config: any;

  /**
   * @param (ProtoBuf.Builder) The protobuf builder  which the gRPC transport provider is using.
   * @config (Object) Server cofnig.
   */
  constructor(builder: ProtoBuf.Root, config: any) {
    // this.builder = builder;
    let root = new ProtoBuf.Root();
    let protoroot = config.transports[0].protoRoot;
    // let files = config.transports[0].protos;
    // TODO change this to param in config
    let files = ["grpc/reflection/v1alpha/reflection.proto"];
    _.forEach(files, (fileName, key) => {
      root.resolvePath = function (origin, target) {
        // origin is the path of the importing file
        // target is the imported path
        // determine absolute path and return it ...
        return protoroot + fileName;
      };
      root.loadSync(protoroot + fileName);
    });
    this.builder = root;
    this.config = config;
  }

  /**
   * Service endpoint for gRPC ServerReflectionInfo.
   */
  * serverReflectionInfo(call?: any, context?: any): any {
    const logger = context.logger;
    let openCall = true;
    let req;
    while (openCall) {
      try {
        req = yield call.read();
      } catch (error) {
        if (error.message === 'stream end') {
          yield call.end();
          return;
        }
        logger.error(error);
        continue;
      }
      const methodName = req.message_request;
      delete req.message_request;
      req = _.omitBy(req, isEmpty);
      if (_.isNil(methodName)) {
        logger.info('empty message_request', req);
        yield call.write({
          validHost: req.host, // TODO Is this correct?
          originalRequest: req,
          errorResponse: {
            errorCode: grpc.status.INVALID_ARGUMENT,
            errorMessage: 'message_request is empty',
          },
        });
        continue;
      }
      const methodArg = req[methodName];
      let method;
      switch (`${methodName}`) {
        case 'fileByFilename':
          method = this.fileByFileName(methodArg, req);
          break;
        case 'fileContainingSymbol':
          method = this.findProtoFileByPath(methodArg, req);
          break;
        case 'fileContainingExtension':
          method = this.fileContainingExtension(methodArg, req);
          break;
        case 'allExtensionNumbersOfType':
          method = this.allExtensionNumbersOfType(methodArg, req);
          break;
        case 'listServices':
          method = this.listServices(req);
          break;
        // allExtensionNumbersOfType
        default:
          logger.info(`method ${methodName} does not exist`, req);
          yield call.write({
            validHost: req.host, // TODO Is this correct?
            originalRequest: req,
            errorResponse: {
              errorCode: grpc.status.UNIMPLEMENTED,
              errorMessage: `method ${methodName} does not exist`,
            },
          });
          continue;
      }
      try {
        const result = yield method;
        yield call.write(result);
      } catch (error) {
        openCall = false;
        logger.info(error);
        break;
      }
    }
    yield call.end();
  }

  /**
   * Find a proto file by the file name.
   */
  * fileByFileName(fileName: string, req: any): any {
    const files = _.keys(this.builder.files);
    const file = _.find(files, (path) => {
      return _.endsWith(path, fileName);
    });
    if (_.isNil(file)) {
      return {
        validHost: req.host, // TODO Is this correct?
        originalRequest: req,
        errorResponse: {
          errorCode: grpc.status.NOT_FOUND,
          errorMessage: `file ${fileName} does not exist`,
        },
      };
    }
    // TODO - add new parser here - modify it after testing.
    // const parser = new ProtoBuf.DotProto.Parser(fs.readFileSync(file));
    const parser = files;
    const ast = parser.parse();
    const FileDescriptorProto = this.builder.build('google.protobuf.FileDescriptorProto');
    if (_.isNil(FileDescriptorProto)) {
      throw new Error('Could not find google.protobuf.FileDescriptorProto');
    }
    const fdp = createFileDescriptorProto(file, ast);
    const fDescProto = new FileDescriptorProto(fdp);
    return {
      validHost: req.host,
      originalRequest: req,
      fileDescriptorResponse: {
        fileDescriptorProto: [fDescProto.encode()],
      },
    };
  }

  /**
   * Find a proto file by a symbol.
   *
   * @param {string} path Path to symbol
   * Format:  <package>.<service>[.<method>] or <package>.<type>)
   */
  * findProtoFileByPath(path: string, req: any): any {
    const t = this.builder.lookup(path);
    if (_.isNil(t)) {
      return {
        validHost: req.host, // TODO Is this correct?
        originalRequest: req,
        errorResponse: {
          errorCode: grpc.status.NOT_FOUND,
          errorMessage: `symbol ${path} not found`,
        },
      };
    }
    const res = findType(t, this.builder);
    const FileDescriptorProto = this.builder.build('google.protobuf.FileDescriptorProto');
    if (_.isNil(FileDescriptorProto)) {
      throw new Error('Could not find google.protobuf.FileDescriptorProto');
    }
    const fdp = createFileDescriptorProto(res.file, res.ast);
    const fDescProto = new FileDescriptorProto(fdp);
    return {
      validHost: req.host,
      originalRequest: req,
      fileDescriptorResponse: {
        fileDescriptorProto: [fDescProto.encode()],
      },
    };
  }

  /**
   * Find the proto file which defines an extension extending the given
   * message type with the given field number.
   */
  * fileContainingExtension(arg: any, req: any): any {
    const path = arg.containingType;
    const t = this.builder.lookup(path);
    const id = arg.extensionNumber;
    if (_.isNil(t)) {
      return {
        validHost: req.host, // TODO Is this correct?
        originalRequest: req,
        errorResponse: {
          errorCode: grpc.status.NOT_FOUND,
          errorMessage: `symbol ${path} not found`,
        },
      };
    }
    /* eslint no-underscore-dangle: "off"*/
    if (_.isNil(t._fieldsById[id])) {
      return {
        validHost: req.host, // TODO Is this correct?
        originalRequest: req,
        errorResponse: {
          errorCode: grpc.status.NOT_FOUND,
          errorMessage: `extension number ${id} is not used`,
        },
      };
    }
    const res = findType(t, this.builder);
    const FileDescriptorProto = this.builder.build('google.protobuf.FileDescriptorProto');
    if (_.isNil(FileDescriptorProto)) {
      throw new Error('Could not find google.protobuf.FileDescriptorProto');
    }
    const fdp = createFileDescriptorProto(res.file, res.ast);
    const fDescProto = new FileDescriptorProto(fdp);
    return {
      validHost: req.host,
      originalRequest: req,
      fileDescriptorResponse: {
        fileDescriptorProto: [fDescProto.encode()],
      },
    };
  }

  * allExtensionNumbersOfType(path: string, req: any): any {
    const t = this.builder.lookup(path);
    if (_.isNil(t)) {
      return {
        validHost: req.host, // TODO Is this correct?
        originalRequest: req,
        errorResponse: {
          errorCode: grpc.status.NOT_FOUND,
          errorMessage: `symbol ${path} not found`,
        },
      };
    }
    /* eslint no-underscore-dangle: "off"*/
    const ids = _.map(t._fields, (field) => {
      return field.id;
    });
    return {
      validHost: req.host,
      originalRequest: req,
      allExtensionNumbersResponse: {
        baseTypeName: t.fqn().substring(1),
        extensionNumber: ids,
      },
    };
  }

  /**
   * Lists all gRPC provided services.
   * NOTE: Services using other transport providers are not listed.
   */
  * listServices(req: any): any {
    const transports = _.filter(this.config.transports, { provider: 'grpc' });
    let services = [];
    _.forEach(transports, (transport) => {
      const srvs = _.values(transport.services);
      if (_.includes(srvs, 'grpc.reflection.v1alpha.ServerReflection')) {
        services = _.concat(services, srvs);
      }
    });
    services = _.uniq(services);
    services = _.map(services, (service) => {
      return {
        name: service,
      };
    });
    return {
      validHost: req.host,
      originalRequest: req,
      listServicesResponse: {
        service: services,
      },
    };
  }
}

// module.exports.ServerReflection = ServerReflection;
