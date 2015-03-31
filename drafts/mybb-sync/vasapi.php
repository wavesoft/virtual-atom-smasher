<?php
/**
 * Virtual Atom Smasher 1.0 Beta
 *
 * Assisting API
 */

define("IN_MYBB", 1);
define('THIS_SCRIPT', 'showthread.php');

require_once "./global.php";
require_once "./inc/vasapi-config.php";

/**
 * Boilerplace to start an HTML page
 */
function begin_page() {
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Virtual Atom Smasher - Synchronization Script</titlE>
<?php
}

/**
 * End header
 */
function end_header() {
?>
	</head>
	<body>
<?php
}

/**
 * Boilerplate to end the HTML page
 */
function end_body() {
?>
	</body>
</html>
<?php
}

/**
 * Get mybb team forum by team name and parent
 */
function get_forum_id( $t_name, $pid ) {
	global $db;

	// Fetch the respective user information from the MyBB Database
	$query = $db->simple_select("forums", "fid", "name='" . $t_name . "' AND pid =".$pid, array(
	    "order_by" => 'fid',
	    "order_dir" => 'DESC',
	    "limit" => 1
	));
	$forum_details = $db->fetch_array($query);

	// Return forum ID or false on error
	if (!$forum_details) return false;
	return $forum_details['fid'];
}

/**
 * Get usergroup
 */
function get_usergroup_byid( $g_id ) {
	global $db;

	// Fetch the respective user information from the MyBB Database
	$query = $db->simple_select("usergroups", "*", "gid='" . $g_id . "'", array(
	    "order_by" => 'gid',
	    "order_dir" => 'DESC',
	    "limit" => 1
	));
	$usergroup = $db->fetch_array($query);

	// Return forum ID or false on error
	if (!$usergroup) return false;
	return $usergroup;

}

/**
 * Get forum parent ID
 */
function get_forum_pid( $id ) {
	global $db;

	// Fetch the respective user information from the MyBB Database
	$query = $db->simple_select("forums", "pid", "fid=" . $id , array(
	    "order_by" => 'fid',
	    "order_dir" => 'DESC',
	    "limit" => 1
	));
	$forum_details = $db->fetch_array($query);

	// Return forum ID or false on error
	if (!$forum_details) return false;
	return $forum_details['pid'];

}

/**
 * Get path of parent IDs
 */
function get_parentlist( $id ) {

	// Start path
	$path = ''.$id;

	// Start worning backwords
	while ( ($id = get_forum_pid($id)) ) {
		$path = $id.','.$path;
	}

	// Return path
	return $path;
}

/**
 * Return the mybb usergroup ID by the team ID
 */
function get_team_id( $t_name ) {
	global $db;

	// Fetch the respective user information from the MyBB Database
	$query = $db->simple_select("usergroups", "gid", "title='" . $t_name . "'", array(
	    "order_by" => 'title',
	    "order_dir" => 'DESC',
	    "limit" => 1
	));
	$forum_details = $db->fetch_array($query);

	// Return forum ID or false on error
	if (!$forum_details) return false;
	return $forum_details['fid'];
}

/**
 * Return thread ID by the given thread title and parent
 */
function get_term_thread( $subject, $fid ) {
	global $db;

	// Fetch the respective user information from the MyBB Database
	$query = $db->simple_select("threads", "tid", "subject='" . $subject . "' AND fid =".$fid, array(
	    "order_by" => 'tid',
	    "order_dir" => 'DESC',
	    "limit" => 1
	));
	$thread_details = $db->fetch_array($query);

	// Return forum ID or false on error
	if (!$thread_details) return false;
	return $thread_details['tid'];

}

/**
 * Create a forum
 */
function create_forum( $f_name, $f_parent=0, $f_description="" ) {
	global $db, $cache;

	// Create new forum
	$db->insert_query("forums", array(
			'name' => $f_name,
			'description' => $f_description,
			'type' => 'f',

			'pid' => $f_parent,
			'parentlist' => '',

			'active' => 1,
			'open' => 1,

			'lastposter' => 0,

			'allowmycode' => 1,
			'allowsmilies' => 1,
			'allowimgcode' => 1,
			'allowvideocode' => 1,
			'allowpicons' => 1,
			'allowtratings' => 1,
			'usepostcounts' => 1,
			'usethreadcounts' => 1,
			'showinjump' => 1,
		));

	// Get ID and check for failures
	$fid = get_forum_id( $f_name, $f_parent );
	if (!$fid) return false;

	// Update parentlist
	print("CREATED FORUM: $fid");
	$db->update_query("forums", array(
			'parentlist' => get_parentlist($fid),
		), 'fid='.$fid);

	// Update forums cache
	$cache->update_forums();

	// Return forum ID
	return $fid;

}

/**
 * Set group permissions on the given group
 */
function set_explicit_permissions( $fid, $enable_gid=array(), $disable_gid=array() ) {
	global $db, $cache;

	// Disabling permissions
	$disable = array(
  		'canview' => 0,
  		'canviewthreads' => 0,
  		'canonlyviewownthreads' => 0,
  		'candlattachments' => 0,
  		'canpostthreads' => 0,
  		'canpostreplys' => 0,
  		'canonlyreplyownthreads' => 0,
  		'canpostattachments' => 0,
  		'canratethreads' => 0,
  		'caneditposts' => 0,
  		'candeleteposts' => 0,
  		'candeletethreads' => 0,
  		'caneditattachments' => 0,
  		'modposts' => 0,
  		'modthreads' => 0,
  		'mod_edit_posts' => 0,
  		'modattachments' => 0,
  		'canpostpolls' => 0,
  		'canvotepolls' => 0,
  		'cansearch' => 0
  	);

	// Enabling permissions (To the group)
	$enable = array(
  		'canview' => 1,
  		'canviewthreads' => 1,
  		'canonlyviewownthreads' => 0,
  		'candlattachments' => 0,
  		'canpostthreads' => 1,
  		'canpostreplys' => 1,
  		'canonlyreplyownthreads' => 0,
  		'canpostattachments' => 0,
  		'canratethreads' => 0,
  		'caneditposts' => 1,
  		'candeleteposts' => 0,
  		'candeletethreads' => 0,
  		'caneditattachments' => 0,
  		'modposts' => 0,
  		'modthreads' => 0,
  		'mod_edit_posts' => 0,
  		'modattachments' => 0,
  		'canpostpolls' => 1,
  		'canvotepolls' => 0,
  		'cansearch' => 0
  	);
  	// Drop all current permissions
  	$db->delete_query("forumpermissions", "fid=".$fid);

	// Grand special permissions
	foreach ($enable_gid as $gid) {
		$db->insert_query("forumpermissions", array_merge($enable, array(
				'fid' => $fid,
				'gid' => $gid
			)));
	}

	// Drop detault permissions
	foreach ($disable_gid as $gid) {
		$db->insert_query("forumpermissions", array_merge($disable, array(
				'fid' => $fid,
				'gid' => $gid
			)));
	}

	// Update forum permissions
	$cache->update_forumpermissions();

}

/**
 * Create a team forum
 */
function create_usergroup( $g_id, $g_title, $g_desc, $g_image, $g_template ) {
	global $db;

	// Get template group
	$group_fields = get_usergroup_byid($g_template);
	if (!$group_fields) return false;

	// Update fields
	$group_fields['gid'] = $g_id;
	$group_fields['type'] = 2;
	$group_fields['title'] = $g_title;
	$group_fields['image'] = $g_image;
	$group_fields['description'] = $g_desc;

	// Create new forum
	$db->insert_query("usergroups", $group_fields);

	// Return fields
	return $group_fields;

}

/**
 * Get or create usergroup
 */
function get_or_sync_group( $details ) {
	global $db;

	// MyBB UserGroup is team_id + 100
	$bbid = 100 + $details['t_id'];
	$usergroup = get_usergroup_byid( $bbid );
	if (!$usergroup) {

		// Create if missing
		$usergroup = create_usergroup(
				$bbid,
				PREFIX_GROUP . $details['t_name'],
				$details['t_desc'],
				$details['t_avatar'],
				GID_TEMPLATE
			);

	} else {

		// Check if something is different
		if ( ($group_fields['title'] != (PREFIX_GROUP . $details['t_name'])) ||
			 ($group_fields['description'] != $details['t_desc']) ||
			 ($group_fields['image'] != $details['t_avatar']) ) {

			// Update (sync) group
			$query = $db->update_query("usergroups", array(
					'title' => PREFIX_GROUP . $details['t_name'],
					'description' => $details['t_desc'],
					'image' => $details['t_avatar']
				), 'gid='.$bbid );

		}

	}

	// Update group if needed


	// Return usergroup
	return $usergroup;

}


/**
 * Get or create team forum
 */
function get_or_create_team_forum( $details, $parent_pid, $owner_gid ) {

	// Get forum ID
	$fid = get_forum_id( PREFIX_FORUM . $details['t_name'], $parent_pid );
	if ($fid !== false) return $fid;

	// Not found? Create new
	$fid = create_forum( PREFIX_FORUM . $details['t_name'], $parent_pid, DESC_TEAM_FORUM );
	if (!$fid) return false;

	// Create specific permissions
	set_explicit_permissions(
			$fid,
			array( $owner_gid ),
			explode(",",DISABLE_TEAM_GIDS)
		);

	// Return forum ID
	return $fid;

}

/**
 * Get or create thread
 */

////////////////////////////////////////////////////////////
// Log user in and synchronize his/her group
////////////////////////////////////////////////////////////

// Require user authentication token
if (!isset($_GET['auth'])) die("ERROR: Please specify user authentication token!");

// Get details for this token
$db->select_db( DB_LIVEQ );
$query = $db->query(
	"SELECT `user`.email, 
	`user`.displayName,
	`user`.groups, 
	team.id AS t_id, 
	team.uuid AS t_uuid, 
	team.`name` AS t_name, 
	team.`description` AS t_desc, 
	team.avatar AS t_avatar
FROM usertokens INNER JOIN `user` ON usertokens.user_id = `user`.id
	 INNER JOIN teammembers ON usertokens.user_id = teammembers.user_id
	 INNER JOIN team ON teammembers.team_id = team.id
WHERE `usertokens`.`token` = '" . mysql_escape_string($_GET['auth']) . "'
ORDER BY `user`.email ASC, `user`.groups ASC, t_uuid ASC, t_name ASC, t_avatar ASC"
);
$details = $db->fetch_array($query);
$db->select_db( DB_MYBB );

// Check response
if (!$details) {
	die("ERROR: Invalid user authentication token or user not part of a team!");
}

// Fetch the respective user information from the MyBB Database
$query = $db->simple_select("users", "*", "email='". $details['email'] ."'", array(
    "order_by" => 'email',
    "order_dir" => 'DESC',
    "limit" => 1
));
$mybb_user = $db->fetch_array($query);
if (!$mybb_user) {
	die("ERROR: User does not exist in MyBB Database. Please contact an administrator!");
}

// Fetch or create user group
$mybb_group = get_or_sync_group( $details );

// Update display name if it has changed
if ($mybb_user['username'] != $details['displayName']) {

	// Update username
	$query = $db->update_query("users", array(
			'username' => $details['displayName']
		), 'uid='.$mybb_user['uid'] );

}

// Update usergroup if not match
if ($mybb_user['usergroup'] != $mybb_group['gid']) {

	// TODO: Change this in order to preserve list information!
	// Update user group
	$query = $db->update_query("users", array(
			'usergroup' => $mybb_group['gid']
		), 'uid='.$mybb_user['uid'] );

	// Update group in user_group
	$mybb_user['usergroup'] = $mybb_group['gid'];

	// Update usergroups cache
	$cache->update_usergroups();

}

// Log user in
require_once MYBB_ROOT."inc/datahandlers/login.php";
$loginhandler = new LoginDataHandler("get");
$loginhandler->login_data = $mybb_user;
if (!$loginhandler->complete_login()) {
	die("ERROR: Could not log user in!");
}

////////////////////////////////////////////////////////////
// Handle requests
////////////////////////////////////////////////////////////

if (isset($_GET['term'])) {

	// Explain the specified term
	$term = mysql_escape_string($_GET['term']);

	// Get scope (parent forum)
	if ($_GET['scope'] == 'public') {

		// Create thread in the public forum
		$pid = FORUM_PARENT_PUBLIC;

	} else if ($_GET['scope'] == 'team') {

		// Get forum ID for our team
		$pid = get_or_create_team_forum( $details, FORUM_PARENT_TEAM, $mybb_group['gid'] );

	} else if ($_GET['scope'] == 'experts') {

		// Create thread in the experts forum
		$pid = FORUM_PARENT_EXPERTS;

	} else {
		die("ERROR: Expecting 'public', 'team' or 'experts' scope!");
	}

	// Check if we have such thread already
	$tid = get_term_thread( PREFIX_TERM . $term, $pid );
	if (!$tid) {

		// Create a submit form and submit
		begin_page();
		end_header();
		?>
		<form id="newthread_form" method="post" action="newthread.php?fid=<?php echo $pid; ?>&amp;processed=1">
			<input type="hidden" name="my_post_key" value="<?php echo generate_post_check(); ?>" />
			<input type="hidden" name="subject" value="<?php echo htmlspecialchars($_GET['term']); ?>" />
			<input type="hidden" name="icon" value="-1" />
			<input type="hidden" name="action" value="do_newthread" />
			<input type="hidden" name="posthash" value="<?php md5($mybb_user['uid'].random_str()); ?>" />
			<input type="hidden" name="tid" value="0" />
			<input type="hidden" name="previewpost" value="Preview Post" />
			<textarea name="message" style="visibility:hidden;"><?php echo BODY_NEW_THREAD; ?></textarea>
		</form>
		<script type="text/javascript">document.getElementById('newthread_form').submit();</script>
		<?php
		end_body();

	} else {

		// Nagivate to the thread
		header("Location: showthread.php?tid=" . $tid);

	}

} else if (isset($_GET['pm'])) {

	// Redirect
	header("Location: private.php?action=read&pmid=".$_GET['pm']);

} else if (isset($_GET['profile'])) {

	// Display the profile of the user with the specified username
	$username = mysql_escape_string($_GET['profile']);

	// Get user ID
	$user = get_user_by_username($username);

	// Redirect
	header("Location: member.php?action=profile&uid=".$user['uid']);

} else if (isset($_GET['feedback'])) {

	// Decode parameters
	$params = json_decode( $_GET['feedback'] );

	// Create a submit form and submit
	begin_page();
	end_header();
	?>
	<form id="newthread_form" method="post" action="newthread.php?fid=<?php echo FORUM_FEEDBACK; ?>&amp;processed=1">
		<input type="hidden" name="my_post_key" value="<?php echo generate_post_check(); ?>" />
		<input type="hidden" name="subject" value="... Write a short description ..." />
		<input type="hidden" name="icon" value="-1" />
		<input type="hidden" name="action" value="do_newthread" />
		<input type="hidden" name="posthash" value="<?php md5($mybb_user['uid'].random_str()); ?>" />
		<input type="hidden" name="tid" value="0" />
		<input type="hidden" name="previewpost" value="Preview Post" />
		<textarea name="message" style="visibility:hidden;"><?php

		echo "... Write your feedback here ...\n";
		echo "\n";
		echo "-----------------\n";
		echo "The following information are automaticaly provided in order to help the developer. Please don't modify:\n";
		echo "[code]";
		foreach ($params as $k => $v) {
			echo "$k: $v\n";
		}
		echo "[/code]";

		?></textarea>
	</form>
	<script type="text/javascript">document.getElementById('newthread_form').submit();</script>
	<?php
	end_body();


} else if (isset($_GET['goto'])) {
	$target = $_GET['goto'];

	if ($target == 'teamforum') {

		// Go to team forum
		$fid = get_or_create_team_forum( $details, FORUM_PARENT_TEAM, $mybb_group['gid'] );
		header("Location: forumdisplay.php?fid=" . $fid );

	} else if ($target == 'compose') {

		// Compose a new PM
		header("Location: private.php?action=send");

	}

}

?>