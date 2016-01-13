package com.web;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Paths;

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
	
	@RequestMapping(value="/SideframeView.html",  method = RequestMethod.GET)
	public String SideframeView(HttpServletResponse response, HttpServletRequest request) throws IOException {
		setDataCtx(request);
		return "forward:/component/SideframeView.jsp";
	}
	
	@RequestMapping(value="/ZoneSelector.html",  method = RequestMethod.GET)
	public String ZoneSelector(HttpServletResponse response, HttpServletRequest request) throws IOException {
		setDataCtx(request);
		return "forward:/component/ZoneSelector.jsp";
	}
	
	@RequestMapping(value="/HeaderNavigate.html",  method = RequestMethod.GET)
	public String HeaderNavigate(HttpServletResponse response, HttpServletRequest request) throws IOException {
		setDataCtx(request);
		return "forward:/component/HeaderNavigate.jsp";
	}
	
	@RequestMapping(value="/ContextView.html",  method = RequestMethod.GET)
	public String ContextView(HttpServletResponse response, HttpServletRequest request) throws IOException {
		setDataCtx(request);
		return "forward:/component/ContextView.jsp";
	}
	
	@RequestMapping(value="/SideSelectView.html",  method = RequestMethod.GET)
	public String SideSelectView(HttpServletResponse response, HttpServletRequest request) throws IOException {
		setDataCtx(request);
		return "forward:/component/SideSelectView.jsp";
	}
	
	@RequestMapping(value="/Toolbar.html",  method = RequestMethod.GET)
	public String Toolbar(HttpServletResponse response, HttpServletRequest request) throws IOException {
		setDataCtx(request);
		return "forward:/component/Toolbar.jsp";
	}
	
	
	
	public static void main(String[] args) throws Exception{
		final URL url = new URL("https://javascript-minifier.com/raw");

		// JS File you want to compress
		byte[] bytes = Files.readAllBytes(Paths.get("C:/workspace_github/ak-base-touch/ak-base-touch/WebRoot/assets/js/widget/action-bar.js"));

		final StringBuilder data = new StringBuilder();
		data.append(URLEncoder.encode("input", "UTF-8"));
		data.append('=');
		data.append(URLEncoder.encode(new String(bytes), "UTF-8"));

		bytes = data.toString().getBytes("UTF-8");

		final HttpURLConnection conn = (HttpURLConnection) url.openConnection();

		conn.setRequestMethod("POST");
		conn.setDoOutput(true);
		conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
		conn.setRequestProperty("charset", "utf-8");
		conn.setRequestProperty("Content-Length", Integer.toString(bytes.length));

		try (DataOutputStream wr = new DataOutputStream(conn.getOutputStream())) {
		    wr.write(bytes);
		}

		final int code = conn.getResponseCode();

		System.out.println("Status: " + code);

		if (code == 200) {
		    System.out.println("----");
		    final BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
		    String inputLine;

		    while ((inputLine = in.readLine()) != null) {
		        System.out.print(inputLine);
		    }
		    in.close();

		    System.out.println("\n----");
		} else {
		    System.out.println("Oops");
		}
	}
}
