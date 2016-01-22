/**
 * [core/ui/table] - Reusable component for tabular data
 */
define([], function() {

	/**
	 * The Table class is responsible for displaying arbitrary tabular data
	 */
	var Table = function( tabHost ) {

		// Get table host element
		this.eHostElement = $(tabHost);
		this.eHostElement.addClass("table-list table-scroll table-lg");

		// Create tables
		this.eListTable = $('<table></table>').appendTo(this.eHostElement);
		this.eListHeader = $('<tr></tr>').appendTo( $('<thead></thead>').appendTo(this.eListTable) );
		this.eListBody = $('<tbody></tbody>').appendTo(this.eListTable);

		// Column definitions
		this.columns = [];
		this.rows = [];

	}

	/**
	 * Define the table columns
	 */
	Table.prototype.addColumn = function( id, title, size, renderer  ) {

		// Create default renderer
		if (!renderer) {
			renderer = function(value) {
				var elm = $('<span></span>');
				if (value !== undefined)
					elm.text( value );
				return elm;
			}
		}

		// Keep on column data
		this.columns.push({
			'id': id, 
			'size': size,
			'renderer': renderer
		});

		// Add on header
		this.eListHeader.append(
			$('<th class="col-'+size+' text-center"></th>').text(title)
		);

	}

	/**
	 * Apply the sorting function
	 */
	Table.prototype.applySorting = function() {
		
	}

	/**
	 * Add data row
	 */
	Table.prototype.add = function( rowData ) {
		if (!rowData) return;
		this.rows.push( rowData );
		var row = $('<tr></tr>').appendTo(this.eListBody);
		for (var i=0; i<this.columns.length; i++) {
			var c = this.columns[i];
			row.append(
				$('<td></td>')
					.append( c.renderer(rowData[c.id], rowData) )
					.addClass( "col-"+c.size )
					.addClass( "text-center" )
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