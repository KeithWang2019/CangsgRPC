package com.cangsg.rpc.center.web;

import java.io.File;
import java.io.IOException;
import java.util.Properties;

import org.apache.catalina.Context;
import org.apache.catalina.Host;
import org.apache.catalina.LifecycleException;
import org.apache.catalina.startup.Tomcat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.cangsg.rpc.center.web.config.WebXmlListener;

public class WebLaunch {
	static final Logger logger = LoggerFactory.getLogger(WebLaunch.class);

	public static File createTempDir(String prefix, int port) throws IOException {
		File tempDir = File.createTempFile(prefix + ".", "." + port);
		tempDir.delete();
		tempDir.mkdir();
		tempDir.deleteOnExit();
		return tempDir;
	}

	public static void start() throws IOException, LifecycleException {
		ClassLoader classLoader = WebLaunch.class.getClassLoader();

		Properties pps = new Properties();
		pps.load(classLoader.getResourceAsStream("init.properties"));

		int port = Integer.parseInt(pps.getProperty("server.port"));

		String hostName = "localhost";
		logger.info("端口:" + port);

		String tomcatBaseDir = createTempDir("tomcat", port).getAbsolutePath();
		String contextDocBase = createTempDir("tomcat-docBase", port).getAbsolutePath();
	
		logger.info("BaseDir:" + tomcatBaseDir);
		logger.info("DocBase:" + contextDocBase);

		Tomcat tomcat = new Tomcat();

		tomcat.setBaseDir(tomcatBaseDir);
		tomcat.setPort(port);
		tomcat.setHostname(hostName);
		tomcat.getHost().setAutoDeploy(false);

		Host host = tomcat.getHost();
		Context context = tomcat.addWebapp(host, "", contextDocBase);

		context.setParentClassLoader(classLoader);
		context.addLifecycleListener(new WebXmlListener());

		tomcat.start();
	}
}
