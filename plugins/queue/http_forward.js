var http = require('http');

exports.hooks_queue = function(next, connection) {
    var config = this.config.get('http_forward.ini');
    var request = http.request(config.receiver, function(response) {
        if(response.statusCode == 200) {
            next(OK, 'Message delivered to receiver');
        } else {
            next(DENY, 'Message rejected by receiver: ' + http.STATUS_CODES[response.statusCode]);
        }
    });
    
    request.on('error', function(error) {
        next(DENYSOFT, 'Queue failed due to HTTP error');
    });
    
    request.write(connection.transaction.message_stream);
    
    request.end();
}