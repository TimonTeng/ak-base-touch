package com.web;

import javax.servlet.http.HttpServletRequest;

public class WebController {
	
	public static String ctx;
	
	public static final String dataCtx = "http://192.168.1.18";
	
	public void setDataCtx(HttpServletRequest request){
		request.setAttribute("dataCtx", dataCtx);
	}

}
