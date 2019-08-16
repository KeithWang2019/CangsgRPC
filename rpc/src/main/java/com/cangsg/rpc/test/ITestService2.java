package com.cangsg.rpc.test;

import com.cangsg.rpc.test.pojo.Item;

public interface ITestService2 {
	public int receive(int a, int b);

	public long receive(long a, long b);

	public float receive(float a, float b);

	public boolean receive(boolean a, boolean b);

	public char receive(char a, char b);

	public String receive(String a, String b);	
	
	public Item receive(Item a,Item b);
	
	public double receive(double a, double b);
}