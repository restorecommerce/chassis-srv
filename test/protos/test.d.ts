import * as $protobuf from "protobufjs";

/**
 * Namespace test.
 * @exports test
 * @namespace
 */
export namespace test {

    /**
     * Constructs a new Test service.
     * @exports test.Test
     * @extends $protobuf.rpc.Service
     * @constructor
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     */
    class Test extends $protobuf.rpc.Service {

        /**
         * Constructs a new Test service.
         * @exports test.Test
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new Test service using the specified rpc implementation.
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {Test} RPC service. Useful where requests and/or responses are streamed.
         */
        static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): Test;

        /**
         * Calls Test.
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @param {Test_test_Callback} callback Node-style callback called with the error, if any, and TestResponse
         * @returns {undefined}
         */
        test(request: (test.TestRequest|Object), callback: Test_test_Callback): void;

        /**
         * Calls Throw.
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @param {Test_throw__Callback} callback Node-style callback called with the error, if any, and TestResponse
         * @returns {undefined}
         */
        ["throw"](request: (test.TestRequest|Object), callback: Test_throw__Callback): void;

        /**
         * Calls NotImplemented.
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @param {Test_notImplemented_Callback} callback Node-style callback called with the error, if any, and TestResponse
         * @returns {undefined}
         */
        notImplemented(request: (test.TestRequest|Object), callback: Test_notImplemented_Callback): void;

        /**
         * Calls NotFound.
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @param {Test_notFound_Callback} callback Node-style callback called with the error, if any, and TestResponse
         * @returns {undefined}
         */
        notFound(request: (test.TestRequest|Object), callback: Test_notFound_Callback): void;
    }

    /**
     * Constructs a new Stream service.
     * @exports test.Stream
     * @extends $protobuf.rpc.Service
     * @constructor
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     */
    class Stream extends $protobuf.rpc.Service {

        /**
         * Constructs a new Stream service.
         * @exports test.Stream
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new Stream service using the specified rpc implementation.
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {Stream} RPC service. Useful where requests and/or responses are streamed.
         */
        static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): Stream;

        /**
         * Calls BiStream.
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @param {Stream_biStream_Callback} callback Node-style callback called with the error, if any, and TestResponse
         * @returns {undefined}
         */
        biStream(request: (test.TestRequest|Object), callback: Stream_biStream_Callback): void;

        /**
         * Calls ResponseStream.
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @param {Stream_responseStream_Callback} callback Node-style callback called with the error, if any, and TestResponse
         * @returns {undefined}
         */
        responseStream(request: (test.TestRequest|Object), callback: Stream_responseStream_Callback): void;

        /**
         * Calls RequestStream.
         * @param {test.TestRequest|Object} request TestRequest message or plain object
         * @param {Stream_requestStream_Callback} callback Node-style callback called with the error, if any, and TestResponse
         * @returns {undefined}
         */
        requestStream(request: (test.TestRequest|Object), callback: Stream_requestStream_Callback): void;
    }

    /**
     * Constructs a new TestRequest.
     * @exports test.TestRequest
     * @constructor
     * @param {Object} [properties] Properties to set
     */
    class TestRequest {

        /**
         * Constructs a new TestRequest.
         * @exports test.TestRequest
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        constructor(properties?: Object);

        /**
         * TestRequest value.
         * @type {string}
         */
        value: string;

        /**
         * Creates a new TestRequest instance using the specified properties.
         * @param {Object} [properties] Properties to set
         * @returns {test.TestRequest} TestRequest instance
         */
        static create(properties?: Object): test.TestRequest;

        /**
         * Encodes the specified TestRequest message.
         * @param {test.TestRequest|Object} message TestRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        static encode(message: (test.TestRequest|Object), writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TestRequest message, length delimited.
         * @param {test.TestRequest|Object} message TestRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        static encodeDelimited(message: (test.TestRequest|Object), writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TestRequest message from the specified reader or buffer.
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {test.TestRequest} TestRequest
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): test.TestRequest;

        /**
         * Decodes a TestRequest message from the specified reader or buffer, length delimited.
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {test.TestRequest} TestRequest
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): test.TestRequest;

        /**
         * Verifies a TestRequest message.
         * @param {test.TestRequest|Object} message TestRequest message or plain object to verify
         * @returns {?string} `null` if valid, otherwise the reason why it is not
         */
        static verify(message: (test.TestRequest|Object)): string;

        /**
         * Creates a TestRequest message from a plain object. Also converts values to their respective internal types.
         * @param {Object.<string,*>} object Plain object
         * @returns {test.TestRequest} TestRequest
         */
        static fromObject(object: { [k: string]: any }): test.TestRequest;

        /**
         * Creates a TestRequest message from a plain object. Also converts values to their respective internal types.
         * This is an alias of {@link test.TestRequest.fromObject}.
         * @function
         * @param {Object.<string,*>} object Plain object
         * @returns {test.TestRequest} TestRequest
         */
        static from(object: { [k: string]: any }): test.TestRequest;

        /**
         * Creates a plain object from a TestRequest message. Also converts values to other types if specified.
         * @param {test.TestRequest} message TestRequest
         * @param {$protobuf.ConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        static toObject(message: test.TestRequest, options?: $protobuf.ConversionOptions): { [k: string]: any };

        /**
         * Creates a plain object from this TestRequest message. Also converts values to other types if specified.
         * @param {$protobuf.ConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

        /**
         * Converts this TestRequest to JSON.
         * @returns {Object.<string,*>} JSON object
         */
        toJSON(): { [k: string]: any };
    }

    /**
     * Constructs a new TestResponse.
     * @exports test.TestResponse
     * @constructor
     * @param {Object} [properties] Properties to set
     */
    class TestResponse {

        /**
         * Constructs a new TestResponse.
         * @exports test.TestResponse
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        constructor(properties?: Object);

        /**
         * TestResponse result.
         * @type {string}
         */
        result: string;

        /**
         * Creates a new TestResponse instance using the specified properties.
         * @param {Object} [properties] Properties to set
         * @returns {test.TestResponse} TestResponse instance
         */
        static create(properties?: Object): test.TestResponse;

        /**
         * Encodes the specified TestResponse message.
         * @param {test.TestResponse|Object} message TestResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        static encode(message: (test.TestResponse|Object), writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TestResponse message, length delimited.
         * @param {test.TestResponse|Object} message TestResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        static encodeDelimited(message: (test.TestResponse|Object), writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TestResponse message from the specified reader or buffer.
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {test.TestResponse} TestResponse
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): test.TestResponse;

        /**
         * Decodes a TestResponse message from the specified reader or buffer, length delimited.
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {test.TestResponse} TestResponse
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): test.TestResponse;

        /**
         * Verifies a TestResponse message.
         * @param {test.TestResponse|Object} message TestResponse message or plain object to verify
         * @returns {?string} `null` if valid, otherwise the reason why it is not
         */
        static verify(message: (test.TestResponse|Object)): string;

        /**
         * Creates a TestResponse message from a plain object. Also converts values to their respective internal types.
         * @param {Object.<string,*>} object Plain object
         * @returns {test.TestResponse} TestResponse
         */
        static fromObject(object: { [k: string]: any }): test.TestResponse;

        /**
         * Creates a TestResponse message from a plain object. Also converts values to their respective internal types.
         * This is an alias of {@link test.TestResponse.fromObject}.
         * @function
         * @param {Object.<string,*>} object Plain object
         * @returns {test.TestResponse} TestResponse
         */
        static from(object: { [k: string]: any }): test.TestResponse;

        /**
         * Creates a plain object from a TestResponse message. Also converts values to other types if specified.
         * @param {test.TestResponse} message TestResponse
         * @param {$protobuf.ConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        static toObject(message: test.TestResponse, options?: $protobuf.ConversionOptions): { [k: string]: any };

        /**
         * Creates a plain object from this TestResponse message. Also converts values to other types if specified.
         * @param {$protobuf.ConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

        /**
         * Converts this TestResponse to JSON.
         * @returns {Object.<string,*>} JSON object
         */
        toJSON(): { [k: string]: any };
    }

    /**
     * Constructs a new TestEvent.
     * @exports test.TestEvent
     * @constructor
     * @param {Object} [properties] Properties to set
     */
    class TestEvent {

        /**
         * Constructs a new TestEvent.
         * @exports test.TestEvent
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        constructor(properties?: Object);

        /**
         * TestEvent value.
         * @type {string}
         */
        value: string;

        /**
         * TestEvent count.
         * @type {number}
         */
        count: number;

        /**
         * Creates a new TestEvent instance using the specified properties.
         * @param {Object} [properties] Properties to set
         * @returns {test.TestEvent} TestEvent instance
         */
        static create(properties?: Object): test.TestEvent;

        /**
         * Encodes the specified TestEvent message.
         * @param {test.TestEvent|Object} message TestEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        static encode(message: (test.TestEvent|Object), writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TestEvent message, length delimited.
         * @param {test.TestEvent|Object} message TestEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        static encodeDelimited(message: (test.TestEvent|Object), writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TestEvent message from the specified reader or buffer.
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {test.TestEvent} TestEvent
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): test.TestEvent;

        /**
         * Decodes a TestEvent message from the specified reader or buffer, length delimited.
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {test.TestEvent} TestEvent
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): test.TestEvent;

        /**
         * Verifies a TestEvent message.
         * @param {test.TestEvent|Object} message TestEvent message or plain object to verify
         * @returns {?string} `null` if valid, otherwise the reason why it is not
         */
        static verify(message: (test.TestEvent|Object)): string;

        /**
         * Creates a TestEvent message from a plain object. Also converts values to their respective internal types.
         * @param {Object.<string,*>} object Plain object
         * @returns {test.TestEvent} TestEvent
         */
        static fromObject(object: { [k: string]: any }): test.TestEvent;

        /**
         * Creates a TestEvent message from a plain object. Also converts values to their respective internal types.
         * This is an alias of {@link test.TestEvent.fromObject}.
         * @function
         * @param {Object.<string,*>} object Plain object
         * @returns {test.TestEvent} TestEvent
         */
        static from(object: { [k: string]: any }): test.TestEvent;

        /**
         * Creates a plain object from a TestEvent message. Also converts values to other types if specified.
         * @param {test.TestEvent} message TestEvent
         * @param {$protobuf.ConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        static toObject(message: test.TestEvent, options?: $protobuf.ConversionOptions): { [k: string]: any };

        /**
         * Creates a plain object from this TestEvent message. Also converts values to other types if specified.
         * @param {$protobuf.ConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

        /**
         * Converts this TestEvent to JSON.
         * @returns {Object.<string,*>} JSON object
         */
        toJSON(): { [k: string]: any };
    }

    /**
     * Constructs a new ExtendMe.
     * @exports test.ExtendMe
     * @constructor
     * @param {Object} [properties] Properties to set
     */
    class ExtendMe {

        /**
         * Constructs a new ExtendMe.
         * @exports test.ExtendMe
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        constructor(properties?: Object);

        /**
         * ExtendMe bar.
         * @type {number}
         */
        bar: number;

        /**
         * Creates a new ExtendMe instance using the specified properties.
         * @param {Object} [properties] Properties to set
         * @returns {test.ExtendMe} ExtendMe instance
         */
        static create(properties?: Object): test.ExtendMe;

        /**
         * Encodes the specified ExtendMe message.
         * @param {test.ExtendMe|Object} message ExtendMe message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        static encode(message: (test.ExtendMe|Object), writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ExtendMe message, length delimited.
         * @param {test.ExtendMe|Object} message ExtendMe message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        static encodeDelimited(message: (test.ExtendMe|Object), writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ExtendMe message from the specified reader or buffer.
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {test.ExtendMe} ExtendMe
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): test.ExtendMe;

        /**
         * Decodes an ExtendMe message from the specified reader or buffer, length delimited.
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {test.ExtendMe} ExtendMe
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): test.ExtendMe;

        /**
         * Verifies an ExtendMe message.
         * @param {test.ExtendMe|Object} message ExtendMe message or plain object to verify
         * @returns {?string} `null` if valid, otherwise the reason why it is not
         */
        static verify(message: (test.ExtendMe|Object)): string;

        /**
         * Creates an ExtendMe message from a plain object. Also converts values to their respective internal types.
         * @param {Object.<string,*>} object Plain object
         * @returns {test.ExtendMe} ExtendMe
         */
        static fromObject(object: { [k: string]: any }): test.ExtendMe;

        /**
         * Creates an ExtendMe message from a plain object. Also converts values to their respective internal types.
         * This is an alias of {@link test.ExtendMe.fromObject}.
         * @function
         * @param {Object.<string,*>} object Plain object
         * @returns {test.ExtendMe} ExtendMe
         */
        static from(object: { [k: string]: any }): test.ExtendMe;

        /**
         * Creates a plain object from an ExtendMe message. Also converts values to other types if specified.
         * @param {test.ExtendMe} message ExtendMe
         * @param {$protobuf.ConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        static toObject(message: test.ExtendMe, options?: $protobuf.ConversionOptions): { [k: string]: any };

        /**
         * Creates a plain object from this ExtendMe message. Also converts values to other types if specified.
         * @param {$protobuf.ConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

        /**
         * Converts this ExtendMe to JSON.
         * @returns {Object.<string,*>} JSON object
         */
        toJSON(): { [k: string]: any };
    }
}

/**
 * Callback as used by {@link Test#test}.
 * @typedef Test_test_Callback
 * @type {function}
 * @param {?Error} error Error, if any
 * @param {test.TestResponse} [response] TestResponse
 */
type Test_test_Callback = (error: Error, response?: test.TestResponse) => void;

/**
 * Callback as used by {@link Test#throw_}.
 * @typedef Test_throw__Callback
 * @type {function}
 * @param {?Error} error Error, if any
 * @param {test.TestResponse} [response] TestResponse
 */
type Test_throw__Callback = (error: Error, response?: test.TestResponse) => void;

/**
 * Callback as used by {@link Test#notImplemented}.
 * @typedef Test_notImplemented_Callback
 * @type {function}
 * @param {?Error} error Error, if any
 * @param {test.TestResponse} [response] TestResponse
 */
type Test_notImplemented_Callback = (error: Error, response?: test.TestResponse) => void;

/**
 * Callback as used by {@link Test#notFound}.
 * @typedef Test_notFound_Callback
 * @type {function}
 * @param {?Error} error Error, if any
 * @param {test.TestResponse} [response] TestResponse
 */
type Test_notFound_Callback = (error: Error, response?: test.TestResponse) => void;

/**
 * Callback as used by {@link Stream#biStream}.
 * @typedef Stream_biStream_Callback
 * @type {function}
 * @param {?Error} error Error, if any
 * @param {test.TestResponse} [response] TestResponse
 */
type Stream_biStream_Callback = (error: Error, response?: test.TestResponse) => void;

/**
 * Callback as used by {@link Stream#responseStream}.
 * @typedef Stream_responseStream_Callback
 * @type {function}
 * @param {?Error} error Error, if any
 * @param {test.TestResponse} [response] TestResponse
 */
type Stream_responseStream_Callback = (error: Error, response?: test.TestResponse) => void;

/**
 * Callback as used by {@link Stream#requestStream}.
 * @typedef Stream_requestStream_Callback
 * @type {function}
 * @param {?Error} error Error, if any
 * @param {test.TestResponse} [response] TestResponse
 */
type Stream_requestStream_Callback = (error: Error, response?: test.TestResponse) => void;
