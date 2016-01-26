package semanticweb.controllers;


import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.semanticweb.owlapi.model.OWLOntologyCreationException;

import de.derivo.sparqldlapi.exceptions.QueryEngineException;
import de.derivo.sparqldlapi.exceptions.QueryParserException;
import semanticweb.models.OntologyLoader;


@Path("/endpoint")
public class Main {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response handleRequest(@QueryParam("resource") String resource) throws JSONException, OWLOntologyCreationException, QueryEngineException, QueryParserException {
		
		OntologyLoader loader = new OntologyLoader();
		JSONArray result = loader.doQuery(resource);
		
		return Response.status(200).entity(result).build();
	}
	
}
