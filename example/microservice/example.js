// server example
let server = new Server(config.server);
let userEvents = server.events.subscribe('user');
let service = new Service(userEvents, server.logger);
server.middleware.push(logging); // Logging is custom middleware
server.endpoints.register.middleware.push(logTime); // custom middleware
yield server.bind(service);
yield server.start();

// client example
let client = new Client(config.client);
let service = yield client.connect();
let res = yield service.get({ id: 'admin' }).retry(10).timeout(1000);
