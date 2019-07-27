const qs           = require('querystring');
const http         = require('./extended-http');
const pathToRegexp = require('path-to-regexp');

class Light {

    constructor() {
        // array with all routes
        this.routes = [];
    }

    /** `listen` to start our server **/
    listen({port = 3000} = {}) {
        http.createServer((request, response) => {

            // If request for favicon.icon we return only headers
            if (request.url === '/favicon.ico') {
                return response.onlyHeader({status: 200, contentType: 'image/x-icon'});
            }

            // Init variables
            let postData = [];
            let data;
            let active = this._execute({path: request.url, method: request.method});

            // If current route is not match with some item from this.routes, we return error
            if (!active) {
                return response.notFound('bad url');
            }

            // Here we get all request params
            request.on('data', chunk => postData.push(chunk));
            request.on('end', () => {
                data = Buffer.concat(postData);
                postData = qs.parse(data.toString());
                this.run();
            });

            // We call handler with params
            this.run = () => {
                request.params = {post: postData, get: active.getParams};
                active.handler(request, response);
            };

        }).listen(port);
    }

    /** `setRoute` to set new route **/
    setRoute(pattern, method, handler) {

        let exist = this.routes.findIndex(item => Object.keys(item)[0] === pattern);

        if (exist !== -1) {
            if (!this.routes[exist][pattern].hasOwnProperty(method)) {
                this.routes[exist][pattern].push({
                    [method]: {
                        handler: handler
                    }
                });
            }
        } else {
            this.routes.push({
                [pattern]: [{
                    [method]: {
                        handler: handler
                    }
                }]
            });
        }
    }

    /** `get()` to set new route for `GET` request **/
    get(pattern, handler) {
        this.setRoute(pattern, 'GET', handler);
    }

    /** `put()` to set new route for `PUT` request **/
    put(pattern, handler) {
        this.setRoute(pattern, 'PUT', handler);
    }

    /** `post()` to set new route for `POST` request **/
    post(pattern, handler) {
        this.setRoute(pattern, 'POST', handler);
    }

    /** `patch()` to set new route for `PATCH` request **/
    patch(pattern, handler) {
        this.setRoute(pattern, 'PATCH', handler);
    }

    /** `delete()` to set new route for `PATCH` request **/
    delete(pattern, handler) {
        this.setRoute(pattern, 'DELETE', handler);
    }

    /** `execute` for find route and get params is they have **/
    _execute({path, method}) {

        // Init variables
        let reg;
        let activeRoute;
        let getParams;
        let needRoute;

        // Iterate over of all routes
        for (let route of this.routes) {

            // Get key of current route as string
            let pattern = Object.keys(route)[0];

            // Create validation
            reg = pathToRegexp(pattern).exec(path);

            // If route without params
            if (path === pattern) {

                needRoute = route[pattern].findIndex(item => item[method]);

                // If needRoute finded
                if (needRoute !== -1 && route.hasOwnProperty(pattern) && route[pattern][needRoute].hasOwnProperty(method)){
                    activeRoute = route[pattern][needRoute][method];
                }

                // get params
                getParams = this._parseGetParams({pattern, path});

                break;
            } else {

                needRoute = route[pattern].findIndex(item => item[method]);

                // Check reg is not null, route has property[path] and route[path] has property[method]
                if (needRoute !== -1 && reg && route.hasOwnProperty(pattern) && route[pattern][needRoute].hasOwnProperty(method)) {
                    activeRoute = route[pattern][needRoute][method];

                    // get params
                    getParams   = this._parseGetParams({pattern, path});
                    break;
                }
            }
        }

        // If route is not match any `IF` we return null
        if (!activeRoute)
            return null;

        return {
            getParams,
            handler: activeRoute.handler
        };
    }

    /** `_parseGetParams` parse get params with pathToRegexp npm module **/
    _parseGetParams({pattern, path}) {

        // Init variables
        let keys   = [];
        let params = {};
        let match  = pathToRegexp(pattern, keys).exec(path);

        // If path is match to pattern
        if (match) {

            // Iterate over of all matches
            match.forEach((item, index) => {
                let key = keys[index - 1];
                if (key !== undefined) {
                    params[key.name] = match[index];
                }
            });
        }
        return params;
    }
}

module.exports = Light;