package com.cangsg.rpc.center.web.config;

import java.net.MalformedURLException;
import java.net.URL;

import org.apache.catalina.Container;
import org.apache.catalina.Context;
import org.apache.catalina.Lifecycle;
import org.apache.catalina.LifecycleEvent;
import org.apache.catalina.LifecycleListener;
import org.apache.catalina.WebResourceRoot;
import org.apache.catalina.WebResourceRoot.ResourceSetType;
import org.apache.catalina.webresources.StandardRoot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebXmlListener implements LifecycleListener {
	static final Logger logger = LoggerFactory.getLogger(WebXmlListener.class);

	@Override
	public void lifecycleEvent(LifecycleEvent event) {
		Context context;

		switch (event.getType()) {
		case Lifecycle.BEFORE_START_EVENT:
			context = (Context) event.getLifecycle();
			context.removeChild(context.findChild("default"));
			context.removeChild(context.findChild("jsp"));

			WebResourceRoot resources = context.getResources();
			if (resources == null) {
				resources = new StandardRoot(context);
				context.setResources(resources);
			}
			URL resource = context.getParentClassLoader().getResource("WEB-INF/web.xml");
			if (resource != null) {
				String webXmlUrlString = resource.toString();
				URL root;
				try {
					root = new URL(webXmlUrlString.substring(0, webXmlUrlString.length() - "WEB-INF/web.xml".length()));
					resources.createWebResourceSet(ResourceSetType.RESOURCE_JAR, "/WEB-INF", root, "/WEB-INF");
				} catch (MalformedURLException e) {
					// ignore
				}
			}
			break;
		case Lifecycle.CONFIGURE_START_EVENT:
			context = (Context) event.getLifecycle();
			for (Container container : context.findChildren()) {
				logger.info(container.getName());
			}
			break;
		}
	}

}
