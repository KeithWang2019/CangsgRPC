package com.cangsg.rpc.nerve;

import com.cangsg.rpc.core.proto.NodeType;

public class RPCConsumer extends RPCBase {

	public RPCConsumer(String host, int port) {
		super(host, port, 1, NodeType.Client);
	}

}
