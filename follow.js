/*
 *  Ajax plugin for supporting NUI interactions
 */

var url = 'http://localhost:3000';

(function ($) {
  $.fn.broker = function (params) {
    var now = (new Date()).getTime();
    params = $.extend({
        name:         this.attr('id'),
        listen:       false,
        callback:     null,
        timestamp:    (new Date()).getTime() 
      },
      params
    );

    this.each(function () {
      if (params.follow) {}
      else if (params.listen) {

        // create thing
        post(
          url+"/thing", 
          '{ "thing": { "name": "'+params.name+'", "following": [] } }'
        );

        // update thing parent
        if (params.parent) {      
          post(
            url+"/thing/"+params.name, 
            '{ "thing": { "name": "'+params.name+'", "following": ["'+params.parent+'"] } }'
          );
        }

        get(params.name);
      } else create(params);
    }); 

    function get(name) {
      $.ajax({
        type: "GET",
        crossDomain: true,
        url: url+"/thing/"+name+"/events",
        dataType: "JSON",   
        success: function(json) {
          update(json, name);
        }
      });    
    }

    function update(json, name) {
      console.log(json);
      setTimeout(function(){ get(name); }, 250);
    }

    function post(url, data) {
      $.ajax({
        type: "POST",
        crossDomain: true,
        url: url,
        data: data,
        contentType: "application/json",
        dataType: "JSON",
        error: function (json) { error(json) },
      });             
    }

    function error(json) {
      console.log(json);
    }
  };
})(jQuery);