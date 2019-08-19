package com.cangsg.rpc;

import com.cangsg.rpc.core.client.RPCClient;
import com.cangsg.rpc.core.proto.Address;
import com.cangsg.rpc.core.proxy.ProxyFactory;
import com.cangsg.rpc.core.server.RPCServer;
import com.cangsg.rpc.test.ITestService;
import com.cangsg.rpc.test.impl.TestService;
import com.cangsg.rpc.test.pojo.Item;

public class AppTest {

	public static void main(String[] args) throws Throwable {
		try (RPCServer server = new RPCServer("localhost", 9988)) {
			ITestService instance = new TestService();
			server.addService(ITestService.class, instance);
			server.start();

			long startTime = System.currentTimeMillis(); // 获取开始时间
			try (RPCClient client = new RPCClient()) {
				client.connect(new Address("localhost", 9988));
				ITestService remoteInstance = ProxyFactory.create(ITestService.class, client);

				int result = remoteInstance.receive(1, 2);
				System.out.println(" = " + result);
				long result2 = remoteInstance.receive(1L, 2L);
				System.out.println(" = " + result2);
				float result3 = remoteInstance.receive(0.2f, 0.3f);
				System.out.println(" = " + result3);
				boolean result4 = remoteInstance.receive(true, true);
				System.out.println(" = " + result4);
				char result5 = remoteInstance.receive('a', 'D');
				System.out.println(" = " + result5);
				String result6 = remoteInstance.receive("wang", "gang");
				System.out.println(" = " + result6);
				double result7 = remoteInstance.receive(0.20, 0.30);
				System.out.println(" = " + result7);
				Item a = new Item();
				a.setAge(12);
				a.setName("王");
				Item b = new Item();
				b.setAge(13);
				b.setName("刚");
				Item result8 = remoteInstance.receive(a, b);
				System.out.println(" = " + result8);
			}
			long endTime = System.currentTimeMillis(); // 获取结束时间
			System.out.println(endTime - startTime);

			server.hang();
		}
	}
}
