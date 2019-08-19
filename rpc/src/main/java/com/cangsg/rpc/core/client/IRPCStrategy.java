package com.cangsg.rpc.core.client;

import com.cangsg.rpc.core.proto.Address;

public abstract class IRPCStrategy {
	protected abstract Address fix(String interfaceClassName);

	public Address fixed(String interfaceClassName) {
		Address address = fix(interfaceClassName);
		System.out.println("选择:" + address);
		return address;
	}
}