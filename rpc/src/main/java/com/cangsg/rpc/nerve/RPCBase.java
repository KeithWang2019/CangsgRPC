package com.cangsg.rpc.nerve;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import com.cangsg.rpc.core.RPCException;
import com.cangsg.rpc.core.RPCUtil;
import com.cangsg.rpc.core.client.IRPCStrategy;
import com.cangsg.rpc.core.client.RPCClient;
import com.cangsg.rpc.core.client.RPCStrategyType;
import com.cangsg.rpc.core.client.impl.RPCRandomStrategy;
import com.cangsg.rpc.core.proto.Address;
import com.cangsg.rpc.core.proto.Book;
import com.cangsg.rpc.core.proxy.ProxyFactory;
import com.cangsg.rpc.core.server.RPCServer;
import com.cangsg.rpc.core.service.IConsumerListenService;
import com.cangsg.rpc.core.service.IOperatorListenService;
import com.cangsg.rpc.nerve.service.ConsumerListenService;

public abstract class RPCBase implements AutoCloseable {
	final RPCServer server;
	final IConsumerListenService consumerListenService;
	final Address localAddress;
	Address centerAddress;
	CompletableFuture<Boolean> completableFuture;

	public RPCBase(String host, int port, int nThreads) {
		localAddress = new Address(host, port);
		server = new RPCServer(host, port, nThreads);
		consumerListenService = new ConsumerListenService(this::receive, this::ask);
		addLocalService(IConsumerListenService.class);
		server.addService(IConsumerListenService.class, consumerListenService);
	}

	private void receive(Book subBook) {
		RPCUtil.setOwnBook(subBook);
		if (completableFuture != null && !completableFuture.isDone()) {
			completableFuture.complete(true);
		}
	}

	private List<String> ask() {
		return remoteServiceMap;
	}

	public <T> T proxyObject(Class<T> interfaceClass, RPCStrategyType rpcStrategyType) {
		IRPCStrategy iRpcStrategy = null;
		switch (rpcStrategyType) {
		case RANDOM:
			iRpcStrategy = new RPCRandomStrategy();
			break;
		default:
			break;
		}
		return ProxyFactory.create(interfaceClass, iRpcStrategy);
	}

	private void register() throws RPCException {
		completableFuture = new CompletableFuture<>();
		try (RPCClient client = new RPCClient()) {
			client.connect(centerAddress);
			IOperatorListenService operatorListenService = ProxyFactory.create(IOperatorListenService.class, client);
			operatorListenService.register(localServiceMap, localAddress);
		}
		try {
			completableFuture.get(300 * 1000, TimeUnit.MILLISECONDS);
		} catch (Throwable e) {
			e.printStackTrace();
			throw new RPCException(e);
		}
	}

	public void register(Address centerAddress) throws RPCException {
		this.centerAddress = centerAddress;
		server.start();
		register();
	}

	public List<String> localServiceMap = new ArrayList<>();

	protected <T> void addLocalService(Class<T> interfaceClass) {
		String interfaceName = interfaceClass.getName();
		if (!localServiceMap.contains(interfaceName)) {
			localServiceMap.add(interfaceName);
		}
	}

	public List<String> remoteServiceMap = new ArrayList<>();

	private <T> void addRemoteService(Class<T> interfaceClass) {
		String interfaceName = interfaceClass.getName();
		if (!remoteServiceMap.contains(interfaceName)) {
			remoteServiceMap.add(interfaceName);
		}
	}

	public <T> void useService(Class<T> interfaceClass) {
		addRemoteService(interfaceClass);
	}

	public void hang() throws RPCException {
		server.hang();
	}

	public void close() {
		server.close();
	}
}
