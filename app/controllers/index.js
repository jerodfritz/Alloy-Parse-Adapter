//
// One  way to set the headers, see the model file for another
//
if (false) {
    var debug_responses = {
        success : function(response) { debugger;
            Ti.API.info('success: ' + JSON.stringify(response));
        },
        error : function(response) {
            Ti.API.info('error: ' + JSON.stringify(response));
        }
    };

    // add the auth headers, move to model
    _.extend(debug_responses, {
        headers : Alloy.createCollection('Book').config.settings.headers
    });

    $.index.open();

    $.table.updateContent = function(collection) {
        var rows = [];
        for (var i = 0; i < collection.length; i++) {
            var model = collection.at(i).attributes, title = "";
            for (var key in model) {
                if (key !== "id") {
                    title += model[key] + "  "
                }
            }
            rows.push(Ti.UI.createTableViewRow({
                title : title
            }));
        }
        this.setData(rows);
    };

    var books = Alloy.createCollection('Book');

    books.on("sync fetch change", function() { debugger;
        $.table.updateContent(books);
    });

    // add aquery parameter
    params = _.clone(debug_responses);
    params["data"] = {
        "where" : JSON.stringify({
            "book" : "Time Book"
        })
    };
    books.fetch(params);
    // Freshen Table

    var book = Alloy.createModel('Book', {
        "objectId" : "sIawhytsmr"
    });
    //book.fetch(debug_responses);

    //book.save({},debug_responses);
    Ti.API.info(JSON.stringify(book));
}
//
// USER TESTING
//

var user = Alloy.createModel('User', {
    "username" : "aaronCI",
    "email" : "aaron@clearlyinnovative.com",
    "password" : "password123"
});

// user callback functions
var user_responses = {
    success : function(response) { debugger;
        Ti.API.info('success: ' + JSON.stringify(response));
    },
    error : function(response) {
        Ti.API.info('error: ' + JSON.stringify(response));
    }
};
// add the auth headers, move to model
_.extend(user_responses, {
    headers : user.config.settings.headers
});

//user.save({}, user_responses); 
user.login(user_responses);
