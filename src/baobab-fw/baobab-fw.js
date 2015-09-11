window.baobabFw = (function(){

    var baobabFw = function(){}

    baobabFw.prototype.createSocket = function(main, io, apis){
        var host = window.location.origin;
        // host = 'http://127.0.0.1:60603/';

        return new (function(main, io, host, apis){
            _this = this;
            this.main = main;
            this.apis = apis;
            this.temporaryApis = {};
            this.temporaryApis = require('../../lib/temporaryApis.js');

            _this.socket = io.connect( host );
            this.send = function(api, data, callback){
                var args = {
                    api: api ,
                    data: data ,
                    callback: _this.temporaryApis.addNewFunction(callback)
                };
                this.socket.emit('command',args);
                return this;
            }
            _this.socket.on('command', function (cmd) {
                // console.log(cmd);
                cmd = cmd || {};
                cmd.api = cmd.api || '';
                cmd.data = cmd.data || {};
                cmd.callback = cmd.callback || null;

                var api = _this.temporaryApis.getCallbackFunction(cmd.api);
                var temporaryApiName = cmd.callback;

                if( !api && _this.apis[cmd.api] ){
                    api = _this.apis[cmd.api];
                }
                if(api){
                    api( cmd.data, function(data){
                        _this.temporaryApis.callRemoteFunction( _this, temporaryApiName, data );
                    }, _this.main, _this );
                }
            });
        })(main, io, host, apis);
    }

    return new baobabFw();
})();
