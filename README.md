<!-- [![NPM Package][npm-badge]][npm-link] -->
<p align="left">
	<a href="https://www.npmjs.com/package/adonis-nunjucks"><img src="https://img.shields.io/npm/v/adonis-nunjucks.svg" alt="NPM"></a>
	<a href="https://npmcharts.com/compare/adonis-nunjucks?minimal=true"><img src="https://img.shields.io/npm/dt/adonis-nunjucks.svg" alt="NPM"></a>
<a href="https://app.fossa.io/projects/git%2Bgithub.com%2Fdevanandb%2Fadonis-nunjucks?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdevanandb%2Fadonis-nunjucks.svg?type=shield"/></a>
	<a href="https://www.npmjs.com/package/adonis-nunjucks"><img src="https://img.shields.io/npm/l/adonis-nunjucks.svg" alt="NPM"></a>
	<a href="https://www.npmjs.com/package/adonis-nunjucks"><img src="http://inch-ci.org/github/devanandb/adonis-nunjucks.svg?branch=master"></a>
	<a href="http://hits.dwyl.io/devanandb/adonis-nunjucks"><img src="http://hits.dwyl.io/devanandb/adonis-nunjucks.svg" alt="HitCount"></a>
</p>


# Adonis Nunjucks

[Nunjucks](https://mozilla.github.io/nunjucks/) templating provider for AdonisJs framework version 4.

## Installation

In order to use adonis-nunjucks

```
npm install adonis-nunjucks --save
```

Once you have installed the provider from [npm](https://npmjs.org/packages/adonis-nunjucks), make sure that the ViewProvider is registered as a provider inside start/app.js file.

```javascript
const providers = [
  'adonis-nunjucks/providers/ViewProvider'
]
```

Make sure the default edge provider (`@adonisjs/framework/providers/ViewProvider`) is not registered as they will conflict with each other.

#### Compatibility

*This package has been rebuilt for Adonis 4 and is incompatible with Adonis 3 and earlier. 
For Adonis v3 install the previous version (3.01) with :*

```
npm install adonis-nunjucks --save
```

<!-- ## Config

Nunjucks options can be added to `config/nunjucks.js`, these will be passed to the nunjucks engine:

```javascript
  module.exports = {
    pretty: false,
    cache: false, // Recommend setting this to true for 10x big performance boost
    doctype: undefined,
    filters: undefined,
    self: false,
    debug: false
  }
``` -->


## Basic Usage

Let’s start with the basic example of saying `Hello world` by rendering a nunjucks template. All of the views are stored inside `resources/views` directory and end with `.html` extension.

Create a nunjucks template at `resources/views/hello.html`. You can use an adonis/ace command to create the view.

```sh
adonis make:nunjucks home

    ✔ create  resources/views/home.html
```

Now let's create a route that renders it:

```javascript
Route.get('/', ({ view }) => {
  return view.render('home')
})
```

The view.render method takes the relative path to the view file. There is no need to type .html extension.


## View Methods

These methods are available on the view context object in controllers and middleware.

#### view.share(locals)
Share variables as a local with this template context.


| Param | Type | Description |
| --- | --- | --- |
| locals | <code>Object</code> | Key value pairs |

###### *Example*

Quite often you want to share request specific values with your views, this can be done in middleware or controllers by passing an object to the share method.

```javascript
class SomeMiddleware {
  async handle ({ view }, next) {
    view.share({
      apiVersion: request.input('version')
    })

    await next()
  }
}
```

Inside your views, you can access it like any other variable

```nunjucks
{{apiVersion}}
```

#### view.render(template, locals) ⇒ <code>String</code>
Render a nunjucks template

**Returns**: <code>String</code> - HTML rendered output  

| Param | Type | Description |
| --- | --- | --- |
| template | <code>String</code> | View file (.html extension not required) |
| locals | <code>Object</code> | Variables to be passed to the view |

#### view.renderString(string, locals) ⇒ <code>String</code>
Render a string of nunjucks

**Returns**: <code>String</code> - HTML rendered output  

| Param | Type | Description |
| --- | --- | --- |
| string | <code>String</code> | String to be rendered |
| locals | <code>Object</code> | Variables to be passed to the view |


## View Helpers

A number of global methods and contextual helpers are injected into all views.

### Request

All views have access to the current request object, and you can call request methods inside your templates as well.

```nunjucks
The request URL is {% request.url() %}
```

Also, there is a direct helper to get the URL.

```nunjucks
The request URL is {% url %}
```

<!-- ### style - *formerly css (deprecated)*

Add link tag to a CSS file. The file name should be relative from the public directory. Absolute links are left alone (for external CDNs etc)

``` nunjucks
// Renders <link rel='stylesheet' href="{{ style }}">
``` -->

<!-- ### script

Similar to css, adds a script tag to the document

``` nunjucks
!= script('my-script')
// Renders <script type="text/javascript" src="/my-script.js"></script>'
```

### assetsUrl
Returns path of a file relative from the public directory.

```nunjucks
img(src=assetsUrl('logo.png'))
// Renders <img src='/logo.png' />
``` -->

<!-- ### route
Get actual URL for a route

Expecting the route to be registered as following

```javascript
Route.get('users/:id', 'UserController.show').as('profile')
```

```nunjucks
a(href=route('profile', { id: 1 })) View Profile
// Renders <a href="/users/1">View Profile</a>
```

Also, you can use the controller method name.

```nunjucks
a(href="route('UserController.show', { id: 1 }) View profile
```

### auth
If you are using the auth provider, then you can access the current logged in user using the `auth.user` object.

### csrfField
If you are using the shield middleware, you can access the `csrfToken` and field using one of the following methods.

```nunjucks
!= csrfField()
// Renders <input type="hidden" name="_csrf" value="..." />
```

### cspMeta

When using shield middleware, the CSP headers are set automatically. However can also set them using HTML meta tags.

```nunjucks
head
  != cspMeta()
```

## Extending views

You can also extend views by adding your own view globals. Globals should only be added once, so make sure to use the start/hooks.js file and add them using the after providersBooted hook.

### Globals

``` javascript
const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const View = use('View')

  View.global('currentTime', function () {
    return new Date().getTime()
  })
})
```

Above global returns the current time when you reference it inside the views.

```nunjucks
p The time is #{currentTime()}
```

You can extract the code inside providersBooted to a different file and require it.

### Globals scope

The value of `this` inside globals closure is bound to the template context so that you can access runtime values from it.

To use other global methods or values, make use of the this.globals object.

```javascript
View.global('messages', {
  success: 'This is a success message',
  warning: 'This is a warning message'
})

View.global('getMessage', function (type) {
  return this.globals.messages[type]
})
```

```nunjucks
p= getMessage('success')
// Renders <p>This is a success message</p>
``` -->

### More documentation coming soon.


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdevanandb%2Fadonis-nunjucks.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdevanandb%2Fadonis-nunjucks?ref=badge_large)


[npm-badge]: https://img.shields.io/npm/v/adonis-nunjucks.svg?maxAge=30
[npm-link]:https://npmjs.com/package/adonis-nunjucks


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdevanandb%2Fadonis-nunjucks.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdevanandb%2Fadonis-nunjucks?ref=badge_large)