package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;
import models.menu.Category;

public class Application extends Controller
{

	public static void index()
	{
		Account account = Account.find("email", "java@gmail.com").first();
		render(account);
	}

}
