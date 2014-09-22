define(["require", "exports"], function(require, exports) {
    var vm;
    (function (vm) {
        function $return(retExpr) {
            return 'return (' + retExpr + ')';
        }
        vm.$return = $return;
    })(vm || (vm = {}));

    
    return vm;
});
