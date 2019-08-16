package com.cangsg.rpc.core;

public interface CallBack<T> {
	void invoke(T result) throws RPCException;
}
