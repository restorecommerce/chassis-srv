'use strict';

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const mocha = require('mocha');
const coMocha = require('co-mocha');

coMocha(mocha);

const should = require('should');
const _ = require('lodash');
const logger = require('./logger_test.js');


import * as chassis from '../lib';
import {grpc} from '../lib';
import {Server} from '../lib/microservice/server';
import {Client} from '../lib/microservice/client';


/* global describe it before after*/

describe('binding the grpc.ServerReflection service', () => {
  let server: Server;
  before(function* start() {
    yield chassis.config.load(process.cwd() + '/test', logger);
    const cfg = yield chassis.config.get();
    server = new Server(cfg.get('server'));
    const transportName: string = cfg.get('server:services:reflection:serverReflectionInfo:transport:0');
    const transport = server.transport[transportName];
    const reflectionService: chassis.ServerReflection =
              new grpc.ServerReflection(transport.builder, server.config);
    yield server.bind('reflection', reflectionService);
    yield server.start();
  });

  after(function* end() {
    yield server.end();
  });
  it('should provide an endpoint ServerReflectionInfo', function* checkEndpoint() {
    const cfg = yield chassis.config.get();
    const client: chassis.Client = new Client(cfg.get('client:reflection'));
    const reflectionClient: chassis.ServerReflection = yield client.connect();
    const reflection = yield reflectionClient.serverReflectionInfo();
    yield reflection.end();
    yield client.end();
  });
  describe('calling endpoint ServerReflectionInfo', () => {
    let client: chassis.Client;
    let serverReflectionInfo;
    before(function* connect() {
      const cfg = yield chassis.config.get();
      client = new Client(cfg.get('client:reflection'));
      const reflection: chassis.ServerReflection = yield client.connect();
      serverReflectionInfo = yield reflection.serverReflectionInfo();
    });
    after(function* disconnect() {
      yield serverReflectionInfo.end();
      yield client.end();
    });
    describe('with fileByFilename request', () => {
      it('should', function* checkFileByFilename() {
        yield serverReflectionInfo.write({
          fileByFilename: 'test.proto',
        });
        const resp = yield serverReflectionInfo.read();
        should.exist(resp);
        should.exist(resp.fileDescriptorResponse);
        should.exist(resp.fileDescriptorResponse.fileDescriptorProto);
        resp.fileDescriptorResponse.fileDescriptorProto.should.be.length(1);
      });
    });
    describe('with fileContainingSymbol request', () => {
      it('should', function* checkFileByFilename() {
        yield serverReflectionInfo.write({
          fileContainingSymbol: 'test.Test',
        });
        const resp = yield serverReflectionInfo.read();
        should.exist(resp);
        should.exist(resp.fileDescriptorResponse);
        should.exist(resp.fileDescriptorResponse.fileDescriptorProto);
        resp.fileDescriptorResponse.fileDescriptorProto.should.be.length(1);
      });
    });
    describe('with fileContainingExtension request', () => {
      it('should', function* checkFileByFilename() {
        yield serverReflectionInfo.write({
          fileContainingExtension: {
            containingType: 'test.ExtendMe',
            extensionNumber: 126,
          },
        });
        const resp = yield serverReflectionInfo.read();
        should.exist(resp);
        should.exist(resp.fileDescriptorResponse);
        should.exist(resp.fileDescriptorResponse.fileDescriptorProto);
        resp.fileDescriptorResponse.fileDescriptorProto.should.be.length(1);
      });
    });
    describe('with allExtensionNumbersOfType request', () => {
      it('should', function* checkFileByFilename() {
        yield serverReflectionInfo.write({
          allExtensionNumbersOfType: 'test.ExtendMe',
        });
        const resp = yield serverReflectionInfo.read();
        should.exist(resp);
        should.exist(resp.allExtensionNumbersResponse);
        should.exist(resp.allExtensionNumbersResponse.baseTypeName);
        resp.allExtensionNumbersResponse.baseTypeName.should.equal('test.ExtendMe');
        should.exist(resp.allExtensionNumbersResponse.extensionNumber);
        resp.allExtensionNumbersResponse.extensionNumber.should.be.length(1);
        resp.allExtensionNumbersResponse.extensionNumber[0].should.equal(126);
      });
    });
    describe('with listServices request', () => {
      it('should', function* checkFileByFilename() {
        yield serverReflectionInfo.write({
          listServices: '',
        });
        const resp = yield serverReflectionInfo.read();
        should.exist(resp);
        should.exist(resp.listServicesResponse);
        should.exist(resp.listServicesResponse.service);
        const cfg = yield chassis.config.get();
        const services = cfg.get('server:services');
        resp.listServicesResponse.service.should.be.length(_.size(services));
      });
    });
  });
});
