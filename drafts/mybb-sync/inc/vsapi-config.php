<?php

define("DB_LIVEQ",				"liveq"); 		// The Database where LiveQ System Runs
define("DB_MYBB",				"mybb");  		// The MyBB Database

define("PREFIX_GROUP",			"VAS ");  		// The prefix for the user groups created by VAS sync script
define("PREFIX_FORUM",			""); 	  		// The prefix for the forums created by VAS sync script
define("PREFIX_TERM",			""); 	  		// The prefix for the term threads created by VAS sync script

define("FORUM_PARENT_PUBLIC",	5);       		// The parent forum/category where public discussion happens
define("FORUM_PARENT_TEAM",		6);       		// The parent forum/category in which team forums are created
define("FORUM_PARENT_EXPERTS",	7);      		// The parent forum/category where expert threads are created

define("DESC_TEAM_FORUM",						// The default description to a team forum created by VAS sync script
	"This is the private forum of your team. Only you and your team members have access here!");
define("BODY_NEW_THREAD",						// The body to a new thread post
	"Hello everyone! I am looking for some information about this particular parameter. Do you know anything?");

define("DISABLE_TEAM_GIDS",		"1,2,5"); 	// List of groups that should be restricted from accessing a team forum

define("GID_TEMPLATE",			2); 	 		// The group to copy fields from when creating usergroup
define("UID_VAS",				6);				// The Virtual Atom Smasher user as which to post the discussions


?>