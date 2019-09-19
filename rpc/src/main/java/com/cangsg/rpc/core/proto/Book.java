package com.cangsg.rpc.core.proto;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Book implements Serializable {
	private static final long serialVersionUID = 1L;

	private long version;

	public long getVersion() {
		return version;
	}

	public void setVersion(long version) {
		this.version = version;
	}

	private Map<String, List<Address>> addressesMap = new HashMap<>();

	public Map<String, List<Address>> getAddressesMap() {
		return addressesMap;
	}

	public void setAddressesMap(Map<String, List<Address>> addressesMap) {
		this.addressesMap = addressesMap;
	}

	public void refresh(Book book) {
		setVersion(book.getVersion());
		setAddressesMap(book.getAddressesMap());
	}
}
