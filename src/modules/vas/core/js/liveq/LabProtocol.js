define(

	// Dependencies
	[ 'core/util/event_base', 'vas/core/liveq/ReferenceData', 'vas/core/liveq/HistogramData' ], 

	/**
	 * This is the default data widget for visualizing a historgram
	 *
 	 * @exports liveq/LabProtocol
	 */
	function( EventBase, ReferenceData, HistogramData ) {

		var FLAG_INTERPOLATION = 1,
			FLAG_EXISTS = 2,
			FLAG_CHANNEL_2 = 4;


		/**
		 * Initialize the lab protocol class.
		 *
		 * The lab protocol class must be initialized by calling the handleConfigFrame function,
		 * passing the first frame received by the WebSocket to it. 
		 *
		 * The frame contains configuration information required for properly 
		 * visualizing the histograms in the page.
		 *
		 * Such information are:
		 * 
		 *  * Names of all the histogrms in the lab
		 *  * Values of the reference data for each histogram
		 *  * The bitmap contents of the LaTeX-rendered labels
		 *
		 * @class
		 */
		var LabProtocol = function( ) {

			// Initialize subclass
			EventBase.call(this);

			/**
			 * Receiving slots
			 * 
			 * This array contains the active communication channels
			 * with LiveQ back-end. 
			 *
			 * Each object in the list contains two properties, a
			 * 'data' object, of {@link LiveQ.HistogramData} class and
			 * a 'reference' object that contains {@link LiveQ.Histogram}
			 * objects.
			 */
			this.receiveChannels = [
				{ 'reference': {}, 'data': {} },	// Primary
				{ 'reference': {}, 'data': {} }		// Query
			];

			/**
			 * Check if we ware initialized
			 @ member {boolean}
			 */
			this.initialized = false;

		}

		// Subclass from LabProtocol
		LabProtocol.prototype = Object.create( EventBase.prototype );

		/**
		 * Configure LabProtocol with the given configuration frame
		 *
		 * This function handles the incoming configuration frame and re-initializes
		 * the reference and histogram data.
		 * 
		 * @param {module:liveq/BufferReader~BufferReader} reader - The incoming configuration frame reader from the WebSocket.
		 */
		LabProtocol.prototype.handleConfigFrame = function( configReader ) {

			// Read the configuration header data
			var protoVersion = configReader.getUint8();

			// Handle protocols according to versions
			if (protoVersion == 2) {

				var flags = configReader.getUint8(),
					numEvents = configReader.getUint16(),
					numHistos = configReader.getUint32(),
					allHistos = [];

				// Pick channel
				var channelID = ((flags & FLAG_CHANNEL_2) != 0) ? 1 : 0,
					channel = this.receiveChannels[channelID];

				// Fire histogram removal callbacks
				for(var histoID in channel.data){

					// Get histogram
					var histo = channel.data[histoID];

					// Fire removal callbacks
					if ((histo != undefined) && (typeof(histo) != 'function')) {
						this.trigger('histogramRemoved', channel.data[histoID], channel.reference[histoID], channelID);
					}

				}

				// Reset reference/data
				channel.reference = {};
				channel.data = {};

				// Read histograms
				for (var j=0; j<numHistos; j++) {
					
					// Fetch histogram from buffer
					var histo = ReferenceData.fromReader( configReader );

					// Store to reference
					channel.reference[histo.id] = histo;

					// Use reference information to create new histogram
					channel.data[histo.id] = new HistogramData( histo.data.bins, histo.id );

					// Fire histogram added callbacks
					this.trigger('histogramAdded', channel.data[histo.id], channel.reference[histo.id], channelID);

					// Store for histogramsAdded
					allHistos.push({
						'id'   : histo.id,
						'data' : channel.data[histo.id],
						'ref'  : channel.reference[histo.id]
					})

				}

				// Fire one event when all histograms are added
				this.trigger('histogramsAdded', allHistos, channelID);

				// If we were not initialized, fire onReady
				if (!this.initialized) {
					this.initialized = true;
					this.trigger('ready', {
						'protocol': 1,
						'flags': flags,
						'channel': channelID,
						'targetEvents': numEvents * 1000
					});
				}

			} else {

				// Invalid protocol
				console.error("Unknown configuration frame protocol v", protoVersion);

			}


		}

		/**
		 * Handle incoming data frame
		 *
		 * This function handles the incoming data frame and fires the
		 * appropriate callback functions in order to visualize the 
		 * data arrived.
		 * 
		 * @param {module:liveq/BufferReader~BufferReader} reader - The incoming data frame reader from the WebSocket.
		 */
		LabProtocol.prototype.handleFrame = function( reader ) {

			// Read the frame header
			var protoVersion = reader.getUint8(),
				numEvents = 0;

			// Handle protocols according to versions
			if (protoVersion == 2) {

				var flags = reader.getUint8(),
					reserved0 = reader.getUint16(),
					numHistos = reader.getUint32();

				// Pick channel
				var channelID = ((flags & FLAG_CHANNEL_2) != 0) ? 1 : 0,
					channel = this.receiveChannels[channelID];

				// Check if the data are from interpolation
				var fromInterpolation = ((flags & 0x01) != 0);

				// Read histograms
				var allHistos = [];
				for (var j=0; j<numHistos; j++) {

					// Get histogram name
					var histoID = reader.getString();

					// Try to find a histogram with this id
					if (channel.data[histoID] != undefined) {

						// Fetch histogram
						var histo = channel.data[histoID];

						// Update histogram bins from reader, skipping the
						// reading of histogram ID (it has already happened)
						if (!histo.updateFromReader( reader, true, histoID, fromInterpolation )) {

							// An error occured, which has taken out of sync
							// the binary protocol. Until we come up with a better
							// solution, we are now officially unable to continue.
							this.trigger( 'error', 'Connection with the server interrupted! Unable to parse histogram frame', true, channelID );

						}

						// Update number of events
						if (histo.nevts > 0)
							numEvents = histo.nevts;

						// Fire histogram update callbacks
						this.trigger( 'histogramUpdated', histo, channel.reference[histoID], channelID );

						// Keep the histogram data for the 'histogramsUpdated' event
						allHistos.push({
							'id': histoID,
							'data': histo,
							'ref': channel.reference[histoID]
						});

					} else {
						console.error("Histogram ", histoID, " was not defined in configuration!");
					}

				}

				// Fire metadata update histogram
				this.trigger( 'metadataUpdated', {
					'nevts': numEvents,
					'interpolation': fromInterpolation,
					'flags': flags,
					'channel': channelID,
				});

				// Let everybody know that data arrived
				this.trigger( 'dataArrived', fromInterpolation, channelID );

				// Fire an update callback regarding all histograms
				this.trigger( 'histogramsUpdated', allHistos, channelID );


			} else {

				// Invalid protocol
				console.error("Unknown configuration frame protocol v", protoVersion);

			}

		}

		/**
		 * This event is fired when a histogram is added.
		 *
		 * @param {module:liveq/HistogramData~HistogramData} histogram - The histogram data
		 * @param {module:liveq/ReferenceData~ReferenceData} reference - The reference data
		 * @event module:liveq/LabProtocol~LabProtocol#histogramAdded		
		 */

		/**
		 * This event is fired when a histogram data are updated.
		 *
		 * @param {module:liveq/HistogramData~HistogramData} histogram - The histogram data
		 * @param {module:liveq/ReferenceData~ReferenceData} reference - The reference data
		 * @event module:liveq/LabProtocol~LabProtocol#histogramUpdated
		 */

		/**
		 * This event is fired when a histogram data are updated.
		 *
		 * @param {array} histograms - All the histograms as an object {id: .. , data: .. , ref: .. } format.
		 * @event module:liveq/LabProtocol~LabProtocol#histogramsUpdated
		 */

		/**
		 * This event is fired when a histogram is removed.
		 *
		 * @param {module:liveq/HistogramData~HistogramData} histogram - The histogram data
		 * @param {module:liveq/ReferenceData~ReferenceData} reference - The reference data
		 * @event module:liveq/LabProtocol~LabProtocol#histogramRemoved		
		 */

		/**
		 * This event is fired when the lab socket is initialized and the negotiation
		 * phase has been completed.
		 *
		 * @param {object} state - State dictionary
		 * @event module:liveq/LabProtocol~LabProtocol#ready		
		 */

		/**
		 * This event is fired when the metadata regarding the current run has
		 * updated.
		 *
		 * @param {object} meta - Metadata dictionary
		 * @event module:liveq/LabProtocol~LabProtocol#metadataUpdated		
		 */

		/**
		 * This event is fired when there are incoming data.
		 *
		 * @event module:liveq/LabProtocol~LabProtocol#dataArrived		
		 */

		// Return LabProtocol
		return LabProtocol;

	}

);