package com.cangsg.rpc.example;

import com.cangsg.rpc.core.client.RPCStrategyType;
import com.cangsg.rpc.core.proto.Address;
import com.cangsg.rpc.nerve.RPCConsumer;
import com.cangsg.rpc.nerve.RPCProducer;
import com.cangsg.rpc.test.ITestService;
import com.cangsg.rpc.test.impl.TestService;

public class RegistryBase {

	public static void main(String[] args) throws Throwable {
		Address center = new Address("127.0.0.1", 8898);

		try (RPCProducer rpcProducer = new RPCProducer("127.0.0.1", 8890)) {
			rpcProducer.addService(ITestService.class, new TestService());
			rpcProducer.register(center);

			try (RPCProducer rpcProducer2 = new RPCProducer("127.0.0.1", 8891)) {
				rpcProducer2.addService(ITestService.class, new TestService());
				rpcProducer2.register(center);

				try (RPCConsumer rpcProducer3 = new RPCConsumer("127.0.0.1", 8892)) {
					rpcProducer3.useService(ITestService.class);
					rpcProducer3.register(center);

					try {
						ITestService iTestService = rpcProducer3.proxyObject(ITestService.class,
								RPCStrategyType.RANDOM);

						for (int i = 0; i < 1000; i++) {
							int result = iTestService.receive(5, 6);
							int result2 = iTestService.receive(5, 7);
							System.out.println("结果" + i + "=" + result + " - " + result2);
						}
					} catch (Exception ex) {
						ex.printStackTrace();
					}					
				}

				rpcProducer2.hang();
			}
			
			System.out.println("======================================================");
			
			try (RPCProducer rpcProducer2 = new RPCProducer("127.0.0.1", 8891)) {
				rpcProducer2.addService(ITestService.class, new TestService());
				rpcProducer2.register(center);

				try (RPCConsumer rpcProducer3 = new RPCConsumer("127.0.0.1", 8892)) {
					rpcProducer3.useService(ITestService.class);
					rpcProducer3.register(center);

					try {
						ITestService iTestService = rpcProducer3.proxyObject(ITestService.class,
								RPCStrategyType.RANDOM);

						for (int i = 0; i < 1000; i++) {
							int result = iTestService.receive(5, 6);
							int result2 = iTestService.receive(5, 7);
							System.out.println("结果" + i + "=" + result + " - " + result2);
						}
					} catch (Exception ex) {
						ex.printStackTrace();
					}
				}				
			}
			
			System.out.println("======================================================");
		}
	}

}
