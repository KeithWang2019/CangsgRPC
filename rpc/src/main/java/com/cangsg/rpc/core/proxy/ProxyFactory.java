package com.cangsg.rpc.core.proxy;

import java.lang.reflect.Proxy;

import com.cangsg.rpc.core.client.IRPCStrategy;
import com.cangsg.rpc.core.client.RPCClient;

public class ProxyFactory {

	private ProxyFactory() {
		throw new IllegalStateException("ProxyFactory class");
	}

	@SuppressWarnings("unchecked")
	public static <T> T create(Class<T> interfaceClass, RPCClient client) {
		return (T) Proxy.newProxyInstance(interfaceClass.getClassLoader(), new Class<?>[] { interfaceClass },
				new RemoteObject<T>(interfaceClass, client));
	}

	@SuppressWarnings("unchecked")
	public static <T> T create(Class<T> interfaceClass, IRPCStrategy iRpcStrategy) {
		return (T) Proxy.newProxyInstance(interfaceClass.getClassLoader(), new Class<?>[] { interfaceClass },
				new RemoteObject<T>(interfaceClass, iRpcStrategy));
	}
}