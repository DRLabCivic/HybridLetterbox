
var assert = require('assert');
var fs = require('fs');
var _ = require('underscore');
var async = require('async')

var Utils = r_require('utils/utils');
var Submission = r_require('models/submission');
var Comment = r_require('models/comment')

var BASE_URL = "http://localhost:"+Config.port+Config.baseUrl;
var MODEL_ID = null;

describe.skip('API Routes /submissions/', function(){

  	beforeEach(function(done) {

  		r_require('database/database').connect();

  		// delete database file before each test call
  		async.parallel([
  			(callback) => { Submission.removeAll(callback) },
  			(callback) => { Comment.removeAll(callback) },
  		],() => {
  			// Add some Models
	  		var size = Math.floor(5 + Math.random() * 10)
			array = _.map(_.range(size), function(i) {
				return {
					text: 'model'+i,
				}
			});
			Submission.create(array, function(err,models) {
				MODEL_ID = models[0]._id;
				done();
	  		});
  		});
  		
  	});

  	afterEach(function() {
        r_require('database/database').disconnect();
    });

	it('should POST on api/submissions', function(done){

		var request = require('supertest');

		data = {
			text: "unittest_" + require('node-uuid').v4()
		}

		request(BASE_URL).post('api/submissions').send(data).end(function(err, res) {
			Utils.handleError(err);
			assert.equal(res.body.text, data.text);
			done()
        });
	})

	it('should GET on api/submissions', function(done){

		var request = require('supertest');

		request(BASE_URL).get('api/submissions').expect(200).end(function(err, res) {
			Utils.handleError(err);
			done();
        });
	})

	it('should GET on api/submissions/'+MODEL_ID, function(done){

		var request = require('supertest');

		request(BASE_URL).get('api/submissions/'+MODEL_ID).expect(200).end(function(err, res) {
			Utils.handleError(err);
			assert.equal(res.body._id,MODEL_ID)
			done();
        });
	})

	it('should DELETE on api/submissions/'+MODEL_ID, function(done){

		var request = require('supertest');

		request(BASE_URL).delete('api/submissions/'+MODEL_ID).end(function(err, res) {
			Utils.handleError(err);
			assert.equal(res.body.removed, 1);
			
			//check if model is really deleted
			request(BASE_URL).get('api/submissions/'+MODEL_ID).expect(200).end(function(err, res) {
				Utils.handleError(err);
				assert(_.isEmpty(res.body));
				done();
	        });
	    });
	});
});

describe.skip('API Routes /comments/', function(){

	var addComment = function(data,callback) {
		var request = require('supertest');

		//add comment
		request(BASE_URL).post('api/comments/'+MODEL_ID).send(data).end(callback);
	}

	beforeEach(function(done) {

		r_require('database/database').connect();

  		// delete database file before each test call
  		async.series([
  			(callback) => { Submission.removeAll(callback) },
  			(callback) => { Comment.removeAll(callback) }
  		],() => {
  			// Add some Models
	  		var size = Math.floor(5 + Math.random() * 10)
			array = _.map(_.range(size), function(i) {
				return {
					text: 'model'+i,
				}
			});
			Submission.create(array, function(err,models) {
				MODEL_ID = models[0]._id;
				done();
	  		});
  		});
  	});

  	afterEach(function() {
        r_require('database/database').disconnect();
    });

  	it('should POST on api/comments/:submissionId', function(done){

		var request = require('supertest');

		data = {
			text: "unittest_" + require('node-uuid').v4()
		}

		request(BASE_URL).post('api/comments/'+MODEL_ID).send(data).end(function(err, res) {
			Utils.handleError(err);
			assert(res.body.comments.length > 0);
			done()
        });
	});


  	it('should GET on api/comments/:id', function(done) {

  		var request = require('supertest');

  		comment_data = {
			text: "unittest_" + require('node-uuid').v4()
		}

		//add comment
		request(BASE_URL).post('api/comments/'+MODEL_ID).send(comment_data).end(function(err, res) {
			Utils.handleError(err);
			
			request(BASE_URL).get('api/comments/'+res.body.comments[0]).end(function(err, res) {
				assert.equal(res.body.text, comment_data.text);
				done();
			});
        });
  	});

  	it('should DELETE on api/comments/:id', function(done) {

  		var request = require('supertest');

  		comment_data = {
			text: "unittest_" + require('node-uuid').v4()
		}

		//add comment
		request(BASE_URL).post('api/comments/'+MODEL_ID).send(comment_data).end(function(err, res) {
			Utils.handleError(err);
			
			// delete comment
			request(BASE_URL).delete('api/comments/'+res.body.comments[0]).end(function(err, res) {
				assert.equal(res.body.removed,1);
				done();
			});
        });
  	});

  	it('should GET on api/comments', function(done){

		var request = require('supertest');

		async.parallel([
			(callback) => { addComment({ text: 'test' },callback) },
			(callback) => { addComment({ text: 'test' },callback) },
			(callback) => { addComment({ text: 'test' },callback) }
		],() => {
			request(BASE_URL).get('api/comments').expect(200).end(function(err, res) {
				Utils.handleError(err);
				assert(res.body.length == 3)
				done();
	        });
		});
	});

});

describe('API Routes /file/', function() {

	beforeEach(function(done) {
		r_require('database/database').connect(done);
  	});

  	afterEach(function() {
        r_require('database/database').disconnect();
    });

	it('should POST a file on api/file/attach/:submissionId', function(done) {

		var request = require('supertest');

		data = {
			text: "unittest_" + require('node-uuid').v4()
		}

		//create submission
		request(BASE_URL).post('api/submissions').send(data).end(function(err, res) {
			Utils.handleError(err);
			submissionId = res.body._id;

			//attach file
			request(BASE_URL).post('api/file/attach/'+submissionId).attach('file', 'tests/files/img1.jpg').end(function(err, res) {
				console.log(res.body);
				done();
			});

			
        });

	});

});