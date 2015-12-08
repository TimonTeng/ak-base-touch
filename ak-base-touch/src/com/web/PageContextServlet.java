package com.web;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

public class PageContextServlet extends HttpServlet {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -6180631618582029453L;

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		WebController.ctx = config.getServletContext().getContextPath();
		System.out.println(WebController.ctx);
	}

}
