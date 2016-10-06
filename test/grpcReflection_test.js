'use strict';

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const mocha = require('mocha');
const coMocha = require('co-mocha');

coMocha(mocha);

const should = require('should');
const _ = require('lodash');
const logger = require('./logger_test.js');

const chassis = require('../');

const grpc = chassis.microservice.transport.provider.grpc;
const Server = chassis.microservice.Server;
const Client = chassis.microservice.Client;

/* global describe it beforeEach afterEach*/

describe('binding the grpc.ServerReflection service', () => {
  let server;
  beforeEach(function* start() {
    yield chassis.config.load(process.cwd() + '/test', logger);
    const cfg = yield chassis.config.get();
    server = new Server(cfg.get('server'));
    const transportName = cfg.get('server:services:reflection:serverReflectionInfo:transport:0');
    const transport = server.transport[transportName];
    const reflectionService = new grpc.ServerReflection(transport.$builder, server.$config);
    yield server.bind('reflection', reflectionService);
    yield server.start();
  });
  afterEach(function* end() {
    yield server.end();
  });
  it('should provide an endpoint ServerReflectionInfo', function* checkEndpoint() {
    const cfg = yield chassis.config.get();
    const client = new Client(cfg.get('client:reflection'));
    const reflectionClient = yield client.connect();
    const reflection = yield reflectionClient.serverReflectionInfo();
    yield reflection.end();
    yield client.end();
  });
  describe('calling endpoint ServerReflectionInfo', () => {
    let client;
    let serverReflectionInfo;
    beforeEach(function* connect() {
      const cfg = yield chassis.config.get();
      client = new Client(cfg.get('client:reflection'));
      const reflection = yield client.connect();
      serverReflectionInfo = yield reflection.serverReflectionInfo();
    });
    afterEach(function* disconnect() {
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
