package com.cangsg.rpc.core;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.InetSocketAddress;

import com.cangsg.rpc.core.proto.Book;

public class RPCUtil {

	private RPCUtil() {
		throw new IllegalStateException("RPCUtil class");
	}

	private static Book ownBook;

	public static Book getOwnBook() {
		return ownBook;
	}

	public static void setOwnBook(Book book) {
		ownBook = book;
	}

	public static String toAddressString(InetSocketAddress address) {
		return address.getAddress().getHostAddress() + ":" + address.getPort();
	}

	public static String splicingClassName(Class<?>[] clazzes) {
		StringBuilder stringBuilder = new StringBuilder();
		for (Class<?> clazz : clazzes) {
			stringBuilder.append("," + clazz.getName());
		}
		return stringBuilder.toString();
	}

	public static <T> byte[] serialize(T obj) throws IOException {
		byte[] bytes = null;
		try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
			try (ObjectOutputStream sOut = new ObjectOutputStream(out)) {
				sOut.writeObject(obj);
				sOut.flush();
				bytes = out.toByteArray();
			}
		}
		return bytes;
	}

	@SuppressWarnings("unchecked")
	public static <T> T deserialize(byte[] bytes) throws IOException, ClassNotFoundException {
		if (bytes == null) {
			return null;
		}
		T t = null;
		try (ByteArrayInputStream in = new ByteArrayInputStream(bytes)) {
			try (ObjectInputStream sIn = new ObjectInputStream(in)) {
				t = (T) sIn.readObject();
			}
		}
		return t;
	}
}
