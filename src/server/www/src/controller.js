'use strict';

/*
* @Author: Lutz Reiter, Design Research Lab, Universität der Künste Berlin
* @Date:   2016-05-04 11:38:41
* @Last Modified by:   lutzer
* @Last Modified time: 2016-05-12 16:19:18
*/

import Backbone from 'backbone';
import Marionette from 'marionette';
import SIO from 'socketio';
import Config from 'config';

import MainView from 'views/main_view';
import SubmissionListView from 'views/submission_list_view';
import TagListView from 'views/tag_list_view';
import SubmissionInputView from 'views/submission_input_view';
import SubmissionView from 'views/submission_view';

class Controller extends Marionette.Controller {
		
		constructor(app) {

			super();

			this.app = app;
			
			app.addRegions({
				containerRegion: "#container",
				modalRegion: "#modal-container"
			});
			
			//register client events
			/*Backbone.on('dialog:open', this.openDialog, this);
			Backbone.on('dialog:close', this.closeDialog, this);*/
			Backbone.on('error',this.openErrorDialog, this);

			//register socket events
			var socket = SIO(Config.web_socket_url);
            socket.on('submission:changed', function(data) {
            	Backbone.trigger('submission:changed',data);
            });
            socket.on('submission:new', function(data) {
            	Backbone.trigger('submission:new',data);
            });
            socket.on('submission:removed', function(data) {
            	Backbone.trigger('submission:new',data);
            });

            //load mainview
            this.mainView = new MainView();
            this.app.containerRegion.show(this.mainView);
			
		}
			
		/* ROUTES */

		showSubmissionList(tag=null) {
			//update list view
			this.mainView.contentRegion.show(new SubmissionListView({ tag: tag }));

			//set input view
			if (!(this.mainView.topRegion.currentView instanceof SubmissionInputView))
				this.mainView.topRegion.show(new SubmissionInputView());

			//set tagview
			if (this.mainView.sideRegion.currentView instanceof TagListView)
				this.mainView.sideRegion.currentView.setTag(tag);
			else
				this.mainView.sideRegion.show(new TagListView({ tag: tag }));
		}

		showSubmission(id) {
			this.mainView.contentRegion.show(new SubmissionView({ id: id }));
			this.mainView.sideRegion.reset();
			this.mainView.topRegion.reset();
		}

		postSubmission() {
			alert('post submission');
		}

		showScanningDialog() {
			alert("ScanningDialog");
		}

		openErrorDialog(type,data) {

			var title = (type+'-error').toUpperCase()
			var message = data.message;

			alert(title+': '+message);
		}

		closeDialog() {

		}

		
};

export default Controller
	