package com.cangsg.rpc.core.client;

import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

import com.cangsg.rpc.Constants;
import com.cangsg.rpc.core.proto.Address;

public class RPCClientPool {
	static ConcurrentHashMap<String, Queue<RPCClient>> map = new ConcurrentHashMap<>();

	private RPCClientPool() {
		throw new IllegalStateException("RpcClientPool class");
	}

	public static RPCClient poll(String interfaceClassName, IRPCStrategy iRpcStrategy) {
		Address address = iRpcStrategy.fix(interfaceClassName);

		String key = address.toString();
		Queue<RPCClient> queue = map.get(key);
		RPCClient client = null;
		if (queue == null) {
			map.put(key, new ConcurrentLinkedQueue<RPCClient>());
		} else {
			client = queue.poll();
		}

		if (client == null) {
			client = new RPCClient();
		}
		if (!client.isActive()) {
			try {
				client.close();
				client.connect(address);
			} catch (Throwable e) {
				e.printStackTrace();
			}
		}
		return client;
	}

	public static void free(RPCClient client) {
		String key = client.getAddress().toString();
		Queue<RPCClient> queue = map.get(key);
		if (queue != null) {
			if (queue.size() > Constants.CONNECT_COUNT) {
				RPCClient oldClient = queue.poll();
				try {
					oldClient.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			queue.add(client);
		}
	}
}
