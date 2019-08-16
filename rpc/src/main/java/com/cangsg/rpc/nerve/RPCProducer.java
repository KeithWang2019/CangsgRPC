package com.cangsg.rpc.nerve;

import com.cangsg.rpc.Constants;

public class RPCProducer extends RPCBase {

	public RPCProducer(String host, int port) {
		super(host, port, Constants.IO_THREADS);
	}

	public <T> void addService(Class<T> interfaceClass, T serviceInstance) {
		addLocalService(interfaceClass);
		server.addService(interfaceClass, serviceInstance);
	}

}
