import java.util.List;

import models.Account;
import models.menu.Category;
import models.menu.Item;
import models.menu.Subcategory;

import org.junit.Before;
import org.junit.Test;

import play.test.Fixtures;
import play.test.UnitTest;

public class ItemTest extends UnitTest
{
	@Before
	public void setup()
	{
		Fixtures.deleteDatabase();

		// Make assertions here about the emptiness of the database
	}

	@Test
	public void createBasicItem()
	{
		Account karel = new Account("karel1990", "karel@gmail.com",
				"password").save();

		Category category = new Category(karel, "Drinks").save();

		Subcategory subcategory = new Subcategory(category, "Tea").save();

		new Item(subcategory, "Black Tea", 1.50).save();
		List<Item> items = Item.find("bySubcategory", subcategory).fetch();
		Item firstAndOnlyItem = items.get(0);

		// Assertions
		assertEquals(1, Item.count());
		assertEquals(1, items.size());
		assertNotNull(firstAndOnlyItem);
		assertEquals(subcategory, firstAndOnlyItem.subcategory);
		assertEquals("Black Tea", firstAndOnlyItem.itemTitle);
		assertEquals((Double) 1.50, firstAndOnlyItem.price);
	}

	@Test
	public void fullTest()
	{
		Fixtures.loadModels("data.yml");

		// Initial counts
		assertEquals(2, Account.count());
		assertEquals(4, Category.count());
		assertEquals(9, Subcategory.count());
		assertEquals(36, Item.count());

		// Account tests
		assertNotNull(Account.emailConnect("karel@gmail.com", "password"));
		assertNotNull(Account.emailConnect("java@gmail.com", "secret"));
		assertNotNull(Account.emailConnect("Karel@gmail.com", "password"));
		assertNull(Account.emailConnect("karelgmail.com", "password"));
		assertNotNull(Account.emailConnect("karel@Gmail.com", "password"));
		assertNull(Account.emailConnect("karel @gmail.com", "password"));
		assertNull(Account.emailConnect("", "password"));
		assertNull(Account.emailConnect("karel@gmail.com", "Password"));
		assertNull(Account.emailConnect("karel@gmail.com", "pass word"));
		assertNull(Account.emailConnect("karel@gmail.com", ""));
		assertNotNull(Account.emailConnect("Java@gmail.com", "secret"));
		assertNull(Account.emailConnect("javagmail.com", "secret"));
		assertNotNull(Account.emailConnect("java@Gmail.com", "secret"));
		assertNull(Account.emailConnect("java @gmail.com", "secret"));
		assertNull(Account.emailConnect("", "secret"));
		assertNull(Account.emailConnect("java@gmail.com", "Secret"));
		assertNull(Account.emailConnect("java@gmail.com", "sec ret"));
		assertNull(Account.emailConnect("java@gmail.com", ""));
		
		// Check category sizes
		List<Category> karelCategories = Category.find("account.email", "karel@gmail.com").fetch();
		assertEquals(2, karelCategories.size());
		List<Category> javaCategories = Category.find("account.email", "java@gmail.com").fetch();
		assertEquals(2, javaCategories.size());
		
		// Check subcategory sizes
		List<Subcategory> karelSubcategories = Subcategory.find("category.account.email", "karel@gmail.com").fetch();
		assertEquals(4, karelSubcategories.size());
		karelSubcategories = Subcategory.find("category.title", "Food").fetch();
		assertEquals(2, karelSubcategories.size());
		karelSubcategories = Subcategory.find("category.title", "Drinks").fetch();
		assertEquals(2, karelSubcategories.size());
		List<Subcategory> javaSubcategories = Subcategory.find("category.account.email", "java@gmail.com").fetch();
		assertEquals(5, javaSubcategories.size());
		javaSubcategories = Subcategory.find("category.title", "Grub").fetch();
		assertEquals(2, javaSubcategories.size());
		javaSubcategories = Subcategory.find("category.title", "Refreshments").fetch();
		assertEquals(3, javaSubcategories.size());
		
		// Find the most expensive item
		Item expensiveItem = Item.find("order by price desc").first();
		assertNotNull(expensiveItem);
		assertEquals((Double) 5.75, expensiveItem.price);
		assertEquals("Roast Beef", expensiveItem.itemTitle);
		
		// Find the least expensive item
		Item cheapItem = Item.find("order by price asc").first();
		assertNotNull(cheapItem);
		assertEquals((Double) 0.75, cheapItem.price);
		assertEquals("Espresso", cheapItem.itemTitle);
		
		javaSubcategories.get(2).addItem("Pliny The Younger", 12.00);
		expensiveItem = Item.find("order by price desc").first();
		assertNotNull(expensiveItem);
		assertEquals((Double) 12.00, expensiveItem.price);
		assertEquals("Pliny The Younger", expensiveItem.itemTitle);
	}
}
