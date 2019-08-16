package com.cangsg.rpc.nerve.service;

import java.util.List;

import com.cangsg.rpc.core.CallBack;
import com.cangsg.rpc.core.CallBackResult;
import com.cangsg.rpc.core.RPCException;
import com.cangsg.rpc.core.proto.Book;
import com.cangsg.rpc.core.service.IConsumerListenService;

public class ConsumerListenService implements IConsumerListenService {
	CallBack<Book> callBack;
	CallBackResult<List<String>> callBackResult;

	public ConsumerListenService(CallBack<Book> callBack, CallBackResult<List<String>> callBackResult) {
		this.callBack = callBack;
		this.callBackResult = callBackResult;
	}

	@Override
	public List<String> ask() throws RPCException {
		return this.callBackResult.invoke();
	}

	@Override
	public void receive(Book subBook) throws RPCException {
		this.callBack.invoke(subBook);
	}

}
