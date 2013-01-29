/**
 * Example of a Alloy Model to support Parse.com API
 *
 * We have created a model framework that should support using a common REST API adapter and
 * not a customized adapter for parse, we strive to stay true to backbone and keep the
 * logic out of the adapter and here in the models so we
 *
 * Aaron K. Saunders
 * blog.clearlyinnovative.com
 * twitter: @aaronksaunders
 *
 */
exports.definition = {
    config : {
        "columns" : {
        },
        "defaults" : {},
        "adapter" : {
            "type" : "restapi",
            "collection_name" : "User",
        },
        "settings" : {
            headers : {
                "X-Parse-Application-Id" : 'GRIoAKWUExfsT1q37Uyt66h4Lmx9ovvBAv2qigIw',
                "X-Parse-REST-API-Key" : '3vt0buEpMRbIQ6p8OWVwBvgt6ZEKQN5rdjmiqmqR',
            },
            PARSE_API_VERSION : '1',
            class_name : "users"
        },
        _url : function(_model) {
            var base_url = "https://api.parse.com/" + this.settings.PARSE_API_VERSION;
            return base_url + "/" + this.settings.class_name + "/" + (_model && _model.id || "");

        }
    },
    /**
     *
     * USER MODEL
     *
     */
    extendModel : function(Model) {
        _.extend(Model.prototype, {
            idAttribute : "objectId",
            /**
             * construct the proper URL
             */
            url : function() {
                debugger;
                var model = this;
                return this.config._url(model);
            },
            /**
             * just a passthruu, but of we needed to post-process
             * the data, it would be done here
             */
            parse : function(_response) { debugger;
                // ALWAYS delete the returned password
                delete _response["password"];
                delete this.attributes["password"];
                return _response;
            },
            /**
             * 
             */
            login : function(_opts) { debugger;

                var model = this;
                
                // change the url since we are logging in
                _opts.url = "https://api.parse.com/" + this.config.settings.PARSE_API_VERSION + "/login";
                _opts.data = {
                    "username" : this.get("username"),
                    "password" : this.get("password"),
                };
                model.fetch(_opts);
                return
            }
        });
        // end extend
        return Model;
    },
    /**
     *
     * USER COLLECTION
     *
     */
    extendCollection : function(Collection) {
        _.extend(Collection.prototype, {
            /**
             * construct the proper URL
             */
            url : function() { debugger;
                return this.config._url();
            },
            /**
             * just a passthruu, but of we needed to post-process
             * the data, it would be done here
             */
            parse : function(_response) {
                return _response.results;
            },
        });
        // end extend
        return Collection;
    }
}