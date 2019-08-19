package com.cangsg.rpc.core.server;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.cangsg.rpc.Constants;
import com.cangsg.rpc.core.RPCUtil;
import com.cangsg.rpc.core.proto.ProtoInfo.*;
import com.cangsg.rpc.core.proto.ProtoInfo.PulseMessage.DataType;
import com.google.protobuf.ByteString;

import io.netty.channel.Channel;
import io.netty.channel.ChannelHandler.Sharable;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.util.concurrent.GlobalEventExecutor;

@Sharable
public class RPCServerHandler extends SimpleChannelInboundHandler<PulseMessage> {
	private static final Logger logger = LoggerFactory.getLogger(RPCServerHandler.class);

	private ThreadPoolExecutor handlerThreadPoolExecutor = new ThreadPoolExecutor(Constants.WORK_THREADS,
			Constants.WORK_THREADS * 2, 600L, TimeUnit.SECONDS, new ArrayBlockingQueue<Runnable>(65536));

	RPCServer rpcServer;

	ChannelGroup channelGroup = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);

	public ChannelGroup getChannelGroup() {
		return channelGroup;
	}

	public ThreadPoolExecutor getHandlerThreadPoolExecutor() {
		return handlerThreadPoolExecutor;
	}

	public RPCServerHandler(RPCServer rpcServer) {
		this.rpcServer = rpcServer;
	}

	@Override
	public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
		Channel channel = ctx.channel();
		channelGroup.add(channel);
	}

	private void handle(Runnable task) {
		handlerThreadPoolExecutor.execute(task);
	}

	@Override
	protected void channelRead0(ChannelHandlerContext ctx, PulseMessage msg) throws Exception {
		if (msg.getDataType() == DataType.Request) {
			handle(() -> {
				try {
					Request request = msg.getRequest();
					String className = request.getClassName();
					String methodName = request.getMethodName();
					List<Parameter> list = request.getParameterTypesList();
					List<Object> parametersValue = new ArrayList<>();

					System.out.println("server <-- " + methodName);

					for (int i = 0; i < list.size(); i++) {
						Parameter item = list.get(i);

						switch (item.getDataType()) {
						case String:
							parametersValue.add(item.getStringBody());
							break;
						case Double:
							parametersValue.add(item.getDoubleBody());
							break;
						case Float:
							parametersValue.add(item.getFloatBody());
							break;
						case Int:
							parametersValue.add(item.getInt32Body());
							break;
						case Long:
							parametersValue.add(item.getInt64Body());
							break;
						case Bool:
							parametersValue.add(item.getBoolBody());
							break;
						case Char:
							parametersValue.add(item.getStringBody().charAt(0));
							break;
						default:
							parametersValue.add(RPCUtil.deserialize(item.getBytesBody().toByteArray()));
							break;
						}
					}

					Response.Builder responseBuilder = Response.newBuilder();

					Object instance = this.rpcServer.serviceInstanceMap.get(className);
					if (instance != null) {
						Method method = this.rpcServer.serviceMethodMap.get(methodName);
						if (method != null) {
							Object obj = method.invoke(instance, parametersValue.toArray());

							switch (method.getReturnType().getSimpleName()) {
							case "String":
								responseBuilder.setDataType(Response.DataType.String).setStringBody((String) obj);
								break;
							case "double":
								responseBuilder.setDataType(Response.DataType.Double).setDoubleBody((double) obj);
								break;
							case "float":
								responseBuilder.setDataType(Response.DataType.Float).setFloatBody((float) obj);
								break;
							case "int":
								responseBuilder.setDataType(Response.DataType.Int).setInt32Body((int) obj);
								break;
							case "long":
								responseBuilder.setDataType(Response.DataType.Long).setInt64Body((long) obj);
								break;
							case "boolean":
								responseBuilder.setDataType(Response.DataType.Bool).setBoolBody((boolean) obj);
								break;
							case "char":
								responseBuilder.setDataType(Response.DataType.Char).setStringBody(obj.toString());
								break;
							default:
								responseBuilder.setDataType(Response.DataType.ByteString)
										.setBytesBody(ByteString.copyFrom(RPCUtil.serialize(obj)));
								break;
							}
							responseBuilder.setStatus(Response.MessageType.Success);

							System.out.println("server --> " + method.getReturnType().getSimpleName() + ":" + obj);
						} else {
							responseBuilder.setStatus(Response.MessageType.Error)
									.setError("服务" + className + "中的，" + methodName + "方法不存在");
						}
					} else {
						responseBuilder.setStatus(Response.MessageType.Error).setError("服务" + className + "不存在");
					}

					if (request.getVersion() == -1) {
						responseBuilder.setVersion(-1);
					} else {
						responseBuilder.setVersion(RPCUtil.getOwnBook().getVersion());
					}

					PulseMessage pulseMessage = PulseMessage.newBuilder().setMessageId(msg.getMessageId())
							.setDataType(PulseMessage.DataType.Response).setResponse(responseBuilder.build()).build();
					ctx.writeAndFlush(pulseMessage);
				} catch (Exception ex) {
					logger.error(ex.getMessage());
				}
			});
		}
	}

	@Override
	public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
		ctx.close();
		logger.error(cause.getMessage());
	}

}