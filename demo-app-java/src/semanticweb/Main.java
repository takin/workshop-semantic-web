package semanticweb;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/endpoint")
public class Main {

	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String handle() {
		return "hello";
	}
	
}
