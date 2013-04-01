package models.menu;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import models.Account;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class Category extends Model
{
	@Required
	public String title;

	@ManyToOne
	@Required
	public Account account;

	@OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
	public List<Subcategory> subcategories;

	public Category(Account account, String title)
	{
		this.account = account;
		this.title = title;
		this.subcategories = new ArrayList<Subcategory>();
	}

	public Category addSubcategory(String subTitle)
	{
		Subcategory subcategory = new Subcategory(this, subTitle).save();
		this.subcategories.add(subcategory);
		this.save();
		return this;
	}

	public Subcategory findSubcategory(String subcategoryTitle)
	{
		for (Subcategory subcategory : subcategories)
		{
			if (subcategory.subTitle.equals(subcategoryTitle))
			{
				return subcategory;
			}
		}

		return null;
	}
}
