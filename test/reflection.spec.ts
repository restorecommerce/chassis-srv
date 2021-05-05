import * as should from 'should';
import * as _ from 'lodash';
import { createLogger } from '@restorecommerce/logger';
import * as chassis from '../src';
import { grpc } from '../src';
import { Server } from '../src/microservice/server';
import { Client } from '@restorecommerce/grpc-client';
import * as sleep from 'sleep';


/* global describe it before after*/

describe('binding the grpc.ServerReflection service', () => {
  let server: Server;
  before(async function start() {
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
    async function checkEndpoint() {
      const cfg = await chassis.config.get();
      const logger = createLogger(cfg.get('logger'));
      const client: Client = new Client(cfg.get('client:reflection'), logger);
      const reflectionClient: chassis.ServerReflection = await client.connect();
      const reflection = await reflectionClient.serverReflectionInfo();
      await reflection.end();
      await client.end();
    });
  describe('calling endpoint ServerReflectionInfo', () => {
    let client: Client;
    let serverReflectionInfo;
    beforeEach(async function connect() {
      const cfg = await chassis.config.get();
      const logger = createLogger(cfg.get('logger'));
      client = new Client(cfg.get('client:reflection'), logger);
      const reflection: chassis.ServerReflection = await client.connect();
      serverReflectionInfo = await reflection.serverReflectionInfo();
    });
    afterEach(async function disconnect() {
      await serverReflectionInfo.end();
      await client.end();
    });
    describe('with fileByFilename request', () => {
      it('should return file by file name response',
        async function checkFileByFilename() {
          await serverReflectionInfo.write({
            file_by_filename: 'test.proto',
          });
          let resp = await serverReflectionInfo.read();
          resp = await new Promise((resolve, reject) => {
            resp((err, response) => {
              if (err)
                reject(err);
              resolve(response);
            });
          });
          should.exist(resp);
          should.exist(resp.file_descriptor_response);
          should.exist(resp.file_descriptor_response.file_descriptor_proto);
          resp.file_descriptor_response.file_descriptor_proto.should.be.length(1);
        });
    });
    describe('with fileContainingSymbol request', () => {
      it('should return file containing path / symbol response',
        async function checkFileContainingSymbol() {
          await serverReflectionInfo.write({
            file_containing_symbol: 'test.Test',
          });
          let resp = await serverReflectionInfo.read();
          resp = await new Promise((resolve, reject) => {
            resp((err, response) => {
              if (err)
                reject(err);
              resolve(response);
            });
          });
          should.exist(resp);
          should.exist(resp.file_descriptor_response);
          should.exist(resp.file_descriptor_response.file_descriptor_proto);
          resp.file_descriptor_response.file_descriptor_proto.should.be.length(1);
        });
    });
    describe('with fileContainingExtension request', () => {
      it('should return file extension response',
        async function checkFileContainingExtension() {
          await serverReflectionInfo.write({
            file_containing_extension: {
              containing_type: 'test.ExtendMe',
              extension_number: 126,
            },
          });
          let resp = await serverReflectionInfo.read();
          resp = await new Promise((resolve, reject) => {
            resp((err, response) => {
              if (err)
                reject(err);
              resolve(response);
            });
          });
          should.exist(resp);
          should.exist(resp.file_descriptor_response);
          should.exist(resp.file_descriptor_response.file_descriptor_proto);
          resp.file_descriptor_response.file_descriptor_proto.should.be.length(1);
        });
    });
    describe('with allExtensionNumbersOfType request', () => {
      it('should get allExtensionsNumbers response',
        async function checkallExtensionNumbersOfType() {
          await serverReflectionInfo.write({
            all_extension_numbers_of_type: 'test.ExtendMe',
          });
          let resp = await serverReflectionInfo.read();
          resp = await new Promise((resolve, reject) => {
            resp((err, response) => {
              if (err)
                reject(err);
              resolve(response);
            });
          });
          should.exist(resp);
          should.exist(resp.all_extension_numbers_response);
          should.exist(resp.all_extension_numbers_response.base_type_name);
          // The response from the Reflection service for full name includes a leading dot.
          resp.all_extension_numbers_response.base_type_name.should.equal('.test.ExtendMe');
          should.exist(resp.all_extension_numbers_response.extension_number);
          resp.all_extension_numbers_response.extension_number.should.be.length(1);
          resp.all_extension_numbers_response.extension_number[0].should.equal(126);
        });
    });
    describe('with listServices request', () => {
      it('should list all exposed services',
        async function listAllServices() {
          await serverReflectionInfo.write({
            list_services: '',
          });
          let resp = await serverReflectionInfo.read();
          resp = await new Promise((resolve, reject) => {
            resp((err, response) => {
              if (err)
                reject(err);
              resolve(response);
            });
          });
          should.exist(resp);
          should.exist(resp.list_services_response);
          should.exist(resp.list_services_response.service);
          const cfg = await chassis.config.get();
          const services = cfg.get('server:services');
          // since the cfg includes 'not_bound' service which is not implemented
          resp.list_services_response.service.should.be.length(_.size(services) - 1);
        });
    });
  });
});
