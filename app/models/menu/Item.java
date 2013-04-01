package models.menu;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import models.Account;

import play.db.jpa.Model;

@Entity
public class Item extends Model
{
	public String itemTitle;
	public Double price;

	@ManyToOne
	public Subcategory subcategory;
	
	@ManyToOne
	public Account account;

	public Item(Subcategory subcategory, String itemTitle, Double price)
	{
		this.subcategory = subcategory;
		this.itemTitle = itemTitle;
		this.price = price;
		this.account = subcategory.account;
	}
}


// Add validation methods for each field!!!!