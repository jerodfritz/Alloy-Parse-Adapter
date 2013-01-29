//
// blog.clearlyionnovative.com
// twitter: @aaronksaunders
//
//

function InitAdapter(config) {
    return {};
}

function apiCall(_options, _callback) {

    var xhr = Ti.Network.createHTTPClient({
        timeout : 5000
    });

    //Prepare the request
    xhr.open(_options.type, _options.url);

    xhr.onload = function() {

        var data = null;

        try {
            data = JSON.parse(xhr.responseText);
        } catch (EE) {
        }
        _callback({
            success : true,
            text : xhr.responseText || null,
            data : data || null
        });
    };

    //Handle error
    xhr.onerror = function() {
        _callback({
            'success' : false,
            'text' : xhr.responseText
        });
        Ti.API.error('fetch apiCall ERROR: ' + xhr.responseText)
    }
    for (var header in _options.headers) {
        xhr.setRequestHeader(header, _options.headers[header]);
    }

    if (_options.beforeSend) {
        _options.beforeSend(xhr);
    }

    xhr.send(_options.data || {});
}

function Sync(model, method, opts) { debugger;

    var methodMap = {
        'create' : 'POST',
        'read' : 'GET',
        'update' : 'PUT',
        'delete' : 'DELETE'
    };

    var type = methodMap[method];
    var params = _.extend({}, opts);
    params.type = type;

    //set default headers
    params.headers = params.headers || {};

    // We need to ensure that we have a base url.
    if (!params.url) {
        params.url = model.url();
        if (!params.url) {
            Ti.API.error("fetch ERROR: NO BASE URL");
            return;
        }
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Alloy.Backbone.emulateJSON) {
        params.contentType = 'application/x-www-form-urlencoded';
        params.processData = true;
        params.data = params.data ? {
            model : params.data
        } : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Alloy.Backbone.emulateHTTP) {
        if (type === 'PUT' || type === 'DELETE') {
            if (Alloy.Backbone.emulateJSON)
                params.data._method = type;
            params.type = 'POST';
            params.beforeSend = function(xhr) {
                params.headers['X-HTTP-Method-Override'] = type
            };
        }
    }

    //json data transfers
    params.headers['Content-Type'] = 'application/json';

    /*
     *
     */
    var callbackOptions = function(_resp) {
        if (_resp.success) {
            params.success(_resp.data || _resp.text, _resp.text);
        } else {
            params.error(JSON.parse(_resp.text), _resp.text);
            Ti.API.error(" ERROR: " + _resp.text);
            model.trigger("error");
        }
    };

    if (!opts.data && model && (method == 'create' || method == 'update')) {
        params.data = JSON.stringify(model.toJSON());
    } else if (opts.data) {
        // add any of the extras as parameters on the URL,
        // this content should be JSON objects converted
        // to strings
        var query = "";
        for (var i in opts.data) {
            query += i + "=" + opts.data[i] + "&";
        }

        // add the params, remove trailing "&"
        params.url += "?" + query.substring(0, query.length - 1);

        Ti.API.debug('THE URL ' + params.url);

        // no data, it is all on URL
        params.data = {};
    }

    switch (method) {
        case "delete":
        case "update":
            apiCall(params, function(_r) {
                callbackOptions(_r);
                _r ? model.trigger("fetch change sync") : model.trigger("error");
            });
            break;
        case "create":
            apiCall(params, function(_r) {
                callbackOptions(_r);
                _r ? model.trigger("fetch sync") : model.trigger("error");
            });
            break;
        case "read":
            apiCall(params, function(_r) {
                callbackOptions(_r);
                _r ? model.trigger("fetch sync") : model.trigger("error");
            });
            break;
    }

};

//we need underscore
var _ = require("alloy/underscore")._;

module.exports.sync = Sync;

module.exports.beforeModelCreate = function(config) {
    config = config || {};
    InitAdapter(config);
    return config;
};

module.exports.afterModelCreate = function(Model) {
    Model = Model || {};
    Model.prototype.config.Model = Model;
    return Model;
};
