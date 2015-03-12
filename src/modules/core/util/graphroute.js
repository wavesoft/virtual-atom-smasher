
define(

	function() {

		/**
		 * GraphRoute is a class that solves
		 */
		var GraphRoute = function(rootNode) {
			// Keep nodes
			this.rootNode = rootNode;

			// Node structures
			this.nodeCols = [];
			this.linkCols = [];

			// Column shift so it's always on the positive range
			this.colShift = 100;

		}

		/**
		 * Check if we have node at (x,y)
		 */
		GraphRoute.prototype.hasAt = function(col,row) {

		}

		/**
		 * Put node at the given column/row
		 */
		GraphRoute.prototype.putAt = function(col,row,node) {

		}

		/**
		 * Set link type at given node
		 */
		GraphRoute.prototype.mergeLinkAt = function(col,row,type) {

		}

		/**
		 * Shift column to a direction
		 */
		GraphRoute.prototype.shift = function(col,dir) {
			var x = col + this.colShift,
				ncol = this.nodeCols[x],
				lcol = this.linkCols[x];
		}

		/**
		 * Solve a step
		 */
		GraphRoute.prototype.solveStep = function(node,direction,x,y) {

			// Put vertical link on the given cell
			this.mergeLinkAt(x,y,1);

			// Put node on current position
			this.putAt(x,y, node);

			// Traverse children
			y += 1;
			for (var i=0; i<node.children.length; i++) {
				var d = Math.ceil(i/2) * ((i%2)*2-1) * direction;

				// If we have a node there, perform shift
				if (this.hasAt(x+d,y)) {
					// Shift column X towards direction of d
					this.shift(x, d/Math.abs(d) );
				}

				// Store node
				this.solveStep( node.children[i], direction, x+d, y );

			}

		};

		/**
		 * Route graph
		 */
		GraphRoute.prototype.solve = function() {
			// Start solver
			this.solveStep(this.rootNode, 1, 0, 0);
		}

		return GraphRoute;

	}
	
);