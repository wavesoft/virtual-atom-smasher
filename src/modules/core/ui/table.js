/**
 * [core/ui/table] - Reusable component for tabular data
 */
define(["core/util/event_base"], function(EventBase) {

	/**
	 * The Table class is responsible for displaying arbitrary tabular data
	 */
	var Table = function( tabHost ) {
		EventBase.call(this);

		// Get table host element
		this.eHostElement = $(tabHost);
		this.eHostElement.addClass("table-list table-scroll table-lg");

		// Create tables
		this.eListTable = $('<table></table>').appendTo(this.eHostElement);
		this.eListHeader = $('<tr></tr>').appendTo( $('<thead></thead>').appendTo(this.eListTable) );
		this.eListBody = $('<tbody></tbody>').appendTo(this.eListTable);

		// Column definitions
		this.sortOrder = false;
		this.sortColumn = "";
		this.columns = [];
		this.rows = [];
		this.emptyPlaceholder = $('<span>(No data to display)</span>');

	}

	// Subclass from EventBase
	Table.prototype = Object.create( EventBase.prototype );

	/**
	 * Define the empty placeholder
	 */
	Table.prototype.setEmptyPlaceholder = function( dom  ) {
		this.emptyPlaceholder = $(dom);
	}

	/**
	 * Define the table columns
	 */
	Table.prototype.addColumn = function( id, title, size, align, renderer  ) {

		// Slide renderer to align if missing
		if (typeof(align) == 'function') {
			renderer = align;
			align = 'center';
		}

		// Create default renderer
		if (!renderer) {
			renderer = function(value) {
				var elm = $('<span></span>');
				if (value !== undefined)
					elm.text( value );
				return elm;
			}
		}

		// Pick align class
		var alignClass = 'text-center';
		if (align == 'left') {
			alignClass = "";
		} else if (align == 'center') {
			alignClass = "text-center";
		}

		// Create header item
		var hItem = $('<th class="col-'+size+' '+alignClass+' table-header-sortable"></th>').text(title);
		hItem.click((function(e) {

			// Pick sort column and order
			if (this.sortColumn != id) {
				this.sortColumn = id;
				this.sortOrder = false;
			} else {
				// Flip sort order
				this.sortOrder = !this.sortOrder;
			}

			// Apply sort
			this.applySorting( this.sortColumn, this.sortOrder );

		}).bind(this));

		// Crete sort icon
		var hIcon = $('<img />').hide().appendTo(hItem);

		// Keep on column data
		this.columns.push({
			'id': id, 
			'size': size,
			'renderer': renderer,
			'align': alignClass,
			'elm': hItem,
			'elmIcon': hIcon,
		});

		// Add on header
		this.eListHeader.append( hItem );

		// Chainable calls
		return this;
	}

	/**
	 * Apply the sorting function
	 */
	Table.prototype.applySorting = function( key, order ) {

		// Get list items
		var items = this.eListBody.children(),
			self = this;
		
		// Sort			
		items.sort(function(a,b){
			var eA = self.rows[$(a).data("row")],
				eB = self.rows[$(b).data("row")],
				vA = eA[key], vB = eB[key];

			// String comparison is case-insensitive
			if ((typeof(vA) == "string") || (typeof(vB) == "string")) {
				vA = String(vA).trim().toUpperCase();
				vB = String(vB).trim().toUpperCase();
			}

			// Comparison
			if (vA > vB) {
				console.log("--",vA,">",vB)
				return order ? 1 : -1;
			} else if (vA < vB) {
				console.log("--",vA,"<",vB)
				return order ? -1 : 1;
			} else {
				console.log("--",vA,"=",vB)
				return 0;
			}

		});

		// Detach and re-append in order
		items.detach().appendTo(this.eListBody);

		// Update header icons
		for (var i=0; i<this.columns.length; i++) {
			var c = this.columns[i];
			if (c.id == key) {
				c.elm.addClass("table-header-active");
				c.elmIcon.show();
				if (order) {
					c.elmIcon.attr("src", "modules/vas/basic/img/icons/bullet_arrow_up.png" );
				} else {
					c.elmIcon.attr("src", "modules/vas/basic/img/icons/bullet_arrow_down.png" );
				}
			} else {
				c.elm.removeClass("table-header-active");
				c.elmIcon.hide();
			}
		}

	}

	/**
	 * Add data row
	 */
	Table.prototype.add = function( rowData ) {
		if (!rowData) return;
		this.rows.push( rowData );
		var row = $('<tr></tr>')
					.data("row", this.rows.length-1)
					.appendTo(this.eListBody);
		for (var i=0; i<this.columns.length; i++) {
			var c = this.columns[i];
			row.append(
				$('<td></td>')
					.append( c.renderer(rowData[c.id], rowData) )
					.addClass( "col-"+c.size )
					.addClass( c.align )
			);
		}
		return row;
	}

	/**
	 * Clear table
	 */
	Table.prototype.clear = function() {
		this.eListBody.empty();
		this.rows = [];
	}

	/**
	 * Set all data rows
	 */
	Table.prototype.set = function( rows ) {
		// Clear table
		this.clear();

		// Add rows
		if (!rows) return;
		for (var i=0; i<rows.length; i++)
			this.add(rows[i]);

		// Return selector
		return this.eListBody.find("tr");
	}

	// Expose class
	return Table;

});