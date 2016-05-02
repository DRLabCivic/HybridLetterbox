/* CONFIG FILE */

var Config = {

	/* DATABASE */
	database: "mongodb://localhost/letterbox",
	submissionCollection: "submissions",

	/* SERVER CONFIG */
	baseUrl : '/', // with trailing /
	publicDir : '../www/src/',
	hostname : false, // 127.0.0.1 = private, false = public
	port : '8081',

	/* TEST CONFIG */
	testDatabase :"mongodb://localhost/letterbox_test",
	testPort: '8881'

};

module.exports = Config;