package com.cangsg.rpc.nerve;

import com.cangsg.rpc.Constants;
import com.cangsg.rpc.core.proto.NodeType;

public class RPCProducer extends RPCBase {

	public RPCProducer(String host, int port) {
		super(host, port, Constants.IO_THREADS, NodeType.Server);
	}

	public <T> void addService(Class<T> interfaceClass, T serviceInstance) {
		addLocalService(interfaceClass);
		server.addService(interfaceClass, serviceInstance);
	}

}
