'use strict';

/*
* @Author: Lutz Reiter, Design Research Lab, Universität der Künste Berlin
* @Date:   2016-05-04 11:38:41
* @Last Modified by:   lutzer
* @Last Modified time: 2016-07-14 12:36:49
*/

import Backbone from 'backbone'
import Marionette from 'marionette'
import _ from 'underscore'
import SubmissionCollection from 'models/submission_collection';
import SubmissionModel from 'models/submission_model';
import ProjectionItemView from 'views/projection_item_view';
import Config from 'config';

class ProjectionView extends Marionette.CollectionView {

    get className() { return 'projection' }

    get childView() {
    	return ProjectionItemView;
    }

    /* methods */
    initialize(options) {

        this.collection = new SubmissionCollection();
        this.collection.setPageSize(1);
        this.collection.getFirstPage();

        this.timer = null;

        this.startPageTimer();
    }

    startPageTimer(showNewestPage) {
		showNewestPage = showNewestPage || false;

		var self = this;

		//clear old timer, if there is one present
		if (this.timer)
			clearTimeout(this.timer);

		//display next page
		if (showNewestPage)
			self.collection.getFirstPage();
		else if (self.collection.paginate.page >= self.collection.paginate.totalRecords)
			self.collection.getFirstPage();
		else
			self.collection.getNextPage({remove : true});

		// start loop
		this.timer = setTimeout(function() {
			self.startPageTimer();
		},Config.projectionTimeInterval);

	}
    
}

export default ProjectionView