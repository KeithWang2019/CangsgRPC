package com.cangsg.rpc.core.client;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

import com.cangsg.rpc.Constants;
import com.cangsg.rpc.core.RPCException;
import com.cangsg.rpc.core.proto.Address;
import com.cangsg.rpc.core.proto.ProtoInfo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.protobuf.ProtobufDecoder;
import io.netty.handler.codec.protobuf.ProtobufEncoder;
import io.netty.handler.codec.protobuf.ProtobufVarint32FrameDecoder;
import io.netty.handler.codec.protobuf.ProtobufVarint32LengthFieldPrepender;
import io.netty.handler.timeout.TimeoutException;
import io.netty.util.concurrent.DefaultThreadFactory;

public class RPCClient implements AutoCloseable {
	private static final Logger logger = LoggerFactory.getLogger(RPCClient.class);

	private static final NioEventLoopGroup nioEventLoopGroup = new NioEventLoopGroup(Constants.IO_THREADS,
			new DefaultThreadFactory("NettyClientWorker", true));

	private Bootstrap bootstrap;
	private Channel channel;

	private Address address;

	public Address getAddress() {
		return address;
	}

	private static final AtomicLong pulseCount = new AtomicLong(0);

	protected static ConcurrentHashMap<Long, CompletableFuture<ProtoInfo.PulseMessage>> pendingCompletableFuture = new ConcurrentHashMap<>();

	public RPCClient() {
		this.init();
	}

	private void init() {
		bootstrap = new Bootstrap();
		bootstrap.group(nioEventLoopGroup).channel(NioSocketChannel.class).option(ChannelOption.SO_KEEPALIVE, true)
				.option(ChannelOption.TCP_NODELAY, true);
		bootstrap.handler(new ChannelInitializer<SocketChannel>() {

			@Override
			protected void initChannel(SocketChannel ch) throws Exception {
				ChannelPipeline pipeline = ch.pipeline();

				pipeline.addLast(new ProtobufVarint32FrameDecoder());
				pipeline.addLast(new ProtobufDecoder(ProtoInfo.PulseMessage.getDefaultInstance()));
				pipeline.addLast(new ProtobufVarint32LengthFieldPrepender());
				pipeline.addLast(new ProtobufEncoder());

				pipeline.addLast(new RPCClientHandler());
			}

		});
	}

	public void connect(Address address) throws RPCException {
		long startTime = System.currentTimeMillis(); // 获取开始时间

		this.address = address;
		ChannelFuture future = bootstrap.connect(address.getHost(), address.getPort());
		boolean result = future.awaitUninterruptibly(Constants.CONNECT_TIME, TimeUnit.MILLISECONDS);
		if (result && future.isSuccess()) {

			Channel newChannel = future.channel();
			Channel oldChannel = this.channel;
			if (oldChannel != null) {
				oldChannel.close();
			}
			this.channel = newChannel;
		} else {
			this.address.setDisable(true);
			logger.error("连接超时");
			throw new RPCException("连接超时");
		}

		this.address.setConnectTime(System.currentTimeMillis() - startTime);
	}

	@Override
	public void close() {
		// can't shutdown nioEventLoopGroup because the method will be invoked when
		// closing one channel but not a client,
		// but when and how to close the nioEventLoopGroup ?
		// nioEventLoopGroup.shutdownGracefully();
		if (this.channel != null) {
			try {
				this.channel.close().sync();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

	public ProtoInfo.Response send(ProtoInfo.Request request) throws Throwable {
		long startTime = System.currentTimeMillis(); // 获取开始时间
		long messageId = pulseCount.incrementAndGet();

		try {
			CompletableFuture<ProtoInfo.PulseMessage> completableFuture = new CompletableFuture<>();
			pendingCompletableFuture.put(messageId, completableFuture);

			ProtoInfo.PulseMessage message = ProtoInfo.PulseMessage.newBuilder().setMessageId(messageId)
					.setDataType(ProtoInfo.PulseMessage.DataType.Request).setRequest(request).build();

			if (this.channel.isActive()) {
				this.channel.writeAndFlush(message);
			} else {
				connect(this.address);
				this.channel.writeAndFlush(message);
			}

			return completableFuture.get(Constants.GET_TIME, TimeUnit.MILLISECONDS).getResponse();
		} catch (ExecutionException | TimeoutException ex) {
			logger.error("可能异常", ex);
			throw ex;
		} catch (InterruptedException ex) {
			logger.error("中止异常", ex);
			Thread.currentThread().interrupt();
		} finally {
			this.address.setSendTime(System.currentTimeMillis() - startTime);
			pendingCompletableFuture.remove(messageId);
		}
		return null;
	}

	public boolean isActive() {
		if (this.channel != null) {
			return this.channel.isActive();
		}
		return false;
	}

}