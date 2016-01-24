
define(["jquery"],

	/**
	 * This module provides the {@link Geocode} class which
	 * can be used to resolve a lat/lng information to city details.
	 *
	 * It also provides some local caching information in order to avoid
	 * overcommitting free quota.
	 *
	 * @exports core/util/event_base
	 */
	function($) {

		/**
		 * Name of the cache key in localstorage
		 */
		var cacheKey = "geocode-cache";

		/**
		 * Initialize the geocode class.
		 *
		 * @class
		 * @classdesc Geocoding class to resolve lat/lng to city name
		 */
		var Geocode = function() {
		}

		/**
		 * Get cache information for the specified lat/lng combination
		 */
		Geocode.prototype.getCache = function(latlng)  {

			// Load and parse cache 
			var data = localStorage.getItem(cacheKey);
			if (!data) data = "{}";
			var cache = JSON.parse(data);

			// Return item
			return cache[latlng];

		}

		/**
		 * Update cache information for the specified lat/lng combination
		 */
		Geocode.prototype.updateCache = function(latlng, city)  {

			// Load and parse cache 
			var data = localStorage.getItem(cacheKey);
			if (!data) data = "{}";
			var cache = JSON.parse(data);

			// Update
			cache[latlng] = city;
			localStorage.setItem(cacheKey, JSON.stringify(cache));

		}

		/**
		 * Geocoding utilisation
		 */
		Geocode.prototype._geocodeRequest = function(latlng, callback) {
			var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latlng+"&sensor=true";

			// Helper function to get address component
			var getAddressComponent = function( data, type ){
				for (var i=0; i<data.length; i++) {
					if (data[i]['types'].indexOf(type) != -1)
						return data[i]['formatted_address'];
				}
				return null;
			}

			$.ajax({ "url": url })
				.done((function(data) {

					// Trigger error callback on error
					if (data['status'] != 'OK') {
						if (callback) callback(null);
						return;
					}

					// Geocode name of city in order of detail
					var addr = "";
					if (!addr) addr = getAddressComponent(data['results'], 'administrative_area_level_2');
					if (!addr) addr = getAddressComponent(data['results'], 'administrative_area_level_3');
					if (!addr) addr = getAddressComponent(data['results'], 'administrative_area_level_4');
					if (!addr) addr = getAddressComponent(data['results'], 'administrative_area_level_5');
					if (!addr) addr = getAddressComponent(data['results'], 'country');

					// If we still don't have anything, something went wrong
					if (!addr) {
						if (callback) callback(null);
						return;
					}

					// Cache and return
					this.updateCache( latlng, addr );
					if (callback) callback(addr);

				}).bind(this))
				.fail(function() {
					// Trigger error
					if (callback) callback(null);
				});

		}

		/**
		 * Geocode city
		 */
		Geocode.prototype.geocodeCity = function(latlng, callback) {

			// First check cache
			var name = this.getCache( latlng );
			if (name) {
				if (callback) callback(name);
				return name;
			}

			// Then execute geolocation
			this._geocodeRequest(latlng, callback);

		}

		// Return singleton
		var geocode = new Geocode();
		return geocode;

	}

);