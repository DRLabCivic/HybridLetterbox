var express = require('express');
var _ = require('underscore');

var appEvents = r_require('/utils/appEvents.js');

var Submission = r_require('/models/submission');
var Utils = r_require('/utils/utils');

var router = express.Router();

/*
 * GET /api/feedback/scanning
 */ 
router.get('/',function(req,res){
    
	Submission.find({}, (err, models) => {
		if (Utils.handleError(err,res))
            return;

        // extract all tags, remove duplicates
        tags = _.unique(_.flatten(_.pluck(models,'tags')));
        res.send(tags);
	});

});

module.exports = router;