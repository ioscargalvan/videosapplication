"use strict";
var core_1 = require('@angular/core');
var Urls = (function () {
    function Urls() {
        console.log(core_1.isDevMode());
    }
    Urls.prototype.getMainUrl = function () {
        if (core_1.isDevMode()) {
            return "http://localhost/full_stack/symfony/web/app_dev.php/";
        }
        else {
            // Is Production!
            return "http://videosapp-com.stackstaging.com/backend/web/";
        }
    };
    return Urls;
}());
exports.Urls = Urls;
//# sourceMappingURL=urls.js.map