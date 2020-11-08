const AccessControl = require("accesscontrol");
const access = new AccessControl();
 
exports.roles = (function() {
access.grant("guest").readAny("product")
 
access.grant("writer").extend("guest").updateAny("product")
 
access.grant("admin").extend("guest").extend("writer").createAny("product")
 
return access;
})();