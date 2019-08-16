package com.cangsg.rpc.core.proxy;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.cangsg.rpc.core.RPCUtil;
import com.cangsg.rpc.core.client.IRPCStrategy;
import com.cangsg.rpc.core.client.RPCClient;
import com.cangsg.rpc.core.client.RPCClientPool;
import com.cangsg.rpc.core.proto.ProtoInfo.Parameter;
import com.cangsg.rpc.core.proto.ProtoInfo.Request;
import com.cangsg.rpc.core.proto.ProtoInfo.Response;
import com.google.protobuf.ByteString;

public class RemoteObject<T> implements InvocationHandler {
	private static final Logger logger = LoggerFactory.getLogger(RemoteObject.class);

	private String interfaceClassName;
	private RPCClient client = null; // 单连接模式不为空
	private IRPCStrategy iRPCStrategy; // 中心模式不为空

	public RemoteObject(Class<T> interfaceClass, RPCClient client) {
		this.interfaceClassName = interfaceClass.getName();
		this.client = client;
	}

	public RemoteObject(Class<T> interfaceClass, IRPCStrategy iRPCStrategy) {
		this.interfaceClassName = interfaceClass.getName();
		this.iRPCStrategy = iRPCStrategy;
	}

	@Override
	public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
		try {
			Request.Builder requestBuilder = Request.newBuilder();
			requestBuilder.setClassName(interfaceClassName);
			requestBuilder.setMethodName(interfaceClassName + "#" + method.getName()
					+ RPCUtil.splicingClassName(method.getParameterTypes()));

			System.out.print("client --> " + method.getName() + "(");

			Class<?>[] parameterTypes = method.getParameterTypes();
			for (int i = 0; i < parameterTypes.length; i++) {
				Parameter.Builder parameterBuilder = Parameter.newBuilder();

				if (i > 0) {
					System.out.print(",");
				}

				switch (parameterTypes[i].getSimpleName()) {
				case "String":
					System.out.print(parameterTypes[i].getSimpleName() + ":" + (String) args[i]);
					parameterBuilder.setDataType(Parameter.DataType.String).setStringBody((String) args[i]);
					break;
				case "double":
					System.out.print(parameterTypes[i].getSimpleName() + ":" + (double) args[i]);
					parameterBuilder.setDataType(Parameter.DataType.Double).setDoubleBody((double) args[i]);
					break;
				case "float":
					System.out.print(parameterTypes[i].getSimpleName() + ":" + (float) args[i]);
					parameterBuilder.setDataType(Parameter.DataType.Float).setFloatBody((float) args[i]);
					break;
				case "int":
					System.out.print(parameterTypes[i].getSimpleName() + ":" + (int) args[i]);
					parameterBuilder.setDataType(Parameter.DataType.Int).setInt32Body((int) args[i]);
					break;
				case "long":
					System.out.print(parameterTypes[i].getSimpleName() + ":" + (long) args[i]);
					parameterBuilder.setDataType(Parameter.DataType.Long).setInt64Body((long) args[i]);
					break;
				case "boolean":
					System.out.print(parameterTypes[i].getSimpleName() + ":" + (boolean) args[i]);
					parameterBuilder.setDataType(Parameter.DataType.Bool).setBoolBody((boolean) args[i]);
					break;
				case "char":
					System.out.print(parameterTypes[i].getSimpleName() + ":" + args[i].toString());
					parameterBuilder.setDataType(Parameter.DataType.Char).setStringBody(args[i].toString());
					break;
				default:
					System.out.print(parameterTypes[i].getSimpleName() + ":" + args[i]);
					parameterBuilder.setClassName(parameterTypes[i].getName());
					parameterBuilder.setDataType(Parameter.DataType.ByteString)
							.setBytesBody(ByteString.copyFrom(RPCUtil.serialize(args[i])));
					break;
				}
				requestBuilder.addParameterTypes(parameterBuilder.build());
			}

			System.out.println(")");

			Response response = null;
			if (this.client != null) {
				requestBuilder.setVersion(-1);
				response = client.send(requestBuilder.build());
			} else {
				requestBuilder.setVersion(RPCUtil.getOwnBook().getVersion());
				RPCClient anyClient = null;
				try {
					anyClient = RPCClientPool.poll(interfaceClassName, iRPCStrategy);
					response = anyClient.send(requestBuilder.build());
				} catch (Throwable t) {
					logger.error(t.toString());
					throw t;
				} finally {
					if (anyClient != null) {
						RPCClientPool.free(anyClient);
					}
				}
			}

			if (response.getStatus() == Response.MessageType.Success) {
				switch (response.getDataType()) {
				case String:
					System.out.println("client <-- String:" + response.getStringBody());
					return response.getStringBody();
				case Double:
					System.out.println("client <-- Double:" + response.getDoubleBody());
					return response.getDoubleBody();
				case Float:
					System.out.println("client <-- Float:" + response.getFloatBody());
					return response.getFloatBody();
				case Int:
					System.out.println("client <-- Int:" + response.getInt32Body());
					return response.getInt32Body();
				case Long:
					System.out.println("client <-- Long:" + response.getInt64Body());
					return response.getInt64Body();
				case Bool:
					System.out.println("client <-- Bool:" + response.getBoolBody());
					return response.getBoolBody();
				case Char:
					System.out.println("client <-- Char:" + response.getStringBody().charAt(0));
					return response.getStringBody().charAt(0);
				case ByteString:
					System.out.println("client <-- Object:【二进制内容】");
					return RPCUtil.deserialize(response.getBytesBody().toByteArray());
				default:
					return null;
				}
			} else {
				throw new Exception("client <-- Error:【" + response.getError() + "】");
			}
		} catch (Throwable e) {
			logger.error("remoteObject", e);
			throw e;
		}
	}

}