package controllers;

import models.Account;
import models.menu.Category;
import models.menu.Item;
import models.menu.Subcategory;
import play.mvc.Controller;
import play.test.Fixtures;

public class MenuNavigation extends Controller
{
	public static void clickItem(Long id)
	{
		Item menuItem = Item.findById(id);
		render(menuItem);
	}

	public static void addCategoryWithValidate(Long accountId, String title)
	{
		Account account = Account.findById(accountId);
		Category category = Account.findCategory(accountId, title);

		if (category == null)
		{
			category = account.addCategory(title);
		}
		render(category);
	}

	public static void addItemList(Long accountId, String title)
	{
		Category category = Account.findCategory(accountId, title);
		render(category);
	}

	public static void resetDatabase(Long id)
	{
		Fixtures.deleteDatabase();
		Fixtures.loadModels("data.yml");
		String okay = "okay";
		render(okay);
	}
}
