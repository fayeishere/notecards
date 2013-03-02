/**
 * app.js
 * i do stuff
 * @author faye.purdum
 */

// app.js
//
function isInteger (n) {
    return typeof n === "number" && n % 1 === 0;
};

function isString (s) {
    return typeof s === "string";
};

function valueOrUndefinedOrError (value, check) {
    if (typeof value === "undefined" || check.call(undefined, value)) {
  return value;
    } else {
  throw new Error("Not a valid input value: " + value);
    }
};

function Note (subject, content, id) {
    this.base_url = "/note";
    this.subject = valueOrUndefinedOrError(subject, isString);
    this.content = valueOrUndefinedOrError(content, isString);
    this.id      = valueOrUndefinedOrError(id, isInteger);
};

// WTF IS THIS AND HOW IS IT USED?
// http://stackoverflow.com/questions/1535631/static-variables-in-javascript
// http://stackoverflow.com/questions/7307243/how-to-declare-a-static-variable-in-javascript
// OUR BASE CLASS, NOTE (which is a function), has some public variables:
// base_url, subject, content, id
// WE CAN ACCESS these public static variables in any of the prototypes,
// MEANING that the variables will hold their values across prototypes


Note.prototype.url = function() {
  return this.base_url + "/" + this.id;
};

Note.prototype.toJSON = function() {
    var this_note = {"subject": this.subject, "content": this.content};
    if (isInteger(this.id)) {
  this_note.id = this.id;
    }
    return JSON.stringify(this_note);
};

Note.prototype.fetch = function () {
    // THIS is current note object
    // THIS currently has no id, subject or content set
    // we are now going to fetch data from the DB (via our REST API) to set our note object, THIS
    $.ajax({
        url: this.base_url + "/" + $("#numba").val(),
        dataType: 'json',
        type: 'GET',
        success: function(data){
            // YAY! FOUND THE RECORD ... you can set the ID now
            this.id = data['id'];
            this.subject = data['subject'];
            this.content = data['content'];
            $("#content").html("<div class='alert alert-info'><strong>GET</strong> id:" + this.id + ", " + this.subject+", "+ this.content+"</div>");
            // str += "id:" + data[index]["id"] + ", subject: " + subject + ", content:"+ content + "<br>";
            // note.fetchAll();
            $("#txt-subject").val(this.subject);
            $("#txt-content").val(this.content);
            console.log("what");
        },
        error: function(data){
            // :( SHOW ERROR: id not found ... don't set the ID
            $("#content").html("<div class='alert alert-info'><strong>YOU'RE DOING IT WRONG</strong> no note found with that id</div>");
        }
    });
};

Note.prototype.save = function () {
    this.id = $("#numba").val();
    var http_method;
    if (this.id=="") {
        http_method = "PUT";
        target = "";
    }
    else {
        http_method = "POST";
        var target = "/" + this.id;

    };
    $.ajax({
        url: this.base_url + target,
        dataType: "json",
        data: this.toJSON(),
        success: function (data) {
            $("#content").html("<div class='alert alert-info'><strong>Yar!</strong></div>");
        },
        error: function(data){
            // FAIL - no save to the db
            $("#content").html("<div class='alert alert-info'><strong>WE'RE DOING IT WRONG</strong> we weren't able to save. take a break. try again later.</div>");
        },
        type: http_method,
        context: this
    });
};

Note.prototype.destroy = function () {
    // TODO
    $.ajax({
      url: this.url(),
      dataType: "json",
      data: this.toJSON(),
      success: function () {},
      type: "DELETE",
      context: this
    });
}; // FIXME: I don't know if this works!


$("#numba").on('change', function(event){
    note.fetch();
    // debugger;
});
$("#myform").on('submit', function(event){
    // on the form's submit do this:
    // stop the normal action

    event.preventDefault();
    // assign the form to a var
    // var myForm = event.currentTarget;
    console.log("Yar");
    // take the contents of the form    and assign them
    // to the note

    note.subject = $("#txt-subject").val();
    note.content = $("#txt-content").val();

    note.save();
});



note = new Note();

// var mediator = {};
// mediator.addEventListener('Note: fetched', refresh); // ?
