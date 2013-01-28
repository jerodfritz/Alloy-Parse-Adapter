
/*
 Method to HTTP Type Map
 */
var methodMap = {
  'create' : 'POST',
  'update' : 'PUT',
  'delete' : 'DELETE',
  'read' : 'GET'
};

function InitAdapter(config) {
 //
}

function Sync(model, method, opts) {
  Ti.API.info("model get objectId " + model.get('objectId'));
  Ti.API.info("model get id " + model.get('id'));
  Ti.API.info("model id " + model.id);
  var object_id = model.id || opts.id || model.get('id') || model.get('objectId') ;
  var application_id = Ti.App.Properties.getString('PARSE_APP_ID') || model.config.settings.PARSE_APP_ID;
  var rest_api_key = Ti.App.Properties.getString('PARSE_REST_API_KEY') || model.config.settings.PARSE_REST_API_KEY;
  var api_version = Ti.App.Properties.getString('PARSE_API_VERSION') || model.config.settings.PARSE_API_VERSION;
  var class_name = model.config.settings.class_name;

  // create request parameteres
  var type = methodMap[method];
  opts || ( opts = {});
  var base_url = "https://api.parse.com/" + api_version + "/classes";
  var url = base_url + "/" + class_name + "/";
  if (object_id) {
    url = url + object_id;
    switch(method){
      case 'create':
        type = methodMap['update'];
      break;
    }
  }
  

  //Setup data
  var data = false;
  if (!opts.data && model && (method == 'create' || method == 'update')) {
    data = JSON.stringify(model.toJSON());
  } else if (opts.query && method == "read") { //https://www.parse.com/docs/rest#queries
    var query = "?where=" + JSON.stringify(opts.query);
    url += query;
  }

  var xhr = Titanium.Network.createHTTPClient();
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        var response;
        try {
          response = JSON.parse(xhr.responseText);
        } catch (e) {
          Ti.API.info("parse.js : Response Parse Exception")
          opts.error && opts.error(e);
        }
        if (response) {
          var returnData = response; 
          switch(method){
            case 'create':
              if (!model.id) {
                Ti.API.info("Need to set the model.id to " + response.objectId)
                model.id = response.objectId;
                model.set('objectId', model.id);
              }    
              break;
            case 'read': // Return the results array specifically on read operations
              if(!response.objectId){
                returnData = [];
                for (var i in response.results) {
                  response.results[i].id = response.results[i].objectId;
                  returnData.push(response.results[i]);
                }
                  
              }
              model.trigger("fetch");
              break;
            default:
              //returnData = response;
              break;
          }
          opts.success && opts.success(returnData);
        }
      } else {
        Ti.API.info("parse.js : Error HTTP Status " + xhr.status + " : " + xhr.responseText)
        opts.error && opts.error(xhr.responseText);
      }
    }
  };
  Ti.API.info("------------");
  Ti.API.info("model: " + JSON.stringify(model.toJSON()));
  Ti.API.info("method: " + method);
  Ti.API.info("opts:" + JSON.stringify(opts));
  Ti.API.info("object_id: " + object_id)
  Ti.API.info("data:" + data);
  Ti.API.info("type:" + type);
  Ti.API.info("url:" + url);
  
  xhr.open(type, url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("X-Parse-Application-Id",application_id);
  xhr.setRequestHeader("X-Parse-REST-API-Key",rest_api_key);
  xhr.send(data);
}

module.exports.sync = Sync, module.exports.beforeModelCreate = function(config) {
    return config = config || {}, config.data = {}, InitAdapter(config), config;
}, module.exports.afterModelCreate = function(Model) {
    return Model = Model || {}, Model.prototype.config.Model = Model, Model;
};