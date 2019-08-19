package com.cangsg.rpc.nerve;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.cangsg.rpc.core.RPCException;
import com.cangsg.rpc.core.RPCUtil;
import com.cangsg.rpc.core.client.IRPCStrategy;
import com.cangsg.rpc.core.client.RPCClient;
import com.cangsg.rpc.core.client.RPCStrategyType;
import com.cangsg.rpc.core.client.impl.RPCRandomStrategy;
import com.cangsg.rpc.core.proto.Address;
import com.cangsg.rpc.core.proto.Book;
import com.cangsg.rpc.core.proto.Node;
import com.cangsg.rpc.core.proto.NodeType;
import com.cangsg.rpc.core.proxy.ProxyFactory;
import com.cangsg.rpc.core.server.RPCServer;
import com.cangsg.rpc.core.service.IConsumerListenService;
import com.cangsg.rpc.core.service.IOperatorListenService;
import com.cangsg.rpc.nerve.service.ConsumerListenService;

public abstract class RPCBase implements AutoCloseable {
	private static final Logger logger = LoggerFactory.getLogger(RPCBase.class);

	final RPCServer server;
	final IConsumerListenService consumerListenService;
	final Address localAddress;
	final NodeType nodeType;
	Address centerAddress;
	CompletableFuture<Boolean> completableFuture;

	public RPCBase(String host, int port, int nThreads, NodeType nodeType) {
		this.server = new RPCServer(host, port, nThreads);
		this.consumerListenService = new ConsumerListenService(this::receive, this::ask);
		addLocalService(IConsumerListenService.class);
		this.server.addService(IConsumerListenService.class, consumerListenService);
		this.localAddress = new Address(host, port);
		this.nodeType = nodeType;
	}

	private void receive(Book subBook) {
		RPCUtil.setOwnBook(subBook);
		if (completableFuture != null && !completableFuture.isDone()) {
			completableFuture.complete(true);
		}
	}

	private List<String> ask() {
		return remoteServiceList;
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
			Node node = new Node();
			node.setAddress(this.localAddress);
			node.setNodeType(this.nodeType);
			node.setInterfaceNames(localServiceList);
			operatorListenService.register(node);
		}
		try {
			completableFuture.get(300 * 1000, TimeUnit.MILLISECONDS);
		} catch (Throwable e) {
			logger.error(e.getMessage(), e);
			throw new RPCException(e);
		}
	}

	private void unRegister() {
		completableFuture = new CompletableFuture<>();
		try (RPCClient client = new RPCClient()) {
			try {
				client.connect(centerAddress);
				IOperatorListenService operatorListenService = ProxyFactory.create(IOperatorListenService.class,
						client);
				Node node = new Node();
				node.setAddress(this.localAddress);
				node.setNodeType(this.nodeType);
				node.setInterfaceNames(localServiceList);
				operatorListenService.unRegister(node);
				completableFuture.get(300 * 1000, TimeUnit.MILLISECONDS);
			} catch (InterruptedException | ExecutionException | TimeoutException | RPCException e) {
				logger.error(e.getMessage(), e);
			}
		}
	}

	public void register(Address centerAddress) throws RPCException {
		this.centerAddress = centerAddress;
		server.start();
		register();
	}

	public List<String> localServiceList = new ArrayList<>();

	protected <T> void addLocalService(Class<T> interfaceClass) {
		String interfaceName = interfaceClass.getName();
		if (!localServiceList.contains(interfaceName)) {
			localServiceList.add(interfaceName);
		}
	}

	public List<String> remoteServiceList = new ArrayList<>();

	private <T> void addRemoteService(Class<T> interfaceClass) {
		String interfaceName = interfaceClass.getName();
		if (!remoteServiceList.contains(interfaceName)) {
			remoteServiceList.add(interfaceName);
		}
	}

	public <T> void useService(Class<T> interfaceClass) {
		addRemoteService(interfaceClass);
	}

	public void hang() throws RPCException {
		server.hang();
	}

	public void close() {
		unRegister();
		server.close();
	}
}
