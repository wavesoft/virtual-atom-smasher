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

};
