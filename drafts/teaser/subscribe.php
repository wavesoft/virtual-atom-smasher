<?php

/* Server configuration */
$server = "";
$server_user = "";
$server_pass = "";
$server_db   = "";

/* Connect to SQL */
$mysqli = new mysqli($server, $server_user, $server_pass, $server_db);
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
	if (!$stmt->bind_param("ssss", $_POST['email'], $_SERVER['REMOTE_ADDR'], gethostbyaddr($_SERVER['REMOTE_ADDR']), $_SERVER['HTTP_USER_AGENT'] )) {
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