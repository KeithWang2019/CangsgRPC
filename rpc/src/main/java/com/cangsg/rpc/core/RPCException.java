package com.cangsg.rpc.core;

public class RPCException extends Exception {
	private static final long serialVersionUID = 1L;

	public RPCException() {

	}

	public RPCException(String message) {
		super(message);
	}

	public RPCException(Throwable cause) {
		super(cause);
	}
}
