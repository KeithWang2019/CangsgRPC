package com.cangsg.rpc.core.service;

import java.util.List;

import com.cangsg.rpc.core.RPCException;
import com.cangsg.rpc.core.proto.Book;

public interface IConsumerListenService {
	public List<String> ask() throws RPCException;

	public void receive(Book subBook) throws RPCException;
}
