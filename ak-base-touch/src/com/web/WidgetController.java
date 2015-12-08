package com.web;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;



@Controller
public class WidgetController extends WebController {
	
	
	@RequestMapping(value="/ActionBar.html",  method = RequestMethod.GET)
	public String checkWeixinToken(HttpServletResponse response, HttpServletRequest request) throws IOException {
		return "forward:/component/ActionBar.jsp";
	}

}
