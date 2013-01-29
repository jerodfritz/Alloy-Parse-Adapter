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
            "collection_name" : "Books",
        },
        "settings" : {
            headers : {
                "X-Parse-Application-Id" : 'GRIoAKWUExfsT1q37Uyt66h4Lmx9ovvBAv2qigIw',
                "X-Parse-REST-API-Key" : '3vt0buEpMRbIQ6p8OWVwBvgt6ZEKQN5rdjmiqmqR',
            },
            PARSE_API_VERSION : '1',
            class_name : "Books"
        },
        _url : function(_model) {
            var base_url = "https://api.parse.com/" + this.settings.PARSE_API_VERSION + "/classes";
            return base_url + "/" + this.settings.class_name + "/" + (_model && _model.id || "");

        }
    },
    /**
     *
     * BOOK MODEL
     *
     */
    extendModel : function(Model) {
        _.extend(Model.prototype, {
            idAttribute : "objectId",
            /**
             * construct the proper URL
             */
            url : function() {
                var model = this;
                return this.config._url(model);
            },
            /**
             * just a passthruu, but of we needed to post-process
             * the data, it would be done here
             */
            parse : function(_response) { debugger;
                return _response;
            },
        });
        // end extend
        return Model;
    },
    /**
     *
     * BOOK COLLECTION
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