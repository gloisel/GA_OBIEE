// Retrieves the type of page that is currently viewed and sends it to Google
function Praesto_GA_injectGA(trackingID) {

	var o = Praesto_GA_getGAparams();

	if(!o)
		return;

	if(o.Path == "")
		o.Path = Praesto_GA_getURLparam("path");
		
	if(o.Path == "")
		o.Path = Praesto_GA_getURLparam("bipPath");
	
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})

	(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	ga('create', trackingID, {
	  'userId': o.user,
	  'cookieDomain': 'none'
	});

	ga('set', 'dimension1', o.user);
	ga('set', 'dimension3', o.system);
	ga('set', 'dimension5', o.uType);
	ga('set', 'dimension4', o.pType);
	ga('set', 'dimension7', o.pSubType);
	ga('set', 'dimension8', o.Path);
	ga('set', 'dimension9', o.Page);
	ga('set', 'dimension10', getUniqueId());

	ga('send', 'pageview');

	Praesto_GA_Trace(Praesto_GA_Obj2Str(o));

}

// Identifies the page that is currently viewed
function Praesto_GA_getGAparams() {

	var o = {
		system: Praesto_GA_inIframe() ? "OBIEE" : "OBIEE Standalone",
		key: "Send to GA",
		user: obipga.user_id,
		uType: obipga.user_resp,
		pType: "Other",
		pSubType: "",
		Path: "",
		Page: ""
		};
	var a;
		


	if(saw.home) {

		// Home
		o.pType = "Home";
		return o;

	}
	else if(typeof adminpage == "function") {
	
		// Admin
		o.pType = "Administration";
		a = window.location.href.substr(window.location.href.indexOf('?') + 1);
		a = a.split('&');
		o.pSubType = a[0];
		return o;
	
	}
	else if(typeof saw.catalog.CatalogView == "function") {
	
		// Catalog
		o.pType = "Catalog Browsing";
		
		if(saw.catalog.getCatalogPageViewer())
			o.Path = saw.catalog.getCatalogPageViewer().objectList.folderPath ? saw.catalog.getCatalogPageViewer().objectList.folderPath : "Advanced Search";
		
		return o;
	
	}
	else if(typeof DashboardEditor == "function") {
		
		// Dashboard - Edit
		o.pType = "Report Building";
		o.pSubType = "Dashboard";
		o.Path = obidash.editor.form.PortalPath.value;
		o.Page = obidash.editor.form.Page.value;
		return o;
	
	}
	
	if(typeof saw.dashboard == "function") {
		
		if(saw.dashboard.tabViewer || obips.BreadCrumbs.Manager.getSingleton().getCurrentOpenItem().params) {

			// Dashboard - View
			o.pType = "Data Exploration";
			o.pSubType = "Dashboard";
			o.Path = obips.BreadCrumbs.Manager.getSingleton().getCurrentOpenItem().path;

			o.Page = obips.BreadCrumbs.Manager.getSingleton().getCurrentOpenItem().params.page;
			
			return o;
		
		}
			
	}
	
	if(typeof obips.Analysis == "function") {

		if(typeof ReportPageEditor == "function") {
		
			// Analysis - Edit
			o.pType = "Report Building";
			o.pSubType = "Analysis";
			o.Path = obips.BreadCrumbs.Manager.getSingleton().getCurrentOpenItem().path;
			return o;
			
		}
		else if(typeof obiprp.PromptListEditor == "function") {
		
			// Prompt - Edit
			o.pType = "Report Building";
			o.pSubType = "Prompt";
			o.Path = obips.BreadCrumbs.Manager.getSingleton().getCurrentOpenItem().path;
			return o;
		
		}
		else if(typeof LoadSavedFilter == "function") {
		
			// Filter - Edit
			o.pType = "Report Building";
			o.pSubType = "Filter";
			return o;
			
		}
			

	}
	
	if(typeof saw.dashboard != "function" && typeof obips.Analysis == "function" && typeof ReportPageEditor != "function" && typeof LoadSavedFilter != "function" && typeof obikpi != "function") {
	
		// Analysis/KPI - View
		o.pType = "Data Exploration";
		
		if(Praesto_GA_getURLparam("Context") == "kpi")
			o.pSubType = "KPI";
		else
			o.pSubType = "Analysis";
			
		o.Path = obips.BreadCrumbs.Manager.getSingleton().getCurrentOpenItem().path;
		return o;
		
	}
	
	if(typeof obikpi == "function" && typeof obips.Analysis != "function") {
	
		// KPI - Edit
		o.pType = "Report Building";
		o.pSubType = "KPI";
		//o.Path = "";
		return o;
	
	}


	if(typeof obikpi == "function" && typeof obips.Analysis == "function") {
	
		// KPI View
		o.pType = "Data Exploration";
		o.pSubType = "KPI";
		//o.Path = "";
		return o;
		
	}
	
	if(typeof obibsc == "function") {
	
		// Scorecards
		o.pType = "Scorecard";
		//o.pSubType = "Scorecard";
		o.Path = obips.BreadCrumbs.Manager.getSingleton().getCurrentOpenItem().path;
		return o;
	
	}
	
	
	if(typeof obips.bipublisher == "function" && document.getElementsByTagName('IFRAME').length > 0) {
	
		a = document.getElementsByTagName('IFRAME')[0].getAttribute('src').substring(1).split('/');
		
		// BI Publisher Components
		if(a.length > 1) {
	
			if(a[0] == "mobile") {
			
				// MAD
				o.pSubType = "Mobile App Designer";
				
				if(a[1].split('.')[0] == "mobileView")
					o.pType = "Data Exploration";
				else
					o.pType = "Report Building";
				
				return o;
				
			}
			
			if(a[0] == "xmlpserver") {
			
				if(a[1].split('.')[0] == "xdmeditor") {
				
					// Data Model
					o.pSubType = "Data Model";
				
				}
				else if(a[1].split('.')[0] == "servlet") {
				
					// Admin for BIP
					o.pType = "Administration";
					a = window.location.href.substr(window.location.href.indexOf('?') + 1);
					a = a.split('&');
					o.pSubType = a[0];
					return o;	
					
				}
				else {
				
					// BIP Report
					o.pSubType = "BI Publisher";
					
				}
				
				if(a[1].split('.')[0] == "editor")
					o.pType = "Report Building";
				else
					o.pType = "Data Exploration";
				
				return o;
				
			}
			
		}
	
	
	}
	
	if(typeof obips.bipublisher == "function") {
	
		// BIP Other (if any)
		o.pSubType = "BI Publisher"
		return o;
	
	}
	
	if(typeof saw.mktg == "function") {
	
		// Marketing
		o.pType = "Administration";
		o.pSubType = "Marketing";
	
	}
	
	return o;

}

// Uses OBIEE JS function getURLArgs to return the value for an argument
function Praesto_GA_getURLparam(key) {

	var param = saw.getURLArgs(key);
	
	if(param)
		return param[key];
	
	return "";
	
}

// Check whether or not OBIEE is being displayed in an Iframe
function Praesto_GA_inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

// Allows getting individual page views when extracting from GA (instead of aggregated values)
function getUniqueId() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
}

// Needed as console.log does not work for some versions of IE
function Praesto_GA_Trace(s) {
	
	if ('console' in self && 'log' in console)
		console.log(s)
  
}

// Wait until the page is loaded and send the information to Google
jQuery(document).ready(function() {
	
	// Change the following variable with your Tracking Id
	var trackingId = 'UA-55936840-2';
	
	try {
		Praesto_GA_injectGA(trackingId);
	}
	catch(e) {
		Praesto_GA_Trace('GA could not be injected: ' + e.message);
		Praesto_GA_Trace(e.stack);
	}

});
