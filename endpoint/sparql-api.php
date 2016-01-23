<?php
require_once('../api/easyrdf-0.9.0/lib/EasyRdf.php');

if( isset($_GET['resource']) ) {
	$resource = $_GET['resource'];
	$endpoint = new EasyRdf_Sparql_Client('http://id.dbpedia.org/sparql');
	$res = $endpoint->query("select distinct * where { <$resource> ?prop ?val . }");

	$graph = new EasyRdf_Graph();
	$final_results = [];

	foreach ($res as $r) {
		$item = new stdClass;
		$item->property = $r->prop->getUri();
		$item->value = ( $r->val instanceof EasyRdf_Resource ) ? $r->val->getUri() : $r->val->getValue();
		$final_results[] = $item;
	}
	header("Content-Type:application/json");
	echo json_encode($final_results);
}