/**
 * This plugin enables the '@registry' tags which are used
 * to mark a particular class for belonging in the registry.
 */
exports.defineTags = function(dictionary) {

    dictionary.defineTag("registry", {
        mustHaveValue: true,
        canHaveType: false,
        canHaveName: true,
        onTagged: function(doclet, tag) {
            doclet.registry = tag.value.name;
        }
    });

    /**
     * Thumbnail
     */
    dictionary.defineTag("thumbnail", {
        mustHaveValue: true,
        canHaveType: false,
        canHaveName: true,
        onTagged: function(doclet, tag) {
            doclet.thumbnail = tag.value.name;
        }
    });

    /**
     * One or more templates
     */
    dictionary.defineTag("template", {
        mustHaveValue: true,
        canHaveType: false,
        canHaveName: true,
        onTagged: function(doclet, tag) {
            if (!doclet.tpl)
                doclet.tpl = [ ];
            doclet.tpl.push( tag.value.name );
        }
    });

    /**
     * One or more css files
     */
    dictionary.defineTag("css", {
        mustHaveValue: true,
        canHaveType: false,
        canHaveName: true,
        onTagged: function(doclet, tag) {
            if (!doclet.css)
                doclet.css = [ ];
            doclet.css.push( tag.value.name );
        }
    });

};
