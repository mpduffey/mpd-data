angular.module('mpd.data', [])
.config(['localStorageServiceProvider', function(localStorageServiceProvider){
	localStorageServiceProvider.setPrefix('ma');
}])
.service('mpdData', function($http, $q, localStorageService){
	var dataStore = {};
	
	function getDataPromise(dataset, queryOptions) {
		queryOptions = queryOptions || {};
		var queryOptionsString = "?",
			sortOrder = queryOptions.sortOrder || "ASC",
			datasetInfo = {
				collectionName:		dataset
			};
		
		if(queryOptions.length !== 0) {
			for(var prop in queryOptions) {
				if(queryOptionsString !== "?") queryOptionsString += "&";
				queryOptionsString += prop + "=" + queryOptions[prop];
				if(prop=="sort") queryOptionsString += "%20" + sortOrder;
			}
		}
		dataStore[dataset] = {};
		dataStore[dataset].data = [];
		dataStore[dataset].prototype = datasetInfo;
		dataStore[dataset].status = "requesting";
		dataStore[dataset].requestPromise = $http.get('/api/v1/' + dataset + (queryOptionsString !== "?"?queryOptionsString:""));
		console.log("Requesting " + dataset + " data...");
		return dataStore[dataset].requestPromise;
	}
	function getData(dataset, queryOptions) {
		return getDataPromise(dataset, queryOptions).then(function(result) {
			dataStore[dataset].data = result.data;
			dataStore[dataset].status = "complete";
			console.log(dataStore);
			return dataStore[dataset].data;
		});
	}
	
	return {
		dataStore:			dataStore,
		getDataPromise:	getDataPromise,
		getData:				getData
	}
});