package com.cangsg.rpc.center.handle;

import java.util.ArrayList;
import java.util.List;

import com.cangsg.rpc.core.client.RPCClient;
import com.cangsg.rpc.core.proto.Address;
import com.cangsg.rpc.core.proto.Book;
import com.cangsg.rpc.core.proto.Node;
import com.cangsg.rpc.core.proxy.ProxyFactory;
import com.cangsg.rpc.core.service.IConsumerListenService;
import com.cangsg.rpc.core.service.IOperatorListenService;

public class OperatorListenService implements IOperatorListenService {
	final Book book = new Book();
	final List<Address> serverList = new ArrayList<>();
	final Thread timerThread;

	public OperatorListenService() {
		timerThread = new Thread(() -> {
			while (true) {
				this.dispatch();
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

	private void dispatch() {
		for (Address address : serverList) {
			if (!address.isDisable()) {
				try {
					try (RPCClient client = new RPCClient()) {
						System.out.print("注册服务器:连接" + address);
						client.connect(address);
						System.out.println("连接成功");
						IConsumerListenService producerListenService = ProxyFactory.create(IConsumerListenService.class,
								client);
						System.out.println("注册服务器:询问" + address);
						List<String> remoteServiceList = producerListenService.ask();
						System.out.println(remoteServiceList);
						Book subBook = obtain(remoteServiceList);
						System.out.println("注册服务器:分发" + address);
						producerListenService.receive(subBook);
					}
				} catch (Throwable throwable) {
					address.setDisable(true);
					System.out.println("连接失败");
					throwable.printStackTrace();
				}
			}
		}
	}

	@Override
	public void register(List<String> interfaceNames, Address localAddress) {
		synchronized (this) {
			for (String entry : interfaceNames) {
				boolean needUpgrade = false;
				Node currentNode = null;
				if (book.getNodeMap().containsKey(entry)) {
					currentNode = book.getNodeMap().get(entry);
				} else {
					currentNode = new Node();
					book.getNodeMap().put(entry, currentNode);
					needUpgrade = true;
				}

				List<Address> addresses = currentNode.getAddressList();

				if (!addresses.contains(localAddress)) {
					addresses.add(localAddress);
					if (!serverList.contains(localAddress)) {
						serverList.add(localAddress);
					}
					needUpgrade = true;
				}

				for (int i = 0; i < addresses.size(); i++) {
					Address address = addresses.get(i);
					if (address.equals(localAddress)) {
						address.setDisable(false);
					}
				}

				if (needUpgrade) {
					book.setVersion(System.currentTimeMillis());
				}
			}
		}
		System.out.println("注册的IP列表:" + serverList);
	}

	@Override
	public Book obtain(List<String> remoteServiceList) {
		Book subBook = new Book();
		if (remoteServiceList != null) {
			for (String interfaceName : remoteServiceList) {
				Node node = book.getNodeMap().get(interfaceName);
				subBook.getNodeMap().put(interfaceName, node);
			}
		}
		subBook.setVersion(book.getVersion());
		return subBook;
	}
}
