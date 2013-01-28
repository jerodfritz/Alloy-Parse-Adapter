exports.definition = {
  config : {
    "columns" : {
      "active" : "boolean"
    },
    "defaults" : {},
    "adapter" : {
      "type" : "parse",
      "collection_name" : "Books",
    },
    "settings" : {
      PARSE_APP_ID : 'jVG6mO9NLTOXYuJLz2ObPj2QHySQKNRXZrpoLdBv',
      PARSE_REST_API_KEY : 'SBIZEdmAZqB3ssmpCqiywYgn5y0aOZO3yQiHxkFW',
      PARSE_API_VERSION : '1',
      class_name : "Books"
    }
  },
  extendModel : function(Model) {
    _.extend(Model.prototype, {
    });
    // end extend
    return Model;
  },

  extendCollection : function(Collection) {
    _.extend(Collection.prototype, {
    });
    // end extend
    return Collection;
  }
}