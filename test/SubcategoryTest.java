import java.util.List;

import models.Account;
import models.menu.Category;
import models.menu.Subcategory;

import org.junit.Before;
import org.junit.Test;

import play.test.Fixtures;
import play.test.UnitTest;

public class SubcategoryTest extends UnitTest
{
	@Before
	public void setup()
	{
		Fixtures.deleteDatabase();

		// Make assertions here about the emptiness of the database
	}

	@Test
	public void createBasicSubcategory()
	{
		Account karel = new Account("karel1990", "karel@gmail.com",
				"password").save();

		Category category = new Category(karel, "Drinks").save();

		new Subcategory(category, "Tea").save();
		List<Subcategory> subcategories = Subcategory.find("byCategory",
				category).fetch();
		Subcategory firstAndOnlySubcategory = subcategories.get(0);

		// Assertions
		assertEquals(1, Subcategory.count());
		assertEquals(1, subcategories.size());
		assertNotNull(firstAndOnlySubcategory);
		assertEquals(category, firstAndOnlySubcategory.category);
		assertEquals("Tea", firstAndOnlySubcategory.subTitle);
	}
}
