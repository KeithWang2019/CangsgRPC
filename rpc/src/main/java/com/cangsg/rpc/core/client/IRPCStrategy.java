package com.cangsg.rpc.core.client;

import com.cangsg.rpc.core.proto.Address;
import com.cangsg.rpc.core.proto.Book;

public abstract class IRPCStrategy {
	protected final Book ownBook;

	public IRPCStrategy(Book ownBook) {
		this.ownBook = ownBook;
	}

	protected abstract Address fix(String interfaceClassName);

	public Address fixed(String interfaceClassName) {
		Address address = fix(interfaceClassName);
		System.out.println("选择:" + address);
		return address;
	}

	public Book getOwnBook() {
		return ownBook;
	}
}