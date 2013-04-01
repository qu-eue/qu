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
public class Subcategory extends Model
{
	public String subTitle;

	@ManyToOne
	@Required
	public Category category;

	@ManyToOne
	@Required
	public Account account;

	@OneToMany(mappedBy = "subcategory", cascade = CascadeType.ALL)
	public List<Item> items;

	public Subcategory(Category category, String subTitle)
	{
		this.category = category;
		this.subTitle = subTitle;
		this.account = category.account;
		this.items = new ArrayList<Item>();
	}

	public Subcategory addItem(String itemTitle, Double price)
	{
		Item item = new Item(this, itemTitle, price).save();
		this.items.add(item);
		this.save();
		return this;
	}

	public Item findItem(String itemTitle)
	{
		for (Item item : items)
		{
			if (item.itemTitle.equals(itemTitle))
			{
				return item;
			}
		}

		return null;
	}
}
