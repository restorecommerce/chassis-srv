const $protobuf = require('protobufjs');
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

// Resolve lazy type references to actual types
$util.lazyResolve($root, $lazyTypes);
