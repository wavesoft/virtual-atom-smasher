
define(['jquery'],

	function($) {

		/**
		* GraphLink are cell images defining link directions
		 */
		var GraphLink = function(u,d,l,r) {
			this.u = (u == undefined) ? false : u;
			this.d = (d == undefined) ? false : d;
			this.l = (l == undefined) ? false : l;
			this.r = (r == undefined) ? false : r;
		};

		/**
		 * Copy from the given link
		 */
		GraphLink.prototype.copyFrom = function(link)  {
			this.u = link.u; this.l = link.l;
			this.d = link.d; this.r = link.r;
		}

		/**
		 * Set to given values
		 */
		GraphLink.prototype.setTo = function(u,d,l,r)  {
			this.u = (u == undefined) ? false : u;
			this.d = (d == undefined) ? false : d;
			this.l = (l == undefined) ? false : l;
			this.r = (r == undefined) ? false : r;
		}

		/**
		 * Convert combination to number (0-16)
		 *
		 * Some common cases:
		 * +-----+-----+-----+-----+-----+-----+-----+-----+
		 * |  |  |  |  |     |     |     |     |  |  |  |  |
		 * |  |  | -+- | --- |  +- | -+  | -+- |  +- | -+  |
		 * |  |  |  |  |     |  |  |  |  |  |  |  |  |  |  |
		 * +-----+-----+-----+-----+-----+-----+-----+-----+
		 *    3     15    12    10    6     14    11    7
		 * +-----+-----+-----+-----+-----+-----+-----+-----+
		 * |  |  |     |     |  |  |     |  |  |  |  |     |
		 * |     |     | -   | -+  |   - |  +- | -+- | -+- |
		 * |     |  |  |     |     |     |     |     |  |  |
		 * +-----+-----+-----+-----+-----+-----+-----+-----+
		 *    1     2     4     5     8     9     13    14
		 */
		GraphLink.prototype.toNumber = function()  {
			var n = 0;
			if (this.u) n |= 1;
			if (this.d) n |= 2;
			if (this.l) n |= 4;
			if (this.r) n |= 8;
			return n;
		}

		/**
		 * Given a tree of nodes, GraphRoute will calculate a flat representation
		 * of the tree, providing cells-based representation of the data.
		 */
		var GraphRoute = function(rootNode) {
			// Keep nodes
			this.rootNode = rootNode;

			// Node structures
			this.nodes = [];
			this.links = [];

			// Maximum number of columns
			this.maxWidth = 100;
			this.maxDepth = 0;

		}

		/**
		 * Check if we have node at (x,y)
		 */
		GraphRoute.prototype.hasAt = function(col,row) {
			// Check column
			if (this.nodes[col] == undefined)
				return false;
			// Check row
			if (this.nodes[col][row] == undefined)
				return false;
			// Yes, there exists
			return true;
		}

		/**
		 * Put node at the given column/row
		 */
		GraphRoute.prototype.putNodeAt = function(col,row,node) {
			// Create column
			if (this.nodes[col] == undefined)
				this.nodes[col] = [];
			// Place on row
			this.nodes[col][row] = node;
			// Update max depth
			if (row > this.maxDepth)
				this.maxDepth = row;
		}

		/**
		 * Create/get link node at given row/col
		 */
		GraphRoute.prototype.linkAt = function(col,row) {
			// Create column
			if (this.links[col] == undefined)
				this.links[col] = [];
			// Place on row
			if (this.links[col][row] == undefined)
				this.links[col][row] = new GraphLink();
			// Return link
			return this.links[col][row];
		}

		/**
		 * Shift cell to (x,y) from (x-dir,y)
		 */
		GraphRoute.prototype.shiftCell = function(x, y, dir) {
			var sx = x-dir;

			// Continue only if there is really a node
			if (this.hasAt(sx,y)) {

				// Shift node
				this.putNodeAt(x, y, this.nodes[sx][y]);
				delete this.nodes[sx][y];

				// Shift link
				var sLink = this.linkAt(sx,y);
				this.linkAt(x,y).copyFrom( sLink );

				// Replace with horizontal when needed
				if ( ((dir>0) && sLink.l) || ((dir<0) && sLink.r) ) {
					this.linkAt(sx,y).setTo( false, false, true, true );
				} else {
					this.linkAt(sx,y).setTo( false, false, false, false );
				}

			}
		}

		/**
		 * Shift column affecting rows from row (exclusive) and 
		 * upwards, towards the specified direction
		 */
		GraphRoute.prototype.shiftNodes = function(col, row, dir) {

			// If dir>0 [ -> ] Shift matrix:
			// xFrom=this.maxWidth, xTo=col, Moving x-1 -> x
			// yFrom=0,   		    yTo= row

			// If dir<0 [ <- ] Shift matrix:
			// xFrom=0, xTo=col, Moving x+1 -> x
			// yFrom=0,   		    yTo= row

			// Start from opposite direction
			var start=0;
			if (dir > 0) start=this.maxWidth;

			// Iterate on columns
			for (var x=start; x != col; x-=dir) {
				// Find source X
				var sx = x - dir;
				// Shift existing columns
				if (this.nodes[sx] != undefined) {
					for (var y=0; y<=row; y++) {
						// Shift cell
						this.shiftCell(x,y,dir);
					}
				}
			}
		}

		/**
		 * Solve a step
		 */
		GraphRoute.prototype.placeNode = function(node,direction,x,y,parentX) {

			// Put link after y=0
			if (y > 0) {
				// Connect to me
				this.linkAt(x,y).d = true;
				// Link with parent
				if (x == parentX) {
					// Connect with parent
					this.linkAt(x,y).u = true;
				} else {
					// Connect with neighbor
					if (parentX > x) {
						this.linkAt(x,y).r = true;
						this.linkAt(x+1,y).l = true;
					} else {
						this.linkAt(x,y).l = true;
						this.linkAt(x-1,y).r = true;
					}
				}
			}

			// Increase depth
			y += 1;

			// Traverse children
			var postInsertPlace = [];
			for (var i=0; i<node.children.length; i++) {
				var r = ((i%2)*2-1) * direction,
					d = Math.ceil(i/2) * r;

				// If we have a node there, perform shift
				if (this.hasAt(x+d, y)) {
					// Shift column X towards direction of d
					// applying on rows on y (inclusive) and upwards
					this.shiftNodes(x+d, y, r );
					// Correct if this was same parent
					if (d==0) this.shiftCell(x+d, y-1, -r);
				}

				// Place node
				this.putNodeAt(x+d,y, node.children[i]);

				// Continue after insert
				postInsertPlace.push([ node.children[i], r, x+d, y, x ])

			}

			for (var i=0; i<postInsertPlace.length; i++)
				this.placeNode.apply( this, postInsertPlace[i] );

		};

		/**
		 * Route graph
		 */
		GraphRoute.prototype.solve = function() {

			// Start solver
			var midX = parseInt(this.maxWidth / 2);

			// Place node
			this.putNodeAt(midX,0, this.rootNode);

			// Start solving
			this.placeNode(
				this.rootNode, 	// Root node
				1, 				// Start with right-hand direction
				midX, 			// Start from the middle of the width
				0, 				// Start from the beginning of the height
				midX			// Parent node was in the same position
			);

			// Compact column edges
			while (this.nodes[0] == undefined) {
				this.nodes.shift();
				this.links.shift();
			}
			while (this.nodes[this.nodes.length-1] == undefined) {
				this.nodes.pop();
				this.links.pop();
			}

			// Return solver
			return this;

		}

		/**
		 * Return solution as table
		 */
		GraphRoute.prototype.solutionAsTable = function( nodeFn, linkFn ) {
			var table = $('<table></table>'),
				mkLinkFn = linkFn || function(link) {
					return $('<td class="l'+link.toNumber()+'"></td>');
				},
				mkNodeFn = nodeFn || function(node) {
					return $('<td>'+node.name+'</td>');
				};
			
			// Iterate over rows
			for (var y=0; y<=this.maxDepth; y++) {
				var rowLinks = $('<tr class="row-links"></tr>'),
					rowNodes = $('<tr class="row-nodes"></tr>');

				// Iterate over nodes
				for (var x=0; x<this.nodes.length; x++) {
					var n = this.nodes[x][y],
						l = this.links[x][y];

					// If we have a link, place link
					if (l !== undefined) {
						rowLinks.append( mkLinkFn(l) )
					} else {
						rowLinks.append($('<td></td>'));
					}

					// If we have a node, place node
					if (n !== undefined) {
						rowNodes.append( mkNodeFn(n) )
					} else {
						rowNodes.append($('<td></td>'));
					}
				}

				// Store node and links
				if (y > 0) table.append(rowLinks);
				table.append(rowNodes);
			}

			// Return table
			return table;
		}

		return GraphRoute;

	}
	
);