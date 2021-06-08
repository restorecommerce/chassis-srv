import * as should from 'should';
import * as _ from 'lodash';
import { createLogger } from '@restorecommerce/logger';
import * as chassis from '../src';
import { grpc } from '../src';
import { Server } from '../src/microservice/server';
import { GrpcClient } from '@restorecommerce/grpc-client';
import * as sleep from 'sleep';
import { Observable } from 'rxjs';
import { resolve } from 'dns';


/* global describe it before after*/

const chunkSize = 1 << 10;

const bufferToObservable = (buffer: Buffer, key): any => {
  return new Observable((subscriber) => {
    for (let i = 0; i < Math.ceil(buffer.length / chunkSize); i++) {
      subscriber.next({
        [key]: buffer.slice(i * chunkSize, (i + 1) * chunkSize)
      });
    }
    subscriber.complete();
  });
};

describe('binding the grpc.ServerReflection service', () => {
  let server: Server;
  before(async () => {
    await chassis.config.load(process.cwd() + '/test');
    const cfg = await chassis.config.get();
    const logger = createLogger(cfg.get('logger'));
    server = new Server(cfg.get('server'), logger);
    const transportName: string = cfg.get('server:services:reflection:serverReflectionInfo:transport:0');
    const transport = server.transport[transportName];
    let root;
    const reflectionService: chassis.ServerReflection =
      new grpc.ServerReflection(root, server.config);
    await server.bind('reflection', reflectionService);
    await server.start();
    sleep.sleep(1);
  });

  after(async function end() {
    this.timeout(4000);
    await server.stop();
    sleep.sleep(2);
  });
  it('should provide an endpoint ServerReflectionInfo',
    async () => {
      const cfg = await chassis.config.get();
      const logger = createLogger(cfg.get('logger'));
      const client = new GrpcClient(cfg.get('client:reflection'), logger);
      const reflectionClient: chassis.ServerReflection = client.reflection;
      const reflection = await reflectionClient.serverReflectionInfo();
      await client.close();
    });
  describe('calling endpoint ServerReflectionInfo', () => {
    let client: GrpcClient;
    let serverReflectionInfo;
    let reflectionService;
    beforeEach(async () => {
      const cfg = await chassis.config.get();
      const logger = createLogger(cfg.get('logger'));
      client = new GrpcClient(cfg.get('client:reflection'), logger);
      reflectionService = client.reflection;
      serverReflectionInfo = await reflectionService.serverReflectionInfo();
    });
    afterEach(async () => {
      await client.close();
    });
    describe('with fileByFilename request', () => {
      it('should return file by file name response',
        async () => {
          let buff = Buffer.from('test.proto');
          let result = await reflectionService.serverReflectionInfo(bufferToObservable(buff, 'file_by_filename'));
          let response;
          await new Promise((resolve, reject) => {
            result.subscribe(data => {
              response = data;
            }, undefined, () => {
              should.exist(response.file_descriptor_response);
              should.exist(response.file_descriptor_response.file_descriptor_proto);
              response.file_descriptor_response.file_descriptor_proto.should.be.length(1);
              resolve(response);
            });
          });
        });
    });
    describe('with fileContainingSymbol request', () => {
      it('should return file containing path / symbol response',
        async () => {
          let buff = Buffer.from('test.Test');
          let result = await reflectionService.serverReflectionInfo(bufferToObservable(buff, 'file_containing_symbol'));
          let resp;
          await new Promise((resolve, reject) => {
            result.subscribe(data => {
              resp = data;
            }, undefined, () => {
              should.exist(resp);
              should.exist(resp.file_descriptor_response);
              should.exist(resp.file_descriptor_response.file_descriptor_proto);
              resp.file_descriptor_response.file_descriptor_proto.should.be.length(1);
              resolve(resp);
            });
          });
        });
    });
    // TODO - data not received on file_containing extension
    // describe('with fileContainingExtension request', () => {
    //   it('should return file extension response',
    //     async () => {
    //       let buff = Buffer.from(JSON.stringify({
    //         containing_type: 'test.ExtendMe',
    //         extension_number: 126,
    //       }));
    //       let result = await reflectionService.serverReflectionInfo(bufferToObservable(buff, 'file_containing_extension'));
    //       let resp;
    //       await new Promise((resolve, reject) => {
    //         result.subscribe(data => {
    //           resp = data;
    //         }, undefined, () => {
    //           should.exist(resp);
    //           should.exist(resp.file_descriptor_response);
    //           should.exist(resp.file_descriptor_response.file_descriptor_proto);
    //           resp.file_descriptor_response.file_descriptor_proto.should.be.length(1);
    //           resolve(resp);
    //         });
    //       });
    //     });
    // });
    describe('with allExtensionNumbersOfType request', () => {
      it('should get allExtensionsNumbers response',
        async () => {
          let buff = Buffer.from('test.ExtendMe');
          let result = await reflectionService.serverReflectionInfo(bufferToObservable(buff, 'all_extension_numbers_of_type'));
          let resp;
          await new Promise((resolve, reject) => {
            result.subscribe(data => {
              resp = data;
            }, undefined, () => {
              should.exist(resp);
              should.exist(resp.all_extension_numbers_response);
              should.exist(resp.all_extension_numbers_response.base_type_name);
              // The response from the Reflection service for full name includes a leading dot.
              resp.all_extension_numbers_response.base_type_name.should.equal('.test.ExtendMe');
              should.exist(resp.all_extension_numbers_response.extension_number);
              resp.all_extension_numbers_response.extension_number.should.be.length(1);
              resp.all_extension_numbers_response.extension_number[0].should.equal(126);
              resolve(resp);
            });
          });
        });
    });
    describe('with listServices request', () => {
      it('should list all exposed services',
        async () => {
          let buff = Buffer.from(JSON.stringify(''));
          let result = await reflectionService.serverReflectionInfo(bufferToObservable(buff, 'list_services'));
          let resp;
          const cfg = await chassis.config.get();
          const services = cfg.get('server:services');
          await new Promise((resolve, reject) => {
            result.subscribe(data => {
              resp = data;
            }, undefined, () => {
              should.exist(resp);
              should.exist(resp.list_services_response);
              should.exist(resp.list_services_response.service);
              // since the cfg includes 'not_bound' service which is not implemented
              resp.list_services_response.service.should.be.length(_.size(services) - 1);
              resolve(resp);
            });
          });
        });
    });
  });
});
