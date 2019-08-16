package com.cangsg.rpc.core.client;

import com.cangsg.rpc.core.proto.Address;

public interface IRPCStrategy {
	public Address fix(String interfaceClassName);
}