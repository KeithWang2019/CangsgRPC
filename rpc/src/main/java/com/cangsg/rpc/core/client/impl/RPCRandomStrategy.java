package com.cangsg.rpc.core.client.impl;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import com.cangsg.rpc.core.RPCUtil;
import com.cangsg.rpc.core.client.IRPCStrategy;
import com.cangsg.rpc.core.proto.Address;
import com.cangsg.rpc.core.proto.Node;

public class RPCRandomStrategy extends IRPCStrategy {
	private Random random = new Random();

	@Override
	protected Address fix(String interfaceClassName) {
		List<Address> addressList = RPCUtil.getOwnBook().getAddressesMap().get(interfaceClassName);
		if (addressList != null) {
			List<Address> noDisableAddressList = addressList.stream().filter((item) -> !item.isDisable())
					.collect(Collectors.toList());
			int noDisableNodesSize = noDisableAddressList.size();
			if (noDisableNodesSize > 0) {
				int index = random.nextInt(noDisableNodesSize);
				return noDisableAddressList.get(index);
			}
		}

		return null;
	}

}
