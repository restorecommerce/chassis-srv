import * as protoBuf from 'protobufjs';
import * as fs from 'fs';
import * as grpc from 'grpc';
import * as _ from 'lodash';
import * as path from 'path';

function recursiveResolvePath(t, finalPackage) {
  if (t.parent) {
    let temp = (finalPackage === '') ? (t.parent.name) : (t.parent.name + '.' + finalPackage);
    finalPackage = recursiveResolvePath(t.parent, temp);
    return finalPackage;
  }
  return finalPackage;
}

function findType(t: any, root: any): any {
  let pkgName;
  if (t.parent) {
    pkgName = recursiveResolvePath(t, '');
  }
  if (pkgName.charAt(0) === '.') {
    pkgName = pkgName.substring(1);
  }

  const files = _.keys(root.files);
  let foundAst;
  const foundFile = _.find(files, (file) => {
    const protoFilepath = root.files[file];
    let ast: any = protoBuf.parse(fs.readFileSync(protoFilepath).toString(), new protoBuf.Root());
    if (pkgName === ast.package) {
      foundAst = ast;
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
  const nestedType = _.map(message.nested, (type) => {
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
  const messages = _.map(ast.root.nested, createDescriptorProto);
  return {
    name: ast.root.name,
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

function applyProtoRoot(filename, root) {
  if (_.isString(filename)) {
    return filename;
  }
  filename.root = path.resolve(filename.root) + '/';
  root.resolvePath = function (originPath, importPath, alreadyNormalized) {
    return protoBuf.util.path.resolve(filename.root, importPath, alreadyNormalized);
  };
  return filename.file;
}
/**
 * An implementation of the grpc.reflection.v1alpha.ServerReflection service.
 * Uses the provided builder and config to reflection on served endpoints.
 */
export class ServerReflection {

  root: protoBuf.Root;
  config: any;

  /**
   * @param (ProtoBuf.Builder) The protobuf builder  which the gRPC transport provider is using.
   * @config (Object) Server cofnig.
   */
  constructor(root: protoBuf.Root, config: any) {
    // this.builder = builder;
    root = new protoBuf.Root();
    let protoroot = config.transports[0].protoRoot;
    let files = config.transports[0].protos;
    _.forEach(files, (fileName, key) => {
      let filename = { root: protoroot, file: fileName };
      root.loadSync(applyProtoRoot(filename, root));
    });
    this.root = root;
    this.config = config;
  }

  /**
   * Service endpoint for gRPC ServerReflectionInfo.
   */
  async serverReflectionInfo(call?: any, context?: any): Promise<any> {
    const logger = context.logger;
    let openCall = true;
    let req;
    while (openCall) {
      try {
        req = await call.read();
        req = await new Promise((resolve, reject) => {
          req((err, response) => {
            if (err) {
              reject(err);
            }
            resolve(response);
          });
        });
      } catch (error) {
        if (error.message === 'stream end') {
          await call.end();
          return;
        }
        logger.error('Error reading stream on serverReflectionInfo', error);
        continue;
      }
      const methodName = req.message_request;
      delete req.message_request;
      req = _.omitBy(req, isEmpty);
      if (_.isNil(methodName)) {
        logger.info('empty message_request', req);
        await call.write({
          valid_host: req.host,
          original_request: req,
          error_response: {
            error_code: grpc.status.INVALID_ARGUMENT,
            error_message: 'message_request is empty',
          },
        });
        continue;
      }
      const methodArg = req[methodName];
      let method;
      switch (`${methodName}`) {
        case 'file_by_filename':
          method = this.fileByFileName(methodArg, req);
          break;
        case 'file_containing_symbol':
          method = this.findProtoFileByPath(methodArg, req);
          break;
        case 'file_containing_extension':
          method = this.fileContainingExtension(methodArg, req);
          break;
        case 'all_extension_numbers_of_type':
          method = this.allExtensionNumbersOfType(methodArg, req);
          break;
        case 'list_services':
          method = this.listServices(req);
          break;
        // allExtensionNumbersOfType
        default:
          logger.info(`method ${methodName} does not exist`, req);
          await call.write({
            valid_host: req.host,
            original_request: req,
            error_response: {
              error_code: grpc.status.UNIMPLEMENTED,
              error_message: `method ${methodName} does not exist`,
            },
          });
          continue;
      }
      try {
        const result = await method;
        await call.write(result);
        openCall = false;
      } catch (error) {
        openCall = false;
        logger.info(error);
        break;
      }
    }
    await call.end();
  }

  /**
   * Find a proto file by the file name.
   */
  fileByFileName(fileName: string, req: any): any {
    const files = _.keys(this.root.files);
    const file = _.find(files, (path) => {
      return _.endsWith(this.root.files[path], fileName);
    });
    if (_.isNil(file)) {
      return {
        valid_host: req.host,
        error_response: {
          error_code: grpc.status.NOT_FOUND,
          error_message: `file ${fileName} does not exist`,
        },
      };
    }
    const FileDescriptorProto: any = this.root.lookupType('google.protobuf.FileDescriptorProto');
    const protoFilepath = this.root.files[file];
    const ast: any = protoBuf.parse(fs.readFileSync(protoFilepath).toString(), new protoBuf.Root());
    if (_.isNil(FileDescriptorProto)) {
      throw new Error('Could not find google.protobuf.FileDescriptorProto');
    }
    const fdp = createFileDescriptorProto(protoFilepath, ast);
    const fDescProto = FileDescriptorProto.create(fdp);
    return {
      valid_host: req.host,
      original_request: req,
      file_descriptor_response: {
        file_descriptor_proto: Buffer.from(JSON.stringify(fDescProto)),
      },
    };
  }

  /**
   * Find a proto file by a symbol.
   *
   * @param {string} path Path to symbol
   * Format:  <package>.<service>[.<method>] or <package>.<type>)
   */
  findProtoFileByPath(path: string, req: any): any {
    const t = this.root.lookup(path);
    if (_.isNil(t)) {
      return {
        valid_host: req.host, // TODO Is this correct?
        original_request: req,
        error_response: {
          error_code: grpc.status.NOT_FOUND,
          error_message: `symbol ${path} not found`,
        },
      };
    }
    const res = findType(t, this.root);
    let FileDescriptorProto;
    const fileDescriptorRoot = protoBuf.loadSync('node_modules/@restorecommerce/protos/google/protobuf/descriptor.proto');
    FileDescriptorProto = fileDescriptorRoot.lookupType('google.protobuf.FileDescriptorProto');
    if (_.isNil(FileDescriptorProto)) {
      throw new Error('Could not find google.protobuf.FileDescriptorProto');
    }
    const fdp = createFileDescriptorProto(res.file, res.ast);
    const fDescProto = FileDescriptorProto.create(fdp);
    return {
      valid_host: req.host,
      original_request: req,
      file_descriptor_response: {
        file_descriptor_proto: Buffer.from(JSON.stringify(fDescProto)),
      },
    };
  }

  /**
   * Find the proto file which defines an extension extending the given
   * message type with the given field number.
   */
  fileContainingExtension(arg: any, req: any): any {
    const path = arg.containing_type;
    const t: any = this.root.lookupType(path);
    const id = arg.extension_number;
    if (_.isNil(t)) {
      return {
        valid_host: req.host,
        original_request: req,
        error_response: {
          error_code: grpc.status.NOT_FOUND,
          error_message: `symbol ${path} not found`,
        },
      };
    }

    let ids = _.map(t.fields, (field) => {
      return field.id;
    });

    if (ids.indexOf(id) > -1) {
      console.log('Extension number is being used');
    } else {
      // extension_number is not being used, so return error message
      return {
        validHost: req.host,
        originalRequest: req,
        errorResponse: {
          errorCode: grpc.status.NOT_FOUND,
          errorMessage: `extension number ${id} is not used`,
        },
      };
    }
    const res = findType(t, this.root);
    const FileDescriptorProto: any = this.root.lookupType('google.protobuf.FileDescriptorProto');
    if (_.isNil(FileDescriptorProto)) {
      throw new Error('Could not find google.protobuf.FileDescriptorProto');
    }
    const fdp = createFileDescriptorProto(res.file, res.ast);
    const fDescProto = FileDescriptorProto.create(fdp);
    return {
      valid_host: req.host,
      original_request: req,
      file_descriptor_response: {
        file_descriptor_proto: Buffer.from(JSON.stringify(fDescProto)),
      },
    };
  }

  allExtensionNumbersOfType(path: string, req: any): any {
    const t: any = this.root.lookup(path);
    if (_.isNil(t)) {
      return {
        valid_host: req.host,
        original_request: req,
        error_response: {
          error_code: grpc.status.NOT_FOUND,
          error_message: `symbol ${path} not found`,
        },
      };
    }
    // Iterate through each of fields and get the ID.
    let ids = _.map(t.fields, (field) => {
      return field.id;
    });
    return {
      valid_host: req.host,
      original_request: req,
      all_extension_numbers_response: {
        base_type_name: t.fullName,
        extension_number: ids,
      },
    };
  }

  /**
   * Lists all gRPC provided services.
   * NOTE: Services using other transport providers are not listed.
   */
  listServices(req: any): any {
    const transports = _.filter(this.config.transports, { provider: 'grpc' });
    let services = [];
    _.forEach(transports, (transport: any) => {
      const srvs = _.values(transport.services);
      if (_.includes(srvs, 'grpc.reflection.v1alpha.ServerReflection')) {
        services = _.concat(services, transport.services);
      }
    });
    services = _.uniq(services);
    let labelSrvMapping = [];
    services = _.map(services, (service) => {
      // Map the service label to name of the serivce
      for (let key in service) {
        if (service.hasOwnProperty(key)) {
          const obj = {
            label: key,
            name: service[key]
          };
          labelSrvMapping.push(obj);
        }
      }
      return labelSrvMapping;
    });
    return {
      valid_host: req.host,
      original_request: req,
      list_services_response: {
        service: services[0],
      },
    };
  }
}
