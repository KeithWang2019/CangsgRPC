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
			requestBuilder.setMethodName(interfaceClassName + "#" + method.getName() + "("
					+ RPCUtil.splicingClassName(method.getParameterTypes()) + ")");

			System.out.println("client:start --> " + method.getName() + "(" + RPCUtil.splicingArgs(args) + ")");

			Class<?>[] parameterTypes = method.getParameterTypes();
			for (int i = 0; i < parameterTypes.length; i++) {
				Parameter.Builder parameterBuilder = Parameter.newBuilder();

				switch (parameterTypes[i].getSimpleName()) {
				case "String":
					parameterBuilder.setDataType(Parameter.DataType.String).setStringBody((String) args[i]);
					break;
				case "double":
					parameterBuilder.setDataType(Parameter.DataType.Double).setDoubleBody((double) args[i]);
					break;
				case "float":
					parameterBuilder.setDataType(Parameter.DataType.Float).setFloatBody((float) args[i]);
					break;
				case "int":
					parameterBuilder.setDataType(Parameter.DataType.Int).setInt32Body((int) args[i]);
					break;
				case "long":
					parameterBuilder.setDataType(Parameter.DataType.Long).setInt64Body((long) args[i]);
					break;
				case "boolean":
					parameterBuilder.setDataType(Parameter.DataType.Bool).setBoolBody((boolean) args[i]);
					break;
				case "char":
					parameterBuilder.setDataType(Parameter.DataType.Char).setStringBody(args[i].toString());
					break;
				default:
					parameterBuilder.setClassName(parameterTypes[i].getName());
					parameterBuilder.setDataType(Parameter.DataType.ByteString)
							.setBytesBody(ByteString.copyFrom(RPCUtil.serialize(args[i])));
					break;
				}
				requestBuilder.addParameterTypes(parameterBuilder.build());
			}

			Response response = null;
			if (this.client != null) {
				response = client.send(requestBuilder.build());
			} else {
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

			System.out.print("client:end <-- " + method.getName() + "(");

			if (response.getStatus() == Response.MessageType.Success) {
				Object result;

				switch (response.getDataType()) {
				case String:
					result = response.getStringBody();
					break;
				case Double:
					result = response.getDoubleBody();
					break;
				case Float:
					result = response.getFloatBody();
					break;
				case Int:
					result = response.getInt32Body();
					break;
				case Long:
					result = response.getInt64Body();
					break;
				case Bool:
					result = response.getBoolBody();
					break;
				case Char:
					result = response.getStringBody().charAt(0);
					break;
				case ByteString:
					result = RPCUtil.deserialize(response.getBytesBody().toByteArray());
					break;
				default:
					result = null;
					break;
				}
				System.out.println(response.getDataType() + ":" + result + ")");
				return result;
			} else {
				throw new Exception("client <-- Error:【" + response.getError() + "】");
			}
		} catch (Throwable e) {
			logger.error("remoteObject", e);
			throw e;
		}
	}

}