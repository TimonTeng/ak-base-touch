package com.web;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;



@Controller
public class WidgetController extends WebController {
	
	
	@RequestMapping(value="/index.html",  method = RequestMethod.GET)
	public String index(HttpServletResponse response, HttpServletRequest request) throws IOException {
		setDataCtx(request);
		return "forward:/component/index.jsp";
	}
	
	@RequestMapping(value="/ActionBar.html",  method = RequestMethod.GET)
	public String ActionBar(HttpServletResponse response, HttpServletRequest request) throws IOException {
		setDataCtx(request);
		return "forward:/component/ActionBar.jsp";
	}
	
	@RequestMapping(value="/ActionBar-Demo1.html",  method = RequestMethod.GET)
	public String ActionBarDemo1(HttpServletResponse response, HttpServletRequest request) throws IOException {
		setDataCtx(request);
		return "forward:/component/ActionBar-Demo1.jsp";
	}
	
	@RequestMapping(value="/ActionBar-DoubleSelectView.html",  method = RequestMethod.GET)
	public String ActionBarDoubleSelectView(HttpServletResponse response, HttpServletRequest request) throws IOException {
		setDataCtx(request);
		return "forward:/component/ActionBar-DoubleSelectView.jsp";
	}
	
	@RequestMapping(value="/ListView.html",  method = RequestMethod.GET)
	public String ListView(HttpServletResponse response, HttpServletRequest request) throws IOException {
		setDataCtx(request);
		return "forward:/component/ListView.jsp";
	}
	
	@RequestMapping(value="/PivotAndWaterfall.html",  method = RequestMethod.GET)
	public String PivotAndWaterfall(HttpServletResponse response, HttpServletRequest request) throws IOException {
		setDataCtx(request);
		return "forward:/component/PivotAndWaterfall.jsp";
	}
	
	@RequestMapping(value="/PivotListView.html",  method = RequestMethod.GET)
	public String PivotListView(HttpServletResponse response, HttpServletRequest request) throws IOException {
		setDataCtx(request);
		return "forward:/component/PivotListView.jsp";
	}
	
	@RequestMapping(value="/Sidebar.html",  method = RequestMethod.GET)
	public String Sidebar(HttpServletResponse response, HttpServletRequest request) throws IOException {
		setDataCtx(request);
		return "forward:/component/Sidebar.jsp";
	}

}
