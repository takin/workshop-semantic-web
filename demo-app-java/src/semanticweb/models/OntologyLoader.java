package semanticweb.models;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.semanticweb.HermiT.Reasoner;
import org.semanticweb.owlapi.apibinding.OWLManager;
import org.semanticweb.owlapi.model.IRI;
import org.semanticweb.owlapi.model.OWLDataFactory;
import org.semanticweb.owlapi.model.OWLEntity;
import org.semanticweb.owlapi.model.OWLOntology;
import org.semanticweb.owlapi.model.OWLOntologyCreationException;
import org.semanticweb.owlapi.model.OWLOntologyManager;
import org.semanticweb.owlapi.reasoner.InferenceType;
import org.semanticweb.owlapi.reasoner.OWLReasoner;
import org.semanticweb.owlapi.util.SimpleShortFormProvider;

import de.derivo.sparqldlapi.Query;
import de.derivo.sparqldlapi.QueryArgument;
import de.derivo.sparqldlapi.QueryBinding;
import de.derivo.sparqldlapi.QueryEngine;
import de.derivo.sparqldlapi.QueryResult;
import de.derivo.sparqldlapi.exceptions.QueryEngineException;
import de.derivo.sparqldlapi.exceptions.QueryParserException;

public class OntologyLoader {

	private OWLOntologyManager ontologyManager;
	private OWLOntology theOntology;
	private OWLDataFactory dataFactory;
	private OWLReasoner reasoner;
	private SimpleShortFormProvider shortForm;
	
	public OntologyLoader() throws OWLOntologyCreationException {
		IRI ontologyIRI = IRI.create("http://localhost:8080/demo-app-java/ontology/universitas-owl.owl");
		ontologyManager = OWLManager.createOWLOntologyManager();
		theOntology = ontologyManager.loadOntology(ontologyIRI);
		dataFactory = ontologyManager.getOWLDataFactory();
		reasoner = new Reasoner(theOntology);
		reasoner.precomputeInferences(InferenceType.CLASS_ASSERTIONS);
		
		shortForm = new SimpleShortFormProvider();
	}
	
	public JSONArray doQuery(String path) throws QueryEngineException, QueryParserException, JSONException {
				
		QueryEngine qe = QueryEngine.create(ontologyManager, reasoner);
		
		String pathIRI = "<http://www.semanticweb.org/syamsul/ontologies/2016/0/university#"+path+">";
		
		String query = "select distinct * where {\n"
				+ "Type("+pathIRI+", ?type),\n"
				+ "PropertyValue("+pathIRI+", ?prop, ?value)\n"
				+ "}";
		
		Query q = Query.create(query);
		QueryResult queryResult = qe.execute(q);
		
		Map<String,String> data = new HashMap<>();
		List<String> types = new ArrayList<>();
		
		for ( QueryBinding binding:queryResult ) {
			
			QueryArgument typeArg = QueryArgument.newVar("type");
			QueryArgument propArg = QueryArgument.newVar("prop");
			QueryArgument valArg = QueryArgument.newVar("value");
			
			String typeBinding = binding.get(typeArg).getValue();
			String propBinding = binding.get(propArg).getValue();
			String valueBinding = binding.get(valArg).getValue();
			
			OWLEntity typeEntity = dataFactory.getOWLClass(IRI.create(typeBinding));
			OWLEntity propEntity = dataFactory.getOWLClass(IRI.create(propBinding));
			
			String typeShortForm = shortForm.getShortForm(typeEntity);
			String propShortForm = shortForm.getShortForm(propEntity);
			
			if ( !typeShortForm.equals("Thing") && !types.contains(typeShortForm) ) {
				types.add(typeShortForm);
			}
			
			if ( !data.containsKey(propShortForm) ) {
				data.put(propShortForm, valueBinding);
			}
			
		}
		
		Set<String> keys = data.keySet(); 
		
		JSONObject typeObject = new JSONObject();
		typeObject.put("type", new JSONArray(Arrays.asList(types.toArray())));
		
		JSONArray result = new JSONArray();
		
		result.put(typeObject);
		
		for ( String key:keys ) {
			JSONObject item = new JSONObject();
			item.put(key, data.get(key));
			result.put(item);
		}
		
		return result;
	}
}
