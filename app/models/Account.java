package models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;

import models.menu.Category;
import models.menu.Item;
import models.menu.Subcategory;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class Account extends Model
{
	@Required
	public String username;

	@Required
	public String email;

	@Required
	public String password;

	@OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
	public List<Category> categories;

	public Account(String username, String email, String password)
	{
		this.username = username;
		this.email = email;
		this.password = password;
		this.categories = new ArrayList<Category>();
	}

	public Category addCategory(String title)
	{
		Category category = new Category(this, title).save();
		this.categories.add(category);
		this.save();
		return category;
	}

	public static Category findCategory(Long accountId, String title)
	{
		Account account = Account.findById(accountId);
		for (Category category : account.categories)
		{
			if (category.title.equals(title))
			{
				return category;
			}
		}

		return null;
	}
	
	public Category findCategory(String title)
	{
		for (Category category : categories)
		{
			if (category.title.equals(title))
			{
				return category;
			}
		}

		return null;
	}

	// Write more tests for these added methods

	public static boolean checkUniqueUsername(String username)
	{
		
		return (find("byUsername", username.toLowerCase()).first() == null);
	}

	public static boolean checkUniqueEmail(String email)
	{
		return (find("byEmail", email.toLowerCase()).first() == null);
	}

	public static Account emailConnect(String email, String password)
	{
		return find("byEmailAndPassword", email.toLowerCase(), password).first();
	}

	public static Account connect(String username, String password)
	{
		return find("byUsernameAndPassword", username.toLowerCase(), password).first();
	}
}
