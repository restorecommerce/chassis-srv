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

/**
 * Namespace io.
 * @exports io
 * @namespace
 */
export namespace io {

    /**
     * Namespace restorecommerce.
     * @exports io.restorecommerce
     * @namespace
     */
    namespace restorecommerce {

        /**
         * Namespace event.
         * @exports io.restorecommerce.event
         * @namespace
         */
        namespace event {

            /**
             * Constructs a new Event.
             * @classdesc A Kafka message event container.
             * @exports io.restorecommerce.event.Event
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class Event {

                /**
                 * Constructs a new Event.
                 * @classdesc A Kafka message event container.
                 * @exports io.restorecommerce.event.Event
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * Topic event name
                 * @type {string}
                 */
                name: string;

                /**
                 * Event message
                 * @type {google.protobuf.Any}
                 */
                payload: google.protobuf.Any;

                /**
                 * Creates a new Event instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {io.restorecommerce.event.Event} Event instance
                 */
                static create(properties?: Object): io.restorecommerce.event.Event;

                /**
                 * Encodes the specified Event message.
                 * @param {io.restorecommerce.event.Event|Object} message Event message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (io.restorecommerce.event.Event|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Event message, length delimited.
                 * @param {io.restorecommerce.event.Event|Object} message Event message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (io.restorecommerce.event.Event|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Event message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {io.restorecommerce.event.Event} Event
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): io.restorecommerce.event.Event;

                /**
                 * Decodes an Event message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {io.restorecommerce.event.Event} Event
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): io.restorecommerce.event.Event;

                /**
                 * Verifies an Event message.
                 * @param {io.restorecommerce.event.Event|Object} message Event message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (io.restorecommerce.event.Event|Object)): string;

                /**
                 * Creates an Event message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {io.restorecommerce.event.Event} Event
                 */
                static fromObject(object: { [k: string]: any }): io.restorecommerce.event.Event;

                /**
                 * Creates an Event message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link io.restorecommerce.event.Event.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {io.restorecommerce.event.Event} Event
                 */
                static from(object: { [k: string]: any }): io.restorecommerce.event.Event;

                /**
                 * Creates a plain object from an Event message. Also converts values to other types if specified.
                 * @param {io.restorecommerce.event.Event} message Event
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: io.restorecommerce.event.Event, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this Event message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this Event to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }
        }

        /**
         * Namespace notify.
         * @exports io.restorecommerce.notify
         * @namespace
         */
        namespace notify {

            /**
             * Constructs a new Notifyd service.
             * @exports io.restorecommerce.notify.Notifyd
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            class Notifyd extends $protobuf.rpc.Service {

                /**
                 * Constructs a new Notifyd service.
                 * @exports io.restorecommerce.notify.Notifyd
                 * @extends $protobuf.rpc.Service
                 * @constructor
                 * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                 */
                constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

                /**
                 * Creates new Notifyd service using the specified rpc implementation.
                 * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                 * @returns {Notifyd} RPC service. Useful where requests and/or responses are streamed.
                 */
                static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): Notifyd;

                /**
                 * Calls Create.
                 * @param {io.restorecommerce.notify.NotificationRequest|Object} request NotificationRequest message or plain object
                 * @param {Notifyd_create_Callback} callback Node-style callback called with the error, if any, and Report
                 * @returns {undefined}
                 */
                create(request: (io.restorecommerce.notify.NotificationRequest|Object), callback: Notifyd_create_Callback): void;

                /**
                 * Calls CreateStream.
                 * @param {io.restorecommerce.notify.NotificationRequest|Object} request NotificationRequest message or plain object
                 * @param {Notifyd_createStream_Callback} callback Node-style callback called with the error, if any, and Report
                 * @returns {undefined}
                 */
                createStream(request: (io.restorecommerce.notify.NotificationRequest|Object), callback: Notifyd_createStream_Callback): void;
            }

            /**
             * Constructs a new NotificationRequest.
             * @exports io.restorecommerce.notify.NotificationRequest
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class NotificationRequest {

                /**
                 * Constructs a new NotificationRequest.
                 * @exports io.restorecommerce.notify.NotificationRequest
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * NotificationRequest sender.
                 * @type {string}
                 */
                sender: string;

                /**
                 * NotificationRequest title.
                 * @type {string}
                 */
                title: string;

                /**
                 * NotificationRequest message.
                 * @type {string}
                 */
                message: string;

                /**
                 * Creates a new NotificationRequest instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {io.restorecommerce.notify.NotificationRequest} NotificationRequest instance
                 */
                static create(properties?: Object): io.restorecommerce.notify.NotificationRequest;

                /**
                 * Encodes the specified NotificationRequest message.
                 * @param {io.restorecommerce.notify.NotificationRequest|Object} message NotificationRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (io.restorecommerce.notify.NotificationRequest|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified NotificationRequest message, length delimited.
                 * @param {io.restorecommerce.notify.NotificationRequest|Object} message NotificationRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (io.restorecommerce.notify.NotificationRequest|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a NotificationRequest message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {io.restorecommerce.notify.NotificationRequest} NotificationRequest
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): io.restorecommerce.notify.NotificationRequest;

                /**
                 * Decodes a NotificationRequest message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {io.restorecommerce.notify.NotificationRequest} NotificationRequest
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): io.restorecommerce.notify.NotificationRequest;

                /**
                 * Verifies a NotificationRequest message.
                 * @param {io.restorecommerce.notify.NotificationRequest|Object} message NotificationRequest message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (io.restorecommerce.notify.NotificationRequest|Object)): string;

                /**
                 * Creates a NotificationRequest message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {io.restorecommerce.notify.NotificationRequest} NotificationRequest
                 */
                static fromObject(object: { [k: string]: any }): io.restorecommerce.notify.NotificationRequest;

                /**
                 * Creates a NotificationRequest message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link io.restorecommerce.notify.NotificationRequest.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {io.restorecommerce.notify.NotificationRequest} NotificationRequest
                 */
                static from(object: { [k: string]: any }): io.restorecommerce.notify.NotificationRequest;

                /**
                 * Creates a plain object from a NotificationRequest message. Also converts values to other types if specified.
                 * @param {io.restorecommerce.notify.NotificationRequest} message NotificationRequest
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: io.restorecommerce.notify.NotificationRequest, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this NotificationRequest message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this NotificationRequest to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }

            /**
             * Constructs a new Report.
             * @exports io.restorecommerce.notify.Report
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class Report {

                /**
                 * Constructs a new Report.
                 * @exports io.restorecommerce.notify.Report
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * Report id.
                 * @type {string}
                 */
                id: string;

                /**
                 * Report send.
                 * @type {boolean}
                 */
                send: boolean;

                /**
                 * Creates a new Report instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {io.restorecommerce.notify.Report} Report instance
                 */
                static create(properties?: Object): io.restorecommerce.notify.Report;

                /**
                 * Encodes the specified Report message.
                 * @param {io.restorecommerce.notify.Report|Object} message Report message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (io.restorecommerce.notify.Report|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Report message, length delimited.
                 * @param {io.restorecommerce.notify.Report|Object} message Report message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (io.restorecommerce.notify.Report|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Report message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {io.restorecommerce.notify.Report} Report
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): io.restorecommerce.notify.Report;

                /**
                 * Decodes a Report message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {io.restorecommerce.notify.Report} Report
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): io.restorecommerce.notify.Report;

                /**
                 * Verifies a Report message.
                 * @param {io.restorecommerce.notify.Report|Object} message Report message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (io.restorecommerce.notify.Report|Object)): string;

                /**
                 * Creates a Report message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {io.restorecommerce.notify.Report} Report
                 */
                static fromObject(object: { [k: string]: any }): io.restorecommerce.notify.Report;

                /**
                 * Creates a Report message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link io.restorecommerce.notify.Report.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {io.restorecommerce.notify.Report} Report
                 */
                static from(object: { [k: string]: any }): io.restorecommerce.notify.Report;

                /**
                 * Creates a plain object from a Report message. Also converts values to other types if specified.
                 * @param {io.restorecommerce.notify.Report} message Report
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: io.restorecommerce.notify.Report, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this Report message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this Report to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }

            /**
             * Constructs a new Notification.
             * @exports io.restorecommerce.notify.Notification
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class Notification {

                /**
                 * Constructs a new Notification.
                 * @exports io.restorecommerce.notify.Notification
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * Notification id.
                 * @type {string}
                 */
                id: string;

                /**
                 * Notification sender.
                 * @type {string}
                 */
                sender: string;

                /**
                 * Notification title.
                 * @type {string}
                 */
                title: string;

                /**
                 * Notification message.
                 * @type {string}
                 */
                message: string;

                /**
                 * Creates a new Notification instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {io.restorecommerce.notify.Notification} Notification instance
                 */
                static create(properties?: Object): io.restorecommerce.notify.Notification;

                /**
                 * Encodes the specified Notification message.
                 * @param {io.restorecommerce.notify.Notification|Object} message Notification message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (io.restorecommerce.notify.Notification|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Notification message, length delimited.
                 * @param {io.restorecommerce.notify.Notification|Object} message Notification message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (io.restorecommerce.notify.Notification|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Notification message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {io.restorecommerce.notify.Notification} Notification
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): io.restorecommerce.notify.Notification;

                /**
                 * Decodes a Notification message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {io.restorecommerce.notify.Notification} Notification
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): io.restorecommerce.notify.Notification;

                /**
                 * Verifies a Notification message.
                 * @param {io.restorecommerce.notify.Notification|Object} message Notification message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (io.restorecommerce.notify.Notification|Object)): string;

                /**
                 * Creates a Notification message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {io.restorecommerce.notify.Notification} Notification
                 */
                static fromObject(object: { [k: string]: any }): io.restorecommerce.notify.Notification;

                /**
                 * Creates a Notification message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link io.restorecommerce.notify.Notification.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {io.restorecommerce.notify.Notification} Notification
                 */
                static from(object: { [k: string]: any }): io.restorecommerce.notify.Notification;

                /**
                 * Creates a plain object from a Notification message. Also converts values to other types if specified.
                 * @param {io.restorecommerce.notify.Notification} message Notification
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: io.restorecommerce.notify.Notification, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this Notification message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this Notification to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }
        }
    }
}

/**
 * Callback as used by {@link Notifyd#create}.
 * @typedef Notifyd_create_Callback
 * @type {function}
 * @param {?Error} error Error, if any
 * @param {io.restorecommerce.notify.Report} [response] Report
 */
type Notifyd_create_Callback = (error: Error, response?: io.restorecommerce.notify.Report) => void;

/**
 * Callback as used by {@link Notifyd#createStream}.
 * @typedef Notifyd_createStream_Callback
 * @type {function}
 * @param {?Error} error Error, if any
 * @param {io.restorecommerce.notify.Report} [response] Report
 */
type Notifyd_createStream_Callback = (error: Error, response?: io.restorecommerce.notify.Report) => void;

/**
 * Namespace grpc.
 * @exports grpc
 * @namespace
 */
export namespace grpc {

    /**
     * Namespace health.
     * @exports grpc.health
     * @namespace
     */
    namespace health {

        /**
         * Namespace v1.
         * @exports grpc.health.v1
         * @namespace
         */
        namespace v1 {

            /**
             * Constructs a new HealthCheckRequest.
             * @exports grpc.health.v1.HealthCheckRequest
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class HealthCheckRequest {

                /**
                 * Constructs a new HealthCheckRequest.
                 * @exports grpc.health.v1.HealthCheckRequest
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * HealthCheckRequest service.
                 * @type {string}
                 */
                service: string;

                /**
                 * Creates a new HealthCheckRequest instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.health.v1.HealthCheckRequest} HealthCheckRequest instance
                 */
                static create(properties?: Object): grpc.health.v1.HealthCheckRequest;

                /**
                 * Encodes the specified HealthCheckRequest message.
                 * @param {grpc.health.v1.HealthCheckRequest|Object} message HealthCheckRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (grpc.health.v1.HealthCheckRequest|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified HealthCheckRequest message, length delimited.
                 * @param {grpc.health.v1.HealthCheckRequest|Object} message HealthCheckRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (grpc.health.v1.HealthCheckRequest|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a HealthCheckRequest message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.health.v1.HealthCheckRequest} HealthCheckRequest
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): grpc.health.v1.HealthCheckRequest;

                /**
                 * Decodes a HealthCheckRequest message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.health.v1.HealthCheckRequest} HealthCheckRequest
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): grpc.health.v1.HealthCheckRequest;

                /**
                 * Verifies a HealthCheckRequest message.
                 * @param {grpc.health.v1.HealthCheckRequest|Object} message HealthCheckRequest message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (grpc.health.v1.HealthCheckRequest|Object)): string;

                /**
                 * Creates a HealthCheckRequest message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.health.v1.HealthCheckRequest} HealthCheckRequest
                 */
                static fromObject(object: { [k: string]: any }): grpc.health.v1.HealthCheckRequest;

                /**
                 * Creates a HealthCheckRequest message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.health.v1.HealthCheckRequest.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.health.v1.HealthCheckRequest} HealthCheckRequest
                 */
                static from(object: { [k: string]: any }): grpc.health.v1.HealthCheckRequest;

                /**
                 * Creates a plain object from a HealthCheckRequest message. Also converts values to other types if specified.
                 * @param {grpc.health.v1.HealthCheckRequest} message HealthCheckRequest
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: grpc.health.v1.HealthCheckRequest, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this HealthCheckRequest message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this HealthCheckRequest to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }

            /**
             * Constructs a new HealthCheckResponse.
             * @exports grpc.health.v1.HealthCheckResponse
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class HealthCheckResponse {

                /**
                 * Constructs a new HealthCheckResponse.
                 * @exports grpc.health.v1.HealthCheckResponse
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * HealthCheckResponse status.
                 * @type {number}
                 */
                status: number;

                /**
                 * Creates a new HealthCheckResponse instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.health.v1.HealthCheckResponse} HealthCheckResponse instance
                 */
                static create(properties?: Object): grpc.health.v1.HealthCheckResponse;

                /**
                 * Encodes the specified HealthCheckResponse message.
                 * @param {grpc.health.v1.HealthCheckResponse|Object} message HealthCheckResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (grpc.health.v1.HealthCheckResponse|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified HealthCheckResponse message, length delimited.
                 * @param {grpc.health.v1.HealthCheckResponse|Object} message HealthCheckResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (grpc.health.v1.HealthCheckResponse|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a HealthCheckResponse message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.health.v1.HealthCheckResponse} HealthCheckResponse
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): grpc.health.v1.HealthCheckResponse;

                /**
                 * Decodes a HealthCheckResponse message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.health.v1.HealthCheckResponse} HealthCheckResponse
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): grpc.health.v1.HealthCheckResponse;

                /**
                 * Verifies a HealthCheckResponse message.
                 * @param {grpc.health.v1.HealthCheckResponse|Object} message HealthCheckResponse message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (grpc.health.v1.HealthCheckResponse|Object)): string;

                /**
                 * Creates a HealthCheckResponse message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.health.v1.HealthCheckResponse} HealthCheckResponse
                 */
                static fromObject(object: { [k: string]: any }): grpc.health.v1.HealthCheckResponse;

                /**
                 * Creates a HealthCheckResponse message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.health.v1.HealthCheckResponse.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.health.v1.HealthCheckResponse} HealthCheckResponse
                 */
                static from(object: { [k: string]: any }): grpc.health.v1.HealthCheckResponse;

                /**
                 * Creates a plain object from a HealthCheckResponse message. Also converts values to other types if specified.
                 * @param {grpc.health.v1.HealthCheckResponse} message HealthCheckResponse
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: grpc.health.v1.HealthCheckResponse, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this HealthCheckResponse message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this HealthCheckResponse to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }

            namespace HealthCheckResponse {

                /**
                 * ServingStatus enum.
                 * @name ServingStatus
                 * @memberof grpc.health.v1.HealthCheckResponse
                 * @enum {number}
                 * @property {number} UNKNOWN=0 UNKNOWN value
                 * @property {number} SERVING=1 SERVING value
                 * @property {number} NOT_SERVING=2 NOT_SERVING value
                 */
                enum ServingStatus {
                    UNKNOWN = 0,
                    SERVING = 1,
                    NOT_SERVING = 2
                }
            }

            /**
             * Constructs a new Health service.
             * @exports grpc.health.v1.Health
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            class Health extends $protobuf.rpc.Service {

                /**
                 * Constructs a new Health service.
                 * @exports grpc.health.v1.Health
                 * @extends $protobuf.rpc.Service
                 * @constructor
                 * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                 */
                constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

                /**
                 * Creates new Health service using the specified rpc implementation.
                 * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                 * @returns {Health} RPC service. Useful where requests and/or responses are streamed.
                 */
                static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): Health;

                /**
                 * Calls Check.
                 * @param {grpc.health.v1.HealthCheckRequest|Object} request HealthCheckRequest message or plain object
                 * @param {Health_check_Callback} callback Node-style callback called with the error, if any, and HealthCheckResponse
                 * @returns {undefined}
                 */
                check(request: (grpc.health.v1.HealthCheckRequest|Object), callback: Health_check_Callback): void;
            }
        }
    }

    /**
     * Namespace reflection.
     * @exports grpc.reflection
     * @namespace
     */
    namespace reflection {

        /**
         * Namespace v1alpha.
         * @exports grpc.reflection.v1alpha
         * @namespace
         */
        namespace v1alpha {

            /**
             * Constructs a new ServerReflection service.
             * @exports grpc.reflection.v1alpha.ServerReflection
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            class ServerReflection extends $protobuf.rpc.Service {

                /**
                 * Constructs a new ServerReflection service.
                 * @exports grpc.reflection.v1alpha.ServerReflection
                 * @extends $protobuf.rpc.Service
                 * @constructor
                 * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                 */
                constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

                /**
                 * Creates new ServerReflection service using the specified rpc implementation.
                 * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                 * @returns {ServerReflection} RPC service. Useful where requests and/or responses are streamed.
                 */
                static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): ServerReflection;

                /**
                 * Calls ServerReflectionInfo.
                 * @param {grpc.reflection.v1alpha.ServerReflectionRequest|Object} request ServerReflectionRequest message or plain object
                 * @param {ServerReflection_serverReflectionInfo_Callback} callback Node-style callback called with the error, if any, and ServerReflectionResponse
                 * @returns {undefined}
                 */
                serverReflectionInfo(request: (grpc.reflection.v1alpha.ServerReflectionRequest|Object), callback: ServerReflection_serverReflectionInfo_Callback): void;
            }

            /**
             * Constructs a new ServerReflectionRequest.
             * @exports grpc.reflection.v1alpha.ServerReflectionRequest
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class ServerReflectionRequest {

                /**
                 * Constructs a new ServerReflectionRequest.
                 * @exports grpc.reflection.v1alpha.ServerReflectionRequest
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * ServerReflectionRequest host.
                 * @type {string}
                 */
                host: string;

                /**
                 * ServerReflectionRequest fileByFilename.
                 * @type {string}
                 */
                fileByFilename: string;

                /**
                 * ServerReflectionRequest fileContainingSymbol.
                 * @type {string}
                 */
                fileContainingSymbol: string;

                /**
                 * ServerReflectionRequest fileContainingExtension.
                 * @type {grpc.reflection.v1alpha.ExtensionRequest}
                 */
                fileContainingExtension: grpc.reflection.v1alpha.ExtensionRequest;

                /**
                 * ServerReflectionRequest allExtensionNumbersOfType.
                 * @type {string}
                 */
                allExtensionNumbersOfType: string;

                /**
                 * ServerReflectionRequest listServices.
                 * @type {string}
                 */
                listServices: string;

                /**
                 * ServerReflectionRequest messageRequest.
                 * @name grpc.reflection.v1alpha.ServerReflectionRequest#messageRequest
                 * @type {string|undefined}
                 */
                messageRequest: (string|undefined);

                /**
                 * Creates a new ServerReflectionRequest instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.reflection.v1alpha.ServerReflectionRequest} ServerReflectionRequest instance
                 */
                static create(properties?: Object): grpc.reflection.v1alpha.ServerReflectionRequest;

                /**
                 * Encodes the specified ServerReflectionRequest message.
                 * @param {grpc.reflection.v1alpha.ServerReflectionRequest|Object} message ServerReflectionRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (grpc.reflection.v1alpha.ServerReflectionRequest|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ServerReflectionRequest message, length delimited.
                 * @param {grpc.reflection.v1alpha.ServerReflectionRequest|Object} message ServerReflectionRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (grpc.reflection.v1alpha.ServerReflectionRequest|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ServerReflectionRequest message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.reflection.v1alpha.ServerReflectionRequest} ServerReflectionRequest
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): grpc.reflection.v1alpha.ServerReflectionRequest;

                /**
                 * Decodes a ServerReflectionRequest message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.reflection.v1alpha.ServerReflectionRequest} ServerReflectionRequest
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): grpc.reflection.v1alpha.ServerReflectionRequest;

                /**
                 * Verifies a ServerReflectionRequest message.
                 * @param {grpc.reflection.v1alpha.ServerReflectionRequest|Object} message ServerReflectionRequest message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (grpc.reflection.v1alpha.ServerReflectionRequest|Object)): string;

                /**
                 * Creates a ServerReflectionRequest message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ServerReflectionRequest} ServerReflectionRequest
                 */
                static fromObject(object: { [k: string]: any }): grpc.reflection.v1alpha.ServerReflectionRequest;

                /**
                 * Creates a ServerReflectionRequest message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.reflection.v1alpha.ServerReflectionRequest.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ServerReflectionRequest} ServerReflectionRequest
                 */
                static from(object: { [k: string]: any }): grpc.reflection.v1alpha.ServerReflectionRequest;

                /**
                 * Creates a plain object from a ServerReflectionRequest message. Also converts values to other types if specified.
                 * @param {grpc.reflection.v1alpha.ServerReflectionRequest} message ServerReflectionRequest
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: grpc.reflection.v1alpha.ServerReflectionRequest, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this ServerReflectionRequest message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this ServerReflectionRequest to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }

            /**
             * Constructs a new ExtensionRequest.
             * @exports grpc.reflection.v1alpha.ExtensionRequest
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class ExtensionRequest {

                /**
                 * Constructs a new ExtensionRequest.
                 * @exports grpc.reflection.v1alpha.ExtensionRequest
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * ExtensionRequest containingType.
                 * @type {string}
                 */
                containingType: string;

                /**
                 * ExtensionRequest extensionNumber.
                 * @type {number}
                 */
                extensionNumber: number;

                /**
                 * Creates a new ExtensionRequest instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.reflection.v1alpha.ExtensionRequest} ExtensionRequest instance
                 */
                static create(properties?: Object): grpc.reflection.v1alpha.ExtensionRequest;

                /**
                 * Encodes the specified ExtensionRequest message.
                 * @param {grpc.reflection.v1alpha.ExtensionRequest|Object} message ExtensionRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (grpc.reflection.v1alpha.ExtensionRequest|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ExtensionRequest message, length delimited.
                 * @param {grpc.reflection.v1alpha.ExtensionRequest|Object} message ExtensionRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (grpc.reflection.v1alpha.ExtensionRequest|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an ExtensionRequest message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.reflection.v1alpha.ExtensionRequest} ExtensionRequest
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): grpc.reflection.v1alpha.ExtensionRequest;

                /**
                 * Decodes an ExtensionRequest message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.reflection.v1alpha.ExtensionRequest} ExtensionRequest
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): grpc.reflection.v1alpha.ExtensionRequest;

                /**
                 * Verifies an ExtensionRequest message.
                 * @param {grpc.reflection.v1alpha.ExtensionRequest|Object} message ExtensionRequest message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (grpc.reflection.v1alpha.ExtensionRequest|Object)): string;

                /**
                 * Creates an ExtensionRequest message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ExtensionRequest} ExtensionRequest
                 */
                static fromObject(object: { [k: string]: any }): grpc.reflection.v1alpha.ExtensionRequest;

                /**
                 * Creates an ExtensionRequest message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.reflection.v1alpha.ExtensionRequest.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ExtensionRequest} ExtensionRequest
                 */
                static from(object: { [k: string]: any }): grpc.reflection.v1alpha.ExtensionRequest;

                /**
                 * Creates a plain object from an ExtensionRequest message. Also converts values to other types if specified.
                 * @param {grpc.reflection.v1alpha.ExtensionRequest} message ExtensionRequest
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: grpc.reflection.v1alpha.ExtensionRequest, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this ExtensionRequest message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this ExtensionRequest to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }

            /**
             * Constructs a new ServerReflectionResponse.
             * @exports grpc.reflection.v1alpha.ServerReflectionResponse
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class ServerReflectionResponse {

                /**
                 * Constructs a new ServerReflectionResponse.
                 * @exports grpc.reflection.v1alpha.ServerReflectionResponse
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * ServerReflectionResponse validHost.
                 * @type {string}
                 */
                validHost: string;

                /**
                 * ServerReflectionResponse originalRequest.
                 * @type {grpc.reflection.v1alpha.ServerReflectionRequest}
                 */
                originalRequest: grpc.reflection.v1alpha.ServerReflectionRequest;

                /**
                 * ServerReflectionResponse fileDescriptorResponse.
                 * @type {grpc.reflection.v1alpha.FileDescriptorResponse}
                 */
                fileDescriptorResponse: grpc.reflection.v1alpha.FileDescriptorResponse;

                /**
                 * ServerReflectionResponse allExtensionNumbersResponse.
                 * @type {grpc.reflection.v1alpha.ExtensionNumberResponse}
                 */
                allExtensionNumbersResponse: grpc.reflection.v1alpha.ExtensionNumberResponse;

                /**
                 * ServerReflectionResponse listServicesResponse.
                 * @type {grpc.reflection.v1alpha.ListServiceResponse}
                 */
                listServicesResponse: grpc.reflection.v1alpha.ListServiceResponse;

                /**
                 * ServerReflectionResponse errorResponse.
                 * @type {grpc.reflection.v1alpha.ErrorResponse}
                 */
                errorResponse: grpc.reflection.v1alpha.ErrorResponse;

                /**
                 * ServerReflectionResponse messageResponse.
                 * @name grpc.reflection.v1alpha.ServerReflectionResponse#messageResponse
                 * @type {string|undefined}
                 */
                messageResponse: (string|undefined);

                /**
                 * Creates a new ServerReflectionResponse instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.reflection.v1alpha.ServerReflectionResponse} ServerReflectionResponse instance
                 */
                static create(properties?: Object): grpc.reflection.v1alpha.ServerReflectionResponse;

                /**
                 * Encodes the specified ServerReflectionResponse message.
                 * @param {grpc.reflection.v1alpha.ServerReflectionResponse|Object} message ServerReflectionResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (grpc.reflection.v1alpha.ServerReflectionResponse|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ServerReflectionResponse message, length delimited.
                 * @param {grpc.reflection.v1alpha.ServerReflectionResponse|Object} message ServerReflectionResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (grpc.reflection.v1alpha.ServerReflectionResponse|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ServerReflectionResponse message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.reflection.v1alpha.ServerReflectionResponse} ServerReflectionResponse
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): grpc.reflection.v1alpha.ServerReflectionResponse;

                /**
                 * Decodes a ServerReflectionResponse message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.reflection.v1alpha.ServerReflectionResponse} ServerReflectionResponse
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): grpc.reflection.v1alpha.ServerReflectionResponse;

                /**
                 * Verifies a ServerReflectionResponse message.
                 * @param {grpc.reflection.v1alpha.ServerReflectionResponse|Object} message ServerReflectionResponse message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (grpc.reflection.v1alpha.ServerReflectionResponse|Object)): string;

                /**
                 * Creates a ServerReflectionResponse message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ServerReflectionResponse} ServerReflectionResponse
                 */
                static fromObject(object: { [k: string]: any }): grpc.reflection.v1alpha.ServerReflectionResponse;

                /**
                 * Creates a ServerReflectionResponse message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.reflection.v1alpha.ServerReflectionResponse.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ServerReflectionResponse} ServerReflectionResponse
                 */
                static from(object: { [k: string]: any }): grpc.reflection.v1alpha.ServerReflectionResponse;

                /**
                 * Creates a plain object from a ServerReflectionResponse message. Also converts values to other types if specified.
                 * @param {grpc.reflection.v1alpha.ServerReflectionResponse} message ServerReflectionResponse
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: grpc.reflection.v1alpha.ServerReflectionResponse, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this ServerReflectionResponse message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this ServerReflectionResponse to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }

            /**
             * Constructs a new FileDescriptorResponse.
             * @exports grpc.reflection.v1alpha.FileDescriptorResponse
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class FileDescriptorResponse {

                /**
                 * Constructs a new FileDescriptorResponse.
                 * @exports grpc.reflection.v1alpha.FileDescriptorResponse
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * FileDescriptorResponse fileDescriptorProto.
                 * @type {Array.<Uint8Array>}
                 */
                fileDescriptorProto: Uint8Array[];

                /**
                 * Creates a new FileDescriptorResponse instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.reflection.v1alpha.FileDescriptorResponse} FileDescriptorResponse instance
                 */
                static create(properties?: Object): grpc.reflection.v1alpha.FileDescriptorResponse;

                /**
                 * Encodes the specified FileDescriptorResponse message.
                 * @param {grpc.reflection.v1alpha.FileDescriptorResponse|Object} message FileDescriptorResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (grpc.reflection.v1alpha.FileDescriptorResponse|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified FileDescriptorResponse message, length delimited.
                 * @param {grpc.reflection.v1alpha.FileDescriptorResponse|Object} message FileDescriptorResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (grpc.reflection.v1alpha.FileDescriptorResponse|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a FileDescriptorResponse message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.reflection.v1alpha.FileDescriptorResponse} FileDescriptorResponse
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): grpc.reflection.v1alpha.FileDescriptorResponse;

                /**
                 * Decodes a FileDescriptorResponse message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.reflection.v1alpha.FileDescriptorResponse} FileDescriptorResponse
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): grpc.reflection.v1alpha.FileDescriptorResponse;

                /**
                 * Verifies a FileDescriptorResponse message.
                 * @param {grpc.reflection.v1alpha.FileDescriptorResponse|Object} message FileDescriptorResponse message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (grpc.reflection.v1alpha.FileDescriptorResponse|Object)): string;

                /**
                 * Creates a FileDescriptorResponse message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.FileDescriptorResponse} FileDescriptorResponse
                 */
                static fromObject(object: { [k: string]: any }): grpc.reflection.v1alpha.FileDescriptorResponse;

                /**
                 * Creates a FileDescriptorResponse message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.reflection.v1alpha.FileDescriptorResponse.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.FileDescriptorResponse} FileDescriptorResponse
                 */
                static from(object: { [k: string]: any }): grpc.reflection.v1alpha.FileDescriptorResponse;

                /**
                 * Creates a plain object from a FileDescriptorResponse message. Also converts values to other types if specified.
                 * @param {grpc.reflection.v1alpha.FileDescriptorResponse} message FileDescriptorResponse
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: grpc.reflection.v1alpha.FileDescriptorResponse, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this FileDescriptorResponse message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this FileDescriptorResponse to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }

            /**
             * Constructs a new ExtensionNumberResponse.
             * @exports grpc.reflection.v1alpha.ExtensionNumberResponse
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class ExtensionNumberResponse {

                /**
                 * Constructs a new ExtensionNumberResponse.
                 * @exports grpc.reflection.v1alpha.ExtensionNumberResponse
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * ExtensionNumberResponse baseTypeName.
                 * @type {string}
                 */
                baseTypeName: string;

                /**
                 * ExtensionNumberResponse extensionNumber.
                 * @type {Array.<number>}
                 */
                extensionNumber: number[];

                /**
                 * Creates a new ExtensionNumberResponse instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.reflection.v1alpha.ExtensionNumberResponse} ExtensionNumberResponse instance
                 */
                static create(properties?: Object): grpc.reflection.v1alpha.ExtensionNumberResponse;

                /**
                 * Encodes the specified ExtensionNumberResponse message.
                 * @param {grpc.reflection.v1alpha.ExtensionNumberResponse|Object} message ExtensionNumberResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (grpc.reflection.v1alpha.ExtensionNumberResponse|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ExtensionNumberResponse message, length delimited.
                 * @param {grpc.reflection.v1alpha.ExtensionNumberResponse|Object} message ExtensionNumberResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (grpc.reflection.v1alpha.ExtensionNumberResponse|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an ExtensionNumberResponse message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.reflection.v1alpha.ExtensionNumberResponse} ExtensionNumberResponse
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): grpc.reflection.v1alpha.ExtensionNumberResponse;

                /**
                 * Decodes an ExtensionNumberResponse message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.reflection.v1alpha.ExtensionNumberResponse} ExtensionNumberResponse
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): grpc.reflection.v1alpha.ExtensionNumberResponse;

                /**
                 * Verifies an ExtensionNumberResponse message.
                 * @param {grpc.reflection.v1alpha.ExtensionNumberResponse|Object} message ExtensionNumberResponse message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (grpc.reflection.v1alpha.ExtensionNumberResponse|Object)): string;

                /**
                 * Creates an ExtensionNumberResponse message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ExtensionNumberResponse} ExtensionNumberResponse
                 */
                static fromObject(object: { [k: string]: any }): grpc.reflection.v1alpha.ExtensionNumberResponse;

                /**
                 * Creates an ExtensionNumberResponse message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.reflection.v1alpha.ExtensionNumberResponse.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ExtensionNumberResponse} ExtensionNumberResponse
                 */
                static from(object: { [k: string]: any }): grpc.reflection.v1alpha.ExtensionNumberResponse;

                /**
                 * Creates a plain object from an ExtensionNumberResponse message. Also converts values to other types if specified.
                 * @param {grpc.reflection.v1alpha.ExtensionNumberResponse} message ExtensionNumberResponse
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: grpc.reflection.v1alpha.ExtensionNumberResponse, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this ExtensionNumberResponse message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this ExtensionNumberResponse to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }

            /**
             * Constructs a new ListServiceResponse.
             * @exports grpc.reflection.v1alpha.ListServiceResponse
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class ListServiceResponse {

                /**
                 * Constructs a new ListServiceResponse.
                 * @exports grpc.reflection.v1alpha.ListServiceResponse
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * ListServiceResponse service.
                 * @type {Array.<grpc.reflection.v1alpha.ServiceResponse>}
                 */
                service: grpc.reflection.v1alpha.ServiceResponse[];

                /**
                 * Creates a new ListServiceResponse instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.reflection.v1alpha.ListServiceResponse} ListServiceResponse instance
                 */
                static create(properties?: Object): grpc.reflection.v1alpha.ListServiceResponse;

                /**
                 * Encodes the specified ListServiceResponse message.
                 * @param {grpc.reflection.v1alpha.ListServiceResponse|Object} message ListServiceResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (grpc.reflection.v1alpha.ListServiceResponse|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListServiceResponse message, length delimited.
                 * @param {grpc.reflection.v1alpha.ListServiceResponse|Object} message ListServiceResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (grpc.reflection.v1alpha.ListServiceResponse|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListServiceResponse message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.reflection.v1alpha.ListServiceResponse} ListServiceResponse
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): grpc.reflection.v1alpha.ListServiceResponse;

                /**
                 * Decodes a ListServiceResponse message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.reflection.v1alpha.ListServiceResponse} ListServiceResponse
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): grpc.reflection.v1alpha.ListServiceResponse;

                /**
                 * Verifies a ListServiceResponse message.
                 * @param {grpc.reflection.v1alpha.ListServiceResponse|Object} message ListServiceResponse message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (grpc.reflection.v1alpha.ListServiceResponse|Object)): string;

                /**
                 * Creates a ListServiceResponse message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ListServiceResponse} ListServiceResponse
                 */
                static fromObject(object: { [k: string]: any }): grpc.reflection.v1alpha.ListServiceResponse;

                /**
                 * Creates a ListServiceResponse message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.reflection.v1alpha.ListServiceResponse.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ListServiceResponse} ListServiceResponse
                 */
                static from(object: { [k: string]: any }): grpc.reflection.v1alpha.ListServiceResponse;

                /**
                 * Creates a plain object from a ListServiceResponse message. Also converts values to other types if specified.
                 * @param {grpc.reflection.v1alpha.ListServiceResponse} message ListServiceResponse
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: grpc.reflection.v1alpha.ListServiceResponse, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this ListServiceResponse message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListServiceResponse to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }

            /**
             * Constructs a new ServiceResponse.
             * @exports grpc.reflection.v1alpha.ServiceResponse
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class ServiceResponse {

                /**
                 * Constructs a new ServiceResponse.
                 * @exports grpc.reflection.v1alpha.ServiceResponse
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * ServiceResponse name.
                 * @type {string}
                 */
                name: string;

                /**
                 * Creates a new ServiceResponse instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.reflection.v1alpha.ServiceResponse} ServiceResponse instance
                 */
                static create(properties?: Object): grpc.reflection.v1alpha.ServiceResponse;

                /**
                 * Encodes the specified ServiceResponse message.
                 * @param {grpc.reflection.v1alpha.ServiceResponse|Object} message ServiceResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (grpc.reflection.v1alpha.ServiceResponse|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ServiceResponse message, length delimited.
                 * @param {grpc.reflection.v1alpha.ServiceResponse|Object} message ServiceResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (grpc.reflection.v1alpha.ServiceResponse|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ServiceResponse message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.reflection.v1alpha.ServiceResponse} ServiceResponse
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): grpc.reflection.v1alpha.ServiceResponse;

                /**
                 * Decodes a ServiceResponse message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.reflection.v1alpha.ServiceResponse} ServiceResponse
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): grpc.reflection.v1alpha.ServiceResponse;

                /**
                 * Verifies a ServiceResponse message.
                 * @param {grpc.reflection.v1alpha.ServiceResponse|Object} message ServiceResponse message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (grpc.reflection.v1alpha.ServiceResponse|Object)): string;

                /**
                 * Creates a ServiceResponse message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ServiceResponse} ServiceResponse
                 */
                static fromObject(object: { [k: string]: any }): grpc.reflection.v1alpha.ServiceResponse;

                /**
                 * Creates a ServiceResponse message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.reflection.v1alpha.ServiceResponse.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ServiceResponse} ServiceResponse
                 */
                static from(object: { [k: string]: any }): grpc.reflection.v1alpha.ServiceResponse;

                /**
                 * Creates a plain object from a ServiceResponse message. Also converts values to other types if specified.
                 * @param {grpc.reflection.v1alpha.ServiceResponse} message ServiceResponse
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: grpc.reflection.v1alpha.ServiceResponse, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this ServiceResponse message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this ServiceResponse to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }

            /**
             * Constructs a new ErrorResponse.
             * @exports grpc.reflection.v1alpha.ErrorResponse
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class ErrorResponse {

                /**
                 * Constructs a new ErrorResponse.
                 * @exports grpc.reflection.v1alpha.ErrorResponse
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * ErrorResponse errorCode.
                 * @type {number}
                 */
                errorCode: number;

                /**
                 * ErrorResponse errorMessage.
                 * @type {string}
                 */
                errorMessage: string;

                /**
                 * Creates a new ErrorResponse instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {grpc.reflection.v1alpha.ErrorResponse} ErrorResponse instance
                 */
                static create(properties?: Object): grpc.reflection.v1alpha.ErrorResponse;

                /**
                 * Encodes the specified ErrorResponse message.
                 * @param {grpc.reflection.v1alpha.ErrorResponse|Object} message ErrorResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (grpc.reflection.v1alpha.ErrorResponse|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ErrorResponse message, length delimited.
                 * @param {grpc.reflection.v1alpha.ErrorResponse|Object} message ErrorResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (grpc.reflection.v1alpha.ErrorResponse|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an ErrorResponse message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grpc.reflection.v1alpha.ErrorResponse} ErrorResponse
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): grpc.reflection.v1alpha.ErrorResponse;

                /**
                 * Decodes an ErrorResponse message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grpc.reflection.v1alpha.ErrorResponse} ErrorResponse
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): grpc.reflection.v1alpha.ErrorResponse;

                /**
                 * Verifies an ErrorResponse message.
                 * @param {grpc.reflection.v1alpha.ErrorResponse|Object} message ErrorResponse message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (grpc.reflection.v1alpha.ErrorResponse|Object)): string;

                /**
                 * Creates an ErrorResponse message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ErrorResponse} ErrorResponse
                 */
                static fromObject(object: { [k: string]: any }): grpc.reflection.v1alpha.ErrorResponse;

                /**
                 * Creates an ErrorResponse message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link grpc.reflection.v1alpha.ErrorResponse.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grpc.reflection.v1alpha.ErrorResponse} ErrorResponse
                 */
                static from(object: { [k: string]: any }): grpc.reflection.v1alpha.ErrorResponse;

                /**
                 * Creates a plain object from an ErrorResponse message. Also converts values to other types if specified.
                 * @param {grpc.reflection.v1alpha.ErrorResponse} message ErrorResponse
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: grpc.reflection.v1alpha.ErrorResponse, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this ErrorResponse message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this ErrorResponse to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }
        }
    }
}

/**
 * Callback as used by {@link Health#check}.
 * @typedef Health_check_Callback
 * @type {function}
 * @param {?Error} error Error, if any
 * @param {grpc.health.v1.HealthCheckResponse} [response] HealthCheckResponse
 */
type Health_check_Callback = (error: Error, response?: grpc.health.v1.HealthCheckResponse) => void;

/**
 * Callback as used by {@link ServerReflection#serverReflectionInfo}.
 * @typedef ServerReflection_serverReflectionInfo_Callback
 * @type {function}
 * @param {?Error} error Error, if any
 * @param {grpc.reflection.v1alpha.ServerReflectionResponse} [response] ServerReflectionResponse
 */
type ServerReflection_serverReflectionInfo_Callback = (error: Error, response?: grpc.reflection.v1alpha.ServerReflectionResponse) => void;

/**
 * Namespace google.
 * @exports google
 * @namespace
 */
export namespace google {

    /**
     * Namespace protobuf.
     * @exports google.protobuf
     * @namespace
     */
    namespace protobuf {

        /**
         * Constructs a new Any.
         * @exports google.protobuf.Any
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class Any {

            /**
             * Constructs a new Any.
             * @exports google.protobuf.Any
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * Any type_url.
             * @type {string}
             */
            type_url: string;

            /**
             * Any value.
             * @type {Uint8Array}
             */
            value: Uint8Array;

            /**
             * Creates a new Any instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.Any} Any instance
             */
            static create(properties?: Object): google.protobuf.Any;

            /**
             * Encodes the specified Any message.
             * @param {google.protobuf.Any|Object} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.Any|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Any message, length delimited.
             * @param {google.protobuf.Any|Object} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.Any|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Any} Any
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Any;

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Any} Any
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Any;

            /**
             * Verifies an Any message.
             * @param {google.protobuf.Any|Object} message Any message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.Any|Object)): string;

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Any} Any
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.Any;

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.Any.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Any} Any
             */
            static from(object: { [k: string]: any }): google.protobuf.Any;

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @param {google.protobuf.Any} message Any
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.Any, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this Any message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this Any to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        /**
         * Constructs a new FileDescriptorSet.
         * @exports google.protobuf.FileDescriptorSet
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class FileDescriptorSet {

            /**
             * Constructs a new FileDescriptorSet.
             * @exports google.protobuf.FileDescriptorSet
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * FileDescriptorSet file.
             * @type {Array.<google.protobuf.FileDescriptorProto>}
             */
            file: google.protobuf.FileDescriptorProto[];

            /**
             * Creates a new FileDescriptorSet instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.FileDescriptorSet} FileDescriptorSet instance
             */
            static create(properties?: Object): google.protobuf.FileDescriptorSet;

            /**
             * Encodes the specified FileDescriptorSet message.
             * @param {google.protobuf.FileDescriptorSet|Object} message FileDescriptorSet message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.FileDescriptorSet|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FileDescriptorSet message, length delimited.
             * @param {google.protobuf.FileDescriptorSet|Object} message FileDescriptorSet message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.FileDescriptorSet|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FileDescriptorSet message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.FileDescriptorSet} FileDescriptorSet
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FileDescriptorSet;

            /**
             * Decodes a FileDescriptorSet message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.FileDescriptorSet} FileDescriptorSet
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FileDescriptorSet;

            /**
             * Verifies a FileDescriptorSet message.
             * @param {google.protobuf.FileDescriptorSet|Object} message FileDescriptorSet message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.FileDescriptorSet|Object)): string;

            /**
             * Creates a FileDescriptorSet message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FileDescriptorSet} FileDescriptorSet
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.FileDescriptorSet;

            /**
             * Creates a FileDescriptorSet message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.FileDescriptorSet.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FileDescriptorSet} FileDescriptorSet
             */
            static from(object: { [k: string]: any }): google.protobuf.FileDescriptorSet;

            /**
             * Creates a plain object from a FileDescriptorSet message. Also converts values to other types if specified.
             * @param {google.protobuf.FileDescriptorSet} message FileDescriptorSet
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.FileDescriptorSet, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this FileDescriptorSet message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this FileDescriptorSet to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        /**
         * Constructs a new FileDescriptorProto.
         * @classdesc Describes a complete .proto file.
         * @exports google.protobuf.FileDescriptorProto
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class FileDescriptorProto {

            /**
             * Constructs a new FileDescriptorProto.
             * @classdesc Describes a complete .proto file.
             * @exports google.protobuf.FileDescriptorProto
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * file name, relative to root of source tree
             * @type {string}
             */
            name: string;

            /**
             * FileDescriptorProto package.
             * @name google.protobuf.FileDescriptorProto#package
             * @type {string}
             */
            package: string;

            /**
             * Names of files imported by this file.
             * @type {Array.<string>}
             */
            dependency: string[];

            /**
             * Indexes of the public imported files in the dependency list above.
             * @type {Array.<number>}
             */
            publicDependency: number[];

            /**
             * For Google-internal migration only. Do not use.
             * @type {Array.<number>}
             */
            weakDependency: number[];

            /**
             * All top-level definitions in this file.
             * @type {Array.<google.protobuf.DescriptorProto>}
             */
            messageType: google.protobuf.DescriptorProto[];

            /**
             * FileDescriptorProto enumType.
             * @type {Array.<google.protobuf.EnumDescriptorProto>}
             */
            enumType: google.protobuf.EnumDescriptorProto[];

            /**
             * FileDescriptorProto service.
             * @type {Array.<google.protobuf.ServiceDescriptorProto>}
             */
            service: google.protobuf.ServiceDescriptorProto[];

            /**
             * FileDescriptorProto extension.
             * @type {Array.<google.protobuf.FieldDescriptorProto>}
             */
            extension: google.protobuf.FieldDescriptorProto[];

            /**
             * FileDescriptorProto options.
             * @type {google.protobuf.FileOptions}
             */
            options: google.protobuf.FileOptions;

            /**
             * development tools.
             * @type {google.protobuf.SourceCodeInfo}
             */
            sourceCodeInfo: google.protobuf.SourceCodeInfo;

            /**
             * The supported values are "proto2" and "proto3".
             * @type {string}
             */
            syntax: string;

            /**
             * Creates a new FileDescriptorProto instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.FileDescriptorProto} FileDescriptorProto instance
             */
            static create(properties?: Object): google.protobuf.FileDescriptorProto;

            /**
             * Encodes the specified FileDescriptorProto message.
             * @param {google.protobuf.FileDescriptorProto|Object} message FileDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.FileDescriptorProto|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FileDescriptorProto message, length delimited.
             * @param {google.protobuf.FileDescriptorProto|Object} message FileDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.FileDescriptorProto|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FileDescriptorProto message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.FileDescriptorProto} FileDescriptorProto
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FileDescriptorProto;

            /**
             * Decodes a FileDescriptorProto message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.FileDescriptorProto} FileDescriptorProto
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FileDescriptorProto;

            /**
             * Verifies a FileDescriptorProto message.
             * @param {google.protobuf.FileDescriptorProto|Object} message FileDescriptorProto message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.FileDescriptorProto|Object)): string;

            /**
             * Creates a FileDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FileDescriptorProto} FileDescriptorProto
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.FileDescriptorProto;

            /**
             * Creates a FileDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.FileDescriptorProto.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FileDescriptorProto} FileDescriptorProto
             */
            static from(object: { [k: string]: any }): google.protobuf.FileDescriptorProto;

            /**
             * Creates a plain object from a FileDescriptorProto message. Also converts values to other types if specified.
             * @param {google.protobuf.FileDescriptorProto} message FileDescriptorProto
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.FileDescriptorProto, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this FileDescriptorProto message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this FileDescriptorProto to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        /**
         * Constructs a new DescriptorProto.
         * @classdesc Describes a message type.
         * @exports google.protobuf.DescriptorProto
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class DescriptorProto {

            /**
             * Constructs a new DescriptorProto.
             * @classdesc Describes a message type.
             * @exports google.protobuf.DescriptorProto
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * DescriptorProto name.
             * @type {string}
             */
            name: string;

            /**
             * DescriptorProto field.
             * @type {Array.<google.protobuf.FieldDescriptorProto>}
             */
            field: google.protobuf.FieldDescriptorProto[];

            /**
             * DescriptorProto extension.
             * @type {Array.<google.protobuf.FieldDescriptorProto>}
             */
            extension: google.protobuf.FieldDescriptorProto[];

            /**
             * DescriptorProto nestedType.
             * @type {Array.<google.protobuf.DescriptorProto>}
             */
            nestedType: google.protobuf.DescriptorProto[];

            /**
             * DescriptorProto enumType.
             * @type {Array.<google.protobuf.EnumDescriptorProto>}
             */
            enumType: google.protobuf.EnumDescriptorProto[];

            /**
             * DescriptorProto extensionRange.
             * @type {Array.<google.protobuf.DescriptorProto.ExtensionRange>}
             */
            extensionRange: google.protobuf.DescriptorProto.ExtensionRange[];

            /**
             * DescriptorProto oneofDecl.
             * @type {Array.<google.protobuf.OneofDescriptorProto>}
             */
            oneofDecl: google.protobuf.OneofDescriptorProto[];

            /**
             * DescriptorProto options.
             * @type {google.protobuf.MessageOptions}
             */
            options: google.protobuf.MessageOptions;

            /**
             * DescriptorProto reservedRange.
             * @type {Array.<google.protobuf.DescriptorProto.ReservedRange>}
             */
            reservedRange: google.protobuf.DescriptorProto.ReservedRange[];

            /**
             * A given name may only be reserved once.
             * @type {Array.<string>}
             */
            reservedName: string[];

            /**
             * Creates a new DescriptorProto instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.DescriptorProto} DescriptorProto instance
             */
            static create(properties?: Object): google.protobuf.DescriptorProto;

            /**
             * Encodes the specified DescriptorProto message.
             * @param {google.protobuf.DescriptorProto|Object} message DescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.DescriptorProto|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DescriptorProto message, length delimited.
             * @param {google.protobuf.DescriptorProto|Object} message DescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.DescriptorProto|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DescriptorProto message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.DescriptorProto} DescriptorProto
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DescriptorProto;

            /**
             * Decodes a DescriptorProto message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.DescriptorProto} DescriptorProto
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DescriptorProto;

            /**
             * Verifies a DescriptorProto message.
             * @param {google.protobuf.DescriptorProto|Object} message DescriptorProto message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.DescriptorProto|Object)): string;

            /**
             * Creates a DescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.DescriptorProto} DescriptorProto
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.DescriptorProto;

            /**
             * Creates a DescriptorProto message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.DescriptorProto.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.DescriptorProto} DescriptorProto
             */
            static from(object: { [k: string]: any }): google.protobuf.DescriptorProto;

            /**
             * Creates a plain object from a DescriptorProto message. Also converts values to other types if specified.
             * @param {google.protobuf.DescriptorProto} message DescriptorProto
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.DescriptorProto, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this DescriptorProto message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this DescriptorProto to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        namespace DescriptorProto {

            /**
             * Constructs a new ExtensionRange.
             * @exports google.protobuf.DescriptorProto.ExtensionRange
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class ExtensionRange {

                /**
                 * Constructs a new ExtensionRange.
                 * @exports google.protobuf.DescriptorProto.ExtensionRange
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * ExtensionRange start.
                 * @type {number}
                 */
                start: number;

                /**
                 * ExtensionRange end.
                 * @type {number}
                 */
                end: number;

                /**
                 * Creates a new ExtensionRange instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {google.protobuf.DescriptorProto.ExtensionRange} ExtensionRange instance
                 */
                static create(properties?: Object): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Encodes the specified ExtensionRange message.
                 * @param {google.protobuf.DescriptorProto.ExtensionRange|Object} message ExtensionRange message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (google.protobuf.DescriptorProto.ExtensionRange|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ExtensionRange message, length delimited.
                 * @param {google.protobuf.DescriptorProto.ExtensionRange|Object} message ExtensionRange message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (google.protobuf.DescriptorProto.ExtensionRange|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an ExtensionRange message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.DescriptorProto.ExtensionRange} ExtensionRange
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Decodes an ExtensionRange message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.DescriptorProto.ExtensionRange} ExtensionRange
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Verifies an ExtensionRange message.
                 * @param {google.protobuf.DescriptorProto.ExtensionRange|Object} message ExtensionRange message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (google.protobuf.DescriptorProto.ExtensionRange|Object)): string;

                /**
                 * Creates an ExtensionRange message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.DescriptorProto.ExtensionRange} ExtensionRange
                 */
                static fromObject(object: { [k: string]: any }): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Creates an ExtensionRange message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link google.protobuf.DescriptorProto.ExtensionRange.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.DescriptorProto.ExtensionRange} ExtensionRange
                 */
                static from(object: { [k: string]: any }): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Creates a plain object from an ExtensionRange message. Also converts values to other types if specified.
                 * @param {google.protobuf.DescriptorProto.ExtensionRange} message ExtensionRange
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: google.protobuf.DescriptorProto.ExtensionRange, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this ExtensionRange message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this ExtensionRange to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }

            /**
             * Constructs a new ReservedRange.
             * @classdesc not overlap.
             * @exports google.protobuf.DescriptorProto.ReservedRange
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class ReservedRange {

                /**
                 * Constructs a new ReservedRange.
                 * @classdesc not overlap.
                 * @exports google.protobuf.DescriptorProto.ReservedRange
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * Inclusive.
                 * @type {number}
                 */
                start: number;

                /**
                 * Exclusive.
                 * @type {number}
                 */
                end: number;

                /**
                 * Creates a new ReservedRange instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {google.protobuf.DescriptorProto.ReservedRange} ReservedRange instance
                 */
                static create(properties?: Object): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Encodes the specified ReservedRange message.
                 * @param {google.protobuf.DescriptorProto.ReservedRange|Object} message ReservedRange message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (google.protobuf.DescriptorProto.ReservedRange|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ReservedRange message, length delimited.
                 * @param {google.protobuf.DescriptorProto.ReservedRange|Object} message ReservedRange message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (google.protobuf.DescriptorProto.ReservedRange|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ReservedRange message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.DescriptorProto.ReservedRange} ReservedRange
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Decodes a ReservedRange message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.DescriptorProto.ReservedRange} ReservedRange
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Verifies a ReservedRange message.
                 * @param {google.protobuf.DescriptorProto.ReservedRange|Object} message ReservedRange message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (google.protobuf.DescriptorProto.ReservedRange|Object)): string;

                /**
                 * Creates a ReservedRange message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.DescriptorProto.ReservedRange} ReservedRange
                 */
                static fromObject(object: { [k: string]: any }): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Creates a ReservedRange message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link google.protobuf.DescriptorProto.ReservedRange.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.DescriptorProto.ReservedRange} ReservedRange
                 */
                static from(object: { [k: string]: any }): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Creates a plain object from a ReservedRange message. Also converts values to other types if specified.
                 * @param {google.protobuf.DescriptorProto.ReservedRange} message ReservedRange
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: google.protobuf.DescriptorProto.ReservedRange, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this ReservedRange message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this ReservedRange to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }
        }

        /**
         * Constructs a new FieldDescriptorProto.
         * @classdesc Describes a field within a message.
         * @exports google.protobuf.FieldDescriptorProto
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class FieldDescriptorProto {

            /**
             * Constructs a new FieldDescriptorProto.
             * @classdesc Describes a field within a message.
             * @exports google.protobuf.FieldDescriptorProto
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * FieldDescriptorProto name.
             * @type {string}
             */
            name: string;

            /**
             * FieldDescriptorProto number.
             * @type {number}
             */
            number: number;

            /**
             * FieldDescriptorProto label.
             * @type {number}
             */
            label: number;

            /**
             * are set, this must be one of TYPE_ENUM, TYPE_MESSAGE or TYPE_GROUP.
             * @type {number}
             */
            type: number;

            /**
             * namespace).
             * @type {string}
             */
            typeName: string;

            /**
             * resolved in the same manner as type_name.
             * @type {string}
             */
            extendee: string;

            /**
             * TODO(kenton):  Base-64 encode?
             * @type {string}
             */
            defaultValue: string;

            /**
             * list.  This field is a member of that oneof.
             * @type {number}
             */
            oneofIndex: number;

            /**
             * it to camelCase.
             * @type {string}
             */
            jsonName: string;

            /**
             * FieldDescriptorProto options.
             * @type {google.protobuf.FieldOptions}
             */
            options: google.protobuf.FieldOptions;

            /**
             * Creates a new FieldDescriptorProto instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.FieldDescriptorProto} FieldDescriptorProto instance
             */
            static create(properties?: Object): google.protobuf.FieldDescriptorProto;

            /**
             * Encodes the specified FieldDescriptorProto message.
             * @param {google.protobuf.FieldDescriptorProto|Object} message FieldDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.FieldDescriptorProto|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FieldDescriptorProto message, length delimited.
             * @param {google.protobuf.FieldDescriptorProto|Object} message FieldDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.FieldDescriptorProto|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FieldDescriptorProto message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.FieldDescriptorProto} FieldDescriptorProto
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FieldDescriptorProto;

            /**
             * Decodes a FieldDescriptorProto message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.FieldDescriptorProto} FieldDescriptorProto
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FieldDescriptorProto;

            /**
             * Verifies a FieldDescriptorProto message.
             * @param {google.protobuf.FieldDescriptorProto|Object} message FieldDescriptorProto message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.FieldDescriptorProto|Object)): string;

            /**
             * Creates a FieldDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FieldDescriptorProto} FieldDescriptorProto
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.FieldDescriptorProto;

            /**
             * Creates a FieldDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.FieldDescriptorProto.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FieldDescriptorProto} FieldDescriptorProto
             */
            static from(object: { [k: string]: any }): google.protobuf.FieldDescriptorProto;

            /**
             * Creates a plain object from a FieldDescriptorProto message. Also converts values to other types if specified.
             * @param {google.protobuf.FieldDescriptorProto} message FieldDescriptorProto
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.FieldDescriptorProto, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this FieldDescriptorProto message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this FieldDescriptorProto to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        namespace FieldDescriptorProto {

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
            enum Type {
                TYPE_DOUBLE = 1,
                TYPE_FLOAT = 2,
                TYPE_INT64 = 3,
                TYPE_UINT64 = 4,
                TYPE_INT32 = 5,
                TYPE_FIXED64 = 6,
                TYPE_FIXED32 = 7,
                TYPE_BOOL = 8,
                TYPE_STRING = 9,
                TYPE_GROUP = 10,
                TYPE_MESSAGE = 11,
                TYPE_BYTES = 12,
                TYPE_UINT32 = 13,
                TYPE_ENUM = 14,
                TYPE_SFIXED32 = 15,
                TYPE_SFIXED64 = 16,
                TYPE_SINT32 = 17,
                TYPE_SINT64 = 18
            }

            /**
             * Label enum.
             * @name Label
             * @memberof google.protobuf.FieldDescriptorProto
             * @enum {number}
             * @property {number} LABEL_OPTIONAL=1 0 is reserved for errors
             * @property {number} LABEL_REQUIRED=2 LABEL_REQUIRED value
             * @property {number} LABEL_REPEATED=3 LABEL_REPEATED value
             */
            enum Label {
                LABEL_OPTIONAL = 1,
                LABEL_REQUIRED = 2,
                LABEL_REPEATED = 3
            }
        }

        /**
         * Constructs a new OneofDescriptorProto.
         * @classdesc Describes a oneof.
         * @exports google.protobuf.OneofDescriptorProto
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class OneofDescriptorProto {

            /**
             * Constructs a new OneofDescriptorProto.
             * @classdesc Describes a oneof.
             * @exports google.protobuf.OneofDescriptorProto
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * OneofDescriptorProto name.
             * @type {string}
             */
            name: string;

            /**
             * Creates a new OneofDescriptorProto instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.OneofDescriptorProto} OneofDescriptorProto instance
             */
            static create(properties?: Object): google.protobuf.OneofDescriptorProto;

            /**
             * Encodes the specified OneofDescriptorProto message.
             * @param {google.protobuf.OneofDescriptorProto|Object} message OneofDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.OneofDescriptorProto|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified OneofDescriptorProto message, length delimited.
             * @param {google.protobuf.OneofDescriptorProto|Object} message OneofDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.OneofDescriptorProto|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an OneofDescriptorProto message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.OneofDescriptorProto} OneofDescriptorProto
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.OneofDescriptorProto;

            /**
             * Decodes an OneofDescriptorProto message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.OneofDescriptorProto} OneofDescriptorProto
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.OneofDescriptorProto;

            /**
             * Verifies an OneofDescriptorProto message.
             * @param {google.protobuf.OneofDescriptorProto|Object} message OneofDescriptorProto message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.OneofDescriptorProto|Object)): string;

            /**
             * Creates an OneofDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.OneofDescriptorProto} OneofDescriptorProto
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.OneofDescriptorProto;

            /**
             * Creates an OneofDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.OneofDescriptorProto.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.OneofDescriptorProto} OneofDescriptorProto
             */
            static from(object: { [k: string]: any }): google.protobuf.OneofDescriptorProto;

            /**
             * Creates a plain object from an OneofDescriptorProto message. Also converts values to other types if specified.
             * @param {google.protobuf.OneofDescriptorProto} message OneofDescriptorProto
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.OneofDescriptorProto, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this OneofDescriptorProto message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this OneofDescriptorProto to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        /**
         * Constructs a new EnumDescriptorProto.
         * @classdesc Describes an enum type.
         * @exports google.protobuf.EnumDescriptorProto
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class EnumDescriptorProto {

            /**
             * Constructs a new EnumDescriptorProto.
             * @classdesc Describes an enum type.
             * @exports google.protobuf.EnumDescriptorProto
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * EnumDescriptorProto name.
             * @type {string}
             */
            name: string;

            /**
             * EnumDescriptorProto value.
             * @type {Array.<google.protobuf.EnumValueDescriptorProto>}
             */
            value: google.protobuf.EnumValueDescriptorProto[];

            /**
             * EnumDescriptorProto options.
             * @type {google.protobuf.EnumOptions}
             */
            options: google.protobuf.EnumOptions;

            /**
             * Creates a new EnumDescriptorProto instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.EnumDescriptorProto} EnumDescriptorProto instance
             */
            static create(properties?: Object): google.protobuf.EnumDescriptorProto;

            /**
             * Encodes the specified EnumDescriptorProto message.
             * @param {google.protobuf.EnumDescriptorProto|Object} message EnumDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.EnumDescriptorProto|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumDescriptorProto message, length delimited.
             * @param {google.protobuf.EnumDescriptorProto|Object} message EnumDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.EnumDescriptorProto|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumDescriptorProto message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.EnumDescriptorProto} EnumDescriptorProto
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumDescriptorProto;

            /**
             * Decodes an EnumDescriptorProto message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.EnumDescriptorProto} EnumDescriptorProto
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumDescriptorProto;

            /**
             * Verifies an EnumDescriptorProto message.
             * @param {google.protobuf.EnumDescriptorProto|Object} message EnumDescriptorProto message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.EnumDescriptorProto|Object)): string;

            /**
             * Creates an EnumDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.EnumDescriptorProto} EnumDescriptorProto
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.EnumDescriptorProto;

            /**
             * Creates an EnumDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.EnumDescriptorProto.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.EnumDescriptorProto} EnumDescriptorProto
             */
            static from(object: { [k: string]: any }): google.protobuf.EnumDescriptorProto;

            /**
             * Creates a plain object from an EnumDescriptorProto message. Also converts values to other types if specified.
             * @param {google.protobuf.EnumDescriptorProto} message EnumDescriptorProto
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.EnumDescriptorProto, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this EnumDescriptorProto message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumDescriptorProto to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        /**
         * Constructs a new EnumValueDescriptorProto.
         * @classdesc Describes a value within an enum.
         * @exports google.protobuf.EnumValueDescriptorProto
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class EnumValueDescriptorProto {

            /**
             * Constructs a new EnumValueDescriptorProto.
             * @classdesc Describes a value within an enum.
             * @exports google.protobuf.EnumValueDescriptorProto
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * EnumValueDescriptorProto name.
             * @type {string}
             */
            name: string;

            /**
             * EnumValueDescriptorProto number.
             * @type {number}
             */
            number: number;

            /**
             * EnumValueDescriptorProto options.
             * @type {google.protobuf.EnumValueOptions}
             */
            options: google.protobuf.EnumValueOptions;

            /**
             * Creates a new EnumValueDescriptorProto instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.EnumValueDescriptorProto} EnumValueDescriptorProto instance
             */
            static create(properties?: Object): google.protobuf.EnumValueDescriptorProto;

            /**
             * Encodes the specified EnumValueDescriptorProto message.
             * @param {google.protobuf.EnumValueDescriptorProto|Object} message EnumValueDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.EnumValueDescriptorProto|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumValueDescriptorProto message, length delimited.
             * @param {google.protobuf.EnumValueDescriptorProto|Object} message EnumValueDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.EnumValueDescriptorProto|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumValueDescriptorProto message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.EnumValueDescriptorProto} EnumValueDescriptorProto
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumValueDescriptorProto;

            /**
             * Decodes an EnumValueDescriptorProto message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.EnumValueDescriptorProto} EnumValueDescriptorProto
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumValueDescriptorProto;

            /**
             * Verifies an EnumValueDescriptorProto message.
             * @param {google.protobuf.EnumValueDescriptorProto|Object} message EnumValueDescriptorProto message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.EnumValueDescriptorProto|Object)): string;

            /**
             * Creates an EnumValueDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.EnumValueDescriptorProto} EnumValueDescriptorProto
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.EnumValueDescriptorProto;

            /**
             * Creates an EnumValueDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.EnumValueDescriptorProto.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.EnumValueDescriptorProto} EnumValueDescriptorProto
             */
            static from(object: { [k: string]: any }): google.protobuf.EnumValueDescriptorProto;

            /**
             * Creates a plain object from an EnumValueDescriptorProto message. Also converts values to other types if specified.
             * @param {google.protobuf.EnumValueDescriptorProto} message EnumValueDescriptorProto
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.EnumValueDescriptorProto, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this EnumValueDescriptorProto message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumValueDescriptorProto to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        /**
         * Constructs a new ServiceDescriptorProto.
         * @classdesc Describes a service.
         * @exports google.protobuf.ServiceDescriptorProto
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class ServiceDescriptorProto {

            /**
             * Constructs a new ServiceDescriptorProto.
             * @classdesc Describes a service.
             * @exports google.protobuf.ServiceDescriptorProto
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * ServiceDescriptorProto name.
             * @type {string}
             */
            name: string;

            /**
             * ServiceDescriptorProto method.
             * @type {Array.<google.protobuf.MethodDescriptorProto>}
             */
            method: google.protobuf.MethodDescriptorProto[];

            /**
             * ServiceDescriptorProto options.
             * @type {google.protobuf.ServiceOptions}
             */
            options: google.protobuf.ServiceOptions;

            /**
             * Creates a new ServiceDescriptorProto instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.ServiceDescriptorProto} ServiceDescriptorProto instance
             */
            static create(properties?: Object): google.protobuf.ServiceDescriptorProto;

            /**
             * Encodes the specified ServiceDescriptorProto message.
             * @param {google.protobuf.ServiceDescriptorProto|Object} message ServiceDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.ServiceDescriptorProto|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ServiceDescriptorProto message, length delimited.
             * @param {google.protobuf.ServiceDescriptorProto|Object} message ServiceDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.ServiceDescriptorProto|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ServiceDescriptorProto message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.ServiceDescriptorProto} ServiceDescriptorProto
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.ServiceDescriptorProto;

            /**
             * Decodes a ServiceDescriptorProto message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.ServiceDescriptorProto} ServiceDescriptorProto
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.ServiceDescriptorProto;

            /**
             * Verifies a ServiceDescriptorProto message.
             * @param {google.protobuf.ServiceDescriptorProto|Object} message ServiceDescriptorProto message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.ServiceDescriptorProto|Object)): string;

            /**
             * Creates a ServiceDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.ServiceDescriptorProto} ServiceDescriptorProto
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.ServiceDescriptorProto;

            /**
             * Creates a ServiceDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.ServiceDescriptorProto.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.ServiceDescriptorProto} ServiceDescriptorProto
             */
            static from(object: { [k: string]: any }): google.protobuf.ServiceDescriptorProto;

            /**
             * Creates a plain object from a ServiceDescriptorProto message. Also converts values to other types if specified.
             * @param {google.protobuf.ServiceDescriptorProto} message ServiceDescriptorProto
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.ServiceDescriptorProto, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this ServiceDescriptorProto message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this ServiceDescriptorProto to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        /**
         * Constructs a new MethodDescriptorProto.
         * @classdesc Describes a method of a service.
         * @exports google.protobuf.MethodDescriptorProto
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class MethodDescriptorProto {

            /**
             * Constructs a new MethodDescriptorProto.
             * @classdesc Describes a method of a service.
             * @exports google.protobuf.MethodDescriptorProto
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * MethodDescriptorProto name.
             * @type {string}
             */
            name: string;

            /**
             * FieldDescriptorProto.type_name, but must refer to a message type.
             * @type {string}
             */
            inputType: string;

            /**
             * MethodDescriptorProto outputType.
             * @type {string}
             */
            outputType: string;

            /**
             * MethodDescriptorProto options.
             * @type {google.protobuf.MethodOptions}
             */
            options: google.protobuf.MethodOptions;

            /**
             * Identifies if client streams multiple client messages
             * @type {boolean}
             */
            clientStreaming: boolean;

            /**
             * Identifies if server streams multiple server messages
             * @type {boolean}
             */
            serverStreaming: boolean;

            /**
             * Creates a new MethodDescriptorProto instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.MethodDescriptorProto} MethodDescriptorProto instance
             */
            static create(properties?: Object): google.protobuf.MethodDescriptorProto;

            /**
             * Encodes the specified MethodDescriptorProto message.
             * @param {google.protobuf.MethodDescriptorProto|Object} message MethodDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.MethodDescriptorProto|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MethodDescriptorProto message, length delimited.
             * @param {google.protobuf.MethodDescriptorProto|Object} message MethodDescriptorProto message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.MethodDescriptorProto|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MethodDescriptorProto message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.MethodDescriptorProto} MethodDescriptorProto
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.MethodDescriptorProto;

            /**
             * Decodes a MethodDescriptorProto message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.MethodDescriptorProto} MethodDescriptorProto
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.MethodDescriptorProto;

            /**
             * Verifies a MethodDescriptorProto message.
             * @param {google.protobuf.MethodDescriptorProto|Object} message MethodDescriptorProto message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.MethodDescriptorProto|Object)): string;

            /**
             * Creates a MethodDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.MethodDescriptorProto} MethodDescriptorProto
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.MethodDescriptorProto;

            /**
             * Creates a MethodDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.MethodDescriptorProto.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.MethodDescriptorProto} MethodDescriptorProto
             */
            static from(object: { [k: string]: any }): google.protobuf.MethodDescriptorProto;

            /**
             * Creates a plain object from a MethodDescriptorProto message. Also converts values to other types if specified.
             * @param {google.protobuf.MethodDescriptorProto} message MethodDescriptorProto
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.MethodDescriptorProto, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this MethodDescriptorProto message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this MethodDescriptorProto to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        /**
         * Constructs a new FileOptions.
         * @exports google.protobuf.FileOptions
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class FileOptions {

            /**
             * Constructs a new FileOptions.
             * @exports google.protobuf.FileOptions
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * domain names.
             * @type {string}
             */
            javaPackage: string;

            /**
             * explicitly choose the class name).
             * @type {string}
             */
            javaOuterClassname: string;

            /**
             * top-level extensions defined in the file.
             * @type {boolean}
             */
            javaMultipleFiles: boolean;

            /**
             * will be consistent across runtimes or versions of the protocol compiler.)
             * @type {boolean}
             */
            javaGenerateEqualsAndHash: boolean;

            /**
             * This option has no effect on when used with the lite runtime.
             * @type {boolean}
             */
            javaStringCheckUtf8: boolean;

            /**
             * FileOptions optimizeFor.
             * @type {number}
             */
            optimizeFor: number;

            /**
             * - Otherwise, the basename of the .proto file, without extension.
             * @type {string}
             */
            goPackage: string;

            /**
             * explicitly set them to true.
             * @type {boolean}
             */
            ccGenericServices: boolean;

            /**
             * FileOptions javaGenericServices.
             * @type {boolean}
             */
            javaGenericServices: boolean;

            /**
             * FileOptions pyGenericServices.
             * @type {boolean}
             */
            pyGenericServices: boolean;

            /**
             * least, this is a formalization for deprecating files.
             * @type {boolean}
             */
            deprecated: boolean;

            /**
             * only to generated classes for C++.
             * @type {boolean}
             */
            ccEnableArenas: boolean;

            /**
             * generated classes from this .proto. There is no default.
             * @type {string}
             */
            objcClassPrefix: string;

            /**
             * Namespace for generated classes; defaults to the package.
             * @type {string}
             */
            csharpNamespace: string;

            /**
             * The parser stores options it doesn't recognize here. See above.
             * @type {Array.<google.protobuf.UninterpretedOption>}
             */
            uninterpretedOption: google.protobuf.UninterpretedOption[];

            /**
             * Creates a new FileOptions instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.FileOptions} FileOptions instance
             */
            static create(properties?: Object): google.protobuf.FileOptions;

            /**
             * Encodes the specified FileOptions message.
             * @param {google.protobuf.FileOptions|Object} message FileOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.FileOptions|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FileOptions message, length delimited.
             * @param {google.protobuf.FileOptions|Object} message FileOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.FileOptions|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FileOptions message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.FileOptions} FileOptions
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FileOptions;

            /**
             * Decodes a FileOptions message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.FileOptions} FileOptions
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FileOptions;

            /**
             * Verifies a FileOptions message.
             * @param {google.protobuf.FileOptions|Object} message FileOptions message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.FileOptions|Object)): string;

            /**
             * Creates a FileOptions message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FileOptions} FileOptions
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.FileOptions;

            /**
             * Creates a FileOptions message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.FileOptions.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FileOptions} FileOptions
             */
            static from(object: { [k: string]: any }): google.protobuf.FileOptions;

            /**
             * Creates a plain object from a FileOptions message. Also converts values to other types if specified.
             * @param {google.protobuf.FileOptions} message FileOptions
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.FileOptions, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this FileOptions message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this FileOptions to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        namespace FileOptions {

            /**
             * Generated classes can be optimized for speed or code size.
             * @name OptimizeMode
             * @memberof google.protobuf.FileOptions
             * @enum {number}
             * @property {number} SPEED=1 SPEED value
             * @property {number} CODE_SIZE=2 etc.
             * @property {number} LITE_RUNTIME=3 Use ReflectionOps to implement these methods.
             */
            enum OptimizeMode {
                SPEED = 1,
                CODE_SIZE = 2,
                LITE_RUNTIME = 3
            }
        }

        /**
         * Constructs a new MessageOptions.
         * @exports google.protobuf.MessageOptions
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class MessageOptions {

            /**
             * Constructs a new MessageOptions.
             * @exports google.protobuf.MessageOptions
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * the protocol compiler.
             * @type {boolean}
             */
            messageSetWireFormat: boolean;

            /**
             * from proto1 easier; new code should avoid fields named "descriptor".
             * @type {boolean}
             */
            noStandardDescriptorAccessor: boolean;

            /**
             * this is a formalization for deprecating messages.
             * @type {boolean}
             */
            deprecated: boolean;

            /**
             * parser.
             * @type {boolean}
             */
            mapEntry: boolean;

            /**
             * The parser stores options it doesn't recognize here. See above.
             * @type {Array.<google.protobuf.UninterpretedOption>}
             */
            uninterpretedOption: google.protobuf.UninterpretedOption[];

            /**
             * Creates a new MessageOptions instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.MessageOptions} MessageOptions instance
             */
            static create(properties?: Object): google.protobuf.MessageOptions;

            /**
             * Encodes the specified MessageOptions message.
             * @param {google.protobuf.MessageOptions|Object} message MessageOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.MessageOptions|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MessageOptions message, length delimited.
             * @param {google.protobuf.MessageOptions|Object} message MessageOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.MessageOptions|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MessageOptions message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.MessageOptions} MessageOptions
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.MessageOptions;

            /**
             * Decodes a MessageOptions message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.MessageOptions} MessageOptions
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.MessageOptions;

            /**
             * Verifies a MessageOptions message.
             * @param {google.protobuf.MessageOptions|Object} message MessageOptions message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.MessageOptions|Object)): string;

            /**
             * Creates a MessageOptions message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.MessageOptions} MessageOptions
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.MessageOptions;

            /**
             * Creates a MessageOptions message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.MessageOptions.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.MessageOptions} MessageOptions
             */
            static from(object: { [k: string]: any }): google.protobuf.MessageOptions;

            /**
             * Creates a plain object from a MessageOptions message. Also converts values to other types if specified.
             * @param {google.protobuf.MessageOptions} message MessageOptions
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.MessageOptions, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this MessageOptions message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this MessageOptions to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        /**
         * Constructs a new FieldOptions.
         * @exports google.protobuf.FieldOptions
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class FieldOptions {

            /**
             * Constructs a new FieldOptions.
             * @exports google.protobuf.FieldOptions
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * release -- sorry, we'll try to include it in a future version!
             * @type {number}
             */
            ctype: number;

            /**
             * false will avoid using packed encoding.
             * @type {boolean}
             */
            packed: boolean;

            /**
             * e.g. goog.math.Integer.
             * @type {number}
             */
            jstype: number;

            /**
             * been parsed.
             * @type {boolean}
             */
            lazy: boolean;

            /**
             * is a formalization for deprecating fields.
             * @type {boolean}
             */
            deprecated: boolean;

            /**
             * For Google-internal migration only. Do not use.
             * @type {boolean}
             */
            weak: boolean;

            /**
             * The parser stores options it doesn't recognize here. See above.
             * @type {Array.<google.protobuf.UninterpretedOption>}
             */
            uninterpretedOption: google.protobuf.UninterpretedOption[];

            /**
             * Creates a new FieldOptions instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.FieldOptions} FieldOptions instance
             */
            static create(properties?: Object): google.protobuf.FieldOptions;

            /**
             * Encodes the specified FieldOptions message.
             * @param {google.protobuf.FieldOptions|Object} message FieldOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.FieldOptions|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FieldOptions message, length delimited.
             * @param {google.protobuf.FieldOptions|Object} message FieldOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.FieldOptions|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FieldOptions message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.FieldOptions} FieldOptions
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FieldOptions;

            /**
             * Decodes a FieldOptions message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.FieldOptions} FieldOptions
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FieldOptions;

            /**
             * Verifies a FieldOptions message.
             * @param {google.protobuf.FieldOptions|Object} message FieldOptions message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.FieldOptions|Object)): string;

            /**
             * Creates a FieldOptions message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FieldOptions} FieldOptions
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.FieldOptions;

            /**
             * Creates a FieldOptions message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.FieldOptions.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FieldOptions} FieldOptions
             */
            static from(object: { [k: string]: any }): google.protobuf.FieldOptions;

            /**
             * Creates a plain object from a FieldOptions message. Also converts values to other types if specified.
             * @param {google.protobuf.FieldOptions} message FieldOptions
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.FieldOptions, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this FieldOptions message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this FieldOptions to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        namespace FieldOptions {

            /**
             * CType enum.
             * @name CType
             * @memberof google.protobuf.FieldOptions
             * @enum {number}
             * @property {number} STRING=0 Default mode.
             * @property {number} CORD=1 CORD value
             * @property {number} STRING_PIECE=2 STRING_PIECE value
             */
            enum CType {
                STRING = 0,
                CORD = 1,
                STRING_PIECE = 2
            }

            /**
             * JSType enum.
             * @name JSType
             * @memberof google.protobuf.FieldOptions
             * @enum {number}
             * @property {number} JS_NORMAL=0 Use the default type.
             * @property {number} JS_STRING=1 Use JavaScript strings.
             * @property {number} JS_NUMBER=2 Use JavaScript numbers.
             */
            enum JSType {
                JS_NORMAL = 0,
                JS_STRING = 1,
                JS_NUMBER = 2
            }
        }

        /**
         * Constructs a new EnumOptions.
         * @exports google.protobuf.EnumOptions
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class EnumOptions {

            /**
             * Constructs a new EnumOptions.
             * @exports google.protobuf.EnumOptions
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * value.
             * @type {boolean}
             */
            allowAlias: boolean;

            /**
             * is a formalization for deprecating enums.
             * @type {boolean}
             */
            deprecated: boolean;

            /**
             * The parser stores options it doesn't recognize here. See above.
             * @type {Array.<google.protobuf.UninterpretedOption>}
             */
            uninterpretedOption: google.protobuf.UninterpretedOption[];

            /**
             * Creates a new EnumOptions instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.EnumOptions} EnumOptions instance
             */
            static create(properties?: Object): google.protobuf.EnumOptions;

            /**
             * Encodes the specified EnumOptions message.
             * @param {google.protobuf.EnumOptions|Object} message EnumOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.EnumOptions|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumOptions message, length delimited.
             * @param {google.protobuf.EnumOptions|Object} message EnumOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.EnumOptions|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumOptions message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.EnumOptions} EnumOptions
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumOptions;

            /**
             * Decodes an EnumOptions message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.EnumOptions} EnumOptions
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumOptions;

            /**
             * Verifies an EnumOptions message.
             * @param {google.protobuf.EnumOptions|Object} message EnumOptions message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.EnumOptions|Object)): string;

            /**
             * Creates an EnumOptions message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.EnumOptions} EnumOptions
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.EnumOptions;

            /**
             * Creates an EnumOptions message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.EnumOptions.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.EnumOptions} EnumOptions
             */
            static from(object: { [k: string]: any }): google.protobuf.EnumOptions;

            /**
             * Creates a plain object from an EnumOptions message. Also converts values to other types if specified.
             * @param {google.protobuf.EnumOptions} message EnumOptions
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.EnumOptions, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this EnumOptions message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumOptions to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        /**
         * Constructs a new EnumValueOptions.
         * @exports google.protobuf.EnumValueOptions
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class EnumValueOptions {

            /**
             * Constructs a new EnumValueOptions.
             * @exports google.protobuf.EnumValueOptions
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * this is a formalization for deprecating enum values.
             * @type {boolean}
             */
            deprecated: boolean;

            /**
             * The parser stores options it doesn't recognize here. See above.
             * @type {Array.<google.protobuf.UninterpretedOption>}
             */
            uninterpretedOption: google.protobuf.UninterpretedOption[];

            /**
             * Creates a new EnumValueOptions instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.EnumValueOptions} EnumValueOptions instance
             */
            static create(properties?: Object): google.protobuf.EnumValueOptions;

            /**
             * Encodes the specified EnumValueOptions message.
             * @param {google.protobuf.EnumValueOptions|Object} message EnumValueOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.EnumValueOptions|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumValueOptions message, length delimited.
             * @param {google.protobuf.EnumValueOptions|Object} message EnumValueOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.EnumValueOptions|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumValueOptions message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.EnumValueOptions} EnumValueOptions
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumValueOptions;

            /**
             * Decodes an EnumValueOptions message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.EnumValueOptions} EnumValueOptions
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumValueOptions;

            /**
             * Verifies an EnumValueOptions message.
             * @param {google.protobuf.EnumValueOptions|Object} message EnumValueOptions message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.EnumValueOptions|Object)): string;

            /**
             * Creates an EnumValueOptions message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.EnumValueOptions} EnumValueOptions
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.EnumValueOptions;

            /**
             * Creates an EnumValueOptions message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.EnumValueOptions.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.EnumValueOptions} EnumValueOptions
             */
            static from(object: { [k: string]: any }): google.protobuf.EnumValueOptions;

            /**
             * Creates a plain object from an EnumValueOptions message. Also converts values to other types if specified.
             * @param {google.protobuf.EnumValueOptions} message EnumValueOptions
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.EnumValueOptions, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this EnumValueOptions message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumValueOptions to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        /**
         * Constructs a new ServiceOptions.
         * @exports google.protobuf.ServiceOptions
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class ServiceOptions {

            /**
             * Constructs a new ServiceOptions.
             * @exports google.protobuf.ServiceOptions
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * this is a formalization for deprecating services.
             * @type {boolean}
             */
            deprecated: boolean;

            /**
             * The parser stores options it doesn't recognize here. See above.
             * @type {Array.<google.protobuf.UninterpretedOption>}
             */
            uninterpretedOption: google.protobuf.UninterpretedOption[];

            /**
             * Creates a new ServiceOptions instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.ServiceOptions} ServiceOptions instance
             */
            static create(properties?: Object): google.protobuf.ServiceOptions;

            /**
             * Encodes the specified ServiceOptions message.
             * @param {google.protobuf.ServiceOptions|Object} message ServiceOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.ServiceOptions|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ServiceOptions message, length delimited.
             * @param {google.protobuf.ServiceOptions|Object} message ServiceOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.ServiceOptions|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ServiceOptions message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.ServiceOptions} ServiceOptions
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.ServiceOptions;

            /**
             * Decodes a ServiceOptions message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.ServiceOptions} ServiceOptions
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.ServiceOptions;

            /**
             * Verifies a ServiceOptions message.
             * @param {google.protobuf.ServiceOptions|Object} message ServiceOptions message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.ServiceOptions|Object)): string;

            /**
             * Creates a ServiceOptions message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.ServiceOptions} ServiceOptions
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.ServiceOptions;

            /**
             * Creates a ServiceOptions message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.ServiceOptions.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.ServiceOptions} ServiceOptions
             */
            static from(object: { [k: string]: any }): google.protobuf.ServiceOptions;

            /**
             * Creates a plain object from a ServiceOptions message. Also converts values to other types if specified.
             * @param {google.protobuf.ServiceOptions} message ServiceOptions
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.ServiceOptions, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this ServiceOptions message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this ServiceOptions to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        /**
         * Constructs a new MethodOptions.
         * @exports google.protobuf.MethodOptions
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class MethodOptions {

            /**
             * Constructs a new MethodOptions.
             * @exports google.protobuf.MethodOptions
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * this is a formalization for deprecating methods.
             * @type {boolean}
             */
            deprecated: boolean;

            /**
             * The parser stores options it doesn't recognize here. See above.
             * @type {Array.<google.protobuf.UninterpretedOption>}
             */
            uninterpretedOption: google.protobuf.UninterpretedOption[];

            /**
             * Creates a new MethodOptions instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.MethodOptions} MethodOptions instance
             */
            static create(properties?: Object): google.protobuf.MethodOptions;

            /**
             * Encodes the specified MethodOptions message.
             * @param {google.protobuf.MethodOptions|Object} message MethodOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.MethodOptions|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MethodOptions message, length delimited.
             * @param {google.protobuf.MethodOptions|Object} message MethodOptions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.MethodOptions|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MethodOptions message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.MethodOptions} MethodOptions
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.MethodOptions;

            /**
             * Decodes a MethodOptions message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.MethodOptions} MethodOptions
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.MethodOptions;

            /**
             * Verifies a MethodOptions message.
             * @param {google.protobuf.MethodOptions|Object} message MethodOptions message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.MethodOptions|Object)): string;

            /**
             * Creates a MethodOptions message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.MethodOptions} MethodOptions
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.MethodOptions;

            /**
             * Creates a MethodOptions message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.MethodOptions.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.MethodOptions} MethodOptions
             */
            static from(object: { [k: string]: any }): google.protobuf.MethodOptions;

            /**
             * Creates a plain object from a MethodOptions message. Also converts values to other types if specified.
             * @param {google.protobuf.MethodOptions} message MethodOptions
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.MethodOptions, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this MethodOptions message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this MethodOptions to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        /**
         * Constructs a new UninterpretedOption.
         * @classdesc in them.
         * @exports google.protobuf.UninterpretedOption
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class UninterpretedOption {

            /**
             * Constructs a new UninterpretedOption.
             * @classdesc in them.
             * @exports google.protobuf.UninterpretedOption
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * UninterpretedOption name.
             * @type {Array.<google.protobuf.UninterpretedOption.NamePart>}
             */
            name: google.protobuf.UninterpretedOption.NamePart[];

            /**
             * identified it as during parsing. Exactly one of these should be set.
             * @type {string}
             */
            identifierValue: string;

            /**
             * UninterpretedOption positiveIntValue.
             * @type {number|$protobuf.Long}
             */
            positiveIntValue: (number);

            /**
             * UninterpretedOption negativeIntValue.
             * @type {number|$protobuf.Long}
             */
            negativeIntValue: (number);

            /**
             * UninterpretedOption doubleValue.
             * @type {number}
             */
            doubleValue: number;

            /**
             * UninterpretedOption stringValue.
             * @type {Uint8Array}
             */
            stringValue: Uint8Array;

            /**
             * UninterpretedOption aggregateValue.
             * @type {string}
             */
            aggregateValue: string;

            /**
             * Creates a new UninterpretedOption instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.UninterpretedOption} UninterpretedOption instance
             */
            static create(properties?: Object): google.protobuf.UninterpretedOption;

            /**
             * Encodes the specified UninterpretedOption message.
             * @param {google.protobuf.UninterpretedOption|Object} message UninterpretedOption message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.UninterpretedOption|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UninterpretedOption message, length delimited.
             * @param {google.protobuf.UninterpretedOption|Object} message UninterpretedOption message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.UninterpretedOption|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an UninterpretedOption message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.UninterpretedOption} UninterpretedOption
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UninterpretedOption;

            /**
             * Decodes an UninterpretedOption message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.UninterpretedOption} UninterpretedOption
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UninterpretedOption;

            /**
             * Verifies an UninterpretedOption message.
             * @param {google.protobuf.UninterpretedOption|Object} message UninterpretedOption message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.UninterpretedOption|Object)): string;

            /**
             * Creates an UninterpretedOption message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.UninterpretedOption} UninterpretedOption
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.UninterpretedOption;

            /**
             * Creates an UninterpretedOption message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.UninterpretedOption.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.UninterpretedOption} UninterpretedOption
             */
            static from(object: { [k: string]: any }): google.protobuf.UninterpretedOption;

            /**
             * Creates a plain object from an UninterpretedOption message. Also converts values to other types if specified.
             * @param {google.protobuf.UninterpretedOption} message UninterpretedOption
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.UninterpretedOption, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this UninterpretedOption message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this UninterpretedOption to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        namespace UninterpretedOption {

            /**
             * Constructs a new NamePart.
             * @classdesc "foo.(bar.baz).qux".
             * @exports google.protobuf.UninterpretedOption.NamePart
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class NamePart {

                /**
                 * Constructs a new NamePart.
                 * @classdesc "foo.(bar.baz).qux".
                 * @exports google.protobuf.UninterpretedOption.NamePart
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * NamePart namePart.
                 * @type {string}
                 */
                namePart: string;

                /**
                 * NamePart isExtension.
                 * @type {boolean}
                 */
                isExtension: boolean;

                /**
                 * Creates a new NamePart instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {google.protobuf.UninterpretedOption.NamePart} NamePart instance
                 */
                static create(properties?: Object): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Encodes the specified NamePart message.
                 * @param {google.protobuf.UninterpretedOption.NamePart|Object} message NamePart message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (google.protobuf.UninterpretedOption.NamePart|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified NamePart message, length delimited.
                 * @param {google.protobuf.UninterpretedOption.NamePart|Object} message NamePart message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (google.protobuf.UninterpretedOption.NamePart|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a NamePart message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.UninterpretedOption.NamePart} NamePart
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Decodes a NamePart message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.UninterpretedOption.NamePart} NamePart
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Verifies a NamePart message.
                 * @param {google.protobuf.UninterpretedOption.NamePart|Object} message NamePart message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (google.protobuf.UninterpretedOption.NamePart|Object)): string;

                /**
                 * Creates a NamePart message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.UninterpretedOption.NamePart} NamePart
                 */
                static fromObject(object: { [k: string]: any }): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Creates a NamePart message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link google.protobuf.UninterpretedOption.NamePart.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.UninterpretedOption.NamePart} NamePart
                 */
                static from(object: { [k: string]: any }): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Creates a plain object from a NamePart message. Also converts values to other types if specified.
                 * @param {google.protobuf.UninterpretedOption.NamePart} message NamePart
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: google.protobuf.UninterpretedOption.NamePart, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this NamePart message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this NamePart to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }
        }

        /**
         * Constructs a new SourceCodeInfo.
         * @classdesc FileDescriptorProto was generated.
         * @exports google.protobuf.SourceCodeInfo
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class SourceCodeInfo {

            /**
             * Constructs a new SourceCodeInfo.
             * @classdesc FileDescriptorProto was generated.
             * @exports google.protobuf.SourceCodeInfo
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * be recorded in the future.
             * @type {Array.<google.protobuf.SourceCodeInfo.Location>}
             */
            location: google.protobuf.SourceCodeInfo.Location[];

            /**
             * Creates a new SourceCodeInfo instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.SourceCodeInfo} SourceCodeInfo instance
             */
            static create(properties?: Object): google.protobuf.SourceCodeInfo;

            /**
             * Encodes the specified SourceCodeInfo message.
             * @param {google.protobuf.SourceCodeInfo|Object} message SourceCodeInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.SourceCodeInfo|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SourceCodeInfo message, length delimited.
             * @param {google.protobuf.SourceCodeInfo|Object} message SourceCodeInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.SourceCodeInfo|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SourceCodeInfo message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.SourceCodeInfo} SourceCodeInfo
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.SourceCodeInfo;

            /**
             * Decodes a SourceCodeInfo message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.SourceCodeInfo} SourceCodeInfo
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.SourceCodeInfo;

            /**
             * Verifies a SourceCodeInfo message.
             * @param {google.protobuf.SourceCodeInfo|Object} message SourceCodeInfo message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.SourceCodeInfo|Object)): string;

            /**
             * Creates a SourceCodeInfo message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.SourceCodeInfo} SourceCodeInfo
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.SourceCodeInfo;

            /**
             * Creates a SourceCodeInfo message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.SourceCodeInfo.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.SourceCodeInfo} SourceCodeInfo
             */
            static from(object: { [k: string]: any }): google.protobuf.SourceCodeInfo;

            /**
             * Creates a plain object from a SourceCodeInfo message. Also converts values to other types if specified.
             * @param {google.protobuf.SourceCodeInfo} message SourceCodeInfo
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.SourceCodeInfo, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this SourceCodeInfo message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this SourceCodeInfo to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        namespace SourceCodeInfo {

            /**
             * Constructs a new Location.
             * @exports google.protobuf.SourceCodeInfo.Location
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class Location {

                /**
                 * Constructs a new Location.
                 * @exports google.protobuf.SourceCodeInfo.Location
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * of the label to the terminating semicolon).
                 * @type {Array.<number>}
                 */
                path: number[];

                /**
                 * 1 to each before displaying to a user.
                 * @type {Array.<number>}
                 */
                span: number[];

                /**
                 * ignored detached comments.
                 * @type {string}
                 */
                leadingComments: string;

                /**
                 * Location trailingComments.
                 * @type {string}
                 */
                trailingComments: string;

                /**
                 * Location leadingDetachedComments.
                 * @type {Array.<string>}
                 */
                leadingDetachedComments: string[];

                /**
                 * Creates a new Location instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {google.protobuf.SourceCodeInfo.Location} Location instance
                 */
                static create(properties?: Object): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Encodes the specified Location message.
                 * @param {google.protobuf.SourceCodeInfo.Location|Object} message Location message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (google.protobuf.SourceCodeInfo.Location|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Location message, length delimited.
                 * @param {google.protobuf.SourceCodeInfo.Location|Object} message Location message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (google.protobuf.SourceCodeInfo.Location|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Location message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.SourceCodeInfo.Location} Location
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Decodes a Location message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.SourceCodeInfo.Location} Location
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Verifies a Location message.
                 * @param {google.protobuf.SourceCodeInfo.Location|Object} message Location message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (google.protobuf.SourceCodeInfo.Location|Object)): string;

                /**
                 * Creates a Location message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.SourceCodeInfo.Location} Location
                 */
                static fromObject(object: { [k: string]: any }): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Creates a Location message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link google.protobuf.SourceCodeInfo.Location.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.SourceCodeInfo.Location} Location
                 */
                static from(object: { [k: string]: any }): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Creates a plain object from a Location message. Also converts values to other types if specified.
                 * @param {google.protobuf.SourceCodeInfo.Location} message Location
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: google.protobuf.SourceCodeInfo.Location, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this Location message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this Location to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }
        }

        /**
         * Constructs a new GeneratedCodeInfo.
         * @classdesc source file, but may contain references to different source .proto files.
         * @exports google.protobuf.GeneratedCodeInfo
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class GeneratedCodeInfo {

            /**
             * Constructs a new GeneratedCodeInfo.
             * @classdesc source file, but may contain references to different source .proto files.
             * @exports google.protobuf.GeneratedCodeInfo
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * of its generating .proto file.
             * @type {Array.<google.protobuf.GeneratedCodeInfo.Annotation>}
             */
            annotation: google.protobuf.GeneratedCodeInfo.Annotation[];

            /**
             * Creates a new GeneratedCodeInfo instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.GeneratedCodeInfo} GeneratedCodeInfo instance
             */
            static create(properties?: Object): google.protobuf.GeneratedCodeInfo;

            /**
             * Encodes the specified GeneratedCodeInfo message.
             * @param {google.protobuf.GeneratedCodeInfo|Object} message GeneratedCodeInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.GeneratedCodeInfo|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GeneratedCodeInfo message, length delimited.
             * @param {google.protobuf.GeneratedCodeInfo|Object} message GeneratedCodeInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.GeneratedCodeInfo|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GeneratedCodeInfo message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.GeneratedCodeInfo} GeneratedCodeInfo
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.GeneratedCodeInfo;

            /**
             * Decodes a GeneratedCodeInfo message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.GeneratedCodeInfo} GeneratedCodeInfo
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.GeneratedCodeInfo;

            /**
             * Verifies a GeneratedCodeInfo message.
             * @param {google.protobuf.GeneratedCodeInfo|Object} message GeneratedCodeInfo message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.GeneratedCodeInfo|Object)): string;

            /**
             * Creates a GeneratedCodeInfo message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.GeneratedCodeInfo} GeneratedCodeInfo
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.GeneratedCodeInfo;

            /**
             * Creates a GeneratedCodeInfo message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.GeneratedCodeInfo.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.GeneratedCodeInfo} GeneratedCodeInfo
             */
            static from(object: { [k: string]: any }): google.protobuf.GeneratedCodeInfo;

            /**
             * Creates a plain object from a GeneratedCodeInfo message. Also converts values to other types if specified.
             * @param {google.protobuf.GeneratedCodeInfo} message GeneratedCodeInfo
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.GeneratedCodeInfo, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this GeneratedCodeInfo message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this GeneratedCodeInfo to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        namespace GeneratedCodeInfo {

            /**
             * Constructs a new Annotation.
             * @exports google.protobuf.GeneratedCodeInfo.Annotation
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            class Annotation {

                /**
                 * Constructs a new Annotation.
                 * @exports google.protobuf.GeneratedCodeInfo.Annotation
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                constructor(properties?: Object);

                /**
                 * is formatted the same as SourceCodeInfo.Location.path.
                 * @type {Array.<number>}
                 */
                path: number[];

                /**
                 * Identifies the filesystem path to the original source .proto.
                 * @type {string}
                 */
                sourceFile: string;

                /**
                 * that relates to the identified object.
                 * @type {number}
                 */
                begin: number;

                /**
                 * the last relevant byte (so the length of the text = end - begin).
                 * @type {number}
                 */
                end: number;

                /**
                 * Creates a new Annotation instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {google.protobuf.GeneratedCodeInfo.Annotation} Annotation instance
                 */
                static create(properties?: Object): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Encodes the specified Annotation message.
                 * @param {google.protobuf.GeneratedCodeInfo.Annotation|Object} message Annotation message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encode(message: (google.protobuf.GeneratedCodeInfo.Annotation|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Annotation message, length delimited.
                 * @param {google.protobuf.GeneratedCodeInfo.Annotation|Object} message Annotation message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                static encodeDelimited(message: (google.protobuf.GeneratedCodeInfo.Annotation|Object), writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Annotation message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.GeneratedCodeInfo.Annotation} Annotation
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Decodes an Annotation message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.GeneratedCodeInfo.Annotation} Annotation
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Verifies an Annotation message.
                 * @param {google.protobuf.GeneratedCodeInfo.Annotation|Object} message Annotation message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: (google.protobuf.GeneratedCodeInfo.Annotation|Object)): string;

                /**
                 * Creates an Annotation message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.GeneratedCodeInfo.Annotation} Annotation
                 */
                static fromObject(object: { [k: string]: any }): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Creates an Annotation message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link google.protobuf.GeneratedCodeInfo.Annotation.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.GeneratedCodeInfo.Annotation} Annotation
                 */
                static from(object: { [k: string]: any }): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Creates a plain object from an Annotation message. Also converts values to other types if specified.
                 * @param {google.protobuf.GeneratedCodeInfo.Annotation} message Annotation
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                static toObject(message: google.protobuf.GeneratedCodeInfo.Annotation, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this Annotation message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this Annotation to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                toJSON(): { [k: string]: any };
            }
        }

        /**
         * Constructs a new Empty.
         * @exports google.protobuf.Empty
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class Empty {

            /**
             * Constructs a new Empty.
             * @exports google.protobuf.Empty
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * Creates a new Empty instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.Empty} Empty instance
             */
            static create(properties?: Object): google.protobuf.Empty;

            /**
             * Encodes the specified Empty message.
             * @param {google.protobuf.Empty|Object} message Empty message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.Empty|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Empty message, length delimited.
             * @param {google.protobuf.Empty|Object} message Empty message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.Empty|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Empty message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Empty} Empty
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Empty;

            /**
             * Decodes an Empty message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Empty} Empty
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Empty;

            /**
             * Verifies an Empty message.
             * @param {google.protobuf.Empty|Object} message Empty message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.Empty|Object)): string;

            /**
             * Creates an Empty message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Empty} Empty
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.Empty;

            /**
             * Creates an Empty message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.Empty.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Empty} Empty
             */
            static from(object: { [k: string]: any }): google.protobuf.Empty;

            /**
             * Creates a plain object from an Empty message. Also converts values to other types if specified.
             * @param {google.protobuf.Empty} message Empty
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.Empty, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this Empty message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this Empty to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        /**
         * Constructs a new Struct.
         * @exports google.protobuf.Struct
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class Struct {

            /**
             * Constructs a new Struct.
             * @exports google.protobuf.Struct
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * Struct fields.
             * @type {Object.<string,google.protobuf.Value>}
             */
            fields: { [k: string]: google.protobuf.Value };

            /**
             * Creates a new Struct instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.Struct} Struct instance
             */
            static create(properties?: Object): google.protobuf.Struct;

            /**
             * Encodes the specified Struct message.
             * @param {google.protobuf.Struct|Object} message Struct message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.Struct|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Struct message, length delimited.
             * @param {google.protobuf.Struct|Object} message Struct message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.Struct|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Struct message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Struct} Struct
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Struct;

            /**
             * Decodes a Struct message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Struct} Struct
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Struct;

            /**
             * Verifies a Struct message.
             * @param {google.protobuf.Struct|Object} message Struct message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.Struct|Object)): string;

            /**
             * Creates a Struct message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Struct} Struct
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.Struct;

            /**
             * Creates a Struct message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.Struct.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Struct} Struct
             */
            static from(object: { [k: string]: any }): google.protobuf.Struct;

            /**
             * Creates a plain object from a Struct message. Also converts values to other types if specified.
             * @param {google.protobuf.Struct} message Struct
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.Struct, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this Struct message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this Struct to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        /**
         * Constructs a new Value.
         * @exports google.protobuf.Value
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class Value {

            /**
             * Constructs a new Value.
             * @exports google.protobuf.Value
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * Value nullValue.
             * @type {number}
             */
            nullValue: number;

            /**
             * Value numberValue.
             * @type {number}
             */
            numberValue: number;

            /**
             * Value stringValue.
             * @type {string}
             */
            stringValue: string;

            /**
             * Value boolValue.
             * @type {boolean}
             */
            boolValue: boolean;

            /**
             * Value structValue.
             * @type {google.protobuf.Struct}
             */
            structValue: google.protobuf.Struct;

            /**
             * Value listValue.
             * @type {google.protobuf.ListValue}
             */
            listValue: google.protobuf.ListValue;

            /**
             * Value kind.
             * @name google.protobuf.Value#kind
             * @type {string|undefined}
             */
            kind: (string|undefined);

            /**
             * Creates a new Value instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.Value} Value instance
             */
            static create(properties?: Object): google.protobuf.Value;

            /**
             * Encodes the specified Value message.
             * @param {google.protobuf.Value|Object} message Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.Value|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Value message, length delimited.
             * @param {google.protobuf.Value|Object} message Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.Value|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Value message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Value} Value
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Value;

            /**
             * Decodes a Value message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Value} Value
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Value;

            /**
             * Verifies a Value message.
             * @param {google.protobuf.Value|Object} message Value message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.Value|Object)): string;

            /**
             * Creates a Value message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Value} Value
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.Value;

            /**
             * Creates a Value message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.Value.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Value} Value
             */
            static from(object: { [k: string]: any }): google.protobuf.Value;

            /**
             * Creates a plain object from a Value message. Also converts values to other types if specified.
             * @param {google.protobuf.Value} message Value
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.Value, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this Value message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this Value to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }

        /**
         * NullValue enum.
         * @name NullValue
         * @memberof google.protobuf
         * @enum {number}
         * @property {number} NULL_VALUE=0 NULL_VALUE value
         */
        enum NullValue {
            NULL_VALUE = 0
        }

        /**
         * Constructs a new ListValue.
         * @exports google.protobuf.ListValue
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        class ListValue {

            /**
             * Constructs a new ListValue.
             * @exports google.protobuf.ListValue
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            constructor(properties?: Object);

            /**
             * ListValue values.
             * @type {Array.<google.protobuf.Value>}
             */
            values: google.protobuf.Value[];

            /**
             * Creates a new ListValue instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {google.protobuf.ListValue} ListValue instance
             */
            static create(properties?: Object): google.protobuf.ListValue;

            /**
             * Encodes the specified ListValue message.
             * @param {google.protobuf.ListValue|Object} message ListValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encode(message: (google.protobuf.ListValue|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ListValue message, length delimited.
             * @param {google.protobuf.ListValue|Object} message ListValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            static encodeDelimited(message: (google.protobuf.ListValue|Object), writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ListValue message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.ListValue} ListValue
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.ListValue;

            /**
             * Decodes a ListValue message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.ListValue} ListValue
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.ListValue;

            /**
             * Verifies a ListValue message.
             * @param {google.protobuf.ListValue|Object} message ListValue message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            static verify(message: (google.protobuf.ListValue|Object)): string;

            /**
             * Creates a ListValue message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.ListValue} ListValue
             */
            static fromObject(object: { [k: string]: any }): google.protobuf.ListValue;

            /**
             * Creates a ListValue message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link google.protobuf.ListValue.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.ListValue} ListValue
             */
            static from(object: { [k: string]: any }): google.protobuf.ListValue;

            /**
             * Creates a plain object from a ListValue message. Also converts values to other types if specified.
             * @param {google.protobuf.ListValue} message ListValue
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            static toObject(message: google.protobuf.ListValue, options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Creates a plain object from this ListValue message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

            /**
             * Converts this ListValue to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            toJSON(): { [k: string]: any };
        }
    }
}
