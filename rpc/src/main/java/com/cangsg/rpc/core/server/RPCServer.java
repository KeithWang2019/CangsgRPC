package com.cangsg.rpc.core.server;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import com.cangsg.rpc.Constants;
import com.cangsg.rpc.core.RPCException;
import com.cangsg.rpc.core.RPCUtil;
import com.cangsg.rpc.core.proto.ProtoInfo.PulseMessage;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.protobuf.ProtobufDecoder;
import io.netty.handler.codec.protobuf.ProtobufEncoder;
import io.netty.handler.codec.protobuf.ProtobufVarint32FrameDecoder;
import io.netty.handler.codec.protobuf.ProtobufVarint32LengthFieldPrepender;
import io.netty.handler.timeout.IdleStateHandler;
import io.netty.util.concurrent.DefaultThreadFactory;

public class RPCServer implements AutoCloseable {
	private ServerBootstrap bootstrap;
	private EventLoopGroup bossGroup;
	private EventLoopGroup workerGroup;
	private Channel channel;
	RPCServerHandler rpcServerHandler;

	private String host;
	private int port;
	private int nThreads;

	public RPCServer(String host, int port) {
		this.host = host;
		this.port = port;
		this.nThreads = Constants.IO_THREADS;

		this.init();
	}

	public RPCServer(String host, int port, int nThreads) {
		this.host = host;
		this.port = port;
		this.nThreads = nThreads;

		this.init();
	}

	private void init() {
		bootstrap = new ServerBootstrap();

		rpcServerHandler = new RPCServerHandler(this);

		bossGroup = new NioEventLoopGroup(1, new DefaultThreadFactory("NettyServerBoss", true));
		workerGroup = new NioEventLoopGroup(this.nThreads, new DefaultThreadFactory("NettyServerWorker", true));

		bootstrap.group(bossGroup, workerGroup).channel(NioServerSocketChannel.class)
				.childOption(ChannelOption.TCP_NODELAY, true).childOption(ChannelOption.SO_REUSEADDR, true)
				.childHandler(new ChannelInitializer<SocketChannel>() {

					@Override
					protected void initChannel(SocketChannel ch) throws Exception {
						ChannelPipeline pipeline = ch.pipeline();

						pipeline.addLast(new ProtobufVarint32FrameDecoder());
						pipeline.addLast(new ProtobufDecoder(PulseMessage.getDefaultInstance()));
						pipeline.addLast(new ProtobufVarint32LengthFieldPrepender());
						pipeline.addLast(new ProtobufEncoder());
						pipeline.addLast(new IdleStateHandler(0, 0, Constants.HEARTBEAT, TimeUnit.MILLISECONDS));

						pipeline.addLast(rpcServerHandler);
					}

				});
	}

	public void start() throws RPCException {
		ChannelFuture channelFuture;
		try {
			channelFuture = bootstrap.bind(this.host, this.port).sync();
		} catch (Throwable e) {
			throw new RPCException(e);
		}
		channel = channelFuture.channel();
		System.out.println("启动服务" + this.host + ":" + this.port);
	}

	public void hang() throws RPCException {
		System.out.println("监听开始");
		try {
			channel.closeFuture().sync();
		} catch (Throwable e) {
			throw new RPCException(e);
		}
	}

	@Override
	public void close() {
		if (channel != null) {
			channel.close();
		}
		ChannelGroup channelGroup = rpcServerHandler.getChannelGroup();
		channelGroup.close().syncUninterruptibly();
		if (bootstrap != null) {
			bossGroup.shutdownGracefully();
			workerGroup.shutdownGracefully();
		}
	}

	protected Map<String, Object> serviceInstanceMap = new HashMap<>();
	protected Map<String, Method> serviceMethodMap = new HashMap<>();

	public <T> void addService(Class<T> interfaceClass, T instance) {
		String interfaceName = interfaceClass.getName();
		serviceInstanceMap.put(interfaceName, instance);

		for (Method method : interfaceClass.getMethods()) {
			method.setAccessible(true);
			serviceMethodMap.put(
					interfaceName + "#" + method.getName() + RPCUtil.splicingClassName(method.getParameterTypes()),
					method);
		}
	}

}