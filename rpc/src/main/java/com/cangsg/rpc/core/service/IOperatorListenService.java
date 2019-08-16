package com.cangsg.rpc.core.service;

import java.util.List;

import com.cangsg.rpc.core.proto.Address;
import com.cangsg.rpc.core.proto.Book;

public interface IOperatorListenService {
	public void register(List<String> interfaceList, Address localAddress);

	public Book obtain(List<String> remoteServiceList);
}
