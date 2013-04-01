package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;
import models.menu.Category;

public class Splash extends Controller
{
	public static void splash()
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
