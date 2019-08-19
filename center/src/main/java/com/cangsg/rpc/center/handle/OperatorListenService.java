package com.cangsg.rpc.center.handle;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import com.cangsg.rpc.core.client.RPCClient;
import com.cangsg.rpc.core.proto.Address;
import com.cangsg.rpc.core.proto.Book;
import com.cangsg.rpc.core.proto.Node;
import com.cangsg.rpc.core.proto.NodeState;
import com.cangsg.rpc.core.proto.NodeType;
import com.cangsg.rpc.core.proxy.ProxyFactory;
import com.cangsg.rpc.core.service.IConsumerListenService;
import com.cangsg.rpc.core.service.IOperatorListenService;

public class OperatorListenService implements IOperatorListenService {
	long bookVersion = 0;
	final Thread timerThread;
	final List<Node> nodes = new ArrayList<>();
	final Queue<Node> nodeRequestQueue = new ConcurrentLinkedQueue<>();

	public OperatorListenService() {
		timerThread = new Thread(() -> {
			while (true) {
				Book book = this.order();
				this.dispatch(book);
				try {
					Thread.sleep(5000);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
		});
		timerThread.setDaemon(true);
	}

	public void start() {
		timerThread.start();
	}

	private Book order() {
		int nodeRequestSize = nodeRequestQueue.size();
		for (int i = 0; i < nodeRequestSize; i++) {
			Node node = nodeRequestQueue.poll();
			nodes.remove(node);

			if (node.getNodeState() == NodeState.ADD) {
				nodes.add(node);
			}
		}

		Book book = new Book();
		book.setVersion(bookVersion);
		Map<String, List<Address>> addressesMap = book.getAddressesMap();
		for (int i = 0; i < nodes.size(); i++) {
			Node node = nodes.get(i);
			for (String interfaceName : node.getInterfaceNames()) {
				List<Address> addressList;
				if (!addressesMap.containsKey(interfaceName)) {
					addressList = new ArrayList<>();
					addressesMap.put(interfaceName, addressList);
				} else {
					addressList = addressesMap.get(interfaceName);
				}
				addressList.add(node.getAddress());
			}
		}
		book.setAddressesMap(addressesMap);
		return book;
	}

	private void dispatch(Book book) {
		for (Node node : nodes) {
			if (!node.getAddress().isDisable()) {
				try {
					try (RPCClient client = new RPCClient()) {
						System.out.print("注册服务器:连接" + node.getAddress());
						client.connect(node.getAddress());
						System.out.println("连接成功");
						IConsumerListenService producerListenService = ProxyFactory.create(IConsumerListenService.class,
								client);
						System.out.println("注册服务器:询问" + node.getAddress());
						List<String> remoteServiceList = producerListenService.ask();
						System.out.println(remoteServiceList);
						Book subBook = obtain(book, remoteServiceList);
						System.out.println("注册服务器:分发" + node.getAddress());
						producerListenService.receive(subBook);
					}
				} catch (Throwable throwable) {
					node.getAddress().setDisable(true);
					System.out.println("连接失败");
					throwable.printStackTrace();
				}
			}
		}
	}

	@Override
	public void register(Node node) {
		Node currentNode = new Node();
		currentNode.setInterfaceNames(node.getInterfaceNames());
		currentNode.setAddress(node.getAddress());
		currentNode.setNodeState(NodeState.ADD);

		nodeRequestQueue.add(currentNode);
	}

	private Book obtain(Book book, List<String> remoteServiceList) {
		Book subBook = new Book();
		if (remoteServiceList != null) {
			for (String interfaceName : remoteServiceList) {
				List<Address> addressList = book.getAddressesMap().get(interfaceName);
				subBook.getAddressesMap().put(interfaceName, addressList);
			}
		}
		subBook.setVersion(book.getVersion());
		return subBook;
	}

	@Override
	public void unRegister(Node node) {
		Node currentNode = new Node();
		currentNode.setAddress(node.getAddress());
		currentNode.setNodeState(NodeState.DELETE);

		nodeRequestQueue.add(currentNode);
	}
}
