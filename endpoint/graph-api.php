<?php 
/**
 * Simple RDF Processor Endpoint using EASYRDF API version 0.9.0
 * @author Syamsul Muttaqin
 */
require_once('../api/easyrdf-0.9.0/lib/EasyRdf.php');

/**
 * Fungsi untuk melakukan traversing terhadap graph
 * @param  URI $graph_uri URI node yang akan di traverse
 * @return Array            array objek hasil traversing
 */
function graph_walker($the_graph, $the_resource) {
	//////////////////////////////////////////////////////////////////////
	// properties() method will return an array containing all properties
	// associated with the given resource in a "namespace:uri" form 
	// e.g rdf:type, univ:gambar
	///////////////////////////////////////////////////////////////////////
	$resource_properties = $the_graph->properties($the_resource);
	$result = [];
	
	foreach ($resource_properties as $property) {
		
		$graph_object = $the_graph->get($the_resource,$property);
		
		$uri = ( $graph_object instanceof EasyRdf_Resource ) 
			? $graph_object->getUri()
			: $graph_object->getValue();
		
		$item = new stdClass;
		$item->property = $property;
		$item->value = $uri;
		$result[] = $item;
	}
	return $result;
}

// print '<pre>';
if ( isset($_GET['resource']) ) {
	$requested_resource = 'univ:' . $_GET['resource'];
	//////////////////////////////////////////////////////////////////////////////////////
	// Set the namespace related to our RDF file namespace
	// Note:
	// For the standard namespaces like rdf,rdf,owl,foaf is already defined by the API
	// so we do not need to explicitly define it here
	// ////////////////////////////////////////////////////////////////////////////////////
	EasyRdf_Namespace::set('univ','http://www.semanticweb.org/workshop/2016/ontologies/university#');
	// instansiate the Graph Object
	$graph = new EasyRdf_Graph();
	//////////////////////////////////////////////////////////////////
	// load the RDF file into the graph object
	// Note:
	// Here we load the RDF via file I/O path, if you want to load
	// the RDF via HTTP then use load() method instead ($graph->load())
	// ////////////////////////////////////////////////////////////////
	$graph->parseFile('../ontology/universitas-rdfs.rdf','rdfxml');

	// At this stage, we are ready to process the graph
	// ==========================================================
	$response_object = graph_walker($graph, $requested_resource);
	
	header('Content-Type:application/json');
	echo json_encode($response_object);
}