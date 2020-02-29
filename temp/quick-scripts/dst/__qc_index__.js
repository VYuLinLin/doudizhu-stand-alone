
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/__qc_index__.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}require('./assets/scripts/util/waitnode');
require('./assets/servers/ddzServers/carder');
require('./assets/scripts/gameScene/prefabs/card');
require('./assets/scripts/common/audioManager');
require('./assets/scripts/gameScene/gamebeforeUI');
require('./assets/scripts/data/ddzConstants');
require('./assets/scripts/common/common');
require('./assets/scripts/common/DataNotify');
require('./assets/servers/ddzServers/AILogic');
require('./assets/servers/ddzServers/gameRule');
require('./assets/scripts/data/ddzData');
require('./assets/migration/use_v2.0.x_cc.Toggle_event');
require('./assets/scripts/start');
require('./assets/scripts/hallscene/prefabs_script/joinRoom');
require('./assets/scripts/data/socket_ctr');
require('./assets/scripts/hallscene/hallScene');
require('./assets/servers/ddzServers/ddzServers');
require('./assets/scripts/gameScene/prefabs/player_node');
require('./assets/scripts/loginscene/loginScene');
require('./assets/scripts/common/loadingLayer');
require('./assets/scripts/gameScene/gameScene');
require('./assets/scripts/util/event_lister');
require('./assets/scripts/mygolbal');
require('./assets/scripts/common/api');
require('./assets/scripts/hallscene/prefabs_script/creatRoom');
require('./assets/scripts/data/player');
require('./assets/scripts/gameScene/gameingUI');

                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();