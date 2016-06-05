'use strict';

/*
* @Author: Lutz Reiter, Design Research Lab, Universität der Künste Berlin
* @Date:   2016-05-04 11:38:41
* @Last Modified by:   lutzer
* @Last Modified time: 2016-05-30 16:11:18
*/

import Marionette from 'marionette'
import _ from 'underscore'

import template from 'text!templates/main_tmpl.html';

class MainView extends Marionette.LayoutView {

	/* properties */
    get template() { return _.template(template) }

    get className() { return 'page' }

    regions() { return {
        headerRegion: '#header',
        topRegion: '#top',
    	contentRegion: '#content',
        sideRegion: '#side'
    }}

    /* methods */
    initialize(options) {

    }
    
}

export default MainView