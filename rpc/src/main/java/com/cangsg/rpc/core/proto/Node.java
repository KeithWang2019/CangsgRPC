package com.cangsg.rpc.core.proto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Node implements Serializable {
	private static final long serialVersionUID = 1L;

	private Address address;

	private List<String> interfaceNames;

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((address == null) ? 0 : address.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj == null) {
			return false;
		}
		if (obj instanceof Node) {
			return this.address.equals(((Node) obj).address);
		}
		return false;
	}

	private NodeType nodeType;

	private NodeState nodeState;

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public NodeType getNodeType() {
		return nodeType;
	}

	public void setNodeType(NodeType nodeType) {
		this.nodeType = nodeType;
	}

	public List<String> getInterfaceNames() {
		return interfaceNames;
	}

	public void setInterfaceNames(List<String> interfaceNames) {
		this.interfaceNames = interfaceNames;
	}

	public NodeState getNodeState() {
		return nodeState;
	}

	public void setNodeState(NodeState nodeState) {
		this.nodeState = nodeState;
	}

	@Override
	public String toString() {
		return address.toString();
	}

}
