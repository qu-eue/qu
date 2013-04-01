import play.*;
import play.jobs.*;
import play.test.*;

import models.*;

@OnApplicationStart
public class Bootstrap extends Job
{

	public void doJob()
	{
		// Check if the database is empty
		if (Account.count() == 0)
		{
			Fixtures.deleteDatabase();
			Fixtures.loadModels("data.yml");
		}
	}

}
