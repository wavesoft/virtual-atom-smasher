#!/usr/bin/env python
import re
import json
import glob
import os
import fnmatch

# Precompile some regex patterns
REGEX_DEFINITON = re.compile("^\s*define\s*\([^\[]*\[([^\]]+)\]\s*,[\s\S]*?function\s*\(([^)]+)\)", re.I)
REGEX_COMMA_SPLIT = re.compile("\s*,\s*")
REGEX_PROTO_CREATE = re.compile("([\w]+).prototype\s*=\s*Object.create\s*\(\s*([^)]+)\)", re.I)
REGEX_PROTO = re.compile("([\w]+).prototype\s*=")
REGEX_REGISTRATION = re.compile("\.registerComponent\s*\(\s*['\"]([^'\"]+)['\"]\s*,\s*([\w]+)")
REGEX_USAGE = re.compile("\.instanceComponent\s*\(\s*['\"]([^'\"]+)['\"]")
REGEX_STRING_LITERAL = re.compile(r"(['\"])(.*?)([^\\])\1")
REGEX_COMMENT_INLINE = re.compile(r"//.*\n")
REGEX_COMMENT_MULTILINE = re.compile(r"/\*[\s\S]*?\*/")
REGEX_SPLIT_JSPPROP = re.compile(r"\.|\[")

# Locate path libraries
DIR_ROOT = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
DIR_MODULES = "%s/src/modules" % DIR_ROOT
DIR_DOC = "%s/doc" % DIR_ROOT

# The respective on-line github URL for linking
GITHUB_ROOT = "https://github.com/wavesoft/virtual-atom-smasher/blob/master"
GITHUB_MODULES = "%s/src/modules" % GITHUB_ROOT
GITHUB_DOC = "%s/doc" % GITHUB_ROOT

RAWGIT_ROOT = "https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master"
RAWGIT_DOC = "%s/doc" % RAWGIT_ROOT
RAWGIT_PLACEHOLDER_IMG = "https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png"

# The known modules for automatic resolution
KNOWN_MODULES = [
	"core", "extern", "tootr", "tootr_editor", "vas/basic", "vas/core", "vas/3d", "vas/media"
]

# Screen groups
COMPONENT_GROUPS = {
	"backdrop"	: "Background Graphics (Backdrops)",
	"dataviz"	: "Data Visualization",
	"explain"	: "Explaination Helpers",
	"explain"	: "Explaination Helpers",
	"infoblock"	: "Information Pop-up Block",
	"overlay"	: "Overlay Window",
	"screen"	: "Game Screen",
	"widget"	: "UI Widgets",
	"tutorial"	: "Tutorials",
	"nav"		: "Navigations",
	"other"		: "Other Components"
}

def parseCSA(args, stripChars="\'\""):
	"""
	Loosely parse comma-separated arguments
	"""

	# Split arguments at comma
	parts = REGEX_COMMA_SPLIT.split(args)
	ans = [ ]
	for p in parts:
		# Strip all wrong characters
		p = p.strip(" \t\r\n%s" % stripChars)
		# Add if not empty
		if p:
			ans.append( p )

	# Return ans
	return ans

def findLine(buf, rxMatch):
	"""
	Find the line where this match is found
	"""
	r = re.compile(rxMatch)
	for m in r.finditer(buf):
		return buf[0:m.start()].count("\n")+1
	return 0


class ScriptDesc:

	def __init__(self, filename):
		"""
		Initialize a script description object
		"""

		self.filename = filename
		self.dependencies = { }
		self.classes = { }
		self.exposedComponents = { }
		self.importedModules = [ ]
		self.importedComponents = [ ]
		self.stringLiterals = [ ]

		# Parse file
		self.parse(filename)

	def parse(self, filename):
		"""
		Parse the specified screen file and populate the description record
		"""

		# Read file
		buf = ""
		with open(filename, 'r') as f:
			buf = f.read()

		# Strip inline comments
		buf = REGEX_COMMENT_INLINE.sub("\n", buf)

		# Stip multiline comments (perserve line numbers)
		buf = REGEX_COMMENT_MULTILINE.sub(lambda x: "\n" * x.group(0).count("\n"), buf)

		# Stip define([...]) definition
		matches = REGEX_DEFINITON.findall(buf)
		if matches:

			# Get all dependency modules
			self.importedModules = parseCSA(matches[0][0])

			# Get all variable dependencies
			i = 0
			for var in parseCSA(matches[0][1]):
				self.dependencies[ var ] = self.importedModules[i]
				i += 1

		# Look all the possible defined classes (by looking for X.prototype = )
		matches = REGEX_PROTO.findall(buf)
		for match in matches:
			# Get the class name
			clsName = match
			self.classes[ clsName ] = {
				'parent': 'function',
				'line': findLine( buf, "var\s*%s\s*=\s*function|function\s*%s" % (clsName, clsName) )
			}

		# Lookup for base and prototype classes (by looking for "X.prototype = object.crate( Y )" )
		matches = REGEX_PROTO_CREATE.findall(buf)
		for match in matches:

			# Get the class name and parent
			clsName = match[0]
			clsParent = match[1][:-11] # Strip .prototype

			# Update parent
			self.classes[clsName]['parent'] = clsParent

		# Find the exposed components
		matches = REGEX_REGISTRATION.findall(buf)
		for match in matches:

			# Find the screen name and class
			self.exposedComponents[ match[0] ] = match[1]

		# Find all string literals (used for tracing screen usage)
		matches = REGEX_STRING_LITERAL.finditer(buf)
		for match in matches:

			# Include line number
			lineNum = buf[0:match.start(1)].count("\n") + 1
			self.stringLiterals.append( (match.group(2) + match.group(3), lineNum) )

		# Find direct instanceComponent requests
		matches = REGEX_USAGE.findall(buf)
		for match in matches:
			self.importedComponents.append(match)

		# print self.dependencies
		# print self.depVariables
		# print repr(self.classes)
		# print repr(self.exposedComponents)
		# print self.stringLiterals
		# print self.importedComponents

def loadJSON(filename):
	"""
	Read and parse json file
	"""
	with open(filename, 'r') as f:
		return json.loads(f.read())

def findFiles(baseDir, match="*.js"):
	"""
	Find files
	"""
	matches = []
	for root, dirnames, filenames in os.walk(baseDir):
		for filename in fnmatch.filter(filenames, match):
			matches.append(os.path.join(root, filename))
	return matches

def moduleToPath(module):
	"""
	Convert module to path
	"""

	# Check for module prefix
	for km in KNOWN_MODULES:
		if module.startswith("%s/" % km):
			return "%s/js/%s.js" % (km, module[len(km)+1:])

	# Otherwise return as-is
	return "%s.js" % module

moduleCache = { }
def getScriptDesc(module):
	"""
	Return (cached) details about a script
	"""
	global moduleCache
	if module in moduleCache:
		return moduleCache[module]

	# Try to laod module
	mfile = "%s/%s" % ( DIR_MODULES, moduleToPath(module) )
	if not os.path.exists(mfile):
		mod = None
	else:
		mod = ScriptDesc(mfile)

	# Update cache
	moduleCache[module] = mod
	return mod

# Load screen definition
screenDesc = loadJSON("%s/screens.json" % DIR_DOC)
screenDef = { }

# Locate all javascript files from the base implementation
baseDir = "%s/vas/basic/js" % DIR_MODULES
baseScreenFiles = findFiles(baseDir, "*.js")
for fname in baseScreenFiles:

	# Find module name from file name
	modName = "vas/basic" + fname[len(baseDir):-3]
	modRelPath = moduleToPath( modName )
	modURL = "%s/%s" % (GITHUB_MODULES, modRelPath)

	# Parse screen
	screen = ScriptDesc( fname )
	for comName, comClass in screen.exposedComponents.iteritems():

		# Find the base class
		baseClass = screen.classes[ comClass ]

		# Find which import exposes that base class
		parts = REGEX_SPLIT_JSPPROP.split(baseClass['parent'], 1)
		baseClassModule = ""
		baseClassImport = baseClass['parent']
		if len(parts) > 1:
			if parts[0] in screen.dependencies:
				baseClassImport = parts[1]
				baseClassModule = screen.dependencies[parts[0]]
			else:
				print "WARN: Screen uses base class '%s' that is not imported" % parts[0]
		else:
			if baseClassImport in screen.dependencies:
				baseClassModule = screen.dependencies[baseClassImport]
			else:
				print "WARN: Screen uses base class '%s' that is not imported" % baseClassImport

		# Get parent details
		parentFile = moduleToPath( baseClassModule )
		parentScriptDesc = getScriptDesc( baseClassModule )
		
		# Find parent class line
		parentClassLine = None
		if baseClassImport in parentScriptDesc.classes:
			parentClassLine = parentScriptDesc.classes[baseClassImport]['line']

		# Calculate parent class URL
		parentURL = "%s/%s" % (GITHUB_MODULES, parentFile)
		if not parentClassLine is None:
			parentURL += "#L%s" % parentClassLine

		# Do we have description?
		comDesc = "(Missing description)"
		if comName in screenDesc:
			comDesc = screenDesc[comName]

		# Do we have thumbnail?
		thumbURL = RAWGIT_PLACEHOLDER_IMG
		thumbFile = "Thumbnails/%s.png" % comName
		if os.path.exists("%s/%s" % (DIR_DOC, thumbFile) ):
			thumbURL = "%s/%s" % (RAWGIT_DOC, thumbFile)

		# The CSS file
		cssFile = ""


		# Get per-screen information
		screenDef[ comName ] = {

			"component"		: comName,
			"desc"			: comDesc,
			"thumb"			: thumbURL,

			"com_module"	: modName,
			"com_file"		: modRelPath,
			"com_url"		: "%s#L%i" % (modURL, baseClass['line']),
			"com_line"		: baseClass['line'],

			"base_module"	: baseClassModule,
			"base_class"	: baseClassImport,
			"base_file"		: parentFile,
			"base_url"		: parentURL,
			"base_line"		: parentClassLine,

			"css_file"		: cssFile,

			"ref" 			: [ ],

		}

# Trace dependencies
used_screen = [ ]
scan_stack = [ "vas/core/main", "vas/core/ui" ]
while len(scan_stack) > 0:

	# Get current module
	currMod = scan_stack.pop(0)
	currModPath = moduleToPath(currMod)
	currModURL = "%s/%s" % (GITHUB_MODULES, currModPath)

	# Load scriptdesc of next item
	sd = getScriptDesc( currMod )
	if sd is None:
		print "WARN: Could not parse %s (%s)" % (currMod, currModPath)

	# Scan all string literals for known screens
	for sl, line in sd.stringLiterals:

		# Check if we found a screen
		if sl in screenDef:

			# Skip self-reference
			sd = screenDef[sl]
			if sd['com_module'] == currMod:
				continue

			# Find the screen exposed by this module
			screen = ""
			for k,v in screenDef.iteritems():
				if v['com_module'] == currMod:
					screen = k
					break

			# Add reference
			sd['ref'].append({
					'module' : currMod,
					'file'	 : currModPath,
					'line'	 : line,
					'screen' : screen,
					'url'	 : "%s#L%i" % (currModURL, line)
				})

			# Add that screen name on identified screens and to scan stack
			if not sl in used_screen:
				used_screen.append( sl )
				if not sl in scan_stack:
					scan_stack.append( sd['com_module'] )

# Process screens in sorted order
groups = { }
for scr in sorted(used_screen):

	# Get group
	group = scr.split(".")[0]

	# If that group is not known, use 'other'
	if not group in COMPONENT_GROUPS:
		group = "other"

	# Put on appropriate group
	if not group in groups:
		groups[group] = [ ]

	# Put screen in the group
	groups[group].append( screenDef[scr] )	

# Build Markdown Documentation
with open("%s/Screens-auto.md" % DIR_DOC, "w") as f:

	f.write("This document contains a list with all the UI components currently used in the Virtual Atom Smasher game.\n\n")

	f.write("""

# Table of Contents

<table>
	<tr>
		<th>Component</th>
		<th>Base Class</th>
		<th>Base Class Module</th>
	</tr>
""")

	# Write TOC
	for group, screens in groups.iteritems():
		for scr in screens:
			f.write("""
	<tr>
		<td><code><a href="#%s">%s</a></code></td>
		<td><code><a href="%s">%s</a></code></td>
		<td><a href="%s">%s</a></td>
	</tr>
""" % ( scr['component'].replace(".",""), scr['component'],
		scr['base_url'], scr['base_class'],
		scr['base_url'], scr['base_module'] ))
	
	# Write footer
	f.write("</table>")

	# WRite screens
	for group, screens in groups.iteritems():

		f.write("\n\n# %s" % COMPONENT_GROUPS[group])

		for scr in screens:

			# Write header
			f.write("\n\n## %s\n\n" % scr['component'] )

			# Write dependencies
			f.write(
				"""
<table>
	<tr>
		<td><img width="350" src="%s" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>%s</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>%s</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="%s">[%s]<strong>.%s</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="%s">%s</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href="%s">%s</strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
""" % ( 
					scr['thumb'],
					scr['component'],
					scr['com_module'],
					scr['base_url'], scr['base_module'], scr['base_class'],
					scr['com_url'], scr['com_file'],
					"", ""
				)
			)

			# Write description
			f.write("%s\n\n" % scr['desc'])

			# Check if we have uses
			if scr['ref']:
				f.write("\n### Used by\n")
				for ref in scr['ref']:
					if ref['screen']:
						f.write(" * Component [%s](%s)\n" % ( ref['screen'], ref['url'] ))
					else:
						f.write(" * Module [%s](%s)\n" % ( ref['module'], ref['url'] ))

