package controllers;

import models.Account;
import play.mvc.Controller;

public class AccountValidation extends Controller
{

	public static void validateUniqueUsername(String username)
	{
		String STATUS;
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

	public static void validateUniqueEmail(String email)
	{
		String STATUS;
		if (email
				.matches("^[_a-z0-9-]+(\\.[_a-z0-9-]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,4})+$"))
		{
			if (Account.checkUniqueEmail(email))
				STATUS = "success";
			else
				STATUS = "nonunique";
		}
		else
			STATUS = "invalid";
		render(STATUS);
	}
}
