package com.cangsg.rpc.core.client.impl;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import com.cangsg.rpc.core.RPCUtil;
import com.cangsg.rpc.core.client.IRPCStrategy;
import com.cangsg.rpc.core.proto.Address;
import com.cangsg.rpc.core.proto.Node;

public class RPCRandomStrategy implements IRPCStrategy {
	private Random random = new Random();

	@Override
	public Address fix(String interfaceClassName) {
		Node node = RPCUtil.getOwnBook().getNodeMap().get(interfaceClassName);
		if (node != null) {
			List<Address> noDisableAddresses = node.getAddressList().stream().filter((item) -> !item.isDisable())
					.collect(Collectors.toList());
			int noDisableAddressesSize = noDisableAddresses.size();
			if (noDisableAddressesSize > 0) {
				int index = random.nextInt(noDisableAddressesSize);
				Address selectAddress = noDisableAddresses.get(index);
				System.out.println(selectAddress);
				return selectAddress;
			}
		}

		return null;
	}

}
