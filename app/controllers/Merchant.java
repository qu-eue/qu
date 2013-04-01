package controllers;

import models.Account;
import play.mvc.Controller;

public class Merchant extends Controller
{
	public static void merchant()
	{
		String username = session.get("username");
		if (username != null)
		{
			Account account = Account.find("byUsername", username).first();
			render(account);
		}
		else
			render();
	}
	
	public static void dashboard()
	{
		String username = session.get("username");
		if (username != null)
		{
			Account account = Account.find("byUsername", username).first();
			render(account);
		}
		else
			render();
	}
}
