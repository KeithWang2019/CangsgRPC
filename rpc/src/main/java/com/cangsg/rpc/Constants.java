package com.cangsg.rpc;

public interface Constants {
	int IO_THREADS = Math.min(Runtime.getRuntime().availableProcessors() + 1, 32);
	int HEARTBEAT = 60 * 1000;
	int CONNECT_TIME = 200 * 1000;
	int CONNECT_COUNT = 200;
	int GET_TIME = 300 * 1000;
	int WORK_THREADS = 16;
}