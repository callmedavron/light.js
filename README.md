**light.js** is simplest micro framework, with minimal npm package
--
_How you can use it ?_

1) Create empty project
2) Clone this repo
3) Run npm install path-to-regexp && node sample.js

`path-to-regexp` only 1 package is used in **light.js**

You can create new route with 
.setRoute(path, method, handler) or .get(path, handler) -> .post(), .put(), .patch(), .delete()} 

You can get params from 'GET, POST, PUT, PATCH, DELETE' request like this:
```js
 app.post('/product/:id/update', (req, res) => {
     // req.params is contain params

     let getRequestParams    = req.params.get;  // object,
     let postRequestParams   = req.params.post; // object
     let putRequestParams    = req.params.post; // object
     let patchRequestParams  = req.params.post; // object
     let deleteRequestParams = req.params.post; // object
     
 })
 ```
--
You can use custom res methods like 'send(data, {status: 200, contentType: 'text/html''})', 'json(object, {status: 200, contentType: 'application/json''})' or 'notFound(data)'

1) .send()
```js
    server.get('/', (req, res) => {
        return res.send('Hello, World !', {status: 200});
    })
```
2) .json()
```js
    server.get('/', (req, res) => {
        return res.json({'message': 'Hello, World !'}, {status: 200});
    })
```

3) .notFound()
```js
    server.get('/getProduct/:id', (req, res) => {
        ... You code here
        
        if(!item.exists())
           return res.notFound(`product with id: ${req.params.get.id} not found`, {status: 404});
    })
```


**Default server port is 3000, but you can change it**
server.listen({port: 4000});

**Files**

_'sample.js'_ - is example of light.js

_'light.js'_ - is main file of light.js, in this file you can find routing system and ...

_'extended-http'_ - is extended nodejs default package 'http' with several methods(.send(), .json(), ...)


### TODO LIST
- [x] Server
- [x] Router register server.setRoute(), server.get() .post() .put() .patch() .delete()
- [x] Custom res.send(), res.json(), res.notFound() methods
- [ ] Setup view engine(ejs, ...)
- [ ] Create logger module

**About**

_I made the project for informational purposes, you can take it and upgrade it, 
maybe this project will help you understand how the frameworks works._