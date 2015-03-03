<?php

/* Read server configuration */
if (!is_file("config.php"))
	die(json_encode(array(
			"status" => "error",
			"message" => "Server is not configured properly!"
		)));
$config = require("config.php");

/* Get remote IP */
$userip = $_SERVER['REMOTE_ADDR'];
if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
	$userip = $_SERVER['HTTP_X_FORWARDED_FOR'];
}

/* If we have multiple IPs, resolve the first */
$parts = explode(",", $userip);
$resolveip = $parts[0];

/* Connect to SQL */
$mysqli = new mysqli($config['server'], $config['server_user'], $config['server_pass'], $config['server_db']);
if ($mysqli->connect_errno) {
	die(json_encode(array(
			"status" => "error",
			"message" => "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error
		)));
}

/* If we have an e-mail, subscribe */
if (isset($_POST['email'])) {

	// Prepare insert statement
	if (!($stmt = $mysqli->prepare("INSERT INTO teaser_users (email,ip,host,useragent) VALUES (?,?,?,?)"))) {
		die(json_encode(array(
				"status" => "error",
				"message" => "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error
			)));
	}

	// Bind parameters
	if (!$stmt->bind_param("ssss", $_POST['email'], $userip, gethostbyaddr($resolveip), $_SERVER['HTTP_USER_AGENT'] )) {
		die(json_encode(array(
				"status" => "error",
				"message" => "Binding parameters failed: (" . $mysqli->errno . ") " . $mysqli->error
			)));
	}

	// Execute statement
	if (!$stmt->execute()) {
		die(json_encode(array(
				"status" => "error",
				"message" => "Execute failed: (" . $mysqli->errno . ") " . $mysqli->error
			)));
	}

	// OK!
	echo(json_encode(array(
			"status" => "ok"
		)));

}

?>