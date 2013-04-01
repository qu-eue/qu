import java.util.List;

import models.Account;
import models.menu.Category;
import models.menu.Subcategory;

import org.junit.Before;
import org.junit.Test;

import play.db.jpa.GenericModel;
import play.test.Fixtures;
import play.test.UnitTest;

public class CategoryTest extends UnitTest
{
	@Before
	public void setup()
	{
		Fixtures.deleteDatabase();

		// Make assertions here about the emptiness of the database
	}

	@Test
	public void createBasicCategory()
	{
		Account karel = new Account("karel1990", "karel@gmail.com",
				"password").save();

		new Category(karel, "Drinks").save();
		List<Category> categories = Category.find("byAccount", karel).fetch();
		Category firstAndOnlyCategory = categories.get(0);

		// Assertions
		assertEquals(1, Category.count());
		assertEquals(1, categories.size());
		assertNotNull(firstAndOnlyCategory);
		assertEquals(karel, firstAndOnlyCategory.account);
		assertEquals("Drinks", firstAndOnlyCategory.title);
	}

	@Test
	public void addSubcategoryToCategory()
	{
		Account karel = new Account("karel1990", "karel@gmail.com",
				"password").save();

		Category category = new Category(karel, "Drinks").save();
		category.addSubcategory("Coffee");
		category.addSubcategory("Tea");

		category = Category.find("byAccount", karel).first();

		// Assertions
		assertNotNull(category);
		assertEquals(2, category.subcategories.size());
		assertEquals("Coffee", category.subcategories.get(0).subTitle);
		category.delete();
		assertEquals(1, Account.count());
		assertEquals(0, Category.count());
		assertEquals(0, Subcategory.count());
	}
}
