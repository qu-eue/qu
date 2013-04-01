import java.util.List;

import models.Account;
import models.menu.Category;

import org.junit.Before;
import org.junit.Test;

import play.test.Fixtures;
import play.test.UnitTest;

public class AccountTest extends UnitTest
{
	@Before
	public void deleteDatabase()
	{
		Fixtures.deleteDatabase();

		// Make assertions here about the emptiness of the database
	}

	@Test
	public void createAndRetrieveBasicAccount()
	{
		new Account("karel1990", "karel@gmail.com", "password").save();

		Account karel = Account.find("byEmail", "karel@gmail.com").first();

		// Assertions
		assertNotNull(karel);
		assertEquals("karel1990", karel.username);
	}

	@Test
	public void tryToConnectAsBasicAccount()
	{
		new Account("karel1990", "karel@gmail.com", "password").save();

		// Assertions
		assertNotNull(Account.emailConnect("karel@gmail.com", "password"));
		assertNotNull(Account.emailConnect("Karel@gmail.com", "password"));
		assertNull(Account.emailConnect("karelgmail.com", "password"));
		assertNotNull(Account.emailConnect("karel@Gmail.com", "password"));
		assertNull(Account.emailConnect("karel @gmail.com", "password"));
		assertNull(Account.emailConnect("", "password"));
		assertNull(Account.emailConnect("karel@gmail.com", "Password"));
		assertNull(Account.emailConnect("karel@gmail.com", "pass word"));
		assertNull(Account.emailConnect("karel@gmail.com", ""));
	}

	@Test
	public void checkAccountCategoryRelation()
	{
		Account karel = new Account("Karel Plusplus", "karel@gmail.com",
				"password").save();

		karel.addCategory("Food");
		karel.addCategory("Drinks");

		List<Category> categories = Category.find("byAccount", karel).fetch();
		List<Category> categories2 = Category.find("byTitle", "Food").fetch();
		
		assertEquals(1, categories2.size());

		// Assertions
		assertEquals(1, Account.count());
		assertEquals(2, Category.count());
		assertNotNull(categories.get(0));
		assertEquals("Food", categories.get(0).title);
		assertEquals("Drinks", categories.get(1).title);
		categories.get(1).delete();
		categories.get(0).delete();
		assertEquals(1, Account.count());
		assertEquals(0, Category.count());
	}
}
