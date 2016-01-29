package com.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Formatter;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
 
 

public class HttpUtils {
	
	
	public static String post(String url, List<NameValuePair> params){
			CloseableHttpClient client = HttpClients.createDefault();
			try {
				HttpPost post = new HttpPost(url);
		        UrlEncodedFormEntity uefEntity = new UrlEncodedFormEntity(params, "UTF-8");  
		        post.setEntity(uefEntity);
		        CloseableHttpResponse response = client.execute(post);
				try {
					HttpEntity entity = response.getEntity();
					return EntityUtils.toString(entity, "utf-8");
				} catch (Exception e) {
					e.printStackTrace();
				}finally{
					response.close();
				}
		       
			} catch (IOException e) {
				e.printStackTrace();
			}finally{
				try {
					client.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			return null;
	}
	
	public static String get(String url){
		CloseableHttpClient client = HttpClients.createDefault();
		try {
			HttpGet get = new HttpGet(url);
			CloseableHttpResponse response = client.execute(get);
			try {
				HttpEntity entity = response.getEntity();
				return EntityUtils.toString(entity, "utf-8");
			} catch (Exception e) {
				e.printStackTrace();
			}finally{
				response.close();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			try {
				client.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return null;
	}
	
	public static String post(String url, String data){
		CloseableHttpClient client = HttpClients.createDefault();
		try {
			HttpPost post = new HttpPost(url);
	        HttpEntity uefEntity = new StringEntity(data, "UTF-8");
	        post.setEntity(uefEntity);
	        CloseableHttpResponse response = client.execute(post);
			try {
				HttpEntity entity = response.getEntity();
				return EntityUtils.toString(entity, "utf-8");
			} catch (Exception e) {
				e.printStackTrace();
			}finally{
				response.close();
			}
	       
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			try {
				client.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return null;
	}
	public static String bytetoString(byte[] hash) {
		Formatter formatter = new Formatter();

		for (byte b : hash) {
			formatter.format("%02x", b);
		}
		String result = formatter.toString();
		formatter.close();
		return result;
	}

	public static void main(String[] args) throws Exception {
		
		File widgetFloder = new File("C:\\workspace_github\\ak-base-touch\\ak-base-touch\\WebRoot\\assets\\js\\widget");
		File[] jsFiles = widgetFloder.listFiles();
		for (File jsFile : jsFiles) {
			
			  String fileName = jsFile.getName();
			  System.out.println(fileName);
			
			  BufferedReader bf = new BufferedReader(new FileReader(jsFile));
			  
			  String content = "";
			  StringBuilder sb = new StringBuilder();
			  
			  while(content != null){
				  
				   content = bf.readLine();
				   
				   if(content == null){
					   break;
				   }
			   
				   sb.append(content).append("\n");
			  }
			  
			  bf.close();
			  
			  String scriptContext = sb.toString();
			 // System.out.println(scriptContext);
			  List<NameValuePair> params = new ArrayList<NameValuePair>();
			  NameValuePair input = new BasicNameValuePair("input", scriptContext);
			  params.add(input);
			  String script = HttpUtils.post("http://javascript-minifier.com/raw", params);
			  System.out.println(script);
			  
			  String minJsName = fileName;
			  
			  writeJSFile("C:\\workspace_github\\ak-base-touch\\ak-base-touch\\WebRoot\\assets\\js\\widget-min\\", minJsName, script);
		}
		
	}
	
	
	public static void writeJSFile(String path, String fileName, String script) throws IOException{
		
		File minFloder = new File(path);
		if(!minFloder.exists()){
			minFloder.mkdir();
		}
		
		File minJs = new File(path+fileName);
		
		if(minJs.exists()){
			minJs.delete();
			minJs.createNewFile();
		}else{
			minJs.createNewFile();
		}
		
		Writer out = new FileWriter(minJs,true); 
	    out.write(script); 
	    out.close();
	}

}
