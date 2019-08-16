package com.cangsg.rpc.test.impl;

import com.cangsg.rpc.test.ITestService;
import com.cangsg.rpc.test.pojo.Item;

public class TestService implements ITestService {

	@Override
	public int receive(int a, int b) {
		return a + b;
	}

	@Override
	public long receive(long a, long b) {
		return a + b;
	}

	@Override
	public float receive(float a, float b) {
		return a + b;
	}

	@Override
	public boolean receive(boolean a, boolean b) {
		return a && b;
	}

	@Override
	public char receive(char a, char b) {
		return a;
	}

	@Override
	public String receive(String a, String b) {
		return a + ":" + b;
	}

	@Override
	public Item receive(Item a, Item b) {
		Item item = new Item();
		item.setAge(a.getAge() + b.getAge());
		item.setName(a.getName() + b.getName());
		return item;
	}

	@Override
	public double receive(double a, double b) {
		return a + b;
	}

}