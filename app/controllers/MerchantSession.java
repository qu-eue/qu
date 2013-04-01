package controllers;

import play.db.jpa.JPA;
import play.mvc.Controller;
import models.Account;

public class MerchantSession extends Controller
{
	public static void login(String username, String rawPassword)
	{
		Account account = Account.connect(username, rawPassword);
		String STATUS;
		if (account != null)
		{
			session.put("username", account.username);
			STATUS = "success";
		}
		else
			STATUS = "invalid";
		render(STATUS);
	}

	public static void logout()
	{
		String STATUS;
		session.clear();
		STATUS = "success";
		render(STATUS);
	}
}
