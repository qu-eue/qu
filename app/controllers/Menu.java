package controllers;

import java.util.regex.Pattern;

import models.Account;
import models.menu.Category;
import models.menu.Item;
import models.menu.Subcategory;
import play.mvc.Controller;
import play.test.Fixtures;

public class Menu extends Controller
{
	public static final String COMMITTED = "true";
	public static final String NOT_COMMITTED = "false";

	final static String Digits = "(\\p{Digit}+)";
	final static String HexDigits = "(\\p{XDigit}+)";

	// an exponent is 'e' or 'E' followed by an optionally
	// signed decimal integer.
	final static String Exp = "[eE][+-]?" + Digits;
	final static String fpRegex = ("[\\x00-\\x20]*" + // Optional leading
														// "whitespace"
			"[+-]?(" + // Optional sign character
			"NaN|" + // "NaN" string
			"Infinity|" + // "Infinity" string

			// A decimal floating-point string representing a finite positive
			// number without a leading sign has at most five basic pieces:
			// Digits . Digits ExponentPart FloatTypeSuffix
			//
			// Since this method allows integer-only strings as input
			// in addition to strings of floating-point literals, the
			// two sub-patterns below are simplifications of the grammar
			// productions from the Java Language Specification, 2nd
			// edition, section 3.10.2.

			// Digits ._opt Digits_opt ExponentPart_opt FloatTypeSuffix_opt
			"(((" + Digits + "(\\.)?(" + Digits + "?)(" + Exp + ")?)|" +

	// . Digits ExponentPart_opt FloatTypeSuffix_opt
			"(\\.(" + Digits + ")(" + Exp + ")?)|" +

			// Hexadecimal strings
			"((" +
			// 0[xX] HexDigits ._opt BinaryExponent FloatTypeSuffix_opt
			"(0[xX]" + HexDigits + "(\\.)?)|" +

			// 0[xX] HexDigits_opt . HexDigits BinaryExponent
			// FloatTypeSuffix_opt
			"(0[xX]" + HexDigits + "?(\\.)" + HexDigits + ")" +

			")[pP][+-]?" + Digits + "))" + "[fFdD]?))" + "[\\x00-\\x20]*");// Optional
																			// trailing
																			// "whitespace"

	public static void menu(Integer index)
	{
		String username = session.get("username");
		if (username != null)
		{
			Account account = Account.find("byUsername", username).first();
			if (index == null)
			{
				render(account);
			}
			else
			{
				render(account, index);
			}
		}
		else
			render();
	}

	public static void clickItem()
	{
		String categoryTitle = params.get("category-title");
		String subcategoryTitle = params.get("subcategory-title");
		String itemTitle = params.get("item-title");
		Double itemPrice = Double.parseDouble(params.get("item-price"));
		render(categoryTitle, subcategoryTitle, itemTitle, itemPrice);
	}

	public static void newItem()
	{
		String categoryTitle = params.get("category-title");
		String subcategoryTitle = params.get("subcategory-title");
		render(categoryTitle, subcategoryTitle);
	}

	public static void addItem()
	{
		String username = session.get("username");
		String FAILURE = "failure";
		if (username != null)
		{
			Account account = Account.find("byUsername", username).first();
			if (account != null)
			{
				String categoryTitle = params.get("category-title");
				String subcategoryTitle = params.get("subcategory-title");
				if (categoryTitle != null && subcategoryTitle != null)
				{
					String itemTitle = params.get("item-title");
					String itemStringPrice = params.get("item-price");
					if (itemTitle != null && itemStringPrice != null
							&& Pattern.matches(fpRegex, itemStringPrice))
					{
						Double itemPrice = Double.parseDouble(itemStringPrice);
						render(categoryTitle, subcategoryTitle, itemTitle,
								itemPrice);
					}
				}
			}
		}
		render(FAILURE);
	}

	public static void checkUniqueItem()
	{
		String categoryTitle = params.get("category-title");
		String subcategoryTitle = params.get("subcategory-title");
		String username = session.get("username");
		String STATUS = "success";
		if (username != null)
		{
			Account account = Account.find("byUsername", username).first();
			Category category = account.findCategory(categoryTitle);

			if (category != null)
			{
				Subcategory subcategory = category
						.findSubcategory(subcategoryTitle);
				if (subcategory != null)
				{
					String itemParam;
					if ((itemParam = params.get("item-title")) != null)
					{
						Item item = subcategory.findItem(itemParam);
						if (item != null)
							STATUS = "invalid";
					}
					else if ((itemParam = params.get("item-price")) != null)
					{
						if (!Pattern.matches(fpRegex, itemParam))
							STATUS = "invalid";
					}
				}
			}
		}

		render(STATUS);
	}

	public static void addCategoryWithValidate(String title)
	{
		String username = session.get("username");
		if (username != null)
		{
			Account account = Account.find("byUsername", username).first();
			if (account != null)
			{
				render(title);
			}
			else
				render();
		}
		else
			render();
	}

	public static void addItemList(String title)
	{
		String username = session.get("username");
		if (username != null)
		{
			Account account = Account.find("byUsername", username).first();
			if (account != null)
			{
				render(title);
			}
		}
	}

	public static void addNewSubcategory(String title)
	{
		String username = session.get("username");
		if (username != null)
		{
			Account account = Account.find("byUsername", username).first();
			if (account != null)
			{
				render(title);
			}
		}
		String failed = "failed";
		render(failed);
	}

	public static void resetDatabase()
	{
		Fixtures.deleteDatabase();
		Fixtures.loadModels("data.yml");
		String okay = "okay";
		render(okay);
	}

	public static void commitCategoryChanges()
	{
		String STATUS = "invalid user";
		String username = session.get("username");
		if (username != null)
		{
			Account account = Account.find("byUsername", username).first();
			if (account != null)
			{
				if (params.get("category-id") != null)
				{
					Category category = Category.find("byId",
							Long.parseLong(params.get("category-id"))).first();
					
					if (params.get("delete") == null)
					{
						category.title = params.get("category-title");
						category.save();
						STATUS = "success";
					}
					else if (params.get("delete").equals("true"))
					{
						account.categories.remove(category);
						category.delete();
						STATUS = "success";
					}
				}
				else
				{
					// This should always be true
					if (account.findCategory(params.get("category-title")) == null)
					{
						account.addCategory(params.get("category-title"));
						STATUS = "success";
					}
				}
			}
		}
		render(STATUS);
	}

	public static void commitSubcategoryChanges()
	{
		String STATUS = "invalid user";
		String username = session.get("username");
		if (username != null)
		{
			Account account = Account.find("byUsername", username).first();
			if (account != null)
			{
				if (params.get("subcategory-id") != null)
				{
					Subcategory subcategory = Subcategory.find("byId",
							Long.parseLong(params.get("subcategory-id")))
							.first();
					if (params.get("delete") == null)
					{
						subcategory.subTitle = params.get("subcategory-title");
						subcategory.save();
						STATUS = "success";
					}
					else if (params.get("delete").equals("true"))
					{
						subcategory.category.subcategories.remove(subcategory);
						subcategory.delete();
						STATUS = "success";
					}
				}
				else
				{
					Category category = account.findCategory(params
							.get("category-title"));
					// This should always be true
					if (category != null)
					{
						// This should always be true
						if (category.findSubcategory(params
								.get("subcategory-title")) == null)
						{
							category.addSubcategory(params
									.get("subcategory-title"));
							STATUS = "success";
						}
					}
				}
			}
		}
		render(STATUS);
	}

	public static void commitItemChanges()
	{
		String STATUS = "invalid user";
		String username = session.get("username");
		if (username != null)
		{
			Account account = Account.find("byUsername", username).first();
			if (account != null)
			{
				if (params.get("item-id") != null)
				{
					Item item = Item.find("byId",
							Long.parseLong(params.get("item-id"))).first();

					if (params.get("delete") == null)
					{
						item.itemTitle = params.get("item-title");
						item.price = Double.parseDouble(params
								.get("item-price"));
						item.save();
						STATUS = "success";
					}
					else if (params.get("delete").equals("true"))
					{
						item.subcategory.items.remove(item);
						item.delete();
						STATUS = "success";
					}
				}
				else
				{
					Category category = account.findCategory(params
							.get("category-title"));
					// This should always be true
					if (category != null)
					{
						Subcategory subcategory = category
								.findSubcategory(params
										.get("subcategory-title"));
						// This should always be true
						if (subcategory != null)
						{
							subcategory
									.addItem(params.get("item-title"), Double
											.parseDouble(params
													.get("item-price")));
							STATUS = "success";
						}
					}
				}
			}
		}
		render(STATUS);
	}

	public static void discardChanges()
	{
		String STATUS;
		String username = session.get("username");
		if (username.length() <= 15 && username.length() >= 3
				&& username.matches("^[a-zA-Z0-9]+$"))
		{
			if (Account.checkUniqueUsername(username))
				STATUS = "success";
			else
				STATUS = "nonunique";
		}
		else
			STATUS = "invalid";
		render(STATUS);
	}
}
