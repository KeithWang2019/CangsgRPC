package com.cangsg.rpc.core.client;

import java.util.concurrent.CompletableFuture;

import com.cangsg.rpc.core.proto.ProtoInfo.PulseMessage;
import com.cangsg.rpc.core.proto.ProtoInfo.PulseMessage.DataType;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;

public class RPCClientHandler extends SimpleChannelInboundHandler<PulseMessage> {

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, PulseMessage msg) throws Exception {
        if (msg.getDataType() == DataType.Response) {
            CompletableFuture<PulseMessage> completableFuture = RPCClient.pendingCompletableFuture
                    .get(msg.getMessageId());
            if (completableFuture != null) {
                completableFuture.complete(msg);
            }
        }
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        super.channelInactive(ctx);
    }

    @Override
    public void channelUnregistered(ChannelHandlerContext ctx) throws Exception {
        super.channelUnregistered(ctx);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        System.out.println(cause.getMessage());
    }

}