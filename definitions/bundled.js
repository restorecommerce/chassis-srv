/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader,
    $Writer = $protobuf.Writer,
    $util   = $protobuf.util;

// Lazily resolved type references
var $lazyTypes = [];

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.test = (function() {

    /**
     * Namespace test.
     * @exports test
     * @namespace
     */
    var test = {};

    test.Test = (function() {

        /**
         * Constructs a new Test service.
         * @exports test.Test
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function Test(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (Test.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Test;

        /**
         * Creates new Test service using the specified rpc implementation.
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {Test} RPC service. Useful where requests and/or responses are streamed.
         */
        Test.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link Test#test}.
         * @typedef Test_test_Callback
         * @type {function}
         * @param {?Error} error Error, if any
         * @param {test.TestResponse} [response] TestResponse
         */

        /**
         * Calls Test.
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @param {Test_test_Callback} callback Node-style callback called with the error, if any, and TestResponse
         * @returns {undefined}
         */
        Test.prototype.test = function test(request, callback) {
            return this.rpcCall(test, $root.test.TestRequest, $root.test.TestResponse, request, callback);
        };

        /**
         * Calls Test.
         * @name Test#test
         * @function
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @returns {Promise<test.TestResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link Test#throw_}.
         * @typedef Test_throw__Callback
         * @type {function}
         * @param {?Error} error Error, if any
         * @param {test.TestResponse} [response] TestResponse
         */

        /**
         * Calls Throw.
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @param {Test_throw__Callback} callback Node-style callback called with the error, if any, and TestResponse
         * @returns {undefined}
         */
        Test.prototype["throw"] = function throw_(request, callback) {
            return this.rpcCall(throw_, $root.test.TestRequest, $root.test.TestResponse, request, callback);
        };

        /**
         * Calls Throw.
         * @name Test#throw
         * @function
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @returns {Promise<test.TestResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link Test#notImplemented}.
         * @typedef Test_notImplemented_Callback
         * @type {function}
         * @param {?Error} error Error, if any
         * @param {test.TestResponse} [response] TestResponse
         */

        /**
         * Calls NotImplemented.
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @param {Test_notImplemented_Callback} callback Node-style callback called with the error, if any, and TestResponse
         * @returns {undefined}
         */
        Test.prototype.notImplemented = function notImplemented(request, callback) {
            return this.rpcCall(notImplemented, $root.test.TestRequest, $root.test.TestResponse, request, callback);
        };

        /**
         * Calls NotImplemented.
         * @name Test#notImplemented
         * @function
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @returns {Promise<test.TestResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link Test#notFound}.
         * @typedef Test_notFound_Callback
         * @type {function}
         * @param {?Error} error Error, if any
         * @param {test.TestResponse} [response] TestResponse
         */

        /**
         * Calls NotFound.
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @param {Test_notFound_Callback} callback Node-style callback called with the error, if any, and TestResponse
         * @returns {undefined}
         */
        Test.prototype.notFound = function notFound(request, callback) {
            return this.rpcCall(notFound, $root.test.TestRequest, $root.test.TestResponse, request, callback);
        };

        /**
         * Calls NotFound.
         * @name Test#notFound
         * @function
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @returns {Promise<test.TestResponse>} Promise
         * @variation 2
         */

        return Test;
    })();

    test.Stream = (function() {

        /**
         * Constructs a new Stream service.
         * @exports test.Stream
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function Stream(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (Stream.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Stream;

        /**
         * Creates new Stream service using the specified rpc implementation.
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {Stream} RPC service. Useful where requests and/or responses are streamed.
         */
        Stream.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link Stream#biStream}.
         * @typedef Stream_biStream_Callback
         * @type {function}
         * @param {?Error} error Error, if any
         * @param {test.TestResponse} [response] TestResponse
         */

        /**
         * Calls BiStream.
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @param {Stream_biStream_Callback} callback Node-style callback called with the error, if any, and TestResponse
         * @returns {undefined}
         */
        Stream.prototype.biStream = function biStream(request, callback) {
            return this.rpcCall(biStream, $root.test.TestRequest, $root.test.TestResponse, request, callback);
        };

        /**
         * Calls BiStream.
         * @name Stream#biStream
         * @function
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @returns {Promise<test.TestResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link Stream#responseStream}.
         * @typedef Stream_responseStream_Callback
         * @type {function}
         * @param {?Error} error Error, if any
         * @param {test.TestResponse} [response] TestResponse
         */

        /**
         * Calls ResponseStream.
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @param {Stream_responseStream_Callback} callback Node-style callback called with the error, if any, and TestResponse
         * @returns {undefined}
         */
        Stream.prototype.responseStream = function responseStream(request, callback) {
            return this.rpcCall(responseStream, $root.test.TestRequest, $root.test.TestResponse, request, callback);
        };

        /**
         * Calls ResponseStream.
         * @name Stream#responseStream
         * @function
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @returns {Promise<test.TestResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link Stream#requestStream}.
         * @typedef Stream_requestStream_Callback
         * @type {function}
         * @param {?Error} error Error, if any
         * @param {test.TestResponse} [response] TestResponse
         */

        /**
         * Calls RequestStream.
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @param {Stream_requestStream_Callback} callback Node-style callback called with the error, if any, and TestResponse
         * @returns {undefined}
         */
        Stream.prototype.requestStream = function requestStream(request, callback) {
            return this.rpcCall(requestStream, $root.test.TestRequest, $root.test.TestResponse, request, callback);
        };

        /**
         * Calls RequestStream.
         * @name Stream#requestStream
         * @function
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @returns {Promise<test.TestResponse>} Promise
         * @variation 2
         */

        return Stream;
    })();

    test.TestRequest = (function() {

        /**
         * Constructs a new TestRequest.
         * @exports test.TestRequest
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        function TestRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    this[keys[i]] = properties[keys[i]];
        }

        /**
         * TestRequest value.
         * @type {string}
         */
        TestRequest.prototype.value = "";

        /**
         * Creates a new TestRequest instance using the specified properties.
         * @param {Object} [properties] Properties to set
         * @returns {test.TestRequest} TestRequest instance
         */
        TestRequest.create = function create(properties) {
            return new TestRequest(properties);
        };

        /**
         * Encodes the specified TestRequest message.
         * @param {test.TestRequest|Object} message TestRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TestRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.value !== undefined && message.hasOwnProperty("value"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.value);
            return writer;
        };

        /**
         * Encodes the specified TestRequest message, length delimited.
         * @param {test.TestRequest|Object} message TestRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TestRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TestRequest message from the specified reader or buffer.
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {test.TestRequest} TestRequest
         */
        TestRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.test.TestRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.value = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TestRequest message from the specified reader or buffer, length delimited.
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {test.TestRequest} TestRequest
         */
        TestRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TestRequest message.
         * @param {test.TestRequest|Object} message TestRequest message or plain object to verify
         * @returns {?string} `null` if valid, otherwise the reason why it is not
         */
        TestRequest.verify = function verify(message) {
            if (message.value !== undefined)
                if (!$util.isString(message.value))
                    return "value: string expected";
            return null;
        };

        /**
         * Creates a TestRequest message from a plain object. Also converts values to their respective internal types.
         * @param {Object.<string,*>} object Plain object
         * @returns {test.TestRequest} TestRequest
         */
        TestRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.test.TestRequest)
                return object;
            var message = new $root.test.TestRequest();
            if (object.value !== undefined && object.value !== null)
                message.value = String(object.value);
            return message;
        };

        /**
         * Creates a TestRequest message from a plain object. Also converts values to their respective internal types.
         * This is an alias of {@link test.TestRequest.fromObject}.
         * @function
         * @param {Object.<string,*>} object Plain object
         * @returns {test.TestRequest} TestRequest
         */
        TestRequest.from = TestRequest.fromObject;

        /**
         * Creates a plain object from a TestRequest message. Also converts values to other types if specified.
         * @param {test.TestRequest} message TestRequest
         * @param {$protobuf.ConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TestRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.value = "";
            if (message.value !== undefined && message.value !== null && message.hasOwnProperty("value"))
                object.value = message.value;
            return object;
        };

        /**
         * Creates a plain object from this TestRequest message. Also converts values to other types if specified.
         * @param {$protobuf.ConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TestRequest.prototype.toObject = function toObject(options) {
            return this.constructor.toObject(this, options);
        };

        /**
         * Converts this TestRequest to JSON.
         * @returns {Object.<string,*>} JSON object
         */
        TestRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TestRequest;
    })();

    test.TestResponse = (function() {

        /**
         * Constructs a new TestResponse.
         * @exports test.TestResponse
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        function TestResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    this[keys[i]] = properties[keys[i]];
        }

        /**
         * TestResponse result.
         * @type {string}
         */
        TestResponse.prototype.result = "";

        /**
         * Creates a new TestResponse instance using the specified properties.
         * @param {Object} [properties] Properties to set
         * @returns {test.TestResponse} TestResponse instance
         */
        TestResponse.create = function create(properties) {
            return new TestResponse(properties);
        };

        /**
         * Encodes the specified TestResponse message.
         * @param {test.TestResponse|Object} message TestResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TestResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.result !== undefined && message.hasOwnProperty("result"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.result);
            return writer;
        };

        /**
         * Encodes the specified TestResponse message, length delimited.
         * @param {test.TestResponse|Object} message TestResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TestResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TestResponse message from the specified reader or buffer.
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {test.TestResponse} TestResponse
         */
        TestResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.test.TestResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TestResponse message from the specified reader or buffer, length delimited.
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {test.TestResponse} TestResponse
         */
        TestResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TestResponse message.
         * @param {test.TestResponse|Object} message TestResponse message or plain object to verify
         * @returns {?string} `null` if valid, otherwise the reason why it is not
         */
        TestResponse.verify = function verify(message) {
            if (message.result !== undefined)
                if (!$util.isString(message.result))
                    return "result: string expected";
            return null;
        };

        /**
         * Creates a TestResponse message from a plain object. Also converts values to their respective internal types.
         * @param {Object.<string,*>} object Plain object
         * @returns {test.TestResponse} TestResponse
         */
        TestResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.test.TestResponse)
                return object;
            var message = new $root.test.TestResponse();
            if (object.result !== undefined && object.result !== null)
                message.result = String(object.result);
            return message;
        };

        /**
         * Creates a TestResponse message from a plain object. Also converts values to their respective internal types.
         * This is an alias of {@link test.TestResponse.fromObject}.
         * @function
         * @param {Object.<string,*>} object Plain object
         * @returns {test.TestResponse} TestResponse
         */
        TestResponse.from = TestResponse.fromObject;

        /**
         * Creates a plain object from a TestResponse message. Also converts values to other types if specified.
         * @param {test.TestResponse} message TestResponse
         * @param {$protobuf.ConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TestResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.result = "";
            if (message.result !== undefined && message.result !== null && message.hasOwnProperty("result"))
                object.result = message.result;
            return object;
        };

        /**
         * Creates a plain object from this TestResponse message. Also converts values to other types if specified.
         * @param {$protobuf.ConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TestResponse.prototype.toObject = function toObject(options) {
            return this.constructor.toObject(this, options);
        };

        /**
         * Converts this TestResponse to JSON.
         * @returns {Object.<string,*>} JSON object
         */
        TestResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TestResponse;
    })();

    test.TestEvent = (function() {

        /**
         * Constructs a new TestEvent.
         * @exports test.TestEvent
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        function TestEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    this[keys[i]] = properties[keys[i]];
        }

        /**
         * TestEvent value.
         * @type {string}
         */
        TestEvent.prototype.value = "";

        /**
         * TestEvent count.
         * @type {number}
         */
        TestEvent.prototype.count = 0;

        /**
         * Creates a new TestEvent instance using the specified properties.
         * @param {Object} [properties] Properties to set
         * @returns {test.TestEvent} TestEvent instance
         */
        TestEvent.create = function create(properties) {
            return new TestEvent(properties);
        };

        /**
         * Encodes the specified TestEvent message.
         * @param {test.TestEvent|Object} message TestEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TestEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.value !== undefined && message.hasOwnProperty("value"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.value);
            if (message.count !== undefined && message.hasOwnProperty("count"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.count);
            return writer;
        };

        /**
         * Encodes the specified TestEvent message, length delimited.
         * @param {test.TestEvent|Object} message TestEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TestEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TestEvent message from the specified reader or buffer.
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {test.TestEvent} TestEvent
         */
        TestEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.test.TestEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.value = reader.string();
                    break;
                case 2:
                    message.count = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TestEvent message from the specified reader or buffer, length delimited.
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {test.TestEvent} TestEvent
         */
        TestEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TestEvent message.
         * @param {test.TestEvent|Object} message TestEvent message or plain object to verify
         * @returns {?string} `null` if valid, otherwise the reason why it is not
         */
        TestEvent.verify = function verify(message) {
            if (message.value !== undefined)
                if (!$util.isString(message.value))
                    return "value: string expected";
            if (message.count !== undefined)
                if (!$util.isInteger(message.count))
                    return "count: integer expected";
            return null;
        };

        /**
         * Creates a TestEvent message from a plain object. Also converts values to their respective internal types.
         * @param {Object.<string,*>} object Plain object
         * @returns {test.TestEvent} TestEvent
         */
        TestEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.test.TestEvent)
                return object;
            var message = new $root.test.TestEvent();
            if (object.value !== undefined && object.value !== null)
                message.value = String(object.value);
            if (object.count !== undefined && object.count !== null)
                message.count = object.count | 0;
            return message;
        };

        /**
         * Creates a TestEvent message from a plain object. Also converts values to their respective internal types.
         * This is an alias of {@link test.TestEvent.fromObject}.
         * @function
         * @param {Object.<string,*>} object Plain object
         * @returns {test.TestEvent} TestEvent
         */
        TestEvent.from = TestEvent.fromObject;

        /**
         * Creates a plain object from a TestEvent message. Also converts values to other types if specified.
         * @param {test.TestEvent} message TestEvent
         * @param {$protobuf.ConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TestEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.value = "";
                object.count = 0;
            }
            if (message.value !== undefined && message.value !== null && message.hasOwnProperty("value"))
                object.value = message.value;
            if (message.count !== undefined && message.count !== null && message.hasOwnProperty("count"))
                object.count = message.count;
            return object;
        };

        /**
         * Creates a plain object from this TestEvent message. Also converts values to other types if specified.
         * @param {$protobuf.ConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TestEvent.prototype.toObject = function toObject(options) {
            return this.constructor.toObject(this, options);
        };

        /**
         * Converts this TestEvent to JSON.
         * @returns {Object.<string,*>} JSON object
         */
        TestEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TestEvent;
    })();

    test.ExtendMe = (function() {

        /**
         * Constructs a new ExtendMe.
         * @exports test.ExtendMe
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        function ExtendMe(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    this[keys[i]] = properties[keys[i]];
        }

        /**
         * ExtendMe bar.
         * @type {number}
         */
        ExtendMe.prototype.bar = 0;

        /**
         * Creates a new ExtendMe instance using the specified properties.
         * @param {Object} [properties] Properties to set
         * @returns {test.ExtendMe} ExtendMe instance
         */
        ExtendMe.create = function create(properties) {
            return new ExtendMe(properties);
        };

        /**
         * Encodes the specified ExtendMe message.
         * @param {test.ExtendMe|Object} message ExtendMe message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExtendMe.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.bar !== undefined && message.hasOwnProperty("bar"))
                writer.uint32(/* id 126, wireType 0 =*/1008).int32(message.bar);
            return writer;
        };

        /**
         * Encodes the specified ExtendMe message, length delimited.
         * @param {test.ExtendMe|Object} message ExtendMe message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExtendMe.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ExtendMe message from the specified reader or buffer.
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {test.ExtendMe} ExtendMe
         */
        ExtendMe.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.test.ExtendMe();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 126:
                    message.bar = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ExtendMe message from the specified reader or buffer, length delimited.
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {test.ExtendMe} ExtendMe
         */
        ExtendMe.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ExtendMe message.
         * @param {test.ExtendMe|Object} message ExtendMe message or plain object to verify
         * @returns {?string} `null` if valid, otherwise the reason why it is not
         */
        ExtendMe.verify = function verify(message) {
            if (message.bar !== undefined)
                if (!$util.isInteger(message.bar))
                    return "bar: integer expected";
            return null;
        };

        /**
         * Creates an ExtendMe message from a plain object. Also converts values to their respective internal types.
         * @param {Object.<string,*>} object Plain object
         * @returns {test.ExtendMe} ExtendMe
         */
        ExtendMe.fromObject = function fromObject(object) {
            if (object instanceof $root.test.ExtendMe)
                return object;
            var message = new $root.test.ExtendMe();
            if (object.bar !== undefined && object.bar !== null)
                message.bar = object.bar | 0;
            return message;
        };

        /**
         * Creates an ExtendMe message from a plain object. Also converts values to their respective internal types.
         * This is an alias of {@link test.ExtendMe.fromObject}.
         * @function
         * @param {Object.<string,*>} object Plain object
         * @returns {test.ExtendMe} ExtendMe
         */
        ExtendMe.from = ExtendMe.fromObject;

        /**
         * Creates a plain object from an ExtendMe message. Also converts values to other types if specified.
         * @param {test.ExtendMe} message ExtendMe
         * @param {$protobuf.ConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ExtendMe.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.bar = 0;
            if (message.bar !== undefined && message.bar !== null && message.hasOwnProperty("bar"))
                object.bar = message.bar;
            return object;
        };

        /**
         * Creates a plain object from this ExtendMe message. Also converts values to other types if specified.
         * @param {$protobuf.ConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ExtendMe.prototype.toObject = function toObject(options) {
            return this.constructor.toObject(this, options);
        };

        /**
         * Converts this ExtendMe to JSON.
         * @returns {Object.<string,*>} JSON object
         */
        ExtendMe.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ExtendMe;
    })();

    return test;
})();

$root.io = (function() {

    /**
     * Namespace io.
     * @exports io
     * @namespace
     */
    var io = {};

    io.restorecommerce = (function() {

        /**
         * Namespace restorecommerce.
         * @exports io.restorecommerce
         * @namespace
         */
        var restorecommerce = {};

        restorecommerce.event = (function() {

            /**
             * Namespace event.
             * @exports io.restorecommerce.event
             * @namespace
             */
            var event = {};

            event.Event = (function() {

                /**
                 * Constructs a new Event.
                 * @classdesc A Kafka message event container.
                 * @exports io.restorecommerce.event.Event
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function Event(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Topic event name
                 * @type {string}
                 */
                Event.prototype.name = "";

                /**
                 * Event message
                 * @type {google.protobuf.Any}
                 */
                Event.prototype.payload = null;

                // Lazily resolved type references
                var $types = {
                    1: "google.protobuf.Any"
                }; $lazyTypes.push($types);

                /**
                 * Creates a new Event instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {io.restorecommerce.event.Event} Event instance
                 */
                Event.create = function create(properties) {
                    return new Event(properties);
                };

                /**
                 * Encodes the specified Event message.
                 * @param {io.restorecommerce.event.Event|Object} message Event message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Event.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name !== undefined && message.hasOwnProperty("name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.payload !== undefined && message.hasOwnProperty("payload"))
                        $types[1].encode(message.payload, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Event message, length delimited.
                 * @param {io.restorecommerce.event.Event|Object} message Event message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Event.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an Event message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {io.restorecommerce.event.Event} Event
                 */
                Event.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.io.restorecommerce.event.Event();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            message.payload = $types[1].decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an Event message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {io.restorecommerce.event.Event} Event
                 */
                Event.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an Event message.
                 * @param {io.restorecommerce.event.Event|Object} message Event message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                Event.verify = function verify(message) {
                    if (message.name !== undefined)
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.payload !== undefined && message.payload !== null) {
                        var error = $types[1].verify(message.payload);
                        if (error)
                            return "payload." + error;
                    }
                    return null;
                };

                /**
                 * Creates an Event message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {io.restorecommerce.event.Event} Event
                 */
                Event.fromObject = function fromObject(object) {
                    if (object instanceof $root.io.restorecommerce.event.Event)
                        return object;
                    var message = new $root.io.restorecommerce.event.Event();
                    if (object.name !== undefined && object.name !== null)
                        message.name = String(object.name);
                    if (object.payload !== undefined && object.payload !== null) {
                        if (typeof object.payload !== "object")
                            throw TypeError(".io.restorecommerce.event.Event.payload: object expected");
                        message.payload = $types[1].fromObject(object.payload);
                    }
                    return message;
                };

                /**
                 * Creates an Event message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link io.restorecommerce.event.Event.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {io.restorecommerce.event.Event} Event
                 */
                Event.from = Event.fromObject;

                /**
                 * Creates a plain object from an Event message. Also converts values to other types if specified.
                 * @param {io.restorecommerce.event.Event} message Event
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Event.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.name = "";
                        object.payload = null;
                    }
                    if (message.name !== undefined && message.name !== null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.payload !== undefined && message.payload !== null && message.hasOwnProperty("payload"))
                        object.payload = $types[1].toObject(message.payload, options);
                    return object;
                };

                /**
                 * Creates a plain object from this Event message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Event.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this Event to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                Event.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Event;
            })();

            return event;
        })();

        restorecommerce.notify = (function() {

            /**
             * Namespace notify.
             * @exports io.restorecommerce.notify
             * @namespace
             */
            var notify = {};

            notify.Notifyd = (function() {

                /**
                 * Constructs a new Notifyd service.
                 * @exports io.restorecommerce.notify.Notifyd
                 * @extends $protobuf.rpc.Service
                 * @constructor
                 * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                 */
                function Notifyd(rpcImpl, requestDelimited, responseDelimited) {
                    $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
                }

                (Notifyd.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Notifyd;

                /**
                 * Creates new Notifyd service using the specified rpc implementation.
                 * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                 * @returns {Notifyd} RPC service. Useful where requests and/or responses are streamed.
                 */
                Notifyd.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                    return new this(rpcImpl, requestDelimited, responseDelimited);
                };

                /**
                 * Callback as used by {@link Notifyd#create}.
                 * @typedef Notifyd_create_Callback
                 * @type {function}
                 * @param {?Error} error Error, if any
                 * @param {io.restorecommerce.notify.Report} [response] Report
                 */

                /**
                 * Calls Create.
                 * @param {io.restorecommerce.notify.NotificationRequest|Object} request NotificationRequest message or plain object
                 * @param {Notifyd_create_Callback} callback Node-style callback called with the error, if any, and Report
                 * @returns {undefined}
                 */
                Notifyd.prototype.create = function create(request, callback) {
                    return this.rpcCall(create, $root.io.restorecommerce.notify.NotificationRequest, $root.io.restorecommerce.notify.Report, request, callback);
                };

                /**
                 * Calls Create.
                 * @name Notifyd#create
                 * @function
                 * @param {io.restorecommerce.notify.NotificationRequest|Object} request NotificationRequest message or plain object
                 * @returns {Promise<io.restorecommerce.notify.Report>} Promise
                 * @variation 2
                 */

                /**
                 * Callback as used by {@link Notifyd#createStream}.
                 * @typedef Notifyd_createStream_Callback
                 * @type {function}
                 * @param {?Error} error Error, if any
                 * @param {io.restorecommerce.notify.Report} [response] Report
                 */

                /**
                 * Calls CreateStream.
                 * @param {io.restorecommerce.notify.NotificationRequest|Object} request NotificationRequest message or plain object
                 * @param {Notifyd_createStream_Callback} callback Node-style callback called with the error, if any, and Report
                 * @returns {undefined}
                 */
                Notifyd.prototype.createStream = function createStream(request, callback) {
                    return this.rpcCall(createStream, $root.io.restorecommerce.notify.NotificationRequest, $root.io.restorecommerce.notify.Report, request, callback);
                };

                /**
                 * Calls CreateStream.
                 * @name Notifyd#createStream
                 * @function
                 * @param {io.restorecommerce.notify.NotificationRequest|Object} request NotificationRequest message or plain object
                 * @returns {Promise<io.restorecommerce.notify.Report>} Promise
                 * @variation 2
                 */

                return Notifyd;
            })();

            notify.NotificationRequest = (function() {

                /**
                 * Constructs a new NotificationRequest.
                 * @exports io.restorecommerce.notify.NotificationRequest
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function NotificationRequest(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * NotificationRequest sender.
                 * @type {string}
                 */
                NotificationRequest.prototype.sender = "";

                /**
                 * NotificationRequest title.
                 * @type {string}
                 */
                NotificationRequest.prototype.title = "";

                /**
                 * NotificationRequest message.
                 * @type {string}
                 */
                NotificationRequest.prototype.message = "";

                /**
                 * Creates a new NotificationRequest instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {io.restorecommerce.notify.NotificationRequest} NotificationRequest instance
                 */
                NotificationRequest.create = function create(properties) {
                    return new NotificationRequest(properties);
                };

                /**
                 * Encodes the specified NotificationRequest message.
                 * @param {io.restorecommerce.notify.NotificationRequest|Object} message NotificationRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                NotificationRequest.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.sender !== undefined && message.hasOwnProperty("sender"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sender);
                    if (message.title !== undefined && message.hasOwnProperty("title"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.title);
                    if (message.message !== undefined && message.hasOwnProperty("message"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.message);
                    return writer;
                };

                /**
                 * Encodes the specified NotificationRequest message, length delimited.
                 * @param {io.restorecommerce.notify.NotificationRequest|Object} message NotificationRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                NotificationRequest.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a NotificationRequest message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {io.restorecommerce.notify.NotificationRequest} NotificationRequest
                 */
                NotificationRequest.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.io.restorecommerce.notify.NotificationRequest();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.sender = reader.string();
                            break;
                        case 2:
                            message.title = reader.string();
                            break;
                        case 3:
                            message.message = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a NotificationRequest message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {io.restorecommerce.notify.NotificationRequest} NotificationRequest
                 */
                NotificationRequest.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a NotificationRequest message.
                 * @param {io.restorecommerce.notify.NotificationRequest|Object} message NotificationRequest message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                NotificationRequest.verify = function verify(message) {
                    if (message.sender !== undefined)
                        if (!$util.isString(message.sender))
                            return "sender: string expected";
                    if (message.title !== undefined)
                        if (!$util.isString(message.title))
                            return "title: string expected";
                    if (message.message !== undefined)
                        if (!$util.isString(message.message))
                            return "message: string expected";
                    return null;
                };

                /**
                 * Creates a NotificationRequest message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {io.restorecommerce.notify.NotificationRequest} NotificationRequest
                 */
                NotificationRequest.fromObject = function fromObject(object) {
                    if (object instanceof $root.io.restorecommerce.notify.NotificationRequest)
                        return object;
                    var message = new $root.io.restorecommerce.notify.NotificationRequest();
                    if (object.sender !== undefined && object.sender !== null)
                        message.sender = String(object.sender);
                    if (object.title !== undefined && object.title !== null)
                        message.title = String(object.title);
                    if (object.message !== undefined && object.message !== null)
                        message.message = String(object.message);
                    return message;
                };

                /**
                 * Creates a NotificationRequest message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link io.restorecommerce.notify.NotificationRequest.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {io.restorecommerce.notify.NotificationRequest} NotificationRequest
                 */
                NotificationRequest.from = NotificationRequest.fromObject;

                /**
                 * Creates a plain object from a NotificationRequest message. Also converts values to other types if specified.
                 * @param {io.restorecommerce.notify.NotificationRequest} message NotificationRequest
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                NotificationRequest.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.sender = "";
                        object.title = "";
                        object.message = "";
                    }
                    if (message.sender !== undefined && message.sender !== null && message.hasOwnProperty("sender"))
                        object.sender = message.sender;
                    if (message.title !== undefined && message.title !== null && message.hasOwnProperty("title"))
                        object.title = message.title;
                    if (message.message !== undefined && message.message !== null && message.hasOwnProperty("message"))
                        object.message = message.message;
                    return object;
                };

                /**
                 * Creates a plain object from this NotificationRequest message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                NotificationRequest.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this NotificationRequest to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                NotificationRequest.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return NotificationRequest;
            })();

            notify.Report = (function() {

                /**
                 * Constructs a new Report.
                 * @exports io.restorecommerce.notify.Report
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function Report(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Report id.
                 * @type {string}
                 */
                Report.prototype.id = "";

                /**
                 * Report send.
                 * @type {boolean}
                 */
                Report.prototype.send = false;

                /**
                 * Creates a new Report instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {io.restorecommerce.notify.Report} Report instance
                 */
                Report.create = function create(properties) {
                    return new Report(properties);
                };

                /**
                 * Encodes the specified Report message.
                 * @param {io.restorecommerce.notify.Report|Object} message Report message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Report.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.id !== undefined && message.hasOwnProperty("id"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                    if (message.send !== undefined && message.hasOwnProperty("send"))
                        writer.uint32(/* id 2, wireType 0 =*/16).bool(message.send);
                    return writer;
                };

                /**
                 * Encodes the specified Report message, length delimited.
                 * @param {io.restorecommerce.notify.Report|Object} message Report message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Report.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Report message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {io.restorecommerce.notify.Report} Report
                 */
                Report.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.io.restorecommerce.notify.Report();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.id = reader.string();
                            break;
                        case 2:
                            message.send = reader.bool();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Report message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {io.restorecommerce.notify.Report} Report
                 */
                Report.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Report message.
                 * @param {io.restorecommerce.notify.Report|Object} message Report message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                Report.verify = function verify(message) {
                    if (message.id !== undefined)
                        if (!$util.isString(message.id))
                            return "id: string expected";
                    if (message.send !== undefined)
                        if (typeof message.send !== "boolean")
                            return "send: boolean expected";
                    return null;
                };

                /**
                 * Creates a Report message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {io.restorecommerce.notify.Report} Report
                 */
                Report.fromObject = function fromObject(object) {
                    if (object instanceof $root.io.restorecommerce.notify.Report)
                        return object;
                    var message = new $root.io.restorecommerce.notify.Report();
                    if (object.id !== undefined && object.id !== null)
                        message.id = String(object.id);
                    if (object.send !== undefined && object.send !== null)
                        message.send = Boolean(object.send);
                    return message;
                };

                /**
                 * Creates a Report message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link io.restorecommerce.notify.Report.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {io.restorecommerce.notify.Report} Report
                 */
                Report.from = Report.fromObject;

                /**
                 * Creates a plain object from a Report message. Also converts values to other types if specified.
                 * @param {io.restorecommerce.notify.Report} message Report
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Report.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.id = "";
                        object.send = false;
                    }
                    if (message.id !== undefined && message.id !== null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.send !== undefined && message.send !== null && message.hasOwnProperty("send"))
                        object.send = message.send;
                    return object;
                };

                /**
                 * Creates a plain object from this Report message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Report.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this Report to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                Report.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Report;
            })();

            notify.Notification = (function() {

                /**
                 * Constructs a new Notification.
                 * @exports io.restorecommerce.notify.Notification
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function Notification(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Notification id.
                 * @type {string}
                 */
                Notification.prototype.id = "";

                /**
                 * Notification sender.
                 * @type {string}
                 */
                Notification.prototype.sender = "";

                /**
                 * Notification title.
                 * @type {string}
                 */
                Notification.prototype.title = "";

                /**
                 * Notification message.
                 * @type {string}
                 */
                Notification.prototype.message = "";

                /**
                 * Creates a new Notification instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {io.restorecommerce.notify.Notification} Notification instance
                 */
                Notification.create = function create(properties) {
                    return new Notification(properties);
                };

                /**
                 * Encodes the specified Notification message.
                 * @param {io.restorecommerce.notify.Notification|Object} message Notification message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Notification.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.id !== undefined && message.hasOwnProperty("id"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                    if (message.sender !== undefined && message.hasOwnProperty("sender"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.sender);
                    if (message.title !== undefined && message.hasOwnProperty("title"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.title);
                    if (message.message !== undefined && message.hasOwnProperty("message"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.message);
                    return writer;
                };

                /**
                 * Encodes the specified Notification message, length delimited.
                 * @param {io.restorecommerce.notify.Notification|Object} message Notification message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Notification.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Notification message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {io.restorecommerce.notify.Notification} Notification
                 */
                Notification.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.io.restorecommerce.notify.Notification();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.id = reader.string();
                            break;
                        case 2:
                            message.sender = reader.string();
                            break;
                        case 3:
                            message.title = reader.string();
                            break;
                        case 4:
                            message.message = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Notification message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {io.restorecommerce.notify.Notification} Notification
                 */
                Notification.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Notification message.
                 * @param {io.restorecommerce.notify.Notification|Object} message Notification message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                Notification.verify = function verify(message) {
                    if (message.id !== undefined)
                        if (!$util.isString(message.id))
                            return "id: string expected";
                    if (message.sender !== undefined)
                        if (!$util.isString(message.sender))
                            return "sender: string expected";
                    if (message.title !== undefined)
                        if (!$util.isString(message.title))
                            return "title: string expected";
                    if (message.message !== undefined)
                        if (!$util.isString(message.message))
                            return "message: string expected";
                    return null;
                };

                /**
                 * Creates a Notification message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {io.restorecommerce.notify.Notification} Notification
                 */
                Notification.fromObject = function fromObject(object) {
                    if (object instanceof $root.io.restorecommerce.notify.Notification)
                        return object;
                    var message = new $root.io.restorecommerce.notify.Notification();
                    if (object.id !== undefined && object.id !== null)
                        message.id = String(object.id);
                    if (object.sender !== undefined && object.sender !== null)
                        message.sender = String(object.sender);
                    if (object.title !== undefined && object.title !== null)
                        message.title = String(object.title);
                    if (object.message !== undefined && object.message !== null)
                        message.message = String(object.message);
                    return message;
                };

                /**
                 * Creates a Notification message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link io.restorecommerce.notify.Notification.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {io.restorecommerce.notify.Notification} Notification
                 */
                Notification.from = Notification.fromObject;

                /**
                 * Creates a plain object from a Notification message. Also converts values to other types if specified.
                 * @param {io.restorecommerce.notify.Notification} message Notification
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Notification.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.id = "";
                        object.sender = "";
                        object.title = "";
                        object.message = "";
                    }
                    if (message.id !== undefined && message.id !== null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.sender !== undefined && message.sender !== null && message.hasOwnProperty("sender"))
                        object.sender = message.sender;
                    if (message.title !== undefined && message.title !== null && message.hasOwnProperty("title"))
                        object.title = message.title;
                    if (message.message !== undefined && message.message !== null && message.hasOwnProperty("message"))
                        object.message = message.message;
                    return object;
                };

                /**
                 * Creates a plain object from this Notification message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Notification.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this Notification to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                Notification.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Notification;
            })();

            return notify;
        })();

        return restorecommerce;
    })();

    return io;
})();

$root.grpc = (function() {

    /**
     * Namespace grpc.
     * @exports grpc
     * @namespace
     */
    var grpc = {};

    grpc.health = (function() {

        /**
         * Namespace health.
         * @exports grpc.health
         * @namespace
         */
        var health = {};

        health.v1 = (function() {

            /**
             * Namespace v1.
             * @exports grpc.health.v1
             * @namespace
             */
            var v1 = {};

            v1.HealthCheckRequest = (function() {

                /**
                 * Constructs a new HealthCheckRequest.
                 * @exports grpc.health.v1.HealthCheckRequest
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function HealthCheckRequest(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * HealthCheckRequest service.
                 * @type {string}
                 */
                HealthCheckRequest.prototype.service = "";

                /**
                 * Creates a new HealthCheckRequest instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.health.v1.HealthCheckRequest} HealthCheckRequest instance
                 */
                HealthCheckRequest.create = function create(properties) {
                    return new HealthCheckRequest(properties);
                };

                /**
                 * Encodes the specified HealthCheckRequest message.
                 * @param {grpc.health.v1.HealthCheckRequest|Object} message HealthCheckRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                HealthCheckRequest.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.service !== undefined && message.hasOwnProperty("service"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.service);
                    return writer;
                };

                /**
                 * Encodes the specified HealthCheckRequest message, length delimited.
                 * @param {grpc.health.v1.HealthCheckRequest|Object} message HealthCheckRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                HealthCheckRequest.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a HealthCheckRequest message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.health.v1.HealthCheckRequest} HealthCheckRequest
                 */
                HealthCheckRequest.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.grpc.health.v1.HealthCheckRequest();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.service = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a HealthCheckRequest message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.health.v1.HealthCheckRequest} HealthCheckRequest
                 */
                HealthCheckRequest.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a HealthCheckRequest message.
                 * @param {grpc.health.v1.HealthCheckRequest|Object} message HealthCheckRequest message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                HealthCheckRequest.verify = function verify(message) {
                    if (message.service !== undefined)
                        if (!$util.isString(message.service))
                            return "service: string expected";
                    return null;
                };

                /**
                 * Creates a HealthCheckRequest message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.health.v1.HealthCheckRequest} HealthCheckRequest
                 */
                HealthCheckRequest.fromObject = function fromObject(object) {
                    if (object instanceof $root.grpc.health.v1.HealthCheckRequest)
                        return object;
                    var message = new $root.grpc.health.v1.HealthCheckRequest();
                    if (object.service !== undefined && object.service !== null)
                        message.service = String(object.service);
                    return message;
                };

                /**
                 * Creates a HealthCheckRequest message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.health.v1.HealthCheckRequest.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.health.v1.HealthCheckRequest} HealthCheckRequest
                 */
                HealthCheckRequest.from = HealthCheckRequest.fromObject;

                /**
                 * Creates a plain object from a HealthCheckRequest message. Also converts values to other types if specified.
                 * @param {grpc.health.v1.HealthCheckRequest} message HealthCheckRequest
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                HealthCheckRequest.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.service = "";
                    if (message.service !== undefined && message.service !== null && message.hasOwnProperty("service"))
                        object.service = message.service;
                    return object;
                };

                /**
                 * Creates a plain object from this HealthCheckRequest message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                HealthCheckRequest.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this HealthCheckRequest to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                HealthCheckRequest.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return HealthCheckRequest;
            })();

            v1.HealthCheckResponse = (function() {

                /**
                 * Constructs a new HealthCheckResponse.
                 * @exports grpc.health.v1.HealthCheckResponse
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function HealthCheckResponse(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * HealthCheckResponse status.
                 * @type {number}
                 */
                HealthCheckResponse.prototype.status = 0;

                // Lazily resolved type references
                var $types = {
                    0: "grpc.health.v1.HealthCheckResponse.ServingStatus"
                }; $lazyTypes.push($types);

                /**
                 * Creates a new HealthCheckResponse instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.health.v1.HealthCheckResponse} HealthCheckResponse instance
                 */
                HealthCheckResponse.create = function create(properties) {
                    return new HealthCheckResponse(properties);
                };

                /**
                 * Encodes the specified HealthCheckResponse message.
                 * @param {grpc.health.v1.HealthCheckResponse|Object} message HealthCheckResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                HealthCheckResponse.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.status !== undefined && message.hasOwnProperty("status"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.status);
                    return writer;
                };

                /**
                 * Encodes the specified HealthCheckResponse message, length delimited.
                 * @param {grpc.health.v1.HealthCheckResponse|Object} message HealthCheckResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                HealthCheckResponse.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a HealthCheckResponse message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.health.v1.HealthCheckResponse} HealthCheckResponse
                 */
                HealthCheckResponse.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.grpc.health.v1.HealthCheckResponse();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.status = reader.uint32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a HealthCheckResponse message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.health.v1.HealthCheckResponse} HealthCheckResponse
                 */
                HealthCheckResponse.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a HealthCheckResponse message.
                 * @param {grpc.health.v1.HealthCheckResponse|Object} message HealthCheckResponse message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                HealthCheckResponse.verify = function verify(message) {
                    if (message.status !== undefined)
                        switch (message.status) {
                        default:
                            return "status: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                            break;
                        }
                    return null;
                };

                /**
                 * Creates a HealthCheckResponse message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.health.v1.HealthCheckResponse} HealthCheckResponse
                 */
                HealthCheckResponse.fromObject = function fromObject(object) {
                    if (object instanceof $root.grpc.health.v1.HealthCheckResponse)
                        return object;
                    var message = new $root.grpc.health.v1.HealthCheckResponse();
                    switch (object.status) {
                    case "UNKNOWN":
                    case 0:
                        message.status = 0;
                        break;
                    case "SERVING":
                    case 1:
                        message.status = 1;
                        break;
                    case "NOT_SERVING":
                    case 2:
                        message.status = 2;
                        break;
                    }
                    return message;
                };

                /**
                 * Creates a HealthCheckResponse message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.health.v1.HealthCheckResponse.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.health.v1.HealthCheckResponse} HealthCheckResponse
                 */
                HealthCheckResponse.from = HealthCheckResponse.fromObject;

                /**
                 * Creates a plain object from a HealthCheckResponse message. Also converts values to other types if specified.
                 * @param {grpc.health.v1.HealthCheckResponse} message HealthCheckResponse
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                HealthCheckResponse.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.status = options.enums === String ? "UNKNOWN" : 0;
                    if (message.status !== undefined && message.status !== null && message.hasOwnProperty("status"))
                        object.status = options.enums === String ? $types[0][message.status] : message.status;
                    return object;
                };

                /**
                 * Creates a plain object from this HealthCheckResponse message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                HealthCheckResponse.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this HealthCheckResponse to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                HealthCheckResponse.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * ServingStatus enum.
                 * @name ServingStatus
                 * @memberof grpc.health.v1.HealthCheckResponse
                 * @enum {number}
                 * @property {number} UNKNOWN=0 UNKNOWN value
                 * @property {number} SERVING=1 SERVING value
                 * @property {number} NOT_SERVING=2 NOT_SERVING value
                 */
                HealthCheckResponse.ServingStatus = (function() {
                    var valuesById = {},
                        values = Object.create(valuesById);
                    values[valuesById[0] = "UNKNOWN"] = 0;
                    values[valuesById[1] = "SERVING"] = 1;
                    values[valuesById[2] = "NOT_SERVING"] = 2;
                    return values;
                })();

                return HealthCheckResponse;
            })();

            v1.Health = (function() {

                /**
                 * Constructs a new Health service.
                 * @exports grpc.health.v1.Health
                 * @extends $protobuf.rpc.Service
                 * @constructor
                 * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                 */
                function Health(rpcImpl, requestDelimited, responseDelimited) {
                    $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
                }

                (Health.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Health;

                /**
                 * Creates new Health service using the specified rpc implementation.
                 * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                 * @returns {Health} RPC service. Useful where requests and/or responses are streamed.
                 */
                Health.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                    return new this(rpcImpl, requestDelimited, responseDelimited);
                };

                /**
                 * Callback as used by {@link Health#check}.
                 * @typedef Health_check_Callback
                 * @type {function}
                 * @param {?Error} error Error, if any
                 * @param {grpc.health.v1.HealthCheckResponse} [response] HealthCheckResponse
                 */

                /**
                 * Calls Check.
                 * @param {grpc.health.v1.HealthCheckRequest|Object} request HealthCheckRequest message or plain object
                 * @param {Health_check_Callback} callback Node-style callback called with the error, if any, and HealthCheckResponse
                 * @returns {undefined}
                 */
                Health.prototype.check = function check(request, callback) {
                    return this.rpcCall(check, $root.grpc.health.v1.HealthCheckRequest, $root.grpc.health.v1.HealthCheckResponse, request, callback);
                };

                /**
                 * Calls Check.
                 * @name Health#check
                 * @function
                 * @param {grpc.health.v1.HealthCheckRequest|Object} request HealthCheckRequest message or plain object
                 * @returns {Promise<grpc.health.v1.HealthCheckResponse>} Promise
                 * @variation 2
                 */

                return Health;
            })();

            return v1;
        })();

        return health;
    })();

    grpc.reflection = (function() {

        /**
         * Namespace reflection.
         * @exports grpc.reflection
         * @namespace
         */
        var reflection = {};

        reflection.v1alpha = (function() {

            /**
             * Namespace v1alpha.
             * @exports grpc.reflection.v1alpha
             * @namespace
             */
            var v1alpha = {};

            v1alpha.ServerReflection = (function() {

                /**
                 * Constructs a new ServerReflection service.
                 * @exports grpc.reflection.v1alpha.ServerReflection
                 * @extends $protobuf.rpc.Service
                 * @constructor
                 * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                 */
                function ServerReflection(rpcImpl, requestDelimited, responseDelimited) {
                    $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
                }

                (ServerReflection.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = ServerReflection;

                /**
                 * Creates new ServerReflection service using the specified rpc implementation.
                 * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                 * @returns {ServerReflection} RPC service. Useful where requests and/or responses are streamed.
                 */
                ServerReflection.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                    return new this(rpcImpl, requestDelimited, responseDelimited);
                };

                /**
                 * Callback as used by {@link ServerReflection#serverReflectionInfo}.
                 * @typedef ServerReflection_serverReflectionInfo_Callback
                 * @type {function}
                 * @param {?Error} error Error, if any
                 * @param {grpc.reflection.v1alpha.ServerReflectionResponse} [response] ServerReflectionResponse
                 */

                /**
                 * Calls ServerReflectionInfo.
                 * @param {grpc.reflection.v1alpha.ServerReflectionRequest|Object} request ServerReflectionRequest message or plain object
                 * @param {ServerReflection_serverReflectionInfo_Callback} callback Node-style callback called with the error, if any, and ServerReflectionResponse
                 * @returns {undefined}
                 */
                ServerReflection.prototype.serverReflectionInfo = function serverReflectionInfo(request, callback) {
                    return this.rpcCall(serverReflectionInfo, $root.grpc.reflection.v1alpha.ServerReflectionRequest, $root.grpc.reflection.v1alpha.ServerReflectionResponse, request, callback);
                };

                /**
                 * Calls ServerReflectionInfo.
                 * @name ServerReflection#serverReflectionInfo
                 * @function
                 * @param {grpc.reflection.v1alpha.ServerReflectionRequest|Object} request ServerReflectionRequest message or plain object
                 * @returns {Promise<grpc.reflection.v1alpha.ServerReflectionResponse>} Promise
                 * @variation 2
                 */

                return ServerReflection;
            })();

            v1alpha.ServerReflectionRequest = (function() {

                /**
                 * Constructs a new ServerReflectionRequest.
                 * @exports grpc.reflection.v1alpha.ServerReflectionRequest
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function ServerReflectionRequest(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ServerReflectionRequest host.
                 * @type {string}
                 */
                ServerReflectionRequest.prototype.host = "";

                /**
                 * ServerReflectionRequest fileByFilename.
                 * @type {string}
                 */
                ServerReflectionRequest.prototype.fileByFilename = "";

                /**
                 * ServerReflectionRequest fileContainingSymbol.
                 * @type {string}
                 */
                ServerReflectionRequest.prototype.fileContainingSymbol = "";

                /**
                 * ServerReflectionRequest fileContainingExtension.
                 * @type {grpc.reflection.v1alpha.ExtensionRequest}
                 */
                ServerReflectionRequest.prototype.fileContainingExtension = null;

                /**
                 * ServerReflectionRequest allExtensionNumbersOfType.
                 * @type {string}
                 */
                ServerReflectionRequest.prototype.allExtensionNumbersOfType = "";

                /**
                 * ServerReflectionRequest listServices.
                 * @type {string}
                 */
                ServerReflectionRequest.prototype.listServices = "";

                // OneOf field names bound to virtual getters and setters
                var $oneOfFields;

                /**
                 * ServerReflectionRequest messageRequest.
                 * @name grpc.reflection.v1alpha.ServerReflectionRequest#messageRequest
                 * @type {string|undefined}
                 */
                Object.defineProperty(ServerReflectionRequest.prototype, "messageRequest", {
                    get: $util.oneOfGetter($oneOfFields = ["fileByFilename", "fileContainingSymbol", "fileContainingExtension", "allExtensionNumbersOfType", "listServices"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                // Lazily resolved type references
                var $types = {
                    3: "grpc.reflection.v1alpha.ExtensionRequest"
                }; $lazyTypes.push($types);

                /**
                 * Creates a new ServerReflectionRequest instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.reflection.v1alpha.ServerReflectionRequest} ServerReflectionRequest instance
                 */
                ServerReflectionRequest.create = function create(properties) {
                    return new ServerReflectionRequest(properties);
                };

                /**
                 * Encodes the specified ServerReflectionRequest message.
                 * @param {grpc.reflection.v1alpha.ServerReflectionRequest|Object} message ServerReflectionRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ServerReflectionRequest.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.host !== undefined && message.hasOwnProperty("host"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.host);
                    switch (message.messageRequest) {
                    case "fileByFilename":
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.fileByFilename);
                        break;
                    case "fileContainingSymbol":
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.fileContainingSymbol);
                        break;
                    case "fileContainingExtension":
                        $types[3].encode(message.fileContainingExtension, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                        break;
                    case "allExtensionNumbersOfType":
                        writer.uint32(/* id 6, wireType 2 =*/50).string(message.allExtensionNumbersOfType);
                        break;
                    case "listServices":
                        writer.uint32(/* id 7, wireType 2 =*/58).string(message.listServices);
                        break;
                    }
                    return writer;
                };

                /**
                 * Encodes the specified ServerReflectionRequest message, length delimited.
                 * @param {grpc.reflection.v1alpha.ServerReflectionRequest|Object} message ServerReflectionRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ServerReflectionRequest.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a ServerReflectionRequest message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.reflection.v1alpha.ServerReflectionRequest} ServerReflectionRequest
                 */
                ServerReflectionRequest.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.grpc.reflection.v1alpha.ServerReflectionRequest();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.host = reader.string();
                            break;
                        case 3:
                            message.fileByFilename = reader.string();
                            break;
                        case 4:
                            message.fileContainingSymbol = reader.string();
                            break;
                        case 5:
                            message.fileContainingExtension = $types[3].decode(reader, reader.uint32());
                            break;
                        case 6:
                            message.allExtensionNumbersOfType = reader.string();
                            break;
                        case 7:
                            message.listServices = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a ServerReflectionRequest message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.reflection.v1alpha.ServerReflectionRequest} ServerReflectionRequest
                 */
                ServerReflectionRequest.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ServerReflectionRequest message.
                 * @param {grpc.reflection.v1alpha.ServerReflectionRequest|Object} message ServerReflectionRequest message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                ServerReflectionRequest.verify = function verify(message) {
                    if (message.host !== undefined)
                        if (!$util.isString(message.host))
                            return "host: string expected";
                    if (message.fileByFilename !== undefined)
                        if (!$util.isString(message.fileByFilename))
                            return "fileByFilename: string expected";
                    if (message.fileContainingSymbol !== undefined)
                        if (!$util.isString(message.fileContainingSymbol))
                            return "fileContainingSymbol: string expected";
                    if (message.fileContainingExtension !== undefined && message.fileContainingExtension !== null) {
                        var error = $types[3].verify(message.fileContainingExtension);
                        if (error)
                            return "fileContainingExtension." + error;
                    }
                    if (message.allExtensionNumbersOfType !== undefined)
                        if (!$util.isString(message.allExtensionNumbersOfType))
                            return "allExtensionNumbersOfType: string expected";
                    if (message.listServices !== undefined)
                        if (!$util.isString(message.listServices))
                            return "listServices: string expected";
                    return null;
                };

                /**
                 * Creates a ServerReflectionRequest message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ServerReflectionRequest} ServerReflectionRequest
                 */
                ServerReflectionRequest.fromObject = function fromObject(object) {
                    if (object instanceof $root.grpc.reflection.v1alpha.ServerReflectionRequest)
                        return object;
                    var message = new $root.grpc.reflection.v1alpha.ServerReflectionRequest();
                    if (object.host !== undefined && object.host !== null)
                        message.host = String(object.host);
                    if (object.fileByFilename !== undefined && object.fileByFilename !== null)
                        message.fileByFilename = String(object.fileByFilename);
                    if (object.fileContainingSymbol !== undefined && object.fileContainingSymbol !== null)
                        message.fileContainingSymbol = String(object.fileContainingSymbol);
                    if (object.fileContainingExtension !== undefined && object.fileContainingExtension !== null) {
                        if (typeof object.fileContainingExtension !== "object")
                            throw TypeError(".grpc.reflection.v1alpha.ServerReflectionRequest.fileContainingExtension: object expected");
                        message.fileContainingExtension = $types[3].fromObject(object.fileContainingExtension);
                    }
                    if (object.allExtensionNumbersOfType !== undefined && object.allExtensionNumbersOfType !== null)
                        message.allExtensionNumbersOfType = String(object.allExtensionNumbersOfType);
                    if (object.listServices !== undefined && object.listServices !== null)
                        message.listServices = String(object.listServices);
                    return message;
                };

                /**
                 * Creates a ServerReflectionRequest message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.reflection.v1alpha.ServerReflectionRequest.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ServerReflectionRequest} ServerReflectionRequest
                 */
                ServerReflectionRequest.from = ServerReflectionRequest.fromObject;

                /**
                 * Creates a plain object from a ServerReflectionRequest message. Also converts values to other types if specified.
                 * @param {grpc.reflection.v1alpha.ServerReflectionRequest} message ServerReflectionRequest
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ServerReflectionRequest.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.host = "";
                        object.fileByFilename = "";
                        object.fileContainingSymbol = "";
                        object.fileContainingExtension = null;
                        object.allExtensionNumbersOfType = "";
                        object.listServices = "";
                    }
                    if (message.host !== undefined && message.host !== null && message.hasOwnProperty("host"))
                        object.host = message.host;
                    if (message.fileByFilename !== undefined && message.fileByFilename !== null && message.hasOwnProperty("fileByFilename"))
                        object.fileByFilename = message.fileByFilename;
                    if (message.fileContainingSymbol !== undefined && message.fileContainingSymbol !== null && message.hasOwnProperty("fileContainingSymbol"))
                        object.fileContainingSymbol = message.fileContainingSymbol;
                    if (message.fileContainingExtension !== undefined && message.fileContainingExtension !== null && message.hasOwnProperty("fileContainingExtension"))
                        object.fileContainingExtension = $types[3].toObject(message.fileContainingExtension, options);
                    if (message.allExtensionNumbersOfType !== undefined && message.allExtensionNumbersOfType !== null && message.hasOwnProperty("allExtensionNumbersOfType"))
                        object.allExtensionNumbersOfType = message.allExtensionNumbersOfType;
                    if (message.listServices !== undefined && message.listServices !== null && message.hasOwnProperty("listServices"))
                        object.listServices = message.listServices;
                    return object;
                };

                /**
                 * Creates a plain object from this ServerReflectionRequest message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ServerReflectionRequest.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this ServerReflectionRequest to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                ServerReflectionRequest.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ServerReflectionRequest;
            })();

            v1alpha.ExtensionRequest = (function() {

                /**
                 * Constructs a new ExtensionRequest.
                 * @exports grpc.reflection.v1alpha.ExtensionRequest
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function ExtensionRequest(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ExtensionRequest containingType.
                 * @type {string}
                 */
                ExtensionRequest.prototype.containingType = "";

                /**
                 * ExtensionRequest extensionNumber.
                 * @type {number}
                 */
                ExtensionRequest.prototype.extensionNumber = 0;

                /**
                 * Creates a new ExtensionRequest instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.reflection.v1alpha.ExtensionRequest} ExtensionRequest instance
                 */
                ExtensionRequest.create = function create(properties) {
                    return new ExtensionRequest(properties);
                };

                /**
                 * Encodes the specified ExtensionRequest message.
                 * @param {grpc.reflection.v1alpha.ExtensionRequest|Object} message ExtensionRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ExtensionRequest.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.containingType !== undefined && message.hasOwnProperty("containingType"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.containingType);
                    if (message.extensionNumber !== undefined && message.hasOwnProperty("extensionNumber"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.extensionNumber);
                    return writer;
                };

                /**
                 * Encodes the specified ExtensionRequest message, length delimited.
                 * @param {grpc.reflection.v1alpha.ExtensionRequest|Object} message ExtensionRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ExtensionRequest.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an ExtensionRequest message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.reflection.v1alpha.ExtensionRequest} ExtensionRequest
                 */
                ExtensionRequest.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.grpc.reflection.v1alpha.ExtensionRequest();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.containingType = reader.string();
                            break;
                        case 2:
                            message.extensionNumber = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an ExtensionRequest message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.reflection.v1alpha.ExtensionRequest} ExtensionRequest
                 */
                ExtensionRequest.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an ExtensionRequest message.
                 * @param {grpc.reflection.v1alpha.ExtensionRequest|Object} message ExtensionRequest message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                ExtensionRequest.verify = function verify(message) {
                    if (message.containingType !== undefined)
                        if (!$util.isString(message.containingType))
                            return "containingType: string expected";
                    if (message.extensionNumber !== undefined)
                        if (!$util.isInteger(message.extensionNumber))
                            return "extensionNumber: integer expected";
                    return null;
                };

                /**
                 * Creates an ExtensionRequest message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ExtensionRequest} ExtensionRequest
                 */
                ExtensionRequest.fromObject = function fromObject(object) {
                    if (object instanceof $root.grpc.reflection.v1alpha.ExtensionRequest)
                        return object;
                    var message = new $root.grpc.reflection.v1alpha.ExtensionRequest();
                    if (object.containingType !== undefined && object.containingType !== null)
                        message.containingType = String(object.containingType);
                    if (object.extensionNumber !== undefined && object.extensionNumber !== null)
                        message.extensionNumber = object.extensionNumber | 0;
                    return message;
                };

                /**
                 * Creates an ExtensionRequest message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.reflection.v1alpha.ExtensionRequest.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ExtensionRequest} ExtensionRequest
                 */
                ExtensionRequest.from = ExtensionRequest.fromObject;

                /**
                 * Creates a plain object from an ExtensionRequest message. Also converts values to other types if specified.
                 * @param {grpc.reflection.v1alpha.ExtensionRequest} message ExtensionRequest
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ExtensionRequest.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.containingType = "";
                        object.extensionNumber = 0;
                    }
                    if (message.containingType !== undefined && message.containingType !== null && message.hasOwnProperty("containingType"))
                        object.containingType = message.containingType;
                    if (message.extensionNumber !== undefined && message.extensionNumber !== null && message.hasOwnProperty("extensionNumber"))
                        object.extensionNumber = message.extensionNumber;
                    return object;
                };

                /**
                 * Creates a plain object from this ExtensionRequest message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ExtensionRequest.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this ExtensionRequest to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                ExtensionRequest.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ExtensionRequest;
            })();

            v1alpha.ServerReflectionResponse = (function() {

                /**
                 * Constructs a new ServerReflectionResponse.
                 * @exports grpc.reflection.v1alpha.ServerReflectionResponse
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function ServerReflectionResponse(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ServerReflectionResponse validHost.
                 * @type {string}
                 */
                ServerReflectionResponse.prototype.validHost = "";

                /**
                 * ServerReflectionResponse originalRequest.
                 * @type {grpc.reflection.v1alpha.ServerReflectionRequest}
                 */
                ServerReflectionResponse.prototype.originalRequest = null;

                /**
                 * ServerReflectionResponse fileDescriptorResponse.
                 * @type {grpc.reflection.v1alpha.FileDescriptorResponse}
                 */
                ServerReflectionResponse.prototype.fileDescriptorResponse = null;

                /**
                 * ServerReflectionResponse allExtensionNumbersResponse.
                 * @type {grpc.reflection.v1alpha.ExtensionNumberResponse}
                 */
                ServerReflectionResponse.prototype.allExtensionNumbersResponse = null;

                /**
                 * ServerReflectionResponse listServicesResponse.
                 * @type {grpc.reflection.v1alpha.ListServiceResponse}
                 */
                ServerReflectionResponse.prototype.listServicesResponse = null;

                /**
                 * ServerReflectionResponse errorResponse.
                 * @type {grpc.reflection.v1alpha.ErrorResponse}
                 */
                ServerReflectionResponse.prototype.errorResponse = null;

                // OneOf field names bound to virtual getters and setters
                var $oneOfFields;

                /**
                 * ServerReflectionResponse messageResponse.
                 * @name grpc.reflection.v1alpha.ServerReflectionResponse#messageResponse
                 * @type {string|undefined}
                 */
                Object.defineProperty(ServerReflectionResponse.prototype, "messageResponse", {
                    get: $util.oneOfGetter($oneOfFields = ["fileDescriptorResponse", "allExtensionNumbersResponse", "listServicesResponse", "errorResponse"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                // Lazily resolved type references
                var $types = {
                    1: "grpc.reflection.v1alpha.ServerReflectionRequest",
                    2: "grpc.reflection.v1alpha.FileDescriptorResponse",
                    3: "grpc.reflection.v1alpha.ExtensionNumberResponse",
                    4: "grpc.reflection.v1alpha.ListServiceResponse",
                    5: "grpc.reflection.v1alpha.ErrorResponse"
                }; $lazyTypes.push($types);

                /**
                 * Creates a new ServerReflectionResponse instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.reflection.v1alpha.ServerReflectionResponse} ServerReflectionResponse instance
                 */
                ServerReflectionResponse.create = function create(properties) {
                    return new ServerReflectionResponse(properties);
                };

                /**
                 * Encodes the specified ServerReflectionResponse message.
                 * @param {grpc.reflection.v1alpha.ServerReflectionResponse|Object} message ServerReflectionResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ServerReflectionResponse.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.validHost !== undefined && message.hasOwnProperty("validHost"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.validHost);
                    if (message.originalRequest !== undefined && message.hasOwnProperty("originalRequest"))
                        $types[1].encode(message.originalRequest, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    switch (message.messageResponse) {
                    case "fileDescriptorResponse":
                        $types[2].encode(message.fileDescriptorResponse, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                        break;
                    case "allExtensionNumbersResponse":
                        $types[3].encode(message.allExtensionNumbersResponse, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                        break;
                    case "listServicesResponse":
                        $types[4].encode(message.listServicesResponse, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                        break;
                    case "errorResponse":
                        $types[5].encode(message.errorResponse, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                        break;
                    }
                    return writer;
                };

                /**
                 * Encodes the specified ServerReflectionResponse message, length delimited.
                 * @param {grpc.reflection.v1alpha.ServerReflectionResponse|Object} message ServerReflectionResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ServerReflectionResponse.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a ServerReflectionResponse message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.reflection.v1alpha.ServerReflectionResponse} ServerReflectionResponse
                 */
                ServerReflectionResponse.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.grpc.reflection.v1alpha.ServerReflectionResponse();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.validHost = reader.string();
                            break;
                        case 2:
                            message.originalRequest = $types[1].decode(reader, reader.uint32());
                            break;
                        case 4:
                            message.fileDescriptorResponse = $types[2].decode(reader, reader.uint32());
                            break;
                        case 5:
                            message.allExtensionNumbersResponse = $types[3].decode(reader, reader.uint32());
                            break;
                        case 6:
                            message.listServicesResponse = $types[4].decode(reader, reader.uint32());
                            break;
                        case 7:
                            message.errorResponse = $types[5].decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a ServerReflectionResponse message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.reflection.v1alpha.ServerReflectionResponse} ServerReflectionResponse
                 */
                ServerReflectionResponse.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ServerReflectionResponse message.
                 * @param {grpc.reflection.v1alpha.ServerReflectionResponse|Object} message ServerReflectionResponse message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                ServerReflectionResponse.verify = function verify(message) {
                    if (message.validHost !== undefined)
                        if (!$util.isString(message.validHost))
                            return "validHost: string expected";
                    if (message.originalRequest !== undefined && message.originalRequest !== null) {
                        var error = $types[1].verify(message.originalRequest);
                        if (error)
                            return "originalRequest." + error;
                    }
                    if (message.fileDescriptorResponse !== undefined && message.fileDescriptorResponse !== null) {
                        var error = $types[2].verify(message.fileDescriptorResponse);
                        if (error)
                            return "fileDescriptorResponse." + error;
                    }
                    if (message.allExtensionNumbersResponse !== undefined && message.allExtensionNumbersResponse !== null) {
                        var error = $types[3].verify(message.allExtensionNumbersResponse);
                        if (error)
                            return "allExtensionNumbersResponse." + error;
                    }
                    if (message.listServicesResponse !== undefined && message.listServicesResponse !== null) {
                        var error = $types[4].verify(message.listServicesResponse);
                        if (error)
                            return "listServicesResponse." + error;
                    }
                    if (message.errorResponse !== undefined && message.errorResponse !== null) {
                        var error = $types[5].verify(message.errorResponse);
                        if (error)
                            return "errorResponse." + error;
                    }
                    return null;
                };

                /**
                 * Creates a ServerReflectionResponse message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ServerReflectionResponse} ServerReflectionResponse
                 */
                ServerReflectionResponse.fromObject = function fromObject(object) {
                    if (object instanceof $root.grpc.reflection.v1alpha.ServerReflectionResponse)
                        return object;
                    var message = new $root.grpc.reflection.v1alpha.ServerReflectionResponse();
                    if (object.validHost !== undefined && object.validHost !== null)
                        message.validHost = String(object.validHost);
                    if (object.originalRequest !== undefined && object.originalRequest !== null) {
                        if (typeof object.originalRequest !== "object")
                            throw TypeError(".grpc.reflection.v1alpha.ServerReflectionResponse.originalRequest: object expected");
                        message.originalRequest = $types[1].fromObject(object.originalRequest);
                    }
                    if (object.fileDescriptorResponse !== undefined && object.fileDescriptorResponse !== null) {
                        if (typeof object.fileDescriptorResponse !== "object")
                            throw TypeError(".grpc.reflection.v1alpha.ServerReflectionResponse.fileDescriptorResponse: object expected");
                        message.fileDescriptorResponse = $types[2].fromObject(object.fileDescriptorResponse);
                    }
                    if (object.allExtensionNumbersResponse !== undefined && object.allExtensionNumbersResponse !== null) {
                        if (typeof object.allExtensionNumbersResponse !== "object")
                            throw TypeError(".grpc.reflection.v1alpha.ServerReflectionResponse.allExtensionNumbersResponse: object expected");
                        message.allExtensionNumbersResponse = $types[3].fromObject(object.allExtensionNumbersResponse);
                    }
                    if (object.listServicesResponse !== undefined && object.listServicesResponse !== null) {
                        if (typeof object.listServicesResponse !== "object")
                            throw TypeError(".grpc.reflection.v1alpha.ServerReflectionResponse.listServicesResponse: object expected");
                        message.listServicesResponse = $types[4].fromObject(object.listServicesResponse);
                    }
                    if (object.errorResponse !== undefined && object.errorResponse !== null) {
                        if (typeof object.errorResponse !== "object")
                            throw TypeError(".grpc.reflection.v1alpha.ServerReflectionResponse.errorResponse: object expected");
                        message.errorResponse = $types[5].fromObject(object.errorResponse);
                    }
                    return message;
                };

                /**
                 * Creates a ServerReflectionResponse message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.reflection.v1alpha.ServerReflectionResponse.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ServerReflectionResponse} ServerReflectionResponse
                 */
                ServerReflectionResponse.from = ServerReflectionResponse.fromObject;

                /**
                 * Creates a plain object from a ServerReflectionResponse message. Also converts values to other types if specified.
                 * @param {grpc.reflection.v1alpha.ServerReflectionResponse} message ServerReflectionResponse
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ServerReflectionResponse.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.validHost = "";
                        object.originalRequest = null;
                        object.fileDescriptorResponse = null;
                        object.allExtensionNumbersResponse = null;
                        object.listServicesResponse = null;
                        object.errorResponse = null;
                    }
                    if (message.validHost !== undefined && message.validHost !== null && message.hasOwnProperty("validHost"))
                        object.validHost = message.validHost;
                    if (message.originalRequest !== undefined && message.originalRequest !== null && message.hasOwnProperty("originalRequest"))
                        object.originalRequest = $types[1].toObject(message.originalRequest, options);
                    if (message.fileDescriptorResponse !== undefined && message.fileDescriptorResponse !== null && message.hasOwnProperty("fileDescriptorResponse"))
                        object.fileDescriptorResponse = $types[2].toObject(message.fileDescriptorResponse, options);
                    if (message.allExtensionNumbersResponse !== undefined && message.allExtensionNumbersResponse !== null && message.hasOwnProperty("allExtensionNumbersResponse"))
                        object.allExtensionNumbersResponse = $types[3].toObject(message.allExtensionNumbersResponse, options);
                    if (message.listServicesResponse !== undefined && message.listServicesResponse !== null && message.hasOwnProperty("listServicesResponse"))
                        object.listServicesResponse = $types[4].toObject(message.listServicesResponse, options);
                    if (message.errorResponse !== undefined && message.errorResponse !== null && message.hasOwnProperty("errorResponse"))
                        object.errorResponse = $types[5].toObject(message.errorResponse, options);
                    return object;
                };

                /**
                 * Creates a plain object from this ServerReflectionResponse message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ServerReflectionResponse.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this ServerReflectionResponse to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                ServerReflectionResponse.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ServerReflectionResponse;
            })();

            v1alpha.FileDescriptorResponse = (function() {

                /**
                 * Constructs a new FileDescriptorResponse.
                 * @exports grpc.reflection.v1alpha.FileDescriptorResponse
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function FileDescriptorResponse(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * FileDescriptorResponse fileDescriptorProto.
                 * @type {Array.<Uint8Array>}
                 */
                FileDescriptorResponse.prototype.fileDescriptorProto = $util.emptyArray;

                /**
                 * Creates a new FileDescriptorResponse instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.reflection.v1alpha.FileDescriptorResponse} FileDescriptorResponse instance
                 */
                FileDescriptorResponse.create = function create(properties) {
                    return new FileDescriptorResponse(properties);
                };

                /**
                 * Encodes the specified FileDescriptorResponse message.
                 * @param {grpc.reflection.v1alpha.FileDescriptorResponse|Object} message FileDescriptorResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                FileDescriptorResponse.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.fileDescriptorProto !== undefined && message.hasOwnProperty("fileDescriptorProto"))
                        for (var i = 0; i < message.fileDescriptorProto.length; ++i)
                            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.fileDescriptorProto[i]);
                    return writer;
                };

                /**
                 * Encodes the specified FileDescriptorResponse message, length delimited.
                 * @param {grpc.reflection.v1alpha.FileDescriptorResponse|Object} message FileDescriptorResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                FileDescriptorResponse.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a FileDescriptorResponse message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.reflection.v1alpha.FileDescriptorResponse} FileDescriptorResponse
                 */
                FileDescriptorResponse.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.grpc.reflection.v1alpha.FileDescriptorResponse();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            if (!(message.fileDescriptorProto && message.fileDescriptorProto.length))
                                message.fileDescriptorProto = [];
                            message.fileDescriptorProto.push(reader.bytes());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a FileDescriptorResponse message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.reflection.v1alpha.FileDescriptorResponse} FileDescriptorResponse
                 */
                FileDescriptorResponse.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a FileDescriptorResponse message.
                 * @param {grpc.reflection.v1alpha.FileDescriptorResponse|Object} message FileDescriptorResponse message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                FileDescriptorResponse.verify = function verify(message) {
                    if (message.fileDescriptorProto !== undefined) {
                        if (!Array.isArray(message.fileDescriptorProto))
                            return "fileDescriptorProto: array expected";
                        for (var i = 0; i < message.fileDescriptorProto.length; ++i)
                            if (!(message.fileDescriptorProto[i] && typeof message.fileDescriptorProto[i].length === "number" || $util.isString(message.fileDescriptorProto[i])))
                                return "fileDescriptorProto: buffer[] expected";
                    }
                    return null;
                };

                /**
                 * Creates a FileDescriptorResponse message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.FileDescriptorResponse} FileDescriptorResponse
                 */
                FileDescriptorResponse.fromObject = function fromObject(object) {
                    if (object instanceof $root.grpc.reflection.v1alpha.FileDescriptorResponse)
                        return object;
                    var message = new $root.grpc.reflection.v1alpha.FileDescriptorResponse();
                    if (object.fileDescriptorProto) {
                        if (!Array.isArray(object.fileDescriptorProto))
                            throw TypeError(".grpc.reflection.v1alpha.FileDescriptorResponse.fileDescriptorProto: array expected");
                        message.fileDescriptorProto = [];
                        for (var i = 0; i < object.fileDescriptorProto.length; ++i)
                            if (typeof object.fileDescriptorProto[i] === "string")
                                $util.base64.decode(object.fileDescriptorProto[i], message.fileDescriptorProto[i] = $util.newBuffer($util.base64.length(object.fileDescriptorProto[i])), 0);
                            else if (object.fileDescriptorProto[i].length)
                                message.fileDescriptorProto[i] = object.fileDescriptorProto[i];
                    }
                    return message;
                };

                /**
                 * Creates a FileDescriptorResponse message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.reflection.v1alpha.FileDescriptorResponse.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.FileDescriptorResponse} FileDescriptorResponse
                 */
                FileDescriptorResponse.from = FileDescriptorResponse.fromObject;

                /**
                 * Creates a plain object from a FileDescriptorResponse message. Also converts values to other types if specified.
                 * @param {grpc.reflection.v1alpha.FileDescriptorResponse} message FileDescriptorResponse
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                FileDescriptorResponse.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.fileDescriptorProto = [];
                    if (message.fileDescriptorProto !== undefined && message.fileDescriptorProto !== null && message.hasOwnProperty("fileDescriptorProto")) {
                        object.fileDescriptorProto = [];
                        for (var j = 0; j < message.fileDescriptorProto.length; ++j)
                            object.fileDescriptorProto[j] = options.bytes === String ? $util.base64.encode(message.fileDescriptorProto[j], 0, message.fileDescriptorProto[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.fileDescriptorProto[j]) : message.fileDescriptorProto[j];
                    }
                    return object;
                };

                /**
                 * Creates a plain object from this FileDescriptorResponse message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                FileDescriptorResponse.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this FileDescriptorResponse to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                FileDescriptorResponse.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return FileDescriptorResponse;
            })();

            v1alpha.ExtensionNumberResponse = (function() {

                /**
                 * Constructs a new ExtensionNumberResponse.
                 * @exports grpc.reflection.v1alpha.ExtensionNumberResponse
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function ExtensionNumberResponse(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ExtensionNumberResponse baseTypeName.
                 * @type {string}
                 */
                ExtensionNumberResponse.prototype.baseTypeName = "";

                /**
                 * ExtensionNumberResponse extensionNumber.
                 * @type {Array.<number>}
                 */
                ExtensionNumberResponse.prototype.extensionNumber = $util.emptyArray;

                /**
                 * Creates a new ExtensionNumberResponse instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.reflection.v1alpha.ExtensionNumberResponse} ExtensionNumberResponse instance
                 */
                ExtensionNumberResponse.create = function create(properties) {
                    return new ExtensionNumberResponse(properties);
                };

                /**
                 * Encodes the specified ExtensionNumberResponse message.
                 * @param {grpc.reflection.v1alpha.ExtensionNumberResponse|Object} message ExtensionNumberResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ExtensionNumberResponse.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.baseTypeName !== undefined && message.hasOwnProperty("baseTypeName"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.baseTypeName);
                    if (message.extensionNumber && message.extensionNumber.length && message.hasOwnProperty("extensionNumber")) {
                        writer.uint32(/* id 2, wireType 2 =*/18).fork();
                        for (var i = 0; i < message.extensionNumber.length; ++i)
                            writer.int32(message.extensionNumber[i]);
                        writer.ldelim();
                    }
                    return writer;
                };

                /**
                 * Encodes the specified ExtensionNumberResponse message, length delimited.
                 * @param {grpc.reflection.v1alpha.ExtensionNumberResponse|Object} message ExtensionNumberResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ExtensionNumberResponse.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an ExtensionNumberResponse message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.reflection.v1alpha.ExtensionNumberResponse} ExtensionNumberResponse
                 */
                ExtensionNumberResponse.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.grpc.reflection.v1alpha.ExtensionNumberResponse();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.baseTypeName = reader.string();
                            break;
                        case 2:
                            if (!(message.extensionNumber && message.extensionNumber.length))
                                message.extensionNumber = [];
                            if ((tag & 7) === 2) {
                                var end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.extensionNumber.push(reader.int32());
                            } else
                                message.extensionNumber.push(reader.int32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an ExtensionNumberResponse message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.reflection.v1alpha.ExtensionNumberResponse} ExtensionNumberResponse
                 */
                ExtensionNumberResponse.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an ExtensionNumberResponse message.
                 * @param {grpc.reflection.v1alpha.ExtensionNumberResponse|Object} message ExtensionNumberResponse message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                ExtensionNumberResponse.verify = function verify(message) {
                    if (message.baseTypeName !== undefined)
                        if (!$util.isString(message.baseTypeName))
                            return "baseTypeName: string expected";
                    if (message.extensionNumber !== undefined) {
                        if (!Array.isArray(message.extensionNumber))
                            return "extensionNumber: array expected";
                        for (var i = 0; i < message.extensionNumber.length; ++i)
                            if (!$util.isInteger(message.extensionNumber[i]))
                                return "extensionNumber: integer[] expected";
                    }
                    return null;
                };

                /**
                 * Creates an ExtensionNumberResponse message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ExtensionNumberResponse} ExtensionNumberResponse
                 */
                ExtensionNumberResponse.fromObject = function fromObject(object) {
                    if (object instanceof $root.grpc.reflection.v1alpha.ExtensionNumberResponse)
                        return object;
                    var message = new $root.grpc.reflection.v1alpha.ExtensionNumberResponse();
                    if (object.baseTypeName !== undefined && object.baseTypeName !== null)
                        message.baseTypeName = String(object.baseTypeName);
                    if (object.extensionNumber) {
                        if (!Array.isArray(object.extensionNumber))
                            throw TypeError(".grpc.reflection.v1alpha.ExtensionNumberResponse.extensionNumber: array expected");
                        message.extensionNumber = [];
                        for (var i = 0; i < object.extensionNumber.length; ++i)
                            message.extensionNumber[i] = object.extensionNumber[i] | 0;
                    }
                    return message;
                };

                /**
                 * Creates an ExtensionNumberResponse message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.reflection.v1alpha.ExtensionNumberResponse.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ExtensionNumberResponse} ExtensionNumberResponse
                 */
                ExtensionNumberResponse.from = ExtensionNumberResponse.fromObject;

                /**
                 * Creates a plain object from an ExtensionNumberResponse message. Also converts values to other types if specified.
                 * @param {grpc.reflection.v1alpha.ExtensionNumberResponse} message ExtensionNumberResponse
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ExtensionNumberResponse.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.extensionNumber = [];
                    if (options.defaults)
                        object.baseTypeName = "";
                    if (message.baseTypeName !== undefined && message.baseTypeName !== null && message.hasOwnProperty("baseTypeName"))
                        object.baseTypeName = message.baseTypeName;
                    if (message.extensionNumber !== undefined && message.extensionNumber !== null && message.hasOwnProperty("extensionNumber")) {
                        object.extensionNumber = [];
                        for (var j = 0; j < message.extensionNumber.length; ++j)
                            object.extensionNumber[j] = message.extensionNumber[j];
                    }
                    return object;
                };

                /**
                 * Creates a plain object from this ExtensionNumberResponse message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ExtensionNumberResponse.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this ExtensionNumberResponse to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                ExtensionNumberResponse.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ExtensionNumberResponse;
            })();

            v1alpha.ListServiceResponse = (function() {

                /**
                 * Constructs a new ListServiceResponse.
                 * @exports grpc.reflection.v1alpha.ListServiceResponse
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function ListServiceResponse(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ListServiceResponse service.
                 * @type {Array.<grpc.reflection.v1alpha.ServiceResponse>}
                 */
                ListServiceResponse.prototype.service = $util.emptyArray;

                // Lazily resolved type references
                var $types = {
                    0: "grpc.reflection.v1alpha.ServiceResponse"
                }; $lazyTypes.push($types);

                /**
                 * Creates a new ListServiceResponse instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.reflection.v1alpha.ListServiceResponse} ListServiceResponse instance
                 */
                ListServiceResponse.create = function create(properties) {
                    return new ListServiceResponse(properties);
                };

                /**
                 * Encodes the specified ListServiceResponse message.
                 * @param {grpc.reflection.v1alpha.ListServiceResponse|Object} message ListServiceResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ListServiceResponse.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.service !== undefined && message.hasOwnProperty("service"))
                        for (var i = 0; i < message.service.length; ++i)
                            $types[0].encode(message.service[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified ListServiceResponse message, length delimited.
                 * @param {grpc.reflection.v1alpha.ListServiceResponse|Object} message ListServiceResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ListServiceResponse.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a ListServiceResponse message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.reflection.v1alpha.ListServiceResponse} ListServiceResponse
                 */
                ListServiceResponse.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.grpc.reflection.v1alpha.ListServiceResponse();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            if (!(message.service && message.service.length))
                                message.service = [];
                            message.service.push($types[0].decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a ListServiceResponse message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.reflection.v1alpha.ListServiceResponse} ListServiceResponse
                 */
                ListServiceResponse.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ListServiceResponse message.
                 * @param {grpc.reflection.v1alpha.ListServiceResponse|Object} message ListServiceResponse message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                ListServiceResponse.verify = function verify(message) {
                    if (message.service !== undefined) {
                        if (!Array.isArray(message.service))
                            return "service: array expected";
                        for (var i = 0; i < message.service.length; ++i) {
                            var error = $types[0].verify(message.service[i]);
                            if (error)
                                return "service." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a ListServiceResponse message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ListServiceResponse} ListServiceResponse
                 */
                ListServiceResponse.fromObject = function fromObject(object) {
                    if (object instanceof $root.grpc.reflection.v1alpha.ListServiceResponse)
                        return object;
                    var message = new $root.grpc.reflection.v1alpha.ListServiceResponse();
                    if (object.service) {
                        if (!Array.isArray(object.service))
                            throw TypeError(".grpc.reflection.v1alpha.ListServiceResponse.service: array expected");
                        message.service = [];
                        for (var i = 0; i < object.service.length; ++i) {
                            if (typeof object.service[i] !== "object")
                                throw TypeError(".grpc.reflection.v1alpha.ListServiceResponse.service: object expected");
                            message.service[i] = $types[0].fromObject(object.service[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a ListServiceResponse message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.reflection.v1alpha.ListServiceResponse.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ListServiceResponse} ListServiceResponse
                 */
                ListServiceResponse.from = ListServiceResponse.fromObject;

                /**
                 * Creates a plain object from a ListServiceResponse message. Also converts values to other types if specified.
                 * @param {grpc.reflection.v1alpha.ListServiceResponse} message ListServiceResponse
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ListServiceResponse.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.service = [];
                    if (message.service !== undefined && message.service !== null && message.hasOwnProperty("service")) {
                        object.service = [];
                        for (var j = 0; j < message.service.length; ++j)
                            object.service[j] = $types[0].toObject(message.service[j], options);
                    }
                    return object;
                };

                /**
                 * Creates a plain object from this ListServiceResponse message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ListServiceResponse.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this ListServiceResponse to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                ListServiceResponse.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ListServiceResponse;
            })();

            v1alpha.ServiceResponse = (function() {

                /**
                 * Constructs a new ServiceResponse.
                 * @exports grpc.reflection.v1alpha.ServiceResponse
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function ServiceResponse(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ServiceResponse name.
                 * @type {string}
                 */
                ServiceResponse.prototype.name = "";

                /**
                 * Creates a new ServiceResponse instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.reflection.v1alpha.ServiceResponse} ServiceResponse instance
                 */
                ServiceResponse.create = function create(properties) {
                    return new ServiceResponse(properties);
                };

                /**
                 * Encodes the specified ServiceResponse message.
                 * @param {grpc.reflection.v1alpha.ServiceResponse|Object} message ServiceResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ServiceResponse.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name !== undefined && message.hasOwnProperty("name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    return writer;
                };

                /**
                 * Encodes the specified ServiceResponse message, length delimited.
                 * @param {grpc.reflection.v1alpha.ServiceResponse|Object} message ServiceResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ServiceResponse.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a ServiceResponse message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.reflection.v1alpha.ServiceResponse} ServiceResponse
                 */
                ServiceResponse.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.grpc.reflection.v1alpha.ServiceResponse();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a ServiceResponse message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.reflection.v1alpha.ServiceResponse} ServiceResponse
                 */
                ServiceResponse.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ServiceResponse message.
                 * @param {grpc.reflection.v1alpha.ServiceResponse|Object} message ServiceResponse message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                ServiceResponse.verify = function verify(message) {
                    if (message.name !== undefined)
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    return null;
                };

                /**
                 * Creates a ServiceResponse message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ServiceResponse} ServiceResponse
                 */
                ServiceResponse.fromObject = function fromObject(object) {
                    if (object instanceof $root.grpc.reflection.v1alpha.ServiceResponse)
                        return object;
                    var message = new $root.grpc.reflection.v1alpha.ServiceResponse();
                    if (object.name !== undefined && object.name !== null)
                        message.name = String(object.name);
                    return message;
                };

                /**
                 * Creates a ServiceResponse message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.reflection.v1alpha.ServiceResponse.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ServiceResponse} ServiceResponse
                 */
                ServiceResponse.from = ServiceResponse.fromObject;

                /**
                 * Creates a plain object from a ServiceResponse message. Also converts values to other types if specified.
                 * @param {grpc.reflection.v1alpha.ServiceResponse} message ServiceResponse
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ServiceResponse.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.name = "";
                    if (message.name !== undefined && message.name !== null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    return object;
                };

                /**
                 * Creates a plain object from this ServiceResponse message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ServiceResponse.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this ServiceResponse to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                ServiceResponse.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ServiceResponse;
            })();

            v1alpha.ErrorResponse = (function() {

                /**
                 * Constructs a new ErrorResponse.
                 * @exports grpc.reflection.v1alpha.ErrorResponse
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function ErrorResponse(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ErrorResponse errorCode.
                 * @type {number}
                 */
                ErrorResponse.prototype.errorCode = 0;

                /**
                 * ErrorResponse errorMessage.
                 * @type {string}
                 */
                ErrorResponse.prototype.errorMessage = "";

                /**
                 * Creates a new ErrorResponse instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.reflection.v1alpha.ErrorResponse} ErrorResponse instance
                 */
                ErrorResponse.create = function create(properties) {
                    return new ErrorResponse(properties);
                };

                /**
                 * Encodes the specified ErrorResponse message.
                 * @param {grpc.reflection.v1alpha.ErrorResponse|Object} message ErrorResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ErrorResponse.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.errorCode !== undefined && message.hasOwnProperty("errorCode"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.errorCode);
                    if (message.errorMessage !== undefined && message.hasOwnProperty("errorMessage"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.errorMessage);
                    return writer;
                };

                /**
                 * Encodes the specified ErrorResponse message, length delimited.
                 * @param {grpc.reflection.v1alpha.ErrorResponse|Object} message ErrorResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ErrorResponse.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an ErrorResponse message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.reflection.v1alpha.ErrorResponse} ErrorResponse
                 */
                ErrorResponse.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.grpc.reflection.v1alpha.ErrorResponse();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.errorCode = reader.int32();
                            break;
                        case 2:
                            message.errorMessage = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an ErrorResponse message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.reflection.v1alpha.ErrorResponse} ErrorResponse
                 */
                ErrorResponse.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an ErrorResponse message.
                 * @param {grpc.reflection.v1alpha.ErrorResponse|Object} message ErrorResponse message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                ErrorResponse.verify = function verify(message) {
                    if (message.errorCode !== undefined)
                        if (!$util.isInteger(message.errorCode))
                            return "errorCode: integer expected";
                    if (message.errorMessage !== undefined)
                        if (!$util.isString(message.errorMessage))
                            return "errorMessage: string expected";
                    return null;
                };

                /**
                 * Creates an ErrorResponse message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ErrorResponse} ErrorResponse
                 */
                ErrorResponse.fromObject = function fromObject(object) {
                    if (object instanceof $root.grpc.reflection.v1alpha.ErrorResponse)
                        return object;
                    var message = new $root.grpc.reflection.v1alpha.ErrorResponse();
                    if (object.errorCode !== undefined && object.errorCode !== null)
                        message.errorCode = object.errorCode | 0;
                    if (object.errorMessage !== undefined && object.errorMessage !== null)
                        message.errorMessage = String(object.errorMessage);
                    return message;
                };

                /**
                 * Creates an ErrorResponse message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.reflection.v1alpha.ErrorResponse.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ErrorResponse} ErrorResponse
                 */
                ErrorResponse.from = ErrorResponse.fromObject;

                /**
                 * Creates a plain object from an ErrorResponse message. Also converts values to other types if specified.
                 * @param {grpc.reflection.v1alpha.ErrorResponse} message ErrorResponse
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ErrorResponse.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.errorCode = 0;
                        object.errorMessage = "";
                    }
                    if (message.errorCode !== undefined && message.errorCode !== null && message.hasOwnProperty("errorCode"))
                        object.errorCode = message.errorCode;
                    if (message.errorMessage !== undefined && message.errorMessage !== null && message.hasOwnProperty("errorMessage"))
                        object.errorMessage = message.errorMessage;
                    return object;
                };

                /**
                 * Creates a plain object from this ErrorResponse message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ErrorResponse.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this ErrorResponse to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                ErrorResponse.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ErrorResponse;
            })();

            return v1alpha;
        })();

        return reflection;
    })();

    return grpc;
})();

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @exports google.protobuf
         * @namespace
         */
        var protobuf = {};

        protobuf.Any = (function() {

            /**
             * Constructs a new Any.
             * @exports google.protobuf.Any
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function Any(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * Any type_url.
             * @type {string}
             */
            Any.prototype.type_url = "";

            /**
             * Any value.
             * @type {Uint8Array}
             */
            Any.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new Any instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.Any} Any instance
             */
            Any.create = function create(properties) {
                return new Any(properties);
            };

            /**
             * Encodes the specified Any message.
             * @param {google.protobuf.Any|Object} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type_url !== undefined && message.hasOwnProperty("type_url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.type_url);
                if (message.value && message.hasOwnProperty("value"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
                return writer;
            };

            /**
             * Encodes the specified Any message, length delimited.
             * @param {google.protobuf.Any|Object} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Any} Any
             */
            Any.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Any();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.type_url = reader.string();
                        break;
                    case 2:
                        message.value = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Any} Any
             */
            Any.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Any message.
             * @param {google.protobuf.Any|Object} message Any message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            Any.verify = function verify(message) {
                if (message.type_url !== undefined)
                    if (!$util.isString(message.type_url))
                        return "type_url: string expected";
                if (message.value !== undefined)
                    if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                        return "value: buffer expected";
                return null;
            };

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Any} Any
             */
            Any.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Any)
                    return object;
                var message = new $root.google.protobuf.Any();
                if (object.type_url !== undefined && object.type_url !== null)
                    message.type_url = String(object.type_url);
                if (object.value !== undefined && object.value !== null)
                    if (typeof object.value === "string")
                        $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                    else if (object.value.length)
                        message.value = object.value;
                return message;
            };

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.Any.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Any} Any
             */
            Any.from = Any.fromObject;

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @param {google.protobuf.Any} message Any
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Any.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.type_url = "";
                    object.value = options.bytes === String ? "" : [];
                }
                if (message.type_url !== undefined && message.type_url !== null && message.hasOwnProperty("type_url"))
                    object.type_url = message.type_url;
                if (message.value !== undefined && message.value !== null && message.hasOwnProperty("value"))
                    object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                return object;
            };

            /**
             * Creates a plain object from this Any message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Any.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this Any to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            Any.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Any;
        })();

        protobuf.FileDescriptorSet = (function() {

            /**
             * Constructs a new FileDescriptorSet.
             * @exports google.protobuf.FileDescriptorSet
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function FileDescriptorSet(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * FileDescriptorSet file.
             * @type {Array.<google.protobuf.FileDescriptorProto>}
             */
            FileDescriptorSet.prototype.file = $util.emptyArray;

            // Lazily resolved type references
            var $types = {
                0: "google.protobuf.FileDescriptorProto"
            }; $lazyTypes.push($types);

            /**
             * Creates a new FileDescriptorSet instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.FileDescriptorSet} FileDescriptorSet instance
             */
            FileDescriptorSet.create = function create(properties) {
                return new FileDescriptorSet(properties);
            };

            /**
             * Encodes the specified FileDescriptorSet message.
             * @param {google.protobuf.FileDescriptorSet|Object} message FileDescriptorSet message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FileDescriptorSet.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.file !== undefined && message.hasOwnProperty("file"))
                    for (var i = 0; i < message.file.length; ++i)
                        $types[0].encode(message.file[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified FileDescriptorSet message, length delimited.
             * @param {google.protobuf.FileDescriptorSet|Object} message FileDescriptorSet message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FileDescriptorSet.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FileDescriptorSet message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.FileDescriptorSet} FileDescriptorSet
             */
            FileDescriptorSet.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.FileDescriptorSet();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.file && message.file.length))
                            message.file = [];
                        message.file.push($types[0].decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a FileDescriptorSet message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.FileDescriptorSet} FileDescriptorSet
             */
            FileDescriptorSet.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FileDescriptorSet message.
             * @param {google.protobuf.FileDescriptorSet|Object} message FileDescriptorSet message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            FileDescriptorSet.verify = function verify(message) {
                if (message.file !== undefined) {
                    if (!Array.isArray(message.file))
                        return "file: array expected";
                    for (var i = 0; i < message.file.length; ++i) {
                        var error = $types[0].verify(message.file[i]);
                        if (error)
                            return "file." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a FileDescriptorSet message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FileDescriptorSet} FileDescriptorSet
             */
            FileDescriptorSet.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.FileDescriptorSet)
                    return object;
                var message = new $root.google.protobuf.FileDescriptorSet();
                if (object.file) {
                    if (!Array.isArray(object.file))
                        throw TypeError(".google.protobuf.FileDescriptorSet.file: array expected");
                    message.file = [];
                    for (var i = 0; i < object.file.length; ++i) {
                        if (typeof object.file[i] !== "object")
                            throw TypeError(".google.protobuf.FileDescriptorSet.file: object expected");
                        message.file[i] = $types[0].fromObject(object.file[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a FileDescriptorSet message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.FileDescriptorSet.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FileDescriptorSet} FileDescriptorSet
             */
            FileDescriptorSet.from = FileDescriptorSet.fromObject;

            /**
             * Creates a plain object from a FileDescriptorSet message. Also converts values to other types if specified.
             * @param {google.protobuf.FileDescriptorSet} message FileDescriptorSet
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FileDescriptorSet.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.file = [];
                if (message.file !== undefined && message.file !== null && message.hasOwnProperty("file")) {
                    object.file = [];
                    for (var j = 0; j < message.file.length; ++j)
                        object.file[j] = $types[0].toObject(message.file[j], options);
                }
                return object;
            };

            /**
             * Creates a plain object from this FileDescriptorSet message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FileDescriptorSet.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this FileDescriptorSet to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            FileDescriptorSet.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return FileDescriptorSet;
        })();

        protobuf.FileDescriptorProto = (function() {

            /**
             * Constructs a new FileDescriptorProto.
             * @classdesc Describes a complete .proto file.
             * @exports google.protobuf.FileDescriptorProto
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function FileDescriptorProto(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * file name, relative to root of source tree
             * @type {string}
             */
            FileDescriptorProto.prototype.name = "";

            /**
             * FileDescriptorProto package.
             * @name google.protobuf.FileDescriptorProto#package
             * @type {string}
             */
            FileDescriptorProto.prototype["package"] = "";

            /**
             * Names of files imported by this file.
             * @type {Array.<string>}
             */
            FileDescriptorProto.prototype.dependency = $util.emptyArray;

            /**
             * Indexes of the public imported files in the dependency list above.
             * @type {Array.<number>}
             */
            FileDescriptorProto.prototype.publicDependency = $util.emptyArray;

            /**
             * For Google-internal migration only. Do not use.
             * @type {Array.<number>}
             */
            FileDescriptorProto.prototype.weakDependency = $util.emptyArray;

            /**
             * All top-level definitions in this file.
             * @type {Array.<google.protobuf.DescriptorProto>}
             */
            FileDescriptorProto.prototype.messageType = $util.emptyArray;

            /**
             * FileDescriptorProto enumType.
             * @type {Array.<google.protobuf.EnumDescriptorProto>}
             */
            FileDescriptorProto.prototype.enumType = $util.emptyArray;

            /**
             * FileDescriptorProto service.
             * @type {Array.<google.protobuf.ServiceDescriptorProto>}
             */
            FileDescriptorProto.prototype.service = $util.emptyArray;

            /**
             * FileDescriptorProto extension.
             * @type {Array.<google.protobuf.FieldDescriptorProto>}
             */
            FileDescriptorProto.prototype.extension = $util.emptyArray;

            /**
             * FileDescriptorProto options.
             * @type {google.protobuf.FileOptions}
             */
            FileDescriptorProto.prototype.options = null;

            /**
             * development tools.
             * @type {google.protobuf.SourceCodeInfo}
             */
            FileDescriptorProto.prototype.sourceCodeInfo = null;

            /**
             * The supported values are "proto2" and "proto3".
             * @type {string}
             */
            FileDescriptorProto.prototype.syntax = "";

            // Lazily resolved type references
            var $types = {
                5: "google.protobuf.DescriptorProto",
                6: "google.protobuf.EnumDescriptorProto",
                7: "google.protobuf.ServiceDescriptorProto",
                8: "google.protobuf.FieldDescriptorProto",
                9: "google.protobuf.FileOptions",
                10: "google.protobuf.SourceCodeInfo"
            }; $lazyTypes.push($types);

            /**
             * Creates a new FileDescriptorProto instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.FileDescriptorProto} FileDescriptorProto instance
             */
            FileDescriptorProto.create = function create(properties) {
                return new FileDescriptorProto(properties);
            };

            /**
             * Encodes the specified FileDescriptorProto message.
             * @param {google.protobuf.FileDescriptorProto|Object} message FileDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FileDescriptorProto.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name !== undefined && message.hasOwnProperty("name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message["package"] !== undefined && message.hasOwnProperty("package"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message["package"]);
                if (message.dependency !== undefined && message.hasOwnProperty("dependency"))
                    for (var i = 0; i < message.dependency.length; ++i)
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.dependency[i]);
                if (message.publicDependency !== undefined && message.hasOwnProperty("publicDependency"))
                    for (var i = 0; i < message.publicDependency.length; ++i)
                        writer.uint32(/* id 10, wireType 0 =*/80).int32(message.publicDependency[i]);
                if (message.weakDependency !== undefined && message.hasOwnProperty("weakDependency"))
                    for (var i = 0; i < message.weakDependency.length; ++i)
                        writer.uint32(/* id 11, wireType 0 =*/88).int32(message.weakDependency[i]);
                if (message.messageType !== undefined && message.hasOwnProperty("messageType"))
                    for (var i = 0; i < message.messageType.length; ++i)
                        $types[5].encode(message.messageType[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.enumType !== undefined && message.hasOwnProperty("enumType"))
                    for (var i = 0; i < message.enumType.length; ++i)
                        $types[6].encode(message.enumType[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.service !== undefined && message.hasOwnProperty("service"))
                    for (var i = 0; i < message.service.length; ++i)
                        $types[7].encode(message.service[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.extension !== undefined && message.hasOwnProperty("extension"))
                    for (var i = 0; i < message.extension.length; ++i)
                        $types[8].encode(message.extension[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                if (message.options !== undefined && message.hasOwnProperty("options"))
                    $types[9].encode(message.options, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                if (message.sourceCodeInfo !== undefined && message.hasOwnProperty("sourceCodeInfo"))
                    $types[10].encode(message.sourceCodeInfo, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
                if (message.syntax !== undefined && message.hasOwnProperty("syntax"))
                    writer.uint32(/* id 12, wireType 2 =*/98).string(message.syntax);
                return writer;
            };

            /**
             * Encodes the specified FileDescriptorProto message, length delimited.
             * @param {google.protobuf.FileDescriptorProto|Object} message FileDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FileDescriptorProto.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FileDescriptorProto message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.FileDescriptorProto} FileDescriptorProto
             */
            FileDescriptorProto.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.FileDescriptorProto();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.name = reader.string();
                        break;
                    case 2:
                        message["package"] = reader.string();
                        break;
                    case 3:
                        if (!(message.dependency && message.dependency.length))
                            message.dependency = [];
                        message.dependency.push(reader.string());
                        break;
                    case 10:
                        if (!(message.publicDependency && message.publicDependency.length))
                            message.publicDependency = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.publicDependency.push(reader.int32());
                        } else
                            message.publicDependency.push(reader.int32());
                        break;
                    case 11:
                        if (!(message.weakDependency && message.weakDependency.length))
                            message.weakDependency = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.weakDependency.push(reader.int32());
                        } else
                            message.weakDependency.push(reader.int32());
                        break;
                    case 4:
                        if (!(message.messageType && message.messageType.length))
                            message.messageType = [];
                        message.messageType.push($types[5].decode(reader, reader.uint32()));
                        break;
                    case 5:
                        if (!(message.enumType && message.enumType.length))
                            message.enumType = [];
                        message.enumType.push($types[6].decode(reader, reader.uint32()));
                        break;
                    case 6:
                        if (!(message.service && message.service.length))
                            message.service = [];
                        message.service.push($types[7].decode(reader, reader.uint32()));
                        break;
                    case 7:
                        if (!(message.extension && message.extension.length))
                            message.extension = [];
                        message.extension.push($types[8].decode(reader, reader.uint32()));
                        break;
                    case 8:
                        message.options = $types[9].decode(reader, reader.uint32());
                        break;
                    case 9:
                        message.sourceCodeInfo = $types[10].decode(reader, reader.uint32());
                        break;
                    case 12:
                        message.syntax = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a FileDescriptorProto message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.FileDescriptorProto} FileDescriptorProto
             */
            FileDescriptorProto.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FileDescriptorProto message.
             * @param {google.protobuf.FileDescriptorProto|Object} message FileDescriptorProto message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            FileDescriptorProto.verify = function verify(message) {
                if (message.name !== undefined)
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message["package"] !== undefined)
                    if (!$util.isString(message["package"]))
                        return "package: string expected";
                if (message.dependency !== undefined) {
                    if (!Array.isArray(message.dependency))
                        return "dependency: array expected";
                    for (var i = 0; i < message.dependency.length; ++i)
                        if (!$util.isString(message.dependency[i]))
                            return "dependency: string[] expected";
                }
                if (message.publicDependency !== undefined) {
                    if (!Array.isArray(message.publicDependency))
                        return "publicDependency: array expected";
                    for (var i = 0; i < message.publicDependency.length; ++i)
                        if (!$util.isInteger(message.publicDependency[i]))
                            return "publicDependency: integer[] expected";
                }
                if (message.weakDependency !== undefined) {
                    if (!Array.isArray(message.weakDependency))
                        return "weakDependency: array expected";
                    for (var i = 0; i < message.weakDependency.length; ++i)
                        if (!$util.isInteger(message.weakDependency[i]))
                            return "weakDependency: integer[] expected";
                }
                if (message.messageType !== undefined) {
                    if (!Array.isArray(message.messageType))
                        return "messageType: array expected";
                    for (var i = 0; i < message.messageType.length; ++i) {
                        var error = $types[5].verify(message.messageType[i]);
                        if (error)
                            return "messageType." + error;
                    }
                }
                if (message.enumType !== undefined) {
                    if (!Array.isArray(message.enumType))
                        return "enumType: array expected";
                    for (var i = 0; i < message.enumType.length; ++i) {
                        var error = $types[6].verify(message.enumType[i]);
                        if (error)
                            return "enumType." + error;
                    }
                }
                if (message.service !== undefined) {
                    if (!Array.isArray(message.service))
                        return "service: array expected";
                    for (var i = 0; i < message.service.length; ++i) {
                        var error = $types[7].verify(message.service[i]);
                        if (error)
                            return "service." + error;
                    }
                }
                if (message.extension !== undefined) {
                    if (!Array.isArray(message.extension))
                        return "extension: array expected";
                    for (var i = 0; i < message.extension.length; ++i) {
                        var error = $types[8].verify(message.extension[i]);
                        if (error)
                            return "extension." + error;
                    }
                }
                if (message.options !== undefined && message.options !== null) {
                    var error = $types[9].verify(message.options);
                    if (error)
                        return "options." + error;
                }
                if (message.sourceCodeInfo !== undefined && message.sourceCodeInfo !== null) {
                    var error = $types[10].verify(message.sourceCodeInfo);
                    if (error)
                        return "sourceCodeInfo." + error;
                }
                if (message.syntax !== undefined)
                    if (!$util.isString(message.syntax))
                        return "syntax: string expected";
                return null;
            };

            /**
             * Creates a FileDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FileDescriptorProto} FileDescriptorProto
             */
            FileDescriptorProto.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.FileDescriptorProto)
                    return object;
                var message = new $root.google.protobuf.FileDescriptorProto();
                if (object.name !== undefined && object.name !== null)
                    message.name = String(object.name);
                if (object["package"] !== undefined && object["package"] !== null)
                    message["package"] = String(object["package"]);
                if (object.dependency) {
                    if (!Array.isArray(object.dependency))
                        throw TypeError(".google.protobuf.FileDescriptorProto.dependency: array expected");
                    message.dependency = [];
                    for (var i = 0; i < object.dependency.length; ++i)
                        message.dependency[i] = String(object.dependency[i]);
                }
                if (object.publicDependency) {
                    if (!Array.isArray(object.publicDependency))
                        throw TypeError(".google.protobuf.FileDescriptorProto.publicDependency: array expected");
                    message.publicDependency = [];
                    for (var i = 0; i < object.publicDependency.length; ++i)
                        message.publicDependency[i] = object.publicDependency[i] | 0;
                }
                if (object.weakDependency) {
                    if (!Array.isArray(object.weakDependency))
                        throw TypeError(".google.protobuf.FileDescriptorProto.weakDependency: array expected");
                    message.weakDependency = [];
                    for (var i = 0; i < object.weakDependency.length; ++i)
                        message.weakDependency[i] = object.weakDependency[i] | 0;
                }
                if (object.messageType) {
                    if (!Array.isArray(object.messageType))
                        throw TypeError(".google.protobuf.FileDescriptorProto.messageType: array expected");
                    message.messageType = [];
                    for (var i = 0; i < object.messageType.length; ++i) {
                        if (typeof object.messageType[i] !== "object")
                            throw TypeError(".google.protobuf.FileDescriptorProto.messageType: object expected");
                        message.messageType[i] = $types[5].fromObject(object.messageType[i]);
                    }
                }
                if (object.enumType) {
                    if (!Array.isArray(object.enumType))
                        throw TypeError(".google.protobuf.FileDescriptorProto.enumType: array expected");
                    message.enumType = [];
                    for (var i = 0; i < object.enumType.length; ++i) {
                        if (typeof object.enumType[i] !== "object")
                            throw TypeError(".google.protobuf.FileDescriptorProto.enumType: object expected");
                        message.enumType[i] = $types[6].fromObject(object.enumType[i]);
                    }
                }
                if (object.service) {
                    if (!Array.isArray(object.service))
                        throw TypeError(".google.protobuf.FileDescriptorProto.service: array expected");
                    message.service = [];
                    for (var i = 0; i < object.service.length; ++i) {
                        if (typeof object.service[i] !== "object")
                            throw TypeError(".google.protobuf.FileDescriptorProto.service: object expected");
                        message.service[i] = $types[7].fromObject(object.service[i]);
                    }
                }
                if (object.extension) {
                    if (!Array.isArray(object.extension))
                        throw TypeError(".google.protobuf.FileDescriptorProto.extension: array expected");
                    message.extension = [];
                    for (var i = 0; i < object.extension.length; ++i) {
                        if (typeof object.extension[i] !== "object")
                            throw TypeError(".google.protobuf.FileDescriptorProto.extension: object expected");
                        message.extension[i] = $types[8].fromObject(object.extension[i]);
                    }
                }
                if (object.options !== undefined && object.options !== null) {
                    if (typeof object.options !== "object")
                        throw TypeError(".google.protobuf.FileDescriptorProto.options: object expected");
                    message.options = $types[9].fromObject(object.options);
                }
                if (object.sourceCodeInfo !== undefined && object.sourceCodeInfo !== null) {
                    if (typeof object.sourceCodeInfo !== "object")
                        throw TypeError(".google.protobuf.FileDescriptorProto.sourceCodeInfo: object expected");
                    message.sourceCodeInfo = $types[10].fromObject(object.sourceCodeInfo);
                }
                if (object.syntax !== undefined && object.syntax !== null)
                    message.syntax = String(object.syntax);
                return message;
            };

            /**
             * Creates a FileDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.FileDescriptorProto.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FileDescriptorProto} FileDescriptorProto
             */
            FileDescriptorProto.from = FileDescriptorProto.fromObject;

            /**
             * Creates a plain object from a FileDescriptorProto message. Also converts values to other types if specified.
             * @param {google.protobuf.FileDescriptorProto} message FileDescriptorProto
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FileDescriptorProto.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.dependency = [];
                    object.publicDependency = [];
                    object.weakDependency = [];
                    object.messageType = [];
                    object.enumType = [];
                    object.service = [];
                    object.extension = [];
                }
                if (options.defaults) {
                    object.name = "";
                    object["package"] = "";
                    object.options = null;
                    object.sourceCodeInfo = null;
                    object.syntax = "";
                }
                if (message.name !== undefined && message.name !== null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message["package"] !== undefined && message["package"] !== null && message.hasOwnProperty("package"))
                    object["package"] = message["package"];
                if (message.dependency !== undefined && message.dependency !== null && message.hasOwnProperty("dependency")) {
                    object.dependency = [];
                    for (var j = 0; j < message.dependency.length; ++j)
                        object.dependency[j] = message.dependency[j];
                }
                if (message.publicDependency !== undefined && message.publicDependency !== null && message.hasOwnProperty("publicDependency")) {
                    object.publicDependency = [];
                    for (var j = 0; j < message.publicDependency.length; ++j)
                        object.publicDependency[j] = message.publicDependency[j];
                }
                if (message.weakDependency !== undefined && message.weakDependency !== null && message.hasOwnProperty("weakDependency")) {
                    object.weakDependency = [];
                    for (var j = 0; j < message.weakDependency.length; ++j)
                        object.weakDependency[j] = message.weakDependency[j];
                }
                if (message.messageType !== undefined && message.messageType !== null && message.hasOwnProperty("messageType")) {
                    object.messageType = [];
                    for (var j = 0; j < message.messageType.length; ++j)
                        object.messageType[j] = $types[5].toObject(message.messageType[j], options);
                }
                if (message.enumType !== undefined && message.enumType !== null && message.hasOwnProperty("enumType")) {
                    object.enumType = [];
                    for (var j = 0; j < message.enumType.length; ++j)
                        object.enumType[j] = $types[6].toObject(message.enumType[j], options);
                }
                if (message.service !== undefined && message.service !== null && message.hasOwnProperty("service")) {
                    object.service = [];
                    for (var j = 0; j < message.service.length; ++j)
                        object.service[j] = $types[7].toObject(message.service[j], options);
                }
                if (message.extension !== undefined && message.extension !== null && message.hasOwnProperty("extension")) {
                    object.extension = [];
                    for (var j = 0; j < message.extension.length; ++j)
                        object.extension[j] = $types[8].toObject(message.extension[j], options);
                }
                if (message.options !== undefined && message.options !== null && message.hasOwnProperty("options"))
                    object.options = $types[9].toObject(message.options, options);
                if (message.sourceCodeInfo !== undefined && message.sourceCodeInfo !== null && message.hasOwnProperty("sourceCodeInfo"))
                    object.sourceCodeInfo = $types[10].toObject(message.sourceCodeInfo, options);
                if (message.syntax !== undefined && message.syntax !== null && message.hasOwnProperty("syntax"))
                    object.syntax = message.syntax;
                return object;
            };

            /**
             * Creates a plain object from this FileDescriptorProto message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FileDescriptorProto.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this FileDescriptorProto to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            FileDescriptorProto.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return FileDescriptorProto;
        })();

        protobuf.DescriptorProto = (function() {

            /**
             * Constructs a new DescriptorProto.
             * @classdesc Describes a message type.
             * @exports google.protobuf.DescriptorProto
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function DescriptorProto(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * DescriptorProto name.
             * @type {string}
             */
            DescriptorProto.prototype.name = "";

            /**
             * DescriptorProto field.
             * @type {Array.<google.protobuf.FieldDescriptorProto>}
             */
            DescriptorProto.prototype.field = $util.emptyArray;

            /**
             * DescriptorProto extension.
             * @type {Array.<google.protobuf.FieldDescriptorProto>}
             */
            DescriptorProto.prototype.extension = $util.emptyArray;

            /**
             * DescriptorProto nestedType.
             * @type {Array.<google.protobuf.DescriptorProto>}
             */
            DescriptorProto.prototype.nestedType = $util.emptyArray;

            /**
             * DescriptorProto enumType.
             * @type {Array.<google.protobuf.EnumDescriptorProto>}
             */
            DescriptorProto.prototype.enumType = $util.emptyArray;

            /**
             * DescriptorProto extensionRange.
             * @type {Array.<google.protobuf.DescriptorProto.ExtensionRange>}
             */
            DescriptorProto.prototype.extensionRange = $util.emptyArray;

            /**
             * DescriptorProto oneofDecl.
             * @type {Array.<google.protobuf.OneofDescriptorProto>}
             */
            DescriptorProto.prototype.oneofDecl = $util.emptyArray;

            /**
             * DescriptorProto options.
             * @type {google.protobuf.MessageOptions}
             */
            DescriptorProto.prototype.options = null;

            /**
             * DescriptorProto reservedRange.
             * @type {Array.<google.protobuf.DescriptorProto.ReservedRange>}
             */
            DescriptorProto.prototype.reservedRange = $util.emptyArray;

            /**
             * A given name may only be reserved once.
             * @type {Array.<string>}
             */
            DescriptorProto.prototype.reservedName = $util.emptyArray;

            // Lazily resolved type references
            var $types = {
                1: "google.protobuf.FieldDescriptorProto",
                2: "google.protobuf.FieldDescriptorProto",
                3: "google.protobuf.DescriptorProto",
                4: "google.protobuf.EnumDescriptorProto",
                5: "google.protobuf.DescriptorProto.ExtensionRange",
                6: "google.protobuf.OneofDescriptorProto",
                7: "google.protobuf.MessageOptions",
                8: "google.protobuf.DescriptorProto.ReservedRange"
            }; $lazyTypes.push($types);

            /**
             * Creates a new DescriptorProto instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.DescriptorProto} DescriptorProto instance
             */
            DescriptorProto.create = function create(properties) {
                return new DescriptorProto(properties);
            };

            /**
             * Encodes the specified DescriptorProto message.
             * @param {google.protobuf.DescriptorProto|Object} message DescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DescriptorProto.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name !== undefined && message.hasOwnProperty("name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.field !== undefined && message.hasOwnProperty("field"))
                    for (var i = 0; i < message.field.length; ++i)
                        $types[1].encode(message.field[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.extension !== undefined && message.hasOwnProperty("extension"))
                    for (var i = 0; i < message.extension.length; ++i)
                        $types[2].encode(message.extension[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.nestedType !== undefined && message.hasOwnProperty("nestedType"))
                    for (var i = 0; i < message.nestedType.length; ++i)
                        $types[3].encode(message.nestedType[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.enumType !== undefined && message.hasOwnProperty("enumType"))
                    for (var i = 0; i < message.enumType.length; ++i)
                        $types[4].encode(message.enumType[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.extensionRange !== undefined && message.hasOwnProperty("extensionRange"))
                    for (var i = 0; i < message.extensionRange.length; ++i)
                        $types[5].encode(message.extensionRange[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.oneofDecl !== undefined && message.hasOwnProperty("oneofDecl"))
                    for (var i = 0; i < message.oneofDecl.length; ++i)
                        $types[6].encode(message.oneofDecl[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                if (message.options !== undefined && message.hasOwnProperty("options"))
                    $types[7].encode(message.options, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                if (message.reservedRange !== undefined && message.hasOwnProperty("reservedRange"))
                    for (var i = 0; i < message.reservedRange.length; ++i)
                        $types[8].encode(message.reservedRange[i], writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
                if (message.reservedName !== undefined && message.hasOwnProperty("reservedName"))
                    for (var i = 0; i < message.reservedName.length; ++i)
                        writer.uint32(/* id 10, wireType 2 =*/82).string(message.reservedName[i]);
                return writer;
            };

            /**
             * Encodes the specified DescriptorProto message, length delimited.
             * @param {google.protobuf.DescriptorProto|Object} message DescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DescriptorProto.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DescriptorProto message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.DescriptorProto} DescriptorProto
             */
            DescriptorProto.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.DescriptorProto();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.name = reader.string();
                        break;
                    case 2:
                        if (!(message.field && message.field.length))
                            message.field = [];
                        message.field.push($types[1].decode(reader, reader.uint32()));
                        break;
                    case 6:
                        if (!(message.extension && message.extension.length))
                            message.extension = [];
                        message.extension.push($types[2].decode(reader, reader.uint32()));
                        break;
                    case 3:
                        if (!(message.nestedType && message.nestedType.length))
                            message.nestedType = [];
                        message.nestedType.push($types[3].decode(reader, reader.uint32()));
                        break;
                    case 4:
                        if (!(message.enumType && message.enumType.length))
                            message.enumType = [];
                        message.enumType.push($types[4].decode(reader, reader.uint32()));
                        break;
                    case 5:
                        if (!(message.extensionRange && message.extensionRange.length))
                            message.extensionRange = [];
                        message.extensionRange.push($types[5].decode(reader, reader.uint32()));
                        break;
                    case 8:
                        if (!(message.oneofDecl && message.oneofDecl.length))
                            message.oneofDecl = [];
                        message.oneofDecl.push($types[6].decode(reader, reader.uint32()));
                        break;
                    case 7:
                        message.options = $types[7].decode(reader, reader.uint32());
                        break;
                    case 9:
                        if (!(message.reservedRange && message.reservedRange.length))
                            message.reservedRange = [];
                        message.reservedRange.push($types[8].decode(reader, reader.uint32()));
                        break;
                    case 10:
                        if (!(message.reservedName && message.reservedName.length))
                            message.reservedName = [];
                        message.reservedName.push(reader.string());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DescriptorProto message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.DescriptorProto} DescriptorProto
             */
            DescriptorProto.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DescriptorProto message.
             * @param {google.protobuf.DescriptorProto|Object} message DescriptorProto message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            DescriptorProto.verify = function verify(message) {
                if (message.name !== undefined)
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.field !== undefined) {
                    if (!Array.isArray(message.field))
                        return "field: array expected";
                    for (var i = 0; i < message.field.length; ++i) {
                        var error = $types[1].verify(message.field[i]);
                        if (error)
                            return "field." + error;
                    }
                }
                if (message.extension !== undefined) {
                    if (!Array.isArray(message.extension))
                        return "extension: array expected";
                    for (var i = 0; i < message.extension.length; ++i) {
                        var error = $types[2].verify(message.extension[i]);
                        if (error)
                            return "extension." + error;
                    }
                }
                if (message.nestedType !== undefined) {
                    if (!Array.isArray(message.nestedType))
                        return "nestedType: array expected";
                    for (var i = 0; i < message.nestedType.length; ++i) {
                        var error = $types[3].verify(message.nestedType[i]);
                        if (error)
                            return "nestedType." + error;
                    }
                }
                if (message.enumType !== undefined) {
                    if (!Array.isArray(message.enumType))
                        return "enumType: array expected";
                    for (var i = 0; i < message.enumType.length; ++i) {
                        var error = $types[4].verify(message.enumType[i]);
                        if (error)
                            return "enumType." + error;
                    }
                }
                if (message.extensionRange !== undefined) {
                    if (!Array.isArray(message.extensionRange))
                        return "extensionRange: array expected";
                    for (var i = 0; i < message.extensionRange.length; ++i) {
                        var error = $types[5].verify(message.extensionRange[i]);
                        if (error)
                            return "extensionRange." + error;
                    }
                }
                if (message.oneofDecl !== undefined) {
                    if (!Array.isArray(message.oneofDecl))
                        return "oneofDecl: array expected";
                    for (var i = 0; i < message.oneofDecl.length; ++i) {
                        var error = $types[6].verify(message.oneofDecl[i]);
                        if (error)
                            return "oneofDecl." + error;
                    }
                }
                if (message.options !== undefined && message.options !== null) {
                    var error = $types[7].verify(message.options);
                    if (error)
                        return "options." + error;
                }
                if (message.reservedRange !== undefined) {
                    if (!Array.isArray(message.reservedRange))
                        return "reservedRange: array expected";
                    for (var i = 0; i < message.reservedRange.length; ++i) {
                        var error = $types[8].verify(message.reservedRange[i]);
                        if (error)
                            return "reservedRange." + error;
                    }
                }
                if (message.reservedName !== undefined) {
                    if (!Array.isArray(message.reservedName))
                        return "reservedName: array expected";
                    for (var i = 0; i < message.reservedName.length; ++i)
                        if (!$util.isString(message.reservedName[i]))
                            return "reservedName: string[] expected";
                }
                return null;
            };

            /**
             * Creates a DescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.DescriptorProto} DescriptorProto
             */
            DescriptorProto.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.DescriptorProto)
                    return object;
                var message = new $root.google.protobuf.DescriptorProto();
                if (object.name !== undefined && object.name !== null)
                    message.name = String(object.name);
                if (object.field) {
                    if (!Array.isArray(object.field))
                        throw TypeError(".google.protobuf.DescriptorProto.field: array expected");
                    message.field = [];
                    for (var i = 0; i < object.field.length; ++i) {
                        if (typeof object.field[i] !== "object")
                            throw TypeError(".google.protobuf.DescriptorProto.field: object expected");
                        message.field[i] = $types[1].fromObject(object.field[i]);
                    }
                }
                if (object.extension) {
                    if (!Array.isArray(object.extension))
                        throw TypeError(".google.protobuf.DescriptorProto.extension: array expected");
                    message.extension = [];
                    for (var i = 0; i < object.extension.length; ++i) {
                        if (typeof object.extension[i] !== "object")
                            throw TypeError(".google.protobuf.DescriptorProto.extension: object expected");
                        message.extension[i] = $types[2].fromObject(object.extension[i]);
                    }
                }
                if (object.nestedType) {
                    if (!Array.isArray(object.nestedType))
                        throw TypeError(".google.protobuf.DescriptorProto.nestedType: array expected");
                    message.nestedType = [];
                    for (var i = 0; i < object.nestedType.length; ++i) {
                        if (typeof object.nestedType[i] !== "object")
                            throw TypeError(".google.protobuf.DescriptorProto.nestedType: object expected");
                        message.nestedType[i] = $types[3].fromObject(object.nestedType[i]);
                    }
                }
                if (object.enumType) {
                    if (!Array.isArray(object.enumType))
                        throw TypeError(".google.protobuf.DescriptorProto.enumType: array expected");
                    message.enumType = [];
                    for (var i = 0; i < object.enumType.length; ++i) {
                        if (typeof object.enumType[i] !== "object")
                            throw TypeError(".google.protobuf.DescriptorProto.enumType: object expected");
                        message.enumType[i] = $types[4].fromObject(object.enumType[i]);
                    }
                }
                if (object.extensionRange) {
                    if (!Array.isArray(object.extensionRange))
                        throw TypeError(".google.protobuf.DescriptorProto.extensionRange: array expected");
                    message.extensionRange = [];
                    for (var i = 0; i < object.extensionRange.length; ++i) {
                        if (typeof object.extensionRange[i] !== "object")
                            throw TypeError(".google.protobuf.DescriptorProto.extensionRange: object expected");
                        message.extensionRange[i] = $types[5].fromObject(object.extensionRange[i]);
                    }
                }
                if (object.oneofDecl) {
                    if (!Array.isArray(object.oneofDecl))
                        throw TypeError(".google.protobuf.DescriptorProto.oneofDecl: array expected");
                    message.oneofDecl = [];
                    for (var i = 0; i < object.oneofDecl.length; ++i) {
                        if (typeof object.oneofDecl[i] !== "object")
                            throw TypeError(".google.protobuf.DescriptorProto.oneofDecl: object expected");
                        message.oneofDecl[i] = $types[6].fromObject(object.oneofDecl[i]);
                    }
                }
                if (object.options !== undefined && object.options !== null) {
                    if (typeof object.options !== "object")
                        throw TypeError(".google.protobuf.DescriptorProto.options: object expected");
                    message.options = $types[7].fromObject(object.options);
                }
                if (object.reservedRange) {
                    if (!Array.isArray(object.reservedRange))
                        throw TypeError(".google.protobuf.DescriptorProto.reservedRange: array expected");
                    message.reservedRange = [];
                    for (var i = 0; i < object.reservedRange.length; ++i) {
                        if (typeof object.reservedRange[i] !== "object")
                            throw TypeError(".google.protobuf.DescriptorProto.reservedRange: object expected");
                        message.reservedRange[i] = $types[8].fromObject(object.reservedRange[i]);
                    }
                }
                if (object.reservedName) {
                    if (!Array.isArray(object.reservedName))
                        throw TypeError(".google.protobuf.DescriptorProto.reservedName: array expected");
                    message.reservedName = [];
                    for (var i = 0; i < object.reservedName.length; ++i)
                        message.reservedName[i] = String(object.reservedName[i]);
                }
                return message;
            };

            /**
             * Creates a DescriptorProto message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.DescriptorProto.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.DescriptorProto} DescriptorProto
             */
            DescriptorProto.from = DescriptorProto.fromObject;

            /**
             * Creates a plain object from a DescriptorProto message. Also converts values to other types if specified.
             * @param {google.protobuf.DescriptorProto} message DescriptorProto
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DescriptorProto.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.field = [];
                    object.extension = [];
                    object.nestedType = [];
                    object.enumType = [];
                    object.extensionRange = [];
                    object.oneofDecl = [];
                    object.reservedRange = [];
                    object.reservedName = [];
                }
                if (options.defaults) {
                    object.name = "";
                    object.options = null;
                }
                if (message.name !== undefined && message.name !== null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.field !== undefined && message.field !== null && message.hasOwnProperty("field")) {
                    object.field = [];
                    for (var j = 0; j < message.field.length; ++j)
                        object.field[j] = $types[1].toObject(message.field[j], options);
                }
                if (message.extension !== undefined && message.extension !== null && message.hasOwnProperty("extension")) {
                    object.extension = [];
                    for (var j = 0; j < message.extension.length; ++j)
                        object.extension[j] = $types[2].toObject(message.extension[j], options);
                }
                if (message.nestedType !== undefined && message.nestedType !== null && message.hasOwnProperty("nestedType")) {
                    object.nestedType = [];
                    for (var j = 0; j < message.nestedType.length; ++j)
                        object.nestedType[j] = $types[3].toObject(message.nestedType[j], options);
                }
                if (message.enumType !== undefined && message.enumType !== null && message.hasOwnProperty("enumType")) {
                    object.enumType = [];
                    for (var j = 0; j < message.enumType.length; ++j)
                        object.enumType[j] = $types[4].toObject(message.enumType[j], options);
                }
                if (message.extensionRange !== undefined && message.extensionRange !== null && message.hasOwnProperty("extensionRange")) {
                    object.extensionRange = [];
                    for (var j = 0; j < message.extensionRange.length; ++j)
                        object.extensionRange[j] = $types[5].toObject(message.extensionRange[j], options);
                }
                if (message.oneofDecl !== undefined && message.oneofDecl !== null && message.hasOwnProperty("oneofDecl")) {
                    object.oneofDecl = [];
                    for (var j = 0; j < message.oneofDecl.length; ++j)
                        object.oneofDecl[j] = $types[6].toObject(message.oneofDecl[j], options);
                }
                if (message.options !== undefined && message.options !== null && message.hasOwnProperty("options"))
                    object.options = $types[7].toObject(message.options, options);
                if (message.reservedRange !== undefined && message.reservedRange !== null && message.hasOwnProperty("reservedRange")) {
                    object.reservedRange = [];
                    for (var j = 0; j < message.reservedRange.length; ++j)
                        object.reservedRange[j] = $types[8].toObject(message.reservedRange[j], options);
                }
                if (message.reservedName !== undefined && message.reservedName !== null && message.hasOwnProperty("reservedName")) {
                    object.reservedName = [];
                    for (var j = 0; j < message.reservedName.length; ++j)
                        object.reservedName[j] = message.reservedName[j];
                }
                return object;
            };

            /**
             * Creates a plain object from this DescriptorProto message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DescriptorProto.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this DescriptorProto to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            DescriptorProto.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            DescriptorProto.ExtensionRange = (function() {

                /**
                 * Constructs a new ExtensionRange.
                 * @exports google.protobuf.DescriptorProto.ExtensionRange
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function ExtensionRange(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ExtensionRange start.
                 * @type {number}
                 */
                ExtensionRange.prototype.start = 0;

                /**
                 * ExtensionRange end.
                 * @type {number}
                 */
                ExtensionRange.prototype.end = 0;

                /**
                 * Creates a new ExtensionRange instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {google.protobuf.DescriptorProto.ExtensionRange} ExtensionRange instance
                 */
                ExtensionRange.create = function create(properties) {
                    return new ExtensionRange(properties);
                };

                /**
                 * Encodes the specified ExtensionRange message.
                 * @param {google.protobuf.DescriptorProto.ExtensionRange|Object} message ExtensionRange message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ExtensionRange.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.start !== undefined && message.hasOwnProperty("start"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.start);
                    if (message.end !== undefined && message.hasOwnProperty("end"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.end);
                    return writer;
                };

                /**
                 * Encodes the specified ExtensionRange message, length delimited.
                 * @param {google.protobuf.DescriptorProto.ExtensionRange|Object} message ExtensionRange message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ExtensionRange.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an ExtensionRange message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.DescriptorProto.ExtensionRange} ExtensionRange
                 */
                ExtensionRange.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.DescriptorProto.ExtensionRange();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.start = reader.int32();
                            break;
                        case 2:
                            message.end = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an ExtensionRange message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.DescriptorProto.ExtensionRange} ExtensionRange
                 */
                ExtensionRange.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an ExtensionRange message.
                 * @param {google.protobuf.DescriptorProto.ExtensionRange|Object} message ExtensionRange message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                ExtensionRange.verify = function verify(message) {
                    if (message.start !== undefined)
                        if (!$util.isInteger(message.start))
                            return "start: integer expected";
                    if (message.end !== undefined)
                        if (!$util.isInteger(message.end))
                            return "end: integer expected";
                    return null;
                };

                /**
                 * Creates an ExtensionRange message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.DescriptorProto.ExtensionRange} ExtensionRange
                 */
                ExtensionRange.fromObject = function fromObject(object) {
                    if (object instanceof $root.google.protobuf.DescriptorProto.ExtensionRange)
                        return object;
                    var message = new $root.google.protobuf.DescriptorProto.ExtensionRange();
                    if (object.start !== undefined && object.start !== null)
                        message.start = object.start | 0;
                    if (object.end !== undefined && object.end !== null)
                        message.end = object.end | 0;
                    return message;
                };

                /**
                 * Creates an ExtensionRange message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link google.protobuf.DescriptorProto.ExtensionRange.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.DescriptorProto.ExtensionRange} ExtensionRange
                 */
                ExtensionRange.from = ExtensionRange.fromObject;

                /**
                 * Creates a plain object from an ExtensionRange message. Also converts values to other types if specified.
                 * @param {google.protobuf.DescriptorProto.ExtensionRange} message ExtensionRange
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ExtensionRange.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.start = 0;
                        object.end = 0;
                    }
                    if (message.start !== undefined && message.start !== null && message.hasOwnProperty("start"))
                        object.start = message.start;
                    if (message.end !== undefined && message.end !== null && message.hasOwnProperty("end"))
                        object.end = message.end;
                    return object;
                };

                /**
                 * Creates a plain object from this ExtensionRange message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ExtensionRange.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this ExtensionRange to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                ExtensionRange.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ExtensionRange;
            })();

            DescriptorProto.ReservedRange = (function() {

                /**
                 * Constructs a new ReservedRange.
                 * @classdesc not overlap.
                 * @exports google.protobuf.DescriptorProto.ReservedRange
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function ReservedRange(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Inclusive.
                 * @type {number}
                 */
                ReservedRange.prototype.start = 0;

                /**
                 * Exclusive.
                 * @type {number}
                 */
                ReservedRange.prototype.end = 0;

                /**
                 * Creates a new ReservedRange instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {google.protobuf.DescriptorProto.ReservedRange} ReservedRange instance
                 */
                ReservedRange.create = function create(properties) {
                    return new ReservedRange(properties);
                };

                /**
                 * Encodes the specified ReservedRange message.
                 * @param {google.protobuf.DescriptorProto.ReservedRange|Object} message ReservedRange message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ReservedRange.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.start !== undefined && message.hasOwnProperty("start"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.start);
                    if (message.end !== undefined && message.hasOwnProperty("end"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.end);
                    return writer;
                };

                /**
                 * Encodes the specified ReservedRange message, length delimited.
                 * @param {google.protobuf.DescriptorProto.ReservedRange|Object} message ReservedRange message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ReservedRange.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a ReservedRange message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.DescriptorProto.ReservedRange} ReservedRange
                 */
                ReservedRange.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.DescriptorProto.ReservedRange();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.start = reader.int32();
                            break;
                        case 2:
                            message.end = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a ReservedRange message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.DescriptorProto.ReservedRange} ReservedRange
                 */
                ReservedRange.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ReservedRange message.
                 * @param {google.protobuf.DescriptorProto.ReservedRange|Object} message ReservedRange message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                ReservedRange.verify = function verify(message) {
                    if (message.start !== undefined)
                        if (!$util.isInteger(message.start))
                            return "start: integer expected";
                    if (message.end !== undefined)
                        if (!$util.isInteger(message.end))
                            return "end: integer expected";
                    return null;
                };

                /**
                 * Creates a ReservedRange message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.DescriptorProto.ReservedRange} ReservedRange
                 */
                ReservedRange.fromObject = function fromObject(object) {
                    if (object instanceof $root.google.protobuf.DescriptorProto.ReservedRange)
                        return object;
                    var message = new $root.google.protobuf.DescriptorProto.ReservedRange();
                    if (object.start !== undefined && object.start !== null)
                        message.start = object.start | 0;
                    if (object.end !== undefined && object.end !== null)
                        message.end = object.end | 0;
                    return message;
                };

                /**
                 * Creates a ReservedRange message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link google.protobuf.DescriptorProto.ReservedRange.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.DescriptorProto.ReservedRange} ReservedRange
                 */
                ReservedRange.from = ReservedRange.fromObject;

                /**
                 * Creates a plain object from a ReservedRange message. Also converts values to other types if specified.
                 * @param {google.protobuf.DescriptorProto.ReservedRange} message ReservedRange
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ReservedRange.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.start = 0;
                        object.end = 0;
                    }
                    if (message.start !== undefined && message.start !== null && message.hasOwnProperty("start"))
                        object.start = message.start;
                    if (message.end !== undefined && message.end !== null && message.hasOwnProperty("end"))
                        object.end = message.end;
                    return object;
                };

                /**
                 * Creates a plain object from this ReservedRange message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ReservedRange.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this ReservedRange to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                ReservedRange.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ReservedRange;
            })();

            return DescriptorProto;
        })();

        protobuf.FieldDescriptorProto = (function() {

            /**
             * Constructs a new FieldDescriptorProto.
             * @classdesc Describes a field within a message.
             * @exports google.protobuf.FieldDescriptorProto
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function FieldDescriptorProto(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * FieldDescriptorProto name.
             * @type {string}
             */
            FieldDescriptorProto.prototype.name = "";

            /**
             * FieldDescriptorProto number.
             * @type {number}
             */
            FieldDescriptorProto.prototype.number = 0;

            /**
             * FieldDescriptorProto label.
             * @type {number}
             */
            FieldDescriptorProto.prototype.label = 1;

            /**
             * are set, this must be one of TYPE_ENUM, TYPE_MESSAGE or TYPE_GROUP.
             * @type {number}
             */
            FieldDescriptorProto.prototype.type = 1;

            /**
             * namespace).
             * @type {string}
             */
            FieldDescriptorProto.prototype.typeName = "";

            /**
             * resolved in the same manner as type_name.
             * @type {string}
             */
            FieldDescriptorProto.prototype.extendee = "";

            /**
             * TODO(kenton):  Base-64 encode?
             * @type {string}
             */
            FieldDescriptorProto.prototype.defaultValue = "";

            /**
             * list.  This field is a member of that oneof.
             * @type {number}
             */
            FieldDescriptorProto.prototype.oneofIndex = 0;

            /**
             * it to camelCase.
             * @type {string}
             */
            FieldDescriptorProto.prototype.jsonName = "";

            /**
             * FieldDescriptorProto options.
             * @type {google.protobuf.FieldOptions}
             */
            FieldDescriptorProto.prototype.options = null;

            // Lazily resolved type references
            var $types = {
                2: "google.protobuf.FieldDescriptorProto.Label",
                3: "google.protobuf.FieldDescriptorProto.Type",
                9: "google.protobuf.FieldOptions"
            }; $lazyTypes.push($types);

            /**
             * Creates a new FieldDescriptorProto instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.FieldDescriptorProto} FieldDescriptorProto instance
             */
            FieldDescriptorProto.create = function create(properties) {
                return new FieldDescriptorProto(properties);
            };

            /**
             * Encodes the specified FieldDescriptorProto message.
             * @param {google.protobuf.FieldDescriptorProto|Object} message FieldDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FieldDescriptorProto.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name !== undefined && message.hasOwnProperty("name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.number !== undefined && message.hasOwnProperty("number"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.number);
                if (message.label !== undefined && message.hasOwnProperty("label"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.label);
                if (message.type !== undefined && message.hasOwnProperty("type"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.type);
                if (message.typeName !== undefined && message.hasOwnProperty("typeName"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.typeName);
                if (message.extendee !== undefined && message.hasOwnProperty("extendee"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.extendee);
                if (message.defaultValue !== undefined && message.hasOwnProperty("defaultValue"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.defaultValue);
                if (message.oneofIndex !== undefined && message.hasOwnProperty("oneofIndex"))
                    writer.uint32(/* id 9, wireType 0 =*/72).int32(message.oneofIndex);
                if (message.jsonName !== undefined && message.hasOwnProperty("jsonName"))
                    writer.uint32(/* id 10, wireType 2 =*/82).string(message.jsonName);
                if (message.options !== undefined && message.hasOwnProperty("options"))
                    $types[9].encode(message.options, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified FieldDescriptorProto message, length delimited.
             * @param {google.protobuf.FieldDescriptorProto|Object} message FieldDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FieldDescriptorProto.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FieldDescriptorProto message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.FieldDescriptorProto} FieldDescriptorProto
             */
            FieldDescriptorProto.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.FieldDescriptorProto();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.name = reader.string();
                        break;
                    case 3:
                        message.number = reader.int32();
                        break;
                    case 4:
                        message.label = reader.uint32();
                        break;
                    case 5:
                        message.type = reader.uint32();
                        break;
                    case 6:
                        message.typeName = reader.string();
                        break;
                    case 2:
                        message.extendee = reader.string();
                        break;
                    case 7:
                        message.defaultValue = reader.string();
                        break;
                    case 9:
                        message.oneofIndex = reader.int32();
                        break;
                    case 10:
                        message.jsonName = reader.string();
                        break;
                    case 8:
                        message.options = $types[9].decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a FieldDescriptorProto message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.FieldDescriptorProto} FieldDescriptorProto
             */
            FieldDescriptorProto.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FieldDescriptorProto message.
             * @param {google.protobuf.FieldDescriptorProto|Object} message FieldDescriptorProto message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            FieldDescriptorProto.verify = function verify(message) {
                if (message.name !== undefined)
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.number !== undefined)
                    if (!$util.isInteger(message.number))
                        return "number: integer expected";
                if (message.label !== undefined)
                    switch (message.label) {
                    default:
                        return "label: enum value expected";
                    case 1:
                    case 2:
                    case 3:
                        break;
                    }
                if (message.type !== undefined)
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                    case 12:
                    case 13:
                    case 14:
                    case 15:
                    case 16:
                    case 17:
                    case 18:
                        break;
                    }
                if (message.typeName !== undefined)
                    if (!$util.isString(message.typeName))
                        return "typeName: string expected";
                if (message.extendee !== undefined)
                    if (!$util.isString(message.extendee))
                        return "extendee: string expected";
                if (message.defaultValue !== undefined)
                    if (!$util.isString(message.defaultValue))
                        return "defaultValue: string expected";
                if (message.oneofIndex !== undefined)
                    if (!$util.isInteger(message.oneofIndex))
                        return "oneofIndex: integer expected";
                if (message.jsonName !== undefined)
                    if (!$util.isString(message.jsonName))
                        return "jsonName: string expected";
                if (message.options !== undefined && message.options !== null) {
                    var error = $types[9].verify(message.options);
                    if (error)
                        return "options." + error;
                }
                return null;
            };

            /**
             * Creates a FieldDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FieldDescriptorProto} FieldDescriptorProto
             */
            FieldDescriptorProto.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.FieldDescriptorProto)
                    return object;
                var message = new $root.google.protobuf.FieldDescriptorProto();
                if (object.name !== undefined && object.name !== null)
                    message.name = String(object.name);
                if (object.number !== undefined && object.number !== null)
                    message.number = object.number | 0;
                switch (object.label) {
                case "LABEL_OPTIONAL":
                case 1:
                    message.label = 1;
                    break;
                case "LABEL_REQUIRED":
                case 2:
                    message.label = 2;
                    break;
                case "LABEL_REPEATED":
                case 3:
                    message.label = 3;
                    break;
                }
                switch (object.type) {
                case "TYPE_DOUBLE":
                case 1:
                    message.type = 1;
                    break;
                case "TYPE_FLOAT":
                case 2:
                    message.type = 2;
                    break;
                case "TYPE_INT64":
                case 3:
                    message.type = 3;
                    break;
                case "TYPE_UINT64":
                case 4:
                    message.type = 4;
                    break;
                case "TYPE_INT32":
                case 5:
                    message.type = 5;
                    break;
                case "TYPE_FIXED64":
                case 6:
                    message.type = 6;
                    break;
                case "TYPE_FIXED32":
                case 7:
                    message.type = 7;
                    break;
                case "TYPE_BOOL":
                case 8:
                    message.type = 8;
                    break;
                case "TYPE_STRING":
                case 9:
                    message.type = 9;
                    break;
                case "TYPE_GROUP":
                case 10:
                    message.type = 10;
                    break;
                case "TYPE_MESSAGE":
                case 11:
                    message.type = 11;
                    break;
                case "TYPE_BYTES":
                case 12:
                    message.type = 12;
                    break;
                case "TYPE_UINT32":
                case 13:
                    message.type = 13;
                    break;
                case "TYPE_ENUM":
                case 14:
                    message.type = 14;
                    break;
                case "TYPE_SFIXED32":
                case 15:
                    message.type = 15;
                    break;
                case "TYPE_SFIXED64":
                case 16:
                    message.type = 16;
                    break;
                case "TYPE_SINT32":
                case 17:
                    message.type = 17;
                    break;
                case "TYPE_SINT64":
                case 18:
                    message.type = 18;
                    break;
                }
                if (object.typeName !== undefined && object.typeName !== null)
                    message.typeName = String(object.typeName);
                if (object.extendee !== undefined && object.extendee !== null)
                    message.extendee = String(object.extendee);
                if (object.defaultValue !== undefined && object.defaultValue !== null)
                    message.defaultValue = String(object.defaultValue);
                if (object.oneofIndex !== undefined && object.oneofIndex !== null)
                    message.oneofIndex = object.oneofIndex | 0;
                if (object.jsonName !== undefined && object.jsonName !== null)
                    message.jsonName = String(object.jsonName);
                if (object.options !== undefined && object.options !== null) {
                    if (typeof object.options !== "object")
                        throw TypeError(".google.protobuf.FieldDescriptorProto.options: object expected");
                    message.options = $types[9].fromObject(object.options);
                }
                return message;
            };

            /**
             * Creates a FieldDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.FieldDescriptorProto.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FieldDescriptorProto} FieldDescriptorProto
             */
            FieldDescriptorProto.from = FieldDescriptorProto.fromObject;

            /**
             * Creates a plain object from a FieldDescriptorProto message. Also converts values to other types if specified.
             * @param {google.protobuf.FieldDescriptorProto} message FieldDescriptorProto
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FieldDescriptorProto.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.name = "";
                    object.number = 0;
                    object.label = options.enums === String ? "LABEL_OPTIONAL" : 1;
                    object.type = options.enums === String ? "TYPE_DOUBLE" : 1;
                    object.typeName = "";
                    object.extendee = "";
                    object.defaultValue = "";
                    object.oneofIndex = 0;
                    object.jsonName = "";
                    object.options = null;
                }
                if (message.name !== undefined && message.name !== null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.number !== undefined && message.number !== null && message.hasOwnProperty("number"))
                    object.number = message.number;
                if (message.label !== undefined && message.label !== null && message.hasOwnProperty("label"))
                    object.label = options.enums === String ? $types[2][message.label] : message.label;
                if (message.type !== undefined && message.type !== null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $types[3][message.type] : message.type;
                if (message.typeName !== undefined && message.typeName !== null && message.hasOwnProperty("typeName"))
                    object.typeName = message.typeName;
                if (message.extendee !== undefined && message.extendee !== null && message.hasOwnProperty("extendee"))
                    object.extendee = message.extendee;
                if (message.defaultValue !== undefined && message.defaultValue !== null && message.hasOwnProperty("defaultValue"))
                    object.defaultValue = message.defaultValue;
                if (message.oneofIndex !== undefined && message.oneofIndex !== null && message.hasOwnProperty("oneofIndex"))
                    object.oneofIndex = message.oneofIndex;
                if (message.jsonName !== undefined && message.jsonName !== null && message.hasOwnProperty("jsonName"))
                    object.jsonName = message.jsonName;
                if (message.options !== undefined && message.options !== null && message.hasOwnProperty("options"))
                    object.options = $types[9].toObject(message.options, options);
                return object;
            };

            /**
             * Creates a plain object from this FieldDescriptorProto message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FieldDescriptorProto.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this FieldDescriptorProto to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            FieldDescriptorProto.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Type enum.
             * @name Type
             * @memberof google.protobuf.FieldDescriptorProto
             * @enum {number}
             * @property {number} TYPE_DOUBLE=1 Order is weird for historical reasons.
             * @property {number} TYPE_FLOAT=2 TYPE_FLOAT value
             * @property {number} TYPE_INT64=3 negative values are likely.
             * @property {number} TYPE_UINT64=4 TYPE_UINT64 value
             * @property {number} TYPE_INT32=5 negative values are likely.
             * @property {number} TYPE_FIXED64=6 TYPE_FIXED64 value
             * @property {number} TYPE_FIXED32=7 TYPE_FIXED32 value
             * @property {number} TYPE_BOOL=8 TYPE_BOOL value
             * @property {number} TYPE_STRING=9 TYPE_STRING value
             * @property {number} TYPE_GROUP=10 Tag-delimited aggregate.
             * @property {number} TYPE_MESSAGE=11 TYPE_MESSAGE value
             * @property {number} TYPE_BYTES=12 New in version 2.
             * @property {number} TYPE_UINT32=13 TYPE_UINT32 value
             * @property {number} TYPE_ENUM=14 TYPE_ENUM value
             * @property {number} TYPE_SFIXED32=15 TYPE_SFIXED32 value
             * @property {number} TYPE_SFIXED64=16 TYPE_SFIXED64 value
             * @property {number} TYPE_SINT32=17 Uses ZigZag encoding.
             * @property {number} TYPE_SINT64=18 Uses ZigZag encoding.
             */
            FieldDescriptorProto.Type = (function() {
                var valuesById = {},
                    values = Object.create(valuesById);
                values[valuesById[1] = "TYPE_DOUBLE"] = 1;
                values[valuesById[2] = "TYPE_FLOAT"] = 2;
                values[valuesById[3] = "TYPE_INT64"] = 3;
                values[valuesById[4] = "TYPE_UINT64"] = 4;
                values[valuesById[5] = "TYPE_INT32"] = 5;
                values[valuesById[6] = "TYPE_FIXED64"] = 6;
                values[valuesById[7] = "TYPE_FIXED32"] = 7;
                values[valuesById[8] = "TYPE_BOOL"] = 8;
                values[valuesById[9] = "TYPE_STRING"] = 9;
                values[valuesById[10] = "TYPE_GROUP"] = 10;
                values[valuesById[11] = "TYPE_MESSAGE"] = 11;
                values[valuesById[12] = "TYPE_BYTES"] = 12;
                values[valuesById[13] = "TYPE_UINT32"] = 13;
                values[valuesById[14] = "TYPE_ENUM"] = 14;
                values[valuesById[15] = "TYPE_SFIXED32"] = 15;
                values[valuesById[16] = "TYPE_SFIXED64"] = 16;
                values[valuesById[17] = "TYPE_SINT32"] = 17;
                values[valuesById[18] = "TYPE_SINT64"] = 18;
                return values;
            })();

            /**
             * Label enum.
             * @name Label
             * @memberof google.protobuf.FieldDescriptorProto
             * @enum {number}
             * @property {number} LABEL_OPTIONAL=1 0 is reserved for errors
             * @property {number} LABEL_REQUIRED=2 LABEL_REQUIRED value
             * @property {number} LABEL_REPEATED=3 LABEL_REPEATED value
             */
            FieldDescriptorProto.Label = (function() {
                var valuesById = {},
                    values = Object.create(valuesById);
                values[valuesById[1] = "LABEL_OPTIONAL"] = 1;
                values[valuesById[2] = "LABEL_REQUIRED"] = 2;
                values[valuesById[3] = "LABEL_REPEATED"] = 3;
                return values;
            })();

            return FieldDescriptorProto;
        })();

        protobuf.OneofDescriptorProto = (function() {

            /**
             * Constructs a new OneofDescriptorProto.
             * @classdesc Describes a oneof.
             * @exports google.protobuf.OneofDescriptorProto
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function OneofDescriptorProto(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * OneofDescriptorProto name.
             * @type {string}
             */
            OneofDescriptorProto.prototype.name = "";

            /**
             * Creates a new OneofDescriptorProto instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.OneofDescriptorProto} OneofDescriptorProto instance
             */
            OneofDescriptorProto.create = function create(properties) {
                return new OneofDescriptorProto(properties);
            };

            /**
             * Encodes the specified OneofDescriptorProto message.
             * @param {google.protobuf.OneofDescriptorProto|Object} message OneofDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OneofDescriptorProto.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name !== undefined && message.hasOwnProperty("name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                return writer;
            };

            /**
             * Encodes the specified OneofDescriptorProto message, length delimited.
             * @param {google.protobuf.OneofDescriptorProto|Object} message OneofDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OneofDescriptorProto.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an OneofDescriptorProto message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.OneofDescriptorProto} OneofDescriptorProto
             */
            OneofDescriptorProto.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.OneofDescriptorProto();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.name = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an OneofDescriptorProto message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.OneofDescriptorProto} OneofDescriptorProto
             */
            OneofDescriptorProto.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an OneofDescriptorProto message.
             * @param {google.protobuf.OneofDescriptorProto|Object} message OneofDescriptorProto message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            OneofDescriptorProto.verify = function verify(message) {
                if (message.name !== undefined)
                    if (!$util.isString(message.name))
                        return "name: string expected";
                return null;
            };

            /**
             * Creates an OneofDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.OneofDescriptorProto} OneofDescriptorProto
             */
            OneofDescriptorProto.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.OneofDescriptorProto)
                    return object;
                var message = new $root.google.protobuf.OneofDescriptorProto();
                if (object.name !== undefined && object.name !== null)
                    message.name = String(object.name);
                return message;
            };

            /**
             * Creates an OneofDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.OneofDescriptorProto.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.OneofDescriptorProto} OneofDescriptorProto
             */
            OneofDescriptorProto.from = OneofDescriptorProto.fromObject;

            /**
             * Creates a plain object from an OneofDescriptorProto message. Also converts values to other types if specified.
             * @param {google.protobuf.OneofDescriptorProto} message OneofDescriptorProto
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            OneofDescriptorProto.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.name = "";
                if (message.name !== undefined && message.name !== null && message.hasOwnProperty("name"))
                    object.name = message.name;
                return object;
            };

            /**
             * Creates a plain object from this OneofDescriptorProto message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            OneofDescriptorProto.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this OneofDescriptorProto to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            OneofDescriptorProto.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return OneofDescriptorProto;
        })();

        protobuf.EnumDescriptorProto = (function() {

            /**
             * Constructs a new EnumDescriptorProto.
             * @classdesc Describes an enum type.
             * @exports google.protobuf.EnumDescriptorProto
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function EnumDescriptorProto(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * EnumDescriptorProto name.
             * @type {string}
             */
            EnumDescriptorProto.prototype.name = "";

            /**
             * EnumDescriptorProto value.
             * @type {Array.<google.protobuf.EnumValueDescriptorProto>}
             */
            EnumDescriptorProto.prototype.value = $util.emptyArray;

            /**
             * EnumDescriptorProto options.
             * @type {google.protobuf.EnumOptions}
             */
            EnumDescriptorProto.prototype.options = null;

            // Lazily resolved type references
            var $types = {
                1: "google.protobuf.EnumValueDescriptorProto",
                2: "google.protobuf.EnumOptions"
            }; $lazyTypes.push($types);

            /**
             * Creates a new EnumDescriptorProto instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.EnumDescriptorProto} EnumDescriptorProto instance
             */
            EnumDescriptorProto.create = function create(properties) {
                return new EnumDescriptorProto(properties);
            };

            /**
             * Encodes the specified EnumDescriptorProto message.
             * @param {google.protobuf.EnumDescriptorProto|Object} message EnumDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EnumDescriptorProto.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name !== undefined && message.hasOwnProperty("name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.value !== undefined && message.hasOwnProperty("value"))
                    for (var i = 0; i < message.value.length; ++i)
                        $types[1].encode(message.value[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.options !== undefined && message.hasOwnProperty("options"))
                    $types[2].encode(message.options, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified EnumDescriptorProto message, length delimited.
             * @param {google.protobuf.EnumDescriptorProto|Object} message EnumDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EnumDescriptorProto.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EnumDescriptorProto message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.EnumDescriptorProto} EnumDescriptorProto
             */
            EnumDescriptorProto.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.EnumDescriptorProto();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.name = reader.string();
                        break;
                    case 2:
                        if (!(message.value && message.value.length))
                            message.value = [];
                        message.value.push($types[1].decode(reader, reader.uint32()));
                        break;
                    case 3:
                        message.options = $types[2].decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an EnumDescriptorProto message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.EnumDescriptorProto} EnumDescriptorProto
             */
            EnumDescriptorProto.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EnumDescriptorProto message.
             * @param {google.protobuf.EnumDescriptorProto|Object} message EnumDescriptorProto message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            EnumDescriptorProto.verify = function verify(message) {
                if (message.name !== undefined)
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.value !== undefined) {
                    if (!Array.isArray(message.value))
                        return "value: array expected";
                    for (var i = 0; i < message.value.length; ++i) {
                        var error = $types[1].verify(message.value[i]);
                        if (error)
                            return "value." + error;
                    }
                }
                if (message.options !== undefined && message.options !== null) {
                    var error = $types[2].verify(message.options);
                    if (error)
                        return "options." + error;
                }
                return null;
            };

            /**
             * Creates an EnumDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.EnumDescriptorProto} EnumDescriptorProto
             */
            EnumDescriptorProto.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.EnumDescriptorProto)
                    return object;
                var message = new $root.google.protobuf.EnumDescriptorProto();
                if (object.name !== undefined && object.name !== null)
                    message.name = String(object.name);
                if (object.value) {
                    if (!Array.isArray(object.value))
                        throw TypeError(".google.protobuf.EnumDescriptorProto.value: array expected");
                    message.value = [];
                    for (var i = 0; i < object.value.length; ++i) {
                        if (typeof object.value[i] !== "object")
                            throw TypeError(".google.protobuf.EnumDescriptorProto.value: object expected");
                        message.value[i] = $types[1].fromObject(object.value[i]);
                    }
                }
                if (object.options !== undefined && object.options !== null) {
                    if (typeof object.options !== "object")
                        throw TypeError(".google.protobuf.EnumDescriptorProto.options: object expected");
                    message.options = $types[2].fromObject(object.options);
                }
                return message;
            };

            /**
             * Creates an EnumDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.EnumDescriptorProto.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.EnumDescriptorProto} EnumDescriptorProto
             */
            EnumDescriptorProto.from = EnumDescriptorProto.fromObject;

            /**
             * Creates a plain object from an EnumDescriptorProto message. Also converts values to other types if specified.
             * @param {google.protobuf.EnumDescriptorProto} message EnumDescriptorProto
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EnumDescriptorProto.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.value = [];
                if (options.defaults) {
                    object.name = "";
                    object.options = null;
                }
                if (message.name !== undefined && message.name !== null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.value !== undefined && message.value !== null && message.hasOwnProperty("value")) {
                    object.value = [];
                    for (var j = 0; j < message.value.length; ++j)
                        object.value[j] = $types[1].toObject(message.value[j], options);
                }
                if (message.options !== undefined && message.options !== null && message.hasOwnProperty("options"))
                    object.options = $types[2].toObject(message.options, options);
                return object;
            };

            /**
             * Creates a plain object from this EnumDescriptorProto message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EnumDescriptorProto.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this EnumDescriptorProto to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            EnumDescriptorProto.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return EnumDescriptorProto;
        })();

        protobuf.EnumValueDescriptorProto = (function() {

            /**
             * Constructs a new EnumValueDescriptorProto.
             * @classdesc Describes a value within an enum.
             * @exports google.protobuf.EnumValueDescriptorProto
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function EnumValueDescriptorProto(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * EnumValueDescriptorProto name.
             * @type {string}
             */
            EnumValueDescriptorProto.prototype.name = "";

            /**
             * EnumValueDescriptorProto number.
             * @type {number}
             */
            EnumValueDescriptorProto.prototype.number = 0;

            /**
             * EnumValueDescriptorProto options.
             * @type {google.protobuf.EnumValueOptions}
             */
            EnumValueDescriptorProto.prototype.options = null;

            // Lazily resolved type references
            var $types = {
                2: "google.protobuf.EnumValueOptions"
            }; $lazyTypes.push($types);

            /**
             * Creates a new EnumValueDescriptorProto instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.EnumValueDescriptorProto} EnumValueDescriptorProto instance
             */
            EnumValueDescriptorProto.create = function create(properties) {
                return new EnumValueDescriptorProto(properties);
            };

            /**
             * Encodes the specified EnumValueDescriptorProto message.
             * @param {google.protobuf.EnumValueDescriptorProto|Object} message EnumValueDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EnumValueDescriptorProto.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name !== undefined && message.hasOwnProperty("name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.number !== undefined && message.hasOwnProperty("number"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.number);
                if (message.options !== undefined && message.hasOwnProperty("options"))
                    $types[2].encode(message.options, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified EnumValueDescriptorProto message, length delimited.
             * @param {google.protobuf.EnumValueDescriptorProto|Object} message EnumValueDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EnumValueDescriptorProto.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EnumValueDescriptorProto message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.EnumValueDescriptorProto} EnumValueDescriptorProto
             */
            EnumValueDescriptorProto.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.EnumValueDescriptorProto();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.name = reader.string();
                        break;
                    case 2:
                        message.number = reader.int32();
                        break;
                    case 3:
                        message.options = $types[2].decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an EnumValueDescriptorProto message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.EnumValueDescriptorProto} EnumValueDescriptorProto
             */
            EnumValueDescriptorProto.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EnumValueDescriptorProto message.
             * @param {google.protobuf.EnumValueDescriptorProto|Object} message EnumValueDescriptorProto message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            EnumValueDescriptorProto.verify = function verify(message) {
                if (message.name !== undefined)
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.number !== undefined)
                    if (!$util.isInteger(message.number))
                        return "number: integer expected";
                if (message.options !== undefined && message.options !== null) {
                    var error = $types[2].verify(message.options);
                    if (error)
                        return "options." + error;
                }
                return null;
            };

            /**
             * Creates an EnumValueDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.EnumValueDescriptorProto} EnumValueDescriptorProto
             */
            EnumValueDescriptorProto.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.EnumValueDescriptorProto)
                    return object;
                var message = new $root.google.protobuf.EnumValueDescriptorProto();
                if (object.name !== undefined && object.name !== null)
                    message.name = String(object.name);
                if (object.number !== undefined && object.number !== null)
                    message.number = object.number | 0;
                if (object.options !== undefined && object.options !== null) {
                    if (typeof object.options !== "object")
                        throw TypeError(".google.protobuf.EnumValueDescriptorProto.options: object expected");
                    message.options = $types[2].fromObject(object.options);
                }
                return message;
            };

            /**
             * Creates an EnumValueDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.EnumValueDescriptorProto.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.EnumValueDescriptorProto} EnumValueDescriptorProto
             */
            EnumValueDescriptorProto.from = EnumValueDescriptorProto.fromObject;

            /**
             * Creates a plain object from an EnumValueDescriptorProto message. Also converts values to other types if specified.
             * @param {google.protobuf.EnumValueDescriptorProto} message EnumValueDescriptorProto
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EnumValueDescriptorProto.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.name = "";
                    object.number = 0;
                    object.options = null;
                }
                if (message.name !== undefined && message.name !== null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.number !== undefined && message.number !== null && message.hasOwnProperty("number"))
                    object.number = message.number;
                if (message.options !== undefined && message.options !== null && message.hasOwnProperty("options"))
                    object.options = $types[2].toObject(message.options, options);
                return object;
            };

            /**
             * Creates a plain object from this EnumValueDescriptorProto message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EnumValueDescriptorProto.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this EnumValueDescriptorProto to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            EnumValueDescriptorProto.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return EnumValueDescriptorProto;
        })();

        protobuf.ServiceDescriptorProto = (function() {

            /**
             * Constructs a new ServiceDescriptorProto.
             * @classdesc Describes a service.
             * @exports google.protobuf.ServiceDescriptorProto
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function ServiceDescriptorProto(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * ServiceDescriptorProto name.
             * @type {string}
             */
            ServiceDescriptorProto.prototype.name = "";

            /**
             * ServiceDescriptorProto method.
             * @type {Array.<google.protobuf.MethodDescriptorProto>}
             */
            ServiceDescriptorProto.prototype.method = $util.emptyArray;

            /**
             * ServiceDescriptorProto options.
             * @type {google.protobuf.ServiceOptions}
             */
            ServiceDescriptorProto.prototype.options = null;

            // Lazily resolved type references
            var $types = {
                1: "google.protobuf.MethodDescriptorProto",
                2: "google.protobuf.ServiceOptions"
            }; $lazyTypes.push($types);

            /**
             * Creates a new ServiceDescriptorProto instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.ServiceDescriptorProto} ServiceDescriptorProto instance
             */
            ServiceDescriptorProto.create = function create(properties) {
                return new ServiceDescriptorProto(properties);
            };

            /**
             * Encodes the specified ServiceDescriptorProto message.
             * @param {google.protobuf.ServiceDescriptorProto|Object} message ServiceDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ServiceDescriptorProto.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name !== undefined && message.hasOwnProperty("name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.method !== undefined && message.hasOwnProperty("method"))
                    for (var i = 0; i < message.method.length; ++i)
                        $types[1].encode(message.method[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.options !== undefined && message.hasOwnProperty("options"))
                    $types[2].encode(message.options, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ServiceDescriptorProto message, length delimited.
             * @param {google.protobuf.ServiceDescriptorProto|Object} message ServiceDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ServiceDescriptorProto.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ServiceDescriptorProto message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.ServiceDescriptorProto} ServiceDescriptorProto
             */
            ServiceDescriptorProto.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.ServiceDescriptorProto();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.name = reader.string();
                        break;
                    case 2:
                        if (!(message.method && message.method.length))
                            message.method = [];
                        message.method.push($types[1].decode(reader, reader.uint32()));
                        break;
                    case 3:
                        message.options = $types[2].decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a ServiceDescriptorProto message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.ServiceDescriptorProto} ServiceDescriptorProto
             */
            ServiceDescriptorProto.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ServiceDescriptorProto message.
             * @param {google.protobuf.ServiceDescriptorProto|Object} message ServiceDescriptorProto message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            ServiceDescriptorProto.verify = function verify(message) {
                if (message.name !== undefined)
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.method !== undefined) {
                    if (!Array.isArray(message.method))
                        return "method: array expected";
                    for (var i = 0; i < message.method.length; ++i) {
                        var error = $types[1].verify(message.method[i]);
                        if (error)
                            return "method." + error;
                    }
                }
                if (message.options !== undefined && message.options !== null) {
                    var error = $types[2].verify(message.options);
                    if (error)
                        return "options." + error;
                }
                return null;
            };

            /**
             * Creates a ServiceDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.ServiceDescriptorProto} ServiceDescriptorProto
             */
            ServiceDescriptorProto.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.ServiceDescriptorProto)
                    return object;
                var message = new $root.google.protobuf.ServiceDescriptorProto();
                if (object.name !== undefined && object.name !== null)
                    message.name = String(object.name);
                if (object.method) {
                    if (!Array.isArray(object.method))
                        throw TypeError(".google.protobuf.ServiceDescriptorProto.method: array expected");
                    message.method = [];
                    for (var i = 0; i < object.method.length; ++i) {
                        if (typeof object.method[i] !== "object")
                            throw TypeError(".google.protobuf.ServiceDescriptorProto.method: object expected");
                        message.method[i] = $types[1].fromObject(object.method[i]);
                    }
                }
                if (object.options !== undefined && object.options !== null) {
                    if (typeof object.options !== "object")
                        throw TypeError(".google.protobuf.ServiceDescriptorProto.options: object expected");
                    message.options = $types[2].fromObject(object.options);
                }
                return message;
            };

            /**
             * Creates a ServiceDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.ServiceDescriptorProto.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.ServiceDescriptorProto} ServiceDescriptorProto
             */
            ServiceDescriptorProto.from = ServiceDescriptorProto.fromObject;

            /**
             * Creates a plain object from a ServiceDescriptorProto message. Also converts values to other types if specified.
             * @param {google.protobuf.ServiceDescriptorProto} message ServiceDescriptorProto
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ServiceDescriptorProto.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.method = [];
                if (options.defaults) {
                    object.name = "";
                    object.options = null;
                }
                if (message.name !== undefined && message.name !== null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.method !== undefined && message.method !== null && message.hasOwnProperty("method")) {
                    object.method = [];
                    for (var j = 0; j < message.method.length; ++j)
                        object.method[j] = $types[1].toObject(message.method[j], options);
                }
                if (message.options !== undefined && message.options !== null && message.hasOwnProperty("options"))
                    object.options = $types[2].toObject(message.options, options);
                return object;
            };

            /**
             * Creates a plain object from this ServiceDescriptorProto message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ServiceDescriptorProto.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this ServiceDescriptorProto to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            ServiceDescriptorProto.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ServiceDescriptorProto;
        })();

        protobuf.MethodDescriptorProto = (function() {

            /**
             * Constructs a new MethodDescriptorProto.
             * @classdesc Describes a method of a service.
             * @exports google.protobuf.MethodDescriptorProto
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function MethodDescriptorProto(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * MethodDescriptorProto name.
             * @type {string}
             */
            MethodDescriptorProto.prototype.name = "";

            /**
             * FieldDescriptorProto.type_name, but must refer to a message type.
             * @type {string}
             */
            MethodDescriptorProto.prototype.inputType = "";

            /**
             * MethodDescriptorProto outputType.
             * @type {string}
             */
            MethodDescriptorProto.prototype.outputType = "";

            /**
             * MethodDescriptorProto options.
             * @type {google.protobuf.MethodOptions}
             */
            MethodDescriptorProto.prototype.options = null;

            /**
             * Identifies if client streams multiple client messages
             * @type {boolean}
             */
            MethodDescriptorProto.prototype.clientStreaming = false;

            /**
             * Identifies if server streams multiple server messages
             * @type {boolean}
             */
            MethodDescriptorProto.prototype.serverStreaming = false;

            // Lazily resolved type references
            var $types = {
                3: "google.protobuf.MethodOptions"
            }; $lazyTypes.push($types);

            /**
             * Creates a new MethodDescriptorProto instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.MethodDescriptorProto} MethodDescriptorProto instance
             */
            MethodDescriptorProto.create = function create(properties) {
                return new MethodDescriptorProto(properties);
            };

            /**
             * Encodes the specified MethodDescriptorProto message.
             * @param {google.protobuf.MethodDescriptorProto|Object} message MethodDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MethodDescriptorProto.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name !== undefined && message.hasOwnProperty("name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.inputType !== undefined && message.hasOwnProperty("inputType"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.inputType);
                if (message.outputType !== undefined && message.hasOwnProperty("outputType"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.outputType);
                if (message.options !== undefined && message.hasOwnProperty("options"))
                    $types[3].encode(message.options, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.clientStreaming !== undefined && message.hasOwnProperty("clientStreaming"))
                    writer.uint32(/* id 5, wireType 0 =*/40).bool(message.clientStreaming);
                if (message.serverStreaming !== undefined && message.hasOwnProperty("serverStreaming"))
                    writer.uint32(/* id 6, wireType 0 =*/48).bool(message.serverStreaming);
                return writer;
            };

            /**
             * Encodes the specified MethodDescriptorProto message, length delimited.
             * @param {google.protobuf.MethodDescriptorProto|Object} message MethodDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MethodDescriptorProto.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MethodDescriptorProto message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.MethodDescriptorProto} MethodDescriptorProto
             */
            MethodDescriptorProto.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.MethodDescriptorProto();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.name = reader.string();
                        break;
                    case 2:
                        message.inputType = reader.string();
                        break;
                    case 3:
                        message.outputType = reader.string();
                        break;
                    case 4:
                        message.options = $types[3].decode(reader, reader.uint32());
                        break;
                    case 5:
                        message.clientStreaming = reader.bool();
                        break;
                    case 6:
                        message.serverStreaming = reader.bool();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a MethodDescriptorProto message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.MethodDescriptorProto} MethodDescriptorProto
             */
            MethodDescriptorProto.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MethodDescriptorProto message.
             * @param {google.protobuf.MethodDescriptorProto|Object} message MethodDescriptorProto message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            MethodDescriptorProto.verify = function verify(message) {
                if (message.name !== undefined)
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.inputType !== undefined)
                    if (!$util.isString(message.inputType))
                        return "inputType: string expected";
                if (message.outputType !== undefined)
                    if (!$util.isString(message.outputType))
                        return "outputType: string expected";
                if (message.options !== undefined && message.options !== null) {
                    var error = $types[3].verify(message.options);
                    if (error)
                        return "options." + error;
                }
                if (message.clientStreaming !== undefined)
                    if (typeof message.clientStreaming !== "boolean")
                        return "clientStreaming: boolean expected";
                if (message.serverStreaming !== undefined)
                    if (typeof message.serverStreaming !== "boolean")
                        return "serverStreaming: boolean expected";
                return null;
            };

            /**
             * Creates a MethodDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.MethodDescriptorProto} MethodDescriptorProto
             */
            MethodDescriptorProto.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.MethodDescriptorProto)
                    return object;
                var message = new $root.google.protobuf.MethodDescriptorProto();
                if (object.name !== undefined && object.name !== null)
                    message.name = String(object.name);
                if (object.inputType !== undefined && object.inputType !== null)
                    message.inputType = String(object.inputType);
                if (object.outputType !== undefined && object.outputType !== null)
                    message.outputType = String(object.outputType);
                if (object.options !== undefined && object.options !== null) {
                    if (typeof object.options !== "object")
                        throw TypeError(".google.protobuf.MethodDescriptorProto.options: object expected");
                    message.options = $types[3].fromObject(object.options);
                }
                if (object.clientStreaming !== undefined && object.clientStreaming !== null)
                    message.clientStreaming = Boolean(object.clientStreaming);
                if (object.serverStreaming !== undefined && object.serverStreaming !== null)
                    message.serverStreaming = Boolean(object.serverStreaming);
                return message;
            };

            /**
             * Creates a MethodDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.MethodDescriptorProto.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.MethodDescriptorProto} MethodDescriptorProto
             */
            MethodDescriptorProto.from = MethodDescriptorProto.fromObject;

            /**
             * Creates a plain object from a MethodDescriptorProto message. Also converts values to other types if specified.
             * @param {google.protobuf.MethodDescriptorProto} message MethodDescriptorProto
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MethodDescriptorProto.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.name = "";
                    object.inputType = "";
                    object.outputType = "";
                    object.options = null;
                    object.clientStreaming = false;
                    object.serverStreaming = false;
                }
                if (message.name !== undefined && message.name !== null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.inputType !== undefined && message.inputType !== null && message.hasOwnProperty("inputType"))
                    object.inputType = message.inputType;
                if (message.outputType !== undefined && message.outputType !== null && message.hasOwnProperty("outputType"))
                    object.outputType = message.outputType;
                if (message.options !== undefined && message.options !== null && message.hasOwnProperty("options"))
                    object.options = $types[3].toObject(message.options, options);
                if (message.clientStreaming !== undefined && message.clientStreaming !== null && message.hasOwnProperty("clientStreaming"))
                    object.clientStreaming = message.clientStreaming;
                if (message.serverStreaming !== undefined && message.serverStreaming !== null && message.hasOwnProperty("serverStreaming"))
                    object.serverStreaming = message.serverStreaming;
                return object;
            };

            /**
             * Creates a plain object from this MethodDescriptorProto message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MethodDescriptorProto.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this MethodDescriptorProto to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            MethodDescriptorProto.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return MethodDescriptorProto;
        })();

        protobuf.FileOptions = (function() {

            /**
             * Constructs a new FileOptions.
             * @exports google.protobuf.FileOptions
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function FileOptions(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * domain names.
             * @type {string}
             */
            FileOptions.prototype.javaPackage = "";

            /**
             * explicitly choose the class name).
             * @type {string}
             */
            FileOptions.prototype.javaOuterClassname = "";

            /**
             * top-level extensions defined in the file.
             * @type {boolean}
             */
            FileOptions.prototype.javaMultipleFiles = false;

            /**
             * will be consistent across runtimes or versions of the protocol compiler.)
             * @type {boolean}
             */
            FileOptions.prototype.javaGenerateEqualsAndHash = false;

            /**
             * This option has no effect on when used with the lite runtime.
             * @type {boolean}
             */
            FileOptions.prototype.javaStringCheckUtf8 = false;

            /**
             * FileOptions optimizeFor.
             * @type {number}
             */
            FileOptions.prototype.optimizeFor = 1;

            /**
             * - Otherwise, the basename of the .proto file, without extension.
             * @type {string}
             */
            FileOptions.prototype.goPackage = "";

            /**
             * explicitly set them to true.
             * @type {boolean}
             */
            FileOptions.prototype.ccGenericServices = false;

            /**
             * FileOptions javaGenericServices.
             * @type {boolean}
             */
            FileOptions.prototype.javaGenericServices = false;

            /**
             * FileOptions pyGenericServices.
             * @type {boolean}
             */
            FileOptions.prototype.pyGenericServices = false;

            /**
             * least, this is a formalization for deprecating files.
             * @type {boolean}
             */
            FileOptions.prototype.deprecated = false;

            /**
             * only to generated classes for C++.
             * @type {boolean}
             */
            FileOptions.prototype.ccEnableArenas = false;

            /**
             * generated classes from this .proto. There is no default.
             * @type {string}
             */
            FileOptions.prototype.objcClassPrefix = "";

            /**
             * Namespace for generated classes; defaults to the package.
             * @type {string}
             */
            FileOptions.prototype.csharpNamespace = "";

            /**
             * The parser stores options it doesn't recognize here. See above.
             * @type {Array.<google.protobuf.UninterpretedOption>}
             */
            FileOptions.prototype.uninterpretedOption = $util.emptyArray;

            // Lazily resolved type references
            var $types = {
                5: "google.protobuf.FileOptions.OptimizeMode",
                14: "google.protobuf.UninterpretedOption"
            }; $lazyTypes.push($types);

            /**
             * Creates a new FileOptions instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.FileOptions} FileOptions instance
             */
            FileOptions.create = function create(properties) {
                return new FileOptions(properties);
            };

            /**
             * Encodes the specified FileOptions message.
             * @param {google.protobuf.FileOptions|Object} message FileOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FileOptions.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.javaPackage !== undefined && message.hasOwnProperty("javaPackage"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.javaPackage);
                if (message.javaOuterClassname !== undefined && message.hasOwnProperty("javaOuterClassname"))
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.javaOuterClassname);
                if (message.javaMultipleFiles !== undefined && message.hasOwnProperty("javaMultipleFiles"))
                    writer.uint32(/* id 10, wireType 0 =*/80).bool(message.javaMultipleFiles);
                if (message.javaGenerateEqualsAndHash !== undefined && message.hasOwnProperty("javaGenerateEqualsAndHash"))
                    writer.uint32(/* id 20, wireType 0 =*/160).bool(message.javaGenerateEqualsAndHash);
                if (message.javaStringCheckUtf8 !== undefined && message.hasOwnProperty("javaStringCheckUtf8"))
                    writer.uint32(/* id 27, wireType 0 =*/216).bool(message.javaStringCheckUtf8);
                if (message.optimizeFor !== undefined && message.hasOwnProperty("optimizeFor"))
                    writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.optimizeFor);
                if (message.goPackage !== undefined && message.hasOwnProperty("goPackage"))
                    writer.uint32(/* id 11, wireType 2 =*/90).string(message.goPackage);
                if (message.ccGenericServices !== undefined && message.hasOwnProperty("ccGenericServices"))
                    writer.uint32(/* id 16, wireType 0 =*/128).bool(message.ccGenericServices);
                if (message.javaGenericServices !== undefined && message.hasOwnProperty("javaGenericServices"))
                    writer.uint32(/* id 17, wireType 0 =*/136).bool(message.javaGenericServices);
                if (message.pyGenericServices !== undefined && message.hasOwnProperty("pyGenericServices"))
                    writer.uint32(/* id 18, wireType 0 =*/144).bool(message.pyGenericServices);
                if (message.deprecated !== undefined && message.hasOwnProperty("deprecated"))
                    writer.uint32(/* id 23, wireType 0 =*/184).bool(message.deprecated);
                if (message.ccEnableArenas !== undefined && message.hasOwnProperty("ccEnableArenas"))
                    writer.uint32(/* id 31, wireType 0 =*/248).bool(message.ccEnableArenas);
                if (message.objcClassPrefix !== undefined && message.hasOwnProperty("objcClassPrefix"))
                    writer.uint32(/* id 36, wireType 2 =*/290).string(message.objcClassPrefix);
                if (message.csharpNamespace !== undefined && message.hasOwnProperty("csharpNamespace"))
                    writer.uint32(/* id 37, wireType 2 =*/298).string(message.csharpNamespace);
                if (message.uninterpretedOption !== undefined && message.hasOwnProperty("uninterpretedOption"))
                    for (var i = 0; i < message.uninterpretedOption.length; ++i)
                        $types[14].encode(message.uninterpretedOption[i], writer.uint32(/* id 999, wireType 2 =*/7994).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified FileOptions message, length delimited.
             * @param {google.protobuf.FileOptions|Object} message FileOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FileOptions.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FileOptions message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.FileOptions} FileOptions
             */
            FileOptions.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.FileOptions();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.javaPackage = reader.string();
                        break;
                    case 8:
                        message.javaOuterClassname = reader.string();
                        break;
                    case 10:
                        message.javaMultipleFiles = reader.bool();
                        break;
                    case 20:
                        message.javaGenerateEqualsAndHash = reader.bool();
                        break;
                    case 27:
                        message.javaStringCheckUtf8 = reader.bool();
                        break;
                    case 9:
                        message.optimizeFor = reader.uint32();
                        break;
                    case 11:
                        message.goPackage = reader.string();
                        break;
                    case 16:
                        message.ccGenericServices = reader.bool();
                        break;
                    case 17:
                        message.javaGenericServices = reader.bool();
                        break;
                    case 18:
                        message.pyGenericServices = reader.bool();
                        break;
                    case 23:
                        message.deprecated = reader.bool();
                        break;
                    case 31:
                        message.ccEnableArenas = reader.bool();
                        break;
                    case 36:
                        message.objcClassPrefix = reader.string();
                        break;
                    case 37:
                        message.csharpNamespace = reader.string();
                        break;
                    case 999:
                        if (!(message.uninterpretedOption && message.uninterpretedOption.length))
                            message.uninterpretedOption = [];
                        message.uninterpretedOption.push($types[14].decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a FileOptions message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.FileOptions} FileOptions
             */
            FileOptions.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FileOptions message.
             * @param {google.protobuf.FileOptions|Object} message FileOptions message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            FileOptions.verify = function verify(message) {
                if (message.javaPackage !== undefined)
                    if (!$util.isString(message.javaPackage))
                        return "javaPackage: string expected";
                if (message.javaOuterClassname !== undefined)
                    if (!$util.isString(message.javaOuterClassname))
                        return "javaOuterClassname: string expected";
                if (message.javaMultipleFiles !== undefined)
                    if (typeof message.javaMultipleFiles !== "boolean")
                        return "javaMultipleFiles: boolean expected";
                if (message.javaGenerateEqualsAndHash !== undefined)
                    if (typeof message.javaGenerateEqualsAndHash !== "boolean")
                        return "javaGenerateEqualsAndHash: boolean expected";
                if (message.javaStringCheckUtf8 !== undefined)
                    if (typeof message.javaStringCheckUtf8 !== "boolean")
                        return "javaStringCheckUtf8: boolean expected";
                if (message.optimizeFor !== undefined)
                    switch (message.optimizeFor) {
                    default:
                        return "optimizeFor: enum value expected";
                    case 1:
                    case 2:
                    case 3:
                        break;
                    }
                if (message.goPackage !== undefined)
                    if (!$util.isString(message.goPackage))
                        return "goPackage: string expected";
                if (message.ccGenericServices !== undefined)
                    if (typeof message.ccGenericServices !== "boolean")
                        return "ccGenericServices: boolean expected";
                if (message.javaGenericServices !== undefined)
                    if (typeof message.javaGenericServices !== "boolean")
                        return "javaGenericServices: boolean expected";
                if (message.pyGenericServices !== undefined)
                    if (typeof message.pyGenericServices !== "boolean")
                        return "pyGenericServices: boolean expected";
                if (message.deprecated !== undefined)
                    if (typeof message.deprecated !== "boolean")
                        return "deprecated: boolean expected";
                if (message.ccEnableArenas !== undefined)
                    if (typeof message.ccEnableArenas !== "boolean")
                        return "ccEnableArenas: boolean expected";
                if (message.objcClassPrefix !== undefined)
                    if (!$util.isString(message.objcClassPrefix))
                        return "objcClassPrefix: string expected";
                if (message.csharpNamespace !== undefined)
                    if (!$util.isString(message.csharpNamespace))
                        return "csharpNamespace: string expected";
                if (message.uninterpretedOption !== undefined) {
                    if (!Array.isArray(message.uninterpretedOption))
                        return "uninterpretedOption: array expected";
                    for (var i = 0; i < message.uninterpretedOption.length; ++i) {
                        var error = $types[14].verify(message.uninterpretedOption[i]);
                        if (error)
                            return "uninterpretedOption." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a FileOptions message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FileOptions} FileOptions
             */
            FileOptions.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.FileOptions)
                    return object;
                var message = new $root.google.protobuf.FileOptions();
                if (object.javaPackage !== undefined && object.javaPackage !== null)
                    message.javaPackage = String(object.javaPackage);
                if (object.javaOuterClassname !== undefined && object.javaOuterClassname !== null)
                    message.javaOuterClassname = String(object.javaOuterClassname);
                if (object.javaMultipleFiles !== undefined && object.javaMultipleFiles !== null)
                    message.javaMultipleFiles = Boolean(object.javaMultipleFiles);
                if (object.javaGenerateEqualsAndHash !== undefined && object.javaGenerateEqualsAndHash !== null)
                    message.javaGenerateEqualsAndHash = Boolean(object.javaGenerateEqualsAndHash);
                if (object.javaStringCheckUtf8 !== undefined && object.javaStringCheckUtf8 !== null)
                    message.javaStringCheckUtf8 = Boolean(object.javaStringCheckUtf8);
                switch (object.optimizeFor) {
                case "SPEED":
                case 1:
                    message.optimizeFor = 1;
                    break;
                case "CODE_SIZE":
                case 2:
                    message.optimizeFor = 2;
                    break;
                case "LITE_RUNTIME":
                case 3:
                    message.optimizeFor = 3;
                    break;
                }
                if (object.goPackage !== undefined && object.goPackage !== null)
                    message.goPackage = String(object.goPackage);
                if (object.ccGenericServices !== undefined && object.ccGenericServices !== null)
                    message.ccGenericServices = Boolean(object.ccGenericServices);
                if (object.javaGenericServices !== undefined && object.javaGenericServices !== null)
                    message.javaGenericServices = Boolean(object.javaGenericServices);
                if (object.pyGenericServices !== undefined && object.pyGenericServices !== null)
                    message.pyGenericServices = Boolean(object.pyGenericServices);
                if (object.deprecated !== undefined && object.deprecated !== null)
                    message.deprecated = Boolean(object.deprecated);
                if (object.ccEnableArenas !== undefined && object.ccEnableArenas !== null)
                    message.ccEnableArenas = Boolean(object.ccEnableArenas);
                if (object.objcClassPrefix !== undefined && object.objcClassPrefix !== null)
                    message.objcClassPrefix = String(object.objcClassPrefix);
                if (object.csharpNamespace !== undefined && object.csharpNamespace !== null)
                    message.csharpNamespace = String(object.csharpNamespace);
                if (object.uninterpretedOption) {
                    if (!Array.isArray(object.uninterpretedOption))
                        throw TypeError(".google.protobuf.FileOptions.uninterpretedOption: array expected");
                    message.uninterpretedOption = [];
                    for (var i = 0; i < object.uninterpretedOption.length; ++i) {
                        if (typeof object.uninterpretedOption[i] !== "object")
                            throw TypeError(".google.protobuf.FileOptions.uninterpretedOption: object expected");
                        message.uninterpretedOption[i] = $types[14].fromObject(object.uninterpretedOption[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a FileOptions message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.FileOptions.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FileOptions} FileOptions
             */
            FileOptions.from = FileOptions.fromObject;

            /**
             * Creates a plain object from a FileOptions message. Also converts values to other types if specified.
             * @param {google.protobuf.FileOptions} message FileOptions
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FileOptions.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.uninterpretedOption = [];
                if (options.defaults) {
                    object.javaPackage = "";
                    object.javaOuterClassname = "";
                    object.javaMultipleFiles = false;
                    object.javaGenerateEqualsAndHash = false;
                    object.javaStringCheckUtf8 = false;
                    object.optimizeFor = options.enums === String ? "SPEED" : 1;
                    object.goPackage = "";
                    object.ccGenericServices = false;
                    object.javaGenericServices = false;
                    object.pyGenericServices = false;
                    object.deprecated = false;
                    object.ccEnableArenas = false;
                    object.objcClassPrefix = "";
                    object.csharpNamespace = "";
                }
                if (message.javaPackage !== undefined && message.javaPackage !== null && message.hasOwnProperty("javaPackage"))
                    object.javaPackage = message.javaPackage;
                if (message.javaOuterClassname !== undefined && message.javaOuterClassname !== null && message.hasOwnProperty("javaOuterClassname"))
                    object.javaOuterClassname = message.javaOuterClassname;
                if (message.javaMultipleFiles !== undefined && message.javaMultipleFiles !== null && message.hasOwnProperty("javaMultipleFiles"))
                    object.javaMultipleFiles = message.javaMultipleFiles;
                if (message.javaGenerateEqualsAndHash !== undefined && message.javaGenerateEqualsAndHash !== null && message.hasOwnProperty("javaGenerateEqualsAndHash"))
                    object.javaGenerateEqualsAndHash = message.javaGenerateEqualsAndHash;
                if (message.javaStringCheckUtf8 !== undefined && message.javaStringCheckUtf8 !== null && message.hasOwnProperty("javaStringCheckUtf8"))
                    object.javaStringCheckUtf8 = message.javaStringCheckUtf8;
                if (message.optimizeFor !== undefined && message.optimizeFor !== null && message.hasOwnProperty("optimizeFor"))
                    object.optimizeFor = options.enums === String ? $types[5][message.optimizeFor] : message.optimizeFor;
                if (message.goPackage !== undefined && message.goPackage !== null && message.hasOwnProperty("goPackage"))
                    object.goPackage = message.goPackage;
                if (message.ccGenericServices !== undefined && message.ccGenericServices !== null && message.hasOwnProperty("ccGenericServices"))
                    object.ccGenericServices = message.ccGenericServices;
                if (message.javaGenericServices !== undefined && message.javaGenericServices !== null && message.hasOwnProperty("javaGenericServices"))
                    object.javaGenericServices = message.javaGenericServices;
                if (message.pyGenericServices !== undefined && message.pyGenericServices !== null && message.hasOwnProperty("pyGenericServices"))
                    object.pyGenericServices = message.pyGenericServices;
                if (message.deprecated !== undefined && message.deprecated !== null && message.hasOwnProperty("deprecated"))
                    object.deprecated = message.deprecated;
                if (message.ccEnableArenas !== undefined && message.ccEnableArenas !== null && message.hasOwnProperty("ccEnableArenas"))
                    object.ccEnableArenas = message.ccEnableArenas;
                if (message.objcClassPrefix !== undefined && message.objcClassPrefix !== null && message.hasOwnProperty("objcClassPrefix"))
                    object.objcClassPrefix = message.objcClassPrefix;
                if (message.csharpNamespace !== undefined && message.csharpNamespace !== null && message.hasOwnProperty("csharpNamespace"))
                    object.csharpNamespace = message.csharpNamespace;
                if (message.uninterpretedOption !== undefined && message.uninterpretedOption !== null && message.hasOwnProperty("uninterpretedOption")) {
                    object.uninterpretedOption = [];
                    for (var j = 0; j < message.uninterpretedOption.length; ++j)
                        object.uninterpretedOption[j] = $types[14].toObject(message.uninterpretedOption[j], options);
                }
                return object;
            };

            /**
             * Creates a plain object from this FileOptions message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FileOptions.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this FileOptions to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            FileOptions.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Generated classes can be optimized for speed or code size.
             * @name OptimizeMode
             * @memberof google.protobuf.FileOptions
             * @enum {number}
             * @property {number} SPEED=1 SPEED value
             * @property {number} CODE_SIZE=2 etc.
             * @property {number} LITE_RUNTIME=3 Use ReflectionOps to implement these methods.
             */
            FileOptions.OptimizeMode = (function() {
                var valuesById = {},
                    values = Object.create(valuesById);
                values[valuesById[1] = "SPEED"] = 1;
                values[valuesById[2] = "CODE_SIZE"] = 2;
                values[valuesById[3] = "LITE_RUNTIME"] = 3;
                return values;
            })();

            return FileOptions;
        })();

        protobuf.MessageOptions = (function() {

            /**
             * Constructs a new MessageOptions.
             * @exports google.protobuf.MessageOptions
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function MessageOptions(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * the protocol compiler.
             * @type {boolean}
             */
            MessageOptions.prototype.messageSetWireFormat = false;

            /**
             * from proto1 easier; new code should avoid fields named "descriptor".
             * @type {boolean}
             */
            MessageOptions.prototype.noStandardDescriptorAccessor = false;

            /**
             * this is a formalization for deprecating messages.
             * @type {boolean}
             */
            MessageOptions.prototype.deprecated = false;

            /**
             * parser.
             * @type {boolean}
             */
            MessageOptions.prototype.mapEntry = false;

            /**
             * The parser stores options it doesn't recognize here. See above.
             * @type {Array.<google.protobuf.UninterpretedOption>}
             */
            MessageOptions.prototype.uninterpretedOption = $util.emptyArray;

            /**
             * MessageOptions .io.restorecommerce.event.event.
             * @name google.protobuf.MessageOptions#.io.restorecommerce.event.event
             * @type {Array.<string>}
             */
            MessageOptions.prototype[".io.restorecommerce.event.event"] = $util.emptyArray;

            // Lazily resolved type references
            var $types = {
                4: "google.protobuf.UninterpretedOption"
            }; $lazyTypes.push($types);

            /**
             * Creates a new MessageOptions instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.MessageOptions} MessageOptions instance
             */
            MessageOptions.create = function create(properties) {
                return new MessageOptions(properties);
            };

            /**
             * Encodes the specified MessageOptions message.
             * @param {google.protobuf.MessageOptions|Object} message MessageOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MessageOptions.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.messageSetWireFormat !== undefined && message.hasOwnProperty("messageSetWireFormat"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.messageSetWireFormat);
                if (message.noStandardDescriptorAccessor !== undefined && message.hasOwnProperty("noStandardDescriptorAccessor"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.noStandardDescriptorAccessor);
                if (message.deprecated !== undefined && message.hasOwnProperty("deprecated"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.deprecated);
                if (message.mapEntry !== undefined && message.hasOwnProperty("mapEntry"))
                    writer.uint32(/* id 7, wireType 0 =*/56).bool(message.mapEntry);
                if (message.uninterpretedOption !== undefined && message.hasOwnProperty("uninterpretedOption"))
                    for (var i = 0; i < message.uninterpretedOption.length; ++i)
                        $types[4].encode(message.uninterpretedOption[i], writer.uint32(/* id 999, wireType 2 =*/7994).fork()).ldelim();
                if (message[".io.restorecommerce.event.event"] !== undefined && message.hasOwnProperty(".io.restorecommerce.event.event"))
                    for (var i = 0; i < message[".io.restorecommerce.event.event"].length; ++i)
                        writer.uint32(/* id 51234, wireType 2 =*/409874).string(message[".io.restorecommerce.event.event"][i]);
                return writer;
            };

            /**
             * Encodes the specified MessageOptions message, length delimited.
             * @param {google.protobuf.MessageOptions|Object} message MessageOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MessageOptions.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MessageOptions message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.MessageOptions} MessageOptions
             */
            MessageOptions.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.MessageOptions();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.messageSetWireFormat = reader.bool();
                        break;
                    case 2:
                        message.noStandardDescriptorAccessor = reader.bool();
                        break;
                    case 3:
                        message.deprecated = reader.bool();
                        break;
                    case 7:
                        message.mapEntry = reader.bool();
                        break;
                    case 999:
                        if (!(message.uninterpretedOption && message.uninterpretedOption.length))
                            message.uninterpretedOption = [];
                        message.uninterpretedOption.push($types[4].decode(reader, reader.uint32()));
                        break;
                    case 51234:
                        if (!(message[".io.restorecommerce.event.event"] && message[".io.restorecommerce.event.event"].length))
                            message[".io.restorecommerce.event.event"] = [];
                        message[".io.restorecommerce.event.event"].push(reader.string());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a MessageOptions message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.MessageOptions} MessageOptions
             */
            MessageOptions.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MessageOptions message.
             * @param {google.protobuf.MessageOptions|Object} message MessageOptions message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            MessageOptions.verify = function verify(message) {
                if (message.messageSetWireFormat !== undefined)
                    if (typeof message.messageSetWireFormat !== "boolean")
                        return "messageSetWireFormat: boolean expected";
                if (message.noStandardDescriptorAccessor !== undefined)
                    if (typeof message.noStandardDescriptorAccessor !== "boolean")
                        return "noStandardDescriptorAccessor: boolean expected";
                if (message.deprecated !== undefined)
                    if (typeof message.deprecated !== "boolean")
                        return "deprecated: boolean expected";
                if (message.mapEntry !== undefined)
                    if (typeof message.mapEntry !== "boolean")
                        return "mapEntry: boolean expected";
                if (message.uninterpretedOption !== undefined) {
                    if (!Array.isArray(message.uninterpretedOption))
                        return "uninterpretedOption: array expected";
                    for (var i = 0; i < message.uninterpretedOption.length; ++i) {
                        var error = $types[4].verify(message.uninterpretedOption[i]);
                        if (error)
                            return "uninterpretedOption." + error;
                    }
                }
                if (message[".io.restorecommerce.event.event"] !== undefined) {
                    if (!Array.isArray(message[".io.restorecommerce.event.event"]))
                        return ".io.restorecommerce.event.event: array expected";
                    for (var i = 0; i < message[".io.restorecommerce.event.event"].length; ++i)
                        if (!$util.isString(message[".io.restorecommerce.event.event"][i]))
                            return ".io.restorecommerce.event.event: string[] expected";
                }
                return null;
            };

            /**
             * Creates a MessageOptions message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.MessageOptions} MessageOptions
             */
            MessageOptions.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.MessageOptions)
                    return object;
                var message = new $root.google.protobuf.MessageOptions();
                if (object.messageSetWireFormat !== undefined && object.messageSetWireFormat !== null)
                    message.messageSetWireFormat = Boolean(object.messageSetWireFormat);
                if (object.noStandardDescriptorAccessor !== undefined && object.noStandardDescriptorAccessor !== null)
                    message.noStandardDescriptorAccessor = Boolean(object.noStandardDescriptorAccessor);
                if (object.deprecated !== undefined && object.deprecated !== null)
                    message.deprecated = Boolean(object.deprecated);
                if (object.mapEntry !== undefined && object.mapEntry !== null)
                    message.mapEntry = Boolean(object.mapEntry);
                if (object.uninterpretedOption) {
                    if (!Array.isArray(object.uninterpretedOption))
                        throw TypeError(".google.protobuf.MessageOptions.uninterpretedOption: array expected");
                    message.uninterpretedOption = [];
                    for (var i = 0; i < object.uninterpretedOption.length; ++i) {
                        if (typeof object.uninterpretedOption[i] !== "object")
                            throw TypeError(".google.protobuf.MessageOptions.uninterpretedOption: object expected");
                        message.uninterpretedOption[i] = $types[4].fromObject(object.uninterpretedOption[i]);
                    }
                }
                if (object[".io.restorecommerce.event.event"]) {
                    if (!Array.isArray(object[".io.restorecommerce.event.event"]))
                        throw TypeError(".google.protobuf.MessageOptions..io.restorecommerce.event.event: array expected");
                    message[".io.restorecommerce.event.event"] = [];
                    for (var i = 0; i < object[".io.restorecommerce.event.event"].length; ++i)
                        message[".io.restorecommerce.event.event"][i] = String(object[".io.restorecommerce.event.event"][i]);
                }
                return message;
            };

            /**
             * Creates a MessageOptions message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.MessageOptions.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.MessageOptions} MessageOptions
             */
            MessageOptions.from = MessageOptions.fromObject;

            /**
             * Creates a plain object from a MessageOptions message. Also converts values to other types if specified.
             * @param {google.protobuf.MessageOptions} message MessageOptions
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MessageOptions.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.uninterpretedOption = [];
                    object[".io.restorecommerce.event.event"] = [];
                }
                if (options.defaults) {
                    object.messageSetWireFormat = false;
                    object.noStandardDescriptorAccessor = false;
                    object.deprecated = false;
                    object.mapEntry = false;
                }
                if (message.messageSetWireFormat !== undefined && message.messageSetWireFormat !== null && message.hasOwnProperty("messageSetWireFormat"))
                    object.messageSetWireFormat = message.messageSetWireFormat;
                if (message.noStandardDescriptorAccessor !== undefined && message.noStandardDescriptorAccessor !== null && message.hasOwnProperty("noStandardDescriptorAccessor"))
                    object.noStandardDescriptorAccessor = message.noStandardDescriptorAccessor;
                if (message.deprecated !== undefined && message.deprecated !== null && message.hasOwnProperty("deprecated"))
                    object.deprecated = message.deprecated;
                if (message.mapEntry !== undefined && message.mapEntry !== null && message.hasOwnProperty("mapEntry"))
                    object.mapEntry = message.mapEntry;
                if (message.uninterpretedOption !== undefined && message.uninterpretedOption !== null && message.hasOwnProperty("uninterpretedOption")) {
                    object.uninterpretedOption = [];
                    for (var j = 0; j < message.uninterpretedOption.length; ++j)
                        object.uninterpretedOption[j] = $types[4].toObject(message.uninterpretedOption[j], options);
                }
                if (message[".io.restorecommerce.event.event"] !== undefined && message[".io.restorecommerce.event.event"] !== null && message.hasOwnProperty(".io.restorecommerce.event.event")) {
                    object[".io.restorecommerce.event.event"] = [];
                    for (var j = 0; j < message[".io.restorecommerce.event.event"].length; ++j)
                        object[".io.restorecommerce.event.event"][j] = message[".io.restorecommerce.event.event"][j];
                }
                return object;
            };

            /**
             * Creates a plain object from this MessageOptions message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MessageOptions.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this MessageOptions to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            MessageOptions.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return MessageOptions;
        })();

        protobuf.FieldOptions = (function() {

            /**
             * Constructs a new FieldOptions.
             * @exports google.protobuf.FieldOptions
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function FieldOptions(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * release -- sorry, we'll try to include it in a future version!
             * @type {number}
             */
            FieldOptions.prototype.ctype = 0;

            /**
             * false will avoid using packed encoding.
             * @type {boolean}
             */
            FieldOptions.prototype.packed = false;

            /**
             * e.g. goog.math.Integer.
             * @type {number}
             */
            FieldOptions.prototype.jstype = 0;

            /**
             * been parsed.
             * @type {boolean}
             */
            FieldOptions.prototype.lazy = false;

            /**
             * is a formalization for deprecating fields.
             * @type {boolean}
             */
            FieldOptions.prototype.deprecated = false;

            /**
             * For Google-internal migration only. Do not use.
             * @type {boolean}
             */
            FieldOptions.prototype.weak = false;

            /**
             * The parser stores options it doesn't recognize here. See above.
             * @type {Array.<google.protobuf.UninterpretedOption>}
             */
            FieldOptions.prototype.uninterpretedOption = $util.emptyArray;

            // Lazily resolved type references
            var $types = {
                0: "google.protobuf.FieldOptions.CType",
                2: "google.protobuf.FieldOptions.JSType",
                6: "google.protobuf.UninterpretedOption"
            }; $lazyTypes.push($types);

            /**
             * Creates a new FieldOptions instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.FieldOptions} FieldOptions instance
             */
            FieldOptions.create = function create(properties) {
                return new FieldOptions(properties);
            };

            /**
             * Encodes the specified FieldOptions message.
             * @param {google.protobuf.FieldOptions|Object} message FieldOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FieldOptions.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.ctype !== undefined && message.hasOwnProperty("ctype"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.ctype);
                if (message.packed !== undefined && message.hasOwnProperty("packed"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.packed);
                if (message.jstype !== undefined && message.hasOwnProperty("jstype"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.jstype);
                if (message.lazy !== undefined && message.hasOwnProperty("lazy"))
                    writer.uint32(/* id 5, wireType 0 =*/40).bool(message.lazy);
                if (message.deprecated !== undefined && message.hasOwnProperty("deprecated"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.deprecated);
                if (message.weak !== undefined && message.hasOwnProperty("weak"))
                    writer.uint32(/* id 10, wireType 0 =*/80).bool(message.weak);
                if (message.uninterpretedOption !== undefined && message.hasOwnProperty("uninterpretedOption"))
                    for (var i = 0; i < message.uninterpretedOption.length; ++i)
                        $types[6].encode(message.uninterpretedOption[i], writer.uint32(/* id 999, wireType 2 =*/7994).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified FieldOptions message, length delimited.
             * @param {google.protobuf.FieldOptions|Object} message FieldOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FieldOptions.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FieldOptions message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.FieldOptions} FieldOptions
             */
            FieldOptions.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.FieldOptions();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.ctype = reader.uint32();
                        break;
                    case 2:
                        message.packed = reader.bool();
                        break;
                    case 6:
                        message.jstype = reader.uint32();
                        break;
                    case 5:
                        message.lazy = reader.bool();
                        break;
                    case 3:
                        message.deprecated = reader.bool();
                        break;
                    case 10:
                        message.weak = reader.bool();
                        break;
                    case 999:
                        if (!(message.uninterpretedOption && message.uninterpretedOption.length))
                            message.uninterpretedOption = [];
                        message.uninterpretedOption.push($types[6].decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a FieldOptions message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.FieldOptions} FieldOptions
             */
            FieldOptions.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FieldOptions message.
             * @param {google.protobuf.FieldOptions|Object} message FieldOptions message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            FieldOptions.verify = function verify(message) {
                if (message.ctype !== undefined)
                    switch (message.ctype) {
                    default:
                        return "ctype: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                        break;
                    }
                if (message.packed !== undefined)
                    if (typeof message.packed !== "boolean")
                        return "packed: boolean expected";
                if (message.jstype !== undefined)
                    switch (message.jstype) {
                    default:
                        return "jstype: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                        break;
                    }
                if (message.lazy !== undefined)
                    if (typeof message.lazy !== "boolean")
                        return "lazy: boolean expected";
                if (message.deprecated !== undefined)
                    if (typeof message.deprecated !== "boolean")
                        return "deprecated: boolean expected";
                if (message.weak !== undefined)
                    if (typeof message.weak !== "boolean")
                        return "weak: boolean expected";
                if (message.uninterpretedOption !== undefined) {
                    if (!Array.isArray(message.uninterpretedOption))
                        return "uninterpretedOption: array expected";
                    for (var i = 0; i < message.uninterpretedOption.length; ++i) {
                        var error = $types[6].verify(message.uninterpretedOption[i]);
                        if (error)
                            return "uninterpretedOption." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a FieldOptions message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FieldOptions} FieldOptions
             */
            FieldOptions.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.FieldOptions)
                    return object;
                var message = new $root.google.protobuf.FieldOptions();
                switch (object.ctype) {
                case "STRING":
                case 0:
                    message.ctype = 0;
                    break;
                case "CORD":
                case 1:
                    message.ctype = 1;
                    break;
                case "STRING_PIECE":
                case 2:
                    message.ctype = 2;
                    break;
                }
                if (object.packed !== undefined && object.packed !== null)
                    message.packed = Boolean(object.packed);
                switch (object.jstype) {
                case "JS_NORMAL":
                case 0:
                    message.jstype = 0;
                    break;
                case "JS_STRING":
                case 1:
                    message.jstype = 1;
                    break;
                case "JS_NUMBER":
                case 2:
                    message.jstype = 2;
                    break;
                }
                if (object.lazy !== undefined && object.lazy !== null)
                    message.lazy = Boolean(object.lazy);
                if (object.deprecated !== undefined && object.deprecated !== null)
                    message.deprecated = Boolean(object.deprecated);
                if (object.weak !== undefined && object.weak !== null)
                    message.weak = Boolean(object.weak);
                if (object.uninterpretedOption) {
                    if (!Array.isArray(object.uninterpretedOption))
                        throw TypeError(".google.protobuf.FieldOptions.uninterpretedOption: array expected");
                    message.uninterpretedOption = [];
                    for (var i = 0; i < object.uninterpretedOption.length; ++i) {
                        if (typeof object.uninterpretedOption[i] !== "object")
                            throw TypeError(".google.protobuf.FieldOptions.uninterpretedOption: object expected");
                        message.uninterpretedOption[i] = $types[6].fromObject(object.uninterpretedOption[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a FieldOptions message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.FieldOptions.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FieldOptions} FieldOptions
             */
            FieldOptions.from = FieldOptions.fromObject;

            /**
             * Creates a plain object from a FieldOptions message. Also converts values to other types if specified.
             * @param {google.protobuf.FieldOptions} message FieldOptions
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FieldOptions.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.uninterpretedOption = [];
                if (options.defaults) {
                    object.ctype = options.enums === String ? "STRING" : 0;
                    object.packed = false;
                    object.jstype = options.enums === String ? "JS_NORMAL" : 0;
                    object.lazy = false;
                    object.deprecated = false;
                    object.weak = false;
                }
                if (message.ctype !== undefined && message.ctype !== null && message.hasOwnProperty("ctype"))
                    object.ctype = options.enums === String ? $types[0][message.ctype] : message.ctype;
                if (message.packed !== undefined && message.packed !== null && message.hasOwnProperty("packed"))
                    object.packed = message.packed;
                if (message.jstype !== undefined && message.jstype !== null && message.hasOwnProperty("jstype"))
                    object.jstype = options.enums === String ? $types[2][message.jstype] : message.jstype;
                if (message.lazy !== undefined && message.lazy !== null && message.hasOwnProperty("lazy"))
                    object.lazy = message.lazy;
                if (message.deprecated !== undefined && message.deprecated !== null && message.hasOwnProperty("deprecated"))
                    object.deprecated = message.deprecated;
                if (message.weak !== undefined && message.weak !== null && message.hasOwnProperty("weak"))
                    object.weak = message.weak;
                if (message.uninterpretedOption !== undefined && message.uninterpretedOption !== null && message.hasOwnProperty("uninterpretedOption")) {
                    object.uninterpretedOption = [];
                    for (var j = 0; j < message.uninterpretedOption.length; ++j)
                        object.uninterpretedOption[j] = $types[6].toObject(message.uninterpretedOption[j], options);
                }
                return object;
            };

            /**
             * Creates a plain object from this FieldOptions message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FieldOptions.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this FieldOptions to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            FieldOptions.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * CType enum.
             * @name CType
             * @memberof google.protobuf.FieldOptions
             * @enum {number}
             * @property {number} STRING=0 Default mode.
             * @property {number} CORD=1 CORD value
             * @property {number} STRING_PIECE=2 STRING_PIECE value
             */
            FieldOptions.CType = (function() {
                var valuesById = {},
                    values = Object.create(valuesById);
                values[valuesById[0] = "STRING"] = 0;
                values[valuesById[1] = "CORD"] = 1;
                values[valuesById[2] = "STRING_PIECE"] = 2;
                return values;
            })();

            /**
             * JSType enum.
             * @name JSType
             * @memberof google.protobuf.FieldOptions
             * @enum {number}
             * @property {number} JS_NORMAL=0 Use the default type.
             * @property {number} JS_STRING=1 Use JavaScript strings.
             * @property {number} JS_NUMBER=2 Use JavaScript numbers.
             */
            FieldOptions.JSType = (function() {
                var valuesById = {},
                    values = Object.create(valuesById);
                values[valuesById[0] = "JS_NORMAL"] = 0;
                values[valuesById[1] = "JS_STRING"] = 1;
                values[valuesById[2] = "JS_NUMBER"] = 2;
                return values;
            })();

            return FieldOptions;
        })();

        protobuf.EnumOptions = (function() {

            /**
             * Constructs a new EnumOptions.
             * @exports google.protobuf.EnumOptions
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function EnumOptions(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * value.
             * @type {boolean}
             */
            EnumOptions.prototype.allowAlias = false;

            /**
             * is a formalization for deprecating enums.
             * @type {boolean}
             */
            EnumOptions.prototype.deprecated = false;

            /**
             * The parser stores options it doesn't recognize here. See above.
             * @type {Array.<google.protobuf.UninterpretedOption>}
             */
            EnumOptions.prototype.uninterpretedOption = $util.emptyArray;

            // Lazily resolved type references
            var $types = {
                2: "google.protobuf.UninterpretedOption"
            }; $lazyTypes.push($types);

            /**
             * Creates a new EnumOptions instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.EnumOptions} EnumOptions instance
             */
            EnumOptions.create = function create(properties) {
                return new EnumOptions(properties);
            };

            /**
             * Encodes the specified EnumOptions message.
             * @param {google.protobuf.EnumOptions|Object} message EnumOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EnumOptions.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.allowAlias !== undefined && message.hasOwnProperty("allowAlias"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.allowAlias);
                if (message.deprecated !== undefined && message.hasOwnProperty("deprecated"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.deprecated);
                if (message.uninterpretedOption !== undefined && message.hasOwnProperty("uninterpretedOption"))
                    for (var i = 0; i < message.uninterpretedOption.length; ++i)
                        $types[2].encode(message.uninterpretedOption[i], writer.uint32(/* id 999, wireType 2 =*/7994).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified EnumOptions message, length delimited.
             * @param {google.protobuf.EnumOptions|Object} message EnumOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EnumOptions.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EnumOptions message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.EnumOptions} EnumOptions
             */
            EnumOptions.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.EnumOptions();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 2:
                        message.allowAlias = reader.bool();
                        break;
                    case 3:
                        message.deprecated = reader.bool();
                        break;
                    case 999:
                        if (!(message.uninterpretedOption && message.uninterpretedOption.length))
                            message.uninterpretedOption = [];
                        message.uninterpretedOption.push($types[2].decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an EnumOptions message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.EnumOptions} EnumOptions
             */
            EnumOptions.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EnumOptions message.
             * @param {google.protobuf.EnumOptions|Object} message EnumOptions message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            EnumOptions.verify = function verify(message) {
                if (message.allowAlias !== undefined)
                    if (typeof message.allowAlias !== "boolean")
                        return "allowAlias: boolean expected";
                if (message.deprecated !== undefined)
                    if (typeof message.deprecated !== "boolean")
                        return "deprecated: boolean expected";
                if (message.uninterpretedOption !== undefined) {
                    if (!Array.isArray(message.uninterpretedOption))
                        return "uninterpretedOption: array expected";
                    for (var i = 0; i < message.uninterpretedOption.length; ++i) {
                        var error = $types[2].verify(message.uninterpretedOption[i]);
                        if (error)
                            return "uninterpretedOption." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an EnumOptions message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.EnumOptions} EnumOptions
             */
            EnumOptions.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.EnumOptions)
                    return object;
                var message = new $root.google.protobuf.EnumOptions();
                if (object.allowAlias !== undefined && object.allowAlias !== null)
                    message.allowAlias = Boolean(object.allowAlias);
                if (object.deprecated !== undefined && object.deprecated !== null)
                    message.deprecated = Boolean(object.deprecated);
                if (object.uninterpretedOption) {
                    if (!Array.isArray(object.uninterpretedOption))
                        throw TypeError(".google.protobuf.EnumOptions.uninterpretedOption: array expected");
                    message.uninterpretedOption = [];
                    for (var i = 0; i < object.uninterpretedOption.length; ++i) {
                        if (typeof object.uninterpretedOption[i] !== "object")
                            throw TypeError(".google.protobuf.EnumOptions.uninterpretedOption: object expected");
                        message.uninterpretedOption[i] = $types[2].fromObject(object.uninterpretedOption[i]);
                    }
                }
                return message;
            };

            /**
             * Creates an EnumOptions message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.EnumOptions.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.EnumOptions} EnumOptions
             */
            EnumOptions.from = EnumOptions.fromObject;

            /**
             * Creates a plain object from an EnumOptions message. Also converts values to other types if specified.
             * @param {google.protobuf.EnumOptions} message EnumOptions
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EnumOptions.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.uninterpretedOption = [];
                if (options.defaults) {
                    object.allowAlias = false;
                    object.deprecated = false;
                }
                if (message.allowAlias !== undefined && message.allowAlias !== null && message.hasOwnProperty("allowAlias"))
                    object.allowAlias = message.allowAlias;
                if (message.deprecated !== undefined && message.deprecated !== null && message.hasOwnProperty("deprecated"))
                    object.deprecated = message.deprecated;
                if (message.uninterpretedOption !== undefined && message.uninterpretedOption !== null && message.hasOwnProperty("uninterpretedOption")) {
                    object.uninterpretedOption = [];
                    for (var j = 0; j < message.uninterpretedOption.length; ++j)
                        object.uninterpretedOption[j] = $types[2].toObject(message.uninterpretedOption[j], options);
                }
                return object;
            };

            /**
             * Creates a plain object from this EnumOptions message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EnumOptions.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this EnumOptions to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            EnumOptions.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return EnumOptions;
        })();

        protobuf.EnumValueOptions = (function() {

            /**
             * Constructs a new EnumValueOptions.
             * @exports google.protobuf.EnumValueOptions
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function EnumValueOptions(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * this is a formalization for deprecating enum values.
             * @type {boolean}
             */
            EnumValueOptions.prototype.deprecated = false;

            /**
             * The parser stores options it doesn't recognize here. See above.
             * @type {Array.<google.protobuf.UninterpretedOption>}
             */
            EnumValueOptions.prototype.uninterpretedOption = $util.emptyArray;

            // Lazily resolved type references
            var $types = {
                1: "google.protobuf.UninterpretedOption"
            }; $lazyTypes.push($types);

            /**
             * Creates a new EnumValueOptions instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.EnumValueOptions} EnumValueOptions instance
             */
            EnumValueOptions.create = function create(properties) {
                return new EnumValueOptions(properties);
            };

            /**
             * Encodes the specified EnumValueOptions message.
             * @param {google.protobuf.EnumValueOptions|Object} message EnumValueOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EnumValueOptions.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.deprecated !== undefined && message.hasOwnProperty("deprecated"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.deprecated);
                if (message.uninterpretedOption !== undefined && message.hasOwnProperty("uninterpretedOption"))
                    for (var i = 0; i < message.uninterpretedOption.length; ++i)
                        $types[1].encode(message.uninterpretedOption[i], writer.uint32(/* id 999, wireType 2 =*/7994).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified EnumValueOptions message, length delimited.
             * @param {google.protobuf.EnumValueOptions|Object} message EnumValueOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EnumValueOptions.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EnumValueOptions message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.EnumValueOptions} EnumValueOptions
             */
            EnumValueOptions.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.EnumValueOptions();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.deprecated = reader.bool();
                        break;
                    case 999:
                        if (!(message.uninterpretedOption && message.uninterpretedOption.length))
                            message.uninterpretedOption = [];
                        message.uninterpretedOption.push($types[1].decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an EnumValueOptions message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.EnumValueOptions} EnumValueOptions
             */
            EnumValueOptions.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EnumValueOptions message.
             * @param {google.protobuf.EnumValueOptions|Object} message EnumValueOptions message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            EnumValueOptions.verify = function verify(message) {
                if (message.deprecated !== undefined)
                    if (typeof message.deprecated !== "boolean")
                        return "deprecated: boolean expected";
                if (message.uninterpretedOption !== undefined) {
                    if (!Array.isArray(message.uninterpretedOption))
                        return "uninterpretedOption: array expected";
                    for (var i = 0; i < message.uninterpretedOption.length; ++i) {
                        var error = $types[1].verify(message.uninterpretedOption[i]);
                        if (error)
                            return "uninterpretedOption." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an EnumValueOptions message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.EnumValueOptions} EnumValueOptions
             */
            EnumValueOptions.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.EnumValueOptions)
                    return object;
                var message = new $root.google.protobuf.EnumValueOptions();
                if (object.deprecated !== undefined && object.deprecated !== null)
                    message.deprecated = Boolean(object.deprecated);
                if (object.uninterpretedOption) {
                    if (!Array.isArray(object.uninterpretedOption))
                        throw TypeError(".google.protobuf.EnumValueOptions.uninterpretedOption: array expected");
                    message.uninterpretedOption = [];
                    for (var i = 0; i < object.uninterpretedOption.length; ++i) {
                        if (typeof object.uninterpretedOption[i] !== "object")
                            throw TypeError(".google.protobuf.EnumValueOptions.uninterpretedOption: object expected");
                        message.uninterpretedOption[i] = $types[1].fromObject(object.uninterpretedOption[i]);
                    }
                }
                return message;
            };

            /**
             * Creates an EnumValueOptions message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.EnumValueOptions.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.EnumValueOptions} EnumValueOptions
             */
            EnumValueOptions.from = EnumValueOptions.fromObject;

            /**
             * Creates a plain object from an EnumValueOptions message. Also converts values to other types if specified.
             * @param {google.protobuf.EnumValueOptions} message EnumValueOptions
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EnumValueOptions.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.uninterpretedOption = [];
                if (options.defaults)
                    object.deprecated = false;
                if (message.deprecated !== undefined && message.deprecated !== null && message.hasOwnProperty("deprecated"))
                    object.deprecated = message.deprecated;
                if (message.uninterpretedOption !== undefined && message.uninterpretedOption !== null && message.hasOwnProperty("uninterpretedOption")) {
                    object.uninterpretedOption = [];
                    for (var j = 0; j < message.uninterpretedOption.length; ++j)
                        object.uninterpretedOption[j] = $types[1].toObject(message.uninterpretedOption[j], options);
                }
                return object;
            };

            /**
             * Creates a plain object from this EnumValueOptions message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EnumValueOptions.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this EnumValueOptions to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            EnumValueOptions.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return EnumValueOptions;
        })();

        protobuf.ServiceOptions = (function() {

            /**
             * Constructs a new ServiceOptions.
             * @exports google.protobuf.ServiceOptions
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function ServiceOptions(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * this is a formalization for deprecating services.
             * @type {boolean}
             */
            ServiceOptions.prototype.deprecated = false;

            /**
             * The parser stores options it doesn't recognize here. See above.
             * @type {Array.<google.protobuf.UninterpretedOption>}
             */
            ServiceOptions.prototype.uninterpretedOption = $util.emptyArray;

            // Lazily resolved type references
            var $types = {
                1: "google.protobuf.UninterpretedOption"
            }; $lazyTypes.push($types);

            /**
             * Creates a new ServiceOptions instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.ServiceOptions} ServiceOptions instance
             */
            ServiceOptions.create = function create(properties) {
                return new ServiceOptions(properties);
            };

            /**
             * Encodes the specified ServiceOptions message.
             * @param {google.protobuf.ServiceOptions|Object} message ServiceOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ServiceOptions.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.deprecated !== undefined && message.hasOwnProperty("deprecated"))
                    writer.uint32(/* id 33, wireType 0 =*/264).bool(message.deprecated);
                if (message.uninterpretedOption !== undefined && message.hasOwnProperty("uninterpretedOption"))
                    for (var i = 0; i < message.uninterpretedOption.length; ++i)
                        $types[1].encode(message.uninterpretedOption[i], writer.uint32(/* id 999, wireType 2 =*/7994).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ServiceOptions message, length delimited.
             * @param {google.protobuf.ServiceOptions|Object} message ServiceOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ServiceOptions.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ServiceOptions message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.ServiceOptions} ServiceOptions
             */
            ServiceOptions.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.ServiceOptions();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 33:
                        message.deprecated = reader.bool();
                        break;
                    case 999:
                        if (!(message.uninterpretedOption && message.uninterpretedOption.length))
                            message.uninterpretedOption = [];
                        message.uninterpretedOption.push($types[1].decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a ServiceOptions message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.ServiceOptions} ServiceOptions
             */
            ServiceOptions.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ServiceOptions message.
             * @param {google.protobuf.ServiceOptions|Object} message ServiceOptions message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            ServiceOptions.verify = function verify(message) {
                if (message.deprecated !== undefined)
                    if (typeof message.deprecated !== "boolean")
                        return "deprecated: boolean expected";
                if (message.uninterpretedOption !== undefined) {
                    if (!Array.isArray(message.uninterpretedOption))
                        return "uninterpretedOption: array expected";
                    for (var i = 0; i < message.uninterpretedOption.length; ++i) {
                        var error = $types[1].verify(message.uninterpretedOption[i]);
                        if (error)
                            return "uninterpretedOption." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ServiceOptions message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.ServiceOptions} ServiceOptions
             */
            ServiceOptions.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.ServiceOptions)
                    return object;
                var message = new $root.google.protobuf.ServiceOptions();
                if (object.deprecated !== undefined && object.deprecated !== null)
                    message.deprecated = Boolean(object.deprecated);
                if (object.uninterpretedOption) {
                    if (!Array.isArray(object.uninterpretedOption))
                        throw TypeError(".google.protobuf.ServiceOptions.uninterpretedOption: array expected");
                    message.uninterpretedOption = [];
                    for (var i = 0; i < object.uninterpretedOption.length; ++i) {
                        if (typeof object.uninterpretedOption[i] !== "object")
                            throw TypeError(".google.protobuf.ServiceOptions.uninterpretedOption: object expected");
                        message.uninterpretedOption[i] = $types[1].fromObject(object.uninterpretedOption[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a ServiceOptions message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.ServiceOptions.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.ServiceOptions} ServiceOptions
             */
            ServiceOptions.from = ServiceOptions.fromObject;

            /**
             * Creates a plain object from a ServiceOptions message. Also converts values to other types if specified.
             * @param {google.protobuf.ServiceOptions} message ServiceOptions
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ServiceOptions.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.uninterpretedOption = [];
                if (options.defaults)
                    object.deprecated = false;
                if (message.deprecated !== undefined && message.deprecated !== null && message.hasOwnProperty("deprecated"))
                    object.deprecated = message.deprecated;
                if (message.uninterpretedOption !== undefined && message.uninterpretedOption !== null && message.hasOwnProperty("uninterpretedOption")) {
                    object.uninterpretedOption = [];
                    for (var j = 0; j < message.uninterpretedOption.length; ++j)
                        object.uninterpretedOption[j] = $types[1].toObject(message.uninterpretedOption[j], options);
                }
                return object;
            };

            /**
             * Creates a plain object from this ServiceOptions message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ServiceOptions.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this ServiceOptions to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            ServiceOptions.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ServiceOptions;
        })();

        protobuf.MethodOptions = (function() {

            /**
             * Constructs a new MethodOptions.
             * @exports google.protobuf.MethodOptions
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function MethodOptions(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * this is a formalization for deprecating methods.
             * @type {boolean}
             */
            MethodOptions.prototype.deprecated = false;

            /**
             * The parser stores options it doesn't recognize here. See above.
             * @type {Array.<google.protobuf.UninterpretedOption>}
             */
            MethodOptions.prototype.uninterpretedOption = $util.emptyArray;

            // Lazily resolved type references
            var $types = {
                1: "google.protobuf.UninterpretedOption"
            }; $lazyTypes.push($types);

            /**
             * Creates a new MethodOptions instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.MethodOptions} MethodOptions instance
             */
            MethodOptions.create = function create(properties) {
                return new MethodOptions(properties);
            };

            /**
             * Encodes the specified MethodOptions message.
             * @param {google.protobuf.MethodOptions|Object} message MethodOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MethodOptions.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.deprecated !== undefined && message.hasOwnProperty("deprecated"))
                    writer.uint32(/* id 33, wireType 0 =*/264).bool(message.deprecated);
                if (message.uninterpretedOption !== undefined && message.hasOwnProperty("uninterpretedOption"))
                    for (var i = 0; i < message.uninterpretedOption.length; ++i)
                        $types[1].encode(message.uninterpretedOption[i], writer.uint32(/* id 999, wireType 2 =*/7994).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified MethodOptions message, length delimited.
             * @param {google.protobuf.MethodOptions|Object} message MethodOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MethodOptions.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MethodOptions message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.MethodOptions} MethodOptions
             */
            MethodOptions.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.MethodOptions();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 33:
                        message.deprecated = reader.bool();
                        break;
                    case 999:
                        if (!(message.uninterpretedOption && message.uninterpretedOption.length))
                            message.uninterpretedOption = [];
                        message.uninterpretedOption.push($types[1].decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a MethodOptions message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.MethodOptions} MethodOptions
             */
            MethodOptions.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MethodOptions message.
             * @param {google.protobuf.MethodOptions|Object} message MethodOptions message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            MethodOptions.verify = function verify(message) {
                if (message.deprecated !== undefined)
                    if (typeof message.deprecated !== "boolean")
                        return "deprecated: boolean expected";
                if (message.uninterpretedOption !== undefined) {
                    if (!Array.isArray(message.uninterpretedOption))
                        return "uninterpretedOption: array expected";
                    for (var i = 0; i < message.uninterpretedOption.length; ++i) {
                        var error = $types[1].verify(message.uninterpretedOption[i]);
                        if (error)
                            return "uninterpretedOption." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a MethodOptions message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.MethodOptions} MethodOptions
             */
            MethodOptions.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.MethodOptions)
                    return object;
                var message = new $root.google.protobuf.MethodOptions();
                if (object.deprecated !== undefined && object.deprecated !== null)
                    message.deprecated = Boolean(object.deprecated);
                if (object.uninterpretedOption) {
                    if (!Array.isArray(object.uninterpretedOption))
                        throw TypeError(".google.protobuf.MethodOptions.uninterpretedOption: array expected");
                    message.uninterpretedOption = [];
                    for (var i = 0; i < object.uninterpretedOption.length; ++i) {
                        if (typeof object.uninterpretedOption[i] !== "object")
                            throw TypeError(".google.protobuf.MethodOptions.uninterpretedOption: object expected");
                        message.uninterpretedOption[i] = $types[1].fromObject(object.uninterpretedOption[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a MethodOptions message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.MethodOptions.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.MethodOptions} MethodOptions
             */
            MethodOptions.from = MethodOptions.fromObject;

            /**
             * Creates a plain object from a MethodOptions message. Also converts values to other types if specified.
             * @param {google.protobuf.MethodOptions} message MethodOptions
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MethodOptions.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.uninterpretedOption = [];
                if (options.defaults)
                    object.deprecated = false;
                if (message.deprecated !== undefined && message.deprecated !== null && message.hasOwnProperty("deprecated"))
                    object.deprecated = message.deprecated;
                if (message.uninterpretedOption !== undefined && message.uninterpretedOption !== null && message.hasOwnProperty("uninterpretedOption")) {
                    object.uninterpretedOption = [];
                    for (var j = 0; j < message.uninterpretedOption.length; ++j)
                        object.uninterpretedOption[j] = $types[1].toObject(message.uninterpretedOption[j], options);
                }
                return object;
            };

            /**
             * Creates a plain object from this MethodOptions message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MethodOptions.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this MethodOptions to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            MethodOptions.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return MethodOptions;
        })();

        protobuf.UninterpretedOption = (function() {

            /**
             * Constructs a new UninterpretedOption.
             * @classdesc in them.
             * @exports google.protobuf.UninterpretedOption
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function UninterpretedOption(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * UninterpretedOption name.
             * @type {Array.<google.protobuf.UninterpretedOption.NamePart>}
             */
            UninterpretedOption.prototype.name = $util.emptyArray;

            /**
             * identified it as during parsing. Exactly one of these should be set.
             * @type {string}
             */
            UninterpretedOption.prototype.identifierValue = "";

            /**
             * UninterpretedOption positiveIntValue.
             * @type {number|$protobuf.Long}
             */
            UninterpretedOption.prototype.positiveIntValue = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * UninterpretedOption negativeIntValue.
             * @type {number|$protobuf.Long}
             */
            UninterpretedOption.prototype.negativeIntValue = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * UninterpretedOption doubleValue.
             * @type {number}
             */
            UninterpretedOption.prototype.doubleValue = 0;

            /**
             * UninterpretedOption stringValue.
             * @type {Uint8Array}
             */
            UninterpretedOption.prototype.stringValue = $util.newBuffer([]);

            /**
             * UninterpretedOption aggregateValue.
             * @type {string}
             */
            UninterpretedOption.prototype.aggregateValue = "";

            // Lazily resolved type references
            var $types = {
                0: "google.protobuf.UninterpretedOption.NamePart"
            }; $lazyTypes.push($types);

            /**
             * Creates a new UninterpretedOption instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.UninterpretedOption} UninterpretedOption instance
             */
            UninterpretedOption.create = function create(properties) {
                return new UninterpretedOption(properties);
            };

            /**
             * Encodes the specified UninterpretedOption message.
             * @param {google.protobuf.UninterpretedOption|Object} message UninterpretedOption message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UninterpretedOption.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name !== undefined && message.hasOwnProperty("name"))
                    for (var i = 0; i < message.name.length; ++i)
                        $types[0].encode(message.name[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.identifierValue !== undefined && message.hasOwnProperty("identifierValue"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.identifierValue);
                if (message.positiveIntValue !== undefined && message.positiveIntValue !== null && message.hasOwnProperty("positiveIntValue"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.positiveIntValue);
                if (message.negativeIntValue !== undefined && message.negativeIntValue !== null && message.hasOwnProperty("negativeIntValue"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int64(message.negativeIntValue);
                if (message.doubleValue !== undefined && message.hasOwnProperty("doubleValue"))
                    writer.uint32(/* id 6, wireType 1 =*/49).double(message.doubleValue);
                if (message.stringValue && message.hasOwnProperty("stringValue"))
                    writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.stringValue);
                if (message.aggregateValue !== undefined && message.hasOwnProperty("aggregateValue"))
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.aggregateValue);
                return writer;
            };

            /**
             * Encodes the specified UninterpretedOption message, length delimited.
             * @param {google.protobuf.UninterpretedOption|Object} message UninterpretedOption message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UninterpretedOption.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an UninterpretedOption message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.UninterpretedOption} UninterpretedOption
             */
            UninterpretedOption.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.UninterpretedOption();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 2:
                        if (!(message.name && message.name.length))
                            message.name = [];
                        message.name.push($types[0].decode(reader, reader.uint32()));
                        break;
                    case 3:
                        message.identifierValue = reader.string();
                        break;
                    case 4:
                        message.positiveIntValue = reader.uint64();
                        break;
                    case 5:
                        message.negativeIntValue = reader.int64();
                        break;
                    case 6:
                        message.doubleValue = reader.double();
                        break;
                    case 7:
                        message.stringValue = reader.bytes();
                        break;
                    case 8:
                        message.aggregateValue = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an UninterpretedOption message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.UninterpretedOption} UninterpretedOption
             */
            UninterpretedOption.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an UninterpretedOption message.
             * @param {google.protobuf.UninterpretedOption|Object} message UninterpretedOption message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            UninterpretedOption.verify = function verify(message) {
                if (message.name !== undefined) {
                    if (!Array.isArray(message.name))
                        return "name: array expected";
                    for (var i = 0; i < message.name.length; ++i) {
                        var error = $types[0].verify(message.name[i]);
                        if (error)
                            return "name." + error;
                    }
                }
                if (message.identifierValue !== undefined)
                    if (!$util.isString(message.identifierValue))
                        return "identifierValue: string expected";
                if (message.positiveIntValue !== undefined)
                    if (!$util.isInteger(message.positiveIntValue) && !(message.positiveIntValue && $util.isInteger(message.positiveIntValue.low) && $util.isInteger(message.positiveIntValue.high)))
                        return "positiveIntValue: integer|Long expected";
                if (message.negativeIntValue !== undefined)
                    if (!$util.isInteger(message.negativeIntValue) && !(message.negativeIntValue && $util.isInteger(message.negativeIntValue.low) && $util.isInteger(message.negativeIntValue.high)))
                        return "negativeIntValue: integer|Long expected";
                if (message.doubleValue !== undefined)
                    if (typeof message.doubleValue !== "number")
                        return "doubleValue: number expected";
                if (message.stringValue !== undefined)
                    if (!(message.stringValue && typeof message.stringValue.length === "number" || $util.isString(message.stringValue)))
                        return "stringValue: buffer expected";
                if (message.aggregateValue !== undefined)
                    if (!$util.isString(message.aggregateValue))
                        return "aggregateValue: string expected";
                return null;
            };

            /**
             * Creates an UninterpretedOption message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.UninterpretedOption} UninterpretedOption
             */
            UninterpretedOption.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.UninterpretedOption)
                    return object;
                var message = new $root.google.protobuf.UninterpretedOption();
                if (object.name) {
                    if (!Array.isArray(object.name))
                        throw TypeError(".google.protobuf.UninterpretedOption.name: array expected");
                    message.name = [];
                    for (var i = 0; i < object.name.length; ++i) {
                        if (typeof object.name[i] !== "object")
                            throw TypeError(".google.protobuf.UninterpretedOption.name: object expected");
                        message.name[i] = $types[0].fromObject(object.name[i]);
                    }
                }
                if (object.identifierValue !== undefined && object.identifierValue !== null)
                    message.identifierValue = String(object.identifierValue);
                if (object.positiveIntValue !== undefined && object.positiveIntValue !== null)
                    if ($util.Long)
                        (message.positiveIntValue = $util.Long.fromValue(object.positiveIntValue)).unsigned = true;
                    else if (typeof object.positiveIntValue === "string")
                        message.positiveIntValue = parseInt(object.positiveIntValue, 10);
                    else if (typeof object.positiveIntValue === "number")
                        message.positiveIntValue = object.positiveIntValue;
                    else if (typeof object.positiveIntValue === "object")
                        message.positiveIntValue = new $util.LongBits(object.positiveIntValue.low, object.positiveIntValue.high).toNumber(true);
                if (object.negativeIntValue !== undefined && object.negativeIntValue !== null)
                    if ($util.Long)
                        (message.negativeIntValue = $util.Long.fromValue(object.negativeIntValue)).unsigned = false;
                    else if (typeof object.negativeIntValue === "string")
                        message.negativeIntValue = parseInt(object.negativeIntValue, 10);
                    else if (typeof object.negativeIntValue === "number")
                        message.negativeIntValue = object.negativeIntValue;
                    else if (typeof object.negativeIntValue === "object")
                        message.negativeIntValue = new $util.LongBits(object.negativeIntValue.low, object.negativeIntValue.high).toNumber();
                if (object.doubleValue !== undefined && object.doubleValue !== null)
                    message.doubleValue = Number(object.doubleValue);
                if (object.stringValue !== undefined && object.stringValue !== null)
                    if (typeof object.stringValue === "string")
                        $util.base64.decode(object.stringValue, message.stringValue = $util.newBuffer($util.base64.length(object.stringValue)), 0);
                    else if (object.stringValue.length)
                        message.stringValue = object.stringValue;
                if (object.aggregateValue !== undefined && object.aggregateValue !== null)
                    message.aggregateValue = String(object.aggregateValue);
                return message;
            };

            /**
             * Creates an UninterpretedOption message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.UninterpretedOption.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.UninterpretedOption} UninterpretedOption
             */
            UninterpretedOption.from = UninterpretedOption.fromObject;

            /**
             * Creates a plain object from an UninterpretedOption message. Also converts values to other types if specified.
             * @param {google.protobuf.UninterpretedOption} message UninterpretedOption
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UninterpretedOption.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.name = [];
                if (options.defaults) {
                    object.identifierValue = "";
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.positiveIntValue = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.positiveIntValue = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.negativeIntValue = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.negativeIntValue = options.longs === String ? "0" : 0;
                    object.doubleValue = 0;
                    object.stringValue = options.bytes === String ? "" : [];
                    object.aggregateValue = "";
                }
                if (message.name !== undefined && message.name !== null && message.hasOwnProperty("name")) {
                    object.name = [];
                    for (var j = 0; j < message.name.length; ++j)
                        object.name[j] = $types[0].toObject(message.name[j], options);
                }
                if (message.identifierValue !== undefined && message.identifierValue !== null && message.hasOwnProperty("identifierValue"))
                    object.identifierValue = message.identifierValue;
                if (message.positiveIntValue !== undefined && message.positiveIntValue !== null && message.hasOwnProperty("positiveIntValue"))
                    if (typeof message.positiveIntValue === "number")
                        object.positiveIntValue = options.longs === String ? String(message.positiveIntValue) : message.positiveIntValue;
                    else
                        object.positiveIntValue = options.longs === String ? $util.Long.prototype.toString.call(message.positiveIntValue) : options.longs === Number ? new $util.LongBits(message.positiveIntValue.low, message.positiveIntValue.high).toNumber(true) : message.positiveIntValue;
                if (message.negativeIntValue !== undefined && message.negativeIntValue !== null && message.hasOwnProperty("negativeIntValue"))
                    if (typeof message.negativeIntValue === "number")
                        object.negativeIntValue = options.longs === String ? String(message.negativeIntValue) : message.negativeIntValue;
                    else
                        object.negativeIntValue = options.longs === String ? $util.Long.prototype.toString.call(message.negativeIntValue) : options.longs === Number ? new $util.LongBits(message.negativeIntValue.low, message.negativeIntValue.high).toNumber() : message.negativeIntValue;
                if (message.doubleValue !== undefined && message.doubleValue !== null && message.hasOwnProperty("doubleValue"))
                    object.doubleValue = message.doubleValue;
                if (message.stringValue !== undefined && message.stringValue !== null && message.hasOwnProperty("stringValue"))
                    object.stringValue = options.bytes === String ? $util.base64.encode(message.stringValue, 0, message.stringValue.length) : options.bytes === Array ? Array.prototype.slice.call(message.stringValue) : message.stringValue;
                if (message.aggregateValue !== undefined && message.aggregateValue !== null && message.hasOwnProperty("aggregateValue"))
                    object.aggregateValue = message.aggregateValue;
                return object;
            };

            /**
             * Creates a plain object from this UninterpretedOption message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UninterpretedOption.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this UninterpretedOption to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            UninterpretedOption.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            UninterpretedOption.NamePart = (function() {

                /**
                 * Constructs a new NamePart.
                 * @classdesc "foo.(bar.baz).qux".
                 * @exports google.protobuf.UninterpretedOption.NamePart
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function NamePart(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * NamePart namePart.
                 * @type {string}
                 */
                NamePart.prototype.namePart = "";

                /**
                 * NamePart isExtension.
                 * @type {boolean}
                 */
                NamePart.prototype.isExtension = false;

                /**
                 * Creates a new NamePart instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {google.protobuf.UninterpretedOption.NamePart} NamePart instance
                 */
                NamePart.create = function create(properties) {
                    return new NamePart(properties);
                };

                /**
                 * Encodes the specified NamePart message.
                 * @param {google.protobuf.UninterpretedOption.NamePart|Object} message NamePart message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                NamePart.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.namePart);
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isExtension);
                    return writer;
                };

                /**
                 * Encodes the specified NamePart message, length delimited.
                 * @param {google.protobuf.UninterpretedOption.NamePart|Object} message NamePart message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                NamePart.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a NamePart message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.UninterpretedOption.NamePart} NamePart
                 */
                NamePart.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.UninterpretedOption.NamePart();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.namePart = reader.string();
                            break;
                        case 2:
                            message.isExtension = reader.bool();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a NamePart message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.UninterpretedOption.NamePart} NamePart
                 */
                NamePart.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a NamePart message.
                 * @param {google.protobuf.UninterpretedOption.NamePart|Object} message NamePart message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                NamePart.verify = function verify(message) {
                    if (!$util.isString(message.namePart))
                        return "namePart: string expected";
                    if (typeof message.isExtension !== "boolean")
                        return "isExtension: boolean expected";
                    return null;
                };

                /**
                 * Creates a NamePart message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.UninterpretedOption.NamePart} NamePart
                 */
                NamePart.fromObject = function fromObject(object) {
                    if (object instanceof $root.google.protobuf.UninterpretedOption.NamePart)
                        return object;
                    var message = new $root.google.protobuf.UninterpretedOption.NamePart();
                    if (object.namePart !== undefined && object.namePart !== null)
                        message.namePart = String(object.namePart);
                    if (object.isExtension !== undefined && object.isExtension !== null)
                        message.isExtension = Boolean(object.isExtension);
                    return message;
                };

                /**
                 * Creates a NamePart message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link google.protobuf.UninterpretedOption.NamePart.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.UninterpretedOption.NamePart} NamePart
                 */
                NamePart.from = NamePart.fromObject;

                /**
                 * Creates a plain object from a NamePart message. Also converts values to other types if specified.
                 * @param {google.protobuf.UninterpretedOption.NamePart} message NamePart
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                NamePart.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.namePart = "";
                        object.isExtension = false;
                    }
                    if (message.namePart !== undefined && message.namePart !== null && message.hasOwnProperty("namePart"))
                        object.namePart = message.namePart;
                    if (message.isExtension !== undefined && message.isExtension !== null && message.hasOwnProperty("isExtension"))
                        object.isExtension = message.isExtension;
                    return object;
                };

                /**
                 * Creates a plain object from this NamePart message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                NamePart.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this NamePart to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                NamePart.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return NamePart;
            })();

            return UninterpretedOption;
        })();

        protobuf.SourceCodeInfo = (function() {

            /**
             * Constructs a new SourceCodeInfo.
             * @classdesc FileDescriptorProto was generated.
             * @exports google.protobuf.SourceCodeInfo
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function SourceCodeInfo(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * be recorded in the future.
             * @type {Array.<google.protobuf.SourceCodeInfo.Location>}
             */
            SourceCodeInfo.prototype.location = $util.emptyArray;

            // Lazily resolved type references
            var $types = {
                0: "google.protobuf.SourceCodeInfo.Location"
            }; $lazyTypes.push($types);

            /**
             * Creates a new SourceCodeInfo instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.SourceCodeInfo} SourceCodeInfo instance
             */
            SourceCodeInfo.create = function create(properties) {
                return new SourceCodeInfo(properties);
            };

            /**
             * Encodes the specified SourceCodeInfo message.
             * @param {google.protobuf.SourceCodeInfo|Object} message SourceCodeInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SourceCodeInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.location !== undefined && message.hasOwnProperty("location"))
                    for (var i = 0; i < message.location.length; ++i)
                        $types[0].encode(message.location[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified SourceCodeInfo message, length delimited.
             * @param {google.protobuf.SourceCodeInfo|Object} message SourceCodeInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SourceCodeInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SourceCodeInfo message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.SourceCodeInfo} SourceCodeInfo
             */
            SourceCodeInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.SourceCodeInfo();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.location && message.location.length))
                            message.location = [];
                        message.location.push($types[0].decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SourceCodeInfo message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.SourceCodeInfo} SourceCodeInfo
             */
            SourceCodeInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SourceCodeInfo message.
             * @param {google.protobuf.SourceCodeInfo|Object} message SourceCodeInfo message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            SourceCodeInfo.verify = function verify(message) {
                if (message.location !== undefined) {
                    if (!Array.isArray(message.location))
                        return "location: array expected";
                    for (var i = 0; i < message.location.length; ++i) {
                        var error = $types[0].verify(message.location[i]);
                        if (error)
                            return "location." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a SourceCodeInfo message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.SourceCodeInfo} SourceCodeInfo
             */
            SourceCodeInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.SourceCodeInfo)
                    return object;
                var message = new $root.google.protobuf.SourceCodeInfo();
                if (object.location) {
                    if (!Array.isArray(object.location))
                        throw TypeError(".google.protobuf.SourceCodeInfo.location: array expected");
                    message.location = [];
                    for (var i = 0; i < object.location.length; ++i) {
                        if (typeof object.location[i] !== "object")
                            throw TypeError(".google.protobuf.SourceCodeInfo.location: object expected");
                        message.location[i] = $types[0].fromObject(object.location[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a SourceCodeInfo message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.SourceCodeInfo.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.SourceCodeInfo} SourceCodeInfo
             */
            SourceCodeInfo.from = SourceCodeInfo.fromObject;

            /**
             * Creates a plain object from a SourceCodeInfo message. Also converts values to other types if specified.
             * @param {google.protobuf.SourceCodeInfo} message SourceCodeInfo
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SourceCodeInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.location = [];
                if (message.location !== undefined && message.location !== null && message.hasOwnProperty("location")) {
                    object.location = [];
                    for (var j = 0; j < message.location.length; ++j)
                        object.location[j] = $types[0].toObject(message.location[j], options);
                }
                return object;
            };

            /**
             * Creates a plain object from this SourceCodeInfo message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SourceCodeInfo.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this SourceCodeInfo to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            SourceCodeInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            SourceCodeInfo.Location = (function() {

                /**
                 * Constructs a new Location.
                 * @exports google.protobuf.SourceCodeInfo.Location
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function Location(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * of the label to the terminating semicolon).
                 * @type {Array.<number>}
                 */
                Location.prototype.path = $util.emptyArray;

                /**
                 * 1 to each before displaying to a user.
                 * @type {Array.<number>}
                 */
                Location.prototype.span = $util.emptyArray;

                /**
                 * ignored detached comments.
                 * @type {string}
                 */
                Location.prototype.leadingComments = "";

                /**
                 * Location trailingComments.
                 * @type {string}
                 */
                Location.prototype.trailingComments = "";

                /**
                 * Location leadingDetachedComments.
                 * @type {Array.<string>}
                 */
                Location.prototype.leadingDetachedComments = $util.emptyArray;

                /**
                 * Creates a new Location instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {google.protobuf.SourceCodeInfo.Location} Location instance
                 */
                Location.create = function create(properties) {
                    return new Location(properties);
                };

                /**
                 * Encodes the specified Location message.
                 * @param {google.protobuf.SourceCodeInfo.Location|Object} message Location message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Location.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.path && message.path.length && message.hasOwnProperty("path")) {
                        writer.uint32(/* id 1, wireType 2 =*/10).fork();
                        for (var i = 0; i < message.path.length; ++i)
                            writer.int32(message.path[i]);
                        writer.ldelim();
                    }
                    if (message.span && message.span.length && message.hasOwnProperty("span")) {
                        writer.uint32(/* id 2, wireType 2 =*/18).fork();
                        for (var i = 0; i < message.span.length; ++i)
                            writer.int32(message.span[i]);
                        writer.ldelim();
                    }
                    if (message.leadingComments !== undefined && message.hasOwnProperty("leadingComments"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.leadingComments);
                    if (message.trailingComments !== undefined && message.hasOwnProperty("trailingComments"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.trailingComments);
                    if (message.leadingDetachedComments !== undefined && message.hasOwnProperty("leadingDetachedComments"))
                        for (var i = 0; i < message.leadingDetachedComments.length; ++i)
                            writer.uint32(/* id 6, wireType 2 =*/50).string(message.leadingDetachedComments[i]);
                    return writer;
                };

                /**
                 * Encodes the specified Location message, length delimited.
                 * @param {google.protobuf.SourceCodeInfo.Location|Object} message Location message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Location.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Location message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.SourceCodeInfo.Location} Location
                 */
                Location.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.SourceCodeInfo.Location();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            if (!(message.path && message.path.length))
                                message.path = [];
                            if ((tag & 7) === 2) {
                                var end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.path.push(reader.int32());
                            } else
                                message.path.push(reader.int32());
                            break;
                        case 2:
                            if (!(message.span && message.span.length))
                                message.span = [];
                            if ((tag & 7) === 2) {
                                var end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.span.push(reader.int32());
                            } else
                                message.span.push(reader.int32());
                            break;
                        case 3:
                            message.leadingComments = reader.string();
                            break;
                        case 4:
                            message.trailingComments = reader.string();
                            break;
                        case 6:
                            if (!(message.leadingDetachedComments && message.leadingDetachedComments.length))
                                message.leadingDetachedComments = [];
                            message.leadingDetachedComments.push(reader.string());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Location message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.SourceCodeInfo.Location} Location
                 */
                Location.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Location message.
                 * @param {google.protobuf.SourceCodeInfo.Location|Object} message Location message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                Location.verify = function verify(message) {
                    if (message.path !== undefined) {
                        if (!Array.isArray(message.path))
                            return "path: array expected";
                        for (var i = 0; i < message.path.length; ++i)
                            if (!$util.isInteger(message.path[i]))
                                return "path: integer[] expected";
                    }
                    if (message.span !== undefined) {
                        if (!Array.isArray(message.span))
                            return "span: array expected";
                        for (var i = 0; i < message.span.length; ++i)
                            if (!$util.isInteger(message.span[i]))
                                return "span: integer[] expected";
                    }
                    if (message.leadingComments !== undefined)
                        if (!$util.isString(message.leadingComments))
                            return "leadingComments: string expected";
                    if (message.trailingComments !== undefined)
                        if (!$util.isString(message.trailingComments))
                            return "trailingComments: string expected";
                    if (message.leadingDetachedComments !== undefined) {
                        if (!Array.isArray(message.leadingDetachedComments))
                            return "leadingDetachedComments: array expected";
                        for (var i = 0; i < message.leadingDetachedComments.length; ++i)
                            if (!$util.isString(message.leadingDetachedComments[i]))
                                return "leadingDetachedComments: string[] expected";
                    }
                    return null;
                };

                /**
                 * Creates a Location message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.SourceCodeInfo.Location} Location
                 */
                Location.fromObject = function fromObject(object) {
                    if (object instanceof $root.google.protobuf.SourceCodeInfo.Location)
                        return object;
                    var message = new $root.google.protobuf.SourceCodeInfo.Location();
                    if (object.path) {
                        if (!Array.isArray(object.path))
                            throw TypeError(".google.protobuf.SourceCodeInfo.Location.path: array expected");
                        message.path = [];
                        for (var i = 0; i < object.path.length; ++i)
                            message.path[i] = object.path[i] | 0;
                    }
                    if (object.span) {
                        if (!Array.isArray(object.span))
                            throw TypeError(".google.protobuf.SourceCodeInfo.Location.span: array expected");
                        message.span = [];
                        for (var i = 0; i < object.span.length; ++i)
                            message.span[i] = object.span[i] | 0;
                    }
                    if (object.leadingComments !== undefined && object.leadingComments !== null)
                        message.leadingComments = String(object.leadingComments);
                    if (object.trailingComments !== undefined && object.trailingComments !== null)
                        message.trailingComments = String(object.trailingComments);
                    if (object.leadingDetachedComments) {
                        if (!Array.isArray(object.leadingDetachedComments))
                            throw TypeError(".google.protobuf.SourceCodeInfo.Location.leadingDetachedComments: array expected");
                        message.leadingDetachedComments = [];
                        for (var i = 0; i < object.leadingDetachedComments.length; ++i)
                            message.leadingDetachedComments[i] = String(object.leadingDetachedComments[i]);
                    }
                    return message;
                };

                /**
                 * Creates a Location message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link google.protobuf.SourceCodeInfo.Location.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.SourceCodeInfo.Location} Location
                 */
                Location.from = Location.fromObject;

                /**
                 * Creates a plain object from a Location message. Also converts values to other types if specified.
                 * @param {google.protobuf.SourceCodeInfo.Location} message Location
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Location.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object.path = [];
                        object.span = [];
                        object.leadingDetachedComments = [];
                    }
                    if (options.defaults) {
                        object.leadingComments = "";
                        object.trailingComments = "";
                    }
                    if (message.path !== undefined && message.path !== null && message.hasOwnProperty("path")) {
                        object.path = [];
                        for (var j = 0; j < message.path.length; ++j)
                            object.path[j] = message.path[j];
                    }
                    if (message.span !== undefined && message.span !== null && message.hasOwnProperty("span")) {
                        object.span = [];
                        for (var j = 0; j < message.span.length; ++j)
                            object.span[j] = message.span[j];
                    }
                    if (message.leadingComments !== undefined && message.leadingComments !== null && message.hasOwnProperty("leadingComments"))
                        object.leadingComments = message.leadingComments;
                    if (message.trailingComments !== undefined && message.trailingComments !== null && message.hasOwnProperty("trailingComments"))
                        object.trailingComments = message.trailingComments;
                    if (message.leadingDetachedComments !== undefined && message.leadingDetachedComments !== null && message.hasOwnProperty("leadingDetachedComments")) {
                        object.leadingDetachedComments = [];
                        for (var j = 0; j < message.leadingDetachedComments.length; ++j)
                            object.leadingDetachedComments[j] = message.leadingDetachedComments[j];
                    }
                    return object;
                };

                /**
                 * Creates a plain object from this Location message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Location.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this Location to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                Location.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Location;
            })();

            return SourceCodeInfo;
        })();

        protobuf.GeneratedCodeInfo = (function() {

            /**
             * Constructs a new GeneratedCodeInfo.
             * @classdesc source file, but may contain references to different source .proto files.
             * @exports google.protobuf.GeneratedCodeInfo
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function GeneratedCodeInfo(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * of its generating .proto file.
             * @type {Array.<google.protobuf.GeneratedCodeInfo.Annotation>}
             */
            GeneratedCodeInfo.prototype.annotation = $util.emptyArray;

            // Lazily resolved type references
            var $types = {
                0: "google.protobuf.GeneratedCodeInfo.Annotation"
            }; $lazyTypes.push($types);

            /**
             * Creates a new GeneratedCodeInfo instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.GeneratedCodeInfo} GeneratedCodeInfo instance
             */
            GeneratedCodeInfo.create = function create(properties) {
                return new GeneratedCodeInfo(properties);
            };

            /**
             * Encodes the specified GeneratedCodeInfo message.
             * @param {google.protobuf.GeneratedCodeInfo|Object} message GeneratedCodeInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GeneratedCodeInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.annotation !== undefined && message.hasOwnProperty("annotation"))
                    for (var i = 0; i < message.annotation.length; ++i)
                        $types[0].encode(message.annotation[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GeneratedCodeInfo message, length delimited.
             * @param {google.protobuf.GeneratedCodeInfo|Object} message GeneratedCodeInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GeneratedCodeInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GeneratedCodeInfo message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.GeneratedCodeInfo} GeneratedCodeInfo
             */
            GeneratedCodeInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.GeneratedCodeInfo();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.annotation && message.annotation.length))
                            message.annotation = [];
                        message.annotation.push($types[0].decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a GeneratedCodeInfo message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.GeneratedCodeInfo} GeneratedCodeInfo
             */
            GeneratedCodeInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GeneratedCodeInfo message.
             * @param {google.protobuf.GeneratedCodeInfo|Object} message GeneratedCodeInfo message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            GeneratedCodeInfo.verify = function verify(message) {
                if (message.annotation !== undefined) {
                    if (!Array.isArray(message.annotation))
                        return "annotation: array expected";
                    for (var i = 0; i < message.annotation.length; ++i) {
                        var error = $types[0].verify(message.annotation[i]);
                        if (error)
                            return "annotation." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a GeneratedCodeInfo message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.GeneratedCodeInfo} GeneratedCodeInfo
             */
            GeneratedCodeInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.GeneratedCodeInfo)
                    return object;
                var message = new $root.google.protobuf.GeneratedCodeInfo();
                if (object.annotation) {
                    if (!Array.isArray(object.annotation))
                        throw TypeError(".google.protobuf.GeneratedCodeInfo.annotation: array expected");
                    message.annotation = [];
                    for (var i = 0; i < object.annotation.length; ++i) {
                        if (typeof object.annotation[i] !== "object")
                            throw TypeError(".google.protobuf.GeneratedCodeInfo.annotation: object expected");
                        message.annotation[i] = $types[0].fromObject(object.annotation[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a GeneratedCodeInfo message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.GeneratedCodeInfo.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.GeneratedCodeInfo} GeneratedCodeInfo
             */
            GeneratedCodeInfo.from = GeneratedCodeInfo.fromObject;

            /**
             * Creates a plain object from a GeneratedCodeInfo message. Also converts values to other types if specified.
             * @param {google.protobuf.GeneratedCodeInfo} message GeneratedCodeInfo
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GeneratedCodeInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.annotation = [];
                if (message.annotation !== undefined && message.annotation !== null && message.hasOwnProperty("annotation")) {
                    object.annotation = [];
                    for (var j = 0; j < message.annotation.length; ++j)
                        object.annotation[j] = $types[0].toObject(message.annotation[j], options);
                }
                return object;
            };

            /**
             * Creates a plain object from this GeneratedCodeInfo message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GeneratedCodeInfo.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this GeneratedCodeInfo to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            GeneratedCodeInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            GeneratedCodeInfo.Annotation = (function() {

                /**
                 * Constructs a new Annotation.
                 * @exports google.protobuf.GeneratedCodeInfo.Annotation
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function Annotation(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }

                /**
                 * is formatted the same as SourceCodeInfo.Location.path.
                 * @type {Array.<number>}
                 */
                Annotation.prototype.path = $util.emptyArray;

                /**
                 * Identifies the filesystem path to the original source .proto.
                 * @type {string}
                 */
                Annotation.prototype.sourceFile = "";

                /**
                 * that relates to the identified object.
                 * @type {number}
                 */
                Annotation.prototype.begin = 0;

                /**
                 * the last relevant byte (so the length of the text = end - begin).
                 * @type {number}
                 */
                Annotation.prototype.end = 0;

                /**
                 * Creates a new Annotation instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {google.protobuf.GeneratedCodeInfo.Annotation} Annotation instance
                 */
                Annotation.create = function create(properties) {
                    return new Annotation(properties);
                };

                /**
                 * Encodes the specified Annotation message.
                 * @param {google.protobuf.GeneratedCodeInfo.Annotation|Object} message Annotation message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Annotation.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.path && message.path.length && message.hasOwnProperty("path")) {
                        writer.uint32(/* id 1, wireType 2 =*/10).fork();
                        for (var i = 0; i < message.path.length; ++i)
                            writer.int32(message.path[i]);
                        writer.ldelim();
                    }
                    if (message.sourceFile !== undefined && message.hasOwnProperty("sourceFile"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.sourceFile);
                    if (message.begin !== undefined && message.hasOwnProperty("begin"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.begin);
                    if (message.end !== undefined && message.hasOwnProperty("end"))
                        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.end);
                    return writer;
                };

                /**
                 * Encodes the specified Annotation message, length delimited.
                 * @param {google.protobuf.GeneratedCodeInfo.Annotation|Object} message Annotation message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Annotation.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an Annotation message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.GeneratedCodeInfo.Annotation} Annotation
                 */
                Annotation.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.GeneratedCodeInfo.Annotation();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            if (!(message.path && message.path.length))
                                message.path = [];
                            if ((tag & 7) === 2) {
                                var end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.path.push(reader.int32());
                            } else
                                message.path.push(reader.int32());
                            break;
                        case 2:
                            message.sourceFile = reader.string();
                            break;
                        case 3:
                            message.begin = reader.int32();
                            break;
                        case 4:
                            message.end = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an Annotation message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.GeneratedCodeInfo.Annotation} Annotation
                 */
                Annotation.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an Annotation message.
                 * @param {google.protobuf.GeneratedCodeInfo.Annotation|Object} message Annotation message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                Annotation.verify = function verify(message) {
                    if (message.path !== undefined) {
                        if (!Array.isArray(message.path))
                            return "path: array expected";
                        for (var i = 0; i < message.path.length; ++i)
                            if (!$util.isInteger(message.path[i]))
                                return "path: integer[] expected";
                    }
                    if (message.sourceFile !== undefined)
                        if (!$util.isString(message.sourceFile))
                            return "sourceFile: string expected";
                    if (message.begin !== undefined)
                        if (!$util.isInteger(message.begin))
                            return "begin: integer expected";
                    if (message.end !== undefined)
                        if (!$util.isInteger(message.end))
                            return "end: integer expected";
                    return null;
                };

                /**
                 * Creates an Annotation message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.GeneratedCodeInfo.Annotation} Annotation
                 */
                Annotation.fromObject = function fromObject(object) {
                    if (object instanceof $root.google.protobuf.GeneratedCodeInfo.Annotation)
                        return object;
                    var message = new $root.google.protobuf.GeneratedCodeInfo.Annotation();
                    if (object.path) {
                        if (!Array.isArray(object.path))
                            throw TypeError(".google.protobuf.GeneratedCodeInfo.Annotation.path: array expected");
                        message.path = [];
                        for (var i = 0; i < object.path.length; ++i)
                            message.path[i] = object.path[i] | 0;
                    }
                    if (object.sourceFile !== undefined && object.sourceFile !== null)
                        message.sourceFile = String(object.sourceFile);
                    if (object.begin !== undefined && object.begin !== null)
                        message.begin = object.begin | 0;
                    if (object.end !== undefined && object.end !== null)
                        message.end = object.end | 0;
                    return message;
                };

                /**
                 * Creates an Annotation message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link google.protobuf.GeneratedCodeInfo.Annotation.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.GeneratedCodeInfo.Annotation} Annotation
                 */
                Annotation.from = Annotation.fromObject;

                /**
                 * Creates a plain object from an Annotation message. Also converts values to other types if specified.
                 * @param {google.protobuf.GeneratedCodeInfo.Annotation} message Annotation
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Annotation.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.path = [];
                    if (options.defaults) {
                        object.sourceFile = "";
                        object.begin = 0;
                        object.end = 0;
                    }
                    if (message.path !== undefined && message.path !== null && message.hasOwnProperty("path")) {
                        object.path = [];
                        for (var j = 0; j < message.path.length; ++j)
                            object.path[j] = message.path[j];
                    }
                    if (message.sourceFile !== undefined && message.sourceFile !== null && message.hasOwnProperty("sourceFile"))
                        object.sourceFile = message.sourceFile;
                    if (message.begin !== undefined && message.begin !== null && message.hasOwnProperty("begin"))
                        object.begin = message.begin;
                    if (message.end !== undefined && message.end !== null && message.hasOwnProperty("end"))
                        object.end = message.end;
                    return object;
                };

                /**
                 * Creates a plain object from this Annotation message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Annotation.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this Annotation to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                Annotation.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Annotation;
            })();

            return GeneratedCodeInfo;
        })();

        protobuf.Empty = (function() {

            /**
             * Constructs a new Empty.
             * @exports google.protobuf.Empty
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function Empty(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new Empty instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.Empty} Empty instance
             */
            Empty.create = function create(properties) {
                return new Empty(properties);
            };

            /**
             * Encodes the specified Empty message.
             * @param {google.protobuf.Empty|Object} message Empty message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Empty.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified Empty message, length delimited.
             * @param {google.protobuf.Empty|Object} message Empty message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Empty.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Empty message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Empty} Empty
             */
            Empty.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Empty();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Empty message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Empty} Empty
             */
            Empty.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Empty message.
             * @param {google.protobuf.Empty|Object} message Empty message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            Empty.verify = function verify() {
                return null;
            };

            /**
             * Creates an Empty message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Empty} Empty
             */
            Empty.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Empty)
                    return object;
                return new $root.google.protobuf.Empty();
            };

            /**
             * Creates an Empty message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.Empty.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Empty} Empty
             */
            Empty.from = Empty.fromObject;

            /**
             * Creates a plain object from an Empty message. Also converts values to other types if specified.
             * @param {google.protobuf.Empty} message Empty
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Empty.toObject = function toObject() {
                return {};
            };

            /**
             * Creates a plain object from this Empty message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Empty.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this Empty to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            Empty.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Empty;
        })();

        protobuf.Struct = (function() {

            /**
             * Constructs a new Struct.
             * @exports google.protobuf.Struct
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function Struct(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * Struct fields.
             * @type {Object.<string,google.protobuf.Value>}
             */
            Struct.prototype.fields = $util.emptyObject;

            // Lazily resolved type references
            var $types = {
                0: "google.protobuf.Value"
            }; $lazyTypes.push($types);

            /**
             * Creates a new Struct instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.Struct} Struct instance
             */
            Struct.create = function create(properties) {
                return new Struct(properties);
            };

            /**
             * Encodes the specified Struct message.
             * @param {google.protobuf.Struct|Object} message Struct message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Struct.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.fields && message.hasOwnProperty("fields"))
                    for (var keys = Object.keys(message.fields), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $types[0].encode(message.fields[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                return writer;
            };

            /**
             * Encodes the specified Struct message, length delimited.
             * @param {google.protobuf.Struct|Object} message Struct message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Struct.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Struct message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Struct} Struct
             */
            Struct.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Struct();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        reader.skip().pos++;
                        if (message.fields === $util.emptyObject)
                            message.fields = {};
                        var key = reader.string();
                        reader.pos++;
                        message.fields[typeof key === "object" ? $util.longToHash(key) : key] = $types[0].decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Struct message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Struct} Struct
             */
            Struct.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Struct message.
             * @param {google.protobuf.Struct|Object} message Struct message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            Struct.verify = function verify(message) {
                if (message.fields !== undefined) {
                    if (!$util.isObject(message.fields))
                        return "fields: object expected";
                    var key = Object.keys(message.fields);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $types[0].verify(message.fields[key[i]]);
                        if (error)
                            return "fields." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Struct message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Struct} Struct
             */
            Struct.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Struct)
                    return object;
                var message = new $root.google.protobuf.Struct();
                if (object.fields) {
                    if (typeof object.fields !== "object")
                        throw TypeError(".google.protobuf.Struct.fields: object expected");
                    message.fields = {};
                    for (var keys = Object.keys(object.fields), i = 0; i < keys.length; ++i) {
                        if (typeof object.fields[keys[i]] !== "object")
                            throw TypeError(".google.protobuf.Struct.fields: object expected");
                        message.fields[keys[i]] = $types[0].fromObject(object.fields[keys[i]]);
                    }
                }
                return message;
            };

            /**
             * Creates a Struct message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.Struct.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Struct} Struct
             */
            Struct.from = Struct.fromObject;

            /**
             * Creates a plain object from a Struct message. Also converts values to other types if specified.
             * @param {google.protobuf.Struct} message Struct
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Struct.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.objects || options.defaults)
                    object.fields = {};
                if (message.fields !== undefined && message.fields !== null && message.hasOwnProperty("fields")) {
                    object.fields = {};
                    for (var keys2 = Object.keys(message.fields), j = 0; j < keys2.length; ++j)
                        object.fields[keys2[j]] = $types[0].toObject(message.fields[keys2[j]], options);
                }
                return object;
            };

            /**
             * Creates a plain object from this Struct message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Struct.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this Struct to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            Struct.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Struct;
        })();

        protobuf.Value = (function() {

            /**
             * Constructs a new Value.
             * @exports google.protobuf.Value
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * Value nullValue.
             * @type {number}
             */
            Value.prototype.nullValue = 0;

            /**
             * Value numberValue.
             * @type {number}
             */
            Value.prototype.numberValue = 0;

            /**
             * Value stringValue.
             * @type {string}
             */
            Value.prototype.stringValue = "";

            /**
             * Value boolValue.
             * @type {boolean}
             */
            Value.prototype.boolValue = false;

            /**
             * Value structValue.
             * @type {google.protobuf.Struct}
             */
            Value.prototype.structValue = null;

            /**
             * Value listValue.
             * @type {google.protobuf.ListValue}
             */
            Value.prototype.listValue = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * Value kind.
             * @name google.protobuf.Value#kind
             * @type {string|undefined}
             */
            Object.defineProperty(Value.prototype, "kind", {
                get: $util.oneOfGetter($oneOfFields = ["nullValue", "numberValue", "stringValue", "boolValue", "structValue", "listValue"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            // Lazily resolved type references
            var $types = {
                0: "google.protobuf.NullValue",
                4: "google.protobuf.Struct",
                5: "google.protobuf.ListValue"
            }; $lazyTypes.push($types);

            /**
             * Creates a new Value instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.Value} Value instance
             */
            Value.create = function create(properties) {
                return new Value(properties);
            };

            /**
             * Encodes the specified Value message.
             * @param {google.protobuf.Value|Object} message Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                switch (message.kind) {
                case "nullValue":
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.nullValue);
                    break;
                case "numberValue":
                    writer.uint32(/* id 2, wireType 1 =*/17).double(message.numberValue);
                    break;
                case "stringValue":
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.stringValue);
                    break;
                case "boolValue":
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.boolValue);
                    break;
                case "structValue":
                    $types[4].encode(message.structValue, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                    break;
                case "listValue":
                    $types[5].encode(message.listValue, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                    break;
                }
                return writer;
            };

            /**
             * Encodes the specified Value message, length delimited.
             * @param {google.protobuf.Value|Object} message Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Value message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Value} Value
             */
            Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.nullValue = reader.uint32();
                        break;
                    case 2:
                        message.numberValue = reader.double();
                        break;
                    case 3:
                        message.stringValue = reader.string();
                        break;
                    case 4:
                        message.boolValue = reader.bool();
                        break;
                    case 5:
                        message.structValue = $types[4].decode(reader, reader.uint32());
                        break;
                    case 6:
                        message.listValue = $types[5].decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Value message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Value} Value
             */
            Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Value message.
             * @param {google.protobuf.Value|Object} message Value message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            Value.verify = function verify(message) {
                if (message.nullValue !== undefined)
                    switch (message.nullValue) {
                    default:
                        return "nullValue: enum value expected";
                    case 0:
                        break;
                    }
                if (message.numberValue !== undefined)
                    if (typeof message.numberValue !== "number")
                        return "numberValue: number expected";
                if (message.stringValue !== undefined)
                    if (!$util.isString(message.stringValue))
                        return "stringValue: string expected";
                if (message.boolValue !== undefined)
                    if (typeof message.boolValue !== "boolean")
                        return "boolValue: boolean expected";
                if (message.structValue !== undefined && message.structValue !== null) {
                    var error = $types[4].verify(message.structValue);
                    if (error)
                        return "structValue." + error;
                }
                if (message.listValue !== undefined && message.listValue !== null) {
                    var error = $types[5].verify(message.listValue);
                    if (error)
                        return "listValue." + error;
                }
                return null;
            };

            /**
             * Creates a Value message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Value} Value
             */
            Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Value)
                    return object;
                var message = new $root.google.protobuf.Value();
                switch (object.nullValue) {
                case "NULL_VALUE":
                case 0:
                    message.nullValue = 0;
                    break;
                }
                if (object.numberValue !== undefined && object.numberValue !== null)
                    message.numberValue = Number(object.numberValue);
                if (object.stringValue !== undefined && object.stringValue !== null)
                    message.stringValue = String(object.stringValue);
                if (object.boolValue !== undefined && object.boolValue !== null)
                    message.boolValue = Boolean(object.boolValue);
                if (object.structValue !== undefined && object.structValue !== null) {
                    if (typeof object.structValue !== "object")
                        throw TypeError(".google.protobuf.Value.structValue: object expected");
                    message.structValue = $types[4].fromObject(object.structValue);
                }
                if (object.listValue !== undefined && object.listValue !== null) {
                    if (typeof object.listValue !== "object")
                        throw TypeError(".google.protobuf.Value.listValue: object expected");
                    message.listValue = $types[5].fromObject(object.listValue);
                }
                return message;
            };

            /**
             * Creates a Value message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.Value.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Value} Value
             */
            Value.from = Value.fromObject;

            /**
             * Creates a plain object from a Value message. Also converts values to other types if specified.
             * @param {google.protobuf.Value} message Value
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.nullValue = options.enums === String ? "NULL_VALUE" : 0;
                    object.numberValue = 0;
                    object.stringValue = "";
                    object.boolValue = false;
                    object.structValue = null;
                    object.listValue = null;
                }
                if (message.nullValue !== undefined && message.nullValue !== null && message.hasOwnProperty("nullValue"))
                    object.nullValue = options.enums === String ? $types[0][message.nullValue] : message.nullValue;
                if (message.numberValue !== undefined && message.numberValue !== null && message.hasOwnProperty("numberValue"))
                    object.numberValue = message.numberValue;
                if (message.stringValue !== undefined && message.stringValue !== null && message.hasOwnProperty("stringValue"))
                    object.stringValue = message.stringValue;
                if (message.boolValue !== undefined && message.boolValue !== null && message.hasOwnProperty("boolValue"))
                    object.boolValue = message.boolValue;
                if (message.structValue !== undefined && message.structValue !== null && message.hasOwnProperty("structValue"))
                    object.structValue = $types[4].toObject(message.structValue, options);
                if (message.listValue !== undefined && message.listValue !== null && message.hasOwnProperty("listValue"))
                    object.listValue = $types[5].toObject(message.listValue, options);
                return object;
            };

            /**
             * Creates a plain object from this Value message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Value.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this Value to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Value;
        })();

        /**
         * NullValue enum.
         * @name NullValue
         * @memberof google.protobuf
         * @enum {number}
         * @property {number} NULL_VALUE=0 NULL_VALUE value
         */
        protobuf.NullValue = (function() {
            var valuesById = {},
                values = Object.create(valuesById);
            values[valuesById[0] = "NULL_VALUE"] = 0;
            return values;
        })();

        protobuf.ListValue = (function() {

            /**
             * Constructs a new ListValue.
             * @exports google.protobuf.ListValue
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function ListValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * ListValue values.
             * @type {Array.<google.protobuf.Value>}
             */
            ListValue.prototype.values = $util.emptyArray;

            // Lazily resolved type references
            var $types = {
                0: "google.protobuf.Value"
            }; $lazyTypes.push($types);

            /**
             * Creates a new ListValue instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.ListValue} ListValue instance
             */
            ListValue.create = function create(properties) {
                return new ListValue(properties);
            };

            /**
             * Encodes the specified ListValue message.
             * @param {google.protobuf.ListValue|Object} message ListValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.values !== undefined && message.hasOwnProperty("values"))
                    for (var i = 0; i < message.values.length; ++i)
                        $types[0].encode(message.values[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ListValue message, length delimited.
             * @param {google.protobuf.ListValue|Object} message ListValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ListValue message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.ListValue} ListValue
             */
            ListValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.ListValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.values && message.values.length))
                            message.values = [];
                        message.values.push($types[0].decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a ListValue message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.ListValue} ListValue
             */
            ListValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ListValue message.
             * @param {google.protobuf.ListValue|Object} message ListValue message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            ListValue.verify = function verify(message) {
                if (message.values !== undefined) {
                    if (!Array.isArray(message.values))
                        return "values: array expected";
                    for (var i = 0; i < message.values.length; ++i) {
                        var error = $types[0].verify(message.values[i]);
                        if (error)
                            return "values." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ListValue message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.ListValue} ListValue
             */
            ListValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.ListValue)
                    return object;
                var message = new $root.google.protobuf.ListValue();
                if (object.values) {
                    if (!Array.isArray(object.values))
                        throw TypeError(".google.protobuf.ListValue.values: array expected");
                    message.values = [];
                    for (var i = 0; i < object.values.length; ++i) {
                        if (typeof object.values[i] !== "object")
                            throw TypeError(".google.protobuf.ListValue.values: object expected");
                        message.values[i] = $types[0].fromObject(object.values[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a ListValue message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.ListValue.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.ListValue} ListValue
             */
            ListValue.from = ListValue.fromObject;

            /**
             * Creates a plain object from a ListValue message. Also converts values to other types if specified.
             * @param {google.protobuf.ListValue} message ListValue
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ListValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.values = [];
                if (message.values !== undefined && message.values !== null && message.hasOwnProperty("values")) {
                    object.values = [];
                    for (var j = 0; j < message.values.length; ++j)
                        object.values[j] = $types[0].toObject(message.values[j], options);
                }
                return object;
            };

            /**
             * Creates a plain object from this ListValue message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ListValue.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this ListValue to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            ListValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ListValue;
        })();

        return protobuf;
    })();

    return google;
})();

// Resolve lazy type references to actual types
//$util.lazyResolve($root, $lazyTypes);

module.exports = $root;
