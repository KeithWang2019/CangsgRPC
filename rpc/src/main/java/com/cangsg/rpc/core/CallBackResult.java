package com.cangsg.rpc.core;

public interface CallBackResult<T> {
	T invoke() throws RPCException;
}
