package com.cangsg.rpc.center;

import java.io.IOException;

import org.apache.catalina.LifecycleException;

import com.cangsg.rpc.center.handle.OperatorListenService;
import com.cangsg.rpc.center.web.WebLaunch;
import com.cangsg.rpc.core.RPCException;
import com.cangsg.rpc.core.server.RPCServer;
import com.cangsg.rpc.core.service.IOperatorListenService;

public class AppCenter {

	public static void main(String[] args) throws RPCException, IOException, LifecycleException {
		try (RPCServer server = new RPCServer("0.0.0.0", 8898)) {
			OperatorListenService operatorListenService = new OperatorListenService();
			server.addService(IOperatorListenService.class, operatorListenService);

			WebLaunch.start();
			server.start();
			operatorListenService.start();
			server.hang();
		}
	}

}
