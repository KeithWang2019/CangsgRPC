package com.cangsg.rpc.core.service;

import com.cangsg.rpc.core.proto.Node;

public interface IOperatorListenService {
	public void register(Node node);

	public void unRegister(Node node);
}
